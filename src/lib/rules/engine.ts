import type { RuleInput, SubEventCandidate } from "./types";
import { get, register } from "./registry";
import { reminderRule } from "./plugins/reminder";
import { genericDeadlineRule } from "./plugins/generic-deadline";
import { checklistRule } from "./plugins/checklist";
import { dataDrivenRule } from "./plugins/data-driven-engine";

// Side-effect: registra tutte le EventRule[] dai file dati
import "./data";

[reminderRule, genericDeadlineRule, checklistRule, dataDrivenRule].forEach((r) => register(r));

export function runRulesForEvent(
  templateId: string | null,
  input: RuleInput
): SubEventCandidate[] {
  if (!templateId) return [];
  const rule = get(templateId);
  if (!rule) return [];
  return rule.run(input).subEvents;
}
