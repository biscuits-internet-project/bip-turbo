import { CacheKeys, type Logger } from "@bip/domain";
import type { CacheService } from "./cache-service";
import type { CloudflareCacheService } from "./cloudflare-cache-service";

/**
 * Extract the year from a show slug. Show slugs start with `YYYY-MM-DD-`.
 * Returns null when the leading four characters don't parse as a year.
 */
export function yearFromShowSlug(slug: string): number | null {
  const year = Number.parseInt(slug.slice(0, 4), 10);
  return Number.isFinite(year) ? year : null;
}

/**
 * Extract the year from a Show.date. The Prisma column is `String` in the
 * `YYYY-MM-DD` format, but accept Date for callers that hold one in memory.
 */
export function yearFromShowDate(date: string | Date): number {
  if (typeof date === "string") return Number.parseInt(date.slice(0, 4), 10);
  return date.getUTCFullYear();
}

export class CacheInvalidationService {
  constructor(
    private readonly cache: CacheService,
    private readonly logger: Logger,
    private readonly cloudflareCache?: CloudflareCacheService,
  ) {}

  /**
   * Invalidate all cache entries for a specific show by slug
   */
  async invalidateShow(slug: string): Promise<void> {
    this.logger.info(`Invalidating show cache for slug: ${slug}`);

    await Promise.all([this.cache.del(CacheKeys.show.data(slug)), this.cache.del(CacheKeys.setlist.data(slug))]);
  }

  /**
   * Invalidate show cache by show ID (requires looking up the slug first)
   */
  async invalidateShowByShowId(showId: string, slug?: string): Promise<void> {
    if (!slug) {
      // If slug not provided, we'll need to get it from the show record
      // For now, log a warning - we'll enhance this when we add repository dependencies
      this.logger.warn(`Cannot invalidate show cache by ID without slug: ${showId}`);
      return;
    }

    this.logger.info(`Invalidating show cache for ID: ${showId}, slug: ${slug}`);

    await Promise.all([this.cache.del(CacheKeys.show.data(slug)), this.cache.del(CacheKeys.setlist.data(slug))]);
  }

  /**
   * Invalidate review cache for a specific show (reviews are now loaded fresh)
   */
  async invalidateShowReviews(showId: string): Promise<void> {
    this.logger.info(`Reviews are loaded fresh, no cache invalidation needed for show: ${showId}`);
    // No-op since reviews are not cached
  }

  /**
   * Invalidate all show listing caches (for when show metadata changes).
   *
   * `years` lists the calendar years whose `/shows/year/:year` Cloudflare
   * edge entries need purging — typically the year(s) of the mutated show.
   * Pass an empty array when no year tag is affected; the Redis layer is
   * purged unconditionally.
   */
  async invalidateShowListings(years: number[]): Promise<void> {
    this.logger.info("Invalidating all show listing caches and home page", { years });
    const dedupedYears = Array.from(new Set(years.filter(Number.isFinite)));
    await Promise.all([
      this.cache.delPattern(CacheKeys.shows.allLists()),
      this.cache.delPattern("home:*"), // Invalidate all home page caches
      this.cache.del(CacheKeys.stats.showsByYear()), // shows-per-year aggregate is tied to the show catalog
      this.cache.del(CacheKeys.stats.showDates()), // sorted stats-show-dates array backs Gap to Now on /songs
      this.cache.del(CacheKeys.stats.songPlayDates()), // catalog play-history blob backs gap-chart Played Before column
      // Per-user attended-setlists caches include each show's setlist + venue;
      // wipe them all when any show metadata moves.
      this.cache.delPattern(CacheKeys.users.allAttendedSetlists()),
      // Per-user song-history embeds the catalog of tracks at each attended
      // show; a show metadata or tracks change can shift values.
      this.cache.delPattern(CacheKeys.users.allSongHistory()),
      // Rock opera resource pages embed full Setlists (with tracks,
      // annotations, ratings, notes, date) for every tagged show. Any
      // show-affecting mutation can stale them.
      this.cache.delPattern(CacheKeys.rockOperas.allPerformances()),
      // show.data caches per-slug Setlists with rockOperaPerformances
      // baked in (SetlistService overlays them in findByShowSlug etc.).
      // When a tagged show's date moves or any rock opera assignment
      // changes, neighbors' annotations (rank/prev/next) shift — wipe
      // every show.data so the next request rebuilds with fresh data.
      this.cache.delPattern(CacheKeys.show.allData()),
      dedupedYears.length > 0 ? this.cloudflareCache?.purgeYearListings(dedupedYears) : Promise.resolve(),
    ]);
  }

