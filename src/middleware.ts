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
  const host = req.headers.get("host") ?? req.nextUrl.host;
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const hostname = host.split(":")[0];
  const isApexDomain = hostname === "agendalegale.com";
  const isProductionHost =
    hostname === "agendalegale.com" || hostname === "www.agendalegale.com";
  const isHttpRequest = forwardedProto === "http";

  // Keep a single canonical origin for SEO: https://www.agendalegale.com
  if (isApexDomain || (isProductionHost && isHttpRequest)) {
    const canonicalUrl = req.nextUrl.clone();
    canonicalUrl.protocol = "https";
    canonicalUrl.host = "www.agendalegale.com";
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const { userId, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;
  const recentlyAcceptedCookie = req.cookies.get("legal_accept_recent")?.value === "1";

  const isApiRoute = pathname.startsWith("/api");
  const isAllowedPath = ALLOWED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!userId || isApiRoute || isAllowedPath) {
    return NextResponse.next();
  }

  if (!hasAcceptedLegal(sessionClaims) && !recentlyAcceptedCookie) {
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
