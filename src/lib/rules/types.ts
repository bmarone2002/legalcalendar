import type { Event, SubEventKind, SubEventStatus } from "@/types";

export interface AppSettings {
  defaultReminderTime: string; // "09:00"
  defaultReminderOffsets: number[]; // [7, 1] days
  weekendHandling?: string;
  holidays?: string[];
  /** Per ATTO_GIURIDICO: orario default per scadenze (es. 12:00) */
  defaultTimeForDeadlines: string;
  /** Promemoria prima di ogni termine hard: es. [-20, -5, -2] */
  defaultReminderOffsetsAtto: number[];
  notificaEsteroDefault: boolean;
  /** Giorni tra notifica citazione e udienza (Italia) */
  termineComparizioneCitazioneItalia: number;
  /** Giorni tra notifica citazione e udienza (estero) */
  termineComparizioneCitazioneEstero: number;
  /** Sospensione feriale inizio (MM-DD), default "08-01" */
  ferialeSuspensionStart: string;
  /** Sospensione feriale fine (MM-DD), default "08-31" */
  ferialeSuspensionEnd: string;
  /** Festivita italiane aggiuntive (MM-DD) oltre quelle fisse */
  italianHolidays?: string[];
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
