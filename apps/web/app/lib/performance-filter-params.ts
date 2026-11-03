import type { PerformanceFilterOptions } from "@bip/core/page-composers/song-page-composer";
import { CacheKeys } from "@bip/domain/cache-keys";
import type { PublicContext } from "~/lib/base-loaders";
import { getTimeRangeParam, SONG_FILTERS, STANDALONE_TOGGLE_KEY, TOGGLE_FILTER_DEFINITIONS } from "~/lib/song-filters";
import { services } from "~/server/services";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The toggle keys the `filters` CSV param may carry — the chip vocabulary
 * itself, so a chip can never render without a matching server-side filter.
 * `attended` is excluded: it rides its own `attended` param (it needs a user,
 * not a boolean).
 */
const VALID_FILTER_KEYS = new Set<string>(
  TOGGLE_FILTER_DEFINITIONS.map((filter) => filter.key).filter((key) => key !== STANDALONE_TOGGLE_KEY),
);

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
 * Shared by the filtered-performance endpoints (/api/songs/performances, /api/songs).
 */
/**
 * Resolve "last10shows" to a date range by querying the 10th most recent show date.
 */
export async function resolveLast10ShowsDateRange(): Promise<{ startDate: Date } | null> {
  const recentShows = await services.shows.findMany({
    sort: [{ field: "date" as keyof import("@bip/domain").Show, direction: "desc" }],
    pagination: { page: 1, limit: 10 },
  });
  if (recentShows.length === 0) return null;
  const earliestDate = recentShows[recentShows.length - 1].date;
  return { startDate: new Date(earliestDate) };
}

export async function parsePerformanceFilters(url: URL, context: PublicContext): Promise<PerformanceFilterOptions> {
  // Every filter value comes from the same normalizer the cache key uses. A value that
  // filters the query but is dropped from the key would cache a filtered result under the
  // unfiltered one, so the two must not each carry their own copy of the validation.
  // `new Date("2005")` parses, so an unvalidated exclude date here really did filter.
  const keyParts = normalizeFilterKeyParts(url.searchParams);
  const attendedParam = url.searchParams.get("attended");

  const filters: PerformanceFilterOptions = {};

  // A `slug` scopes the list to one song (the song-detail performances tab).
  if (keyParts.slug) filters.songSlug = keyParts.slug;

  // An exclude window (the drummer profile's era) keeps only out-of-window performances.
  if (keyParts.excludeStart) filters.excludeRangeStart = new Date(keyParts.excludeStart);
  if (keyParts.excludeEnd) filters.excludeRangeEnd = new Date(keyParts.excludeEnd);

  if (keyParts.timeRange === "last10shows") {
    const dateRange = await resolveLast10ShowsDateRange();
    if (dateRange) filters.startDate = dateRange.startDate;
  } else if (keyParts.timeRange) {
    const dateRange = SONG_FILTERS[keyParts.timeRange];
    if (dateRange.startDate) filters.startDate = dateRange.startDate;
    if (dateRange.endDate) filters.endDate = dateRange.endDate;
  }
  if (keyParts.kind) filters.kind = keyParts.kind;
  if (keyParts.author) filters.authorId = keyParts.author;
  if (keyParts.monthDay) filters.monthDay = keyParts.monthDay;

  // The musician filter carries a readable slug (e.g. ?musician=sam-altman)
  // for shareable URLs; resolve it to the id the composer filters on. An
  // unknown slug resolves to nothing and the filter is simply inactive.
  if (keyParts.musician) {
    const musician = await services.musicians.findBySlug(keyParts.musician);
    if (musician) filters.playedByMusicianId = musician.id;
  }

  const attendedUserId = await resolveAttendedUserId(attendedParam, context);
  if (attendedUserId) filters.attendedUserId = attendedUserId;

  for (const key of keyParts.filters?.split(",") ?? []) {
    (filters as Record<string, boolean>)[key] = true;
  }

  return filters;
}

/**
 * Build a cache key from URL search params for filtered performance queries.
 */
