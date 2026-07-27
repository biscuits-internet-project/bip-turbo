import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { matchesTriState, type TriState } from "~/lib/tri-state-filter";

/**
 * Tri-state flags for the media toggles that ride on a show's denormalized
 * counts (showPhotosCount / showYoutubesCount).
 *
 * - "positive" → keep only shows WITH the media
 * - "negative" → keep only shows WITHOUT the media
 * - "empty" / undefined → no filter
 */
export type MediaCountFilterFlags = {
  photos?: TriState;
  youtube?: TriState;
};

/**
 * Tri-state flags for the external-source filters that are NOT queryable in
 * Prisma (nugs/archive/relisten live in Redis catalogs). The photo/youtube
 * counterpart lives on the denormalized show counts.
 */
export type ExternalSourceFilterFlags = {
  nugs?: TriState;
  archive?: TriState;
  relisten?: TriState;
};

/**
 * Whether one show's media counts satisfy the active flags. Takes bare counts
 * rather than a row so the year page (setlists) and the shows stats table
 * (flat stat rows) decide "has photos" the same way.
 */
export function matchesMediaCounts(flags: MediaCountFilterFlags, photosCount: number, youtubeCount: number): boolean {
  return matchesTriState(flags.photos, photosCount > 0) && matchesTriState(flags.youtube, youtubeCount > 0);
}

/**
 * Whether one show's resolved external sources satisfy the active flags. Owns
 * what "has nugs / archive / relisten" means, so no caller re-derives it.
 */
export function matchesExternalSources(
  flags: ExternalSourceFilterFlags,
  sources: ShowExternalSources | undefined,
): boolean {
  return (
    matchesTriState(flags.nugs, Boolean(sources?.nugsUrls?.length)) &&
    matchesTriState(flags.archive, Boolean(sources?.archiveUrl)) &&
    matchesTriState(flags.relisten, Boolean(sources?.relistenUrl))
  );
}
