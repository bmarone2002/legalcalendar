"use server";

import { z } from "zod";
import { prisma } from "../db";
import type { Event, CreateEventInput, UpdateEventInput, EventType } from "@/types";
import { getOrCreateDbUser } from "@/lib/db/user";
import { parseJsonField } from "@/lib/utils";

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
  actionType?: string | null;
  actionMode?: string | null;
  inputs?: string | null;
  color?: string | null;
  createdAt: Date;
  updatedAt: Date;
  subEvents?: Array<{
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
    actionType: r.actionType ?? undefined,
    actionMode: r.actionMode ?? undefined,
    inputs: parseJsonField(r.inputs ?? null),
    color: r.color ?? null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    ...(r.subEvents && {
      subEvents: r.subEvents.map((s) => ({
        id: s.id,
        parentEventId: s.parentEventId,
        title: s.title,
        kind: s.kind as "termine" | "promemoria" | "attivita",
        dueAt: s.dueAt,
        status: s.status as "pending" | "done" | "cancelled",
        priority: s.priority,
        ruleId: s.ruleId,
        ruleParams: parseJsonField(s.ruleParams),
        explanation: s.explanation,
        createdBy: s.createdBy as "manuale" | "automatico",
        locked: s.locked,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
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
  actionType: z.string().nullable().optional(),
  actionMode: z.string().nullable().optional(),
  inputs: z.record(z.unknown()).nullable().optional(),
  color: z.string().nullable().optional(),
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

export async function createEvent(data: CreateEventInput): Promise<ActionResult<Event>> {
  const parsed = createEventSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: formatValidationError(parsed.error) };
  }
  const p = parsed.data;
  try {
    const dbUser = await getOrCreateDbUser();
    const event = await prisma.event.create({
      data: {
        userId: dbUser.id,
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
        actionType: p.actionType ?? null,
        actionMode: p.actionMode ?? null,
        inputs: p.inputs != null ? JSON.stringify(p.inputs) : null,
        color: p.color ?? null,
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
  data: UpdateEventInput
): Promise<ActionResult<Event>> {
  const parsed = updateEventSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: formatValidationError(parsed.error) };
  }
  const p = parsed.data;
  try {
    const dbUser = await getOrCreateDbUser();
    const existing = await prisma.event.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing || existing.userId !== dbUser.id) {
      return { success: false, error: "Evento non trovato" };
    }

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
        ...(p.actionType !== undefined && { actionType: p.actionType }),
        ...(p.actionMode !== undefined && { actionMode: p.actionMode }),
        ...(p.inputs !== undefined && {
          inputs: p.inputs != null ? JSON.stringify(p.inputs) : null,
        }),
        ...(p.color !== undefined && { color: p.color ?? null }),
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

export async function deleteEvent(id: string): Promise<ActionResult<void>> {
  try {
    const dbUser = await getOrCreateDbUser();
    const existing = await prisma.event.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing || existing.userId !== dbUser.id) {
      return { success: false, error: "Evento non trovato" };
    }

    await prisma.event.delete({ where: { id } });
    return { success: true, data: undefined };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore eliminazione evento",
    };
  }
}

export async function getEvents(start: Date, end: Date): Promise<ActionResult<Event[]>> {
  try {
    const dbUser = await getOrCreateDbUser();
    const rangeStart = new Date(start);
    rangeStart.setUTCDate(rangeStart.getUTCDate() - 2);
    const rangeEnd = new Date(end);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 2);
    const events = await prisma.event.findMany({
      where: {
        userId: dbUser.id,
        OR: [
          { startAt: { lt: rangeEnd }, endAt: { gt: rangeStart } },
          { subEvents: { some: { dueAt: { gte: rangeStart, lte: rangeEnd } } } },
        ],
      },
      include: { subEvents: { orderBy: { dueAt: "asc" } } },
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

export async function getEventById(id: string): Promise<ActionResult<Event | null>> {
  try {
    const dbUser = await getOrCreateDbUser();
    const event = await prisma.event.findFirst({
      where: { id, userId: dbUser.id },
      include: { subEvents: { orderBy: { dueAt: "asc" } } },
    });
    return { success: true, data: event ? toEvent(event) : null };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore caricamento evento",
    };
  }
}
