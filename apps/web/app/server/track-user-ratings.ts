import type { PublicContext } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";
import { resolveViewerRatingMode } from "~/server/viewer-rating";

/** Plain vs Calibrated Track Rating side by side, for the author compare/debug overlay. */
export interface TrackRatingComparison {
  plain: number;
  calibrated: number;
  count: number;
  delta: number;
}

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
  /**
   * The Calibrated Track Rating + contributing count per track, populated only when
   * the viewer opted into calibrated track ratings; absent means the plain community
   * average is shown. The count is post-fluffer-exclusion.
   */
  calibratedRatings: Record<string, { rating: number; count: number }>;
  /**
   * Plain vs calibrated comparison per track, populated only for the author compare
   * overlay (compare flag + pref); absent means no overlay.
   */
  comparisons: Record<string, TrackRatingComparison>;
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
  const response: TrackUserRatingsResponse = {
    userRatings: {},
    averageRatings: {},
    calibratedRatings: {},
    comparisons: {},
  };

  if (trackIds.length === 0) return response;

  try {
    response.averageRatings = await services.ratings.getAveragesForRateables(trackIds, "Track");

    const { user, flags, trackMode } = await resolveViewerRatingMode(context);
    const compareOn = flags.compareVisible && user?.trackRatingComparisonDebug === true;

    if (trackMode === "calibrated" || compareOn) {
      response.calibratedRatings = await services.raterWeights.getCalibratedForTracks(trackIds);
    }
    if (compareOn) {
      for (const [trackId, calibrated] of Object.entries(response.calibratedRatings)) {
        const plain = response.averageRatings[trackId]?.average;
        if (plain == null) continue;
        response.comparisons[trackId] = {
          plain,
          calibrated: calibrated.rating,
          count: calibrated.count,
          delta: calibrated.rating - plain,
        };
      }
      // The compare overlay shows plain vs calibrated; the viewer isn't opted into the
      // calibrated headline unless their own mode says so, so don't leak it as the display.
      if (trackMode !== "calibrated") response.calibratedRatings = {};
    }

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
