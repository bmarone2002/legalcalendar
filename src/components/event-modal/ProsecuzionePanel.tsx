"use client";

import React, { useCallback, useEffect, useState } from "react";
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
} from "@/lib/actions/rinvii";
import {
  TIPI_UDIENZA,
  TIPO_UDIENZA_LABELS,
  ADEMPIMENTI_SUGGERITI,
  ADEMPIMENTO_SUGGERITO_LABELS,
  DEFAULT_GIORNI_ALERT,
} from "@/types/rinvio";
import type {
  Rinvio,
  Adempimento,
  TipoUdienza,
  AdempimentoSuggerito,
} from "@/types/rinvio";

interface ProsecuzionePanelProps {
  eventId: string;
  onSubEventsChanged?: () => void;
}

function toDateOnlyString(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
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
  deleting,
}: {
  rinvio: Rinvio;
  onDelete: (id: string) => void;
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

          <div className="flex justify-end pt-1">
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
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Panel ──────────────────────────────────────────────────────

export function ProsecuzionePanel({
  eventId,
  onSubEventsChanged,
}: ProsecuzionePanelProps) {
  const [rinvii, setRinvii] = useState<Rinvio[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // New rinvio form state
  const [tipoUdienza, setTipoUdienza] = useState<TipoUdienza | "">("");
  const [tipoUdienzaCustom, setTipoUdienzaCustom] = useState("");
  const [dataUdienza, setDataUdienza] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [adempimenti, setAdempimenti] = useState<AdempimentoForm[]>([]);

  const loadRinvii = useCallback(async () => {
    setLoading(true);
    const result = await getRinviiByEventId(eventId);
    if (result.success) {
      setRinvii(result.data);
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    loadRinvii();
  }, [loadRinvii]);

  const resetForm = () => {
    setTipoUdienza("");
    setTipoUdienzaCustom("");
    setDataUdienza(null);
    setNote("");
    setAdempimenti([]);
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

  const handleSaveRinvio = async () => {
    setError(null);

    if (!tipoUdienza) {
      setError("Selezionare il tipo di udienza");
      return;
    }
    if (tipoUdienza === "ALTRO" && !tipoUdienzaCustom.trim()) {
      setError("Specificare il tipo di udienza");
      return;
    }
    if (!dataUdienza) {
      setError("Selezionare la data dell'udienza");
      return;
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

      const result = await createRinvio({
        parentEventId: eventId,
        dataUdienza: normalizedDataUdienza,
        tipoUdienza,
        tipoUdienzaCustom: tipoUdienza === "ALTRO" ? tipoUdienzaCustom : null,
        note: note || null,
        adempimenti: validAdempimenti,
      });

      if (result.success) {
        resetForm();
        await loadRinvii();
        onSubEventsChanged?.();
      } else {
        setError(result.error);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRinvio = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      const result = await deleteRinvio(id);
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

  if (loading) {
    return <p className="text-sm text-zinc-500 py-4">Caricamento rinvii...</p>;
  }

  return (
    <div className="space-y-4">
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
                onDelete={handleDeleteRinvio}
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
      {showForm && (
        <div className="space-y-3 rounded-md border border-dashed border-[var(--calendar-brown)] bg-zinc-50/50 p-4">
          <h4 className="text-sm font-medium text-zinc-700">
            Nuovo rinvio di udienza
          </h4>

          {/* Tipo udienza */}
          <div>
            <Label className="text-xs">Tipo udienza</Label>
            <Select
              value={tipoUdienza || "__empty"}
              onValueChange={(v) => {
                const val = v === "__empty" ? "" : v;
                setTipoUdienza(val as TipoUdienza | "");
                if (val !== "ALTRO") setTipoUdienzaCustom("");
              }}
            >
              <SelectTrigger className="bg-white text-sm">
                <SelectValue placeholder="Seleziona tipo udienza..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__empty" disabled>
                  Seleziona tipo udienza...
                </SelectItem>
                {TIPI_UDIENZA.map((t) => (
                  <SelectItem key={t} value={t}>
                    {TIPO_UDIENZA_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {tipoUdienza === "ALTRO" && (
            <div>
              <Label className="text-xs">Tipo udienza (specificare)</Label>
              <Input
                value={tipoUdienzaCustom}
                onChange={(e) => setTipoUdienzaCustom(e.target.value)}
                placeholder="Es. Udienza di rinvio per CTU supplementare..."
                className="text-sm"
              />
            </div>
          )}

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
              className="flex min-h-[60px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--calendar-brown)] focus-visible:ring-offset-2"
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
              onClick={handleSaveRinvio}
              disabled={saving}
            >
              {saving ? "Salvataggio..." : "Salva rinvio"}
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Add rinvio button */}
      {!showForm && (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-[var(--calendar-brown)] text-[var(--calendar-brown)] hover:bg-[var(--calendar-brown-pale)]"
          onClick={() => setShowForm(true)}
        >
          + Aggiungi rinvio di udienza
        </Button>
      )}
    </div>
  );
}
