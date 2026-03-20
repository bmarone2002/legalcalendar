import { addDays } from "date-fns";
import type { AppSettings } from "@/lib/rules/types";
import { adjustFinalDeadline, applyDeadlineTime } from "@/lib/date-utils";
import type { SubEventCandidate } from "@/lib/rules/types";

export type LinkedEventSpec = { title: string; offsetDays: number };

export function isLinkedEventSpec(x: unknown): x is LinkedEventSpec {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.title === "string" && typeof o.offsetDays === "number" && Number.isFinite(o.offsetDays);
}

export function parseLinkedEvents(raw: unknown): LinkedEventSpec[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isLinkedEventSpec).map((l) => ({
    title: l.title.trim(),
    offsetDays: l.offsetDays,
  }));
}

/**
 * Stessa logica dei promemoria data-driven: giorni solari da una data di riferimento,
 * poi art. 155 (festivi/weekend) con direzione coerente col segno dello spostamento.
 */
export function computeLinkedEventDueAt(
  refDate: Date,
  offsetDays: number,
  settings: AppSettings,
): Date {
  const raw = addDays(refDate, offsetDays);
  const direction: "forward" | "backward" =
    offsetDays >= 0 ? "forward" : "backward";
  const adjusted = adjustFinalDeadline(raw, direction, settings);
  return applyDeadlineTime(adjusted, settings);
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
    const dueAt = computeLinkedEventDueAt(refDate, le.offsetDays, settings);
    out.push({
      title,
      kind: "attivita",
      dueAt,
      status: "pending",
      priority: 0,
      ruleId,
      ruleParams: {
        ...extraRuleParams,
        linkedEvent: true,
        offsetDays: le.offsetDays,
      },
      explanation: `Evento collegato: ${le.offsetDays >= 0 ? "+" : ""}${le.offsetDays} giorni dalla data di riferimento`,
      createdBy: "manuale",
      isPlaceholder: false,
    });
  }
  return out;
}
