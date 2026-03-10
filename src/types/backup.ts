import type { Event, SubEvent } from "@/types";

export interface BackupSubEvent {
  id: string;
  parentEventId: string;
  title: string;
  kind: SubEvent["kind"];
  dueAt: string;
  status: SubEvent["status"];
  priority: number;
  ruleId: string | null;
  ruleParams: Record<string, unknown> | null;
  explanation: string | null;
  createdBy: SubEvent["createdBy"];
  locked: boolean;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface BackupEvent {
  id: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  type: Event["type"];
  tags: string[];
  caseId: string | null;
  notes: string | null;
  generateSubEvents: boolean;
  ruleTemplateId: string | null;
  ruleParams: Record<string, unknown> | null;
  macroType: Event["macroType"] | null | undefined;
  actionType: Event["actionType"] | null | undefined;
  actionMode: Event["actionMode"] | null | undefined;
  inputs: Record<string, unknown> | null | undefined;
  color: string | null | undefined;
  status: Event["status"];
  createdAt: string;
  updatedAt: string;
  subEvents?: BackupSubEvent[];
  metadata?: Record<string, unknown>;
}

export interface BackupFile {
  schemaVersion: string;
  generatedAt: string;
  userId: string;
  events: BackupEvent[];
  metadata?: Record<string, unknown>;
}

