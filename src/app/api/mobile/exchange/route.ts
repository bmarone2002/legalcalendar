import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const token = searchParams.get("token");

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

  return response;
}
