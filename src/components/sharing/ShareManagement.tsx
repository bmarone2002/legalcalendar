"use client";

import React, { useCallback, useEffect, useState } from "react";
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-[var(--navy)] mb-3">
          Condividi il mio calendario
        </h3>
        <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Label className="text-xs text-zinc-600">Email utente</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Inserisci l'email dell'utente..."
              className="mt-1 bg-white text-zinc-800 placeholder-zinc-400 border border-zinc-300 focus-visible:ring-[var(--navy)] focus-visible:border-[var(--navy)]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (suggestions.length > 0 && suggestions[0].email) {
                    setEmail(suggestions[0].email);
                    setSuggestions([]);
                  } else {
                    handleShare();
                  }
                }
              }}
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white shadow-lg max-h-40 overflow-auto">
                {suggestions.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className="flex w-full px-3 py-2 text-sm text-left hover:bg-zinc-50"
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

          <div>
            <Label className="text-xs text-zinc-600">Permesso</Label>
            <Select
              value={permission}
              onValueChange={(v) => setPermission(v as SharePermission)}
            >
              <SelectTrigger className="mt-1 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIEW_ONLY">Solo visualizzazione</SelectItem>
                <SelectItem value="FULL">Accesso completo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleShare}
            disabled={saving || !email.trim()}
            className="w-full bg-[var(--navy)] text-white hover:bg-[var(--navy-light)]"
          >
            {saving ? "Condivisione..." : "Condividi"}
          </Button>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[var(--navy)] mb-3">
          Condivisioni attive
        </h3>
        {loading ? (
          <p className="text-sm text-zinc-500">Caricamento...</p>
        ) : shares.length === 0 ? (
          <p className="text-sm text-zinc-500">
            Non hai ancora condiviso il tuo calendario con nessuno.
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
                    {share.user.email ?? "Email non disponibile"}
                  </p>
                </div>
                <Select
                  value={share.permission}
                  onValueChange={(v) =>
                    handleUpdatePermission(share.id, v as SharePermission)
                  }
                >
                  <SelectTrigger className="w-[180px] h-8 text-xs bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEW_ONLY">Solo visualizzazione</SelectItem>
                    <SelectItem value="FULL">Accesso completo</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 text-xs shrink-0"
                  onClick={() => handleRevoke(share.id)}
                >
                  Revoca
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
