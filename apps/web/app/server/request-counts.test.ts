import { beforeEach, describe, expect, test } from "vitest";
import {
  drainRequestCounts,
  MAX_TRACKED_PARAM_NAMES,
  recordCachePolicy,
  recordRequest,
  recordUnrecognizedParams,
} from "./request-counts";

describe("recordUnrecognizedParams", () => {
  // Production shows 30-50% of /shows/stats hits falling to the short TTL,
  // meaning the crawler sends params the route's own controls never emit.
  // Widening the recognized list needs their names, and nothing records them.
  test("counts the param names that cost a request its long TTL", () => {
    recordUnrecognizedParams("shows/stats", ["fbclid", "ref"]);
    recordUnrecognizedParams("shows/stats", ["fbclid"]);

    expect(drainRequestCounts()).toEqual({
      "shows/stats:param:fbclid": 2,
      "shows/stats:param:ref": 1,
    });
  });

  // Names, never values: a value can carry anything a visitor typed, and these
  // lines are printed into world-readable run logs by ops.yml.
  test("records only names", () => {
    recordUnrecognizedParams("shows/stats", ["q"]);

    expect(JSON.stringify(drainRequestCounts())).not.toContain("wetlands");
  });

  // A crawler can invent unbounded distinct param names, so the map that exists
  // to diagnose a memory problem must not grow without limit. Past the cap the
  // rest collapse into one overflow bucket.
  test("caps the distinct names tracked", () => {
    const names = Array.from({ length: MAX_TRACKED_PARAM_NAMES + 25 }, (_, index) => `p${index}`);
    recordUnrecognizedParams("shows/stats", names);

    const counts = drainRequestCounts();
    expect(Object.keys(counts).length).toBeLessThanOrEqual(MAX_TRACKED_PARAM_NAMES + 1);
    expect(counts["shows/stats:param:overflow"]).toBe(25);
  });
});

describe("recordCachePolicy", () => {
  // A listing only earns its day-long edge TTL when a purge can name the URL.
  // Whether that actually applies to real crawler traffic was inferred, never
  // measured: production shows heavy query-carrying traffic on both listings,
  // and this is the field that says whether those hits got the long policy or
  // fell through to the short self-healing one.
  test("splits a route by whether the response was purgeable", () => {
    recordCachePolicy("shows/year", true);
    recordCachePolicy("shows/year", true);
    recordCachePolicy("shows/year", false);

    expect(drainRequestCounts()).toEqual({ "shows/year:long": 2, "shows/year:short": 1 });
  });

  // Counted alongside the route buckets on the same line, so one interval's
  // policy mix can be read against that interval's RSS delta.
  test("coexists with the route buckets", () => {
    recordRequest("/shows/stats", "?timeRange=2001");
    recordCachePolicy("shows/stats", false);

    expect(drainRequestCounts()).toEqual({ "shows/stats?": 1, "shows/stats:short": 1 });
  });
});

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
