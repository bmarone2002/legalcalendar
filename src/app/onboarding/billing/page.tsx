"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

type BillingStatus = {
  hasPremiumAccess: boolean;
};

export default function BillingOnboardingPage() {
  return (
    <>
      <SignedIn>
        <BillingOnboardingPanel />
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-[var(--navy)]">Accedi per continuare</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Devi essere autenticato per avviare la prova gratuita.
            </p>
            <SignInButton mode="redirect">
              <button className="mt-4 rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white">
                Vai al login
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
    </>
  );
}

function BillingOnboardingPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapTrial() {
      try {
        const statusRes = await fetch("/api/billing/status", { cache: "no-store" });
        const statusJson = await statusRes.json();
        if (!statusRes.ok || !statusJson?.success) {
          throw new Error(statusJson?.error ?? "Errore caricamento stato abbonamento");
        }

        const status = statusJson.data as BillingStatus;
        if (status.hasPremiumAccess) {
          window.location.replace("/");
          return;
        }

        const checkoutRes = await fetch("/api/billing/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ billingCycle: "monthly", trialDays: 30 }),
        });
        const checkoutJson = await checkoutRes.json();
        if (!checkoutRes.ok || !checkoutJson?.success || !checkoutJson?.data?.checkoutUrl) {
          throw new Error(checkoutJson?.error ?? "Errore avvio checkout trial");
        }

        window.location.replace(checkoutJson.data.checkoutUrl);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Errore inatteso");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void bootstrapTrial();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--surface)] px-4">
      <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-[var(--navy)]">Attivazione prova gratuita</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Stiamo avviando la tua prova di 30 giorni tramite checkout sicuro Stripe, senza richiedere la
          carta all'inizio.
        </p>
        <p className="mt-2 text-sm font-medium text-zinc-700">
          Al termine della prova, se non aggiungi un metodo di pagamento, l'abbonamento verra' annullato
          automaticamente.
        </p>

        {loading && (
          <p className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
            Reindirizzamento in corso...
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <p>{error}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/profilo"
                className="rounded-md bg-[var(--navy)] px-3 py-1.5 text-xs font-medium text-white"
              >
                Vai al profilo billing
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700"
              >
                Riprova
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
