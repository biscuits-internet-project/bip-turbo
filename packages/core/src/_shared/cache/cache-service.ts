import type { Logger } from "@bip/domain";
import type { RedisService } from "../redis";

export interface CacheOptions {
  /** TTL in seconds. Defaults to 86400 (24 hours) */
  ttl?: number;
}

export class CacheService {
  private readonly DEFAULT_TTL = 86400; // 24 hours

  constructor(
    private readonly redis: RedisService,
    private readonly logger: Logger,
  ) {}

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
      this.logger.error(`Cache get error for key ${key}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      const ttl = options?.ttl ?? this.DEFAULT_TTL;
      await this.redis.set(key, value, { EX: ttl });
      this.logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}:`, error instanceof Error ? error.message : String(error));
      // Don't throw - caching failures should not break the application
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      this.logger.debug(`Cache delete: ${key}`);
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}:`, error instanceof Error ? error.message : String(error));
    }
  }

  async delPattern(pattern: string): Promise<number> {
    try {
      const deletedCount = await this.redis.delPattern(pattern);
      this.logger.debug(`Cache pattern delete: ${pattern} (${deletedCount} keys)`);
      return deletedCount;
    } catch (error) {
      this.logger.error(
        `Cache pattern delete error for pattern ${pattern}:`,
        error instanceof Error ? error.message : String(error),
      );
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      return await this.redis.exists(key);
    } catch (error) {
      this.logger.error(`Cache exists error for key ${key}:`, error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  /**
   * Cache-aside pattern helper. Gets value from cache, or executes fetcher and caches result.
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, options?: CacheOptions): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetcher();
    await this.set(key, value, options);
    return value;
  }
}