  /**
   * Invalidate the cross-domain shows-by-year aggregate. Standalone hook
   * for callers that mutate shows without going through the listing flow.
   */
  async invalidateStatsShowsByYear(): Promise<void> {
    this.logger.info("Invalidating stats:shows-by-year + stats:show-dates + stats:song-play-dates");
    await Promise.all([
      this.cache.del(CacheKeys.stats.showsByYear()),
      this.cache.del(CacheKeys.stats.showDates()),
      this.cache.del(CacheKeys.stats.songPlayDates()),
    ]);
  }

  /**
   * Invalidate all song-related caches (index page and filtered results)
   */
  async invalidateSongCaches(): Promise<void> {
    this.logger.info("Invalidating all song caches");
    await Promise.all([this.cache.del(CacheKeys.songs.index()), this.cache.delPattern(CacheKeys.songs.allFiltered())]);
  }

  /**
   * Comprehensive show invalidation - clears all caches related to a show.
   *
   * `years` lists the calendar year(s) whose listing edge entries must be
   * purged — both old and new on a date move so each year's edge entry
   * gets evicted.
   */
  async invalidateShowComprehensive(
    showId: string | undefined,
    slug: string | undefined,
    years: number[],
  ): Promise<void> {
    this.logger.info(`Comprehensive invalidation for show: ${showId}, slug: ${slug}`, { years });

    await Promise.all([
      slug ? this.invalidateShow(slug) : Promise.resolve(),
      showId ? this.invalidateShowReviews(showId) : Promise.resolve(),
      this.invalidateShowListings(years),
      this.invalidateSongCaches(),
    ]);
  }

  /**
   * Invalidate the performance-listing caches — All-Timers, Jam Charts, and
   * the per-day On-This-Day all-timer lists. Each renders a per-track row (the
   * Time column, plus all_timer / note membership), so any track mutation that
   * changes a duration, the all_timer flag, or a note can stale them.
   */
  async invalidatePerformanceListings(): Promise<void> {
    this.logger.info("Invalidating performance-listing caches (all-timers, jam-charts, on-this-day)");
    await Promise.all([
      this.cache.del(CacheKeys.songs.allTimers()),
      this.cache.del(CacheKeys.songs.jamCharts()),
      this.cache.delPattern(CacheKeys.songs.allTimersOnThisDayAll()),
    ]);
  }

  /**
   * Invalidate all filtered caches that include a specific user's attendance.
   */
  async invalidateAttendanceCaches(userId: string): Promise<void> {
    this.logger.info(`Invalidating attendance caches for user: ${userId}`);
    await Promise.all([
      this.cache.delPattern(CacheKeys.songs.allFilteredForUser(userId)),
      // User profile's Shows Attended tab uses a per-user paginated setlists payload.
      this.cache.delPattern(CacheKeys.users.allAttendedSetlistsForUser(userId)),
      // SetlistCard "personal" view reads this user's song-history blob.
      this.cache.del(CacheKeys.users.songHistory(userId)),
    ]);
  }

  /**
   * Invalidate rock opera resource-page caches after an assignment
   * change. Per-show annotation invalidation is handled at the
   * listings layer because annotations now ride inside the cached
   * Setlist payloads (show.data, shows.list, etc.) — see
   * `invalidateShowListings`.
   */
  async invalidateRockOperaAssignment(rockOperaSlugs: string[]): Promise<void> {
    if (rockOperaSlugs.length === 0) return;
    this.logger.info(`Invalidating rock opera resource caches: slugs=${rockOperaSlugs.join(",")}`);
    await Promise.all(rockOperaSlugs.map((slug) => this.cache.del(CacheKeys.rockOperas.performances(slug))));
  }

  /**
   * Bulk invalidation for multiple shows (useful for admin operations).
   *
   * Each show carries a `date` (preferred — Show.date is `YYYY-MM-DD`) or
   * a `slug` that starts with the date; both feed the Cloudflare year-tag
   * purge so every affected year's listing is evicted.
   */
  async invalidateShows(shows: Array<{ id: string; slug?: string; date?: string | Date }>): Promise<void> {
    this.logger.info(`Bulk invalidating ${shows.length} shows`);

    const years: number[] = [];
    for (const show of shows) {
      if (show.date !== undefined) {
        years.push(yearFromShowDate(show.date));
      } else if (show.slug) {
        const year = yearFromShowSlug(show.slug);
        if (year !== null) years.push(year);
      }
    }

    const invalidations = shows.map((show) => this.invalidateShowByShowId(show.id, show.slug));

    await Promise.all([...invalidations, this.invalidateShowListings(years)]);
  }
}
