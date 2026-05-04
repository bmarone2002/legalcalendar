import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { itIT } from "@clerk/localizations";
import { Geist } from "next/font/google";
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
    rootBox: "min-w-0",
    card:
      "rounded-2xl border border-[var(--gold)]/20 bg-white p-4 shadow-xl shadow-[var(--navy)]/10 sm:p-6",
    cardBox: "flex flex-col gap-4 overflow-visible",
    header: "gap-2 text-center",
    main: "flex flex-col gap-4",
    logoImage: "h-auto max-h-[3.5rem] w-auto object-contain",
    headerTitle: "text-[var(--navy)]",
    headerSubtitle: "text-zinc-600",
    socialButtonsRoot: "flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3",
    socialButtons: "flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3",
    socialButtonsBlockButton:
      "relative flex min-h-[2.75rem] w-full flex-1 basis-0 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-3 hover:border-[var(--gold)]/45 hover:bg-[var(--gold)]/5",
    lastAuthenticationStrategyBadge:
      "static m-0 ml-2 inline-flex max-w-[45%] shrink-0 translate-x-0 translate-y-0 text-right text-[10px] font-medium leading-tight text-zinc-500 sm:max-w-[10rem] sm:text-left",
    formFieldInput:
      "rounded-lg border border-zinc-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25",
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
      "rounded-lg border border-zinc-300 focus:border-[var(--gold)] focus:ring-2 focus:ring-[var(--gold)]/25",
    userButtonPopoverCard: "min-w-[16rem] overflow-visible rounded-xl border border-zinc-200 p-3 shadow-lg",
    userButtonPopoverMain: "flex flex-col gap-2",
    userPreviewAvatarContainer: "flex items-center gap-3 overflow-visible",
    userPreviewAvatarBox: "shrink-0 overflow-visible",
    userButtonAvatarBox: "shrink-0 overflow-visible ring-2 ring-[var(--gold)]/50",
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
  return (
    <html lang="it">
      <body className={`${geistSans.variable} antialiased`}>
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
          afterSignUpUrl="/onboarding/billing"
          localization={itIT}
          appearance={clerkAppearance}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
