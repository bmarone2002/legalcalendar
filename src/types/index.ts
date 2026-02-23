// Types aligned with Prisma models and API

export type EventType =
  | "udienza"
  | "notifica"
  | "deposito"
  | "scadenza"
  | "altro";

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
] as const;
