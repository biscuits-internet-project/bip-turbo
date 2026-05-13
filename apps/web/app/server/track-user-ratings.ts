import type { PublicContext } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export interface TrackUserRatingsResponse {
  userRatings: Record<string, number | null>;
}

/**
 * Fetches the current user's ratings for a batch of tracks. Returns an empty
 * `userRatings` map for unauthenticated visitors (track ratings are
 * user-scoped — there is no public aggregate to surface here, unlike shows).
 * Shared by the `/api/tracks/user-ratings` action and any loader that wants
 * to seed React Query's cache so PerformanceTable / setlist gap-chart views
 * render personal ratings on first paint.
 */
export async function computeTrackUserRatings(
  context: Pick<PublicContext, "currentUser">,
  trackIds: string[],
): Promise<TrackUserRatingsResponse> {
  const response: TrackUserRatingsResponse = { userRatings: {} };

  if (trackIds.length === 0 || !context.currentUser) return response;

  try {
    const user = await services.users.findByEmail(context.currentUser.email);
    if (!user) return response;

    const ratings = await services.ratings.findManyByUserIdAndRateableIds(user.id, trackIds, "Track");
    for (const rating of ratings) {
      response.userRatings[rating.rateableId] = rating.value;
    }
  } catch (error) {
    logger.error("Error computing track user ratings", { error, trackIds: trackIds.length });
    throw error;
  }

  return response;
}
