"use server";

import { prisma } from "../db";
import { getSettings } from "../settings";
import { runRulesForEvent } from "../rules/engine";
import type { Event, SubEvent } from "@/types";
import type { ActionResult } from "./events";

export interface PreviewSubEventInput {
  title: string;
  startAt: string;
  endAt: string;
  type: Event["type"];
  tags: string[];
  ruleTemplateId: string;
  /** Per ruleTemplateId "atto-giuridico" */
  macroType?: string | null;
  actionType?: string | null;
  actionMode?: string | null;
  inputs?: Record<string, unknown> | null;
}

export async function getSubEventsPreview(
  input: PreviewSubEventInput
): Promise<ActionResult<Array<{ title: string; dueAt: string; explanation: string }>>> {
  try {
    const settings = await getSettings();
    const eventForRule: Event = {
      id: "",
      title: input.title,
      description: null,
      startAt: new Date(input.startAt),
      endAt: new Date(input.endAt),
      type: input.type,
      tags: input.tags,
      caseId: null,
      notes: null,
      generateSubEvents: true,
      ruleTemplateId: input.ruleTemplateId,
      ruleParams: null,
      macroType: input.macroType === "ATTO_GIURIDICO" ? "ATTO_GIURIDICO" : undefined,
      actionType: input.actionType ?? undefined,
      actionMode: input.actionMode ?? undefined,
      inputs: input.inputs ?? undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const candidates = runRulesForEvent(input.ruleTemplateId, {
      event: eventForRule,
      settings,
      userSelections: input.inputs ?? {},
    });
    return {
      success: true,
      data: candidates.map((c) => ({
        title: c.title,
        dueAt: c.dueAt.toISOString(),
        explanation: c.explanation,
      })),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore preview sottoeventi",
    };
  }
}

function parseRuleParams(ruleParams: string | null): Record<string, unknown> | null {
  if (ruleParams == null) return null;
  try {
    return JSON.parse(ruleParams) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function toSubEvent(r: {
  id: string;
  parentEventId: string;
  title: string;
  kind: string;
  dueAt: Date;
  status: string;
  priority: number;
  ruleId: string | null;
  ruleParams: string | null;
  explanation: string | null;
  createdBy: string;
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
}): SubEvent {
  return {
    id: r.id,
    parentEventId: r.parentEventId,
    title: r.title,
    kind: r.kind as "termine" | "promemoria" | "attivita",
    dueAt: r.dueAt,
    status: r.status as "pending" | "done" | "cancelled",
    priority: r.priority,
    ruleId: r.ruleId,
    ruleParams: parseRuleParams(r.ruleParams),
    explanation: r.explanation,
    createdBy: r.createdBy as "manuale" | "automatico",
    locked: r.locked,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export async function getSubEventsByParentId(
  parentId: string
): Promise<ActionResult<SubEvent[]>> {
  try {
    const list = await prisma.subEvent.findMany({
      where: { parentEventId: parentId },
      orderBy: { dueAt: "asc" },
    });
    return { success: true, data: list.map(toSubEvent) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore caricamento sottoeventi",
    };
  }
}

export async function regenerateSubEvents(parentEventId: string): Promise<
  ActionResult<SubEvent[]>
> {
  try {
    const parent = await prisma.event.findUnique({
      where: { id: parentEventId },
      include: { subEvents: true },
    });
    if (!parent) {
      return { success: false, error: "Evento non trovato" };
    }
    if (!parent.generateSubEvents || !parent.ruleTemplateId) {
      return { success: true, data: [] };
    }

    const settings = await getSettings();
    const inputsParsed = parent.inputs ? (JSON.parse(parent.inputs) as Record<string, unknown>) : {};
    const eventForRule: Event = {
      id: parent.id,
      title: parent.title,
      description: parent.description,
      startAt: parent.startAt,
      endAt: parent.endAt,
      type: parent.type as Event["type"],
      tags: JSON.parse(parent.tags || "[]") as string[],
      caseId: parent.caseId,
      notes: parent.notes,
      generateSubEvents: parent.generateSubEvents,
      ruleTemplateId: parent.ruleTemplateId,
      ruleParams: parseRuleParams(parent.ruleParams),
      macroType: parent.macroType === "ATTO_GIURIDICO" ? "ATTO_GIURIDICO" : undefined,
      actionType: parent.actionType ?? undefined,
      actionMode: parent.actionMode ?? undefined,
      inputs: inputsParsed,
      createdAt: parent.createdAt,
      updatedAt: parent.updatedAt,
    };

    const userSelections = (parent.ruleTemplateId === "atto-giuridico" ? inputsParsed : (JSON.parse(parent.ruleParams || "{}") || {})) as Record<string, unknown>;
    const candidates = runRulesForEvent(parent.ruleTemplateId, {
      event: eventForRule,
      settings,
      userSelections,
    });

    const toDelete = parent.subEvents.filter((s) => !s.locked);
    await prisma.subEvent.deleteMany({
      where: { id: { in: toDelete.map((s) => s.id) } },
    });

    const created = await Promise.all(
      candidates.map((c) =>
        prisma.subEvent.create({
          data: {
            parentEventId,
            title: c.title,
            kind: c.kind,
            dueAt: c.dueAt,
            status: c.status ?? "pending",
            priority: c.priority ?? 0,
            ruleId: c.ruleId,
            ruleParams: c.ruleParams ? JSON.stringify(c.ruleParams) : null,
            explanation: c.explanation,
            createdBy: "automatico",
            locked: false,
          },
        })
      )
    );

    const list = await prisma.subEvent.findMany({
      where: { parentEventId },
      orderBy: { dueAt: "asc" },
    });
    return { success: true, data: list.map(toSubEvent) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore rigenerazione sottoeventi",
    };
  }
}

export async function updateSubEvent(
  id: string,
  data: { title?: string; dueAt?: Date; status?: SubEvent["status"] }
): Promise<ActionResult<SubEvent>> {
  try {
    const sub = await prisma.subEvent.update({
      where: { id },
      data: {
        ...(data.title != null && { title: data.title }),
        ...(data.dueAt != null && { dueAt: data.dueAt }),
        ...(data.status != null && { status: data.status }),
      },
    });
    return { success: true, data: toSubEvent(sub) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore aggiornamento sottoevento",
    };
  }
}

export async function lockSubEvent(id: string): Promise<ActionResult<SubEvent>> {
  try {
    const sub = await prisma.subEvent.update({
      where: { id },
      data: { locked: true },
    });
    return { success: true, data: toSubEvent(sub) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore blocco sottoevento",
    };
  }
}
