import type { SetlistLight } from "@bip/domain";
import { type DehydratedState, QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, test, vi } from "vitest";

const cacheGetOrSet = vi.fn();
const findPerformanceShowIds = vi.fn();
const findPerformancesForShow = vi.fn();
const findManyByShowIdsLight = vi.fn();
const computeShowExternalSourcesFn = vi.fn();
const computeShowUserDataFn = vi.fn();
const prefetchQuery = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    cache: { getOrSet: cacheGetOrSet },
    rockOperas: {
      findPerformanceShowIds: (...args: unknown[]) => findPerformanceShowIds(...args),
      findPerformancesForShow: (...args: unknown[]) => findPerformancesForShow(...args),
    },
    setlists: { findManyByShowIdsLight: (...args: unknown[]) => findManyByShowIdsLight(...args) },
  },
}));

vi.mock("~/server/show-external-sources", () => ({
  computeShowExternalSources: (...args: unknown[]) => computeShowExternalSourcesFn(...args),
}));

vi.mock("~/server/show-user-data", () => ({
  computeShowUserData: (...args: unknown[]) => computeShowUserDataFn(...args),
}));

// Use a real QueryClient (and the real dehydrateAndClear) so dehydration
// behaves as in production, but spy on `prefetchQuery` so tests can assert
// what the loader queued for hydration.
vi.mock("~/lib/query-prefetch", async (importOriginal) => {
  const actual = await importOriginal<typeof import("~/lib/query-prefetch")>();
  return {
    ...actual,
    createPrefetchClient: () => {
      const client = new QueryClient();
      client.prefetchQuery = prefetchQuery as never;
      return client;
    },
  };
});

const { getRockOperaPerformances } = await import("./rock-opera-performances");

function makeSetlist(showId: string, date: string): SetlistLight {
  return {
    show: { id: showId, slug: `${date}-show`, date } as SetlistLight["show"],
    venue: { id: "v-1", slug: "v", name: "Venue", city: "City", state: "ST", country: "US" } as SetlistLight["venue"],
    sets: [],
    annotations: [],
    averageSongGap: null,
    medianSongGap: null,
    debutCount: 0,
    rockOperaPerformances: [], // composer default; loader overlays real data
    lineup: [],
    trackMusicianDeltas: [],
  };
}

const context = { currentUser: null } as never;

