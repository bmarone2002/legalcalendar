import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function getOrCreateDbUser() {
  const { userId } = auth();

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
    },
  });

  return created;
}

