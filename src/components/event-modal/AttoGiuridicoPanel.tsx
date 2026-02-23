"use client";

import React from "react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "./DatePicker";
import { DateTimePicker } from "./DateTimePicker";
import type { ActionType, ActionMode, SceltaTermineImpugnazione } from "@/types/atto-giuridico";
import { SCELTA_TERMINE_IMPUGNAZIONE } from "@/types/atto-giuridico";

export interface AttoGiuridicoPanelProps {
  actionType: ActionType;
  actionMode: ActionMode;
  inputs: Record<string, unknown>;
  onInputsChange: (inputs: Record<string, unknown>) => void;
}

/** Restituisce valore stringa per input date (ISO date o datetime) */
function getStr(inputs: Record<string, unknown>, key: string): string {
  const v = inputs[key];
  if (v instanceof Date) return v.toISOString().slice(0, 16);
  return (v as string) ?? "";
}

function toDateOrNull(s: string): Date | null {
  const trimmed = s.slice(0, 10).trim();
  if (!trimmed) return null;
  const d = new Date(trimmed + "T12:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function toDateTime(s: string): Date {
  const str = getStr({ [""]: s }, "");
  if (!str) return new Date();
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
}

/** Data selezionata nel calendario → stringa YYYY-MM-DD in ora locale (evita giorno sbagliato per fuso) */
function toDateOnlyString(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function AttoGiuridicoPanel({
  actionType,
  actionMode,
  inputs,
  onInputsChange,
}: AttoGiuridicoPanelProps) {
  const update = (key: string, value: unknown) => {
    onInputsChange({ ...inputs, [key]: value });
  };

  return (
    <div className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50/50 px-5 py-5">
      <h4 className="text-sm font-medium text-zinc-700 pt-0.5 pb-1">Dati per il calcolo (date e opzioni)</h4>

      {/* Periferiche: campi in base a (actionType, actionMode) */}
      {actionType === "CITAZIONE" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Data udienza comparizione (evento in calendario)</Label>
            <DateTimePicker
              value={toDateTime(getStr(inputs, "dataUdienzaComparizione"))}
              onChange={(d) => update("dataUdienzaComparizione", d.toISOString())}
              placeholder="Scegli data e ora"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="notifica-estero"
              checked={!!inputs.notificaEstero}
              onCheckedChange={(c) => update("notificaEstero", c === true)}
            />
            <Label htmlFor="notifica-estero">Notifica estero</Label>
          </div>
        </>
      )}

      {actionType === "CITAZIONE" && actionMode === "COSTITUZIONE" && (
        <>
          <div>
            <Label>Data notifica citazione</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaCitazione"))}
              onChange={(d) => update("dataNotificaCitazione", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>Data udienza comparizione (opzionale, per termine convenuto)</Label>
            <DateTimePicker
              value={toDateTime(getStr(inputs, "dataUdienzaComparizione"))}
              onChange={(d) => update("dataUdienzaComparizione", d.toISOString())}
              placeholder="Scegli data e ora"
            />
          </div>
        </>
      )}

      {actionType === "RICORSO_OPPOSIZIONE" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Data notifica decreto ingiuntivo</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaDecretoIngiuntivo"))}
              onChange={(d) => update("dataNotificaDecretoIngiuntivo", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>Data udienza opposizione (opzionale)</Label>
            <DateTimePicker
              value={toDateTime(getStr(inputs, "dataUdienzaOpposizione"))}
              onChange={(d) => update("dataUdienzaOpposizione", d.toISOString())}
              placeholder="Scegli data e ora"
            />
          </div>
        </>
      )}

      {actionType === "RICORSO_OPPOSIZIONE" && actionMode === "COSTITUZIONE" && (
        <div>
          <Label>Data notifica atto opposizione</Label>
          <DatePicker
            value={toDateOrNull(getStr(inputs, "dataNotificaAttoOpposizione"))}
            onChange={(d) => update("dataNotificaAttoOpposizione", d ? toDateOnlyString(d) : "")}
            placeholder="Scegli data"
          />
        </div>
      )}

      {actionType === "RICORSO_TRIBUTARIO" && actionMode === "DA_NOTIFICARE" && (
        <div>
          <Label>Data notifica atto impugnato</Label>
          <DatePicker
            value={toDateOrNull(getStr(inputs, "dataNotificaAttoImpugnato"))}
            onChange={(d) => update("dataNotificaAttoImpugnato", d ? toDateOnlyString(d) : "")}
            placeholder="Scegli data"
          />
        </div>
      )}

      {actionType === "RICORSO_TRIBUTARIO" && actionMode === "COSTITUZIONE" && (
        <>
          <div>
            <Label>Data proposizione ricorso</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataProposizioneRicorso"))}
              onChange={(d) => update("dataProposizioneRicorso", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data"
            />
          </div>
          <div>
            <Label>Data notifica ricorso (opzionale)</Label>
            <DatePicker
              value={toDateOrNull(getStr(inputs, "dataNotificaRicorso"))}
              onChange={(d) => update("dataNotificaRicorso", d ? toDateOnlyString(d) : "")}
              placeholder="Scegli data"
            />
          </div>
        </>
      )}

      {actionType === "APPELLO_CIVILE" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Termine impugnazione</Label>
            <Select
              value={(inputs.sceltaTermineImpugnazione as string) ?? "BREVE"}
              onValueChange={(v) => update("sceltaTermineImpugnazione", v as SceltaTermineImpugnazione)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCELTA_TERMINE_IMPUGNAZIONE.map((s) => (
                  <SelectItem key={s} value={s}>{s === "BREVE" ? "Breve (30 gg da notifica)" : "Lungo (6 mesi da pubblicazione)"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(inputs.sceltaTermineImpugnazione as string) !== "LUNGO" && (
            <div>
              <Label>Data notifica sentenza</Label>
              <DatePicker
                value={toDateOrNull(getStr(inputs, "dataNotificaSentenza"))}
                onChange={(d) => update("dataNotificaSentenza", d ? toDateOnlyString(d) : "")}
                placeholder="Scegli data"
              />
            </div>
          )}
          {(inputs.sceltaTermineImpugnazione as string) === "LUNGO" && (
            <div>
              <Label>Data pubblicazione sentenza</Label>
              <DatePicker
                value={toDateOrNull(getStr(inputs, "dataPubblicazioneSentenza"))}
                onChange={(d) => update("dataPubblicazioneSentenza", d ? toDateOnlyString(d) : "")}
                placeholder="Scegli data"
              />
            </div>
          )}
        </>
      )}

      {actionType === "APPELLO_CIVILE" && actionMode === "COSTITUZIONE" && (
        <div>
          <Label>Data notifica atto appello</Label>
          <DatePicker
            value={toDateOrNull(getStr(inputs, "dataNotificaAttoAppello"))}
            onChange={(d) => update("dataNotificaAttoAppello", d ? toDateOnlyString(d) : "")}
            placeholder="Scegli data"
          />
        </div>
      )}

      {actionType === "APPELLO_TRIBUTARIO" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Termine impugnazione</Label>
            <Select
              value={(inputs.sceltaTermineImpugnazione as string) ?? "BREVE"}
              onValueChange={(v) => update("sceltaTermineImpugnazione", v as SceltaTermineImpugnazione)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCELTA_TERMINE_IMPUGNAZIONE.map((s) => (
                  <SelectItem key={s} value={s}>{s === "BREVE" ? "Breve (60 gg)" : "Lungo (6 mesi)"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(inputs.sceltaTermineImpugnazione as string) !== "LUNGO" && (
            <div>
              <Label>Data notifica sentenza tributaria</Label>
              <DatePicker
                value={toDateOrNull(getStr(inputs, "dataNotificaSentenzaTributaria"))}
                onChange={(d) => update("dataNotificaSentenzaTributaria", d ? toDateOnlyString(d) : "")}
                placeholder="Scegli data"
              />
            </div>
          )}
          {(inputs.sceltaTermineImpugnazione as string) === "LUNGO" && (
            <div>
              <Label>Data pubblicazione sentenza tributaria</Label>
              <DatePicker
                value={toDateOrNull(getStr(inputs, "dataPubblicazioneSentenzaTributaria"))}
                onChange={(d) => update("dataPubblicazioneSentenzaTributaria", d ? toDateOnlyString(d) : "")}
                placeholder="Scegli data"
              />
            </div>
          )}
        </>
      )}

      {actionType === "APPELLO_TRIBUTARIO" && actionMode === "COSTITUZIONE" && (
        <div>
          <Label>Data notifica appello tributario</Label>
          <DatePicker
            value={toDateOrNull(getStr(inputs, "dataNotificaAppelloTributario"))}
            onChange={(d) => update("dataNotificaAppelloTributario", d ? toDateOnlyString(d) : "")}
            placeholder="Scegli data"
          />
        </div>
      )}

      {actionType === "RICORSO_CASSAZIONE" && actionMode === "DA_NOTIFICARE" && (
        <>
          <div>
            <Label>Termine impugnazione</Label>
            <Select
              value={(inputs.sceltaTermineImpugnazione as string) ?? "BREVE"}
              onValueChange={(v) => update("sceltaTermineImpugnazione", v as SceltaTermineImpugnazione)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCELTA_TERMINE_IMPUGNAZIONE.map((s) => (
                  <SelectItem key={s} value={s}>{s === "BREVE" ? "Breve (60 gg)" : "Lungo (6 mesi)"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(inputs.sceltaTermineImpugnazione as string) !== "LUNGO" && (
            <div>
              <Label>Data notifica sentenza</Label>
              <DatePicker
                value={toDateOrNull(getStr(inputs, "dataNotificaSentenza"))}
                onChange={(d) => update("dataNotificaSentenza", d ? toDateOnlyString(d) : "")}
                placeholder="Scegli data"
              />
            </div>
          )}
          {(inputs.sceltaTermineImpugnazione as string) === "LUNGO" && (
            <div>
              <Label>Data pubblicazione sentenza</Label>
              <DatePicker
                value={toDateOrNull(getStr(inputs, "dataPubblicazioneSentenza"))}
                onChange={(d) => update("dataPubblicazioneSentenza", d ? toDateOnlyString(d) : "")}
                placeholder="Scegli data"
              />
            </div>
          )}
        </>
      )}

      {actionType === "RICORSO_CASSAZIONE" && actionMode === "COSTITUZIONE" && (
        <div>
          <Label>Data ultima notifica ricorso per cassazione</Label>
          <DatePicker
            value={toDateOrNull(getStr(inputs, "dataUltimaNotificaRicorsoCassazione"))}
            onChange={(d) => update("dataUltimaNotificaRicorsoCassazione", d ? toDateOnlyString(d) : "")}
            placeholder="Scegli data"
          />
        </div>
      )}
    </div>
  );
}
