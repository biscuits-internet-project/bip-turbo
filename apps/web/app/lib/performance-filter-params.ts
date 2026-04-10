import type { PerformanceFilterOptions } from "@bip/core/page-composers/song-page-composer";
import { CacheKeys } from "@bip/domain/cache-keys";
import type { PublicContext } from "~/lib/base-loaders";
import { SONG_FILTERS } from "~/lib/song-filters";
import { services } from "~/server/services";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const VALID_FILTER_KEYS = new Set([
  "encore",
  "setOpener",
  "setCloser",
  "segueIn",
  "segueOut",
  "standalone",
  "inverted",
  "dyslexic",
  "allTimer",
]);

/**
 * Resolve the "attended" param to a user ID. Supports both:
 * - attended=attended (uses logged-in user)
 * - attended=<username> (looks up by username)
 */
export async function resolveAttendedUserId(
  attendedParam: string | null,
  context: PublicContext,
): Promise<string | undefined> {
  if (!attendedParam) return undefined;

  if (attendedParam === "attended" && context.currentUser) {
    const localUser = await services.users.findByEmail(context.currentUser.email);
    return localUser?.id;
  }

  if (attendedParam !== "attended") {
    const localUser = await services.users.findByUsername(attendedParam);
    return localUser?.id;
  }

  return undefined;
}

/**
 * Parse URL search params into PerformanceFilterOptions.
 * Shared by /api/all-timers and /api/songs/performances.
 */
export async function parsePerformanceFilters(url: URL, context: PublicContext): Promise<PerformanceFilterOptions> {
  const year = url.searchParams.get("year");
  const era = url.searchParams.get("era");
  const coverParam = url.searchParams.get("cover");
  const authorParam = url.searchParams.get("author");
  const filtersParam = url.searchParams.get("filters");
  const attendedParam = url.searchParams.get("attended");
  const monthDayParam = url.searchParams.get("monthDay");

  const dateRangeKey = year || era;
  const dateRange = dateRangeKey && dateRangeKey in SONG_FILTERS ? SONG_FILTERS[dateRangeKey] : null;

  const filters: PerformanceFilterOptions = {};

  if (dateRange?.startDate) filters.startDate = dateRange.startDate;
  if (dateRange?.endDate) filters.endDate = dateRange.endDate;
  if (coverParam === "cover") filters.cover = true;
  else if (coverParam === "original") filters.cover = false;
  if (authorParam && UUID_REGEX.test(authorParam)) filters.authorId = authorParam;
  if (monthDayParam) filters.monthDay = monthDayParam;

  const attendedUserId = await resolveAttendedUserId(attendedParam, context);
  if (attendedUserId) filters.attendedUserId = attendedUserId;

  if (filtersParam) {
    for (const key of filtersParam.split(",")) {
      if (VALID_FILTER_KEYS.has(key)) {
        (filters as Record<string, boolean>)[key] = true;
      }
    }
  }

  return filters;
}

/**
 * Build a cache key from URL search params for filtered performance queries.
 */
export function buildFilteredCacheKey(url: URL, scope: string, attendedUserId?: string): string {
  const year = url.searchParams.get("year");
  const era = url.searchParams.get("era");
  const coverParam = url.searchParams.get("cover");
  const authorParam = url.searchParams.get("author");
  const filtersParam = url.searchParams.get("filters");

  const monthDay = url.searchParams.get("monthDay");
  return CacheKeys.songs.filtered({
    scope,
    year: year || null,
    era: era || null,
    cover: coverParam || null,
    author: authorParam || null,
    filters: filtersParam || null,
    attended: attendedUserId || null,
    monthDay: monthDay || null,
  });
}
