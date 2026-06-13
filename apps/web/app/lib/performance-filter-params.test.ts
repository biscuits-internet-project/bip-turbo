import { describe, expect, test, vi } from "vitest";
import type { PublicContext } from "~/lib/base-loaders";

// The module imports `~/server/services`, which validates server env at
// import time. Stub it with just the musician lookup the filter needs.
const findBySlug = vi.fn();
vi.mock("~/server/services", () => ({ services: { musicians: { findBySlug } } }));

const { buildFilteredCacheKey, parsePerformanceFilters } = await import("./performance-filter-params");

// A context with no logged-in user. The musician/author/cache-key paths under
// test never touch the user service (only the `attended` param does).
const emptyContext = { currentUser: undefined } as unknown as PublicContext;

const MUSICIAN_ID = "11111111-1111-1111-1111-111111111111";

describe("parsePerformanceFilters — musician", () => {
  // The URL carries a readable slug; parse resolves it to the id the composer
  // filters on (mirrors how the attended username resolves to a user id).
  test("resolves a musician slug to playedByMusicianId", async () => {
    findBySlug.mockResolvedValueOnce({ id: MUSICIAN_ID, slug: "sam-altman" });
    const url = new URL("https://x.test/songs?musician=sam-altman");

    const filters = await parsePerformanceFilters(url, emptyContext);

    expect(findBySlug).toHaveBeenCalledWith("sam-altman");
    expect(filters.playedByMusicianId).toBe(MUSICIAN_ID);
  });

  // An unknown slug resolves to nothing, so the filter is simply inactive
  // rather than erroring or matching everything.
  test("leaves the filter inactive when the slug resolves to no musician", async () => {
    findBySlug.mockResolvedValueOnce(null);
    const url = new URL("https://x.test/songs?musician=not-a-real-musician");

    const filters = await parsePerformanceFilters(url, emptyContext);

    expect(filters.playedByMusicianId).toBeUndefined();
  });
});

describe("parsePerformanceFilters — jamChart scope", () => {
  // The "jam chart" filter (the curated/noteworthy set: all_timer ∪ note) rides
  // the `filters` param as `jamChart` and drives both the toggle chip and the
  // /songs/jam-charts page scope.
  test("parses ?filters=jamChart into the jamChart option", async () => {
    const url = new URL("https://x.test/songs/performances?filters=jamChart");

    const filters = await parsePerformanceFilters(url, emptyContext);

    expect(filters.jamChart).toBe(true);
  });
});

describe("parsePerformanceFilters — excludeRange", () => {
  // The drummer profile passes its era window as excludeStart/excludeEnd ISO
  // params; parse turns them into the Date-typed excludeRangeStart/End the
  // composer's excludeRange builder consumes.
  test("parses excludeStart and excludeEnd ISO params into Date bounds", async () => {
    const url = new URL("https://x.test/api/songs/performances?excludeStart=2005-12-28&excludeEnd=2025-09-07");

    const filters = await parsePerformanceFilters(url, emptyContext);

    expect(filters.excludeRangeStart).toEqual(new Date("2005-12-28"));
    expect(filters.excludeRangeEnd).toEqual(new Date("2025-09-07"));
  });

  // An open-ended era (only one bound) parses just that side.
  test("parses a single bound when only one of excludeStart/excludeEnd is present", async () => {
    const url = new URL("https://x.test/api/songs/performances?excludeEnd=2005-08-27");

    const filters = await parsePerformanceFilters(url, emptyContext);

    expect(filters.excludeRangeStart).toBeUndefined();
    expect(filters.excludeRangeEnd).toEqual(new Date("2005-08-27"));
  });
});

describe("buildFilteredCacheKey — excludeRange", () => {
  // Two drummers with different eras must not collide on one cached payload,
  // so the exclude window has to be part of the key.
  test("an exclude window changes the cache key", () => {
    const base = buildFilteredCacheKey(new URL("https://x.test/songs"), "performances");
    const withExclude = buildFilteredCacheKey(
      new URL("https://x.test/songs?excludeStart=2005-12-28&excludeEnd=2025-09-07"),
      "performances",
    );
    expect(withExclude).not.toBe(base);
  });

  test("different exclude windows produce different cache keys", () => {
    const a = buildFilteredCacheKey(new URL("https://x.test/songs?excludeEnd=2005-08-27"), "performances");
    const b = buildFilteredCacheKey(
      new URL("https://x.test/songs?excludeStart=2005-12-28&excludeEnd=2025-09-07"),
      "performances",
    );
    expect(a).not.toBe(b);
  });
});

describe("buildFilteredCacheKey — musician", () => {
  // The musician slug must be part of the cache key, or two different musician
  // filters would collide on one cached payload.
  test("a musician filter changes the cache key", () => {
    const base = buildFilteredCacheKey(new URL("https://x.test/songs"), "songs-index");
    const withMusician = buildFilteredCacheKey(new URL("https://x.test/songs?musician=sam-altman"), "songs-index");
    expect(withMusician).not.toBe(base);
  });

  // Different musicians produce different keys.
  test("different musicians produce different cache keys", () => {
    const a = buildFilteredCacheKey(new URL("https://x.test/songs?musician=sam-altman"), "songs-index");
    const b = buildFilteredCacheKey(new URL("https://x.test/songs?musician=allen-aucoin"), "songs-index");
    expect(a).not.toBe(b);
  });
});
