import { AppShell } from "@/components/layout/AppShell";
import { SharedCalendarView } from "@/components/sharing/SharedCalendarView";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

interface SharedCalendarPageProps {
  params: Promise<{ ownerId: string }>;
}

export default async function SharedCalendarPage({ params }: SharedCalendarPageProps) {
  const { ownerId } = await params;

  return (
    <AppShell
      headerTitle={
        <>
          <Link href="/shared" className="hover:text-[var(--gold)] transition-colors">
            Condivisioni
          </Link>
          <span className="text-white/60"> / </span>
          <span>Calendario condiviso</span>
        </>
      }
    >
      <SignedIn>
        <SharedCalendarView ownerId={ownerId} />
      </SignedIn>
      <SignedOut>
        <div className="mx-auto max-w-xl rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-[var(--navy)]">
            Accedi per visualizzare l&apos;agenda
          </h2>
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
