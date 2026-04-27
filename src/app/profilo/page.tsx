"use client";

import { useEffect, useMemo, useState } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { AppShell } from "@/components/layout/AppShell";

type SubscriptionStatus = "free" | "trialing" | "active" | "past_due" | "canceled";

type BillingStatusData = {
  currentPlan: string;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  trialEndsAt: string | null;
  trialExpired: boolean;
  isTester: boolean;
  planOverride: string | null;
  hasPremiumAccess: boolean;
};

type DiagnosticData = {
  stripeReachable: boolean;
  stripeAccountId: string;
  stripeMode: "test" | "live_or_unknown";
  webhookConfigured: boolean;
  monthlyPriceConfigured: boolean;
  yearlyPriceConfigured: boolean;
  monthlyPriceLooksValid: boolean;
  yearlyPriceLooksValid: boolean;
};

export default function ProfilePage() {
  return (
    <AppShell headerTitle={<span>Il mio profilo</span>}>
      <SignedIn>
        <ProfilePanel />
      </SignedIn>
      <SignedOut>
        <div className="mx-auto w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-[var(--navy)]">Accedi per vedere il tuo profilo</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Entra con il tuo account per gestire piano, pagamenti e impostazioni personali.
          </p>
          <SignInButton mode="redirect">
            <button className="mt-5 rounded-md bg-[var(--navy)] px-4 py-2 text-sm font-medium text-white">
              Vai al login
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </AppShell>
  );
}

function ProfilePanel() {
  const { user } = useUser();
  const [status, setStatus] = useState<BillingStatusData | null>(null);
  const [diag, setDiag] = useState<DiagnosticData | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullName = useMemo(() => {
    const first = user?.firstName ?? "";
    const last = user?.lastName ?? "";
    const combined = `${first} ${last}`.trim();
    return combined.length > 0 ? combined : "Utente";
  }, [user]);

  const statusInfo = useMemo(() => {
    if (!status) {
      return { label: "Non disponibile", badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200" };
    }
    switch (status.subscriptionStatus) {
      case "active":
        return { label: "Attivo", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200" };
      case "trialing":
        return { label: "In prova", badgeClass: "bg-sky-100 text-sky-800 border-sky-200" };
      case "past_due":
        return { label: "Pagamento in ritardo", badgeClass: "bg-amber-100 text-amber-800 border-amber-200" };
      case "canceled":
        return { label: "Annullato", badgeClass: "bg-rose-100 text-rose-800 border-rose-200" };
      default:
        return { label: "Free", badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200" };
    }
  }, [status]);

  useEffect(() => {
    void loadBillingStatus();
  }, []);

  async function loadBillingStatus() {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/billing/status");
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Errore caricamento profilo billing");
      }
      setStatus(json.data as BillingStatusData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore inatteso");
    } finally {
      setLoadingStatus(false);
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
    <div className="mx-auto w-full max-w-6xl">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-[var(--navy)]">Abbonamento</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Gestisci il tuo piano, la prova gratuita e il rinnovo in un unico pannello.
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--navy)]">Stato del piano</h2>
          {loadingStatus ? (
            <p className="mt-3 text-sm text-zinc-500">Caricamento stato in corso...</p>
          ) : status ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Piano" value={status.currentPlan.toUpperCase()} />
              <StatBadgeCard label="Stato" value={statusInfo.label} badgeClass={statusInfo.badgeClass} />
              <StatCard label="Premium" value={status.hasPremiumAccess ? "SI" : "NO"} />
              <StatCard label="Account" value={user?.primaryEmailAddress?.emailAddress ?? "-"} />
              <div className="sm:col-span-2 lg:col-span-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                <span className="font-medium">Fine trial:</span>{" "}
                {status.trialEndsAt ? new Date(status.trialEndsAt).toLocaleString("it-IT") : "-"}
              </div>
              {!status.hasPremiumAccess && (
                <div className="sm:col-span-2 lg:col-span-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  Il tuo piano non risulta attivo. Per continuare ad usare le funzionalita&apos; del calendario, attiva o rinnova l&apos;abbonamento.
                </div>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-zinc-500">Stato non disponibile.</p>
          )}
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--navy)]">Pagamenti</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Apri il portale cliente per gestire il piano attivo.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={openPortal}
            disabled={loadingPortal}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:opacity-60"
          >
            {loadingPortal ? "Apro portale..." : "Gestisci abbonamento"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {toFriendlyError(error)}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-[var(--navy)]">{value}</p>
    </div>
  );
}

function StatBadgeCard({
  label,
  value,
  badgeClass,
}: {
  label: string;
  value: string;
  badgeClass: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</p>
      <span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
        {value}
      </span>
    </div>
  );
}

function toFriendlyError(message: string): string {
  if (message.includes("Can't reach database server")) {
    return "Connessione al database non disponibile in questo ambiente. Controlla le variabili DATABASE_URL/.env.local oppure usa l'ambiente Railway.";
  }
  return message;
}
