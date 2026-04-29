"use client";

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Bell,
  CalendarPlus,
  ChevronDown,
  ChevronRight,
  History,
  Link2,
  Sparkles,
  Trash2,
} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatePicker } from "./DatePicker";
import { Checkbox } from "@/components/ui/checkbox";
import { LinkedEventOffsetDateControls } from "./LinkedEventOffsetDateControls";
import {
  getRinviiByEventId,
  createRinvio,
  deleteRinvio,
  updateRinvio,
} from "@/lib/actions/rinvii";
import { parseDocumentForRinvio } from "@/lib/actions/parse-document";
import {
  TIPI_UDIENZA,
  TIPO_UDIENZA_LABELS,
  ADEMPIMENTO_SUGGERITO_LABELS,
  DEFAULT_GIORNI_ALERT,
  DEFAULT_GIORNI_ALERT_UDIENZA,
} from "@/types/rinvio";
import type {
  Rinvio,
  Adempimento,
  TipoUdienza,
  AdempimentoSuggerito,
  LinkedEventSpec,
} from "@/types/rinvio";
import type {
  MacroAreaCode,
  ProcedimentoCode,
  ParteProcessuale,
  EventoDisponibile,
} from "@/types/macro-areas";
import { getEventiDisponibiliPerProsecuzione } from "@/types/macro-areas";

interface ProsecuzionePanelProps {
  eventId: string;
  onSubEventsChanged?: () => void | Promise<void>;
  targetUserId?: string;
  readOnly?: boolean;
  isManualPractice?: boolean;
  macroArea?: MacroAreaCode | null;
  procedimento?: ProcedimentoCode | null;
  parteProcessuale?: ParteProcessuale | null;
  /**
   * Permette a `EventModal` di chiedere al pannello di salvare eventuali rinvii
   * in bozza quando l'utente preme il bottone “Salva” dell'evento principale.
   */
  onRegisterSavePendingRinvio?: (fn: () => Promise<PendingRinvioSaveResult>) => void;
}

type PendingRinvioSaveResult = "not_required" | "saved" | "failed";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeInlineError(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err && typeof (err as { message: unknown }).message === "string") {
    return (err as { message: string }).message;
  }
  return "Errore durante l'analisi del documento.";
}

function formatTipoUdienza(r: Rinvio): string {
  if (r.tipoUdienza === "ALTRO" && r.tipoUdienzaCustom) {
    return r.tipoUdienzaCustom;
  }
  return TIPO_UDIENZA_LABELS[r.tipoUdienza as TipoUdienza] ?? r.tipoUdienza;
}

// ── Empty adempimento form state ────────────────────────────────────

interface AdempimentoForm {
  id: string;
  tipoSuggerito: AdempimentoSuggerito | "";
  titolo: string;
  scadenza: string;
  giorniAlert: number;
  note: string;
}

function emptyAdempimento(): AdempimentoForm {
  return {
    id: generateId(),
    tipoSuggerito: "",
    titolo: "",
    scadenza: "",
    giorniAlert: DEFAULT_GIORNI_ALERT,
    note: "",
  };
}

function adempimentoFormToData(f: AdempimentoForm): Adempimento {
  let titolo = f.titolo;
  if (f.tipoSuggerito && f.tipoSuggerito !== "ALTRO") {
    titolo = ADEMPIMENTO_SUGGERITO_LABELS[f.tipoSuggerito];
  }
  return {
    id: f.id,
    titolo,
    scadenza: f.scadenza,
    giorniAlert: f.giorniAlert,
    note: f.note || undefined,
  };
}

// ── Existing Rinvio Card (collapsed/expanded) ───────────────────────

