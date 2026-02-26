"use client";

import React from "react";
import { format, addDays } from "date-fns";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "./DatePicker";
import { DateTimePicker } from "./DateTimePicker";
import type {
  ActionType,
  ActionMode,
  SceltaTermineImpugnazione,
  MemoriaLibera,
} from "@/types/atto-giuridico";
import { SCELTA_TERMINE_IMPUGNAZIONE } from "@/types/atto-giuridico";

export interface AttoGiuridicoPanelProps {
  actionType: ActionType;
  actionMode: ActionMode;
  inputs: Record<string, unknown>;
  onInputsChange: (inputs: Record<string, unknown>) => void;
}

function getStr(inputs: Record<string, unknown>, key: string): string {
  const v = inputs[key];
  if (v instanceof Date) return v.toISOString().slice(0, 16);
  return (v as string) ?? "";
}

function getNum(inputs: Record<string, unknown>, key: string): number | undefined {
  const v = inputs[key];
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return isNaN(n) ? undefined : n;
  }
  return undefined;
}

function toDateOrNull(s: string): Date | null {
  const trimmed = s.slice(0, 10).trim();
  if (!trimmed) return null;
  const d = new Date(trimmed + "T12:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function toDateTime(s: string): Date {
  if (!s) return new Date();
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date() : d;
}

function toDateOnlyString(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

function getMemorieLibere(inputs: Record<string, unknown>): MemoriaLibera[] {
  const v = inputs.memorieLibere;
  if (Array.isArray(v)) return v as MemoriaLibera[];
  return [];
}

// ── Sotto-componente: blocco Memorie / Note libere ──────────────────

function MemorieLibereBlock({
  inputs,
  onInputsChange,
}: {
  inputs: Record<string, unknown>;
  onInputsChange: (inputs: Record<string, unknown>) => void;
}) {
  const memorie = getMemorieLibere(inputs);

  const addMemoria = () => {
    onInputsChange({
      ...inputs,
      memorieLibere: [...memorie, { titolo: "", scadenza: "" }],
    });
  };

  const updateMemoria = (idx: number, field: keyof MemoriaLibera, value: string) => {
    const updated = memorie.map((m, i) =>
      i === idx ? { ...m, [field]: value } : m
    );
    onInputsChange({ ...inputs, memorieLibere: updated });
  };

  const removeMemoria = (idx: number) => {
    onInputsChange({
      ...inputs,
      memorieLibere: memorie.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-3 rounded-md border border-dashed border-zinc-300 bg-white/60 p-4 mt-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-zinc-700">
          Memorie / Note libere
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={addMemoria}
        >
          + Aggiungi memoria
        </Button>
      </div>
      {memorie.length === 0 && (
        <p className="text-xs text-zinc-400">
          Nessuna memoria libera aggiunta. Usa il pulsante sopra per aggiungerne.
        </p>
      )}
      {memorie.map((m, idx) => (
        <div key={idx} className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="text-xs">Titolo</Label>
            <Input
              value={m.titolo}
              onChange={(e) => updateMemoria(idx, "titolo", e.target.value)}
              placeholder="Es. Memoria ex art. 183..."
              className="h-8 text-sm"
            />
          </div>
          <div className="w-[180px]">
            <Label className="text-xs">Scadenza</Label>
            <DatePicker
              value={toDateOrNull(m.scadenza)}
              onChange={(d) =>
                updateMemoria(idx, "scadenza", d ? toDateOnlyString(d) : "")
              }
              placeholder="Data scadenza"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
            onClick={() => removeMemoria(idx)}
            title="Rimuovi"
          >
            ✕
          </Button>
        </div>
      ))}
      {memorie.length > 0 && (
        <p className="text-xs text-zinc-400">
          Alert automatico: 5 giorni prima di ogni scadenza.
        </p>
      )}
    </div>
  );
}

// ── Panel principale ────────────────────────────────────────────────

export function AttoGiuridicoPanel({
  actionType,
  actionMode,
  inputs,
  onInputsChange,
}: AttoGiuridicoPanelProps) {
  const update = (key: string, value: unknown) => {
    onInputsChange({ ...inputs, [key]: value });
  };

  const dataNotificaStr = getStr(inputs, "dataNotifica");
  const dataNotificaDate = dataNotificaStr ? toDateOrNull(dataNotificaStr) : null;
  const minUdienzaDate = dataNotificaDate ? addDays(dataNotificaDate, 120) : null;

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50/50 px-5 py-5">
      <h4 className="text-sm font-medium text-zinc-700 pt-0.5 pb-1">
        Dati per il calcolo (date e opzioni)
      </h4>

      {/* ── CITAZIONE + DA_NOTIFICARE (ATTORE) ── */}
      {actionType === "CITAZIONE" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Data notifica citazione</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotifica"))}
              onChange={(d) => update("dataNotifica", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data notifica"
            />
          </div>
          {minUdienzaDate && (
            <p className="text-xs text-zinc-500 -mt-2">
              Data minima udienza (120 gg): {format(minUdienzaDate, "dd/MM/yyyy")}
            </p>
          )}
          <div>
            <Label>Data udienza comparizione</Label>
            <DateTimePicker
              value={toDateTime(getStr(inputs, "dataUdienzaComparizione"))}
              onChange={(d) => update("dataUdienzaComparizione", d.toISOString())}
              placeholder="Scegli data e ora udienza"
            />
          </div>
          <div>
            <Label>
              Data riferimento memorie 171 ter{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (default = udienza, modificabile se il giudice cambia la data)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(
                getStr(inputs, "dataUdienzaRiferimentoMemorie") ||
                  getStr(inputs, "dataUdienzaComparizione")
              )}
              onChange={(d) =>
                update("dataUdienzaRiferimentoMemorie", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data riferimento memorie"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="notifica-estero"
              checked={!!inputs.notificaEstero}
              onCheckedChange={(c) => update("notificaEstero", c === true)}
            />
            <Label htmlFor="notifica-estero">Notifica estero (150 gg)</Label>
          </div>
        </>
      )}

      {/* ── CITAZIONE + COSTITUZIONE (CONVENUTO) ── */}
      {actionType === "CITAZIONE" && actionMode === "COSTITUZIONE" && (
        <>
          <div>
            <Label>Data notifica citazione</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaCitazione"))}
              onChange={(d) =>
                update("dataNotificaCitazione", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>Data udienza comparizione</Label>
            <DateTimePicker
              value={toDateTime(getStr(inputs, "dataUdienzaComparizione"))}
              onChange={(d) => update("dataUdienzaComparizione", d.toISOString())}
              placeholder="Scegli data e ora"
            />
          </div>
          <div>
            <Label>
              Data riferimento memorie 171 ter{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (default = udienza, modificabile)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(
                getStr(inputs, "dataUdienzaRiferimentoMemorie") ||
                  getStr(inputs, "dataUdienzaComparizione")
              )}
              onChange={(d) =>
                update("dataUdienzaRiferimentoMemorie", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data riferimento memorie"
            />
          </div>
        </>
      )}

      {/* ── RICORSO OPPOSIZIONE + DA_NOTIFICARE (RICORRENTE) ── */}
      {actionType === "RICORSO_OPPOSIZIONE" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Data notifica decreto ingiuntivo</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaDecretoIngiuntivo"))}
              onChange={(d) =>
                update("dataNotificaDecretoIngiuntivo", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>
              Giorni per opposizione{" "}
              <span className="text-xs text-zinc-400 font-normal">(dalla notifica)</span>
            </Label>
            <Input
              type="number"
              min={1}
              value={getNum(inputs, "giorniOpposizione") ?? ""}
              onChange={(e) =>
                update(
                  "giorniOpposizione",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Es. 40"
              className="w-32"
            />
          </div>
          <div>
            <Label>
              Giorni iscrizione a ruolo{" "}
              <span className="text-xs text-zinc-400 font-normal">(dalla notifica)</span>
            </Label>
            <Input
              type="number"
              min={1}
              value={getNum(inputs, "giorniIscrizioneRuolo") ?? ""}
              onChange={(e) =>
                update(
                  "giorniIscrizioneRuolo",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Es. 10"
              className="w-32"
            />
          </div>
        </>
      )}

      {/* ── RICORSO OPPOSIZIONE + COSTITUZIONE (OPPOSTO) ── */}
      {actionType === "RICORSO_OPPOSIZIONE" && actionMode === "COSTITUZIONE" && (
        <>
          <div>
            <Label>Data udienza fissata</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataUdienza"))}
              onChange={(d) => update("dataUdienza", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data udienza"
            />
          </div>
          <div>
            <Label>
              Giorni per costituzione{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (prima dell&apos;udienza)
              </span>
            </Label>
            <Input
              type="number"
              min={1}
              value={getNum(inputs, "giorniCostituzione") ?? ""}
              onChange={(e) =>
                update(
                  "giorniCostituzione",
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              placeholder="Es. 10"
              className="w-32"
            />
          </div>
        </>
      )}

      {/* ── RICORSO TRIBUTARIO + DA_NOTIFICARE (RICORRENTE) ── */}
      {actionType === "RICORSO_TRIBUTARIO" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Data notifica atto impugnato</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaAttoImpugnato"))}
              onChange={(d) =>
                update("dataNotificaAttoImpugnato", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>
              Data notifica ricorso{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (per iscrizione a ruolo, 30 gg)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaRicorso"))}
              onChange={(d) =>
                update("dataNotificaRicorso", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>
              Data udienza{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (per memorie, inserire quando comunicata dal giudice)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataUdienza"))}
              onChange={(d) => update("dataUdienza", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data udienza"
            />
          </div>
        </>
      )}

      {/* ── RICORSO TRIBUTARIO + COSTITUZIONE (ENTE OPPOSTO) ── */}
      {actionType === "RICORSO_TRIBUTARIO" && actionMode === "COSTITUZIONE" && (
        <>
          <div>
            <Label>Data notifica ricorso</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaRicorso"))}
              onChange={(d) =>
                update("dataNotificaRicorso", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>
              Data udienza{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (per memorie, inserire quando comunicata dal giudice)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataUdienza"))}
              onChange={(d) => update("dataUdienza", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data udienza"
            />
          </div>
        </>
      )}

      {/* ── APPELLO CIVILE + DA_NOTIFICARE (APPELLANTE) ── */}
      {actionType === "APPELLO_CIVILE" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Termine impugnazione</Label>
            <Select
              value={(inputs.sceltaTermineImpugnazione as string) ?? "BREVE"}
              onValueChange={(v) =>
                update("sceltaTermineImpugnazione", v as SceltaTermineImpugnazione)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCELTA_TERMINE_IMPUGNAZIONE.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "BREVE"
                      ? "Breve (30 gg da notifica)"
                      : "Lungo (6 mesi da pubblicazione)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(inputs.sceltaTermineImpugnazione as string) !== "LUNGO" && (
            <div>
              <Label>Data notifica sentenza</Label>
              <DatePicker
                value={toDateOrNull(getStr(inputs, "dataNotificaSentenza"))}
                onChange={(d) =>
                  update("dataNotificaSentenza", d ? toDateOnlyString(d) : "")
                }
                placeholder="Scegli data"
              />
            </div>
          )}
          {(inputs.sceltaTermineImpugnazione as string) === "LUNGO" && (
            <div>
              <Label>Data pubblicazione sentenza</Label>
              <DatePicker
                value={toDateOrNull(getStr(inputs, "dataPubblicazioneSentenza"))}
                onChange={(d) =>
                  update("dataPubblicazioneSentenza", d ? toDateOnlyString(d) : "")
                }
                placeholder="Scegli data"
              />
            </div>
          )}
          <div>
            <Label>
              Data notifica appello{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (per iscrizione a ruolo, 10 gg)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaAppello"))}
              onChange={(d) =>
                update("dataNotificaAppello", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data"
            />
          </div>
        </>
      )}

      {/* ── APPELLO CIVILE + COSTITUZIONE (APPELLATO) ── */}
      {actionType === "APPELLO_CIVILE" && actionMode === "COSTITUZIONE" && (
        <div>
          <Label>Data udienza</Label>
          <DatePicker
            value={toDateOrNull(getStr(inputs, "dataUdienza"))}
            onChange={(d) => update("dataUdienza", d ? toDateOnlyString(d) : "")}
            placeholder="Scegli data udienza"
          />
        </div>
      )}

      {/* ── APPELLO TRIBUTARIO + DA_NOTIFICARE (APPELLANTE) ── */}
      {actionType === "APPELLO_TRIBUTARIO" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Termine impugnazione</Label>
            <Select
              value={(inputs.sceltaTermineImpugnazione as string) ?? "BREVE"}
              onValueChange={(v) =>
                update("sceltaTermineImpugnazione", v as SceltaTermineImpugnazione)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCELTA_TERMINE_IMPUGNAZIONE.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "BREVE" ? "Breve (60 gg)" : "Lungo (6 mesi)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(inputs.sceltaTermineImpugnazione as string) !== "LUNGO" && (
            <div>
              <Label>Data notifica sentenza tributaria</Label>
              <DatePicker
                value={toDateOrNull(
                  getStr(inputs, "dataNotificaSentenzaTributaria")
                )}
                onChange={(d) =>
                  update(
                    "dataNotificaSentenzaTributaria",
                    d ? toDateOnlyString(d) : ""
                  )
                }
                placeholder="Scegli data"
              />
            </div>
          )}
          {(inputs.sceltaTermineImpugnazione as string) === "LUNGO" && (
            <div>
              <Label>Data pubblicazione sentenza tributaria</Label>
              <DatePicker
                value={toDateOrNull(
                  getStr(inputs, "dataPubblicazioneSentenzaTributaria")
                )}
                onChange={(d) =>
                  update(
                    "dataPubblicazioneSentenzaTributaria",
                    d ? toDateOnlyString(d) : ""
                  )
                }
                placeholder="Scegli data"
              />
            </div>
          )}
          <div>
            <Label>
              Data notifica appello{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (per iscrizione a ruolo, 30 gg)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaAppello"))}
              onChange={(d) =>
                update("dataNotificaAppello", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>
              Data udienza{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (per memorie, inserire quando comunicata dal giudice)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataUdienza"))}
              onChange={(d) => update("dataUdienza", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data udienza"
            />
          </div>
        </>
      )}

      {/* ── APPELLO TRIBUTARIO + COSTITUZIONE (APPELLATO) ── */}
      {actionType === "APPELLO_TRIBUTARIO" && actionMode === "COSTITUZIONE" && (
        <>
          <div>
            <Label>Data notifica ricorso/appello</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaRicorso"))}
              onChange={(d) =>
                update("dataNotificaRicorso", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>
              Data udienza{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (per memorie, inserire quando comunicata dal giudice)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataUdienza"))}
              onChange={(d) => update("dataUdienza", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data udienza"
            />
          </div>
        </>
      )}

      {/* ── RICORSO CASSAZIONE + DA_NOTIFICARE (RICORRENTE) ── */}
      {actionType === "RICORSO_CASSAZIONE" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Termine impugnazione</Label>
            <Select
              value={(inputs.sceltaTermineImpugnazione as string) ?? "BREVE"}
              onValueChange={(v) =>
                update("sceltaTermineImpugnazione", v as SceltaTermineImpugnazione)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCELTA_TERMINE_IMPUGNAZIONE.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s === "BREVE" ? "Breve (60 gg)" : "Lungo (6 mesi)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(inputs.sceltaTermineImpugnazione as string) !== "LUNGO" && (
            <div>
              <Label>Data notifica sentenza</Label>
              <DatePicker
                value={toDateOrNull(getStr(inputs, "dataNotificaSentenza"))}
                onChange={(d) =>
                  update("dataNotificaSentenza", d ? toDateOnlyString(d) : "")
                }
                placeholder="Scegli data"
              />
            </div>
          )}
          {(inputs.sceltaTermineImpugnazione as string) === "LUNGO" && (
            <div>
              <Label>Data pubblicazione sentenza</Label>
              <DatePicker
                value={toDateOrNull(getStr(inputs, "dataPubblicazioneSentenza"))}
                onChange={(d) =>
                  update("dataPubblicazioneSentenza", d ? toDateOnlyString(d) : "")
                }
                placeholder="Scegli data"
              />
            </div>
          )}
          <div>
            <Label>
              Data notifica ricorso{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (per iscrizione a ruolo, 20 gg)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaRicorso"))}
              onChange={(d) =>
                update("dataNotificaRicorso", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>
              Data udienza{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (per memorie, inserire quando comunicata dal giudice)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataUdienza"))}
              onChange={(d) => update("dataUdienza", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data udienza"
            />
          </div>
        </>
      )}

      {/* ── RICORSO CASSAZIONE + COSTITUZIONE (CONTRORICORRENTE) ── */}
      {actionType === "RICORSO_CASSAZIONE" && actionMode === "COSTITUZIONE" && (
        <>
          <div>
            <Label>Data notifica ricorso per cassazione</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaRicorso"))}
              onChange={(d) =>
                update("dataNotificaRicorso", d ? toDateOnlyString(d) : "")
              }
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>
              Data udienza{" "}
              <span className="text-xs text-zinc-400 font-normal">
                (per memorie, inserire quando comunicata dal giudice)
              </span>
            </Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataUdienza"))}
              onChange={(d) => update("dataUdienza", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data udienza"
            />
          </div>
        </>
      )}

      {/* ── Memorie / Note libere (per tutte le combinazioni) ── */}
      <MemorieLibereBlock inputs={inputs} onInputsChange={onInputsChange} />
    </div>
  );
}
