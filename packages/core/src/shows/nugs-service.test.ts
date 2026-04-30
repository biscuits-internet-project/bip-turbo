import { CacheKeys } from "@bip/domain";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { RedisService } from "../_shared/redis";
import { NUGS_ARTIST_IDS, NugsService } from "./nugs-service";

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

function makeCatalogResponse(
  entries: Array<{ containerID: number; artistName: string; performanceDateFormatted: string }>,
) {
  return {
    ok: true,
    json: async () => ({ Response: { containers: entries } }),
  } as unknown as Response;
}

// Canonical fixture: the user confirmed 12/28/2007 -> release 2189 for The Disco Biscuits.
const HAMMERSTEIN_2007 = {
  containerID: 2189,
  artistName: "The Disco Biscuits",
  performanceDateFormatted: "2007/12/28",
};
// Tractorbeam example the user shared: 3/20/2026 -> release 47100.
const OKEECHOBEE_2026 = {
  containerID: 47100,
  artistName: "Tractorbeam",
  performanceDateFormatted: "2026/03/20",
};

describe("NugsService.findReleasesForDate", () => {
  let redis: ReturnType<typeof makeRedisMock>;
  let service: NugsService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    redis = makeRedisMock();
    service = new NugsService(redis);
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // On a cold cache, the service should fetch both artists' catalogs from
  // api.nugs.net, index them by ISO date, and return the matching release
  // with a play.nugs.net/release/{id} URL. Uses real 12/28/2007 -> 2189
  // mapping confirmed against the live API.
  test("cache miss: fetches both artists and returns the matching Disco Biscuits release", async () => {
    fetchMock
      .mockResolvedValueOnce(makeCatalogResponse([HAMMERSTEIN_2007]))
      .mockResolvedValueOnce(makeCatalogResponse([]));

    const releases = await service.findReleasesForDate("2007-12-28");

    expect(releases).toEqual([{ artistName: "The Disco Biscuits", url: "https://play.nugs.net/release/2189" }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain(`artistID=${NUGS_ARTIST_IDS.discoBiscuits}`);
    expect(fetchMock.mock.calls[1][0]).toContain(`artistID=${NUGS_ARTIST_IDS.tractorbeam}`);
  });

  // Second call for any date must be served from Redis without re-fetching
  // the full catalogs. Validates the caching behavior that makes the
  // archive.org-style pattern viable for 1000+ entry catalogs.
  test("cache hit: does not re-fetch when catalogs are already cached", async () => {
    fetchMock
      .mockResolvedValueOnce(makeCatalogResponse([HAMMERSTEIN_2007]))
      .mockResolvedValueOnce(makeCatalogResponse([OKEECHOBEE_2026]));

    await service.findReleasesForDate("2007-12-28");
    fetchMock.mockClear();

    const releases = await service.findReleasesForDate("2026-03-20");

    expect(releases).toEqual([{ artistName: "Tractorbeam", url: "https://play.nugs.net/release/47100" }]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // Dates with no matching release in either catalog should return an empty
  // array so the UI can skip rendering a "Listen on nugs.net" link.
  test("returns empty array when no release matches the date", async () => {
    fetchMock
      .mockResolvedValueOnce(makeCatalogResponse([HAMMERSTEIN_2007]))
      .mockResolvedValueOnce(makeCatalogResponse([OKEECHOBEE_2026]));

    const releases = await service.findReleasesForDate("1999-04-09");

    expect(releases).toEqual([]);
  });

  // When a date has releases from BOTH Disco Biscuits and Tractorbeam (rare
  // but possible for dual-billed events), both should be returned so the UI
  // can render two links.
  test("returns both releases when the same date appears under both artists", async () => {
    const sharedDate = {
      containerID: 9999,
      artistName: "The Disco Biscuits",
      performanceDateFormatted: "2026/03/20",
    };
    fetchMock
      .mockResolvedValueOnce(makeCatalogResponse([sharedDate]))
      .mockResolvedValueOnce(makeCatalogResponse([OKEECHOBEE_2026]));

    const releases = await service.findReleasesForDate("2026-03-20");

    expect(releases).toHaveLength(2);
    expect(releases).toContainEqual({
      artistName: "The Disco Biscuits",
      url: "https://play.nugs.net/release/9999",
    });
    expect(releases).toContainEqual({
      artistName: "Tractorbeam",
      url: "https://play.nugs.net/release/47100",
    });
  });

  // If the external API throws or returns a non-ok response, the show page
  // must still render. The service should swallow the error, log it, and
  // return an empty array rather than propagating.
  test("returns empty array and does not crash when fetch throws", async () => {
    fetchMock.mockRejectedValue(new Error("nugs api unreachable"));

    const releases = await service.findReleasesForDate("2007-12-28");

    expect(releases).toEqual([]);
  });

  // A successful-but-empty fetch should NOT be cached. Otherwise a transient
  // backend glitch on the nugs side would lock the map to empty for 24h.
  test("does not cache an empty catalog result (retries next call)", async () => {
    fetchMock.mockResolvedValueOnce(makeCatalogResponse([])).mockResolvedValueOnce(makeCatalogResponse([]));
    await service.findReleasesForDate("2007-12-28");

    fetchMock
      .mockResolvedValueOnce(makeCatalogResponse([HAMMERSTEIN_2007]))
      .mockResolvedValueOnce(makeCatalogResponse([]));
    const releases = await service.findReleasesForDate("2007-12-28");

    expect(releases).toEqual([{ artistName: "The Disco Biscuits", url: "https://play.nugs.net/release/2189" }]);
  });

  // The catalog map is persisted under the same cache key the domain layer
  // exposes, with a 24-hour TTL so new releases show up without redeploys.
  test("persists catalog under CacheKeys.nugs.catalog with a 24h TTL", async () => {
    fetchMock
      .mockResolvedValueOnce(makeCatalogResponse([HAMMERSTEIN_2007]))
      .mockResolvedValueOnce(makeCatalogResponse([OKEECHOBEE_2026]));

    await service.findReleasesForDate("2007-12-28");

    const setCalls = (redis.set as ReturnType<typeof vi.fn>).mock.calls;
    const keys = setCalls.map((c) => c[0]);
    expect(keys).toContain(CacheKeys.nugs.catalog(NUGS_ARTIST_IDS.discoBiscuits));
    expect(keys).toContain(CacheKeys.nugs.catalog(NUGS_ARTIST_IDS.tractorbeam));
    for (const call of setCalls) {
      expect(call[2]).toEqual({ EX: 60 * 60 * 24 });
    }
  });
});
