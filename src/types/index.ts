// Types aligned with Prisma models and API

export type EventType =
  | "udienza"
  | "notifica"
  | "deposito"
  | "scadenza"
  | "altro";

export type EventStatus = "pending" | "done";

/** Macro-tipo: ATTO_GIURIDICO attiva gerarchia macro/procedimento + inputs */
export type MacroType = "ATTO_GIURIDICO" | null;

export type { MacroAreaCode, ProcedimentoCode, ParteProcessuale } from "./macro-areas";

export type SubEventKind = "termine" | "promemoria" | "attivita";
export type SubEventStatus = "pending" | "done" | "cancelled";
export type CreatedBy = "manuale" | "automatico";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  startAt: Date;
  endAt: Date;
  type: EventType;
  tags: string[];
  caseId: string | null;
  notes: string | null;
  generateSubEvents: boolean;
  ruleTemplateId: string | null;
  ruleParams: Record<string, unknown> | null;
  macroType?: MacroType;
  macroArea?: string | null;
  procedimento?: string | null;
  parteProcessuale?: string | null;
  eventoCode?: string | null;
  inputs?: Record<string, unknown> | null;
  /** Colore tag (hex): applicato a evento e sottoeventi in calendario */
  color?: string | null;
  /** Stato completamento evento */
  status?: EventStatus;
  createdAt: Date;
  updatedAt: Date;
  subEvents?: SubEvent[];
}

export interface SubEvent {
  id: string;
  parentEventId: string;
  title: string;
  kind: SubEventKind;
  dueAt: Date;
  status: SubEventStatus;
  priority: number;
  ruleId: string | null;
  ruleParams: Record<string, unknown> | null;
  explanation: string | null;
  createdBy: CreatedBy;
  locked: boolean;
  /** Sotto-evento placeholder: data non ancora nota, l'utente la inserirà in seguito */
  isPlaceholder: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventInput {
  title: string;
  description?: string | null;
  startAt: Date;
  endAt: Date;
  type?: EventType;
  tags?: string[];
  caseId?: string | null;
  notes?: string | null;
  generateSubEvents?: boolean;
  ruleTemplateId?: string | null;
  ruleParams?: Record<string, unknown> | null;
  macroType?: MacroType;
  macroArea?: string | null;
  procedimento?: string | null;
  parteProcessuale?: string | null;
  eventoCode?: string | null;
  inputs?: Record<string, unknown> | null;
  color?: string | null;
  status?: EventStatus;
}

export interface UpdateEventInput {
  title?: string;
  description?: string | null;
  startAt?: Date;
  endAt?: Date;
  type?: EventType;
  tags?: string[];
  caseId?: string | null;
  notes?: string | null;
  generateSubEvents?: boolean;
  ruleTemplateId?: string | null;
  ruleParams?: Record<string, unknown> | null;
  macroType?: MacroType;
  macroArea?: string | null;
  procedimento?: string | null;
  parteProcessuale?: string | null;
  eventoCode?: string | null;
  inputs?: Record<string, unknown> | null;
  color?: string | null;
  status?: EventStatus;
}

export const EVENT_TYPES: EventType[] = [
  "udienza",
  "notifica",
  "deposito",
  "scadenza",
  "altro",
];

export const RULE_TEMPLATES = [
  { id: "reminder", label: "Promemoria standard" },
  { id: "generic-deadline", label: "Scadenza generica" },
  { id: "checklist", label: "Checklist" },
  {
    id: "data-driven",
    label: "Atto giuridico (macro area / procedimento / parte)",
  },
] as const;
