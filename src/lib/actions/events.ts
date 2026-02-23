"use server";

import { z } from "zod";
import { prisma } from "../db";
import type { Event, CreateEventInput, UpdateEventInput, EventType } from "@/types";

function parseTags(tags: string): string[] {
  try {
    const arr = JSON.parse(tags) as unknown;
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
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

function toEvent(r: {
  id: string;
  title: string;
  description: string | null;
  startAt: Date;
  endAt: Date;
  type: EventType;
  tags: string;
  caseId: string | null;
  notes: string | null;
  generateSubEvents: boolean;
  ruleTemplateId: string | null;
  ruleParams: string | null;
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
    ruleParams: parseRuleParams(r.ruleParams),
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
        ruleParams: parseRuleParams(s.ruleParams),
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
  title: z.string().min(1),
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
});

const updateEventSchema = createEventSchema.partial();

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createEvent(data: CreateEventInput): Promise<ActionResult<Event>> {
  const parsed = createEventSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().message as unknown as string };
  }
  const p = parsed.data;
  try {
    const event = await prisma.event.create({
      data: {
        title: p.title,
        description: p.description ?? null,
        startAt: p.startAt,
        endAt: p.endAt,
        type: (p.type ?? "altro") as "udienza" | "notifica" | "deposito" | "scadenza" | "altro",
        tags: JSON.stringify(p.tags ?? []),
        caseId: p.caseId ?? null,
        notes: p.notes ?? null,
        generateSubEvents: p.generateSubEvents ?? false,
        ruleTemplateId: p.ruleTemplateId ?? null,
        ruleParams: p.ruleParams != null ? JSON.stringify(p.ruleParams) : null,
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
    return { success: false, error: parsed.error.flatten().message as unknown as string };
  }
  const p = parsed.data;
  try {
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
    const events = await prisma.event.findMany({
      where: {
        startAt: { gte: start },
        endAt: { lte: end },
      },
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
    const event = await prisma.event.findUnique({
      where: { id },
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