function RinvioCard({
  rinvio,
  onDelete,
  onEdit,
  deleting,
}: {
  rinvio: Rinvio;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  deleting: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-md border border-zinc-200 bg-white overflow-hidden">
      <button
        type="button"
        className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors"
        onClick={() => setExpanded((e) => !e)}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-zinc-400 shrink-0" />
        )}
        <span className="font-medium text-sm text-zinc-800 flex-1">
          #{rinvio.numero} – {formatTipoUdienza(rinvio)}
        </span>
        <span className="text-xs text-zinc-500">
          {format(new Date(rinvio.dataUdienza), "dd MMM yyyy", { locale: it })}
          {(() => {
            const d = new Date(rinvio.dataUdienza);
            if (d.getHours() === 12 && d.getMinutes() === 0) return "";
            return ` • ${format(d, "HH:mm")}`;
          })()}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-3 space-y-2 border-t border-zinc-100 pt-3">
          {rinvio.note && (
            <p className="text-sm text-zinc-600">
              <span className="font-medium">Note:</span> {rinvio.note}
            </p>
          )}

          {rinvio.adempimenti.length > 0 && (
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">
                Adempimenti:
              </p>
              <ul className="space-y-1">
                {rinvio.adempimenti.map((a) => (
                  <li
                    key={a.id}
                    className="text-sm text-zinc-700 flex items-baseline gap-2"
                  >
                    <span className="text-zinc-400">•</span>
                    <span className="flex-1">
                      {a.titolo}
                      {a.scadenza && (
                        <span className="text-zinc-400 ml-1">
                          (scad.{" "}
                          {format(
                            new Date(a.scadenza + "T12:00:00"),
                            "dd/MM/yyyy"
                          )}
                          , alert {a.giorniAlert} gg)
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(onDelete || onEdit) && (
            <div className="flex flex-wrap justify-end pt-1 gap-2">
              {onEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50 h-7 text-xs"
                  onClick={() => onEdit(rinvio.id)}
                  disabled={deleting}
                >
                  Modifica rinvio
                </Button>
              )}
              {onDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 text-xs"
                  onClick={() => onDelete(rinvio.id)}
                  disabled={deleting}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Elimina rinvio
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Panel ──────────────────────────────────────────────────────

export function ProsecuzionePanel({
  eventId,
  onSubEventsChanged,
  targetUserId,
  readOnly = false,
  isManualPractice = false,
  macroArea,
  procedimento,
  parteProcessuale,
  onRegisterSavePendingRinvio,
}: ProsecuzionePanelProps) {
  const MANUALE_CODE = "__MANUALE__";

  const [rinvii, setRinvii] = useState<Rinvio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRinvioId, setEditingRinvioId] = useState<string | null>(null);
  const [parsingRinvio, setParsingRinvio] = useState(false);
  const rinvioFileInputRef = useRef<HTMLInputElement>(null);

  // New rinvio form state
  const [tipoUdienza, setTipoUdienza] = useState<TipoUdienza | "">("");
  const [tipoUdienzaCustom, setTipoUdienzaCustom] = useState("");
  const [dataUdienza, setDataUdienza] = useState<Date | null>(null);
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState("08:00");
  const [note, setNote] = useState("");
  const [isUdienza, setIsUdienza] = useState(true);
  const [adempimenti, setAdempimenti] = useState<AdempimentoForm[]>([]);
  const [availableEventi, setAvailableEventi] = useState<EventoDisponibile[]>([]);
  const [selectedEventoCode, setSelectedEventoCode] = useState<string>("");
  const [faseManuale, setFaseManuale] = useState<string>("");
  const [reminderOffsets, setReminderOffsets] = useState<number[]>([]);
  const [linkedEvents, setLinkedEvents] = useState<LinkedEventSpec[]>([]);

  const linkedEventReferenceDate = useMemo(() => {
    if (!dataUdienza || isNaN(dataUdienza.getTime())) return null;
    return new Date(
      dataUdienza.getFullYear(),
      dataUdienza.getMonth(),
      dataUdienza.getDate(),
      12,
      0,
      0,
    );
  }, [dataUdienza]);

  const loadRinvii = useCallback(async () => {
    setLoading(true);
    const result = await getRinviiByEventId(eventId, targetUserId);
    if (result.success) {
      setRinvii(result.data);
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    loadRinvii();
  }, [loadRinvii]);

  useEffect(() => {
    if (macroArea && procedimento && parteProcessuale) {
      setAvailableEventi(
        getEventiDisponibiliPerProsecuzione(macroArea, procedimento, parteProcessuale),
      );
    } else {
      setAvailableEventi([]);
    }
  }, [macroArea, procedimento, parteProcessuale]);

  const availableEventiForSelect = useMemo(() => {
    const UDIENZA_DIFFERITA_CODE = "UDIENZA_DIFFERITA";
    return [...availableEventi].sort((a, b) => {
      if (a.code === UDIENZA_DIFFERITA_CODE && b.code !== UDIENZA_DIFFERITA_CODE) return -1;
      if (b.code === UDIENZA_DIFFERITA_CODE && a.code !== UDIENZA_DIFFERITA_CODE) return 1;
      return a.ordine - b.ordine;
    });
  }, [availableEventi]);

  const resetForm = () => {
    setTipoUdienza("");
    setTipoUdienzaCustom("");
    setDataUdienza(null);
    setUseCustomTime(false);
    setCustomTime("08:00");
    setNote("");
    setIsUdienza(true);
    setAdempimenti([]);
    setSelectedEventoCode("");
    setFaseManuale("");
    setReminderOffsets([]);
    setLinkedEvents([]);
    setEditingRinvioId(null);
    setShowForm(false);
    setError(null);
  };

  const handleSaveRinvio = async (): Promise<boolean> => {
    setError(null);

    const isManualFase = availableEventi.length === 0 || selectedEventoCode === MANUALE_CODE;
    const effectiveEventoCode = isManualFase
      ? faseManuale.trim()
      : selectedEventoCode.trim();

    if (!effectiveEventoCode) {
      setError(
        isManualFase
          ? "Inserire il nome della fase"
          : "Selezionare l'evento/fase dalla tabella o inserire una fase manuale."
      );
      return false;
    }
    if (!dataUdienza) {
      setError("Selezionare la data");
      return false;
    }

    const validAdempimenti = adempimenti
      .map(adempimentoFormToData)
      .filter((a) => a.titolo && a.scadenza);

    const invalidLinkedEventIndex = linkedEvents.findIndex((row) => row.title.trim().length === 0);
    if (invalidLinkedEventIndex >= 0) {
      setError("Inserire un titolo per ogni adempimento collegato.");
      return false;
    }

    setSaving(true);
    try {
      const [hours, minutes] = customTime.split(":").map((n) => Number(n));
      const normalizedDataUdienza = useCustomTime
        ? new Date(
            dataUdienza.getFullYear(),
            dataUdienza.getMonth(),
            dataUdienza.getDate(),
            Number.isFinite(hours) ? hours : 8,
            Number.isFinite(minutes) ? minutes : 0,
            0
          )
        : new Date(
            dataUdienza.getFullYear(),
            dataUdienza.getMonth(),
            dataUdienza.getDate(),
            12,
            0,
            0
          );

      const evento = availableEventi.find((e) => e.code === effectiveEventoCode);
      const labelEvento = evento?.label ?? effectiveEventoCode;

      if (editingRinvioId) {
        const result = await updateRinvio(
          editingRinvioId,
          {
            isUdienza,
            dataUdienza: normalizedDataUdienza,
            hasExplicitTime: useCustomTime,
            // In UI gestiamo solo la “fase/evento” selezionata, quindi persistiamo
            // la label come tipoUdienzaCustom.
            tipoUdienza: "ALTRO",
            tipoUdienzaCustom: labelEvento,
            note: note || null,
            adempimenti: validAdempimenti,
            reminderOffsets,
            linkedEvents,
          },
          targetUserId
        );

        if (result.success) {
          resetForm();
          await loadRinvii();
          await onSubEventsChanged?.();
          return true;
        }

        setError(result.error);
        return false;
      }

      const result = await createRinvio(
        {
          parentEventId: eventId,
          isUdienza,
          dataUdienza: normalizedDataUdienza,
          hasExplicitTime: useCustomTime,
          // Manteniamo tipoUdienza = "ALTRO" e usiamo la descrizione personalizzata
          // per mostrare in lista la fase selezionata.
          tipoUdienza: "ALTRO",
          tipoUdienzaCustom: labelEvento,
          note: note || null,
          adempimenti: validAdempimenti,
          eventoCode: effectiveEventoCode,
          reminderOffsets,
          linkedEvents,
        },
        targetUserId
      );

      if (result.success) {
        resetForm();
        await loadRinvii();
        await onSubEventsChanged?.();
        return true;
      }

      setError(result.error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRinvio = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      const result = await deleteRinvio(id, targetUserId);
      if (result.success) {
        setRinvii((prev) => prev.filter((r) => r.id !== id));
        onSubEventsChanged?.();
      } else {
        setError(result.error);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleParseRinvioFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setParsingRinvio(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await parseDocumentForRinvio(formData);
      if (result.success && result.data) {
        const d = result.data;
        if (d.dataUdienza) {
          const dateStr = d.dataUdienza.slice(0, 10);
          setDataUdienza(new Date(dateStr + "T12:00:00"));
        }
        if (d.tipoUdienza) {
          setTipoUdienza(d.tipoUdienza as TipoUdienza);
        }
        if (Array.isArray(d.adempimenti) && d.adempimenti.length > 0) {
          setAdempimenti(
            d.adempimenti.map((a) => ({
              ...emptyAdempimento(),
              id: generateId(),
              titolo: a.titolo,
              scadenza: a.scadenza.slice(0, 10),
              giorniAlert: DEFAULT_GIORNI_ALERT,
              note: "",
            }))
          );
        }
        setShowForm(true);
      } else if (!result.success) {
        setError(result.error ?? "Impossibile analizzare il documento.");
      }
    } catch (err) {
      setError(normalizeInlineError(err));
    } finally {
      setParsingRinvio(false);
      e.target.value = "";
    }
  };

  const handleEditRinvio = (id: string) => {
    const r = rinvii.find((x) => x.id === id);
    if (!r) return;

    setError(null);
    setEditingRinvioId(id);
    setShowForm(true);

    setDataUdienza(new Date(r.dataUdienza));
    const udienzaDate = new Date(r.dataUdienza);
    const hasCustomHour = udienzaDate.getHours() !== 12 || udienzaDate.getMinutes() !== 0;
    setUseCustomTime(hasCustomHour);
    setCustomTime(
      `${String(udienzaDate.getHours()).padStart(2, "0")}:${String(udienzaDate.getMinutes()).padStart(2, "0")}`
    );
    setNote(r.note ?? "");

    setReminderOffsets(r.reminderOffsets ?? []);
    setLinkedEvents(r.linkedEvents ?? []);
    setIsUdienza(r.isUdienza ?? true);

    // Ricostruzione “fase/evento” dalla label salvata (tipoUdienzaCustom).
    const labelEvento = r.tipoUdienzaCustom ?? "";
    const matchingEvento =
      availableEventi.length > 0
        ? availableEventi.find((ev) => ev.label === labelEvento)
        : undefined;

    if (matchingEvento) {
      setSelectedEventoCode(matchingEvento.code);
      setFaseManuale("");
    } else {
      setSelectedEventoCode(MANUALE_CODE);
      setFaseManuale(labelEvento);
    }

    // Non usiamo direttamente `tipoUdienza` in save, ma lo manteniamo per coerenza UI.
    setTipoUdienza((r.tipoUdienza as TipoUdienza) ?? "ALTRO");
    setTipoUdienzaCustom(labelEvento);

    setAdempimenti(
      (r.adempimenti ?? []).map((a) => {
        const matchingAdempimento = (Object.keys(ADEMPIMENTO_SUGGERITO_LABELS) as AdempimentoSuggerito[]).find(
          (k) => ADEMPIMENTO_SUGGERITO_LABELS[k] === a.titolo
        );

        return {
          ...emptyAdempimento(),
          id: generateId(),
          tipoSuggerito: matchingAdempimento ? matchingAdempimento : "ALTRO",
          titolo: matchingAdempimento ? a.titolo : a.titolo,
          scadenza: a.scadenza.slice(0, 10),
          giorniAlert: a.giorniAlert ?? DEFAULT_GIORNI_ALERT,
          note: a.note ?? "",
        };
      })
    );
  };

  const trySavePendingRinvio = useCallback(async (): Promise<PendingRinvioSaveResult> => {
    if (readOnly) return "not_required";
    if (!showForm) return "not_required";

    const isManualFase = availableEventi.length === 0 || selectedEventoCode === MANUALE_CODE;
    const effectiveEventoCode = isManualFase
      ? faseManuale.trim()
      : selectedEventoCode.trim();

    if (!effectiveEventoCode || !dataUdienza) return "not_required";

    const ok = await handleSaveRinvio();
    return ok ? "saved" : "failed";
  }, [
    readOnly,
    showForm,
    availableEventi.length,
    selectedEventoCode,
    faseManuale,
    dataUdienza,
    handleSaveRinvio,
  ]);

  useLayoutEffect(() => {
    onRegisterSavePendingRinvio?.(() => trySavePendingRinvio());
  }, [onRegisterSavePendingRinvio, trySavePendingRinvio]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-zinc-500">
        <span
          className="inline-block size-4 animate-pulse rounded-full bg-zinc-200"
          aria-hidden
        />
        Caricamento rinvii…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!readOnly && (
        <input
          ref={rinvioFileInputRef}
          type="file"
          accept=".pdf,application/pdf,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleParseRinvioFile}
        />
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex gap-3 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--navy)]/10 text-[var(--navy)]">
            <History className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-zinc-900">Rinvii e udienze successive</h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Registra udienza o altro adempimento (tutto ciò che non è udienza), date e promemoria. Per altre scadenze usa la scheda{" "}
              <span className="font-medium text-zinc-700">Dettagli</span> (eventi collegati).
            </p>
          </div>
        </div>
      </div>

      {rinvii.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
            Registrati ({rinvii.length})
          </p>
          <ScrollArea className="max-h-[240px] rounded-lg border border-zinc-100 bg-zinc-50/30 p-2">
            <div className="space-y-2 pr-1">
              {rinvii.map((r) => (
                <RinvioCard
                  key={r.id}
                  rinvio={r}
                  onDelete={readOnly ? undefined : handleDeleteRinvio}
                  onEdit={readOnly ? undefined : handleEditRinvio}
                  deleting={saving}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {rinvii.length === 0 && !showForm && (
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/60 px-4 py-8 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-100">
            <CalendarPlus className="h-5 w-5 text-zinc-400" aria-hidden />
          </div>
          <p className="text-sm font-medium text-zinc-800">Nessun rinvio ancora</p>
          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-500">
            Aggiungi il primo rinvio a mano, oppure allega un verbale per far estrarre i dati con l&apos;AI.
          </p>
        </div>
      )}

      {/* New rinvio form */}
      {!readOnly && showForm && (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-sm font-semibold text-zinc-900">
              {editingRinvioId ? "Modifica rinvio" : "Nuovo rinvio"}
            </h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1.5 border-zinc-200 bg-white text-xs text-zinc-700 hover:bg-zinc-50"
              disabled={parsingRinvio}
              onClick={() => rinvioFileInputRef.current?.click()}
            >
              <Sparkles className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
              {parsingRinvio ? "Analisi…" : "Compila da verbale (AI)"}
            </Button>
          </div>

          <div className="space-y-4 p-4">
            <div className="space-y-3 rounded-lg border border-zinc-100 bg-zinc-50/50 p-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Dati evento</p>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Fase del giudizio</Label>
                {availableEventi.length === 0 || selectedEventoCode === MANUALE_CODE ? (
                  <>
                    <Input
                      value={faseManuale}
                      onChange={(e) => setFaseManuale(e.target.value)}
                      placeholder="Es. Udienza successiva / Termine di deposito…"
                      className="h-9 bg-white text-sm"
                      autoFocus={selectedEventoCode === MANUALE_CODE}
                    />
                    {availableEventi.length > 0 && (
                      <button
                        type="button"
                        className="text-xs font-medium text-[var(--navy)] hover:underline"
                        onClick={() => {
                          setSelectedEventoCode("");
                          setFaseManuale("");
                        }}
                      >
                        ← Torna alla lista fasi
                      </button>
                    )}
                  </>
                ) : (
                  <Select
                    value={selectedEventoCode || "__empty"}
                    onValueChange={(v) => {
                      const val = v === "__empty" ? "" : v;
                      setSelectedEventoCode(val);
                      if (val !== MANUALE_CODE) {
                        setFaseManuale("");
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 bg-white text-sm">
                      <SelectValue placeholder="Seleziona evento/fase…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__empty" disabled>
                        Seleziona evento/fase…
                      </SelectItem>
                      {availableEventiForSelect.map((ev) => (
                        <SelectItem key={ev.code} value={ev.code}>
                          {ev.label}
                        </SelectItem>
                      ))}
                      <SelectItem value={MANUALE_CODE}>Altro (scrivi a mano)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Data udienza o adempimento</Label>
                <DatePicker
                  value={dataUdienza}
                  onChange={setDataUdienza}
                  placeholder="Scegli la data"
                />
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rinvio-use-custom-time"
                      checked={useCustomTime}
                      onCheckedChange={(checked) => setUseCustomTime(checked === true)}
                      disabled={!dataUdienza}
                    />
                    <Label
                      htmlFor="rinvio-use-custom-time"
                      className="cursor-pointer text-xs font-normal text-zinc-600"
                    >
                      Imposta ora specifica
                    </Label>
                  </div>
                  {useCustomTime && (
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[var(--navy)] focus:ring-offset-2"
                    />
                  )}
                </div>
              </div>
              {isManualPractice && (
                <div className="rounded-lg border border-zinc-200/80 bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="rinvio-is-udienza" className="cursor-pointer text-xs font-medium text-zinc-800">
                      È un&apos;udienza (non un adempimento)
                    </Label>
                    <input
                      id="rinvio-is-udienza"
                      type="checkbox"
                      checked={isUdienza}
                      onChange={(e) => setIsUdienza(e.target.checked)}
                      className="h-4 w-4 accent-[var(--navy)]"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
                    Se disattivato, il rinvio è un adempimento: compare nel{" "}
                    <span className="font-medium text-zinc-700">Pannello intelligente</span> (scheda Adempimenti), non in
                    Prossime udienze.
                  </p>
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-zinc-700">Note (opzionale)</Label>
                <textarea
                  className="flex min-h-[72px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Disposizioni del giudice, rinvio motivato…"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50/40">
              <div className="flex gap-2 border-b border-zinc-100 bg-white/80 px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--navy)]/10 text-[var(--navy)]">
                  <Bell className="h-3.5 w-3.5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-800">Promemoria (opzionali)</p>
                  <p className="text-[11px] leading-snug text-zinc-500">
                    Solo se aggiungi righe: promemoria X giorni prima della data scelta per questo rinvio (udienza o adempimento).
                  </p>
                </div>
              </div>
              <div className="space-y-2 p-3">
                {reminderOffsets.length === 0 ? (
                  <p className="rounded-md border border-dashed border-zinc-200 bg-white/80 px-3 py-2 text-[11px] text-zinc-500">
                    Nessun promemoria. Aggiungi una riga se vuoi un avviso prima della data dell&apos;udienza o dell&apos;adempimento.
                  </p>
                ) : null}
                {reminderOffsets.map((days, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-2 rounded-md border border-zinc-100 bg-white px-2 py-2"
                  >
                    <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-zinc-200 shadow-sm">
                      <button
                        type="button"
                        onClick={() =>
                          setReminderOffsets((prev) => {
                            const next = [...prev];
                            next[i] = Math.max(1, next[i] - 1);
                            return next;
                          })
                        }
                        className="flex h-9 w-9 items-center justify-center border-r border-zinc-200 text-lg font-semibold text-zinc-700 hover:bg-zinc-50"
                        aria-label="Diminuisci giorni"
                      >
                        −
                      </button>
                      <span className="flex min-w-[2.5rem] items-center justify-center bg-zinc-50/80 text-sm font-semibold tabular-nums text-zinc-900">
                        {days}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setReminderOffsets((prev) => {
                            const next = [...prev];
                            next[i] = next[i] + 1;
                            return next;
                          })
                        }
                        className="flex h-9 w-9 items-center justify-center border-l border-zinc-200 text-lg font-semibold text-zinc-700 hover:bg-zinc-50"
                        aria-label="Aumenta giorni"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-zinc-600">
                      giorni prima {isUdienza ? "dell'udienza" : "dell'adempimento"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setReminderOffsets((prev) => prev.filter((_, idx) => idx !== i))}
                      className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Rimuovi promemoria"
                      title="Rimuovi"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setReminderOffsets((prev) => [...prev, DEFAULT_GIORNI_ALERT_UDIENZA])
                  }
                  className="h-8 w-full border-dashed border-zinc-300 text-xs text-zinc-700 hover:border-[var(--navy)]/30 hover:bg-[var(--calendar-brown-pale)] sm:w-auto"
                >
                  + Aggiungi promemoria
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50/40">
              <div className="flex gap-2 border-b border-zinc-100 bg-white/80 px-3 py-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--navy)]/10 text-[var(--navy)]">
                  <Link2 className="h-3.5 w-3.5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-800">Adempimenti collegati al rinvio</p>
                  <p className="text-[11px] leading-snug text-zinc-500">
                    Scadenze aggiuntive con data = data di questo rinvio ± giorni (stesse regole sui festivi dei promemoria).
                  </p>
                </div>
              </div>
              <div className="space-y-3 p-3">
                {linkedEvents.length === 0 ? (
                  <p className="rounded-md border border-dashed border-zinc-200 bg-white/80 px-3 py-2 text-[11px] text-zinc-500">
                    Opzionale. Utile per termini collegati alla stessa data del rinvio.
                  </p>
                ) : null}
                {linkedEvents.map((row, i) => (
                  <div key={i} className="space-y-2 rounded-md border border-zinc-100 bg-white p-3">
                    <Input
                      className="h-9 w-full text-sm"
                      placeholder="Titolo adempimento"
                      value={row.title}
                      onChange={(e) =>
                        setLinkedEvents((prev) => {
                          const next = [...prev];
                          next[i] = { ...next[i], title: e.target.value };
                          return next;
                        })
                      }
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-medium text-zinc-500">Scostamento</span>
                      <LinkedEventOffsetDateControls
                        offsetDays={row.offsetDays}
                        useFerialeSuspension={row.useFerialeSuspension === true}
                        onOffsetChange={(next) =>
                          setLinkedEvents((prev) => {
                            const ev = [...prev];
                            ev[i] = { ...ev[i], offsetDays: next };
                            return ev;
                          })
                        }
                        referenceDate={linkedEventReferenceDate}
                        minusButtonClassName="flex h-9 w-9 items-center justify-center border-r border-zinc-200 text-lg font-semibold text-zinc-700 hover:bg-zinc-50"
                        plusButtonClassName="flex h-9 w-9 items-center justify-center border-l border-zinc-200 text-lg font-semibold text-zinc-700 hover:bg-zinc-50"
                        counterClassName="flex min-w-[3rem] items-center justify-center bg-zinc-50/80 text-sm font-semibold tabular-nums text-zinc-900"
                      />
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`rinvio-linked-event-feriale-${i}`}
                          checked={row.useFerialeSuspension === true}
                          disabled={readOnly}
                          onCheckedChange={(checked) =>
                            setLinkedEvents((prev) => {
                              const ev = [...prev];
                              ev[i] = {
                                ...ev[i],
                                useFerialeSuspension: checked === true,
                              };
                              return ev;
                            })
                          }
                        />
                        <Label
                          htmlFor={`rinvio-linked-event-feriale-${i}`}
                          className="cursor-pointer text-[11px] font-normal text-zinc-600"
                        >
                          sospensione feriale
                        </Label>
                      </div>
                      <span className="text-[11px] text-zinc-500">
                        giorni rispetto alla data {isUdienza ? "udienza" : "dell'adempimento"}
                      </span>
                      {row.useFerialeSuspension === true ? (
                        <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700">
                          feriale
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setLinkedEvents((prev) => prev.filter((_, idx) => idx !== i))}
                        className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-red-50 hover:text-red-600"
                        aria-label="Rimuovi adempimento"
                        title="Rimuovi"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setLinkedEvents((prev) => [
                      ...prev,
                      { title: "", offsetDays: 7, useFerialeSuspension: false },
                    ])
                  }
                  className="h-8 w-full border-dashed border-zinc-300 text-xs text-zinc-700 hover:border-[var(--navy)]/30 hover:bg-[var(--calendar-brown-pale)] sm:w-auto"
                >
                  + Aggiungi adempimento collegato
                </Button>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" size="sm" className="h-9" onClick={resetForm} disabled={saving}>
                Annulla
              </Button>
              <Button
                type="button"
                size="sm"
                className="btn-save-primary h-9 min-w-[8.5rem] font-medium"
                onClick={() => {
                  void handleSaveRinvio();
                }}
                disabled={saving}
              >
                {saving ? "Salvataggio…" : "Salva rinvio"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!readOnly && !showForm && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <Button
            type="button"
            size="sm"
            className="h-10 w-full gap-2 bg-[var(--navy)] text-white shadow-sm hover:bg-[var(--navy-light)] sm:flex-1 sm:min-w-0"
            onClick={() => {
              setEditingRinvioId(null);
              setShowForm(true);
            }}
          >
            <CalendarPlus className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            Aggiungi rinvio
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 w-full gap-2 border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 sm:flex-1 sm:min-w-0"
            disabled={parsingRinvio}
            onClick={() => rinvioFileInputRef.current?.click()}
          >
            <Sparkles className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
            {parsingRinvio ? "Analisi in corso…" : "Compila da verbale (AI)"}
          </Button>
        </div>
      )}
    </div>
  );
}
