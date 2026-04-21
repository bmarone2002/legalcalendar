import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/db/user";
import { getStripeServerClient } from "@/lib/billing/stripe";

function isNoSuchCustomerError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const maybeError = error as { code?: string; message?: string };
  const message = maybeError.message ?? "";
  return maybeError.code === "resource_missing" || message.includes("No such customer");
}

export async function POST(req: Request) {
  try {
    const user = await getOrCreateDbUser();
    const stripe = getStripeServerClient();
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin ?? "http://localhost:3000";

    async function createAndPersistCustomer() {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { userId: user.id, clerkUserId: user.clerkUserId },
      });
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });
      return customer.id;
    }

    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      stripeCustomerId = await createAndPersistCustomer();
    }

    let session;
    try {
      session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${appUrl}/`,
      });
    } catch (error) {
      if (!isNoSuchCustomerError(error)) throw error;
      stripeCustomerId = await createAndPersistCustomer();
      session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${appUrl}/`,
      });
    }

    return NextResponse.json({ success: true, data: { portalUrl: session.url } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore apertura portale abbonamento";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
