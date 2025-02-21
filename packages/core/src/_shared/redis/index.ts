// packages/core/src/redis/client.ts
import { type RedisClientType, createClient } from "redis";

let client: RedisClientType | null = null;

export const getRedisClient = async (url = "redis://localhost:6380") => {
  if (!client) {
    client = createClient({
      url,
    });

    await client.connect();
  }

  return client;
};

// You can still have your helper functions here
export const get = async <T>(key: string): Promise<T | null> => {
  const redis = await getRedisClient();
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
};

export const set = async <T>(key: string, value: T) => {
  const redis = await getRedisClient();
  await redis.set(key, JSON.stringify(value));
};

export const del = async (key: string) => {
  const redis = await getRedisClient();
  await redis.del(key);
};
