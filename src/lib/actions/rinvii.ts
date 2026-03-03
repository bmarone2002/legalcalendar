"use server";

import { prisma } from "../db";
import { getSettings } from "../settings";
import { adjustToNextBusinessDay, applyDeadlineTime } from "@/lib/date-utils";
import { addDays } from "date-fns";
import type { Rinvio, Adempimento, CreateRinvioInput, UpdateRinvioInput, TipoUdienza } from "@/types/rinvio";
import { TIPO_UDIENZA_LABELS, DEFAULT_GIORNI_ALERT_UDIENZA } from "@/types/rinvio";
import type { ActionResult } from "./events";

const RINVIO_RULE_ID = "rinvio-udienza";

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
}): Rinvio {
  return {
    id: r.id,
    parentEventId: r.parentEventId,
    numero: r.numero,
    dataUdienza: r.dataUdienza,
    tipoUdienza: r.tipoUdienza,
    tipoUdienzaCustom: r.tipoUdienzaCustom,
    note: r.note,
    adempimenti: parseAdempimenti(r.adempimenti),
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

interface RinvioUdienzaInfo {
  dataUdienza: Date;
  tipoUdienza: string;
  tipoUdienzaCustom?: string | null;
}

async function generateSubEventsForRinvio(
  parentEventId: string,
  rinvioId: string,
  udienzaInfo: RinvioUdienzaInfo,
  adempimenti: Adempimento[]
): Promise<void> {
  const settings = await getSettings();
  const udienzaLabel = resolveUdienzaLabel(
    udienzaInfo.tipoUdienza,
    udienzaInfo.tipoUdienzaCustom
  );

  const udienzaDueAt = applyDeadlineTime(udienzaInfo.dataUdienza, settings);

  await prisma.subEvent.create({
    data: {
      parentEventId,
      title: `Udienza: ${udienzaLabel}`,
      kind: "termine",
      dueAt: udienzaDueAt,
      status: "pending",
      priority: 2,
      ruleId: RINVIO_RULE_ID,
      ruleParams: JSON.stringify({ rinvioId, tipo: "udienza" }),
      explanation: `Udienza di ${udienzaLabel.toLowerCase()} da rinvio`,
      createdBy: "automatico",
      locked: false,
    },
  });

  // Promemoria N giorni prima dell'udienza
  const alertDays = DEFAULT_GIORNI_ALERT_UDIENZA;
  const alertRaw = addDays(udienzaInfo.dataUdienza, -alertDays);
  const alertAdjusted = adjustToNextBusinessDay(alertRaw, settings);
  const alertDueAt = applyDeadlineTime(alertAdjusted, settings);

  await prisma.subEvent.create({
    data: {
      parentEventId,
      title: `Udienza: ${udienzaLabel} – Promemoria (${alertDays} gg prima)`,
      kind: "promemoria",
      dueAt: alertDueAt,
      status: "pending",
      priority: 0,
      ruleId: RINVIO_RULE_ID,
      ruleParams: JSON.stringify({ rinvioId, tipo: "udienza" }),
      explanation: `Promemoria ${alertDays} giorni prima dell'udienza`,
      createdBy: "automatico",
      locked: false,
    },
  });

  // SubEvents per ogni adempimento
  for (const a of adempimenti) {
    if (!a.scadenza || !a.titolo) continue;

    const rawDate = new Date(a.scadenza + "T12:00:00");
    if (isNaN(rawDate.getTime())) continue;

    const adjusted = adjustToNextBusinessDay(rawDate, settings);
    const dueAt = applyDeadlineTime(adjusted, settings);

    await prisma.subEvent.create({
      data: {
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
      },
    });

    if (a.giorniAlert > 0) {
      const adempAlertRaw = addDays(rawDate, -a.giorniAlert);
      const adempAlertAdjusted = adjustToNextBusinessDay(adempAlertRaw, settings);
      const adempAlertDueAt = applyDeadlineTime(adempAlertAdjusted, settings);

      await prisma.subEvent.create({
        data: {
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
        },
      });
    }
  }
}

async function deleteSubEventsForRinvio(rinvioId: string): Promise<void> {
  const allSubs = await prisma.subEvent.findMany({
    where: { ruleId: RINVIO_RULE_ID },
    select: { id: true, ruleParams: true },
  });

  const toDelete = allSubs.filter((s) => {
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

export async function getRinviiByEventId(
  eventId: string
): Promise<ActionResult<Rinvio[]>> {
  try {
    const rinvii = await prisma.rinvio.findMany({
      where: { parentEventId: eventId },
      orderBy: { numero: "asc" },
    });
    return { success: true, data: rinvii.map(toRinvio) };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore caricamento rinvii",
    };
  }
}

export async function createRinvio(
  data: CreateRinvioInput
): Promise<ActionResult<Rinvio>> {
  try {
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
      data.adempimenti
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
  data: UpdateRinvioInput
): Promise<ActionResult<Rinvio>> {
  try {
    const existing = await prisma.rinvio.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Rinvio non trovato" };
    }

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
      data.tipoUdienza != null ||
      data.tipoUdienzaCustom !== undefined;

    if (needsRegeneration) {
      await deleteSubEventsForRinvio(id);
      await generateSubEventsForRinvio(
        existing.parentEventId,
        id,
        {
          dataUdienza: rinvio.dataUdienza,
          tipoUdienza: rinvio.tipoUdienza,
          tipoUdienzaCustom: rinvio.tipoUdienzaCustom,
        },
        parseAdempimenti(rinvio.adempimenti)
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
  id: string
): Promise<ActionResult<void>> {
  try {
    await deleteSubEventsForRinvio(id);
    await prisma.rinvio.delete({ where: { id } });
    return { success: true, data: undefined };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore eliminazione rinvio",
    };
  }
}
