import type { Logger } from "@bip/domain";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { RedisService } from "../redis";
import { CacheService } from "./cache-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as unknown as Logger;

function makeRedisMock() {
  const store = new Map<string, unknown>();
  return {
    get: vi.fn(async <T>(key: string): Promise<T | null> => (store.has(key) ? (store.get(key) as T) : null)),
    set: vi.fn(async <T>(key: string, value: T): Promise<void> => {
      store.set(key, value);
    }),
    del: vi.fn(async (key: string): Promise<void> => {
      store.delete(key);
    }),
    delPattern: vi.fn(async (pattern: string): Promise<number> => {
      // Mirror Redis KEYS glob semantics (* matches any run of characters).
      const regex = new RegExp(`^${pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`);
      let deleted = 0;
      for (const key of [...store.keys()]) {
        if (regex.test(key)) {
          store.delete(key);
          deleted++;
        }
      }
      return deleted;
    }),
    __store: store,
  } as unknown as RedisService & { __store: Map<string, unknown> };
}

describe("CacheService in-process memo", () => {
  let redis: ReturnType<typeof makeRedisMock>;
  let cache: CacheService;

  beforeEach(() => {
    redis = makeRedisMock();
    cache = new CacheService(redis, logger);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Multi-hundred-KB payloads (the homepage setlists) get JSON.parsed out of
  // Redis on every request; a memoized getOrSet pays that once per window.
  test("getOrSet with memoTtlSeconds serves repeat calls without touching Redis", async () => {
    const fetcher = vi.fn(async () => ({ opener: "Helicopters" }));

    const first = await cache.getOrSet("home:test", fetcher, { ttl: 60, memoTtlSeconds: 300 });
    const second = await cache.getOrSet("home:test", fetcher, { ttl: 60, memoTtlSeconds: 300 });

    expect(first).toEqual({ opener: "Helicopters" });
    expect(second).toBe(first);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(redis.get).toHaveBeenCalledTimes(1);
  });

  // Without the option, getOrSet behaves exactly as before: every call reads
  // Redis. Existing callers must see zero behavior change.
  test("getOrSet without memoTtlSeconds reads Redis every call", async () => {
    const fetcher = vi.fn(async () => "value");

    await cache.getOrSet("home:test", fetcher, { ttl: 60 });
    await cache.getOrSet("home:test", fetcher, { ttl: 60 });

    expect(redis.get).toHaveBeenCalledTimes(2);
  });

  // The memo TTL backstops deletes that bypass the app (redis-cli surgery
  // like `make clear-show-cache`): after expiry the next call re-reads Redis.
  test("memo expires after its TTL and re-reads Redis", async () => {
    const fetcher = vi.fn(async () => "value");
    const nowSpy = vi.spyOn(Date, "now");

    nowSpy.mockReturnValue(1_000_000);
    await cache.getOrSet("home:test", fetcher, { memoTtlSeconds: 300 });
    nowSpy.mockReturnValue(1_000_000 + 300 * 1000 + 1);
    await cache.getOrSet("home:test", fetcher, { memoTtlSeconds: 300 });

    expect(redis.get).toHaveBeenCalledTimes(2);
  });

  // Cache invalidation flows through del/delPattern; both must drop the memo
  // so an admin edit is visible on the very next request, not after the TTL.
  test("del clears the memo entry", async () => {
    const fetcher = vi.fn(async () => "stale");
    await cache.getOrSet("home:test", fetcher, { memoTtlSeconds: 300 });

    await cache.del("home:test");
    const fresh = await cache.getOrSet("home:test", async () => "fresh", { memoTtlSeconds: 300 });

    expect(fresh).toBe("fresh");
  });

  test("delPattern clears matching memo entries and spares the rest", async () => {
    await cache.getOrSet("home:recent", async () => "home-v1", { memoTtlSeconds: 300 });
    await cache.getOrSet("shows:list", async () => "shows-v1", { memoTtlSeconds: 300 });

    await cache.delPattern("home:*");
    const home = await cache.getOrSet("home:recent", async () => "home-v2", { memoTtlSeconds: 300 });
    const shows = await cache.getOrSet("shows:list", async () => "shows-v2", { memoTtlSeconds: 300 });

    expect(home).toBe("home-v2");
    expect(shows).toBe("shows-v1");
  });

  // Several invalidation patterns carry mid-string wildcards
  // (show:*:data:*, user:*:song-history); the memo must match them like
  // Redis does, not just trailing-star prefixes.
  test("delPattern with mid-pattern wildcards clears matching memo entries", async () => {
    await cache.getOrSet("show:aceetobee:data:v14", async () => "old", { memoTtlSeconds: 300 });
    await cache.getOrSet("show-unrelated", async () => "keep", { memoTtlSeconds: 300 });

    await cache.delPattern("show:*:data:*");
    const show = await cache.getOrSet("show:aceetobee:data:v14", async () => "new", { memoTtlSeconds: 300 });
    const unrelated = await cache.getOrSet("show-unrelated", async () => "clobbered", { memoTtlSeconds: 300 });

    expect(show).toBe("new");
    expect(unrelated).toBe("keep");
  });

  // A direct set() through the service must not leave a stale memo behind.
  test("set clears the memo entry so the next read sees the new value", async () => {
    await cache.getOrSet("home:test", async () => "old", { memoTtlSeconds: 300 });

    await cache.set("home:test", "new", { ttl: 60 });
    const value = await cache.getOrSet("home:test", async () => "unused", { memoTtlSeconds: 300 });

    expect(value).toBe("new");
  });

  // The memoized object is shared by every request in the window; a mutating
  // caller must throw at the mutation site instead of corrupting the others.
  test("memoized values are deeply frozen", async () => {
    const value = await cache.getOrSet("home:test", async () => ({ sets: [{ label: "S1" }] }), {
      memoTtlSeconds: 300,
    });

    expect(Object.isFrozen(value)).toBe(true);
    expect(Object.isFrozen(value.sets[0])).toBe(true);
  });

  // getOrSet treats null as a miss (it refetches next call), so memoizing a
  // null would change semantics; it must not be remembered.
  test("null fetcher results are not memoized", async () => {
    const fetcher = vi.fn(async () => null);

    await cache.getOrSet("home:test", fetcher, { memoTtlSeconds: 300 });
    await cache.getOrSet("home:test", fetcher, { memoTtlSeconds: 300 });

    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
