import type { SubEvent } from "@/types";
import { parseJsonField } from "@/lib/utils";

export function toSubEvent(r: {
  id: string;
  parentEventId: string;
  title: string;
  kind: string;
  dueAt: Date | null;
  status: string;
  priority: number;
  ruleId: string | null;
  ruleParams: string | null;
  explanation: string | null;
  createdBy: string;
  locked: boolean;
  isPlaceholder?: boolean;
  createdAt: Date;
  updatedAt: Date;
}): SubEvent {
  return {
    id: r.id,
    parentEventId: r.parentEventId,
    title: r.title,
    kind: r.kind as "termine" | "promemoria" | "attivita",
    dueAt: r.dueAt ?? new Date(0),
    status: r.status as "pending" | "done" | "cancelled",
    priority: r.priority,
    ruleId: r.ruleId,
    ruleParams: parseJsonField(r.ruleParams),
    explanation: r.explanation,
    createdBy: r.createdBy as "manuale" | "automatico",
    locked: r.locked,
    isPlaceholder: r.isPlaceholder ?? false,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}
