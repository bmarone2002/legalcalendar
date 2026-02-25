import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/db/user";

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const dbUser = await getOrCreateDbUser();
    const json = await request.json();
    const parsed = updateEventSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors.map((e) => e.message).join(". ") },
        { status: 400 }
      );
    }

    const existing = await prisma.event.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== dbUser.id) {
      return new NextResponse("Not found", { status: 404 });
    }

    const p = parsed.data;

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

    return NextResponse.json(event);
  } catch (error) {
    if (error instanceof Error && error.message === "Richiesta non autenticata") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.error(error);
    return new NextResponse("Errore aggiornamento evento", { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const dbUser = await getOrCreateDbUser();

    const existing = await prisma.event.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existing || existing.userId !== dbUser.id) {
      return new NextResponse("Not found", { status: 404 });
    }

    await prisma.event.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Richiesta non autenticata") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.error(error);
    return new NextResponse("Errore eliminazione evento", { status: 500 });
  }
}

