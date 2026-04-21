import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

async function _getOrCreateDbUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Richiesta non autenticata");
  }

  const existing = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (existing) {
    return existing;
  }

  const clerkUser = await currentUser();
  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    null;

  const created = await prisma.user.create({
    data: {
      clerkUserId: userId,
      email: email ?? undefined,
      subscriptionStatus: "trialing",
      currentPlan: "pro",
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return created;
}

export const getOrCreateDbUser = cache(_getOrCreateDbUser);

