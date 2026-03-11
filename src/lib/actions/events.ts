"use server";

import { z } from "zod";
import { prisma } from "../db";
import type { Event, CreateEventInput, UpdateEventInput, EventType } from "@/types";
import { getOrCreateDbUser } from "@/lib/db/user";
import { parseJsonField } from "@/lib/utils";
import { toSubEvent } from "@/lib/mappers";
import { resolveCalendarUser } from "@/lib/auth/calendar-access";

function parseTags(tags: string): string[] {
  try {
    const arr = JSON.parse(tags) as unknown;
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function toEvent(r: {
  id: string;
  title: string;
  description: string | null;
  startAt: Date;
  endAt: Date;
  type: string;
  tags: string;
  caseId: string | null;
  notes: string | null;
  generateSubEvents: boolean;
  ruleTemplateId: string | null;
  ruleParams: string | null;
  macroType?: string | null;
  macroArea?: string | null;
  procedimento?: string | null;
  parteProcessuale?: string | null;
  actionType?: string | null;
  actionMode?: string | null;
  inputs?: string | null;
  color?: string | null;
  status?: string | null;
  createdAt: Date;
  updatedAt: Date;
  subEvents?: Array<{
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
  }>;
}): Event {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    startAt: r.startAt,
    endAt: r.endAt,
    type: r.type as EventType,
    tags: parseTags(r.tags),
    caseId: r.caseId,
    notes: r.notes,
    generateSubEvents: r.generateSubEvents,
    ruleTemplateId: r.ruleTemplateId,
    ruleParams: parseJsonField(r.ruleParams),
    macroType: r.macroType === "ATTO_GIURIDICO" ? "ATTO_GIURIDICO" : undefined,
    macroArea: r.macroArea ?? null,
    procedimento: r.procedimento ?? null,
    parteProcessuale: r.parteProcessuale ?? null,
    actionType: r.actionType ?? undefined,
    actionMode: r.actionMode ?? undefined,
    inputs: parseJsonField(r.inputs ?? null),
    color: r.color ?? null,
    status: (r.status === "done" ? "done" : "pending") as import("@/types").EventStatus,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    ...(r.subEvents && {
      subEvents: r.subEvents.map(toSubEvent),
    }),
  };
}

const createEventSchema = z.object({
  title: z.string().min(1, "Inserire un titolo evento"),
  description: z.string().nullable().optional(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  type: z.enum(["udienza", "notifica", "deposito", "scadenza", "altro"]).optional(),
  tags: z.array(z.string()).optional(),
  caseId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  generateSubEvents: z.boolean().optional(),
  ruleTemplateId: z.string().nullable().optional(),
  ruleParams: z.record(z.unknown()).nullable().optional(),
  macroType: z.enum(["ATTO_GIURIDICO"]).nullable().optional(),
  macroArea: z.string().nullable().optional(),
  procedimento: z.string().nullable().optional(),
  parteProcessuale: z.string().nullable().optional(),
  actionType: z.string().nullable().optional(),
  actionMode: z.string().nullable().optional(),
  inputs: z.record(z.unknown()).nullable().optional(),
  color: z.string().nullable().optional(),
  status: z.enum(["pending", "done"]).optional(),
});

const updateEventSchema = createEventSchema.partial();

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

function formatValidationError(err: z.ZodError): string {
  const first = err.errors[0];
  if (first?.path?.[0] === "title" && first?.code === "too_small") return "Inserire un titolo evento";
  return err.errors.map((e) => e.message).filter(Boolean).join(". ") || err.message;
}

export async function createEvent(data: CreateEventInput, targetUserId?: string): Promise<ActionResult<Event>> {
  const parsed = createEventSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: formatValidationError(parsed.error) };
  }
  const p = parsed.data;
  try {
    const { userId } = await resolveCalendarUser(targetUserId, "FULL");
    const event = await prisma.event.create({
      data: {
        userId,
        title: p.title,
        description: p.description ?? null,
        startAt: p.startAt,
        endAt: p.endAt,
        type: p.type ?? "altro",
        tags: JSON.stringify(p.tags ?? []),
        caseId: p.caseId ?? null,
        notes: p.notes ?? null,
        generateSubEvents: p.generateSubEvents ?? false,
        ruleTemplateId: p.ruleTemplateId ?? null,
        ruleParams: p.ruleParams != null ? JSON.stringify(p.ruleParams) : null,
        macroType: p.macroType ?? null,
        macroArea: p.macroArea ?? null,
        procedimento: p.procedimento ?? null,
        parteProcessuale: p.parteProcessuale ?? null,
        actionType: p.actionType ?? null,
        actionMode: p.actionMode ?? null,
        inputs: p.inputs != null ? JSON.stringify(p.inputs) : null,
        color: p.color ?? null,
        status: p.status ?? "pending",
      },
    });
    return { success: true, data: toEvent(event) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore creazione evento",
    };
  }
}

