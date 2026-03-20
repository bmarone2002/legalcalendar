/**
 * Data-driven rule engine: genera sotto-eventi a partire da EventRule[].
 *
 * Modalità multi-riga (default per atto giuridico):
 * - L'utente seleziona una fase/evento dalla tabella e inserisce la data base.
 * - Il motore genera tutte le fasi FUTURE calcolabili (righe con ordine >= fase selezionata),
 *   in cascata: usa eventoBaseKey / providesInputKey per propagare le date tra le righe.
 *
 * Righe con tipoTermine "manuale" o "da_parametrizzare" senza formula vengono saltate
 * o gestite come attività alla data base quando hanno una data disponibile.
 */

import type { RuleDefinition, SubEventCandidate, AppSettings } from "../types";
import { addDays, addMonths, addYears } from "date-fns";
import {
  adjustFinalDeadline,
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
import { buildLinkedEventCandidates, parseLinkedEvents } from "@/lib/linked-events";

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

    // Applica art. 155 solo per termini "a giorni" (nel resto dei casi lasciamo
    // invariata la data calcolata).
    const direction: "forward" | "backward" = rule.direzioneCalcolo === "+" ? "forward" : "backward";
    if (rule.unita === "giorni") {
      dueDate = adjustFinalDeadline(dueDate, direction, settings);
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
      const reminderDirection: "forward" | "backward" = offset >= 0 ? "forward" : "backward";
      const reminderAdjusted = adjustFinalDeadline(reminderRaw, reminderDirection, settings);
      const reminderAt = applyDeadlineTime(reminderAdjusted, settings);
      out.push({
        title: `${rule.eventoLabel} – Promemoria (${Math.abs(offset)} gg prima)`,
        kind: "promemoria",
        dueAt: reminderAt,
        status: "pending",
        priority: 0,
        ruleId: "data-driven",
        ruleParams: {
          daysBefore: offset,
          eventoBaseKey: rule.eventoBaseKey ?? selectedEventoInputKey,
        },
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
    const reminderDirection: "forward" | "backward" = offset >= 0 ? "forward" : "backward";
    const reminderAdjusted = adjustFinalDeadline(reminderRaw, reminderDirection, settings);
    const reminderAt = applyDeadlineTime(reminderAdjusted, settings);
    out.push({
      title: `${rule.eventoLabel} – Promemoria (${Math.abs(offset)} gg prima)`,
      kind: "promemoria",
      dueAt: reminderAt,
      status: "pending",
      priority: 0,
      ruleId: "data-driven",
      ruleParams: {
        daysBefore: offset,
        eventoBaseKey: rule.eventoBaseKey ?? selectedEventoInputKey,
      },
      explanation: `Promemoria ${Math.abs(offset)} giorni prima dell'evento`,
      createdBy: "automatico",
      isPlaceholder: false,
    });
  }

  return { subEvents: out };
}

/** Tra più date negli input, sceglie la chiave con più sottoeventi che la referenziano (eventoBaseKey). */
function pickReferenceInputKey(
  candidates: SubEventCandidate[],
  inputs: Record<string, unknown>,
  selectedEventoInputKey: string,
): string {
  const counts = new Map<string, number>();
  for (const c of candidates) {
    const rp = (c.ruleParams ?? {}) as Record<string, unknown>;
    const k = (rp.eventoBaseKey as string | undefined) ?? selectedEventoInputKey;
    if (k && typeof inputs[k] === "string" && String(inputs[k]).trim()) {
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
  }
  let bestKey = selectedEventoInputKey;
  let bestCount = -1;
  for (const [k, n] of counts) {
    if (n > bestCount) {
      bestCount = n;
      bestKey = k;
    }
  }
  if (
    bestCount <= 0 &&
    typeof inputs[selectedEventoInputKey] === "string" &&
    String(inputs[selectedEventoInputKey]).trim()
  ) {
    return selectedEventoInputKey;
  }
  return bestKey;
}

/**
 * Valuta le righe della tabella per la creazione pratica:
 * - La fase selezionata dall'utente: si crea come "attività" alla data manuale inserita (nessun calcolo a ritroso, es. -120 gg).
 * - Solo le righe successive direttamente calcolabili dalla stessa data: es. da "Notifica citazione" + data → solo "Iscrizione a ruolo" (+10 gg).
 * Nessuna catena: i rinvii successivi genereranno le altre fasi (Memorie 1/2/3, ecc.) con una nuova data.
 */
function evaluateMultiRowFromEventoCode(
  macroArea: MacroAreaCode,
  procedimento: ProcedimentoCode,
  parteProcessuale: ParteProcessuale,
  eventoCode: string,
  inputs: Record<string, unknown>,
  settings: AppSettings,
): SubEventCandidate[] {
  const ev = getEventoByCode(procedimento, eventoCode);
  if (!ev) return [];

  const startOrdine = ev.ordine;
  const selectedEventoInputKey = ev.inputKey;
  const allRules = getEventRulesFor(macroArea, procedimento, parteProcessuale);
  const rulesFromPhase = allRules.filter((r) => r.ordine >= startOrdine);
  if (rulesFromPhase.length === 0) return [];

  // Promemoria: se l'utente ha impostato reminderOffsets (anche []), usiamo quelli.
  // Solo in assenza totale del campo cadiamo sui default di configurazione.
  const inputOffsets = inputs.reminderOffsets as number[] | undefined;
  const rawOffsets =
    inputOffsets !== undefined
      ? inputOffsets
      : settings.defaultReminderOffsetsAtto ?? [7];
  const reminderOffsets = rawOffsets.map((d) => (d > 0 ? -d : d));

  const out: SubEventCandidate[] = [];
  const inputsCorrenti = { ...inputs } as Record<string, unknown>;
  const initialInputKeys = new Set(
    Object.entries(inputs).filter(([, v]) => typeof v === "string" && String(v).trim()).map(([k]) => k)
  );

  for (const rule of rulesFromPhase) {
    if (rule.ordine === startOrdine) {
      // Fase selezionata con formula (es. Memorie 1,2,3): calcola con processRule, non attività alla data utente.
      const hasFormula =
        rule.direzioneCalcolo != null && rule.numero != null && rule.unita != null;
      if (hasFormula && rule.eventoBaseKey && initialInputKeys.has(rule.eventoBaseKey)) {
        const result = processRule(
          rule,
          inputsCorrenti,
          settings,
          reminderOffsets,
          selectedEventoInputKey,
        );
        out.push(...result.subEvents);
        continue;
      }
      // Fase selezionata senza formula (es. Notifica): crea attività alla data manuale (no -120 gg).
      const baseValue = inputsCorrenti[selectedEventoInputKey] as string | undefined;
      if (baseValue && typeof baseValue === "string" && baseValue.trim()) {
        const baseDate = new Date(
          baseValue.length === 10 ? baseValue + "T12:00:00" : baseValue
        );
        if (!isNaN(baseDate.getTime())) {
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
              eventoBaseKey: selectedEventoInputKey,
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
            const reminderDirection: "forward" | "backward" = offset >= 0 ? "forward" : "backward";
            const reminderAdjusted = adjustFinalDeadline(reminderRaw, reminderDirection, settings);
            const reminderAt = applyDeadlineTime(reminderAdjusted, settings);
            out.push({
              title: `${rule.eventoLabel} – Promemoria (${Math.abs(offset)} gg prima)`,
              kind: "promemoria",
              dueAt: reminderAt,
              status: "pending",
              priority: 0,
              ruleId: "data-driven",
              ruleParams: {
                daysBefore: offset,
                eventoBaseKey: selectedEventoInputKey,
              },
              explanation: `Promemoria ${Math.abs(offset)} giorni prima dell'evento`,
              createdBy: "automatico",
              isPlaceholder: false,
            });
          }
        }
      }
      continue;
    }

    // ordine > startOrdine: solo righe la cui data base è già negli input (nessuna catena).
    if (!rule.eventoBaseKey || !initialInputKeys.has(rule.eventoBaseKey)) continue;

    const result = processRule(
      rule,
      inputsCorrenti,
      settings,
      reminderOffsets,
      selectedEventoInputKey,
    );
    out.push(...result.subEvents);
  }

  const linkedSpecs = parseLinkedEvents(inputsCorrenti.linkedEvents);
  if (linkedSpecs.length > 0) {
    const refKey = pickReferenceInputKey(out, inputsCorrenti, selectedEventoInputKey);
    const baseStr = inputsCorrenti[refKey] as string | undefined;
    if (baseStr && typeof baseStr === "string" && baseStr.trim()) {
      const baseDate = new Date(
        baseStr.length === 10 ? baseStr + "T12:00:00" : baseStr,
      );
      if (!isNaN(baseDate.getTime())) {
        out.push(
          ...buildLinkedEventCandidates(
            linkedSpecs,
            baseDate,
            settings,
            "data-driven",
            { eventoBaseKey: refKey },
          ),
        );
      }
    }
  }

  const withDates = out.filter((s) => s.dueAt != null);
  const placeholders = out.filter((s) => s.dueAt == null);
  const scheduled = assignTimeSlots(withDates, settings);
  return [...scheduled, ...placeholders];
}

export const dataDrivenRule: RuleDefinition = {
  id: "data-driven",
  label: "Regole data-driven (nuova gerarchia)",
  run(input) {
    const event = input.event;
    const settings = input.settings;
    // Unifica inputs evento e selezioni utente (inclusi reminderOffsets), dando priorità a queste ultime.
    const inputs = {
      ...(input.userSelections ?? {}),
      ...(event.inputs ?? {}),
    } as Record<string, unknown>;

    const macroArea = (event.macroArea ?? inputs.macroArea) as MacroAreaCode | undefined;
    const procedimento = (event.procedimento ?? inputs.procedimento) as ProcedimentoCode | undefined;
    const parteProcessuale = (event.parteProcessuale ?? inputs.parteProcessuale) as ParteProcessuale | undefined;

    if (!macroArea || !procedimento || !parteProcessuale) {
      return { subEvents: [] };
    }

    const eventoCode =
      (event as { eventoCode?: string | null }).eventoCode ??
      (inputs.eventoCode as string | undefined);
    if (!eventoCode) {
      return { subEvents: [] };
    }

    const subEvents = evaluateMultiRowFromEventoCode(
      macroArea,
      procedimento,
      parteProcessuale,
      eventoCode,
      inputs,
      settings,
    );
    return { subEvents };
  },
};