describe("getRockOperaPerformances", () => {
  beforeEach(() => {
    cacheGetOrSet.mockReset();
    findPerformanceShowIds.mockReset();
    findPerformancesForShow.mockReset();
    findManyByShowIdsLight.mockReset();
    computeShowExternalSourcesFn.mockReset();
    computeShowUserDataFn.mockReset();
    prefetchQuery.mockReset();
    // Default: cache misses every time and runs the loader closure inline.
    cacheGetOrSet.mockImplementation(async (_key: string, loader: () => Promise<unknown>) => loader());
  });

  // When the opera has zero tagged shows we return an empty payload AND
  // skip the prefetch (showUserDataQueryKey([]) would be a wasted call
  // and the badges have nothing to seed). Drives the "newly added rock
  // opera with no full performances tagged yet" empty state.
  test("returns empty payload + skips prefetch when no shows are tagged", async () => {
    findPerformanceShowIds.mockResolvedValue([]);

    const result = await getRockOperaPerformances("hot-air-balloon", context);

    expect(result.performances).toEqual([]);
    expect(result.externalSources).toEqual({});
    expect(findManyByShowIdsLight).not.toHaveBeenCalled();
    expect(prefetchQuery).not.toHaveBeenCalled();
  });

  // The cache key is the canonical `rockOperas.performances(slug)` so
  // `CacheInvalidationService.invalidateRockOperaAssignment` clears the
  // right entry on every admin tag change. Guards against a typo / drift
  // away from the centralized key.
  test("uses the canonical rockOperas.performances cache key", async () => {
    findPerformanceShowIds.mockResolvedValue([]);

    await getRockOperaPerformances("hot-air-balloon", context);

    const usedKey = cacheGetOrSet.mock.calls[0][0] as string;
    expect(usedKey).toMatch(/^rock-operas:performances:hot-air-balloon/);
    // v12 = the SetlistLight shape (lean track songs, no lyrics/history).
    // A payload-shape change without a version bump would serve stale-shape
    // blobs from deployed instances until TTL (the cache-versioning rule).
    expect(usedKey).toContain(":v12");
  });

  // Setlists must be loaded by show id in chronological-asc order so the
  // SetlistList `numbered` gutter renders 1..N naturally (oldest = #1).
  // Drives the resource page's display contract.
  test("requests setlists ordered by date asc", async () => {
    findPerformanceShowIds.mockResolvedValue(["show-1", "show-2"]);
    findManyByShowIdsLight.mockResolvedValue([
      makeSetlist("show-1", "1998-12-31"),
      makeSetlist("show-2", "1999-01-24"),
    ]);
    findPerformancesForShow.mockResolvedValue([]);
    computeShowExternalSourcesFn.mockResolvedValue({});

    await getRockOperaPerformances("hot-air-balloon", context);

    expect(findManyByShowIdsLight).toHaveBeenCalledWith(["show-1", "show-2"], {
      sort: [{ field: "date", direction: "asc" }],
    });
  });

  // SetlistService now overlays rockOperaPerformances on every returned
  // setlist (in findManyByShowIdsLight), so the loader just passes its result
  // through untouched. The loader itself no longer makes annotation
  // lookups — verified by mocking findManyByShowIdsLight with already-overlay'd
  // setlists and asserting they pass through verbatim.
  test("passes through rockOperaPerformances populated by SetlistService", async () => {
    findPerformanceShowIds.mockResolvedValue(["show-1", "show-2"]);
    const setlistsWithAnnotations = [
      {
        ...makeSetlist("show-1", "1998-12-31"),
        rockOperaPerformances: [
          {
            rockOpera: { slug: "hot-air-balloon", name: "The Hot Air Balloon", shortName: "HAB" },
            performanceNumber: 1,
            previousPerformance: null,
            nextPerformance: { date: "1999-01-24", slug: "1999-01-24-show", gap: 7 },
          },
        ],
      },
      {
        ...makeSetlist("show-2", "1999-01-24"),
        rockOperaPerformances: [
          {
            rockOpera: { slug: "hot-air-balloon", name: "The Hot Air Balloon", shortName: "HAB" },
            performanceNumber: 2,
            previousPerformance: { date: "1998-12-31", slug: "1998-12-31-show", gap: 7 },
            nextPerformance: null,
          },
        ],
      },
    ];
    findManyByShowIdsLight.mockResolvedValue(setlistsWithAnnotations);
    computeShowExternalSourcesFn.mockResolvedValue({});

    const result = await getRockOperaPerformances("hot-air-balloon", context);

    expect(result.performances).toHaveLength(2);
    expect(result.performances[0].rockOperaPerformances[0]).toMatchObject({ performanceNumber: 1 });
    expect(result.performances[1].rockOperaPerformances[0]).toMatchObject({ performanceNumber: 2 });
    // Loader doesn't make its own per-show annotation lookups now.
    expect(findPerformancesForShow).not.toHaveBeenCalled();
  });

  // Each performance's show is handed to computeShowExternalSources in
  // one batch so nugs / archive / youtube favicons resolve in a single
  // server-side pass — not one per row.
  test("computes external sources from every performance's show in one call", async () => {
    findPerformanceShowIds.mockResolvedValue(["show-1", "show-2"]);
    const setlists = [makeSetlist("show-1", "1998-12-31"), makeSetlist("show-2", "1999-01-24")];
    findManyByShowIdsLight.mockResolvedValue(setlists);
    findPerformancesForShow.mockResolvedValue([]);
    computeShowExternalSourcesFn.mockResolvedValue({ "show-1": {}, "show-2": {} });

    await getRockOperaPerformances("hot-air-balloon", context);

    expect(computeShowExternalSourcesFn).toHaveBeenCalledTimes(1);
    const passedShows = computeShowExternalSourcesFn.mock.calls[0][0] as Array<{ id: string }>;
    expect(passedShows.map((s) => s.id)).toEqual(["show-1", "show-2"]);
  });

  // SetlistList's per-show badges (attendance + rating) hydrate from the
  // React Query cache the loader seeds. Without this prefetch the
  // badges would flash empty on first render before the client query
  // resolves. Same pattern as /shows/top-rated.
  test("prefetches show user data keyed by every performance's show id", async () => {
    findPerformanceShowIds.mockResolvedValue(["show-1", "show-2"]);
    findManyByShowIdsLight.mockResolvedValue([
      makeSetlist("show-1", "1998-12-31"),
      makeSetlist("show-2", "1999-01-24"),
    ]);
    findPerformancesForShow.mockResolvedValue([]);
    computeShowExternalSourcesFn.mockResolvedValue({});

    await getRockOperaPerformances("hot-air-balloon", context);

    expect(prefetchQuery).toHaveBeenCalledTimes(1);
    const prefetchArgs = prefetchQuery.mock.calls[0][0] as { queryKey: unknown[]; queryFn: () => unknown };
    // showUserDataQueryKey embeds the show ids — assert they're present
    // so re-arranging the key shape doesn't silently drop the hydration.
    expect(JSON.stringify(prefetchArgs.queryKey)).toContain("show-1");
    expect(JSON.stringify(prefetchArgs.queryKey)).toContain("show-2");
  });

  // Re-rendering a cached page skips every DB / annotation / external
  // source call — only the prefetch runs (using the cached `performances`
  // show ids). Drives the cache invalidation contract: if you DIDN'T
  // bump the cache key, you don't pay for the inner work on hit.
  test("uses cached payload on subsequent calls (no inner queries fired)", async () => {
    const cachedPayload = {
      performances: [makeSetlist("show-1", "1998-12-31")],
      externalSources: { "show-1": {} },
    };
    cacheGetOrSet.mockResolvedValueOnce(cachedPayload);

    const result = await getRockOperaPerformances("hot-air-balloon", context);

    expect(findPerformanceShowIds).not.toHaveBeenCalled();
    expect(findManyByShowIdsLight).not.toHaveBeenCalled();
    expect(findPerformancesForShow).not.toHaveBeenCalled();
    expect(computeShowExternalSourcesFn).not.toHaveBeenCalled();
    expect(result.performances).toBe(cachedPayload.performances);
    // Prefetch still runs on cache hit so the React Query SSR seeding
    // works even when the heavy loader work was cached.
    expect(prefetchQuery).toHaveBeenCalledTimes(1);
  });

  // The dehydrated React Query state is always part of the payload so
  // the root HydrationBoundary can warm the cache before SetlistList
  // mounts. Drives the SSR-paint guarantee.
  test("includes a dehydrated React Query state in the returned payload", async () => {
    findPerformanceShowIds.mockResolvedValue([]);

    const result = await getRockOperaPerformances("hot-air-balloon", context);

    expect(result.dehydratedState).toBeDefined();
    expect(typeof result.dehydratedState).toBe("object");
    // dehydrate() returns { mutations, queries } — only check that the
    // shape exists so we don't couple to React Query internals.
    expect(result.dehydratedState as DehydratedState).toHaveProperty("queries");
  });
});
