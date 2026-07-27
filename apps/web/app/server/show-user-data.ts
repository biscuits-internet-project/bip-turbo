import type { ShowRankComparison } from "@bip/core";
import type { Attendance } from "@bip/domain";
import type { PublicContext } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { services } from "~/server/services";
import { resolveViewerRatingMode } from "~/server/viewer-rating";

export interface ShowUserDataResponse {
  attendances: Record<string, Attendance>;
  userRatings: Record<string, number>;
  averageRatings: Record<string, { average: number; count: number }>;
  /**
   * The calibrated (shrunk) score + its contributing count per show, populated only
   * when the viewer's resolved mode is "calibrated"; absent means the headline falls
   * back to the canonical average + count. The count is post-exclusion (bombers
   * dropped), so it can be smaller than the canonical deduped count.
   */
  displayedRatings: Record<string, { rating: number; count: number }>;
  /**
   * Community vs calibrated score + rank summary per show, populated only when
   * the viewer has the author comparison overlay enabled; absent means no overlay.
   */
  rankComparisons: Record<string, ShowRankComparison>;
}

/**
 * Fetches per-show data for a batch of shows: average ratings (public), the
 * viewer's resolved calibrated score and/or comparison overlay, plus the current
 * user's attendance and ratings (when authenticated). Shared by the
 * `/api/shows/user-data` action and any loader that wants to seed React Query's
 * cache with server-side data so SetlistCards render on first paint. The display
 * mode (simple vs calibrated) and the comparison overlay are resolved server-side
 * from the viewer's prefs + the feature flags, so the heavy calibrated/rank queries
 * only run for viewers who actually see them.
 *
 * Every map holds ONLY the shows that have a value. A show absent from a map has
 * no attendance / no rating / no average — consumers read through `?? null`
 * rather than expecting a key per id. Writing an explicit null per show instead
 * would cost ~170KB of `"<uuid>":null` on a catalog-sized batch.
 */
export async function computeShowUserData(
  context: Pick<PublicContext, "currentUser">,
  showIds: string[],
): Promise<ShowUserDataResponse> {
  const response: ShowUserDataResponse = {
    attendances: {},
    userRatings: {},
    averageRatings: {},
    displayedRatings: {},
    rankComparisons: {},
  };

  if (showIds.length === 0) return response;

  try {
    const { user, flags, mode } = await resolveViewerRatingMode(context);
    const compareOn = flags.compareVisible && user?.showRatingComparisonDebug === true;

    const averages = await services.ratings.getAveragesForRateables(showIds, "Show");
    for (const [showId, data] of Object.entries(averages)) {
      response.averageRatings[showId] = data;
    }

    if (mode === "calibrated") {
      response.displayedRatings = await services.raterWeights.getDisplayedForShows(showIds);
    }
    if (compareOn) {
      response.rankComparisons = await services.raterWeights.getShowRankComparisons(showIds);
    }

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
  } catch (error) {
    logger.error("Error computing show user data", { error, showIds: showIds.length });
    throw error;
  }

  return response;
}
