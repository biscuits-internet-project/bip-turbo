import { CacheKeys, type Logger } from "@bip/domain";
import type { CacheService } from "./cache-service";
import type { CloudflareCacheService } from "./cloudflare-cache-service";

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
   * Invalidate all show listing caches (for when show metadata changes)
   */
  async invalidateShowListings(): Promise<void> {
    this.logger.info("Invalidating all show listing caches and home page");
    await Promise.all([
      this.cache.delPattern(CacheKeys.shows.allLists()),
      this.cache.delPattern("home:*"), // Invalidate all home page caches
      this.cache.del(CacheKeys.stats.showsByYear()), // shows-per-year aggregate is tied to the show catalog
      this.cache.del(CacheKeys.stats.showDates()), // sorted stats-show-dates array backs Gap to Now on /songs
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
      this.cloudflareCache?.purgeYearListings(),
    ]);
  }

  /**
   * Invalidate the cross-domain shows-by-year aggregate. Standalone hook
   * for callers that mutate shows without going through the listing flow.
   */
  async invalidateStatsShowsByYear(): Promise<void> {
    this.logger.info("Invalidating stats:shows-by-year + stats:show-dates");
    await Promise.all([this.cache.del(CacheKeys.stats.showsByYear()), this.cache.del(CacheKeys.stats.showDates())]);
  }

  /**
   * Invalidate all song-related caches (index page and filtered results)
   */
  async invalidateSongCaches(): Promise<void> {
    this.logger.info("Invalidating all song caches");
    await Promise.all([this.cache.del(CacheKeys.songs.index()), this.cache.delPattern(CacheKeys.songs.allFiltered())]);
  }

  /**
   * Comprehensive show invalidation - clears all caches related to a show
   */
  async invalidateShowComprehensive(showId?: string, slug?: string): Promise<void> {
    this.logger.info(`Comprehensive invalidation for show: ${showId}, slug: ${slug}`);

    await Promise.all([
      slug ? this.invalidateShow(slug) : Promise.resolve(),
      showId ? this.invalidateShowReviews(showId) : Promise.resolve(),
      this.invalidateShowListings(),
      this.invalidateSongCaches(),
    ]);
  }

  /**
   * Invalidate the all-timers cache
   */
  async invalidateAllTimers(): Promise<void> {
    this.logger.info("Invalidating all-timers cache");
    await this.cache.del(CacheKeys.songs.allTimers());
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
   * Bulk invalidation for multiple shows (useful for admin operations)
   */
  async invalidateShows(shows: Array<{ id: string; slug?: string }>): Promise<void> {
    this.logger.info(`Bulk invalidating ${shows.length} shows`);

    const invalidations = shows.map((show) => this.invalidateShowByShowId(show.id, show.slug));

    await Promise.all([...invalidations, this.invalidateShowListings()]);
  }
}
