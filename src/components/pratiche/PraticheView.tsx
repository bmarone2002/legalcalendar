"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import type { EventStatus } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CalendarClock,
  ChevronRight,
  FolderOpen,
  Landmark,
  Search,
  X,
} from "lucide-react";

export type PracticeSummary = {
  id: string;
  practiceTitle: string;
  practiceIdentityDate: string; // yyyy-MM-dd
  anchorPhaseTitle: string;
  anchorDate: string; // yyyy-MM-dd
  status: EventStatus;
};

function formatDateForHumans(dateOnly: string): string {
  if (!dateOnly) return "—";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    const [y, m, d] = dateOnly.split("-");
    return `${d}/${m}/${y}`;
  }
  return dateOnly;
}

function statusBadge(status: EventStatus) {
  if (status === "done") {
    return {
      label: "Completata",
      className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80",
    };
  }
  return {
    label: "Da fare",
    className: "bg-red-50 text-red-800 ring-1 ring-red-200/80",
  };
}

export function PraticheView({ practices }: { practices: PracticeSummary[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return practices;
    return practices.filter((p) => {
      const blob = [p.practiceTitle, p.practiceIdentityDate, p.anchorPhaseTitle, p.anchorDate]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [practices, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="mx-auto w-full min-w-0 max-w-4xl space-y-6 pb-4">
      <header className="space-y-1">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/10 text-[var(--navy)]">
            <FolderOpen className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--navy)] sm:text-2xl">Pratiche</h1>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600">
              Riepilogo dei contenitori pratica. Cerca per parte, RG, autorità, luogo o per date.
            </p>
          </div>
        </div>
      </header>

      {practices.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca la pratica"
              aria-label="Cerca la pratica"
              className="h-11 min-h-[44px] border-zinc-200 bg-white pl-10 pr-10 text-base text-zinc-900 placeholder:text-zinc-400 focus-visible:border-[var(--navy)] focus-visible:ring-[var(--navy)] sm:h-10 sm:min-h-0 sm:text-sm"
            />
            {hasQuery && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 touch-manipulation"
                aria-label="Cancella ricerca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 sm:flex-col sm:items-end sm:justify-center">
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold tabular-nums text-zinc-700 sm:py-1">
              {filtered.length} {filtered.length === 1 ? "pratica" : "pratiche"}
            </span>
            {practices.length !== filtered.length && (
              <span className="text-[11px] text-zinc-400 sm:text-right">su {practices.length} totali</span>
            )}
          </div>
        </div>
      )}

      {practices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-gradient-to-b from-zinc-50/90 to-white px-5 py-12 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <FolderOpen className="h-6 w-6" aria-hidden />
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-800">Nessuna pratica in elenco</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-zinc-500">
            Le pratiche compaiono qui quando crei eventi principali nel calendario. Apri l&apos;agenda e aggiungi una nuova pratica per iniziare.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-10 text-center shadow-sm sm:px-8">
          <p className="text-sm font-medium text-zinc-800">Nessun risultato</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500">
            Prova con altre parole chiave o{" "}
            <button
              type="button"
              onClick={() => setQuery("")}
              className="font-medium text-[var(--navy)] underline underline-offset-2 hover:text-[var(--navy-light)]"
            >
              azzera la ricerca
            </button>
            .
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3" role="list">
          {filtered.map((p) => {
            const badge = statusBadge(p.status);
            return (
              <li key={p.id} className="min-w-0">
                <Link
                  href={`/?eventId=${encodeURIComponent(p.id)}`}
                  className="group block rounded-xl border border-zinc-200/90 bg-white p-3.5 shadow-sm outline-none transition-all hover:border-[var(--navy)]/20 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[var(--navy)]/35 focus-visible:ring-offset-2 touch-manipulation sm:p-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <h2 className="min-w-0 flex-1 text-base font-semibold leading-snug text-[var(--navy)] sm:text-[15px] sm:leading-snug">
                        <span className="break-words group-hover:underline">{p.practiceTitle || "Pratica"}</span>
                      </h2>
                      <div className="flex shrink-0 items-center gap-2 self-start">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                        <ChevronRight
                          className="hidden h-5 w-5 shrink-0 text-zinc-300 transition-colors group-hover:text-[var(--navy)]/50 sm:block"
                          aria-hidden
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 border-t border-zinc-100 pt-3 text-sm sm:gap-2.5">
                      <div className="flex items-start gap-2.5 text-zinc-600">
                        <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                        <div className="min-w-0 leading-snug">
                          <span className="text-zinc-500">Data pratica </span>
                          <span className="font-medium text-zinc-800">
                            {formatDateForHumans(p.practiceIdentityDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 text-zinc-600">
                        <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                        <div className="min-w-0 leading-snug">
                          <span className="text-zinc-500">Fase </span>
                          <span className="font-medium text-zinc-800">{p.anchorPhaseTitle || "—"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-lg bg-zinc-50/80 px-2.5 py-2 text-xs text-zinc-600 sm:items-center sm:px-3">
                      <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400 sm:mt-0" aria-hidden />
                      <span className="min-w-0 leading-snug">
                        <span className="text-zinc-500">Riferimento fase </span>
                        <span className="font-medium text-zinc-700">{formatDateForHumans(p.anchorDate)}</span>
                      </span>
                    </div>

                    <p className="flex items-center gap-1 text-[11px] font-medium text-[var(--navy)]/70 sm:hidden">
                      Apri nel calendario
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
