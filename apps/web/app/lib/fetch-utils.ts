import type { Attendance } from "@bip/domain";
import type { PublicContext } from "~/lib/base-loaders";
import { services } from "~/server/services";

type ContextUser = NonNullable<PublicContext["currentUser"]>;

/**
 * Helper function to get the internal user record from a Supabase user
 */
async function getInternalUser(currentUser: ContextUser) {
  const user = await services.users.findByEmail(currentUser.email);
  if (!user) {
    throw new Error("User not found in local database");
  }
  return user;
}

/**
 * Fetch user attendance data for multiple show IDs
 */
export async function fetchUserAttendances(currentUser: ContextUser | undefined, showIds: string[]): Promise<Attendance[]> {
  if (!currentUser || showIds.length === 0) {
    return [];
  }

  try {
    const user = await getInternalUser(currentUser);
    const userAttendances = await services.attendances.findManyByUserIdAndShowIds(user.id, showIds);
    console.log(`👤 Fetch ${userAttendances.length} user attendances from ${showIds.length} total shows`);
    return userAttendances;
  } catch (error) {
    console.warn('Failed to load user attendances:', error);
    return [];
  }
}

/**
 * Fetch user attendance data for a single show ID
 */
export async function fetchUserAttendance(currentUser: ContextUser | undefined, showId: string): Promise<Attendance | null> {
  const userAttendances = await fetchUserAttendances(currentUser, [showId]);
  return userAttendances.length > 0 ? userAttendances[0] : null;
}