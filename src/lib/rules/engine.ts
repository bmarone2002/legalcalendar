import type { RuleInput, SubEventCandidate } from "./types";
import { get, register } from "./registry";
import { reminderRule } from "./plugins/reminder";
import { genericDeadlineRule } from "./plugins/generic-deadline";
import { checklistRule } from "./plugins/checklist";
import { attoGiuridicoRule } from "./plugins/atto-giuridico";

[reminderRule, genericDeadlineRule, checklistRule, attoGiuridicoRule].forEach((r) => register(r));

export function runRulesForEvent(
  templateId: string | null,
  input: RuleInput
): SubEventCandidate[] {
  if (!templateId) return [];
  const rule = get(templateId);
  if (!rule) return [];
  return rule.run(input).subEvents;
}
