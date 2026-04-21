import type { SubscriptionStatus, User } from "@/generated/prisma";

type BillingUser = Pick<
  User,
  "subscriptionStatus" | "isTester" | "planOverride" | "currentPlan" | "trialEndsAt" | "createdAt"
>;

const PREMIUM_OVERRIDE = "pro_forced";
const PREMIUM_STATUSES: SubscriptionStatus[] = ["trialing", "active"];
const LEGACY_PREMIUM_CUTOFF_ENV = "LEGACY_PREMIUM_CUTOFF_ISO";

function hasLegacyPremiumAccess(user: BillingUser): boolean {
  const cutoffIso = process.env[LEGACY_PREMIUM_CUTOFF_ENV];
  if (!cutoffIso) return false;

  const cutoff = new Date(cutoffIso);
  if (Number.isNaN(cutoff.getTime())) {
    console.warn(`${LEGACY_PREMIUM_CUTOFF_ENV} non valido:`, cutoffIso);
    return false;
  }

  return user.createdAt.getTime() <= cutoff.getTime();
}

export function hasPremiumAccess(user: BillingUser): boolean {
  if (hasLegacyPremiumAccess(user)) return true;
  if (user.isTester) return true;
  if (user.planOverride === PREMIUM_OVERRIDE) return true;
  if (user.subscriptionStatus === "trialing") {
    return !isTrialExpired(user.trialEndsAt);
  }
  return PREMIUM_STATUSES.includes(user.subscriptionStatus);
}

export function isTrialExpired(trialEndsAt: Date | null): boolean {
  if (!trialEndsAt) return false;
  return trialEndsAt.getTime() < Date.now();
}

export function derivePlanFromPriceId(priceId: string | null | undefined): string {
  if (!priceId) return "free";
  if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) return "pro";
  if (priceId === process.env.STRIPE_PRICE_PRO_YEARLY) return "pro";
  return "free";
}

export function mapStripeStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
    case "incomplete":
    case "incomplete_expired":
      return "canceled";
    default:
      return "free";
  }
}
