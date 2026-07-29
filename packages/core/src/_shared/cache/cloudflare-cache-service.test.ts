import { afterEach, describe, expect, test, vi } from "vitest";
import { CloudflareCacheService } from "./cloudflare-cache-service";
import type { ServedUrlRegistry } from "./served-url-registry";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };

/** A registry that reports the given paths for every year. */
function stubRegistry(pathsByScope: Record<string, string[]> = {}) {
  return { servedPaths: vi.fn(async (scope: string) => pathsByScope[scope] ?? []) } as unknown as ServedUrlRegistry;
}

function makeService(registry: ServedUrlRegistry = stubRegistry()) {
  return new CloudflareCacheService(
    { zoneId: "zone-1", apiToken: "token-1", siteUrl: "https://discobiscuits.net" },
    logger as never,
    registry,
  );
}

/** Stub `fetch` with a successful Cloudflare purge response. */
function stubFetch() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ success: true }),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

/** The `files` array each purge call posted, one entry per call. */
function purgedFileBatches(fetchMock: ReturnType<typeof stubFetch>): string[][] {
  return fetchMock.mock.calls.map((call) => JSON.parse(call[1].body).files);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("CloudflareCacheService.purgeYearListings", () => {
  // The zone is not Enterprise, so purge-by-tag is unavailable and the API
  // silently no-ops. Purge-by-URL works on every plan but matches the exact
  // cache key, which is why both the document URL and the single-fetch
  // `.data` twin have to be named. They are separate edge entries: a client
  // navigation to the year page reads `.data`, never the document.
  test("purges both the document and the .data URL for each year", async () => {
    const fetchMock = stubFetch();

    await makeService().purgeYearListings([2018, 2024]);

    expect(purgedFileBatches(fetchMock)).toEqual([
      [
        "https://discobiscuits.net/shows/year/2018",
        "https://discobiscuits.net/shows/year/2018.data",
        "https://discobiscuits.net/shows/year/2024",
        "https://discobiscuits.net/shows/year/2024.data",
      ],
    ]);
  });

  // The filter variants only became cacheable for a day because the origin
  // records what it served. Purging has to name each one, or the day-long TTL
  // is exactly the staleness the short TTL used to prevent.
  test("purges every recorded variant alongside the bare URL", async () => {
    const fetchMock = stubFetch();
    const registry = stubRegistry({
      "year:2001": ["/shows/year/2001", "/shows/year/2001?photos=yes", "/shows/year/2001?nugs=no&photos=yes"],
    });

    await makeService(registry).purgeYearListings([2001]);

    expect(purgedFileBatches(fetchMock)[0]).toEqual([
      "https://discobiscuits.net/shows/year/2001",
      "https://discobiscuits.net/shows/year/2001.data",
      "https://discobiscuits.net/shows/year/2001?photos=yes",
      "https://discobiscuits.net/shows/year/2001.data?photos=yes",
      "https://discobiscuits.net/shows/year/2001?nugs=no&photos=yes",
      "https://discobiscuits.net/shows/year/2001.data?nugs=no&photos=yes",
    ]);
  });

  // React Router's single-fetch URL suffixes the *pathname*, so the query
  // string stays on the end. Appending `.data` to the whole string would
  // produce `?photos=yes.data`, which matches no cache key and purges nothing.
  test("suffixes the pathname, not the query string, on the .data twin", async () => {
    const fetchMock = stubFetch();
    const registry = stubRegistry({ "year:2001": ["/shows/year/2001?photos=yes"] });

    await makeService(registry).purgeYearListings([2001]);

    expect(purgedFileBatches(fetchMock).flat()).toContain("https://discobiscuits.net/shows/year/2001.data?photos=yes");
  });

  // The bare URL is purgeable whether or not anything was recorded, so a cold
  // Redis or a capped-out year still evicts the listing everyone lands on.
  test("purges the bare URL when the registry is empty", async () => {
    const fetchMock = stubFetch();

    await makeService(stubRegistry({})).purgeYearListings([2001]);

    expect(purgedFileBatches(fetchMock)[0]).toEqual([
      "https://discobiscuits.net/shows/year/2001",
      "https://discobiscuits.net/shows/year/2001.data",
    ]);
  });

  // The registry records the bare URL too, so without dedup every purge would
  // name it twice and waste two of the 30 slots per call.
  test("names each URL once when the registry repeats the bare path", async () => {
    const fetchMock = stubFetch();
    const registry = stubRegistry({ "year:2001": ["/shows/year/2001"] });

    await makeService(registry).purgeYearListings([2001]);

    expect(purgedFileBatches(fetchMock)[0]).toEqual([
      "https://discobiscuits.net/shows/year/2001",
      "https://discobiscuits.net/shows/year/2001.data",
    ]);
  });

  test("authenticates against the configured zone", async () => {
    const fetchMock = stubFetch();

    await makeService().purgeYearListings([2018]);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.cloudflare.com/client/v4/zones/zone-1/purge_cache");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer token-1");
  });

  // Non-Enterprise plans cap a single purge call at 30 URLs and reject the
  // whole request when it holds more, so a bulk invalidation spanning many
  // years has to be split rather than silently dropping the overflow.
  test("splits into batches of 30 URLs", async () => {
    const fetchMock = stubFetch();
    const years = Array.from({ length: 20 }, (_, index) => 2000 + index);

    await makeService().purgeYearListings(years);

    const batches = purgedFileBatches(fetchMock);
    expect(batches.map((batch) => batch.length)).toEqual([30, 10]);
    expect(batches.flat()).toHaveLength(40);
    expect(batches.flat()).toContain("https://discobiscuits.net/shows/year/2019.data");
  });

  // A trailing slash on BASE_URL would build `//shows/year/2018`, which matches
  // no cache key. Cloudflare accepts it and reports success, so the purge would
  // go on quietly doing nothing — the same silent failure mode purge-by-URL
  // replaced.
  test("tolerates a trailing slash on the configured site URL", async () => {
    const fetchMock = stubFetch();
    const service = new CloudflareCacheService(
      { zoneId: "zone-1", apiToken: "token-1", siteUrl: "https://discobiscuits.net/" },
      logger as never,
      stubRegistry(),
    );

    await service.purgeYearListings([2018]);

    expect(purgedFileBatches(fetchMock)[0]).toEqual([
      "https://discobiscuits.net/shows/year/2018",
      "https://discobiscuits.net/shows/year/2018.data",
    ]);
  });

  // No years means no edge entry to evict. A silent fallback to the current
  // year would hide caller bugs, and an empty `files` array is a 400.
  test("makes no API call when there are no years", async () => {
    const fetchMock = stubFetch();

    await makeService().purgeYearListings([]);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  // A purge failure must never break the mutation that triggered it. The
  // Redis layer has already been wiped and the edge entry expires on its own.
  test("swallows and logs a failed purge", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    await expect(makeService().purgeYearListings([2018])).resolves.toBeUndefined();
    expect(logger.error).toHaveBeenCalled();
  });

  // Cloudflare answers 200 with `success: false` for auth and plan errors, so
  // an ok status alone does not mean the purge happened.
  test("logs an error when Cloudflare reports failure in a 200 response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false, errors: [{ message: "Invalid zone" }] }),
      }),
    );

    await makeService().purgeYearListings([2018]);

    expect(logger.error).toHaveBeenCalledWith("Cloudflare cache purge failed", { error: "Invalid zone" });
  });
});

