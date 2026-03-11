/**
 * Data-driven rule engine: genera sotto-eventi a partire da EventRule[].
 * Sostituisce la logica if/else hardcoded di atto-giuridico.ts per la nuova gerarchia.
 *
 * Modalità attuale (atto giuridico data-driven):
 * - viene sempre selezionato un singolo "Evento" (riga Excel) dal form
 * - il motore genera i sotto-eventi SOLO per quella riga (singola scadenza/attività + promemoria)
 *
 * Le proprietà `eventoBaseKey` / `providesInputKey` restano supportate a livello di dati
 * ma non viene più usato il chaining iterativo multi-riga: ogni invocazione lavora
 * su una sola EventRule filtrata dal code dell'evento selezionato.
 */

import type { RuleDefinition, SubEventCandidate, AppSettings } from "../types";
import { addDays, addMonths, addYears } from "date-fns";
import {
  adjustToNextBusinessDay,
  applyDeadlineTime,
  assignTimeSlots,
} from "@/lib/date-utils";
import type {
  MacroAreaCode,
  ProcedimentoCode,
  ParteProcessuale,
  EventRule,
} from "@/types/macro-areas";
import { getEventRulesFor, getEventoByCode } from "@/types/macro-areas";

function computeDate(
  base: Date,
  direzione: "+" | "-",
  numero: number,
  unita: "giorni" | "mesi" | "anno",
): Date {
  const sign = direzione === "-" ? -1 : 1;
  const amount = numero * sign;
  switch (unita) {
    case "giorni":
      return addDays(base, amount);
    case "mesi":
      return addMonths(base, amount);
    case "anno":
      return addYears(base, amount);
    default:
      return addDays(base, amount);
  }
}

function toDateOnlyString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

interface ProcessResult {
  subEvents: SubEventCandidate[];
}

function processRule(
  rule: EventRule,
  inputs: Record<string, unknown>,
  settings: AppSettings,
  reminderOffsets: number[],
  selectedEventoInputKey?: string,
): ProcessResult {
  const out: SubEventCandidate[] = [];

  // Determina la data base per questa riga.
  let baseValue: string | undefined;

  if (rule.eventoBaseKey) {
    baseValue = inputs[rule.eventoBaseKey] as string | undefined;
  } else if (selectedEventoInputKey) {
    baseValue = inputs[selectedEventoInputKey] as string | undefined;
  }

  if (!baseValue || typeof baseValue !== "string" || !baseValue.trim()) {
    return { subEvents: out };
  }

  const baseDate = new Date(
    baseValue.length === 10 ? baseValue + "T12:00:00" : baseValue
  );
  if (isNaN(baseDate.getTime())) return { subEvents: out };

  // Caso 1: riga con calcolo completo → crea scadenza + promemoria.
  if (
    rule.direzioneCalcolo != null &&
    rule.numero != null &&
    rule.unita != null
  ) {
    let dueDate = computeDate(baseDate, rule.direzioneCalcolo, rule.numero, rule.unita);

    if (rule.isPromemoriaFestivi) {
      dueDate = adjustToNextBusinessDay(dueDate, settings);
    }

    const dueAt = applyDeadlineTime(dueDate, settings);

    const explanation = [
      rule.eventoLabel,
      `${rule.direzioneCalcolo === "+" ? "+" : "−"}${rule.numero} ${rule.unita} da ${rule.eventoBaseKey ?? selectedEventoInputKey ?? "data evento"}`,
      rule.norma ? `(${rule.norma})` : null,
      rule.isSospensioneFeriale ? "[sosp. feriale]" : null,
    ].filter(Boolean).join(" – ");

    out.push({
      title: rule.eventoLabel,
      kind: "termine",
      dueAt,
      status: "pending",
      priority: rule.ordine,
      ruleId: "data-driven",
      ruleParams: {
        macroArea: rule.macroArea,
        procedimento: rule.procedimento,
        parteProcessuale: rule.parteProcessuale,
        eventoBaseKey: rule.eventoBaseKey ?? selectedEventoInputKey,
        direzione: rule.direzioneCalcolo,
        numero: rule.numero,
        unita: rule.unita,
        tipoTermine: rule.tipoTermine,
        norma: rule.norma,
      },
      explanation,
      createdBy: "automatico",
      isPlaceholder: false,
    });

    for (const daysBefore of reminderOffsets) {
      const offset = daysBefore > 0 ? -daysBefore : daysBefore;
      const reminderRaw = addDays(dueDate, offset);
      const reminderAdjusted = adjustToNextBusinessDay(reminderRaw, settings);
      const reminderAt = applyDeadlineTime(reminderAdjusted, settings);
      out.push({
        title: `${rule.eventoLabel} – Promemoria (${Math.abs(offset)} gg prima)`,
        kind: "promemoria",
        dueAt: reminderAt,
        status: "pending",
        priority: 0,
        ruleId: "data-driven",
        ruleParams: { daysBefore: offset },
        explanation: `Promemoria ${Math.abs(offset)} giorni prima della scadenza`,
        createdBy: "automatico",
        isPlaceholder: false,
      });
    }

    // Anche se la riga ha providesInputKey, nella modalità corrente non
    // re-iniettiamo più la data come nuovo input per altre righe: ogni invocazione
    // lavora su un solo evento selezionato dal form.
    return { subEvents: out };
  }

  // Caso 2: riga senza calcolo → evento alla data base + promemoria legati a quella data.
  const eventAt = applyDeadlineTime(baseDate, settings);
  out.push({
    title: rule.eventoLabel,
    kind: "attivita",
    dueAt: eventAt,
    status: "pending",
    priority: rule.ordine,
    ruleId: "data-driven",
    ruleParams: {
      macroArea: rule.macroArea,
      procedimento: rule.procedimento,
      parteProcessuale: rule.parteProcessuale,
      eventoBaseKey: rule.eventoBaseKey ?? selectedEventoInputKey,
      tipoTermine: rule.tipoTermine,
      norma: rule.norma,
    },
    explanation: rule.norma ? `${rule.eventoLabel} – ${rule.norma}` : rule.eventoLabel,
    createdBy: "automatico",
    isPlaceholder: false,
  });

  for (const daysBefore of reminderOffsets) {
    const offset = daysBefore > 0 ? -daysBefore : daysBefore;
    const reminderRaw = addDays(baseDate, offset);
    const reminderAdjusted = adjustToNextBusinessDay(reminderRaw, settings);
    const reminderAt = applyDeadlineTime(reminderAdjusted, settings);
    out.push({
      title: `${rule.eventoLabel} – Promemoria (${Math.abs(offset)} gg prima)`,
      kind: "promemoria",
      dueAt: reminderAt,
      status: "pending",
      priority: 0,
      ruleId: "data-driven",
      ruleParams: { daysBefore: offset },
      explanation: `Promemoria ${Math.abs(offset)} giorni prima dell'evento`,
      createdBy: "automatico",
      isPlaceholder: false,
    });
  }

  return { subEvents: out };
}

