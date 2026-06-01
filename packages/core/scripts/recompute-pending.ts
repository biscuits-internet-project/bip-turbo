import { CacheInvalidationService, CacheService } from "../src/_shared/cache";
import prisma from "../src/_shared/prisma/client";
import { RedisService } from "../src/_shared/redis";
import { createTestLogger } from "../src/_shared/test-logger";
import { runPendingRecompute } from "../src/stats/recompute-pending";
import { StatsService } from "../src/stats/stats-service";

/**
 * Deploy-time entrypoint that drains the stats_recompute_requests queue. Wired
 * into apps/web/docker-entrypoint.sh after `prisma migrate deploy`, and runnable
 * locally via `make recompute-pending`. Redis is optional — without REDIS_URL the
 * recompute still runs and only the cache bust is skipped.
 */
async function main(): Promise<void> {
  const logger = createTestLogger();
  const redisUrl = process.env.REDIS_URL;
  const redis = redisUrl ? new RedisService(redisUrl, logger) : null;
  if (redis) await redis.connect();
  const cache = redis ? new CacheService(redis, logger) : null;
  const cacheInvalidation = cache ? new CacheInvalidationService(cache, logger) : undefined;
  const stats = new StatsService(prisma, cache ?? undefined);

  try {
    await runPendingRecompute({ db: prisma, stats, cacheInvalidation, logger });
  } finally {
    await redis?.disconnect();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("recompute-pending failed:", error);
  process.exit(1);
});
