import { AppShell } from "@/components/layout/AppShell";
import { ShareManagement } from "@/components/sharing/ShareManagement";
import { SharedCalendarsList } from "@/components/sharing/SharedCalendarsList";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function SharedPage() {
  return (
    <AppShell headerTitle={<span>Condivisioni</span>}>
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
          <h2 className="mb-2 text-lg font-semibold text-[var(--navy)]">
            Accedi per gestire le condivisioni
          </h2>
          <p className="mb-4 text-sm text-zinc-600">
            Crea un account o accedi per condividere la tua agenda.
          </p>
          <SignInButton mode="redirect">
            <button className="rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--navy-light)]">
              Vai al login
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </AppShell>
  );
}
