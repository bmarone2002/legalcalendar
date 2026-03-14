"use client";

import React, { useEffect, useState } from "react";
import { CalendarView } from "@/components/calendar/CalendarView";
import { getShareForOwner } from "@/lib/actions/sharing";
import type { SharePermission } from "@/generated/prisma";

interface SharedCalendarViewProps {
  ownerId: string;
}

export function SharedCalendarView({ ownerId }: SharedCalendarViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<SharePermission | null>(null);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const result = await getShareForOwner(ownerId);
      if (result.success && result.data) {
        setPermission(result.data.permission);
        setOwnerEmail(result.data.ownerEmail);
      } else {
        setError(result.success ? "Errore sconosciuto" : result.error);
      }
      setLoading(false);
    })();
  }, [ownerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-zinc-500">Verifica accesso al calendario...</p>
      </div>
    );
  }

  if (error || !permission) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="mb-2 text-lg font-semibold text-red-700">
          Accesso non consentito
        </h2>
        <p className="text-sm text-red-600">
          {error ?? "Non hai accesso a questo calendario."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <p className="text-sm text-zinc-600">
          Agenda di <span className="font-medium text-zinc-800">{ownerEmail ?? "utente"}</span>
        </p>
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
            permission === "FULL"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {permission === "FULL" ? "Accesso completo" : "Solo visualizzazione"}
        </span>
      </div>
      <CalendarView targetUserId={ownerId} permission={permission} />
    </div>
  );
}
