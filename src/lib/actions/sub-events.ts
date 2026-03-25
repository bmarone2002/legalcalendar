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
import { getEventoByCode } from "@/types/macro-areas";
import {
  computePhase1MainDueAt,
  computePhase1MainPreview,
} from "../rules/plugins/data-driven-engine";
import type { MacroAreaCode, ParteProcessuale, ProcedimentoCode } from "@/types/macro-areas";

export { toSubEvent };

// ── Shared helpers for regenerate / createFromPreview ─────────────

export interface ParentContext {
  parent: NonNullable<Awaited<ReturnType<typeof prisma.event.findUnique>>>;
  eventForRule: Event;
  userSelections: Record<string, unknown>;
  subEvents: Array<{ id: string; locked: boolean; ruleId: string | null }>;
}

export async function loadParentContext(
  parentEventId: string,
): Promise<ParentContext | null> {
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
    macroArea: parent.macroArea ?? null,
    procedimento: parent.procedimento ?? null,
    parteProcessuale: parent.parteProcessuale ?? null,
    eventoCode: (parent as { eventoCode?: string | null }).eventoCode ?? null,
    actionType: parent.actionType ?? undefined,
    actionMode: parent.actionMode ?? undefined,
    inputs: inputsParsed,
    createdAt: parent.createdAt,
    updatedAt: parent.updatedAt,
  };

  const userSelections = {
    ...inputsParsed,
    ...ruleParamsParsed,
    ...((parent as { eventoCode?: string | null }).eventoCode
      ? { eventoCode: (parent as { eventoCode?: string | null }).eventoCode }
      : {}),
  } as Record<string, unknown>;

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
        createdBy: c.createdBy ?? "automatico",
        locked: false,
        isPlaceholder: c.isPlaceholder ?? false,
      })),
    });
  }

  const list = await prisma.subEvent.findMany({
    where: { parentEventId },
    orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { priority: "asc" }],
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
  macroArea?: string | null;
  procedimento?: string | null;
  parteProcessuale?: string | null;
  eventoCode?: string | null;
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
      macroArea: input.macroArea ?? null,
      procedimento: input.procedimento ?? null,
      parteProcessuale: input.parteProcessuale ?? null,
      eventoCode: input.eventoCode ?? null,
      actionType: input.actionType ?? undefined,
      actionMode: input.actionMode ?? undefined,
      inputs: input.inputs ?? undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const candidates = runRulesForEvent(input.ruleTemplateId, {
      event: eventForRule,
      settings,
      userSelections: { ...(input.inputs ?? {}), eventoCode: input.eventoCode },
    });
    return {
      success: true,
      data: candidates.map((c, index) => ({
        id: `${c.ruleId}-${index}-${c.dueAt ? c.dueAt.toISOString() : "placeholder"}`,
        title: c.title,
        dueAt: c.dueAt ? c.dueAt.toISOString() : "",
        explanation: c.explanation,
        ruleId: c.ruleId,
        ruleParams: c.ruleParams ?? null,
        kind: c.kind,
        priority: c.priority,
        isPlaceholder: c.isPlaceholder ?? false,
      })),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore preview sottoeventi",
    };
  }
}

/** Anteprima data e formula della fase 1 promossa (stesso calcolo del salvataggio). */
export async function getPhase1MainPreview(input: {
  macroArea: string | null;
  procedimento: string | null;
  parteProcessuale: string | null;
  eventoCode: string | null;
  inputs: Record<string, unknown> | null;
}): Promise<ActionResult<{ dueAt: string | null; explanation: string }>> {
  try {
    const { macroArea, procedimento, parteProcessuale, eventoCode, inputs } = input;
    if (!macroArea || !procedimento || !parteProcessuale || !eventoCode) {
      return { success: true, data: { dueAt: null, explanation: "" } };
    }
    const settings = await getSettings();
    const preview = computePhase1MainPreview({
      macroArea: macroArea as MacroAreaCode,
      procedimento: procedimento as ProcedimentoCode,
      parteProcessuale: parteProcessuale as ParteProcessuale,
      eventoCode,
      inputs: inputs ?? {},
      settings,
    });
    return {
      success: true,
      data: {
        dueAt: preview.dueAt ? preview.dueAt.toISOString() : null,
        explanation: preview.explanation,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore anteprima fase 1",
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

    // Aggiorna titolo + anchor della pratica (promuovi fase1).
    if (
      ctx.parent.macroType === "ATTO_GIURIDICO" &&
      ctx.parent.ruleTemplateId === "data-driven" &&
      ctx.parent.macroArea &&
      ctx.parent.procedimento &&
      ctx.parent.parteProcessuale &&
      (ctx.parent as { eventoCode?: string | null }).eventoCode
    ) {
      const settings = await getSettings();
      const inputsForCalc = ctx.userSelections;
      const eventoCode = (ctx.parent as { eventoCode?: string | null }).eventoCode as string;

      const dueAt = computePhase1MainDueAt({
        macroArea: ctx.parent.macroArea as any,
        procedimento: ctx.parent.procedimento as any,
        parteProcessuale: ctx.parent.parteProcessuale as any,
        eventoCode,
        inputs: inputsForCalc,
        settings,
      });

      if (dueAt) {
        const ev = getEventoByCode(ctx.parent.procedimento as any, eventoCode);
        const nextTitle = ev?.label ?? eventoCode;
        await prisma.event.update({
          where: { id: parentEventId },
          data: {
            title: nextTitle,
            startAt: dueAt,
            endAt: new Date(dueAt.getTime() + 60 * 60 * 1000),
          },
        });
      }
    }

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
      const previewId = `${c.ruleId}-${index}-${c.dueAt ? c.dueAt.toISOString() : "placeholder"}`;
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
