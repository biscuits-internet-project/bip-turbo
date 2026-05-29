import { CacheKeys } from "@bip/domain";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { RedisService } from "../_shared/redis";
import { RELISTEN_ARTIST_SLUG, RelistenService } from "./relisten-service";

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

interface YearShow {
  display_date: string;
  source_count: number;
}

/**
 * Drives the mock the way the real fetcher hits the API: one request to the
 * `/years` list, then one request per year. Switches on the URL (not call
 * order) because the per-year requests fire concurrently. Years named in
 * `failYears` respond non-ok so tests can exercise partial-failure handling.
 */
function makeFetchByUrl(yearsToShows: Record<string, YearShow[]>, failYears: string[] = []) {
  return vi.fn(async (input: string | URL): Promise<Response> => {
    const url = input.toString();
    const yearMatch = url.match(/\/years\/(\d{4})$/);
    if (yearMatch) {
      const year = yearMatch[1];
      if (failYears.includes(year)) {
        return { ok: false, status: 500 } as unknown as Response;
      }
      return {
        ok: true,
        json: async () => ({ shows: yearsToShows[year] ?? [] }),
      } as unknown as Response;
    }
    if (url.endsWith("/years")) {
      return {
        ok: true,
        json: async () => Object.keys(yearsToShows).map((year) => ({ year })),
      } as unknown as Response;
    }
    throw new Error(`unexpected fetch: ${url}`);
  });
}

const CATALOG = {
  "1998": [
    { display_date: "1998-04-17", source_count: 2 },
    { display_date: "1998-12-31", source_count: 1 },
  ],
  "2017": [{ display_date: "2017-04-21", source_count: 3 }],
};

describe("RelistenService", () => {
  let redis: ReturnType<typeof makeRedisMock>;
  let service: RelistenService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    redis = makeRedisMock();
    service = new RelistenService(redis);
    fetchMock = makeFetchByUrl(CATALOG);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Cold cache: fetch the years list, then each year, index by ISO date, and
  // return a relisten.net/{slug}/YYYY/MM/DD link derived from display_date.
  test("cache miss: fetches years then each year and returns the date's relisten.net URL", async () => {
    const url = await service.findUrlForDate("1998-04-17");

    expect(url).toBe(`https://relisten.net/${RELISTEN_ARTIST_SLUG}/1998/04/17`);
    expect(fetchMock.mock.calls[0][0]).toContain(`/artists/${RELISTEN_ARTIST_SLUG}/years`);
  });

  // Second lookup for any date must come from Redis with no re-fetch.
  test("cache hit: does not re-fetch when the catalog is already cached", async () => {
    await service.findUrlForDate("1998-04-17");
    fetchMock.mockClear();

    const url = await service.findUrlForDate("2017-04-21");

    expect(url).toBe(`https://relisten.net/${RELISTEN_ARTIST_SLUG}/2017/04/21`);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // Dates Relisten doesn't have return undefined so the UI skips the link.
  test("returns undefined when no show matches the date", async () => {
    expect(await service.findUrlForDate("1999-04-09")).toBeUndefined();
  });

  // Shows with no streamable sources must not produce a (dead) link.
  test("skips shows with a falsy source_count", async () => {
    fetchMock = makeFetchByUrl({ "2020": [{ display_date: "2020-01-01", source_count: 0 }] });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    service = new RelistenService(redis);

    expect(await service.findUrlForDate("2020-01-01")).toBeUndefined();
  });

  // External downtime must not break the show page.
  test("returns undefined and does not crash when fetch throws", async () => {
    fetchMock = vi.fn(async () => {
      throw new Error("relisten api unreachable");
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    service = new RelistenService(redis);

    expect(await service.findUrlForDate("1998-04-17")).toBeUndefined();
  });

  // One bad year must not wipe the whole catalog — the years that loaded
  // still produce links. Relisten fires ~30 concurrent year requests on a
  // cold cache, so a single rate-limited/flaky year is the likely failure,
  // and an all-or-nothing fetch would make every Relisten link vanish.
  test("keeps shows from years that loaded when one year request fails", async () => {
    fetchMock = makeFetchByUrl(CATALOG, ["2017"]);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    service = new RelistenService(redis);

    expect(await service.findUrlForDate("1998-04-17")).toBe(`https://relisten.net/${RELISTEN_ARTIST_SLUG}/1998/04/17`);
    expect(await service.findUrlForDate("2017-04-21")).toBeUndefined();
  });

  // A transient empty result must not be cached, or a glitch locks the map
  // empty for the full TTL.
  test("does not cache an empty catalog result (retries next call)", async () => {
    fetchMock = makeFetchByUrl({});
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    service = new RelistenService(redis);
    await service.findUrlForDate("1998-04-17");

    fetchMock = makeFetchByUrl(CATALOG);
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const url = await service.findUrlForDate("1998-04-17");

    expect(url).toBe(`https://relisten.net/${RELISTEN_ARTIST_SLUG}/1998/04/17`);
  });

  // getUrlsByDate returns the full date->URL map for listing-page badges.
  test("getUrlsByDate returns every show date mapped to its relisten.net URL", async () => {
    const map = await service.getUrlsByDate();

    expect(map).toEqual({
      "1998-04-17": `https://relisten.net/${RELISTEN_ARTIST_SLUG}/1998/04/17`,
      "1998-12-31": `https://relisten.net/${RELISTEN_ARTIST_SLUG}/1998/12/31`,
      "2017-04-21": `https://relisten.net/${RELISTEN_ARTIST_SLUG}/2017/04/21`,
    });
  });

  // Persist under the domain cache key with the shared 24h catalog TTL.
  test("persists catalog under CacheKeys.relisten.catalog with a 24h TTL", async () => {
    await service.findUrlForDate("1998-04-17");

    const setCalls = (redis.set as ReturnType<typeof vi.fn>).mock.calls;
    const keys = setCalls.map((c) => c[0]);
    expect(keys).toContain(CacheKeys.relisten.catalog());
    for (const call of setCalls) {
      expect(call[2]).toEqual({ EX: 60 * 60 * 24 });
    }
  });
});
