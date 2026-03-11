/**
 * Data-driven rule engine: genera sotto-eventi a partire da EventRule[].
 * Sostituisce la logica if/else hardcoded di atto-giuridico.ts per la nuova gerarchia.
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
import { getEventRulesFor } from "@/types/macro-areas";

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

function processRule(
  rule: EventRule,
  inputs: Record<string, unknown>,
  settings: AppSettings,
  reminderOffsets: number[],
): SubEventCandidate[] {
  const out: SubEventCandidate[] = [];

  if (rule.tipoTermine === "manuale" || rule.tipoTermine === "da_parametrizzare") {
    out.push({
      title: rule.eventoLabel,
      kind: "termine",
      dueAt: null,
      status: "pending",
      priority: rule.ordine,
      ruleId: "data-driven",
      ruleParams: {
        macroArea: rule.macroArea,
        procedimento: rule.procedimento,
        parteProcessuale: rule.parteProcessuale,
        tipoTermine: rule.tipoTermine,
      },
      explanation: rule.tipoTermine === "manuale"
        ? `Evento manuale: inserire la data quando disponibile${rule.norma ? ` (${rule.norma})` : ""}`
        : `Da parametrizzare in futuro${rule.norma ? ` (${rule.norma})` : ""}`,
      createdBy: "automatico",
      isPlaceholder: true,
    });
    return out;
  }

  if (!rule.eventoBaseKey || rule.direzioneCalcolo == null || rule.numero == null || rule.unita == null) {
    return out;
  }

  const baseValue = inputs[rule.eventoBaseKey] as string | undefined;
  if (!baseValue) return out;

  const baseDate = new Date(
    baseValue.length === 10 ? baseValue + "T12:00:00" : baseValue
  );
  if (isNaN(baseDate.getTime())) return out;

  let dueDate = computeDate(baseDate, rule.direzioneCalcolo, rule.numero, rule.unita);

  if (rule.isPromemoriaFestivi) {
    dueDate = adjustToNextBusinessDay(dueDate, settings);
  }

  const dueAt = applyDeadlineTime(dueDate, settings);

  const explanation = [
    rule.eventoLabel,
    `${rule.direzioneCalcolo === "+" ? "+" : "−"}${rule.numero} ${rule.unita} da ${rule.eventoBaseKey}`,
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
      eventoBaseKey: rule.eventoBaseKey,
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

  return out;
}

export const dataDrivenRule: RuleDefinition = {
  id: "data-driven",
  label: "Regole data-driven (nuova gerarchia)",
  run(input) {
    const event = input.event;
    const settings = input.settings;
    const inputs = (event.inputs ?? input.userSelections ?? {}) as Record<string, unknown>;

    const macroArea = (event.macroArea ?? inputs.macroArea) as MacroAreaCode | undefined;
    const procedimento = (event.procedimento ?? inputs.procedimento) as ProcedimentoCode | undefined;
    const parteProcessuale = (event.parteProcessuale ?? inputs.parteProcessuale) as ParteProcessuale | undefined;

    if (!macroArea || !procedimento || !parteProcessuale) {
      return { subEvents: [] };
    }

    const rules = getEventRulesFor(macroArea, procedimento, parteProcessuale);
    if (rules.length === 0) return { subEvents: [] };

    const rawOffsets = (inputs.reminderOffsets as number[] | undefined)
      ?? settings.defaultReminderOffsetsAtto
      ?? [7];
    const reminderOffsets = rawOffsets.map((d) => (d > 0 ? -d : d));

    const out: SubEventCandidate[] = [];
    for (const rule of rules) {
      out.push(...processRule(rule, inputs, settings, reminderOffsets));
    }

    const withDates = out.filter((s) => s.dueAt != null);
    const placeholders = out.filter((s) => s.dueAt == null);
    const scheduled = assignTimeSlots(withDates, settings);

    return { subEvents: [...scheduled, ...placeholders] };
  },
};
