import { CacheKeys, type Logger } from "@bip/domain";
import type { RedisService } from "../redis";

/**
 * Upper bound on tracked paths for one scope.
 *
 * The five tri-state media filters span 3^5 = 243 spellings of a listing URL,
 * and the stats table multiplies that by a time range. A crawler walking that
 * space would otherwise turn a single show edit into hundreds of purge URLs,
 * and Cloudflare takes 30 per call. Past the cap a scope keeps the paths it
 * already tracked and everything else falls back to its TTL, which trades a
 * bounded window of staleness for a bounded purge.
 */
export const MAX_TRACKED_PATHS_PER_SCOPE = 100;

/**
 * Outlives the edge entries it describes: `s-maxage` is a day and
 * `stale-while-revalidate` another hour, so a record that expired on the hour
 * boundary would strand a still-cached URL with nothing naming it.
 */
const RECORD_TTL_SECONDS = 172800;

/**
 * Remembers which listing URLs the origin actually served, so a show edit can
 * purge every spelling that might be sitting at the edge.
 *
 * Cloudflare's cache key includes the query string and purge-by-URL matches it
 * exactly, so filter variants are only purgeable if something names them.
 * Enumerating every combination up front would purge mostly URLs that were
 * never requested; the origin sees every cache miss, so it already knows the
 * real, much smaller set.
 *
 * Scoped rather than year-keyed because the same problem applies to any listing
 * whose query string forks the cache key: `/shows/year/:year` is one scope per
 * year, `/shows/stats` a single global one.
 */
export class ServedUrlRegistry {
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
  async record(scope: string, path: string): Promise<void> {
    const key = CacheKeys.shows.servedUrlPaths(scope);
    try {
      if ((await this.redis.sCard(key)) >= MAX_TRACKED_PATHS_PER_SCOPE) return;
      await this.redis.sAdd(key, path);
      await this.redis.expire(key, RECORD_TTL_SECONDS);
    } catch (error) {
      this.logger.error("Served-url registry record failed", {
        scope,
        path,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Every tracked path for a scope. Returns an empty list rather than throwing,
   * because callers purge their bare URL unconditionally and a failed read must
   * not break the mutation that triggered the purge.
   */
  async servedPaths(scope: string): Promise<string[]> {
    try {
      return await this.redis.sMembers(CacheKeys.shows.servedUrlPaths(scope));
    } catch (error) {
      this.logger.error("Served-url registry read failed", {
        scope,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }
}
