import { addDays, differenceInCalendarDays, startOfDay } from "date-fns";
import type { AppSettings } from "@/lib/rules/types";
import {
  adjustFinalDeadline,
  applyDeadlineTime,
  shiftCalendarDaysExcludingFeriale,
} from "@/lib/date-utils";
import type { SubEventCandidate } from "@/lib/rules/types";

export type LinkedEventSpec = {
  title: string;
  offsetDays: number;
  useFerialeSuspension?: boolean;
};

export function isLinkedEventSpec(x: unknown): x is LinkedEventSpec {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  const hasValidFeriale =
    o.useFerialeSuspension === undefined ||
    typeof o.useFerialeSuspension === "boolean";
  return (
    typeof o.title === "string" &&
    typeof o.offsetDays === "number" &&
    Number.isFinite(o.offsetDays) &&
    hasValidFeriale
  );
}

export function parseLinkedEvents(raw: unknown): LinkedEventSpec[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isLinkedEventSpec).map((l) => ({
    title: l.title.trim(),
    offsetDays: l.offsetDays,
    useFerialeSuspension: l.useFerialeSuspension === true,
  }));
}

/**
 * Stessa logica dei promemoria data-driven: giorni solari da una data di riferimento,
 * poi art. 155 (festivi/weekend) con direzione coerente col segno dello spostamento.
 */
export function computeLinkedEventDueAt(
  refDate: Date,
  offsetDays: number,
  useFerialeSuspension: boolean,
  settings: AppSettings,
): Date {
  const direction: "forward" | "backward" =
    offsetDays >= 0 ? "forward" : "backward";
  const raw = useFerialeSuspension
    ? shiftCalendarDaysExcludingFeriale(
        refDate,
        Math.abs(offsetDays),
        direction,
        settings,
      )
    : addDays(refDate, offsetDays);
  const adjusted = adjustFinalDeadline(raw, direction, settings);
  return applyDeadlineTime(adjusted, settings);
}

/**
 * Trova lo scostamento in giorni (nel range consentito) la cui data risultante
 * (stessa logica di `computeLinkedEventDueAt`) è più vicina al giorno scelto in calendario.
 */
export function bestOffsetDaysForLinkedTargetDate(
  refDate: Date,
  targetCalendarDate: Date,
  useFerialeSuspension: boolean,
  settings: AppSettings,
  minOff = -365,
  maxOff = 365,
): number {
  const targetDay = startOfDay(targetCalendarDate);
  let bestO = 0;
  let bestDist = Infinity;
  for (let o = minOff; o <= maxOff; o++) {
    const due = computeLinkedEventDueAt(
      refDate,
      o,
      useFerialeSuspension,
      settings,
    );
    const dist = Math.abs(differenceInCalendarDays(startOfDay(due), targetDay));
    if (dist < bestDist || (dist === bestDist && Math.abs(o) < Math.abs(bestO))) {
      bestDist = dist;
      bestO = o;
    }
  }
  return bestO;
}

export function buildLinkedEventCandidates(
  specs: LinkedEventSpec[],
  refDate: Date,
  settings: AppSettings,
  ruleId: string,
  extraRuleParams: Record<string, unknown>,
): SubEventCandidate[] {
  const out: SubEventCandidate[] = [];
  for (const le of specs) {
    const title = le.title.trim();
    if (!title) continue;
    const dueAt = computeLinkedEventDueAt(
      refDate,
      le.offsetDays,
      le.useFerialeSuspension === true,
      settings,
    );
    out.push({
      title,
      kind: "attivita",
      dueAt,
      status: "pending",
      priority: 0,
      ruleId,
      ruleParams: {
        ...extraRuleParams,
        /** Marcatore persistito sul SubEvent: pannello «Adempimenti» / eventi collegati in calendario. */
        linkedEvent: true,
        offsetDays: le.offsetDays,
        useFerialeSuspension: le.useFerialeSuspension === true,
      },
      explanation:
        `Evento collegato: ${le.offsetDays >= 0 ? "+" : ""}${le.offsetDays} giorni dalla data di riferimento` +
        (le.useFerialeSuspension ? " [sosp. feriale]" : ""),
      createdBy: "manuale",
      isPlaceholder: false,
    });
  }
  return out;
}
