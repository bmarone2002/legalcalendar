import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/db/user";
import { sendOneSignalNotification } from "@/lib/notifications/onesignal";

const sendSchema = z.object({
  eventId: z.string().min(1),
  url: z.string().url().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await getOrCreateDbUser();
    const payload = sendSchema.parse(await req.json());

    const event = await prisma.event.findFirst({
      where: { id: payload.eventId, userId: user.id },
      select: {
        id: true,
        title: true,
        type: true,
        macroArea: true,
      },
    });

    if (!event) {
      return NextResponse.json({ success: false, error: "Evento non trovato" }, { status: 404 });
    }

    const candidatePrefs = await prisma.eventNotificationPreference.findMany({
      where: {
        userId: user.id,
        enabled: true,
        OR: [
          { eventType: null },
          { eventType: event.type },
        ],
      },
      select: { userId: true, macroArea: true },
    });

    const targetUserIds = new Set<string>();
    for (const pref of candidatePrefs) {
      if (!pref.macroArea || pref.macroArea === event.macroArea) {
        targetUserIds.add(pref.userId);
      }
    }

    if (targetUserIds.size === 0) {
      return NextResponse.json({ success: true, skipped: true, reason: "Nessuna preferenza matching" });
    }

    const users = await prisma.user.findMany({
      where: { id: { in: Array.from(targetUserIds) } },
      select: { clerkUserId: true },
    });
    const externalUserIds = users.map((u) => u.clerkUserId).filter(Boolean);

    const launchUrl =
      payload.url ??
      `${process.env.NEXT_PUBLIC_APP_URL ?? "https://legalcalendar-production.up.railway.app"}/?eventId=${encodeURIComponent(event.id)}`;

    const oneSignalResult = await sendOneSignalNotification({
      externalUserIds,
      title: "Nuovo evento in agenda",
      message: event.title,
      data: {
        type: "event",
        eventId: event.id,
        url: launchUrl,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        eventId: event.id,
        matchedUsers: externalUserIds.length,
        oneSignal: oneSignalResult,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Errore invio notifica";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
