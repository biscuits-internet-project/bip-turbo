import type { Attendance } from "@bip/domain";
import type { PublicContext } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export interface ShowUserDataResponse {
  attendances: Record<string, Attendance | null>;
  userRatings: Record<string, number | null>;
  averageRatings: Record<string, { average: number; count: number } | null>;
}

/**
 * Fetches per-show data for a batch of shows: average ratings (public), plus
 * the current user's attendance and ratings (when authenticated). Shared by
 * the `/api/shows/user-data` action and any loader that wants to seed React
 * Query's cache with server-side data so SetlistCards render attendance /
 * rating badges on first paint (no hydration flicker).
 */
export async function computeShowUserData(
  context: Pick<PublicContext, "currentUser">,
  showIds: string[],
): Promise<ShowUserDataResponse> {
  const response: ShowUserDataResponse = {
    attendances: {},
    userRatings: {},
    averageRatings: {},
  };

  for (const showId of showIds) {
    response.attendances[showId] = null;
    response.userRatings[showId] = null;
    response.averageRatings[showId] = null;
  }

  if (showIds.length === 0) return response;

  try {
    const averages = await services.ratings.getAveragesForRateables(showIds, "Show");
    for (const [showId, data] of Object.entries(averages)) {
      response.averageRatings[showId] = data;
    }

    if (context.currentUser) {
      const user = await services.users.findByEmail(context.currentUser.email);
      if (user) {
        const attendances = await services.attendances.findManyByUserIdAndShowIds(user.id, showIds);
        for (const attendance of attendances) {
          response.attendances[attendance.showId] = attendance;
        }

        const ratings = await services.ratings.findManyByUserIdAndRateableIds(user.id, showIds, "Show");
        for (const rating of ratings) {
          response.userRatings[rating.rateableId] = rating.value;
        }
      }
    }
  } catch (error) {
    logger.error("Error computing show user data", { error, showIds: showIds.length });
    throw error;
  }

  return response;
}
