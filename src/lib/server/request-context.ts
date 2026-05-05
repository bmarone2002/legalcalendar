import { NextResponse } from "next/server";

export function getRequestId(req: Request): string {
  return req.headers.get("x-request-id") ?? crypto.randomUUID();
}

export function withRequestIdHeaders(response: NextResponse, requestId: string): NextResponse {
  response.headers.set("x-request-id", requestId);
  return response;
}

export function logApiEvent(
  level: "info" | "warn" | "error",
  event: string,
  data: Record<string, unknown>
) {
  const payload = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...data,
  };
  const line = JSON.stringify(payload);
  if (level === "error") {
    console.error(line);
    return;
  }
  if (level === "warn") {
    console.warn(line);
    return;
  }
  console.log(line);
}
