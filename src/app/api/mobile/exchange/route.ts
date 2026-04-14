import { NextResponse } from "next/server";
import { verifyToken } from "@clerk/backend";

function applySessionCookies(response: NextResponse, token: string) {
  response.cookies.set("__session", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  response.cookies.set("__client_uat", `${Math.floor(Date.now() / 1000)}`, {
    path: "/",
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function POST(req: Request) {
  let token: string | undefined;
  try {
    const body = (await req.json()) as { token?: string };
    token = body.token?.trim();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!token || token.length < 20) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
  } catch {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  applySessionCookies(response, token);
  return response;
}