export const dataDrivenRule: RuleDefinition = {
  id: "data-driven",
  label: "Regole data-driven (nuova gerarchia)",
  run(input) {
    const event = input.event;
    const settings = input.settings;
    const inputs = { ...((event.inputs ?? input.userSelections ?? {}) as Record<string, unknown>) };

    const macroArea = (event.macroArea ?? inputs.macroArea) as MacroAreaCode | undefined;
    const procedimento = (event.procedimento ?? inputs.procedimento) as ProcedimentoCode | undefined;
    const parteProcessuale = (event.parteProcessuale ?? inputs.parteProcessuale) as ParteProcessuale | undefined;

    if (!macroArea || !procedimento || !parteProcessuale) {
      return { subEvents: [] };
    }

    // In modalità data-driven attuale è obbligatorio che il form (o l'AI)
    // abbiano selezionato un singolo evento (eventoCode): se manca, non
    // generiamo nulla per evitare combinazioni ambigue multi-riga.
    const eventoCode =
      (event as { eventoCode?: string | null }).eventoCode ??
      (inputs.eventoCode as string | undefined);
    if (!eventoCode) {
      return { subEvents: [] };
    }

    const ev = getEventoByCode(procedimento, eventoCode);
    if (!ev) {
      return { subEvents: [] };
    }

    const selectedEventoInputKey = ev.inputKey;

    // Recupera tutte le regole per la combinazione (macroArea, procedimento, parte)
    // e poi filtra per etichetta esatta dell'evento selezionato (una singola riga).
    const allRules = getEventRulesFor(macroArea, procedimento, parteProcessuale);
    const rules = allRules.filter((r) => r.eventoLabel === ev.label);
    if (rules.length === 0) {
      return { subEvents: [] };
    }

    const rawOffsets = (inputs.reminderOffsets as number[] | undefined)
      ?? settings.defaultReminderOffsetsAtto
      ?? [7];
    const reminderOffsets = rawOffsets.map((d) => (d > 0 ? -d : d));

    const out: SubEventCandidate[] = [];

    for (const rule of rules) {
      const result = processRule(
        rule,
        inputs,
        settings,
        reminderOffsets,
        selectedEventoInputKey,
      );
      out.push(...result.subEvents);
    }

    const withDates = out.filter((s) => s.dueAt != null);
    const placeholders = out.filter((s) => s.dueAt == null);
    const scheduled = assignTimeSlots(withDates, settings);

    return { subEvents: [...scheduled, ...placeholders] };
  },
};
