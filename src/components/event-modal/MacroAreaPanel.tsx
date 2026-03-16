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

function getInputLabelFromKey(inputKey: string, fallback: string): string {
  if (!inputKey.startsWith("data") || inputKey.length <= "data".length) {
    return fallback;
  }
  const raw = inputKey.slice("data".length);
  if (!raw) return fallback;
  const words = raw.replace(/([A-Z])/g, " $1").trim().toLowerCase();
  const label = `Data ${words}`;
  return label.charAt(0).toUpperCase() + label.slice(1);
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
    ? ([...PARTI_PROCESSUALI] as ParteProcessuale[])
    : [];

  const eventiDisponibili =
    macroArea && procedimento && parteProcessuale
      ? getEventiDisponibili(macroArea, procedimento, parteProcessuale)
      : [];

  const selectedEvento =
    procedimento && eventoCode
      ? getEventoByCode(procedimento, eventoCode)
      : undefined;

  const handleDateChange = (key: string) => (d: Date | null) => {
    const value = d ? toDateOnlyString(d) : "";
    onInputsChange({ ...inputs, [key]: value });
  };

  const isNotificaCitazioneConDueDate =
    procedimento === "CITAZIONE_CIVILE" && eventoCode === "NOTIFICA_CITAZIONE";

  /** Convenuto – Costituzione convenuto: due date (udienza comparizione per -70 gg, data prima udienza per Prima udienza e Memorie). */
  const isCostituzioneConvenutoConDueDate =
    procedimento === "CITAZIONE_CIVILE" &&
    parteProcessuale === "CONVENUTO" &&
    eventoCode === "COSTITUZIONE_CONVENUTO";

  /** Iscrizione a ruolo, slittamento e Memorie 1,2,3: basta Data prima udienza, che da sola calcola tutte le date. */
  const soloDataPrimaUdienza =
    procedimento === "CITAZIONE_CIVILE" &&
    (eventoCode === "ISCRIZIONE_RUOLO" ||
      eventoCode === "SLITTAMENTO_UDIENZA" ||
      eventoCode === "MEMORIA_171TER_1" ||
      eventoCode === "MEMORIA_171TER_2" ||
      eventoCode === "MEMORIA_171TER_3");

  /** Per Citazione civile: Data prima udienza serve fino a Memoria 3 (ordine 7) per creare Prima udienza e Memorie 1,2,3. */
  const showDataPrimaUdienza =
    procedimento === "CITAZIONE_CIVILE" && selectedEvento && selectedEvento.ordine <= 7;

  const currentDate = selectedEvento
    ? toDateOrNull(inputs[selectedEvento.inputKey])
    : null;
  const currentDateLabel = selectedEvento
    ? getInputLabelFromKey(selectedEvento.inputKey, selectedEvento.label)
    : "";
  const dataNotificaCitazione = toDateOrNull(inputs["dataPrimaNotificaCitazione"]);
  const dataPrimaUdienza = toDateOrNull(inputs["dataPrimaUdienza"]);
  const dataUdienzaComparizione = toDateOrNull(inputs["dataUdienzaComparizione"]);

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

      {/* Livello 4: Fase */}
      {eventiDisponibili.length > 0 && (
        <div>
          <Label>Fase</Label>
          <Select
            value={eventoCode ?? ""}
            onValueChange={(v) => onEventoChange(v)}
          >
            <SelectTrigger className="bg-white border-zinc-200 text-zinc-900 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none">
              <SelectValue placeholder="*Fase non individuata (seleziona)*" />
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

      {/* Livello 5: Data (solo Data prima udienza per Iscrizione/Memorie 1,2,3; altrimenti data evento + eventuale Data prima udienza) */}
      {selectedEvento && soloDataPrimaUdienza && (
        <div className="pt-2 border-t border-zinc-200">
          <Label className="text-sm font-semibold text-zinc-700">
            Data prima udienza
          </Label>
          <DatePicker
            value={dataPrimaUdienza}
            onChange={handleDateChange("dataPrimaUdienza")}
            placeholder="Inserisci data prima udienza"
          />
          <p className="text-xs text-zinc-500 mt-1">
            Da questa data vengono calcolati l&apos;evento Prima udienza e le Memorie 171 ter n.1, n.2, n.3.
          </p>
        </div>
      )}
      {selectedEvento && isCostituzioneConvenutoConDueDate && (
        <div className="pt-2 border-t border-zinc-200 space-y-4">
          <div>
            <Label className="text-sm font-semibold text-zinc-700">
              Data udienza di comparizione
            </Label>
            <DatePicker
              value={dataUdienzaComparizione}
              onChange={handleDateChange("dataUdienzaComparizione")}
              placeholder="Inserisci data udienza di comparizione"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Usata per creare l&apos;evento Costituzione convenuto (70 giorni prima di questa data, art. 166 c.p.c.).
            </p>
          </div>
          <div>
            <Label className="text-sm font-semibold text-zinc-700">
              Data prima udienza
            </Label>
            <DatePicker
              value={dataPrimaUdienza}
              onChange={handleDateChange("dataPrimaUdienza")}
              placeholder="Inserisci data prima udienza"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Usata per l&apos;evento Prima udienza e per il calcolo delle Memorie 171 ter n.1, n.2, n.3.
            </p>
          </div>
        </div>
      )}
      {selectedEvento && !isNotificaCitazioneConDueDate && !soloDataPrimaUdienza && !isCostituzioneConvenutoConDueDate && (
        <div className="pt-2 border-t border-zinc-200 space-y-4">
          <div>
            <Label className="text-sm font-semibold text-zinc-700">
              {currentDateLabel}
            </Label>
            <DatePicker
              value={currentDate}
              onChange={handleDateChange(selectedEvento.inputKey)}
              placeholder={`Inserisci ${currentDateLabel.toLowerCase()}`}
            />
            <p className="text-xs text-zinc-500 mt-1">
              Questa è la data base da cui verranno calcolati i termini collegati all&apos;evento selezionato.
            </p>
          </div>
          {showDataPrimaUdienza && (
            <div>
              <Label className="text-sm font-semibold text-zinc-700">
                Data prima udienza
              </Label>
              <DatePicker
                value={dataPrimaUdienza}
                onChange={handleDateChange("dataPrimaUdienza")}
                placeholder="Inserisci data prima udienza"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Usata per l&apos;evento Prima udienza e per il calcolo delle Memorie 171 ter n.1, n.2, n.3.
              </p>
            </div>
          )}
        </div>
      )}
      {selectedEvento && isNotificaCitazioneConDueDate && (
        <div className="pt-2 border-t border-zinc-200 space-y-4">
          <div>
            <Label className="text-sm font-semibold text-zinc-700">
              Data notifica atto di citazione
            </Label>
            <DatePicker
              value={dataNotificaCitazione}
              onChange={handleDateChange("dataPrimaNotificaCitazione")}
              placeholder="Inserisci data notifica citazione"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Usata per l&apos;evento Notifica atto di citazione e per il calcolo di Iscrizione a ruolo (+10 gg).
            </p>
          </div>
          <div>
            <Label className="text-sm font-semibold text-zinc-700">
              Data prima udienza
            </Label>
            <DatePicker
              value={dataPrimaUdienza}
              onChange={handleDateChange("dataPrimaUdienza")}
              placeholder="Inserisci data prima udienza"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Usata per l&apos;evento Prima udienza e per il calcolo delle Memorie 171 ter n.1, n.2, n.3.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
