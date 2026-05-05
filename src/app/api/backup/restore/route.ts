import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolveCalendarUser } from "@/lib/auth/calendar-access";
import type { BackupFile, BackupEvent, BackupSubEvent } from "@/types/backup";
import { checkRateLimit, getRateLimitKey } from "@/lib/server/rate-limit";
import { getRequestId, withRequestIdHeaders } from "@/lib/server/request-context";

const MAX_EVENTS_PER_RESTORE = 5000;
const MAX_SUBEVENTS_PER_EVENT = 500;
const MAX_RINVII_PER_EVENT = 200;
const MAX_BACKUP_FILE_BYTES = 10 * 1024 * 1024;

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
  const requestId = getRequestId(req);
  try {
    const decision = checkRateLimit({
      key: getRateLimitKey(req, "backup-restore"),
      limit: 3,
      windowMs: 10 * 60_000,
    });
    if (!decision.allowed) {
      return withRequestIdHeaders(NextResponse.json(
        { success: false, error: "Troppi tentativi di ripristino. Riprova più tardi." },
        {
          status: 429,
          headers: { "Retry-After": String(decision.retryAfterSeconds) },
        }
      ), requestId);
    }

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
      if (file.size > MAX_BACKUP_FILE_BYTES) {
        throw new Error("File di backup troppo grande (max 10MB).");
      }
      const text = await file.text();
      const json = JSON.parse(text) as unknown;
      backup = parseBackup(json);
    } else {
      throw new Error("Formato richiesta non supportato. Usa JSON o multipart/form-data.");
    }

    const events = backup.events ?? [];

    if (events.length > MAX_EVENTS_PER_RESTORE) {
      throw new Error("Il file di backup contiene troppi eventi. Riduci il numero di eventi e riprova.");
    }

    for (const [index, event] of events.entries()) {
      if ((event.subEvents?.length ?? 0) > MAX_SUBEVENTS_PER_EVENT) {
        throw new Error(`Evento #${index + 1}: troppi sottoeventi (max ${MAX_SUBEVENTS_PER_EVENT}).`);
      }
      if ((event.rinvii?.length ?? 0) > MAX_RINVII_PER_EVENT) {
        throw new Error(`Evento #${index + 1}: troppi rinvii (max ${MAX_RINVII_PER_EVENT}).`);
      }
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
            ruleTemplateId:
              eventData.ruleTemplateId === "atto-giuridico"
                ? "data-driven"
                : eventData.ruleTemplateId,
            ruleParams:
              eventData.ruleParams != null
                ? JSON.stringify(eventData.ruleParams)
                : null,
            macroType: eventData.macroType ?? null,
            macroArea: (eventData as { macroArea?: string | null }).macroArea ?? null,
            procedimento: (eventData as { procedimento?: string | null }).procedimento ?? null,
            parteProcessuale: (eventData as { parteProcessuale?: string | null }).parteProcessuale ?? null,
            eventoCode: (eventData as { eventoCode?: string | null }).eventoCode ?? null,
            inputs:
              eventData.inputs != null ? JSON.stringify(eventData.inputs) : null,
            color: eventData.color ?? null,
            status: eventData.status ?? "pending",
          },
        });

        if (eventData.subEvents && eventData.subEvents.length > 0) {
          const subEventsToCreate = eventData.subEvents.map((s) => {
            const sub: BackupSubEvent = s;
            return {
              parentEventId: createdEvent.id,
              title: sub.title,
              kind: sub.kind,
              dueAt: sub.dueAt ? toDate(sub.dueAt, "subEvent.dueAt") : null,
              isPlaceholder: (sub as { isPlaceholder?: boolean }).isPlaceholder ?? false,
              status: sub.status,
              priority: sub.priority,
              ruleId: sub.ruleId,
              ruleParams: sub.ruleParams != null ? JSON.stringify(sub.ruleParams) : null,
              explanation: sub.explanation,
              createdBy: sub.createdBy,
              locked: sub.locked,
            };
          });
          await tx.subEvent.createMany({ data: subEventsToCreate });
        }

        if (eventData.rinvii && eventData.rinvii.length > 0) {
          const rinviiToCreate = eventData.rinvii.map((r) => ({
            parentEventId: createdEvent.id,
            numero: r.numero,
            dataUdienza: toDate(r.dataUdienza, "rinvio.dataUdienza"),
            tipoUdienza: r.tipoUdienza,
            tipoUdienzaCustom: r.tipoUdienzaCustom ?? null,
            note: r.note ?? null,
            adempimenti: JSON.stringify(Array.isArray(r.adempimenti) ? r.adempimenti : []),
          }));
          await tx.rinvio.createMany({ data: rinviiToCreate });
        }
      }
    }, { timeout: 30_000 });

    return withRequestIdHeaders(NextResponse.json(
      {
        success: true,
        importedEvents: events.length,
      },
      { status: 200 }
    ), requestId);
  } catch (error) {
    console.error("Errore ripristino backup:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Non è stato possibile ripristinare il backup.";
    return withRequestIdHeaders(
      NextResponse.json({ success: false, error: message }, { status: 400 }),
      requestId
    );
  }
}

