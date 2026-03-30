import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const token = searchParams.get("token")?.trim();

  if (!token || token.length < 20) {
    return NextResponse.redirect(new URL("/sign-in", origin));
  }

  const response = NextResponse.redirect(new URL("/", origin));
  response.cookies.set("__session", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  // Clerk also tracks "last active" client timestamp in __client_uat.
  // Setting it here avoids edge cases where a restored __session cookie
  // is ignored by the frontend after an external OAuth return.
  response.cookies.set("__client_uat", `${Math.floor(Date.now() / 1000)}`, {
    path: "/",
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