export function buildFilteredCacheKey(url: URL, scope: string, attendedUserId?: string): string {
  const normalized = normalizeFilterKeyParts(url.searchParams);

  return CacheKeys.songs.filtered({
    scope,
    timeRange: normalized.timeRange,
    kind: normalized.kind,
    author: normalized.author,
    musician: normalized.musician,
    filters: normalized.filters,
    attended: attendedUserId || null,
    monthDay: normalized.monthDay,
    excludeStart: normalized.excludeStart,
    excludeEnd: normalized.excludeEnd,
  });
}
/**
 * Canonicalize the free-form filter params before they become cache-key material.
 *
 * Several of these are read straight off the query string and are ignored downstream when
 * they don't parse — but they were still varying the cache key, so any junk value was a
 * guaranteed cache miss that ran the uncapped song aggregate and then wrote its result to
 * Redis for 24h. Walking `?filters=x1`, `x2`, ... both burned the DB and filled the cache.
 *
 * Normalizing here means a value that changes nothing about the query also changes nothing
 * about the key: unrecognized input collapses to null and shares the unfiltered entry.
 * Valid input is canonicalized (filters sorted) so toggle order can't fork one filter set
 * across several keys.
 */
export function normalizeFilterKeyParts(params: URLSearchParams): {
  timeRange: string | null;
  kind: SongKind | null;
  author: string | null;
  musician: string | null;
  filters: string | null;
  monthDay: string | null;
  excludeStart: string | null;
  excludeEnd: string | null;
  played: string | null;
  slug: string | null;
} {
  const timeRangeRaw = getTimeRangeParam(params);
  const timeRange =
    timeRangeRaw === "last10shows" || (timeRangeRaw !== null && timeRangeRaw in SONG_FILTERS) ? timeRangeRaw : null;

  const kindRaw = params.get("kind");
  const kind = kindRaw && isSongKind(kindRaw) ? kindRaw : null;

  const authorRaw = params.get("author");
  const author = authorRaw && UUID_REGEX.test(authorRaw) ? authorRaw : null;

  const musicianRaw = params.get("musician");
  const musician = musicianRaw && SLUG_REGEX.test(musicianRaw) ? musicianRaw : null;

  const slugRaw = params.get("slug");
  const slug = slugRaw && SLUG_REGEX.test(slugRaw) ? slugRaw : null;

  const filtersRaw = params.get("filters");
  const filterKeys = filtersRaw
    ? [...new Set(filtersRaw.split(",").filter((key) => VALID_FILTER_KEYS.has(key)))].sort()
    : [];
  const filters = filterKeys.length > 0 ? filterKeys.join(",") : null;

  const monthDayRaw = params.get("monthDay");
  const monthDay = monthDayRaw && MONTH_DAY_REGEX.test(monthDayRaw) ? monthDayRaw : null;

  const playedRaw = params.get("played");
  const played = playedRaw && VALID_PLAYED_VALUES.has(playedRaw) ? playedRaw : null;

  return {
    timeRange,
    kind,
    author,
    musician,
    filters,
    monthDay,
    excludeStart: normalizeIsoDate(params.get("excludeStart")),
    excludeEnd: normalizeIsoDate(params.get("excludeEnd")),
    played,
    slug,
  };
}

/** Accept only YYYY-MM-DD that is also a real calendar date. */
function normalizeIsoDate(value: string | null): string | null {
  if (!value || !ISO_DATE_REGEX.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : value;
}

const SONG_KINDS = ["original", "cover", "mashup", "improvisation"] as const;
type SongKind = (typeof SONG_KINDS)[number];
function isSongKind(value: string): value is SongKind {
  return (SONG_KINDS as readonly string[]).includes(value);
}
// The only values the UI emits (performance-filter-controls.tsx) and the only one any
// consumer tests for (played-filter.ts checks `=== "notPlayed"`). Getting this set wrong
// is not cosmetic: a value that is dropped from the key but still drives
// `shouldShowNotPlayed` makes two different result sets share one cache entry.
const VALID_PLAYED_VALUES = new Set(["all", "notPlayed"]);
// Must accept everything `slugify` can emit, not an idealized slug shape: it strips
// `[^\w-]`, so digits, underscores and hyphens all survive into stored slugs. A stricter
// pattern here would silently drop a real musician's filter — the value would be nulled
// for the cache key while still resolving in the database.
export const SLUG_REGEX = /^[\w-]+$/;
const MONTH_DAY_REGEX = /^\d{2}-\d{2}$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
