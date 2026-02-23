import type { Event, SubEventKind, SubEventStatus } from "@/types";

export interface AppSettings {
  defaultReminderTime: string; // "09:00"
  defaultReminderOffsets: number[]; // [7, 1] days
  weekendHandling?: string; // placeholder
  holidays?: string[]; // placeholder, ISO dates
}

export interface RuleInput {
  event: Event;
  settings: AppSettings;
  userSelections: Record<string, unknown>;
}

export interface SubEventCandidate {
  title: string;
  kind: SubEventKind;
  dueAt: Date;
  status?: SubEventStatus;
  priority?: number;
  ruleId: string;
  ruleParams?: Record<string, unknown>;
  explanation: string;
  createdBy: "manuale" | "automatico";
}

export interface RuleOutput {
  subEvents: SubEventCandidate[];
}

export type RuleFn = (input: RuleInput) => RuleOutput;

export interface RuleDefinition {
  id: string;
  label: string;
  run: RuleFn;
}
