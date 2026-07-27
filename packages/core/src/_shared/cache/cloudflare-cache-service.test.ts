import { afterEach, describe, expect, test, vi } from "vitest";
import { CloudflareCacheService } from "./cloudflare-cache-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() };

function makeService() {
  return new CloudflareCacheService(
    { zoneId: "zone-1", apiToken: "token-1", siteUrl: "https://discobiscuits.net" },
    logger as never,
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
