/**
 * Data-driven rule engine: genera sotto-eventi a partire da EventRule[].
 * Sostituisce la logica if/else hardcoded di atto-giuridico.ts per la nuova gerarchia.
 *
 * Supporta chaining: se una regola calcolata ha providesInputKey, la data
 * calcolata viene re-iniettata come input per le regole successive (iterativo).
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
  /** If the rule has providesInputKey and was calculated, returns the key → date string to feed back. */
  chainedInput?: { key: string; value: string };
}

function processRule(
  rule: EventRule,
  inputs: Record<string, unknown>,
  settings: AppSettings,
  reminderOffsets: number[],
): ProcessResult {
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
    return { subEvents: out };
  }

  if (!rule.eventoBaseKey || rule.direzioneCalcolo == null || rule.numero == null || rule.unita == null) {
    return { subEvents: out };
  }

  const baseValue = inputs[rule.eventoBaseKey] as string | undefined;
  if (!baseValue) return { subEvents: out };

  const baseDate = new Date(
    baseValue.length === 10 ? baseValue + "T12:00:00" : baseValue
  );
  if (isNaN(baseDate.getTime())) return { subEvents: out };

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

  const chainedInput = rule.providesInputKey
    ? { key: rule.providesInputKey, value: toDateOnlyString(dueDate) }
    : undefined;

  return { subEvents: out, chainedInput };
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

    let rules = getEventRulesFor(macroArea, procedimento, parteProcessuale);
    if (rules.length === 0) return { subEvents: [] };

    // Se è stato selezionato un Evento specifico nel form (eventoCode),
    // limita la generazione dei sotto-eventi SOLO alle regole collegate a quell'evento.
    const eventoCode = (event as { eventoCode?: string | null }).eventoCode ?? (inputs.eventoCode as string | undefined);
    if (eventoCode) {
      const ev = getEventoByCode(procedimento, eventoCode);
      if (ev) {
        rules = rules.filter((r) => r.eventoLabel === ev.label);
      }
    }

    const rawOffsets = (inputs.reminderOffsets as number[] | undefined)
      ?? settings.defaultReminderOffsetsAtto
      ?? [7];
    const reminderOffsets = rawOffsets.map((d) => (d > 0 ? -d : d));

    const out: SubEventCandidate[] = [];
    const processed = new Set<number>();

    const MAX_ITERATIONS = 10;
    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
      let newInputs = false;
      for (let i = 0; i < rules.length; i++) {
        if (processed.has(i)) continue;
        const rule = rules[i];

        const isManual = rule.tipoTermine === "manuale" || rule.tipoTermine === "da_parametrizzare";
        const hasBase = rule.eventoBaseKey && inputs[rule.eventoBaseKey];

        if (!isManual && !hasBase) continue;

        const result = processRule(rule, inputs, settings, reminderOffsets);
        out.push(...result.subEvents);
        processed.add(i);

        if (result.chainedInput && !inputs[result.chainedInput.key]) {
          inputs[result.chainedInput.key] = result.chainedInput.value;
          newInputs = true;
        }
      }
      if (!newInputs) break;
    }

    const withDates = out.filter((s) => s.dueAt != null);
    const placeholders = out.filter((s) => s.dueAt == null);
    const scheduled = assignTimeSlots(withDates, settings);

    return { subEvents: [...scheduled, ...placeholders] };
  },
};
