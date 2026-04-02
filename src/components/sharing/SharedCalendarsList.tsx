"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSharedWithMe, revokeShare } from "@/lib/actions/sharing";
import type { SharedWithMeInfo } from "@/lib/actions/sharing";
import { CalendarDays, ExternalLink, Loader2, UserRound } from "lucide-react";

export function SharedCalendarsList() {
  const [shares, setShares] = useState<SharedWithMeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await getSharedWithMe();
    if (result.success) {
      setShares(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRemove = async (shareId: string) => {
    setError(null);
    const result = await revokeShare(shareId);
    if (result.success) {
      setShares((prev) => prev.filter((s) => s.id !== shareId));
    } else {
      setError(result.error);
    }
  };

  return (
    <section aria-labelledby="shared-with-me-heading" className="min-w-0">
      <div className="mb-4 flex min-w-0 items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-800">
          <CalendarDays className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="shared-with-me-heading"
              className="text-base font-semibold tracking-tight text-[var(--navy)] sm:text-lg"
            >
              Calendari condivisi con me
            </h2>
            {!loading && shares.length > 0 && (
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-600">
                {shares.length}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600">
            Apri l&apos;agenda di un collega che ti ha concesso l&apos;accesso.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
          Caricamento calendari…
        </div>
      ) : shares.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-gradient-to-b from-zinc-50/80 to-white px-4 py-8 text-center sm:px-6 sm:py-10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <CalendarDays className="h-6 w-6" aria-hidden />
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-800">Nessun calendario ricevuto</p>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-zinc-500">
            Quando qualcuno condividerà la propria agenda con te, la troverai qui con un link diretto alla vista.
          </p>
        </div>
      ) : (
        <ul className="space-y-2" role="list">
          {shares.map((share) => (
            <li
              key={share.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm transition-colors hover:border-zinc-300 sm:flex-row sm:items-center sm:justify-between sm:p-4"
            >
              <div className="flex min-w-0 flex-1 gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                  <UserRound className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-medium leading-snug text-zinc-900 sm:truncate sm:leading-normal">
                    {share.owner.email ?? "Email non disponibile"}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">Proprietario del calendario</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      share.permission === "FULL"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-sky-100 text-sky-800"
                    }`}
                  >
                    {share.permission === "FULL" ? "Accesso completo" : "Solo visualizzazione"}
                  </span>
                </div>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={`/shared/${share.owner.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-11 min-h-[44px] w-full justify-center gap-1.5 border-[var(--navy)]/25 text-base font-medium text-[var(--navy)] touch-manipulation hover:bg-[var(--calendar-brown-pale)] sm:h-9 sm:min-h-0 sm:w-auto sm:text-[13px]"
                  )}
                >
                  <ExternalLink className="h-4 w-4 sm:h-3.5 sm:w-3.5" aria-hidden />
                  Apri calendario
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-11 min-h-[44px] w-full justify-center text-sm text-red-600 touch-manipulation hover:bg-red-50 hover:text-red-700 sm:h-9 sm:min-h-0 sm:w-auto sm:text-xs"
                  onClick={() => handleRemove(share.id)}
                >
                  Rimuovi
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p className="mt-3 break-words rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
