import type { RuleInput, RuleOutput, SubEventCandidate } from "./types";
import { get, register } from "./registry";
import { reminderRule } from "./plugins/reminder";
import { genericDeadlineRule } from "./plugins/generic-deadline";
import { checklistRule } from "./plugins/checklist";
import { attoGiuridicoRule } from "./plugins/atto-giuridico";

// Register built-in rules (side-effect on module load)
[reminderRule, genericDeadlineRule, checklistRule, attoGiuridicoRule].forEach((r) => register(r));

export function runRule(ruleId: string, input: RuleInput): RuleOutput {
  const rule = get(ruleId);
  if (!rule) return { subEvents: [] };
  return rule.run(input);
}

export function runTemplate(
  templateId: string,
  input: RuleInput
): RuleOutput {
  const rule = get(templateId);
  if (!rule) return { subEvents: [] };
  return rule.run(input);
}

export function runAllFromTemplate(
  templateId: string,
  input: RuleInput
): RuleOutput {
  return runTemplate(templateId, input);
}

/**
 * Run selected rules by template (single template = one rule for MVP).
 * Returns aggregated subEvents with unique keys for deduplication if needed.
 */
export function runRulesForEvent(
  templateId: string | null,
  input: RuleInput
): SubEventCandidate[] {
  if (!templateId) return [];
  const out = runTemplate(templateId, input);
  return out.subEvents;
}
