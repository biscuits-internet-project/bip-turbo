import type { Logger } from "@bip/domain";
import type { RedisClientType } from "redis";
import { CacheInvalidationService, CacheService, CloudflareCacheService } from "./cache";
import type { DbClient } from "./database/models";
import type { Env } from "./env";
import { RedisService } from "./redis";

export interface ServiceContainer {
  db: DbClient;
  env: Env;
  redis: RedisService;
  cache: CacheService;
  cloudflareCache: CloudflareCacheService;
  cacheInvalidation: CacheInvalidationService;
  logger: Logger;
}

export interface ContainerArgs {
  db?: DbClient;
  logger: Logger;
  env: Env;
  redis?: RedisClientType;
}

export function createContainer(args: ContainerArgs): ServiceContainer {
  const { db, env, logger } = args;

  if (!db) throw new Error("Database connection required for container initialization");
  if (!env) throw new Error("Environment required for container initialization");

  const redis = new RedisService(env.REDIS_URL, logger);

  // Create cache services
  const cache = new CacheService(redis, logger);
  const cloudflareCache = new CloudflareCacheService(
    {
      zoneId: env.CLOUDFLARE_ZONE_ID,
      apiToken: env.CLOUDFLARE_CACHE_PURGE_TOKEN,
    },
    logger,
  );
  const cacheInvalidation = new CacheInvalidationService(cache, logger, cloudflareCache);

  return {
    db,
    env,
    redis,
    cache,
    cloudflareCache,
    cacheInvalidation,
    logger,
  };
}

// Singleton instance
let container: ServiceContainer | undefined;

export function getContainer(args: ContainerArgs): ServiceContainer {
  if (!container) {
    container = createContainer(args);
  }
  return container;
}
