import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--surface)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-zinc-200 pb-4 text-sm">
          <Link href="/" className="font-medium text-[var(--navy)] hover:underline">
            Home
          </Link>
          <span className="text-zinc-400">/</span>
          <Link href="/legal/terms" className="text-zinc-600 hover:text-[var(--navy)] hover:underline">
            Termini
          </Link>
          <Link href="/legal/privacy" className="text-zinc-600 hover:text-[var(--navy)] hover:underline">
            Privacy
          </Link>
          <Link href="/legal/cookie" className="text-zinc-600 hover:text-[var(--navy)] hover:underline">
            Cookie
          </Link>
          <Link href="/legal/subscription" className="text-zinc-600 hover:text-[var(--navy)] hover:underline">
            Abbonamento
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
