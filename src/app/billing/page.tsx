"use client";

import { useMemo, useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

type BillingCycle = "monthly" | "yearly";

type DiagnosticData = {
  stripeReachable: boolean;
  stripeAccountId: string;
  stripeMode: "test" | "live_or_unknown";
  webhookConfigured: boolean;
  monthlyPriceConfigured: boolean;
  yearlyPriceConfigured: boolean;
  monthlyPriceLooksValid: boolean;
  yearlyPriceLooksValid: boolean;
  currentUser: {
    id: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
  };
  masked: {
    stripeSecretKey: string | null;
    webhookSecret: string | null;
    monthlyPrice: string | null;
    yearlyPrice: string | null;
  };
};

export default function BillingPage() {
  return (
    <>
      <SignedIn>
        <BillingPanel />
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-[50vh] items-center justify-center p-6">
          <SignInButton mode="redirect">
            <button className="rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white">
              Accedi per testare Stripe
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </>
  );
}

function BillingPanel() {
  const [diag, setDiag] = useState<DiagnosticData | null>(null);
  const [loadingDiag, setLoadingDiag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const isReady = useMemo(() => {
    if (!diag) return false;
    return (
      diag.stripeReachable &&
      diag.stripeMode === "test" &&
      diag.webhookConfigured &&
      diag.monthlyPriceConfigured &&
      diag.yearlyPriceConfigured &&
      diag.monthlyPriceLooksValid &&
      diag.yearlyPriceLooksValid
    );
  }, [diag]);

  async function runDiagnostics() {
    setLoadingDiag(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/test-mode", { method: "GET" });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error ?? "Errore diagnostica");
      setDiag(json.data as DiagnosticData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore inatteso");
    } finally {
      setLoadingDiag(false);
    }
  }

  async function openCheckout() {
    setLoadingCheckout(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingCycle, trialDays: 30 }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success || !json?.data?.checkoutUrl) {
        throw new Error(json?.error ?? "Errore creazione checkout");
      }
      window.location.href = json.data.checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore inatteso");
    } finally {
      setLoadingCheckout(false);
    }
  }

  async function openPortal() {
    setLoadingPortal(true);
    setError(null);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const json = await res.json();
      if (!res.ok || !json?.success || !json?.data?.portalUrl) {
        throw new Error(json?.error ?? "Errore apertura customer portal");
      }
      window.location.href = json.data.portalUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore inatteso");
    } finally {
      setLoadingPortal(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-4 sm:p-6">
      <h1 className="text-xl font-semibold text-[var(--navy)]">Billing Stripe (Test Mode)</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Usa questa pagina per verificare configurazione e flusso checkout/portal prima del go-live.
      </p>

      <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4">
        <button
          onClick={runDiagnostics}
          disabled={loadingDiag}
          className="rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {loadingDiag ? "Verifica in corso..." : "Verifica configurazione Stripe"}
        </button>

        {diag && (
          <div className="mt-4 space-y-1 text-sm text-zinc-700">
            <p>Account Stripe: {diag.stripeAccountId}</p>
            <p>Modalita': {diag.stripeMode}</p>
            <p>Webhook secret presente: {diag.webhookConfigured ? "SI" : "NO"}</p>
            <p>Price monthly configurato: {diag.monthlyPriceConfigured ? "SI" : "NO"}</p>
            <p>Price yearly configurato: {diag.yearlyPriceConfigured ? "SI" : "NO"}</p>
            <p>Chiavi mascherate: {diag.masked.stripeSecretKey ?? "-"}</p>
            <p className={isReady ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>
              Stato: {isReady ? "Pronto per test end-to-end" : "Configurazione incompleta"}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-4">
        <label className="mb-3 block text-sm font-medium text-zinc-700">Ciclo abbonamento test</label>
        <select
          value={billingCycle}
          onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
          className="w-full max-w-xs rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="monthly">Mensile</option>
          <option value="yearly">Annuale</option>
        </select>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={openCheckout}
            disabled={loadingCheckout}
            className="rounded-md bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-[var(--navy)] disabled:opacity-60"
          >
            {loadingCheckout ? "Apro checkout..." : "Apri Checkout Test"}
          </button>
          <button
            onClick={openPortal}
            disabled={loadingPortal}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-60"
          >
            {loadingPortal ? "Apro portal..." : "Apri Customer Portal"}
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
