import { CacheKeys, type Logger } from "@bip/domain";
import type { RedisService } from "../redis";

/**
 * Upper bound on tracked paths for one year.
 *
 * The five tri-state media filters span 3^5 = 243 spellings of a year URL. A
 * crawler that walks them all would turn a single show edit into hundreds of
 * purge URLs, and Cloudflare takes 30 per call. Past the cap a year keeps the
 * paths it already tracked and everything else falls back to its TTL, which
 * trades a bounded window of staleness for a bounded purge.
 */
export const MAX_TRACKED_PATHS_PER_YEAR = 100;

/**
 * Outlives the edge entries it describes: `s-maxage` is a day and
 * `stale-while-revalidate` another hour, so a record that expired on the hour
 * boundary would strand a still-cached URL with nothing naming it.
 */
const RECORD_TTL_SECONDS = 172800;

/**
 * Remembers which `/shows/year/:year` URLs the origin actually served, so a
 * show edit can purge every spelling that might be sitting at the edge.
 *
 * Cloudflare's cache key includes the query string and purge-by-URL matches it
 * exactly, so the filter variants are only purgeable if something names them.
 * Enumerating all 243 combinations up front would purge mostly URLs that were
 * never requested; the origin sees every cache miss, so it already knows the
 * real, much smaller set.
 */
export class YearPurgeRegistry {
  constructor(
    private readonly redis: RedisService,
    private readonly logger: Logger,
  ) {}

  /**
   * Note that `path` was served with a purgeable TTL. Callers pass the request
   * path with its query string untouched, because that string is the cache key
   * and re-serializing it can reorder params into a URL the edge never saw.
   *
   * Never throws: this runs on the request path, and a Redis blip should cost
   * a stale variant at worst, not the response.
   */
  async record(year: number, path: string): Promise<void> {
    const key = CacheKeys.shows.yearPurgePaths(year);
    try {
      if ((await this.redis.sCard(key)) >= MAX_TRACKED_PATHS_PER_YEAR) return;
      await this.redis.sAdd(key, path);
      await this.redis.expire(key, RECORD_TTL_SECONDS);
    } catch (error) {
      this.logger.error("Year purge registry record failed", {
        year,
        path,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Every tracked path for a year. Returns an empty list rather than throwing,
   * because the caller purges the bare URL unconditionally and a failed read
   * must not break the mutation that triggered the purge.
   */
  async servedPaths(year: number): Promise<string[]> {
    try {
      return await this.redis.sMembers(CacheKeys.shows.yearPurgePaths(year));
    } catch (error) {
      this.logger.error("Year purge registry read failed", {
        year,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }
}
