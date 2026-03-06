import { prisma } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/db/user";

export type RequiredPermission = "VIEW_ONLY" | "FULL";

export interface CalendarAccessResult {
  allowed: boolean;
  isOwner: boolean;
}

/**
 * Verifies whether the current user can access another user's calendar
 * with the given permission level. Owner always has full access.
 * For shared calendars, FULL permission grants any operation,
 * VIEW_ONLY only grants read access.
 */
export async function assertCalendarAccess(
  eventOwnerUserId: string,
  requiredPermission: RequiredPermission
): Promise<CalendarAccessResult> {
  const currentUser = await getOrCreateDbUser();

  if (currentUser.id === eventOwnerUserId) {
    return { allowed: true, isOwner: true };
  }

  const share = await prisma.calendarShare.findUnique({
    where: {
      ownerId_sharedWithId: {
        ownerId: eventOwnerUserId,
        sharedWithId: currentUser.id,
      },
    },
    select: { permission: true },
  });

  if (!share) {
    return { allowed: false, isOwner: false };
  }

  if (share.permission === "FULL") {
    return { allowed: true, isOwner: false };
  }

  if (share.permission === "VIEW_ONLY" && requiredPermission === "VIEW_ONLY") {
    return { allowed: true, isOwner: false };
  }

  return { allowed: false, isOwner: false };
}

/**
 * Resolves the effective userId for server actions that support
 * operating on behalf of another user via calendar sharing.
 * Returns the resolved userId and whether the current user is the owner.
 */
export async function resolveCalendarUser(
  targetUserId?: string,
  requiredPermission: RequiredPermission = "VIEW_ONLY"
): Promise<{ userId: string; isOwner: boolean }> {
  const currentUser = await getOrCreateDbUser();

  if (!targetUserId || targetUserId === currentUser.id) {
    return { userId: currentUser.id, isOwner: true };
  }

  const access = await assertCalendarAccess(targetUserId, requiredPermission);
  if (!access.allowed) {
    throw new Error("Accesso non autorizzato al calendario");
  }

  return { userId: targetUserId, isOwner: false };
}
