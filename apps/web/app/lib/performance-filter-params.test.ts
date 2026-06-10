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