describe("CloudflareCacheService.purgeShowsStats", () => {
  // The stats table renders from the whole catalog, so any show mutation
  // stales every spelling of it, not just one year's. Production request logs
  // showed 100% of its traffic carrying a query string, so purging only the
  // bare URL would leave every URL a real visitor actually lands on stale.
  test("purges the bare table and every recorded variant", async () => {
    const fetchMock = stubFetch();
    const registry = stubRegistry({
      "shows-stats": ["/shows/stats", "/shows/stats?timeRange=2001", "/shows/stats?nugs=yes&timeRange=2011"],
    });

    await makeService(registry).purgeShowsStats();

    expect(purgedFileBatches(fetchMock)[0]).toEqual([
      "https://discobiscuits.net/shows/stats",
      "https://discobiscuits.net/shows/stats.data",
      "https://discobiscuits.net/shows/stats?timeRange=2001",
      "https://discobiscuits.net/shows/stats.data?timeRange=2001",
      "https://discobiscuits.net/shows/stats?nugs=yes&timeRange=2011",
      "https://discobiscuits.net/shows/stats.data?nugs=yes&timeRange=2011",
    ]);
  });

  // Cold Redis or a capped-out scope still has to evict the URL everyone lands
  // on, the same guarantee the year listings get.
  test("purges the bare table when the registry is empty", async () => {
    const fetchMock = stubFetch();

    await makeService().purgeShowsStats();

    expect(purgedFileBatches(fetchMock)[0]).toEqual([
      "https://discobiscuits.net/shows/stats",
      "https://discobiscuits.net/shows/stats.data",
    ]);
  });

  // The stats scope is global, so a year scope's paths must never leak into it
  // (and vice versa) — that would purge URLs that were never served and waste
  // slots against Cloudflare's 30-per-call cap.
  test("reads only the stats scope", async () => {
    const fetchMock = stubFetch();
    const registry = stubRegistry({ "year:2001": ["/shows/year/2001?photos=yes"] });

    await makeService(registry).purgeShowsStats();

    expect(purgedFileBatches(fetchMock).flat()).not.toContain("https://discobiscuits.net/shows/year/2001?photos=yes");
  });
});
