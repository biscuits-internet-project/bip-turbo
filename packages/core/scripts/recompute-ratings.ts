import { CacheInvalidationService, CacheService } from "../src/_shared/cache";
import prisma from "../src/_shared/prisma/client";
import { getFeatureFlags } from "../src/_shared/quonfig";
import { RedisService } from "../src/_shared/redis";
import { createTestLogger } from "../src/_shared/test-logger";
import { RaterWeightService } from "../src/ratings/rater-weight-service";
import { RatingService } from "../src/ratings/rating-service";
import { runRatingsRecompute } from "../src/ratings/recompute-ratings";

/**
 * Deploy-time rating recompute. Wired into apps/web/docker-entrypoint.sh after
 * `prisma migrate deploy`, and runnable locally via `make recompute-ratings`. Uses
 * the same dirty-gated routine as the hourly cron, so on a deploy with no rating
 * change it costs one settings read; the first deploy of the feature (ratings_dirty
 * seeded true) does the full backfill. Respects the `ratings.recompute-enabled` flag.
 */
async function main(): Promise<void> {
  const logger = createTestLogger();

  const flags = await getFeatureFlags();
  if (!flags.recomputeEnabled) {
    logger.info("Ratings recompute disabled by flag; skipping");
    await prisma.$disconnect();
    return;
  }

  const redisUrl = process.env.REDIS_URL;
  const redis = redisUrl ? new RedisService(redisUrl, logger) : null;
  if (redis) await redis.connect();
  const cache = redis ? new CacheService(redis, logger) : null;
  const cacheInvalidation = cache ? new CacheInvalidationService(cache, logger) : undefined;

  const raterWeights = new RaterWeightService(prisma);
  const ratings = new RatingService(prisma, cacheInvalidation as never, raterWeights);

  try {
    await runRatingsRecompute({ raterWeights, ratings, logger });
  } finally {
    await redis?.disconnect();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("recompute-ratings failed:", error);
  process.exit(1);
});
