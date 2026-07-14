import type { Logger } from "@bip/domain";
import type { RedisService } from "../redis";

/**
 * Cache lifetime for every date-indexed catalog. One day matches how often
 * external catalogs (nugs.net, archive.org) realistically change — new
 * releases and remasters trickle in over days, not minutes — while still
 * bounding the window where a stale cache hides a newly-added show.
 */
export const CATALOG_TTL_SECONDS = 60 * 60 * 24;

/**
 * Lifetime of the in-process copy of the parsed map. Every Redis read
 * deserializes the whole multi-MB catalog, and the hottest pages read several
 * catalogs per request; the memo caps that at one parse per instance per
 * window. Minutes-scale so a catalog refreshed in Redis is picked up promptly.
 */
export const MEMO_TTL_SECONDS = 60 * 5;

/**
 * Recursively freeze a parsed catalog map. The memo hands the same object to
 * every request for the memo window, so an accidental mutation by one caller
 * would silently corrupt what all other requests see; freezing makes it throw
 * at the mutation site instead. Values are plain JSON (no cycles).
 */
function deepFreeze<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value)) {
      deepFreeze((value as Record<string, unknown>)[key]);
    }
  }
  return value;
}

/**
 * Shared caching layer for external catalogs that are small enough to fetch in
 * one bulk request and index by ISO date (YYYY-MM-DD). Exists so every external
 * integration (nugs.net, archive.org) doesn't reinvent read-through Redis with
 * single-flight, empty-result handling, and an in-process memo of the parsed
 * map. Treat the fetcher as slow and expensive (each catalog refresh pays that
 * cost once per instance per TTL window, not once per user request) and the
 * Redis payload as large: without the memo every request re-deserializes the
 * full multi-MB map.
 */
export class DateIndexedCatalog<T> {
  private inFlight: Promise<Record<string, T>> | null = null;
  private memo: { map: Record<string, T>; expiresAt: number } | null = null;

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
    if (this.memo && Date.now() < this.memo.expiresAt) return this.memo.map;

    const cached = await this.redis.get<Record<string, T>>(this.cacheKey);
    if (cached) {
      this.remember(cached);
      return cached;
    }

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
        await this.redis.set<Record<string, T>>(this.cacheKey, map, { EX: CATALOG_TTL_SECONDS });
        this.remember(map);
      }
      return map;
    } catch (error) {
      this.logger?.error("DateIndexedCatalog fetch failed", { cacheKey: this.cacheKey, error });
      return {};
    }
  }

  /**
   * Keep the parsed map in process memory for {@link MEMO_TTL_SECONDS}. Only
   * non-empty maps are remembered: an empty result means the fetch failed or
   * returned nothing, and memoizing it would suppress the retry.
   */
  private remember(map: Record<string, T>): void {
    this.memo = { map: deepFreeze(map), expiresAt: Date.now() + MEMO_TTL_SECONDS * 1000 };
  }
}
