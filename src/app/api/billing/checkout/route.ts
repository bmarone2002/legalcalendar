import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/db/user";
import { getStripeServerClient } from "@/lib/billing/stripe";

const checkoutSchema = z.object({
  billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
  trialDays: z.number().int().min(0).max(90).optional(),
});

function resolvePriceId(billingCycle: "monthly" | "yearly"): string {
  const priceMonthly = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const priceYearly = process.env.STRIPE_PRICE_PRO_YEARLY;

  if (billingCycle === "monthly") {
    if (!priceMonthly) throw new Error("Variabile STRIPE_PRICE_PRO_MONTHLY mancante");
    return priceMonthly;
  }

  if (!priceYearly) throw new Error("Variabile STRIPE_PRICE_PRO_YEARLY mancante");
  return priceYearly;
}

function isNoSuchCustomerError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { code?: string; message?: string };
  const message = maybeError.message ?? "";
  return maybeError.code === "resource_missing" || message.includes("No such customer");
}

function buildCheckoutSessionParams(
  stripeCustomerId: string,
  priceId: string,
  appUrl: string,
  user: Awaited<ReturnType<typeof getOrCreateDbUser>>,
  billingCycle: "monthly" | "yearly",
  trialDays?: number
) {
  const hasTrial = trialDays != null && trialDays > 0;

  return {
    mode: "subscription" as const,
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    billing_address_collection: "auto" as const,
    consent_collection: {
      terms_of_service: "required" as const,
    },
    custom_text: {
      terms_of_service_acceptance: {
        message:
          "Confermando il checkout accetti i Termini di Servizio e le Condizioni di Abbonamento di Agenda Legale.",
      },
    },
    payment_method_collection: hasTrial ? ("if_required" as const) : ("always" as const),
    success_url: `${appUrl}/?checkout=success`,
    cancel_url: `${appUrl}/?checkout=cancelled`,
    subscription_data: {
      ...(hasTrial
        ? {
            trial_period_days: trialDays,
            trial_settings: {
              end_behavior: {
                missing_payment_method: "cancel" as const,
              },
            },
          }
        : {}),
      metadata: {
        userId: user.id,
        clerkUserId: user.clerkUserId,
        billingCycle,
      },
    },
    metadata: {
      userId: user.id,
      clerkUserId: user.clerkUserId,
    },
  };
}

export async function POST(req: Request) {
  try {
    const payload = checkoutSchema.parse(await req.json().catch(() => ({})));
    const user = await getOrCreateDbUser();
    const stripe = getStripeServerClient();
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin ?? "http://localhost:3000";

    async function createAndPersistCustomer() {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { userId: user.id, clerkUserId: user.clerkUserId },
      });
      const stripeCustomerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId },
      });
      return stripeCustomerId;
    }

    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      stripeCustomerId = await createAndPersistCustomer();
    }

    if (!stripeCustomerId) {
      throw new Error("Impossibile creare il cliente Stripe");
    }

    const priceId = resolvePriceId(payload.billingCycle);
    const ensuredStripeCustomerId = stripeCustomerId;
    let session;
    try {
      session = await stripe.checkout.sessions.create(
        buildCheckoutSessionParams(
          ensuredStripeCustomerId,
          priceId,
          appUrl,
          user,
          payload.billingCycle,
          payload.trialDays
        )
      );
    } catch (error) {
      if (!isNoSuchCustomerError(error)) throw error;
      // Customer ID belongs to another Stripe environment (test/live mismatch): recreate safely.
      stripeCustomerId = await createAndPersistCustomer();
      if (!stripeCustomerId) {
        throw new Error("Impossibile ricreare il cliente Stripe");
      }

      const recoveredStripeCustomerId = stripeCustomerId;
      session = await stripe.checkout.sessions.create(
        buildCheckoutSessionParams(
          recoveredStripeCustomerId,
          priceId,
          appUrl,
          user,
          payload.billingCycle,
          payload.trialDays
        )
      );
    }

    return NextResponse.json({
      success: true,
      data: { checkoutUrl: session.url, sessionId: session.id },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore creazione checkout";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
