"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, SidebarContent } from "./Sidebar";

interface AppShellProps {
  children: React.ReactNode;
  /** Optional right-side header content (e.g. breadcrumb title) */
  headerTitle?: React.ReactNode;
}

export function AppShell({ children, headerTitle }: AppShellProps) {
  const { isLoaded, isSignedIn } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingChecked, setBillingChecked] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let cancelled = false;

    async function enforceBillingGate() {
      if (!isLoaded) return;
      if (!isSignedIn) {
        if (!cancelled) setBillingChecked(true);
        return;
      }

      const allowedWithoutPremium =
        pathname === "/profilo" ||
        pathname.startsWith("/profilo?") ||
        pathname.startsWith("/legal") ||
        pathname.startsWith("/accept-legal");

      if (allowedWithoutPremium) {
        if (!cancelled) setBillingChecked(true);
        return;
      }

      try {
        const res = await fetch("/api/billing/status", { cache: "no-store" });
        const json = await res.json();
        const hasAccess = Boolean(json?.success && json?.data?.hasPremiumAccess);

        if (!hasAccess) {
          router.replace("/profilo?billing_required=1");
          return;
        }

        if (!cancelled) setBillingChecked(true);
      } catch {
        // Keep UX safe on transient network failures and avoid hard lockout.
        if (!cancelled) setBillingChecked(true);
      }
    }

    void enforceBillingGate();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, pathname, router]);

  const needsBillingCheck = isSignedIn && pathname !== "/profilo";
  const showBlockingLoader = needsBillingCheck && !billingChecked;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface)]" style={{ backgroundColor: "var(--surface)" }}>
      <div className="flex min-h-0 w-full flex-1">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header
            className="flex h-14 shrink-0 items-center justify-end gap-3 border-b border-[var(--gold)]/20 bg-[var(--navy)] px-4 sm:px-6"
            style={{ backgroundColor: "var(--navy)", borderRight: "1px solid rgba(212, 175, 55, 0.2)" }}
          >
            <button
              type="button"
              className="mr-2 flex h-9 w-9 items-center justify-center rounded-md text-white/90 hover:bg-white/10 md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Apri menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
            {headerTitle && (
              <div className="mr-auto flex items-center gap-2 text-white/90">
                {headerTitle}
              </div>
            )}
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "ring-2 ring-[var(--gold)]/50",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-md border border-[var(--gold)] px-3 py-1.5 text-sm font-medium text-[var(--gold)] hover:bg-[var(--gold)]/10 transition-colors"
                >
                  Accedi
                </button>
              </SignInButton>
            </SignedOut>
          </header>
          <div className="border-b border-[var(--gold)]/10 bg-[var(--navy)]/80 px-4 py-1.5 text-center text-xs text-[var(--gold)] sm:px-6">
            Ti suggeriamo di scaricare periodicamente un backup del tuo calendario dalla sezione{" "}
            <Link
              href="/backup"
              className="font-semibold underline underline-offset-2 hover:text-white"
            >
              Backup
            </Link>{" "}
            per tenere sempre al sicuro i tuoi eventi e poterli recuperare in ogni momento.
          </div>
          <main
            className="flex min-h-0 flex-1 flex-col overflow-auto p-3 sm:p-4 md:p-5 lg:p-6"
            style={{ backgroundColor: "var(--surface)" }}
          >
            {showBlockingLoader ? (
              <div className="mx-auto mt-10 w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-600 shadow-sm">
                Verifica stato abbonamento in corso...
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>

      {/* Drawer mobile: overlay + pannello */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu di navigazione">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Chiudi menu"
          />
          <div
            className="absolute left-0 top-0 bottom-0 z-50 flex w-[220px] flex-col border-r border-[var(--gold)]/20 bg-[var(--navy)] shadow-xl transition-transform"
            style={{ backgroundColor: "var(--navy)" }}
          >
            <div className="flex min-h-[56px] items-center justify-end border-b border-[var(--gold)]/30 px-3">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md text-white/90 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Chiudi menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
