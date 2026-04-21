import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { hasAcceptedLegal } from "@/lib/legal/consent";

const ALLOWED_PATH_PREFIXES = [
  "/sign-in",
  "/sign-up",
  "/accept-legal",
  "/legal",
  "/api/legal/accept",
  "/api/billing/webhook",
];

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;

  const isApiRoute = pathname.startsWith("/api");
  const isAllowedPath = ALLOWED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!userId || isApiRoute || isAllowedPath) {
    return NextResponse.next();
  }

  if (!hasAcceptedLegal(sessionClaims)) {
    const redirectUrl = new URL("/accept-legal", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
