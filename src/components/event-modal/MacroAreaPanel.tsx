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
  getEventiDisponibili,
  getEventoByCode,
} from "@/types/macro-areas";

interface MacroAreaPanelProps {
  macroArea: MacroAreaCode | null;
  procedimento: ProcedimentoCode | null;
  parteProcessuale: ParteProcessuale | null;
  eventoCode: string | null;
  inputs: Record<string, unknown>;
  onMacroAreaChange: (v: MacroAreaCode) => void;
  onProcedimentoChange: (v: ProcedimentoCode) => void;
  onParteProcessualeChange: (v: ParteProcessuale) => void;
  onEventoChange: (code: string) => void;
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

export function MacroAreaPanel({
  macroArea,
  procedimento,
  parteProcessuale,
  eventoCode,
  inputs,
  onMacroAreaChange,
  onProcedimentoChange,
  onParteProcessualeChange,
  onEventoChange,
  onInputsChange,
}: MacroAreaPanelProps) {
  const procedimenti = macroArea
    ? (PROCEDIMENTI_PER_MACRO_AREA[macroArea] as readonly string[])
    : [];

  const partiLabels = macroArea ? PARTI_LABELS[macroArea] : null;

  const selectableParti: ParteProcessuale[] = partiLabels
    ? (PARTI_PROCESSUALI.filter((p) => p !== "COMUNE") as ParteProcessuale[])
    : [];

  const eventiDisponibili =
    macroArea && procedimento && parteProcessuale
      ? getEventiDisponibili(macroArea, procedimento, parteProcessuale)
      : [];

  const selectedEvento =
    procedimento && eventoCode
      ? getEventoByCode(procedimento, eventoCode)
      : undefined;

  const handleDateChange = (d: Date | null) => {
    if (!selectedEvento) return;
    const value = d ? toDateOnlyString(d) : "";
    onInputsChange({ ...inputs, [selectedEvento.inputKey]: value });
  };

  const currentDate = selectedEvento
    ? toDateOrNull(inputs[selectedEvento.inputKey])
    : null;

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

      {/* Livello 4: Evento */}
      {eventiDisponibili.length > 0 && (
        <div>
          <Label>Evento</Label>
          <Select
            value={eventoCode ?? ""}
            onValueChange={(v) => onEventoChange(v)}
          >
            <SelectTrigger className="bg-white border-zinc-200 text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
              <SelectValue placeholder="Seleziona evento" />
            </SelectTrigger>
            <SelectContent>
              {eventiDisponibili.map((ev) => (
                <SelectItem key={ev.code} value={ev.code}>
                  {ev.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Livello 5: Data */}
      {selectedEvento && (
        <div className="pt-2 border-t border-zinc-200">
          <Label className="text-sm font-semibold text-zinc-700">
            Data – {selectedEvento.label}
          </Label>
          <DatePicker
            value={currentDate}
            onChange={handleDateChange}
            placeholder={`Inserisci data ${selectedEvento.label.toLowerCase()}`}
          />
        </div>
      )}
    </div>
  );
}
