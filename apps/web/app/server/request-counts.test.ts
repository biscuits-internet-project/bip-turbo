import { beforeEach, describe, expect, test } from "vitest";
import { drainRequestCounts, recordRequest } from "./request-counts";

beforeEach(() => {
  drainRequestCounts();
});

describe("recordRequest", () => {
  // The whole point: tell which routes actually took traffic between two memory
  // samples. Diagnosing the 2026-07 OOM meant inferring traffic from cache TTLs
  // because nothing recorded it.
  test("counts requests per route bucket", () => {
    recordRequest("/shows/year/2001", "");
    recordRequest("/shows/year/1999", "");
    recordRequest("/songs", "");

    expect(drainRequestCounts()).toEqual({ "shows/year": 2, songs: 1 });
  });

  // Filter permutations are the crawler-shaped traffic that multiplies origin
  // hits, so a bare hit and a query-carrying hit have to be distinguishable.
  test("separates requests carrying a query string", () => {
    recordRequest("/shows/year/2001", "");
    recordRequest("/shows/year/2001", "?photos=yes");

    expect(drainRequestCounts()).toEqual({ "shows/year": 1, "shows/year?": 1 });
  });

  // Detail routes carry a slug; bucketing by pattern keeps user-visible
  // identifiers out of a world-readable run log and keeps the key set bounded.
  test("buckets detail routes without recording the slug", () => {
    recordRequest("/musicians/allen-aucoin", "");
    recordRequest("/musicians/aron-magner", "");

    const counts = drainRequestCounts();
    expect(counts).toEqual({ "musicians/detail": 2 });
    expect(JSON.stringify(counts)).not.toContain("magner");
  });

  // A crawler hitting unbounded distinct paths must not grow the counter map,
  // or the thing measuring the leak becomes one.
  test("collapses unrecognized paths into a single bucket", () => {
    for (let i = 0; i < 500; i++) recordRequest(`/nope/${i}`, "");

    expect(drainRequestCounts()).toEqual({ other: 500 });
  });

  // Whether a crawler was walking filter permutations was the central unknown
  // of the 2026-07 investigation, and it was never resolved because nothing
  // recorded it. The bot total is counted alongside the route bucket, not
  // instead of it, so one request contributes to both.
  test("counts bot requests alongside their route bucket", () => {
    recordRequest("/shows/year/2001", "?photos=yes", true);
    recordRequest("/shows/year/2001", "", false);

    expect(drainRequestCounts()).toEqual({ "shows/year?": 1, "shows/year": 1, bot: 1 });
  });

  test("distinguishes the stats table from the year listing", () => {
    recordRequest("/shows/stats", "?timeRange=2001");
    recordRequest("/shows/year/2001", "");

    expect(drainRequestCounts()).toEqual({ "shows/stats?": 1, "shows/year": 1 });
  });
});

describe("drainRequestCounts", () => {
  // Counts are per-interval, so each memory line describes the traffic since
  // the previous one rather than since boot.
  test("resets counts so each drain covers only the latest window", () => {
    recordRequest("/songs", "");
    drainRequestCounts();

    expect(drainRequestCounts()).toEqual({});
  });
});
