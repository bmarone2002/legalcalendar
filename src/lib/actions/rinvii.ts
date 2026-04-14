"use server";

import { z } from "zod";
import { prisma } from "../db";
import { getSettings } from "../settings";
import { adjustFinalDeadline, applyDeadlineTime } from "@/lib/date-utils";
import { addDays } from "date-fns";
import type {
  Rinvio,
  Adempimento,
  CreateRinvioInput,
  UpdateRinvioInput,
  TipoUdienza,
  LinkedEventSpec,
} from "@/types/rinvio";
import { computeLinkedEventDueAt } from "@/lib/linked-events";
import { TIPO_UDIENZA_LABELS, TIPI_UDIENZA } from "@/types/rinvio";
import type { ActionResult } from "./events";
import { resolveCalendarUser } from "@/lib/auth/calendar-access";
import { runRulesForEvent } from "../rules/engine";
import { loadParentContext } from "./sub-events";
import { getEventoByCode } from "@/types/macro-areas";
import type { ProcedimentoCode } from "@/types/macro-areas";

const RINVIO_RULE_ID = "rinvio-udienza";

const adempimentoSchema = z.object({
  id: z.string().min(1),
  titolo: z.string().min(1, "Titolo adempimento obbligatorio"),
  scadenza: z.string().min(1, "Scadenza adempimento obbligatoria"),
  giorniAlert: z.number().int().min(0),
  note: z.string().optional(),
});

const linkedEventSpecSchema = z.object({
  title: z.string().min(1),
  offsetDays: z.number().int(),
});

const createRinvioSchema = z.object({
  parentEventId: z.string().min(1),
  isUdienza: z.boolean().optional(),
  dataUdienza: z.coerce.date(),
  tipoUdienza: z.string().min(1, "Tipo udienza obbligatorio"),
  tipoUdienzaCustom: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  adempimenti: z.array(adempimentoSchema),
  eventoCode: z.string().nullable().optional(),
  reminderOffsets: z.array(z.number().int().min(0)).optional(),
  linkedEvents: z.array(linkedEventSpecSchema).optional(),
});

const updateRinvioSchema = z.object({
  isUdienza: z.boolean().optional(),
  dataUdienza: z.coerce.date().optional(),
  tipoUdienza: z.string().min(1).optional(),
  tipoUdienzaCustom: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  adempimenti: z.array(adempimentoSchema).optional(),
  reminderOffsets: z.array(z.number().int().min(0)).optional(),
  linkedEvents: z.array(linkedEventSpecSchema).optional(),
});

