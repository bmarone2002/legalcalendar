import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { LEGAL_VERSION } from "@/lib/legal/consent";

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Non autenticato" }, { status: 401 });
    }

    const payload = await req.json().catch(() => ({}));
    if (!payload?.accepted) {
      return NextResponse.json({ success: false, error: "Consenso mancante" }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    const userAgent = req.headers.get("user-agent") ?? "";
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "";

    const oldPublicMetadata =
      sessionClaims && typeof sessionClaims === "object" && "publicMetadata" in sessionClaims
        ? ((sessionClaims.publicMetadata as Record<string, unknown>) ?? {})
        : {};

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...oldPublicMetadata,
        legalAcceptedAt: nowIso,
        legalAcceptedVersion: LEGAL_VERSION,
        legalAcceptedIp: ipAddress,
        legalAcceptedUserAgent: userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore salvataggio consenso";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
