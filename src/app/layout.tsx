import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { itIT } from "@clerk/localizations";
import { Geist } from "next/font/google";
import { WheelScrollSupport } from "@/components/layout/WheelScrollSupport";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const clerkAppearance = {
  variables: {
    colorPrimary: "var(--navy)",
    colorBackground: "#ffffff",
    colorInputBackground: "#ffffff",
    colorInputText: "#171717",
    colorText: "#171717",
    colorTextSecondary: "#52525b",
    colorDanger: "#dc2626",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  },
  elements: {
    card: "rounded-2xl border border-[var(--gold)]/20 bg-white shadow-xl shadow-[var(--navy)]/10",
    logoImage: "!h-[4.5rem] !w-auto !max-h-none",
    headerTitle: "text-[var(--navy)]",
    headerSubtitle: "text-zinc-600",
    socialButtonsBlockButton:
      "rounded-lg border border-zinc-200 hover:border-[var(--gold)]/45 hover:bg-[var(--gold)]/5",
    formFieldInput:
      "rounded-lg border-zinc-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25",
    formFieldLabel: "text-zinc-700",
    formButtonPrimary:
      "rounded-lg bg-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold-light)] shadow-sm font-semibold",
    formButtonReset:
      "rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400",
    dividerLine: "bg-zinc-200",
    dividerText: "text-zinc-500",
    footerActionLink: "text-[var(--navy)] hover:text-[var(--navy-light)]",
    identityPreviewText: "text-zinc-700",
    identityPreviewEditButton: "text-[var(--navy)] hover:text-[var(--navy-light)]",
    formResendCodeLink: "text-[var(--navy)] hover:text-[var(--navy-light)]",
    otpCodeFieldInput:
      "rounded-lg border-zinc-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Agenda Legale",
    template: "%s | Agenda Legale",
  },
  description:
    "Software per studi legali per gestire pratiche, udienze e scadenze in un unico calendario operativo.",
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Agenda Legale",
    title: "Agenda Legale",
    description:
      "Software per studi legali per gestire pratiche, udienze e scadenze in un unico calendario operativo.",
    url: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const withClerk = Boolean(clerkPublishableKey);

  return (
    <html lang="it">
      <body className={`${geistSans.variable} antialiased`}>
        {withClerk ? (
          <ClerkProvider
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/"
            afterSignUpUrl="/onboarding/billing"
            localization={itIT}
            appearance={clerkAppearance}
          >
            <WheelScrollSupport />
            {children}
          </ClerkProvider>
        ) : (
          <>
            <WheelScrollSupport />
            {children}
          </>
        )}
      </body>
    </html>
  );
}
