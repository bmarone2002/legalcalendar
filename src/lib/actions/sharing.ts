"use server";

import { prisma } from "../db";
import { getOrCreateDbUser } from "@/lib/db/user";
import type { SharePermission } from "@/generated/prisma";
import type { ActionResult } from "./events";

export interface ShareInfo {
  id: string;
  permission: SharePermission;
  createdAt: Date;
  user: { id: string; email: string | null };
}

export interface SharedWithMeInfo {
  id: string;
  permission: SharePermission;
  createdAt: Date;
  owner: { id: string; email: string | null };
}

export async function searchUsers(
  query: string
): Promise<ActionResult<Array<{ id: string; email: string | null }>>> {
  try {
    if (!query || query.trim().length < 3) {
      return { success: true, data: [] };
    }

    const currentUser = await getOrCreateDbUser();

    const users = await prisma.user.findMany({
      where: {
        id: { not: currentUser.id },
        email: { contains: query.trim(), mode: "insensitive" },
      },
      select: { id: true, email: true },
      take: 10,
    });

    return { success: true, data: users };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore ricerca utenti",
    };
  }
}

export async function shareCalendar(
  email: string,
  permission: SharePermission
): Promise<ActionResult<ShareInfo>> {
  try {
    const currentUser = await getOrCreateDbUser();

    const targetUser = await prisma.user.findFirst({
      where: { email: { equals: email.trim(), mode: "insensitive" } },
      select: { id: true, email: true },
    });

    if (!targetUser) {
      return { success: false, error: "Utente non trovato con questa email" };
    }

    if (targetUser.id === currentUser.id) {
      return {
        success: false,
        error: "Non puoi condividere il calendario con te stesso",
      };
    }

    const existing = await prisma.calendarShare.findUnique({
      where: {
        ownerId_sharedWithId: {
          ownerId: currentUser.id,
          sharedWithId: targetUser.id,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Calendario già condiviso con questo utente",
      };
    }

    const share = await prisma.calendarShare.create({
      data: {
        ownerId: currentUser.id,
        sharedWithId: targetUser.id,
        permission,
      },
      include: {
        sharedWith: { select: { id: true, email: true } },
      },
    });

    return {
      success: true,
      data: {
        id: share.id,
        permission: share.permission,
        createdAt: share.createdAt,
        user: share.sharedWith,
      },
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Errore condivisione calendario",
    };
  }
}

export async function updateSharePermission(
  shareId: string,
  permission: SharePermission
): Promise<ActionResult<ShareInfo>> {
  try {
    const currentUser = await getOrCreateDbUser();

    const existing = await prisma.calendarShare.findUnique({
      where: { id: shareId },
      select: { ownerId: true },
    });

    if (!existing || existing.ownerId !== currentUser.id) {
      return { success: false, error: "Condivisione non trovata" };
    }

    const share = await prisma.calendarShare.update({
      where: { id: shareId },
      data: { permission },
      include: {
        sharedWith: { select: { id: true, email: true } },
      },
    });

    return {
      success: true,
      data: {
        id: share.id,
        permission: share.permission,
        createdAt: share.createdAt,
        user: share.sharedWith,
      },
    };
  } catch (e) {
    return {
      success: false,
      error:
        e instanceof Error
          ? e.message
          : "Errore aggiornamento permesso condivisione",
    };
  }
}

export async function revokeShare(
  shareId: string
): Promise<ActionResult<void>> {
  try {
    const currentUser = await getOrCreateDbUser();

    const existing = await prisma.calendarShare.findUnique({
      where: { id: shareId },
      select: { ownerId: true, sharedWithId: true },
    });

    if (!existing) {
      return { success: false, error: "Condivisione non trovata" };
    }

    if (
      existing.ownerId !== currentUser.id &&
      existing.sharedWithId !== currentUser.id
    ) {
      return { success: false, error: "Non autorizzato" };
    }

    await prisma.calendarShare.delete({ where: { id: shareId } });
    return { success: true, data: undefined };
  } catch (e) {
    return {
      success: false,
      error:
        e instanceof Error
          ? e.message
          : "Errore revoca condivisione",
    };
  }
}

export async function getMyShares(): Promise<ActionResult<ShareInfo[]>> {
  try {
    const currentUser = await getOrCreateDbUser();

    const shares = await prisma.calendarShare.findMany({
      where: { ownerId: currentUser.id },
      include: {
        sharedWith: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: shares.map((s) => ({
        id: s.id,
        permission: s.permission,
        createdAt: s.createdAt,
        user: s.sharedWith,
      })),
    };
  } catch (e) {
    return {
      success: false,
      error:
        e instanceof Error
          ? e.message
          : "Errore caricamento condivisioni",
    };
  }
}

export async function getSharedWithMe(): Promise<
  ActionResult<SharedWithMeInfo[]>
> {
  try {
    const currentUser = await getOrCreateDbUser();

    const shares = await prisma.calendarShare.findMany({
      where: { sharedWithId: currentUser.id },
      include: {
        owner: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: shares.map((s) => ({
        id: s.id,
        permission: s.permission,
        createdAt: s.createdAt,
        owner: s.owner,
      })),
    };
  } catch (e) {
    return {
      success: false,
      error:
        e instanceof Error
          ? e.message
          : "Errore caricamento calendari condivisi",
    };
  }
}

export async function getShareForOwner(
  ownerId: string
): Promise<ActionResult<{ permission: SharePermission; ownerEmail: string | null }>> {
  try {
    const currentUser = await getOrCreateDbUser();

    if (ownerId === currentUser.id) {
      return {
        success: true,
        data: { permission: "FULL", ownerEmail: currentUser.email },
      };
    }

    const share = await prisma.calendarShare.findUnique({
      where: {
        ownerId_sharedWithId: {
          ownerId,
          sharedWithId: currentUser.id,
        },
      },
      include: {
        owner: { select: { email: true } },
      },
    });

    if (!share) {
      return { success: false, error: "Accesso non autorizzato" };
    }

    return {
      success: true,
      data: {
        permission: share.permission,
        ownerEmail: share.owner.email,
      },
    };
  } catch (e) {
    return {
      success: false,
      error:
        e instanceof Error
          ? e.message
          : "Errore verifica accesso calendario",
    };
  }
}