function toDateOnlyString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseAdempimenti(json: string): Adempimento[] {
  try {
    const arr = JSON.parse(json) as unknown;
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function toRinvio(r: {
  id: string;
  parentEventId: string;
  numero: number;
  dataUdienza: Date;
  tipoUdienza: string;
  tipoUdienzaCustom: string | null;
  note: string | null;
  adempimenti: string;
  createdAt: Date;
  updatedAt: Date;
}, reminderOffsets?: number[], linkedEvents?: LinkedEventSpec[], isUdienza?: boolean): Rinvio {
  return {
    id: r.id,
    parentEventId: r.parentEventId,
    numero: r.numero,
    isUdienza: isUdienza ?? true,
    dataUdienza: r.dataUdienza,
    tipoUdienza: r.tipoUdienza,
    tipoUdienzaCustom: r.tipoUdienzaCustom,
    note: r.note,
    adempimenti: parseAdempimenti(r.adempimenti),
    reminderOffsets,
    linkedEvents,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

function resolveUdienzaLabel(
  tipoUdienza: string,
  tipoUdienzaCustom: string | null | undefined
): string {
  if (tipoUdienza === "ALTRO" && tipoUdienzaCustom) return tipoUdienzaCustom;
  return TIPO_UDIENZA_LABELS[tipoUdienza as TipoUdienza] ?? tipoUdienza;
}

function mapTipoUdienzaToEventoCode(
  procedimento: ProcedimentoCode,
  tipoUdienza: TipoUdienza,
): string | null {
  switch (procedimento) {
    case "RICORSO_RITO_SEMPLIFICATO": {
      if (tipoUdienza === "TRATTAZIONE" || tipoUdienza === "PRIMA_COMPARIZIONE") {
        return "PRIMA_UDIENZA_RICORSO";
      }
      if (
        tipoUdienza === "PRECISAZIONE_CONCLUSIONI" ||
        tipoUdienza === "DISCUSSIONE_ORALE"
      ) {
        return "UDIENZA_CONCLUSIONI_RICORSO";
      }
      return null;
    }
    case "CITAZIONE_CIVILE": {
      if (tipoUdienza === "TRATTAZIONE" || tipoUdienza === "PRIMA_COMPARIZIONE") {
        return "UDIENZA_ISTRUTTORIA";
      }
      if (
        tipoUdienza === "PRECISAZIONE_CONCLUSIONI" ||
        tipoUdienza === "DISCUSSIONE_ORALE"
      ) {
        return "UDIENZA_CONCLUSIONI";
      }
      return null;
    }
    default:
      return null;
  }
}

interface RinvioUdienzaInfo {
  dataUdienza: Date;
  tipoUdienza: string;
  tipoUdienzaCustom?: string | null;
}

async function generateSubEventsForRinvio(
  parentEventId: string,
  rinvioId: string,
  udienzaInfo: RinvioUdienzaInfo,
  adempimenti: Adempimento[],
  selectedEventoCode?: string | null,
  reminderOffsetsFromInput?: number[] | null,
  linkedEventsFromInput?: LinkedEventSpec[] | null,
  isUdienza: boolean = true,
): Promise<void> {
  const settings = await getSettings();
  const udienzaLabel = resolveUdienzaLabel(
    udienzaInfo.tipoUdienza,
    udienzaInfo.tipoUdienzaCustom
  );

  const udienzaDueAt = applyDeadlineTime(udienzaInfo.dataUdienza, settings);
  const reminderOffsets =
    reminderOffsetsFromInput && reminderOffsetsFromInput.length > 0
      ? reminderOffsetsFromInput
      : [];

  const batch = [
    {
      parentEventId,
      title: isUdienza ? `Udienza: ${udienzaLabel}` : udienzaLabel,
      kind: "termine",
      dueAt: udienzaDueAt,
      status: "pending",
      priority: 2,
      ruleId: RINVIO_RULE_ID,
      ruleParams: JSON.stringify({ rinvioId, tipo: isUdienza ? "udienza" : "fase" }),
      explanation: isUdienza
        ? `Udienza di ${udienzaLabel.toLowerCase()} da rinvio`
        : `Fase procedurale da rinvio: ${udienzaLabel}`,
      createdBy: "automatico",
      locked: false,
    },
  ];

  for (const daysBefore of reminderOffsets) {
    if (daysBefore <= 0) continue;
    const alertRaw = addDays(udienzaInfo.dataUdienza, -daysBefore);
    const alertAdjusted = adjustFinalDeadline(alertRaw, "backward", settings);
    const alertDueAt = applyDeadlineTime(alertAdjusted, settings);

    batch.push({
      parentEventId,
      title: `Udienza: ${udienzaLabel} – Promemoria (${daysBefore} gg prima)`,
      kind: "promemoria",
      dueAt: alertDueAt,
      status: "pending",
      priority: 0,
      ruleId: RINVIO_RULE_ID,
      ruleParams: JSON.stringify({ rinvioId, tipo: "udienza" }),
      explanation: `Promemoria ${daysBefore} giorni prima dell'udienza`,
      createdBy: "automatico",
      locked: false,
    });
  }

  for (const le of linkedEventsFromInput ?? []) {
    const title = le.title.trim();
    if (!title) continue;
    const dueAt = computeLinkedEventDueAt(
      udienzaInfo.dataUdienza,
      le.offsetDays,
      settings,
    );
    batch.push({
      parentEventId,
      title,
      kind: "attivita",
      dueAt,
      status: "pending",
      priority: 0,
      ruleId: RINVIO_RULE_ID,
      ruleParams: JSON.stringify({
        rinvioId,
        tipo: "evento-collegato",
        offsetDays: le.offsetDays,
      }),
      explanation: `Evento collegato al rinvio (${le.offsetDays >= 0 ? "+" : ""}${le.offsetDays} gg dalla data udienza)`,
      createdBy: "manuale",
      locked: false,
    });
  }

  for (const a of adempimenti) {
    if (!a.scadenza || !a.titolo) continue;
    const rawDate = new Date(a.scadenza + "T12:00:00");
    if (isNaN(rawDate.getTime())) continue;

    const adjusted = adjustFinalDeadline(rawDate, "forward", settings);
    const dueAt = applyDeadlineTime(adjusted, settings);

    batch.push({
      parentEventId,
      title: a.titolo,
      kind: "termine",
      dueAt,
      status: "pending",
      priority: 1,
      ruleId: RINVIO_RULE_ID,
      ruleParams: JSON.stringify({ rinvioId, adempimentoId: a.id }),
      explanation: `Adempimento da rinvio udienza: ${a.titolo}`,
      createdBy: "automatico",
      locked: false,
    });

    if (a.giorniAlert > 0) {
      const adempAlertRaw = addDays(rawDate, -a.giorniAlert);
      const adempAlertAdjusted = adjustFinalDeadline(adempAlertRaw, "backward", settings);
      const adempAlertDueAt = applyDeadlineTime(adempAlertAdjusted, settings);

      batch.push({
        parentEventId,
        title: `${a.titolo} – Promemoria (${a.giorniAlert} gg prima)`,
        kind: "promemoria",
        dueAt: adempAlertDueAt,
        status: "pending",
        priority: 0,
        ruleId: RINVIO_RULE_ID,
        ruleParams: JSON.stringify({ rinvioId, adempimentoId: a.id }),
        explanation: `Promemoria ${a.giorniAlert} giorni prima della scadenza`,
        createdBy: "automatico",
        locked: false,
      });
    }
  }

  // Usa il motore data-driven per generare eventuali ulteriori sottoeventi
  // collegati alla stessa pratica madre, a partire dalla data del rinvio.
  const ctx = await loadParentContext(parentEventId);
  if (ctx && ctx.parent.ruleTemplateId === "data-driven") {
    const procedimento = ctx.parent.procedimento as ProcedimentoCode | null;
    const tipo = udienzaInfo.tipoUdienza as TipoUdienza;

    if (procedimento) {
      const effectiveCode =
        selectedEventoCode && selectedEventoCode.trim().length > 0
          ? selectedEventoCode
          : mapTipoUdienzaToEventoCode(procedimento, tipo);
      if (effectiveCode) {
        const eventoDef = getEventoByCode(procedimento, effectiveCode);
        if (eventoDef) {
          const baseDateStr = toDateOnlyString(udienzaInfo.dataUdienza);

          const originalInputs = (ctx.eventForRule.inputs ?? {}) as Record<string, unknown>;
          const { reminderOffsets: _ignoredReminderOffsets, ...inputsWithoutReminders } =
            originalInputs;

          const inputsForRinvio = {
            ...inputsWithoutReminders,
            [eventoDef.inputKey]: baseDateStr,
            // Per i rinvii: se l'utente non imposta promemoria, non vogliamo default automatici.
            // Passiamo sempre reminderOffsets (anche []), così il motore data-driven non
            // ricade sui valori di default delle impostazioni.
            reminderOffsets,
          } as Record<string, unknown>;

          const userSelections = {
            ...ctx.userSelections,
            ...inputsForRinvio,
            eventoCode: effectiveCode,
          };

          const eventForRule = {
            ...ctx.eventForRule,
            eventoCode: effectiveCode,
            inputs: inputsForRinvio,
          };

          const candidates = runRulesForEvent(ctx.parent.ruleTemplateId, {
            event: eventForRule,
            settings,
            userSelections,
          });

          for (const c of candidates) {
            if (!c.dueAt) continue;

            const params = (c.ruleParams ?? {}) as Record<string, unknown>;
            const isBasePhaseActivityFromRinvio =
              c.ruleId === "data-driven" &&
              c.kind === "attivita" &&
              params.eventoBaseKey === eventoDef.inputKey &&
              params.tipoTermine === "manuale";
            if (isBasePhaseActivityFromRinvio) {
              continue;
            }

            batch.push({
              parentEventId,
              title: c.title,
              kind: c.kind,
              dueAt: c.dueAt,
              status: c.status ?? "pending",
              priority: c.priority ?? 0,
              ruleId: RINVIO_RULE_ID,
              ruleParams: JSON.stringify({
                ...(c.ruleParams ?? {}),
                rinvioId,
                tipo: "fase-procedurale",
                eventoCode: effectiveCode,
              }),
              explanation: c.explanation,
              createdBy: "automatico",
              locked: c.isPlaceholder ?? false,
            });
          }
        }
      }
    }
  }

  await prisma.subEvent.createMany({ data: batch });
}

async function deleteSubEventsForRinvio(parentEventId: string, rinvioId: string): Promise<void> {
  const subs = await prisma.subEvent.findMany({
    where: { parentEventId, ruleId: RINVIO_RULE_ID },
    select: { id: true, ruleParams: true },
  });

  const toDelete = subs.filter((s) => {
    if (!s.ruleParams) return false;
    try {
      const params = JSON.parse(s.ruleParams) as Record<string, unknown>;
      return params.rinvioId === rinvioId;
    } catch {
      return false;
    }
  });

  if (toDelete.length > 0) {
    await prisma.subEvent.deleteMany({
      where: { id: { in: toDelete.map((s) => s.id) } },
    });
  }
}

async function getEventOwner(eventId: string): Promise<string | null> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { userId: true },
  });
  return event?.userId ?? null;
}

export async function getRinviiByEventId(
  eventId: string,
  targetUserId?: string
): Promise<ActionResult<Rinvio[]>> {
  try {
    const ownerId = await getEventOwner(eventId);
    if (!ownerId) return { success: false, error: "Evento non trovato" };
    await resolveCalendarUser(targetUserId ?? ownerId, "VIEW_ONLY");

    const rinvii = await prisma.rinvio.findMany({
      where: { parentEventId: eventId },
      orderBy: { numero: "asc" },
    });

    // Ricostruzione promemoria “udienza” dai sottoeventi collegati.
    // (Non sono persistiti in una colonna dedicata sulla tabella rinvio.)
    const subEvents = await prisma.subEvent.findMany({
      where: { parentEventId: eventId, ruleId: RINVIO_RULE_ID },
      select: { title: true, kind: true, ruleParams: true },
    });

    const linkedEventsByRinvioId = new Map<string, LinkedEventSpec[]>();
    const isUdienzaByRinvioId = new Map<string, boolean>();
    for (const s of subEvents) {
      if (s.ruleParams) {
        let params: Record<string, unknown> | null = null;
        try {
          params = JSON.parse(s.ruleParams) as Record<string, unknown>;
        } catch {
          params = null;
        }
        if (params) {
          const rinvioId = params.rinvioId;
          const tipo = params.tipo;
          if (typeof rinvioId === "string" && tipo === "udienza") {
            isUdienzaByRinvioId.set(rinvioId, true);
          }
        }
      }
      if (s.kind !== "attivita") continue;
      if (!s.ruleParams) continue;
      let params: Record<string, unknown> | null = null;
      try {
        params = JSON.parse(s.ruleParams) as Record<string, unknown>;
      } catch {
        params = null;
      }
      if (!params || params.tipo !== "evento-collegato") continue;
      const rinvioId = params.rinvioId;
      if (typeof rinvioId !== "string") continue;
      const offsetDays = Number(params.offsetDays);
      if (!Number.isFinite(offsetDays)) continue;
      const spec: LinkedEventSpec = {
        title: s.title ?? "",
        offsetDays,
      };
      const cur = linkedEventsByRinvioId.get(rinvioId) ?? [];
      cur.push(spec);
      linkedEventsByRinvioId.set(rinvioId, cur);
    }

    const reminderOffsetsByRinvioId = new Map<string, number[]>();
    for (const s of subEvents) {
      if (s.kind !== "promemoria") continue;
      if (!s.ruleParams) continue;

      let params: Record<string, unknown> | null = null;
      try {
        params = JSON.parse(s.ruleParams) as Record<string, unknown>;
      } catch {
        params = null;
      }
      if (!params) continue;

      const rinvioId = params.rinvioId;
      const tipo = params.tipo;
      if (typeof rinvioId !== "string" || tipo !== "udienza") continue;

      const m = s.title?.match(/\((\d+)\s+gg prima\)/);
      if (!m) continue;
      const days = Number(m[1]);
      if (!Number.isFinite(days)) continue;

      const current = reminderOffsetsByRinvioId.get(rinvioId) ?? [];
      if (!current.includes(days)) current.push(days);
      reminderOffsetsByRinvioId.set(rinvioId, current);
    }

    // Ordina per stabilità UI.
    for (const [k, v] of reminderOffsetsByRinvioId) {
      reminderOffsetsByRinvioId.set(k, [...v].sort((a, b) => a - b));
    }

    return {
      success: true,
      data: rinvii.map((r) =>
        toRinvio(
          r,
          reminderOffsetsByRinvioId.get(r.id),
          linkedEventsByRinvioId.get(r.id),
          isUdienzaByRinvioId.get(r.id) ?? true,
        ),
      ),
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore caricamento rinvii",
    };
  }
}

export async function createRinvio(
  data: CreateRinvioInput,
  targetUserId?: string
): Promise<ActionResult<Rinvio>> {
  const parsed = createRinvioSchema.safeParse(data);
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => e.message).filter(Boolean).join(". ") || "Dati rinvio non validi";
    return { success: false, error: msg };
  }
  try {
    const ownerId = await getEventOwner(data.parentEventId);
    if (!ownerId) return { success: false, error: "Evento non trovato" };
    await resolveCalendarUser(targetUserId ?? ownerId, "FULL");

    const lastRinvio = await prisma.rinvio.findFirst({
      where: { parentEventId: data.parentEventId },
      orderBy: { numero: "desc" },
      select: { numero: true },
    });
    const nextNumero = (lastRinvio?.numero ?? 0) + 1;

    const rinvio = await prisma.rinvio.create({
      data: {
        parentEventId: data.parentEventId,
        numero: nextNumero,
        dataUdienza: data.dataUdienza,
        tipoUdienza: data.tipoUdienza,
        tipoUdienzaCustom: data.tipoUdienzaCustom ?? null,
        note: data.note ?? null,
        adempimenti: JSON.stringify(data.adempimenti),
      },
    });

    await generateSubEventsForRinvio(
      data.parentEventId,
      rinvio.id,
      {
        dataUdienza: data.dataUdienza,
        tipoUdienza: data.tipoUdienza,
        tipoUdienzaCustom: data.tipoUdienzaCustom,
      },
      data.adempimenti,
      data.eventoCode,
      data.reminderOffsets ?? null,
      data.linkedEvents ?? null,
      data.isUdienza ?? true,
    );

    return { success: true, data: toRinvio(rinvio) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore creazione rinvio",
    };
  }
}

