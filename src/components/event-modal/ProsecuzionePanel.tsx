"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
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
  ADEMPIMENTI_SUGGERITI,
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
  onSubEventsChanged?: () => void;
  targetUserId?: string;
  readOnly?: boolean;
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

function toDateOnlyString(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

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

// ── Inline Adempimento Row ──────────────────────────────────────────

function AdempimentoRow({
  form,
  onChange,
  onRemove,
}: {
  form: AdempimentoForm;
  onChange: (updated: AdempimentoForm) => void;
  onRemove: () => void;
}) {
  const isAltro = form.tipoSuggerito === "ALTRO";

  return (
    <div className="space-y-2 rounded-md border border-zinc-200 bg-white p-3">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label className="text-xs">Tipo adempimento</Label>
          <Select
            value={form.tipoSuggerito || "__empty"}
            onValueChange={(v) => {
              const val = v === "__empty" ? "" : v;
              onChange({
                ...form,
                tipoSuggerito: val as AdempimentoSuggerito | "",
                titolo:
                  val && val !== "ALTRO"
                    ? ADEMPIMENTO_SUGGERITO_LABELS[val as AdempimentoSuggerito]
                    : form.titolo,
              });
            }}
          >
            <SelectTrigger className="h-8 text-sm bg-white">
              <SelectValue placeholder="Seleziona..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty" disabled>
                Seleziona...
              </SelectItem>
              {ADEMPIMENTI_SUGGERITI.map((a) => (
                <SelectItem key={a} value={a}>
                  {ADEMPIMENTO_SUGGERITO_LABELS[a]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
          onClick={onRemove}
          title="Rimuovi adempimento"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {isAltro && (
        <div>
          <Label className="text-xs">Titolo (specificare)</Label>
          <Input
            value={form.titolo}
            onChange={(e) => onChange({ ...form, titolo: e.target.value })}
            placeholder="Es. Deposito atto integrativo..."
            className="h-8 text-sm"
          />
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-xs">Scadenza</Label>
          <DatePicker
            value={form.scadenza ? new Date(form.scadenza + "T12:00:00") : null}
            onChange={(d) =>
              onChange({ ...form, scadenza: d ? toDateOnlyString(d) : "" })
            }
            placeholder="Data scadenza"
          />
        </div>
        <div className="w-28">
          <Label className="text-xs">Giorni alert</Label>
          <Input
            type="number"
            min={0}
            value={form.giorniAlert}
            onChange={(e) =>
              onChange({
                ...form,
                giorniAlert: e.target.value ? Number(e.target.value) : 0,
              })
            }
            className="h-10 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">Note (opzionale)</Label>
        <Input
          value={form.note}
          onChange={(e) => onChange({ ...form, note: e.target.value })}
          placeholder="Note aggiuntive..."
          className="h-8 text-sm"
        />
      </div>
    </div>
  );
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
  const [note, setNote] = useState("");
  const [adempimenti, setAdempimenti] = useState<AdempimentoForm[]>([]);
  const [availableEventi, setAvailableEventi] = useState<EventoDisponibile[]>([]);
  const [selectedEventoCode, setSelectedEventoCode] = useState<string>("");
  const [faseManuale, setFaseManuale] = useState<string>("");
  const [reminderOffsets, setReminderOffsets] = useState<number[]>([]);
  const [linkedEvents, setLinkedEvents] = useState<LinkedEventSpec[]>([]);

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

  const resetForm = () => {
    setTipoUdienza("");
    setTipoUdienzaCustom("");
    setDataUdienza(null);
    setNote("");
    setAdempimenti([]);
    setSelectedEventoCode("");
    setFaseManuale("");
    setReminderOffsets([]);
    setLinkedEvents([]);
    setEditingRinvioId(null);
    setShowForm(false);
    setError(null);
  };

  const handleAddAdempimento = () => {
    setAdempimenti((prev) => [...prev, emptyAdempimento()]);
  };

  const handleUpdateAdempimento = (idx: number, updated: AdempimentoForm) => {
    setAdempimenti((prev) => prev.map((a, i) => (i === idx ? updated : a)));
  };

  const handleRemoveAdempimento = (idx: number) => {
    setAdempimenti((prev) => prev.filter((_, i) => i !== idx));
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
      setError("Selezionare la data dell'udienza");
      return false;
    }

    const validAdempimenti = adempimenti
      .map(adempimentoFormToData)
      .filter((a) => a.titolo && a.scadenza);

    setSaving(true);
    try {
      const normalizedDataUdienza = new Date(
        dataUdienza.getFullYear(),
        dataUdienza.getMonth(),
        dataUdienza.getDate(),
        12, 0, 0
      );

      const evento = availableEventi.find((e) => e.code === effectiveEventoCode);
      const labelEvento = evento?.label ?? effectiveEventoCode;

      if (editingRinvioId) {
        const result = await updateRinvio(
          editingRinvioId,
          {
            dataUdienza: normalizedDataUdienza,
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
          onSubEventsChanged?.();
          return true;
        }

        setError(result.error);
        return false;
      }

      const result = await createRinvio(
        {
          parentEventId: eventId,
          dataUdienza: normalizedDataUdienza,
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
        onSubEventsChanged?.();
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
    setNote(r.note ?? "");

    setReminderOffsets(r.reminderOffsets ?? []);
    setLinkedEvents(r.linkedEvents ?? []);

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
    return <p className="text-sm text-zinc-500 py-4">Caricamento rinvii...</p>;
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
      <p className="text-sm text-zinc-600">
        Cronologia delle udienze successive all&apos;atto iniziale. Aggiungi i
        rinvii di udienza con i relativi adempimenti e promemoria.
      </p>

      {/* Existing rinvii list */}
      {rinvii.length > 0 && (
        <ScrollArea className="max-h-[240px] rounded-md">
          <div className="space-y-2">
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
      )}

      {rinvii.length === 0 && !showForm && (
        <p className="text-xs text-zinc-400 py-2">
          Nessun rinvio di udienza inserito. Usa il pulsante sotto per aggiungere
          il primo rinvio.
        </p>
      )}

      {/* New rinvio form */}
      {!readOnly && showForm && (
        <div className="space-y-3 rounded-md border border-dashed border-[var(--navy)] bg-zinc-50/50 p-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-sm font-medium text-zinc-700">
              {editingRinvioId ? "Modifica rinvio di udienza" : "Nuovo rinvio di udienza"}
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-[var(--navy)] hover:bg-[var(--calendar-brown-pale)]"
              disabled={parsingRinvio}
              onClick={() => rinvioFileInputRef.current?.click()}
            >
              {parsingRinvio ? "Analisi…" : "Allega verbale e compila con AI"}
            </Button>
          </div>

          {/* Fase del giudizio: input diretto se non ci sono fasi predefinite, altrimenti dropdown con possibilita' di scrivere a mano */}
          <div>
            <Label className="text-xs">Fase del giudizio</Label>
            {availableEventi.length === 0 || selectedEventoCode === MANUALE_CODE ? (
              <>
                <Input
                  value={faseManuale}
                  onChange={(e) => setFaseManuale(e.target.value)}
                  placeholder="Es. Udienza successiva / Termine di deposito..."
                  className="h-8 text-sm bg-white"
                  autoFocus={selectedEventoCode === MANUALE_CODE}
                />
                {availableEventi.length > 0 && (
                  <button
                    type="button"
                    className="text-xs text-[var(--navy)] hover:underline mt-1"
                    onClick={() => {
                      setSelectedEventoCode("");
                      setFaseManuale("");
                    }}
                  >
                    &larr; Torna alla lista
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
                <SelectTrigger className="bg-white text-sm">
                  <SelectValue placeholder="Seleziona evento/fase..." />
                </SelectTrigger>
                <SelectContent className="max-h-none">
                  <SelectItem value="__empty" disabled>
                    Seleziona evento/fase...
                  </SelectItem>
                  {availableEventi.map((ev) => (
                    <SelectItem key={ev.code} value={ev.code}>
                      {ev.label}
                    </SelectItem>
                  ))}
                  <SelectItem value={MANUALE_CODE}>Altro (scrivi fase manualmente)</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Data udienza */}
          <div>
            <Label className="text-xs">Data udienza</Label>
            <DatePicker
              value={dataUdienza}
              onChange={setDataUdienza}
              placeholder="Scegli data udienza"
            />
          </div>

          {/* Note */}
          <div>
            <Label className="text-xs">Note (opzionale)</Label>
            <textarea
              className="flex min-h-[60px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)] focus-visible:ring-offset-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note o disposizioni del giudice..."
            />
          </div>

          {/* Adempimenti */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-zinc-700">
                Adempimenti e scadenze
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={handleAddAdempimento}
              >
                + Aggiungi adempimento
              </Button>
            </div>

            {adempimenti.length === 0 && (
              <p className="text-xs text-zinc-400">
                Nessun adempimento. Usa il pulsante per aggiungerne.
              </p>
            )}

            {adempimenti.map((a, idx) => (
              <AdempimentoRow
                key={a.id}
                form={a}
                onChange={(updated) => handleUpdateAdempimento(idx, updated)}
                onRemove={() => handleRemoveAdempimento(idx)}
              />
            ))}
          </div>

          {/* Promemoria udienza (opzionali, personalizzabili) */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-700">
              Promemoria per l&apos;udienza (opzionali)
            </Label>
            <p className="text-xs text-zinc-500">
              Se non imposti nulla, non verrà creato alcun promemoria automatico per l&apos;udienza. Puoi aggiungere uno o più promemoria a X giorni prima.
            </p>
            {reminderOffsets.map((days, i) => (
              <div key={i} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setReminderOffsets((prev) => {
                      const next = [...prev];
                      next[i] = Math.max(1, next[i] - 1);
                      return next;
                    })
                  }
                  className="h-7 w-7 rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 text-lg font-bold leading-none flex items-center justify-center"
                  aria-label="Diminuisci giorni"
                >
                  −
                </button>
                <span className="w-10 text-center text-xs font-medium text-zinc-900 select-none">
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
                  className="h-7 w-7 rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 text-lg font-bold leading-none flex items-center justify-center"
                  aria-label="Aumenta giorni"
                >
                  +
                </button>
                <span className="text-xs text-zinc-600">giorni prima</span>
                <button
                  type="button"
                  onClick={() =>
                    setReminderOffsets((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  className="text-red-500 hover:text-red-700 text-sm leading-none px-1"
                  aria-label="Rimuovi promemoria"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex flex-wrap gap-2 mt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setReminderOffsets((prev) => [...prev, DEFAULT_GIORNI_ALERT_UDIENZA])
                }
                className="h-7 text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              >
                + Aggiungi promemoria udienza
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setLinkedEvents((prev) => [...prev, { title: "", offsetDays: 7 }])
                }
                className="h-7 text-xs border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              >
                + Aggiungi evento collegato
              </Button>
            </div>
            {linkedEvents.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-zinc-100">
                <Label className="text-xs font-medium text-zinc-700">
                  Eventi collegati (data = data udienza di questo rinvio)
                </Label>
                <p className="text-[11px] text-zinc-500">
                  Titolo a scelta; giorni ± dalla data udienza (stesse regole sui festivi dei promemoria).
                </p>
                {linkedEvents.map((row, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <Input
                      className="h-8 min-w-[140px] flex-1 text-sm"
                      placeholder="Titolo"
                      value={row.title}
                      onChange={(e) =>
                        setLinkedEvents((prev) => {
                          const next = [...prev];
                          next[i] = { ...next[i], title: e.target.value };
                          return next;
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setLinkedEvents((prev) => {
                          const next = [...prev];
                          next[i] = {
                            ...next[i],
                            offsetDays: Math.max(-365, next[i].offsetDays - 1),
                          };
                          return next;
                        })
                      }
                      className="h-7 w-7 rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 text-lg font-bold leading-none flex items-center justify-center"
                      aria-label="Diminuisci giorni"
                    >
                      −
                    </button>
                    <span className="w-11 text-center text-xs font-medium text-zinc-900 select-none tabular-nums">
                      {row.offsetDays >= 0 ? "+" : ""}
                      {row.offsetDays}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setLinkedEvents((prev) => {
                          const next = [...prev];
                          next[i] = {
                            ...next[i],
                            offsetDays: Math.min(365, next[i].offsetDays + 1),
                          };
                          return next;
                        })
                      }
                      className="h-7 w-7 rounded border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 text-lg font-bold leading-none flex items-center justify-center"
                      aria-label="Aumenta giorni"
                    >
                      +
                    </button>
                    <span className="text-xs text-zinc-600">giorni (±)</span>
                    <button
                      type="button"
                      onClick={() =>
                        setLinkedEvents((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="text-red-500 hover:text-red-700 text-sm leading-none px-1"
                      aria-label="Rimuovi"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetForm}
              disabled={saving}
            >
              Annulla
            </Button>
            <Button
              type="button"
              size="sm"
              className="btn-save-primary"
              onClick={() => {
                void handleSaveRinvio();
              }}
              disabled={saving}
            >
              {saving ? "Salvataggio..." : "Salva rinvio"}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Add rinvio: file upload + manual button */}
      {!readOnly && !showForm && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--calendar-brown-pale)]"
              disabled={parsingRinvio}
              onClick={() => rinvioFileInputRef.current?.click()}
            >
              {parsingRinvio ? "Analisi in corso…" : "Allega file e compila con AI"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-dashed border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--calendar-brown-pale)]"
              onClick={() => {
                setEditingRinvioId(null);
                setShowForm(true);
              }}
            >
              + Aggiungi rinvio di udienza
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
