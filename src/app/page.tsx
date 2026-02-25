import { CalendarView } from "@/components/calendar/CalendarView";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-zinc-200 bg-white px-3 py-2 sm:px-4 sm:py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-lg font-semibold text-[var(--calendar-brown)] sm:text-xl">
            Calendario Legale
          </h1>
          <div className="flex items-center gap-3">
            <SignedIn>
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
          <CalendarView />
        </SignedIn>
        <SignedOut>
          <div className="mx-auto max-w-xl rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
            <h2 className="mb-2 text-lg font-semibold text-[var(--calendar-brown)]">
              Accedi per usare il calendario
            </h2>
            <p className="mb-4 text-sm text-zinc-600">
              Crea un account o accedi per vedere e gestire il tuo calendario personale.
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