export async function updateRinvio(
  id: string,
  data: UpdateRinvioInput,
  targetUserId?: string
): Promise<ActionResult<Rinvio>> {
  const parsed = updateRinvioSchema.safeParse(data);
  if (!parsed.success) {
    const msg = parsed.error.errors.map((e) => e.message).filter(Boolean).join(". ") || "Dati aggiornamento rinvio non validi";
    return { success: false, error: msg };
  }
  try {
    const existing = await prisma.rinvio.findUnique({
      where: { id },
      include: { parentEvent: { select: { userId: true } } },
    });
    if (!existing) {
      return { success: false, error: "Rinvio non trovato" };
    }
    await resolveCalendarUser(targetUserId ?? existing.parentEvent.userId, "FULL");

    const rinvio = await prisma.rinvio.update({
      where: { id },
      data: {
        ...(data.dataUdienza != null && { dataUdienza: data.dataUdienza }),
        ...(data.tipoUdienza != null && { tipoUdienza: data.tipoUdienza }),
        ...(data.tipoUdienzaCustom !== undefined && {
          tipoUdienzaCustom: data.tipoUdienzaCustom ?? null,
        }),
        ...(data.note !== undefined && { note: data.note ?? null }),
        ...(data.adempimenti != null && {
          adempimenti: JSON.stringify(data.adempimenti),
        }),
      },
    });

    const needsRegeneration =
      data.adempimenti != null ||
      data.dataUdienza != null ||
      data.isUdienza !== undefined ||
      data.tipoUdienza != null ||
      data.tipoUdienzaCustom !== undefined ||
      data.reminderOffsets !== undefined ||
      data.linkedEvents !== undefined;

    if (needsRegeneration) {
      await deleteSubEventsForRinvio(existing.parentEventId, id);
      await generateSubEventsForRinvio(
        existing.parentEventId,
        id,
        {
          dataUdienza: rinvio.dataUdienza,
          tipoUdienza: rinvio.tipoUdienza,
          tipoUdienzaCustom: rinvio.tipoUdienzaCustom,
        },
        parseAdempimenti(rinvio.adempimenti),
        undefined,
        data.reminderOffsets ?? null,
        data.linkedEvents ?? null,
        data.isUdienza ?? true,
      );
    }

    return { success: true, data: toRinvio(rinvio) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore aggiornamento rinvio",
    };
  }
}

export async function deleteRinvio(
  id: string,
  targetUserId?: string
): Promise<ActionResult<void>> {
  try {
    const existing = await prisma.rinvio.findUnique({
      where: { id },
      select: { parentEventId: true, parentEvent: { select: { userId: true } } },
    });
    if (!existing) {
      return { success: false, error: "Rinvio non trovato" };
    }
    await resolveCalendarUser(targetUserId ?? existing.parentEvent.userId, "FULL");

    await deleteSubEventsForRinvio(existing.parentEventId, id);
    await prisma.rinvio.delete({ where: { id } });
    return { success: true, data: undefined };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore eliminazione rinvio",
    };
  }
}
