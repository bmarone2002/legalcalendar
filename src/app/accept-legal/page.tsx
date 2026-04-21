"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptLegalPage() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!accepted) {
      setError("Devi accettare i documenti per continuare.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/legal/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted: true }),
      });
      const json = await response.json();
      if (!response.ok || !json?.success) {
        throw new Error(json?.error ?? "Errore nel salvataggio del consenso");
      }
      router.replace("/");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Errore inatteso";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-4">
      <div className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-[var(--navy)]">Accettazione documenti legali</h1>
        <p className="mt-3 text-sm text-zinc-600">
          Per usare Agenda Legale devi leggere e accettare i documenti legali.
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700">
          <li>
            <Link href="/legal/terms" className="text-[var(--navy)] underline underline-offset-2">
              Termini di Servizio
            </Link>
          </li>
          <li>
            <Link href="/legal/privacy" className="text-[var(--navy)] underline underline-offset-2">
              Privacy Policy (GDPR)
            </Link>
          </li>
          <li>
            <Link href="/legal/cookie" className="text-[var(--navy)] underline underline-offset-2">
              Cookie Policy
            </Link>
          </li>
          <li>
            <Link href="/legal/subscription" className="text-[var(--navy)] underline underline-offset-2">
              Condizioni Abbonamento e Recesso
            </Link>
          </li>
        </ul>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="flex items-start gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              Dichiaro di aver letto e accettato i documenti legali indicati sopra.
            </span>
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Salvataggio..." : "Accetta e continua"}
          </button>
        </form>
      </div>
    </div>
  );
}
