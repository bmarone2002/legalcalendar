import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveCalendarUser } from "@/lib/auth/calendar-access";
import type { BackupFile, BackupEvent, BackupSubEvent } from "@/types/backup";

function parseBackup(json: unknown): BackupFile {
  if (!json || typeof json !== "object") {
    throw new Error("File di backup non valido.");
  }
  const data = json as Partial<BackupFile>;
  if (!data.schemaVersion || !data.generatedAt || !Array.isArray(data.events)) {
    throw new Error("Struttura del file di backup non riconosciuta.");
  }
  if (data.schemaVersion !== "1.0") {
    throw new Error("Versione del file di backup non supportata.");
  }
  return data as BackupFile;
}

function toDate(value: string, field: string): Date {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Valore data non valido nel campo ${field}.`);
  }
  return d;
}

export async function POST(req: Request) {
  try {
    const { userId } = await resolveCalendarUser(undefined, "FULL");

    const contentType = req.headers.get("content-type") ?? "";
    let backup: BackupFile;

    if (contentType.startsWith("application/json")) {
      const body = (await req.json()) as unknown;
      backup = parseBackup(body);
    } else if (contentType.startsWith("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!(file instanceof File)) {
        throw new Error("File di backup mancante.");
      }
      const text = await file.text();
      const json = JSON.parse(text) as unknown;
      backup = parseBackup(json);
    } else {
      throw new Error("Formato richiesta non supportato. Usa JSON o multipart/form-data.");
    }

    const events = backup.events ?? [];

    if (events.length > 5000) {
      throw new Error("Il file di backup contiene troppi eventi. Riduci il numero di eventi e riprova.");
    }

    await prisma.$transaction(async (tx) => {
      await tx.subEvent.deleteMany({
        where: { parentEvent: { userId } },
      });
      await tx.event.deleteMany({
        where: { userId },
      });

      for (const e of events) {
        const eventData: BackupEvent = e;

        const createdEvent = await tx.event.create({
          data: {
            userId,
            title: eventData.title,
            description: eventData.description,
            startAt: toDate(eventData.startAt, "event.startAt"),
            endAt: toDate(eventData.endAt, "event.endAt"),
            type: eventData.type,
            tags: JSON.stringify(eventData.tags ?? []),
            caseId: eventData.caseId,
            notes: eventData.notes,
            generateSubEvents: eventData.generateSubEvents ?? false,
            ruleTemplateId: eventData.ruleTemplateId,
            ruleParams:
              eventData.ruleParams != null
                ? JSON.stringify(eventData.ruleParams)
                : null,
            macroType: eventData.macroType ?? null,
            actionType: eventData.actionType ?? null,
            actionMode: eventData.actionMode ?? null,
            inputs:
              eventData.inputs != null ? JSON.stringify(eventData.inputs) : null,
            color: eventData.color ?? null,
            status: eventData.status ?? "pending",
          },
        });

        if (eventData.subEvents && eventData.subEvents.length > 0) {
          for (const s of eventData.subEvents) {
            const sub: BackupSubEvent = s;
            await tx.subEvent.create({
              data: {
                parentEventId: createdEvent.id,
                title: sub.title,
                kind: sub.kind,
                dueAt: toDate(sub.dueAt, "subEvent.dueAt"),
                status: sub.status,
                priority: sub.priority,
                ruleId: sub.ruleId,
                ruleParams:
                  sub.ruleParams != null ? JSON.stringify(sub.ruleParams) : null,
                explanation: sub.explanation,
                createdBy: sub.createdBy,
                locked: sub.locked,
              },
            });
          }
        }
      }
    });

    return NextResponse.json(
      {
        success: true,
        importedEvents: events.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Errore ripristino backup:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Non è stato possibile ripristinare il backup.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

