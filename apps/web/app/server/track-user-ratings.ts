import type { PublicContext } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";

export interface TrackUserRatingsResponse {
  /** The current user's own rating per track (absent when unrated/unauthenticated). */
  userRatings: Record<string, number | null>;
  /**
   * The deduped community average + count per track, read live from the
   * denormalized columns. Public, so it's populated for anonymous visitors too.
   * Lives here rather than in the structural setlist cache so a rating write
   * never staleness-busts the (long-lived) setlist blob.
   */
  averageRatings: Record<string, { average: number; count: number }>;
}

/**
 * Fetches the live per-track rating data a setlist/performance view needs that
 * doesn't belong in the structural cache: the public community average+count
 * (everyone, every request) and the current user's own rating (authenticated
 * only). Shared by the `/api/tracks/user-ratings` action and any loader that
 * wants to seed React Query's cache so PerformanceTable / setlist gap-chart
 * views render ratings on first paint.
 */
export async function computeTrackUserRatings(
  context: Pick<PublicContext, "currentUser">,
  trackIds: string[],
): Promise<TrackUserRatingsResponse> {
  const response: TrackUserRatingsResponse = { userRatings: {}, averageRatings: {} };

  if (trackIds.length === 0) return response;

  try {
    response.averageRatings = await services.ratings.getAveragesForRateables(trackIds, "Track");

    if (!context.currentUser) return response;

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
