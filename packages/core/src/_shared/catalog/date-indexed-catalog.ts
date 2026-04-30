import type { Logger } from "@bip/domain";
import type { RedisService } from "../redis";

/**
 * Cache lifetime for every date-indexed catalog. One day matches how often
 * external catalogs (nugs.net, archive.org) realistically change — new
 * releases and remasters trickle in over days, not minutes — while still
 * bounding the window where a stale cache hides a newly-added show.
 */
const TTL_SECONDS = 60 * 60 * 24;

/**
 * Shared caching layer for external catalogs that are small enough to fetch in
 * one bulk request and index by ISO date (YYYY-MM-DD). Exists so every external
 * integration (nugs.net, archive.org) doesn't reinvent read-through Redis with
 * single-flight and empty-result handling. Treat the fetcher as slow and
 * expensive — the whole point is that each catalog refresh pays that cost once
 * per instance per TTL window, not once per user request.
 */
export class DateIndexedCatalog<T> {
  private inFlight: Promise<Record<string, T>> | null = null;

  /**
   * @param redis Shared Redis client. The catalog persists its entire date-indexed
   *   map under a single key so bulk badge lookups stay O(1) per show.
   * @param cacheKey Redis key under which the full date → T map is persisted.
   * @param fetcher Pulls the full catalog from the upstream service and returns
   *   it indexed by ISO date. The fetcher must return the full map; partial
   *   refreshes are not supported.
   * @param logger Optional logger; failures are swallowed and logged so a show
   *   page never breaks when the upstream service is down.
   */
  constructor(
    private readonly redis: RedisService,
    private readonly cacheKey: string,
    private readonly fetcher: () => Promise<Record<string, T>>,
    private readonly logger?: Logger,
  ) {}

  /**
   * Look up a single entry by ISO date. Returns `undefined` (not null) so
   * consumers can chain `?? fallback` naturally.
   *
   * @param date ISO date string (YYYY-MM-DD). Must match the key format the
   *   fetcher produces.
   */
  async findByDate(date: string): Promise<T | undefined> {
    const map = await this.getMap();
    return map[date];
  }

  /**
   * Fetch the whole date-indexed map. Used by listing pages that need O(1)
   * per-row lookups across many shows without issuing per-show API calls.
   */
  async getAll(): Promise<Record<string, T>> {
    return this.getMap();
  }

  private async getMap(): Promise<Record<string, T>> {
    const cached = await this.redis.get<Record<string, T>>(this.cacheKey);
    if (cached) return cached;

    if (this.inFlight) return this.inFlight;

    this.inFlight = this.fetchAndCache();
    try {
      return await this.inFlight;
    } finally {
      this.inFlight = null;
    }
  }

  private async fetchAndCache(): Promise<Record<string, T>> {
    try {
      const map = await this.fetcher();
      if (Object.keys(map).length > 0) {
        await this.redis.set<Record<string, T>>(this.cacheKey, map, { EX: TTL_SECONDS });
      }
      return map;
    } catch (error) {
      this.logger?.error("DateIndexedCatalog fetch failed", { cacheKey: this.cacheKey, error });
      return {};
    }
  }
}
