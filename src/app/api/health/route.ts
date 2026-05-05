import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRequestId, withRequestIdHeaders } from "@/lib/server/request-context";

export async function GET(req: Request) {
  const requestId = getRequestId(req);
  const startedAt = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return withRequestIdHeaders(
      NextResponse.json({
        ok: true,
        service: "agenda-legale",
        db: "ok",
        latencyMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      }),
      requestId
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Healthcheck failed";
    return withRequestIdHeaders(
      NextResponse.json(
        {
          ok: false,
          service: "agenda-legale",
          db: "error",
          error: message,
          latencyMs: Date.now() - startedAt,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      ),
      requestId
    );
  }
}
