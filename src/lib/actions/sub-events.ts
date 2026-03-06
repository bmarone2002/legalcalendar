"use server";

import { prisma } from "../db";
import { getSettings } from "../settings";
import { runRulesForEvent } from "../rules/engine";
import type { Event, SubEvent } from "@/types";
import type { ActionResult } from "./events";
import { parseJsonField } from "@/lib/utils";
import { toSubEvent } from "@/lib/mappers";
import type { SubEventCandidate } from "../rules/types";
import { resolveCalendarUser } from "@/lib/auth/calendar-access";

export { toSubEvent };

// ── Shared helpers for regenerate / createFromPreview ─────────────

interface ParentContext {
  parent: NonNullable<Awaited<ReturnType<typeof prisma.event.findUnique>>>;
  eventForRule: Event;
  userSelections: Record<string, unknown>;
  subEvents: Array<{ id: string; locked: boolean; ruleId: string | null }>;
}

async function loadParentContext(parentEventId: string): Promise<ParentContext | null> {
  const parent = await prisma.event.findUnique({
    where: { id: parentEventId },
    include: { subEvents: { select: { id: true, locked: true, ruleId: true } } },
  });
  if (!parent) return null;

  const inputsParsed = parent.inputs ? (JSON.parse(parent.inputs) as Record<string, unknown>) : {};
  const ruleParamsParsed = (JSON.parse(parent.ruleParams || "{}") || {}) as Record<string, unknown>;

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
    ruleParams: parseJsonField(parent.ruleParams),
    macroType: parent.macroType === "ATTO_GIURIDICO" ? "ATTO_GIURIDICO" : undefined,
    actionType: parent.actionType ?? undefined,
    actionMode: parent.actionMode ?? undefined,
    inputs: inputsParsed,
    createdAt: parent.createdAt,
    updatedAt: parent.updatedAt,
  };

  const userSelections = (parent.ruleTemplateId === "atto-giuridico"
    ? inputsParsed
    : { ...inputsParsed, ...ruleParamsParsed }) as Record<string, unknown>;

  return { parent, eventForRule, userSelections, subEvents: parent.subEvents };
}

async function replaceSubEvents(
  parentEventId: string,
  candidates: SubEventCandidate[],
  existingSubEvents: Array<{ id: string; locked: boolean; ruleId: string | null }>
): Promise<SubEvent[]> {
  const toDelete = existingSubEvents.filter(
    (s) => !s.locked && s.ruleId !== "rinvio-udienza"
  );
  if (toDelete.length > 0) {
    await prisma.subEvent.deleteMany({
      where: { id: { in: toDelete.map((s) => s.id) } },
    });
  }

  if (candidates.length > 0) {
    await prisma.subEvent.createMany({
      data: candidates.map((c) => ({
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
      })),
    });
  }

  const list = await prisma.subEvent.findMany({
    where: { parentEventId },
    orderBy: { dueAt: "asc" },
  });
  return list.map(toSubEvent);
}

// ── Public API ────────────────────────────────────────────────────

export interface PreviewSubEventInput {
  title: string;
  startAt: string;
  endAt: string;
  type: Event["type"];
  tags: string[];
  ruleTemplateId: string;
  macroType?: string | null;
  actionType?: string | null;
  actionMode?: string | null;
  inputs?: Record<string, unknown> | null;
}

export async function getSubEventsPreview(
  input: PreviewSubEventInput
): Promise<
  ActionResult<
    Array<{
      id: string;
      title: string;
      dueAt: string;
      explanation: string;
      ruleId: string;
      ruleParams?: Record<string, unknown> | null;
      kind: string;
      priority?: number;
    }>
  >
> {
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
      data: candidates.map((c, index) => ({
        id: `${c.ruleId}-${index}-${c.dueAt.toISOString()}`,
        title: c.title,
        dueAt: c.dueAt.toISOString(),
        explanation: c.explanation,
        ruleId: c.ruleId,
        ruleParams: c.ruleParams ?? null,
        kind: c.kind,
        priority: c.priority,
      })),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore preview sottoeventi",
    };
  }
}

export async function regenerateSubEvents(parentEventId: string, targetUserId?: string): Promise<
  ActionResult<SubEvent[]>
> {
  try {
    const ctx = await loadParentContext(parentEventId);
    if (!ctx) return { success: false, error: "Evento non trovato" };
    await resolveCalendarUser(targetUserId ?? ctx.parent.userId, "FULL");
    if (!ctx.parent.generateSubEvents || !ctx.parent.ruleTemplateId) {
      return { success: true, data: [] };
    }

    const settings = await getSettings();
    const candidates = runRulesForEvent(ctx.parent.ruleTemplateId, {
      event: ctx.eventForRule,
      settings,
      userSelections: ctx.userSelections,
    });

    const data = await replaceSubEvents(parentEventId, candidates, ctx.subEvents);
    return { success: true, data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore rigenerazione sottoeventi",
    };
  }
}

export async function createSubEventsFromPreview(
  parentEventId: string,
  selectedPreviewIds: string[],
  targetUserId?: string
): Promise<ActionResult<SubEvent[]>> {
  try {
    const ctx = await loadParentContext(parentEventId);
    if (!ctx) return { success: false, error: "Evento non trovato" };
    await resolveCalendarUser(targetUserId ?? ctx.parent.userId, "FULL");
    if (!ctx.parent.generateSubEvents || !ctx.parent.ruleTemplateId) {
      return { success: true, data: [] };
    }

    const settings = await getSettings();
    const candidates = runRulesForEvent(ctx.parent.ruleTemplateId, {
      event: ctx.eventForRule,
      settings,
      userSelections: ctx.userSelections,
    });

    const selectedSet = new Set(selectedPreviewIds);
    const filtered = candidates.filter((_c, index) => {
      const c = candidates[index];
      const previewId = `${c.ruleId}-${index}-${c.dueAt.toISOString()}`;
      return selectedSet.has(previewId);
    });

    const data = await replaceSubEvents(parentEventId, filtered, ctx.subEvents);
    return { success: true, data };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore creazione sottoeventi selezionati",
    };
  }
}

export async function updateSubEvent(
  id: string,
  data: { title?: string; dueAt?: Date; status?: SubEvent["status"] },
  targetUserId?: string
): Promise<ActionResult<SubEvent>> {
  try {
    const existing = await prisma.subEvent.findUnique({
      where: { id },
      select: { parentEvent: { select: { userId: true } } },
    });
    if (!existing) {
      return { success: false, error: "Sottoevento non trovato" };
    }
    await resolveCalendarUser(targetUserId ?? existing.parentEvent.userId, "FULL");

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

export async function deleteSubEvent(id: string, targetUserId?: string): Promise<ActionResult<void>> {
  try {
    const existing = await prisma.subEvent.findUnique({
      where: { id },
      select: { parentEvent: { select: { userId: true } } },
    });
    if (!existing) {
      return { success: false, error: "Sottoevento non trovato" };
    }
    await resolveCalendarUser(targetUserId ?? existing.parentEvent.userId, "FULL");

    await prisma.subEvent.delete({
      where: { id },
    });
    return { success: true, data: undefined };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore eliminazione sottoevento",
    };
  }
}
