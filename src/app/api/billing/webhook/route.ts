import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { derivePlanFromPriceId, mapStripeStatus } from "@/lib/billing/subscription";
import { getStripeServerClient } from "@/lib/billing/stripe";
import { getRequestId, logApiEvent, withRequestIdHeaders } from "@/lib/server/request-context";

export const runtime = "nodejs";

function toDateOrNull(unixSeconds: number | null | undefined): Date | null {
  if (!unixSeconds) return null;
  return new Date(unixSeconds * 1000);
}

async function findUserForSubscription(
  subscription: {
    customer: string | { id?: string } | null;
    metadata?: Record<string, string>;
  }
): Promise<{ id: string } | null> {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;

  if (customerId) {
    const byCustomer = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });
    if (byCustomer) return byCustomer;
  }

  const metadataUserId = subscription.metadata?.userId;
  if (!metadataUserId) return null;

  return prisma.user.findUnique({
    where: { id: metadataUserId },
    select: { id: true },
  });
}

async function syncSubscription(subscription: any) {
  const user = await findUserForSubscription(subscription);
  if (!user) {
    console.warn("Webhook Stripe: utente non trovato per subscription", subscription.id);
    return;
  }

  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price?.id ?? null;
  const mappedStatus = mapStripeStatus(subscription.status);
  const nextPlan = derivePlanFromPriceId(priceId);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      stripeCustomerId: customerId ?? undefined,
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
      subscriptionStatus: mappedStatus,
      currentPlan: mappedStatus === "canceled" ? "free" : nextPlan,
      trialEndsAt: toDateOrNull(subscription.trial_end),
    },
  });
}

function isUniqueConstraintError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  return (error as { code?: string }).code === "P2002";
}

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  let processedStripeEventId: string | null = null;

  if (!secret) {
    return withRequestIdHeaders(
      NextResponse.json({ success: false, error: "STRIPE_WEBHOOK_SECRET mancante" }, { status: 500 }),
      requestId
    );
  }
  if (!signature) {
    return withRequestIdHeaders(
      NextResponse.json({ success: false, error: "Header stripe-signature mancante" }, { status: 400 }),
      requestId
    );
  }

  try {
    const payload = await req.text();
    const stripe = getStripeServerClient();
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    const stripeEventId = event.id as string;
    const eventType = event.type;
    processedStripeEventId = stripeEventId;

    try {
      await prisma.stripeWebhookEvent.create({
        data: {
          stripeEventId,
          eventType,
          status: "received",
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        // Stripe retries webhook delivery: ignore already processed events.
        logApiEvent("info", "billing.webhook.duplicate", { requestId, stripeEventId, eventType });
        return withRequestIdHeaders(NextResponse.json({ success: true, duplicate: true }), requestId);
      }
      throw error;
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as {
          mode?: string;
          subscription?: string | { id?: string } | null;
        };
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
          await syncSubscription(subscription);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await syncSubscription(subscription);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as { subscription?: string | { id?: string } | null };
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id;
        if (subscriptionId) {
          await prisma.user.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: { subscriptionStatus: "past_due" },
          });
        }
        break;
      }
      default:
        break;
    }

    await prisma.stripeWebhookEvent.update({
      where: { stripeEventId },
      data: {
        status: "processed",
        processedAt: new Date(),
        errorMessage: null,
      },
    });

    logApiEvent("info", "billing.webhook.processed", {
      requestId,
      stripeEventId,
      eventType,
    });
    return withRequestIdHeaders(NextResponse.json({ success: true }), requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore webhook Stripe";
    if (processedStripeEventId) {
      await prisma.stripeWebhookEvent
        .update({
          where: { stripeEventId: processedStripeEventId },
          data: { status: "failed", processedAt: new Date(), errorMessage: message },
        })
        .catch(() => null);
    }
    logApiEvent("error", "billing.webhook.failed", { requestId, message, stripeEventId: processedStripeEventId });
    return withRequestIdHeaders(
      NextResponse.json({ success: false, error: message }, { status: 400 }),
      requestId
    );
  }
}
