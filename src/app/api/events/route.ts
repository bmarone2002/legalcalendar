import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/db/user";

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
  macroType: z.enum(["ATTO_GIURIDICO"]).nullable().optional(),
  actionType: z.string().nullable().optional(),
  actionMode: z.string().nullable().optional(),
  inputs: z.record(z.unknown()).nullable().optional(),
  color: z.string().nullable().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const dbUser = await getOrCreateDbUser();

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const rangeStart = from ? new Date(from) : new Date();
    const rangeEnd = to ? new Date(to) : new Date(rangeStart.getTime() + 1000 * 60 * 60 * 24 * 30);

    const paddedStart = new Date(rangeStart);
    paddedStart.setUTCDate(paddedStart.getUTCDate() - 2);
    const paddedEnd = new Date(rangeEnd);
    paddedEnd.setUTCDate(paddedEnd.getUTCDate() + 2);

    const events = await prisma.event.findMany({
      where: {
        userId: dbUser.id,
        OR: [
          { startAt: { lt: paddedEnd }, endAt: { gt: paddedStart } },
          { subEvents: { some: { dueAt: { gte: paddedStart, lte: paddedEnd } } } },
        ],
      },
      include: { subEvents: { orderBy: { dueAt: "asc" } } },
      orderBy: { startAt: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    if (error instanceof Error && error.message === "Richiesta non autenticata") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.error(error);
    return new NextResponse("Errore caricamento eventi", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const dbUser = await getOrCreateDbUser();
    const json = await request.json();
    const parsed = createEventSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors.map((e) => e.message).join(". ") },
        { status: 400 }
      );
    }

    const p = parsed.data;

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

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Richiesta non autenticata") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.error(error);
    return new NextResponse("Errore creazione evento", { status: 500 });
  }
}

