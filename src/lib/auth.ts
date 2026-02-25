import { auth } from "@clerk/nextjs/server";

export function requireAuth() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Richiesta non autenticata");
  }
  return { userId };
}

