import { NextResponse } from "next/server";
import { getOrCreateDbUser } from "@/lib/db/user";
import { getStripeServerClient } from "@/lib/billing/stripe";

function mask(value: string | undefined): string | null {
  if (!value) return null;
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export async function GET() {
  try {
    const user = await getOrCreateDbUser();
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const monthlyPrice = process.env.STRIPE_PRICE_PRO_MONTHLY;
    const yearlyPrice = process.env.STRIPE_PRICE_PRO_YEARLY;

    const stripe = getStripeServerClient();
    const account = await stripe.accounts.retrieve();

    return NextResponse.json({
      success: true,
      data: {
        stripeReachable: true,
        stripeAccountId: account.id,
        stripeMode: stripeSecretKey?.startsWith("sk_test_") ? "test" : "live_or_unknown",
        webhookConfigured: Boolean(webhookSecret),
        monthlyPriceConfigured: Boolean(monthlyPrice),
        yearlyPriceConfigured: Boolean(yearlyPrice),
        monthlyPriceLooksValid: Boolean(monthlyPrice?.startsWith("price_")),
        yearlyPriceLooksValid: Boolean(yearlyPrice?.startsWith("price_")),
        currentUser: {
          id: user.id,
          stripeCustomerId: user.stripeCustomerId,
          stripeSubscriptionId: user.stripeSubscriptionId,
        },
        masked: {
          stripeSecretKey: mask(stripeSecretKey),
          webhookSecret: mask(webhookSecret),
          monthlyPrice: mask(monthlyPrice),
          yearlyPrice: mask(yearlyPrice),
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore diagnostica Stripe";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}
