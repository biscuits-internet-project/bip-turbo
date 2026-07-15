import type { Logger } from "@bip/domain";
import { deepFreeze } from "../deep-freeze";
import type { RedisService } from "../redis";

export interface CacheOptions {
  /** TTL in seconds. Defaults to 86400 (24 hours) */
  ttl?: number;
  /**
   * Also keep the parsed value in process memory for this many seconds, so
   * repeat getOrSet calls skip the Redis read AND the JSON.parse. Use for
   * hot, multi-hundred-KB payloads (e.g. the homepage setlists) where the
   * per-request parse is real allocation pressure.
   *
   * Coherence: del/delPattern/set drop matching memo entries, so app-driven
   * invalidation is visible on the next request (prod runs a single process,
   * so the invalidating request and every reader share this memory). The TTL
   * only bounds staleness from deletes that bypass the app entirely
   * (redis-cli surgery like `make clear-show-cache`). Memoized values are
   * deep-frozen because every request in the window shares the same object.
   */
  memoTtlSeconds?: number;
}

export class CacheService {
  private readonly DEFAULT_TTL = 86400; // 24 hours
  private readonly memo = new Map<string, { value: unknown; expiresAt: number }>();

  constructor(
    private readonly redis: RedisService,
    private readonly logger: Logger,
  ) {}

  private memoGet<T>(key: string): T | null {
    const entry = this.memo.get(key);
    if (!entry) return null;
    if (Date.now() >= entry.expiresAt) {
      this.memo.delete(key);
      return null;
    }
    return entry.value as T;
  }

  private memoSet<T>(key: string, value: T, ttlSeconds: number): void {
    this.memo.set(key, { value: deepFreeze(value), expiresAt: Date.now() + ttlSeconds * 1000 });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get<T>(key);
      if (value !== null) {
        this.logger.debug(`Cache hit: ${key}`);
      } else {
        this.logger.debug(`Cache miss: ${key}`);
      }
      return value;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    this.memo.delete(key);
    try {
      const ttl = options?.ttl ?? this.DEFAULT_TTL;
      await this.redis.set(key, value, { EX: ttl });
      this.logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      // Don't throw - caching failures should not break the application
    }
  }

  async del(key: string): Promise<void> {
    this.memo.delete(key);
    try {
      await this.redis.del(key);
      this.logger.debug(`Cache delete: ${key}`);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async delPattern(pattern: string): Promise<number> {
    // Drop memo entries with the same glob semantics Redis applies to its
    // keys (`*` matches any run of characters, including mid-pattern as in
    // show:*:data:*), so a memoized key can never survive an invalidation
    // that removed its Redis twin.
    const regex = new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`);
    for (const key of [...this.memo.keys()]) {
      if (regex.test(key)) this.memo.delete(key);
    }
    try {
      const deletedCount = await this.redis.delPattern(pattern);
      this.logger.debug(`Cache pattern delete: ${pattern} (${deletedCount} keys)`);
      return deletedCount;
    } catch (error) {
      this.logger.error(`Cache pattern delete error for pattern ${pattern}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return await this.redis.exists(key);
    } catch (error) {
      this.logger.error(`Cache exists error for key ${key}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Cache-aside pattern helper. Gets value from cache, or executes fetcher and caches result.
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions): Promise<T> {
    const memoTtlSeconds = options?.memoTtlSeconds;
    if (memoTtlSeconds) {
      const memoized = this.memoGet<T>(key);
      if (memoized !== null) return memoized;
    }

    const cached = await this.get<T>(key);
    if (cached !== null) {
      if (memoTtlSeconds) this.memoSet(key, cached, memoTtlSeconds);
      return cached;
    }

    const value = await fetcher();
    await this.set(key, value, options);
    // After set() (which drops any memo entry), so the memo holds the value
    // just written. Null is a getOrSet miss by contract; never memoize it.
    if (memoTtlSeconds && value !== null) this.memoSet(key, value, memoTtlSeconds);
    return value;
  }
}
