"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./DatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  MacroAreaCode,
  ProcedimentoCode,
  ParteProcessuale,
} from "@/types/macro-areas";
import {
  MACRO_AREAS,
  MACRO_AREA_LABELS,
  PROCEDIMENTI_PER_MACRO_AREA,
  PROCEDIMENTO_LABELS,
  PARTI_PROCESSUALI,
  PARTI_LABELS,
  getRequiredInputKeys,
} from "@/types/macro-areas";

interface MacroAreaPanelProps {
  macroArea: MacroAreaCode | null;
  procedimento: ProcedimentoCode | null;
  parteProcessuale: ParteProcessuale | null;
  inputs: Record<string, unknown>;
  onMacroAreaChange: (v: MacroAreaCode) => void;
  onProcedimentoChange: (v: ProcedimentoCode) => void;
  onParteProcessualeChange: (v: ParteProcessuale) => void;
  onInputsChange: (inputs: Record<string, unknown>) => void;
}

function toDateOnlyString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toDateOrNull(v: unknown): Date | null {
  if (!v || typeof v !== "string") return null;
  const d = new Date(v.length === 10 ? v + "T12:00:00" : v);
  return isNaN(d.getTime()) ? null : d;
}

const INPUT_LABELS: Record<string, string> = {
  dataPrimaUdienza: "Data prima udienza",
  dataPrimaNotificaCitazione: "Data prima notifica atto di citazione",
  dataNotifica: "Data notifica",
  dataNotificaCitazione: "Data notifica citazione",
  dataUdienzaComparizione: "Data udienza di comparizione",
  dataUdienzaRiferimentoMemorie: "Data udienza rif. memorie",
  dataSlittamentoUdienza: "Data slittamento udienza",
  dataUdienzaIstruttoria: "Data udienza istruttoria",
  dataUdienzaConclusioni: "Data udienza conclusioni",
  dataPubblicazioneSentenza: "Data pubblicazione/deposito sentenza",
  dataNotificaSentenza: "Data notifica sentenza",
  dataNotificaDecretoIngiuntivo: "Data notifica decreto ingiuntivo",
  dataNotificaAttoImpugnato: "Data notifica atto impugnato",
  dataNotificaRicorso: "Data notifica ricorso",
  dataNotificaAppello: "Data notifica appello",
  dataUdienza: "Data udienza",
  dataDepositoRicorso: "Data deposito ricorso",
  dataNotificaPrecetto: "Data notifica precetto",
  dataNotificaPignoramento: "Data notifica pignoramento",
  dataInvioDiffida: "Data invio diffida",
  dataIncontroMediazione: "Data incontro mediazione",
};

function labelForKey(key: string): string {
  return INPUT_LABELS[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

export function MacroAreaPanel({
  macroArea,
  procedimento,
  parteProcessuale,
  inputs,
  onMacroAreaChange,
  onProcedimentoChange,
  onParteProcessualeChange,
  onInputsChange,
}: MacroAreaPanelProps) {
  const procedimenti = macroArea
    ? (PROCEDIMENTI_PER_MACRO_AREA[macroArea] as readonly string[])
    : [];

  const partiLabels = macroArea ? PARTI_LABELS[macroArea] : null;

  const selectableParti: ParteProcessuale[] = partiLabels
    ? (PARTI_PROCESSUALI.filter((p) => p !== "COMUNE") as ParteProcessuale[])
    : [];

  const inputKeys =
    macroArea && procedimento && parteProcessuale
      ? getRequiredInputKeys(macroArea, procedimento, parteProcessuale)
      : [];

  const updateInput = (key: string, value: unknown) => {
    onInputsChange({ ...inputs, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Livello 1: Macro Area */}
      <div>
        <Label>Macro Area</Label>
        <Select
          value={macroArea ?? ""}
          onValueChange={(v) => onMacroAreaChange(v as MacroAreaCode)}
        >
          <SelectTrigger className="bg-white border-zinc-200 text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
            <SelectValue placeholder="Seleziona macro area" />
          </SelectTrigger>
          <SelectContent>
            {MACRO_AREAS.map((ma) => (
              <SelectItem key={ma} value={ma}>
                {MACRO_AREA_LABELS[ma]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Livello 2: Procedimento */}
      {macroArea && procedimenti.length > 0 && (
        <div>
          <Label>Procedimento</Label>
          <Select
            value={procedimento ?? ""}
            onValueChange={(v) => onProcedimentoChange(v as ProcedimentoCode)}
          >
            <SelectTrigger className="bg-white border-zinc-200 text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
              <SelectValue placeholder="Seleziona procedimento" />
            </SelectTrigger>
            <SelectContent>
              {procedimenti.map((p) => (
                <SelectItem key={p} value={p}>
                  {PROCEDIMENTO_LABELS[p as ProcedimentoCode] ?? p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Livello 3: Parte processuale */}
      {macroArea && procedimento && selectableParti.length > 0 && (
        <div>
          <Label>Parte processuale</Label>
          <Select
            value={parteProcessuale ?? ""}
            onValueChange={(v) => onParteProcessualeChange(v as ParteProcessuale)}
          >
            <SelectTrigger className="bg-white border-zinc-200 text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
              <SelectValue placeholder="Seleziona parte" />
            </SelectTrigger>
            <SelectContent>
              {selectableParti.map((p) => (
                <SelectItem key={p} value={p}>
                  {partiLabels?.[p] ?? p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-zinc-500 mt-1">
            Gli eventi comuni a entrambe le parti verranno inclusi automaticamente.
          </p>
        </div>
      )}

      {/* Livello 4: Campi input dinamici */}
      {inputKeys.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-zinc-200">
          <Label className="text-sm font-semibold text-zinc-700">Dati per il calcolo</Label>
          {inputKeys.map((key) => (
            <div key={key}>
              <Label className="text-xs">{labelForKey(key)}</Label>
              <DatePicker
                value={toDateOrNull(inputs[key])}
                onChange={(d) => updateInput(key, d ? toDateOnlyString(d) : "")}
                placeholder={labelForKey(key)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
