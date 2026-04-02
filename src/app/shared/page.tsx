import { AppShell } from "@/components/layout/AppShell";
import { ShareManagement } from "@/components/sharing/ShareManagement";
import { SharedCalendarsList } from "@/components/sharing/SharedCalendarsList";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function SharedPage() {
  return (
    <AppShell headerTitle={<span>Condivisioni</span>}>
      <SignedIn>
        <div className="mx-auto w-full min-w-0 max-w-6xl overflow-x-hidden pb-6 sm:pb-8">
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:mb-8">
            Gestisci chi può vedere o modificare la tua agenda e accedi ai calendari che altri hanno condiviso con te.
          </p>
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div className="min-w-0 pb-8 lg:border-r lg:border-zinc-200 lg:pb-0 lg:pr-10">
              <ShareManagement />
            </div>
            <div className="min-w-0 border-t border-zinc-200 pt-8 lg:border-t-0 lg:pt-0">
              <SharedCalendarsList />
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="mx-auto w-full min-w-0 max-w-xl rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-sm sm:p-8">
          <h2 className="mb-2 text-lg font-semibold text-[var(--navy)]">
            Accedi per gestire le condivisioni
          </h2>
          <p className="mb-6 text-sm leading-relaxed text-zinc-600">
            Crea un account o accedi per condividere la tua agenda e aprire i calendari condivisi con te.
          </p>
          <SignInButton mode="redirect">
            <button
              type="button"
              className="mx-auto min-h-11 w-full max-w-xs rounded-lg bg-[var(--navy)] px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--navy-light)] touch-manipulation sm:w-auto sm:min-h-10 sm:py-2.5"
            >
              Vai al login
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </AppShell>
  );
}
