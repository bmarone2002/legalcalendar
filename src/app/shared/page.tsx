import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ShareManagement } from "@/components/sharing/ShareManagement";
import { SharedCalendarsList } from "@/components/sharing/SharedCalendarsList";

export default function SharedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-zinc-200 bg-white px-3 py-2 sm:px-4 sm:py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-lg font-semibold text-[var(--calendar-brown)] sm:text-xl hover:opacity-80 transition-opacity"
            >
              Calendario Legale
            </Link>
            <span className="text-zinc-300">/</span>
            <h1 className="text-base font-medium text-zinc-700 sm:text-lg">
              Condivisioni
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <SignedIn>
              <Link href="/">
                <button className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                  Il mio calendario
                </button>
              </Link>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-md border border-[var(--calendar-brown)] px-3 py-1.5 text-sm font-medium text-[var(--calendar-brown)] hover:bg-[var(--calendar-brown)] hover:text-white">
                  Accedi
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>
      <main className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6">
        <SignedIn>
          <div className="mx-auto max-w-2xl space-y-8">
            <ShareManagement />
            <div className="border-t border-zinc-200 pt-6">
              <SharedCalendarsList />
            </div>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="mx-auto max-w-xl rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-[var(--calendar-brown)]">
              Accedi per gestire le condivisioni
            </h2>
            <p className="mb-4 text-sm text-zinc-600">
              Crea un account o accedi per condividere il tuo calendario.
            </p>
            <SignInButton mode="redirect">
              <button className="rounded-md bg-[var(--calendar-brown)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--calendar-brown)]/90">
                Vai al login
              </button>
            </SignInButton>
          </div>
        </SignedOut>
      </main>
    </div>
  );
}
