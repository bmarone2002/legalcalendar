"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  searchUsers,
  shareCalendar,
  updateSharePermission,
  revokeShare,
  getMyShares,
} from "@/lib/actions/sharing";
import type { ShareInfo } from "@/lib/actions/sharing";
import type { SharePermission } from "@/generated/prisma";
import { useListboxArrowKeys } from "@/hooks/useListboxArrowKeys";
import { Loader2, Mail, Send, Shield, UserPlus, Users } from "lucide-react";

export function ShareManagement() {
  const [shares, setShares] = useState<ShareInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<SharePermission>("VIEW_ONLY");
  const [suggestions, setSuggestions] = useState<Array<{ id: string; email: string | null }>>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadShares = useCallback(async () => {
    const result = await getMyShares();
    if (result.success) {
      setShares(result.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadShares();
  }, [loadShares]);

  useEffect(() => {
    if (!email.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      const result = await searchUsers(email.trim());
      if (result.success) {
        setSuggestions(result.data);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [email]);

  const emailSuggestListRef = useRef<HTMLDivElement>(null);
  const emailSuggestionResetKey = useMemo(
    () => suggestions.map((u) => u.id).join(","),
    [suggestions]
  );
  const confirmEmailSuggestion = useCallback((index: number) => {
    const u = suggestions[index];
    if (u?.email) {
      setEmail(u.email);
      setSuggestions([]);
    }
  }, [suggestions]);
  const emailSuggestNav = useListboxArrowKeys({
    open: suggestions.length > 0,
    itemCount: suggestions.length,
    resetKey: emailSuggestionResetKey,
    listRef: emailSuggestListRef,
    onConfirmIndex: confirmEmailSuggestion,
    onEscape: () => setSuggestions([]),
  });

  const handleShare = async () => {
    if (!email.trim()) return;
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const result = await shareCalendar(email.trim(), permission);
      if (result.success) {
        setSuccess(`Calendario condiviso con ${email.trim()}`);
        setEmail("");
        setSuggestions([]);
        await loadShares();
      } else {
        setError(result.error);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePermission = async (shareId: string, newPermission: SharePermission) => {
    setError(null);
    const result = await updateSharePermission(shareId, newPermission);
    if (result.success) {
      setShares((prev) =>
        prev.map((s) => (s.id === shareId ? { ...s, permission: newPermission } : s))
      );
    } else {
      setError(result.error);
    }
  };

  const handleRevoke = async (shareId: string) => {
    setError(null);
    const result = await revokeShare(shareId);
    if (result.success) {
      setShares((prev) => prev.filter((s) => s.id !== shareId));
    } else {
      setError(result.error);
    }
  };

  const canSubmit = email.trim().length > 0 && !saving;

  return (
    <div className="w-full min-w-0 space-y-8">
      <section aria-labelledby="share-form-heading" className="min-w-0">
        <div className="mb-4 flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/10 text-[var(--navy)]">
            <UserPlus className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="share-form-heading"
              className="text-base font-semibold tracking-tight text-[var(--navy)] sm:text-lg"
            >
              Condividi il mio calendario
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-zinc-600">
              Invita un collega inserendo la sua email: potrà vedere o modificare la tua agenda in base al permesso scelto.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-3.5 shadow-sm sm:p-5">
          <div className="grid gap-4 sm:grid-cols-[1fr_minmax(11rem,13rem)] sm:items-end">
            <div className="relative space-y-1.5">
              <Label htmlFor="share-email" className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                <Mail className="h-3.5 w-3.5 text-zinc-400" aria-hidden />
                Email utente
              </Label>
              <Input
                id="share-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@studio.it"
                autoComplete="email"
                className="h-11 min-h-[44px] border-zinc-200 bg-white text-base text-zinc-800 placeholder:text-zinc-400 focus-visible:border-[var(--navy)] focus-visible:ring-[var(--navy)] sm:h-10 sm:min-h-0 sm:text-sm"
                onKeyDown={(e) => {
                  emailSuggestNav.handleKeyDown(e);
                  if (e.defaultPrevented) return;
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleShare();
                  }
                }}
              />
              {suggestions.length > 0 && (
                <div
                  ref={emailSuggestListRef}
                  role="listbox"
                  aria-label="Utenti trovati"
                  className="absolute left-0 right-0 top-full z-20 mt-1 max-h-44 overflow-auto rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
                >
                  {suggestions.map((u, index) => (
                    <button
                      key={u.id}
                      type="button"
                      role="option"
                      data-suggestion-index={index}
                      aria-selected={emailSuggestNav.activeIndex === index}
                      className={`flex min-h-[44px] w-full items-center px-3 py-2 text-left text-base text-zinc-800 transition-colors hover:bg-zinc-50 sm:min-h-0 sm:py-2.5 sm:text-sm ${
                        emailSuggestNav.activeIndex === index ? "bg-zinc-100" : ""
                      }`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setEmail(u.email ?? "");
                        setSuggestions([]);
                      }}
                    >
                      {u.email ?? "Email non disponibile"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="share-permission" className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                <Shield className="h-3.5 w-3.5 text-zinc-400" aria-hidden />
                Permesso
              </Label>
              <Select value={permission} onValueChange={(v) => setPermission(v as SharePermission)}>
                <SelectTrigger
                  id="share-permission"
                  className="h-11 min-h-[44px] border-zinc-200 bg-white text-base focus:ring-[var(--navy)] sm:h-10 sm:min-h-0 sm:text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIEW_ONLY" className="min-h-10 py-2.5 sm:min-h-0 sm:py-1.5">
                    Solo visualizzazione
                  </SelectItem>
                  <SelectItem value="FULL" className="min-h-10 py-2.5 sm:min-h-0 sm:py-1.5">
                    Accesso completo
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleShare}
            disabled={!canSubmit}
            className="mt-4 h-11 min-h-[44px] w-full gap-2 rounded-lg bg-[var(--navy)] text-base font-medium text-white shadow-sm hover:bg-[var(--navy-light)] disabled:pointer-events-none disabled:bg-zinc-200 disabled:text-zinc-500 disabled:opacity-100 touch-manipulation sm:h-10 sm:min-h-0 sm:w-auto sm:min-w-[200px] sm:text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Condivisione in corso…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden />
                Condividi calendario
              </>
            )}
          </Button>

          {error && (
            <p
              className="mt-3 break-words rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
              role="alert"
            >
              {error}
            </p>
          )}
          {success && (
            <p className="mt-3 break-words rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              {success}
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="active-shares-heading">
        <div className="mb-4 flex min-w-0 flex-wrap items-center gap-2">
          <Users className="h-5 w-5 shrink-0 text-[var(--navy)]" aria-hidden />
          <h2
            id="active-shares-heading"
            className="min-w-0 text-base font-semibold tracking-tight text-[var(--navy)] sm:text-lg"
          >
            Condivisioni attive
          </h2>
          {!loading && shares.length > 0 && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium tabular-nums text-zinc-600">
              {shares.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
            Caricamento condivisioni…
          </div>
        ) : shares.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-gradient-to-b from-zinc-50/80 to-white px-4 py-8 text-center sm:px-6 sm:py-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <Users className="h-6 w-6" aria-hidden />
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-800">Nessuna condivisione ancora</p>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-zinc-500">
              Quando condividerai il calendario, gli utenti autorizzati compariranno qui con email e permesso.
            </p>
          </div>
        ) : (
          <div className="max-h-[58vh] overflow-y-auto pr-1">
            <ul className="space-y-2" role="list">
              {shares.map((share) => (
                <li
                  key={share.id}
                  className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-3.5 shadow-sm transition-colors hover:border-zinc-300 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--navy)]/8 text-sm font-semibold uppercase text-[var(--navy)] sm:h-9 sm:w-9 sm:text-xs">
                      {(share.user.email ?? "?").slice(0, 1)}
                    </span>
                    <p className="min-w-0 flex-1 break-words text-sm font-medium leading-snug text-zinc-900 sm:truncate sm:leading-normal">
                      {share.user.email ?? "Email non disponibile"}
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:flex-wrap sm:items-center">
                    <Select
                      value={share.permission}
                      onValueChange={(v) => handleUpdatePermission(share.id, v as SharePermission)}
                    >
                      <SelectTrigger className="h-11 min-h-[44px] w-full border-zinc-200 bg-white text-base sm:h-9 sm:min-h-0 sm:w-[200px] sm:text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIEW_ONLY" className="min-h-10 py-2.5 sm:min-h-0 sm:py-1.5">
                          Solo visualizzazione
                        </SelectItem>
                        <SelectItem value="FULL" className="min-h-10 py-2.5 sm:min-h-0 sm:py-1.5">
                          Accesso completo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-11 min-h-[44px] w-full justify-center text-sm text-red-600 touch-manipulation hover:bg-red-50 hover:text-red-700 sm:h-9 sm:min-h-0 sm:w-auto sm:text-xs"
                      onClick={() => handleRevoke(share.id)}
                    >
                      Revoca
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
