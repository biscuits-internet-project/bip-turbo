import { CacheKeys, type Logger } from "@bip/domain";
import type { CacheService } from "./cache-service";

export class CacheInvalidationService {
  constructor(
    private readonly cache: CacheService,
    private readonly logger: Logger,
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
    ]);
  }

  /**
   * Comprehensive show invalidation - clears all caches related to a show
   */
  async invalidateShowComprehensive(showId: string, slug?: string): Promise<void> {
    this.logger.info(`Comprehensive invalidation for show: ${showId}, slug: ${slug}`);

    await Promise.all([
      slug ? this.invalidateShow(slug) : Promise.resolve(),
      this.invalidateShowReviews(showId),
      this.invalidateShowListings(),
    ]);
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
