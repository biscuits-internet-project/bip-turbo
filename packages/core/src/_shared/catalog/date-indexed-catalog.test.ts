import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { RedisService } from "../redis";
import { DateIndexedCatalog } from "./date-indexed-catalog";

interface SongRecord {
  song: string;
}

function makeRedisMock() {
  const store = new Map<string, unknown>();
  return {
    get: vi.fn(async <T>(key: string): Promise<T | null> => (store.has(key) ? (store.get(key) as T) : null)),
    set: vi.fn(async <T>(key: string, value: T): Promise<void> => {
      store.set(key, value);
    }),
    __store: store,
  } as unknown as RedisService & { __store: Map<string, unknown> };
}

// Fixture uses Biscuits songs as values so test output is recognizable.
const SAMPLE_MAP: Record<string, SongRecord> = {
  "2007-12-28": { song: "Basis for a Day" },
  "2001-09-01": { song: "Aceetobee" },
};

describe("DateIndexedCatalog", () => {
  let redis: ReturnType<typeof makeRedisMock>;

  beforeEach(() => {
    redis = makeRedisMock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Cold cache must invoke the fetcher, persist the map under the configured
  // cache key, and return the matching value. This is the baseline read-
  // through path used by every consumer service (nugs, archive.org, etc.).
  test("cache miss: fetches, caches, and returns the matching value", async () => {
    const fetcher = vi.fn(async () => SAMPLE_MAP);
    const catalog = new DateIndexedCatalog<SongRecord>(redis, "catalog:test", fetcher);

    const result = await catalog.findByDate("2007-12-28");

    expect(result).toEqual({ song: "Basis for a Day" });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(redis.__store.get("catalog:test")).toEqual(SAMPLE_MAP);
  });

  // Warm cache must skip the fetcher entirely. This is the whole point of
  // the shared utility — one external fetch, N lookups at Redis speed.
  test("cache hit: does not call the fetcher", async () => {
    const fetcher = vi.fn(async () => SAMPLE_MAP);
    redis.__store.set("catalog:test", SAMPLE_MAP);
    const catalog = new DateIndexedCatalog<SongRecord>(redis, "catalog:test", fetcher);

    const result = await catalog.findByDate("2001-09-01");

    expect(result).toEqual({ song: "Aceetobee" });
    expect(fetcher).not.toHaveBeenCalled();
  });

  // Thundering-herd protection: when 10 requests hit a cold cache at once,
  // only ONE external fetch should happen. Without the in-process single-
  // flight guard, each request would race to the fetcher and we'd hammer
  // the upstream API (~950ms / 420KB per call for archive.org).
  test("single-flight: concurrent cold-cache calls invoke the fetcher exactly once", async () => {
    const fetcher = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return SAMPLE_MAP;
    });
    const catalog = new DateIndexedCatalog<SongRecord>(redis, "catalog:test", fetcher);

    const results = await Promise.all(Array.from({ length: 10 }, () => catalog.findByDate("2007-12-28")));

    expect(fetcher).toHaveBeenCalledTimes(1);
    for (const result of results) {
      expect(result).toEqual({ song: "Basis for a Day" });
    }
  });

  // A successful-but-empty fetch must NOT be cached. Otherwise a transient
  // upstream glitch would lock the catalog to empty for the full TTL.
  test("empty fetcher result is not cached (retries next call)", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce({}).mockResolvedValueOnce(SAMPLE_MAP);
    const catalog = new DateIndexedCatalog<SongRecord>(redis, "catalog:test", fetcher);

    const first = await catalog.findByDate("2007-12-28");
    expect(first).toBeUndefined();
    expect(redis.__store.has("catalog:test")).toBe(false);

    const second = await catalog.findByDate("2007-12-28");
    expect(second).toEqual({ song: "Basis for a Day" });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  // Fetcher throws should not crash the page — catalog swallows the error,
  // returns undefined for the lookup, and does not cache.
  test("fetcher throw: returns undefined and does not cache", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("upstream down"));
    const catalog = new DateIndexedCatalog<SongRecord>(redis, "catalog:test", fetcher);

    const result = await catalog.findByDate("2007-12-28");

    expect(result).toBeUndefined();
    expect(redis.__store.has("catalog:test")).toBe(false);
  });

  // getAll() exposes the whole map so the badge code can do O(1) Set<date>
  // lookups for listing pages without N+1 findByDate calls.
  test("getAll: returns the full date-indexed map", async () => {
    const fetcher = vi.fn(async () => SAMPLE_MAP);
    const catalog = new DateIndexedCatalog<SongRecord>(redis, "catalog:test", fetcher);

    const all = await catalog.getAll();

    expect(all).toEqual(SAMPLE_MAP);
  });

  // Unknown dates must return undefined (not throw, not null) so consumers
  // can use `const rec = await catalog.findByDate(date); if (rec) ...`.
  test("findByDate for an unknown date returns undefined", async () => {
    const fetcher = vi.fn(async () => SAMPLE_MAP);
    const catalog = new DateIndexedCatalog<SongRecord>(redis, "catalog:test", fetcher);

    const result = await catalog.findByDate("1999-04-09");

    expect(result).toBeUndefined();
  });

  // The catalog applies a one-day TTL to every successful fetch — external
  // catalogs (nugs, archive.org) change on a multi-day cadence, so daily
  // refresh bounds the staleness window without burning the upstream API.
  test("persists with a one-day TTL", async () => {
    const fetcher = vi.fn(async () => SAMPLE_MAP);
    const catalog = new DateIndexedCatalog<SongRecord>(redis, "catalog:test", fetcher);

    await catalog.findByDate("2007-12-28");

    const setCalls = (redis.set as ReturnType<typeof vi.fn>).mock.calls;
    expect(setCalls).toHaveLength(1);
    expect(setCalls[0][2]).toEqual({ EX: 60 * 60 * 24 });
  });
});