export async function updateEvent(
  id: string,
  data: UpdateEventInput,
  targetUserId?: string
): Promise<ActionResult<Event>> {
  const parsed = updateEventSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: formatValidationError(parsed.error) };
  }
  const p = parsed.data;
  try {
    const existing = await prisma.event.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) {
      return { success: false, error: "Evento non trovato" };
    }
    await resolveCalendarUser(targetUserId ?? existing.userId, "FULL");

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(p.title != null && { title: p.title }),
        ...(p.description !== undefined && { description: p.description }),
        ...(p.startAt != null && { startAt: p.startAt }),
        ...(p.endAt != null && { endAt: p.endAt }),
        ...(p.type != null && { type: p.type }),
        ...(p.tags != null && { tags: JSON.stringify(p.tags) }),
        ...(p.caseId !== undefined && { caseId: p.caseId }),
        ...(p.notes !== undefined && { notes: p.notes }),
        ...(p.generateSubEvents !== undefined && { generateSubEvents: p.generateSubEvents }),
        ...(p.ruleTemplateId !== undefined && { ruleTemplateId: p.ruleTemplateId }),
        ...(p.ruleParams !== undefined && {
          ruleParams: p.ruleParams != null ? JSON.stringify(p.ruleParams) : null,
        }),
        ...(p.macroType !== undefined && { macroType: p.macroType }),
        ...(p.macroArea !== undefined && { macroArea: p.macroArea }),
        ...(p.procedimento !== undefined && { procedimento: p.procedimento }),
        ...(p.parteProcessuale !== undefined && { parteProcessuale: p.parteProcessuale }),
        ...(p.actionType !== undefined && { actionType: p.actionType }),
        ...(p.actionMode !== undefined && { actionMode: p.actionMode }),
        ...(p.inputs !== undefined && {
          inputs: p.inputs != null ? JSON.stringify(p.inputs) : null,
        }),
        ...(p.color !== undefined && { color: p.color ?? null }),
        ...(p.status !== undefined && { status: p.status }),
      },
    });
    return { success: true, data: toEvent(event) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore aggiornamento evento",
    };
  }
}

export async function deleteEvent(id: string, targetUserId?: string): Promise<ActionResult<void>> {
  try {
    const existing = await prisma.event.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) {
      return { success: false, error: "Evento non trovato" };
    }
    await resolveCalendarUser(targetUserId ?? existing.userId, "FULL");

    await prisma.event.delete({ where: { id } });
    return { success: true, data: undefined };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore eliminazione evento",
    };
  }
}

export async function getEvents(start: Date, end: Date, targetUserId?: string): Promise<ActionResult<Event[]>> {
  try {
    const { userId } = await resolveCalendarUser(targetUserId, "VIEW_ONLY");
    const rangeStart = new Date(start);
    rangeStart.setUTCDate(rangeStart.getUTCDate() - 1);
    const rangeEnd = new Date(end);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 1);
    const events = await prisma.event.findMany({
      where: {
        userId,
        OR: [
          { startAt: { lt: rangeEnd }, endAt: { gt: rangeStart } },
          { subEvents: { some: { dueAt: { gte: rangeStart, lte: rangeEnd } } } },
        ],
      },
      include: { subEvents: { orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { priority: "asc" }] } },
      orderBy: { startAt: "asc" },
    });
    return { success: true, data: events.map(toEvent) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore caricamento eventi",
    };
  }
}

export async function getEventById(id: string, targetUserId?: string): Promise<ActionResult<Event | null>> {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { subEvents: { orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { priority: "asc" }] } },
    });
    if (!event) {
      return { success: true, data: null };
    }
    await resolveCalendarUser(targetUserId ?? event.userId, "VIEW_ONLY");
    return { success: true, data: toEvent(event) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore caricamento evento",
    };
  }
}
