import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveCalendarUser } from "@/lib/auth/calendar-access";
import type { BackupEvent, BackupFile, BackupSubEvent } from "@/types/backup";

export async function GET() {
  try {
    const { userId } = await resolveCalendarUser(undefined, "VIEW_ONLY");

    const events = await prisma.event.findMany({
      where: { userId },
      include: {
        subEvents: {
          orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { priority: "asc" }],
        },
      },
      orderBy: { startAt: "asc" },
    });

    const backupEvents: BackupEvent[] = events.map((e) => {
      const base: BackupEvent = {
        id: e.id,
        title: e.title,
        description: e.description,
        startAt: e.startAt.toISOString(),
        endAt: e.endAt.toISOString(),
        type: e.type as BackupEvent["type"],
        tags: JSON.parse(e.tags ?? "[]"),
        caseId: e.caseId,
        notes: e.notes,
        generateSubEvents: e.generateSubEvents,
        ruleTemplateId: e.ruleTemplateId,
        ruleParams: e.ruleParams ? (JSON.parse(e.ruleParams) as Record<string, unknown>) : null,
        macroType: (e.macroType as BackupEvent["macroType"]) ?? null,
        macroArea: e.macroArea,
        procedimento: e.procedimento,
        parteProcessuale: e.parteProcessuale,
        actionType: e.actionType,
        actionMode: e.actionMode,
        inputs: e.inputs ? (JSON.parse(e.inputs) as Record<string, unknown>) : null,
        color: e.color,
        status: (e.status === "done" ? "done" : "pending") as BackupEvent["status"],
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
        metadata: undefined,
        subEvents: e.subEvents?.map<BackupSubEvent>((s) => ({
          id: s.id,
          parentEventId: s.parentEventId,
          title: s.title,
          kind: s.kind as BackupSubEvent["kind"],
          dueAt: s.dueAt?.toISOString() ?? "",
          status: s.status as BackupSubEvent["status"],
          priority: s.priority,
          ruleId: s.ruleId,
          ruleParams: s.ruleParams ? (JSON.parse(s.ruleParams) as Record<string, unknown>) : null,
          explanation: s.explanation,
          createdBy: s.createdBy as BackupSubEvent["createdBy"],
          locked: s.locked,
          createdAt: s.createdAt.toISOString(),
          updatedAt: s.updatedAt.toISOString(),
          metadata: undefined,
        })),
      };
      return base;
    });

    const now = new Date();

    const backup: BackupFile = {
      schemaVersion: "1.0",
      generatedAt: now.toISOString(),
      userId,
      events: backupEvents,
      metadata: {},
    };

    const filename = `backup-calendario-${now.toISOString().slice(0, 10)}.json`;

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Errore generazione backup:", error);
    return NextResponse.json(
      { error: "Non è stato possibile generare il backup." },
      { status: 500 }
    );
  }
}

