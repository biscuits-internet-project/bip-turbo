import { beforeEach, describe, expect, test, vi } from "vitest";
import type { RedisService } from "../redis";
import { MAX_TRACKED_PATHS_PER_SCOPE, ServedUrlRegistry } from "./served-url-registry";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };

/** In-memory stand-in for the set commands the registry uses. */
function fakeRedis() {
  const sets = new Map<string, Set<string>>();
  const expirations = new Map<string, number>();
  return {
    sets,
    expirations,
    sAdd: vi.fn(async (key: string, member: string) => {
      const set = sets.get(key) ?? new Set<string>();
      set.add(member);
      sets.set(key, set);
    }),
    sMembers: vi.fn(async (key: string) => [...(sets.get(key) ?? [])]),
    sCard: vi.fn(async (key: string) => sets.get(key)?.size ?? 0),
    expire: vi.fn(async (key: string, seconds: number) => {
      expirations.set(key, seconds);
    }),
  };
}

function makeRegistry(redis: ReturnType<typeof fakeRedis>) {
  return new ServedUrlRegistry(redis as unknown as RedisService, logger as never);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ServedUrlRegistry.record", () => {
  // Cloudflare keys on the exact request line, so the recorded string has to be
  // the one the edge saw — query string included, in the order it arrived.
  test("stores the path verbatim, query string and all", async () => {
    const redis = fakeRedis();

    await makeRegistry(redis).record("year:2001", "/shows/year/2001?nugs=yes&photos=no");

    expect(await makeRegistry(redis).servedPaths("year:2001")).toEqual(["/shows/year/2001?nugs=yes&photos=no"]);
  });

  // Re-recording the same URL on every cache miss must not grow the set.
  test("deduplicates repeat recordings of one path", async () => {
    const redis = fakeRedis();
    const registry = makeRegistry(redis);

    await registry.record("year:2001", "/shows/year/2001?nugs=yes");
    await registry.record("year:2001", "/shows/year/2001?nugs=yes");

    expect(await registry.servedPaths("year:2001")).toEqual(["/shows/year/2001?nugs=yes"]);
  });

  // Each year purges independently, so one year's tracked URLs must never leak
  // into another year's purge.
  test("keys the set per year", async () => {
    const redis = fakeRedis();
    const registry = makeRegistry(redis);

    await registry.record("year:2001", "/shows/year/2001");
    await registry.record("year:1998", "/shows/year/1998?photos=yes");

    expect(await registry.servedPaths("year:2001")).toEqual(["/shows/year/2001"]);
    expect(await registry.servedPaths("year:1998")).toEqual(["/shows/year/1998?photos=yes"]);
  });

  // The set is only useful while the edge entries it describes are still alive.
  // Refreshing on every write keeps a year that is actively served from ever
  // losing its record.
  test("refreshes the expiry past the edge TTL on every write", async () => {
    const redis = fakeRedis();

    await makeRegistry(redis).record("year:2001", "/shows/year/2001");

    const [[, seconds]] = redis.expire.mock.calls;
    expect(seconds).toBeGreaterThan(86400 + 3600);
  });

  // A crawler walking all 3^5 filter combinations would otherwise turn one show
  // edit into hundreds of purge calls. Past the cap the year keeps the URLs it
  // already tracked and the rest ride their TTL.
  test("stops recording once the cap is reached", async () => {
    const redis = fakeRedis();
    const registry = makeRegistry(redis);

    for (let index = 0; index < MAX_TRACKED_PATHS_PER_SCOPE + 10; index++) {
      await registry.record("year:2001", `/shows/year/2001?photos=yes&n=${index}`);
    }

    expect(await registry.servedPaths("year:2001")).toHaveLength(MAX_TRACKED_PATHS_PER_SCOPE);
  });

  // Bookkeeping runs on the request path. A Redis blip must cost a purge-time
  // miss, never the response itself.
  test("swallows and logs a Redis failure", async () => {
    const redis = fakeRedis();
    redis.sAdd.mockRejectedValue(new Error("redis down"));

    await expect(makeRegistry(redis).record("year:2001", "/shows/year/2001")).resolves.toBeUndefined();
    expect(logger.error).toHaveBeenCalled();
  });
});

describe("ServedUrlRegistry.servedPaths", () => {
  test("returns nothing for a year that was never recorded", async () => {
    expect(await makeRegistry(fakeRedis()).servedPaths("year:2001")).toEqual([]);
  });

  // Purge callers treat this as "everything that might be cached". Throwing
  // would break the mutation; an empty list still purges the bare URL, which
  // the caller adds unconditionally.
  test("returns nothing when Redis is unreachable", async () => {
    const redis = fakeRedis();
    redis.sMembers.mockRejectedValue(new Error("redis down"));

    expect(await makeRegistry(redis).servedPaths("year:2001")).toEqual([]);
    expect(logger.error).toHaveBeenCalled();
  });
});
