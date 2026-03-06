"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSharedWithMe, revokeShare } from "@/lib/actions/sharing";
import type { SharedWithMeInfo } from "@/lib/actions/sharing";

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
    <div>
      <h3 className="text-base font-semibold text-[var(--calendar-brown)] mb-3">
        Calendari condivisi con me
      </h3>
      {loading ? (
        <p className="text-sm text-zinc-500">Caricamento...</p>
      ) : shares.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nessun calendario condiviso con te al momento.
        </p>
      ) : (
        <div className="space-y-2">
          {shares.map((share) => (
            <div
              key={share.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-800 truncate">
                  {share.owner.email ?? "Email non disponibile"}
                </p>
                <span
                  className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    share.permission === "FULL"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {share.permission === "FULL"
                    ? "Accesso completo"
                    : "Solo visualizzazione"}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link href={`/shared/${share.owner.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-[var(--calendar-brown)] text-[var(--calendar-brown)] hover:bg-[var(--calendar-brown-pale)]"
                  >
                    Visualizza calendario
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 text-xs"
                  onClick={() => handleRemove(share.id)}
                >
                  Rimuovi
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
