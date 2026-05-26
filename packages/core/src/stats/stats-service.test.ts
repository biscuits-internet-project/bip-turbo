import { describe, expect, test, vi } from "vitest";
import type { CacheService } from "../_shared/cache";
import {
  countShowsAfter,
  countShowsBetween,
  countShowsOnOrAfter,
  StatsService,
  songStatsChanged,
} from "./stats-service";

const baseFresh = {
  timesPlayed: 3,
  dateFirstPlayed: new Date("2010-01-01"),
  dateLastPlayed: new Date("2012-06-15"),
  yearlyPlayData: { "2010": 1, "2011": 1, "2012": 1 },
};

describe("songStatsChanged", () => {
  // Identical values must not trigger a write — this is the whole reason
  // diff-before-write exists.
  test("returns false when current row exactly matches the freshly-computed aggregate", () => {
    const current = {
      timesPlayed: 3,
      dateFirstPlayed: new Date("2010-01-01"),
      dateLastPlayed: new Date("2012-06-15"),
      yearlyPlayData: { "2010": 1, "2011": 1, "2012": 1 },
    };
    expect(songStatsChanged(current, baseFresh)).toBe(false);
  });

  // Counter changed → must write. The cheapest possible diff hit.
  test("returns true when timesPlayed changed", () => {
    const current = { ...baseFresh, timesPlayed: 2 };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });

  // Date objects with the same wall-clock value must compare equal — we
  // diff via getTime(), not reference equality, so two `new Date(...)`
  // calls for the same date don't spuriously trigger a write.
  test("returns false for distinct Date instances representing the same moment", () => {
    const current = {
      timesPlayed: 3,
      dateFirstPlayed: new Date("2010-01-01"),
      dateLastPlayed: new Date("2012-06-15"),
      yearlyPlayData: { "2010": 1, "2011": 1, "2012": 1 },
    };
    expect(songStatsChanged(current, baseFresh)).toBe(false);
  });

  // Date moved → must write. Latest play could shift earlier (delete) or
  // later (new performance).
  test("returns true when dateLastPlayed shifted", () => {
    const current = { ...baseFresh, dateLastPlayed: new Date("2012-06-14") };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });

  // Null ↔ Date transitions: a song going from never-played to debut, or
  // having every track removed.
  test("returns true when one date is null and the other is set", () => {
    const current = { ...baseFresh, dateFirstPlayed: null };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });

  test("returns false when both dates are null", () => {
    const empty = {
      timesPlayed: 0,
      dateFirstPlayed: null,
      dateLastPlayed: null,
      yearlyPlayData: {},
    };
    expect(songStatsChanged(empty, empty)).toBe(false);
  });

  // jsonb doesn't preserve insertion order on round-trip, so the comparator
  // must normalize before comparing — otherwise every song would diff dirty
  // forever and we'd write every row on every rebuild.
  test("returns false when yearlyPlayData differs only by key order", () => {
    const current = {
      ...baseFresh,
      yearlyPlayData: { "2012": 1, "2010": 1, "2011": 1 },
    };
    expect(songStatsChanged(current, baseFresh)).toBe(false);
  });

  // A real change in the year buckets — a play moved from one year to
  // another, or a count changed.
  test("returns true when a yearlyPlayData count differs", () => {
    const current = {
      ...baseFresh,
      yearlyPlayData: { "2010": 1, "2011": 2, "2012": 1 },
    };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });

  // Adding or removing a year bucket entirely.
  test("returns true when yearlyPlayData has a different set of years", () => {
    const current = {
      ...baseFresh,
      yearlyPlayData: { "2010": 1, "2011": 1 },
    };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });

  // Prisma's JsonValue can be null for a column that was never set.
  // Guard against treating `null` as an empty object accidentally — a
  // null vs `{}` is an actual change worth writing.
  test("returns true when current yearlyPlayData is null and fresh has data", () => {
    const current = { ...baseFresh, yearlyPlayData: null as unknown };
    expect(songStatsChanged(current, baseFresh)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// countShowsAfter — pure binary-search count of dates strictly after a target
// ---------------------------------------------------------------------------

describe("countShowsAfter", () => {
  // Drives the songs-list Gap to Now column (number of stats-eligible shows
  // since a song's dateLastPlayed) and the song-detail page's "X shows ago"
  // sublabel. Backed by a single cached date array so the binary search
  // runs in O(log n) per song.

  // Empty catalogue → no shows after any date.
  test("returns 0 for empty input regardless of target", () => {
    expect(countShowsAfter([], "2024-01-01")).toBe(0);
  });

  // Target older than every show → every show counts as "after".
  test("returns full length when target precedes all dates", () => {
    expect(countShowsAfter(["2010-01-01", "2015-06-15", "2020-12-31"], "2000-01-01")).toBe(3);
  });

  // Target equal to a date → strictly-greater semantics excludes the match
  // itself. Matches the song-detail composer's existing SQL (`> date`, not
  // `>=`), so a song played on the most recent show reads "0 shows ago".
  test("strictly-greater: target equal to a date does not count that date", () => {
    expect(countShowsAfter(["2020-01-01", "2021-01-01", "2022-01-01"], "2021-01-01")).toBe(1);
  });

  // Target equal to multiple repeated dates → still strictly greater, so
  // all repeated entries are excluded.
  test("strictly-greater with duplicates: all matching entries are excluded", () => {
    expect(countShowsAfter(["2020-01-01", "2020-01-01", "2021-01-01"], "2020-01-01")).toBe(1);
  });

  // Target later than the latest date → no shows after.
  test("returns 0 when target follows every date", () => {
    expect(countShowsAfter(["2010-01-01", "2015-06-15", "2020-12-31"], "2025-01-01")).toBe(0);
  });

  // Target between two dates → counts everything strictly greater.
  test("counts dates strictly greater than a target falling between two entries", () => {
    expect(countShowsAfter(["2010-01-01", "2015-06-15", "2020-12-31", "2024-07-04"], "2018-01-01")).toBe(2);
  });

  // Large array sanity — binary search handles 480 entries (40 years × 12
  // months) without churn, and the result still matches the linear answer.
  test("matches a linear scan on a 480-element array", () => {
    const dates: string[] = [];
    for (let year = 1990; year < 2030; year++) {
      for (let month = 1; month <= 12; month++) {
        dates.push(`${year}-${String(month).padStart(2, "0")}-15`);
      }
    }
    dates.sort();
    const target = "2010-06-15";
    const binary = countShowsAfter(dates, target);
    const linear = dates.filter((d) => d > target).length;
    expect(binary).toBe(linear);
  });
});

// ---------------------------------------------------------------------------
// countShowsOnOrAfter — inclusive variant for the filtered-debut denominator
// ---------------------------------------------------------------------------

describe("countShowsOnOrAfter", () => {
  // Drives Filtered Since Debut / Filtered Avg Gap on /songs: the denominator
  // is "matching-universe shows from the song's first filtered play onward",
  // which must include the debut show itself — so this is `>=`, not `>`.

  // Empty catalogue → nothing on or after anything.
  test("returns 0 for empty input regardless of target", () => {
    expect(countShowsOnOrAfter([], "2024-01-01")).toBe(0);
  });

  // Target before every date → every entry counts.
  test("returns full length when target precedes all dates", () => {
    expect(countShowsOnOrAfter(["2010-01-01", "2015-06-15", "2020-12-31"], "2000-01-01")).toBe(3);
  });

  // Target equal to a date → that date counts (this is the on-or-after
  // variant). Distinguishes this helper from `countShowsAfter`.
  test("inclusive: target equal to a date includes that date", () => {
    expect(countShowsOnOrAfter(["2020-01-01", "2021-01-01", "2022-01-01"], "2021-01-01")).toBe(2);
  });

  // Target later than the latest date → nothing remains.
  test("returns 0 when target follows every date", () => {
    expect(countShowsOnOrAfter(["2010-01-01", "2015-06-15"], "2030-01-01")).toBe(0);
  });
});

describe("countShowsBetween", () => {
  // Drives the mean-closed-gap numerator for filteredAverageGapShows:
  // matching-universe shows strictly between the first and last filtered
  // plays. Both endpoints are exclusive — the play dates themselves are
  // performances, not gaps.

  // Empty array short-circuits regardless of bounds.
  test("returns 0 for empty input", () => {
    expect(countShowsBetween([], "2024-01-01", "2024-12-31")).toBe(0);
  });

  // Strict between: dates equal to either endpoint are excluded.
  test("excludes both endpoints", () => {
    const dates = ["2024-01-01", "2024-02-01", "2024-03-01", "2024-04-01", "2024-05-01"];
    expect(countShowsBetween(dates, "2024-01-01", "2024-05-01")).toBe(3);
  });

  // No shows fall in a degenerate or inverted interval — never negative.
  test("returns 0 when low >= high", () => {
    const dates = ["2024-01-01", "2024-02-01", "2024-03-01"];
    expect(countShowsBetween(dates, "2024-03-01", "2024-01-01")).toBe(0);
    expect(countShowsBetween(dates, "2024-02-01", "2024-02-01")).toBe(0);
  });

  // Bounds outside the array range count nothing past the endpoints.
  test("returns 0 when no dates fall in range", () => {
    const dates = ["2024-01-01", "2024-02-01"];
    expect(countShowsBetween(dates, "2025-01-01", "2025-12-31")).toBe(0);
  });
});

// Both getShowsByYear and getStatsShowDates feed denominators for rarity
// stats — % since debut, shows since last played. Prod's per-date "stub"
// rows (bare YYYY-MM-DD slug, no venue, no tracks) sit alongside the real
// shows and inflate those denominators by one for each stub. The fix is in
// the SQL: every show-counting predicate must add `venue_id IS NOT NULL`
// so the rarity math only counts real shows.
describe("StatsService stub filtering in raw SQL", () => {
  function makeStubbedService() {
    const queryRaw = vi.fn().mockResolvedValue([]);
    const db = { $queryRaw: queryRaw } as unknown as ConstructorParameters<typeof StatsService>[0];
    // Cache: pass through to the producer so we can intercept the SQL it issues.
    const cache = {
      getOrSet: async <T>(_key: unknown, producer: () => Promise<T>) => producer(),
    } as unknown as CacheService;
    return { service: new StatsService(db, cache), queryRaw };
  }

  // `$queryRaw` is called as a tag template. Prisma passes the cooked
  // template-string chunks as the first arg and every interpolated
  // `Prisma.Sql` fragment as the rest. Concatenate both so the assertion
  // can `.toContain()` the stub predicate from `nonStubShowsSql`.
  function joinSqlFromCall(call: unknown[]): string {
    const chunks = (call[0] as readonly string[]).join("?");
    const fragments = call
      .slice(1)
      .map((arg) => (arg as { sql: string }).sql)
      .join(" ");
    return `${chunks} ${fragments}`;
  }

  test("getShowsByYear's SQL excludes orphan stub shows (venue_id IS NOT NULL)", async () => {
    const { service, queryRaw } = makeStubbedService();
    await service.getShowsByYear();
    expect(queryRaw).toHaveBeenCalledTimes(1);
    expect(joinSqlFromCall(queryRaw.mock.calls[0])).toContain("venue_id IS NOT NULL");
  });

  test("getStatsShowDates's SQL excludes orphan stub shows (venue_id IS NOT NULL)", async () => {
    const { service, queryRaw } = makeStubbedService();
    await service.getStatsShowDates();
    expect(queryRaw).toHaveBeenCalledTimes(1);
    expect(joinSqlFromCall(queryRaw.mock.calls[0])).toContain("venue_id IS NOT NULL");
  });
});
