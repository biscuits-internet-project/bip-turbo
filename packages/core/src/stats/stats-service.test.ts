import { describe, expect, test, vi } from "vitest";
import type { CacheService } from "../_shared/cache";
import { StatsService, songStatsChanged } from "./stats-service";

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

// Behavior of the sorted-string binary-search counters lives in
// packages/domain/src/sorted-dates.test.ts now that the primitives moved
// to @bip/domain. No behavior to retest at this layer.

/**
 * Build a StatsService wrapping a vitest-mocked `$queryRaw` and a
 * pass-through cache that always invokes the producer. Tests can read
 * `queryRaw.mock.calls[0]` to assert on the SQL the service issued or
 * pre-seed `mockResolvedValue` to drive the row-shape branches.
 */
function makeStubbedService(rows: unknown[] = []) {
  const queryRaw = vi.fn().mockResolvedValue(rows);
  const db = { $queryRaw: queryRaw } as unknown as ConstructorParameters<typeof StatsService>[0];
  const cache = {
    getOrSet: async <T>(_key: unknown, producer: () => Promise<T>) => producer(),
  } as unknown as CacheService;
  return { service: new StatsService(db, cache), queryRaw };
}

// Both getShowsByYear and getStatsShowDates feed denominators for rarity
// stats — % since debut, shows since last played. Prod's per-date "stub"
// rows (bare YYYY-MM-DD slug, no venue, no tracks) sit alongside the real
// shows and inflate those denominators by one for each stub. The fix is in
// the SQL: every show-counting predicate must add `venue_id IS NOT NULL`
// so the rarity math only counts real shows.
describe("StatsService stub filtering in raw SQL", () => {
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

  // The catalog play-dates blob backs the gap-chart "Played Before" column.
  // Stubs would over-count a song's prior plays for any show after the stub
  // date, so the same filter must be applied here too.
  test("getSongPlayDates's SQL excludes orphan stub shows (venue_id IS NOT NULL)", async () => {
    const { service, queryRaw } = makeStubbedService();
    await service.getSongPlayDates();
    expect(queryRaw).toHaveBeenCalledTimes(1);
    expect(joinSqlFromCall(queryRaw.mock.calls[0])).toContain("venue_id IS NOT NULL");
  });
});

describe("StatsService.getSongPlayDates", () => {
  // Groups raw `{song_id, date}` rows into `{songId: [date, date, ...]}`.
  // Per-song arrays must come out sorted ascending so clients can binary-
  // search for "strictly before" without re-sorting.
  test("groups rows by songId and preserves ascending order per song", async () => {
    const { service } = makeStubbedService([
      { song_id: "song-A", d: "2010-01-01" },
      { song_id: "song-B", d: "2010-02-01" },
      { song_id: "song-A", d: "2012-06-15" },
      { song_id: "song-A", d: "2015-03-20" },
      { song_id: "song-B", d: "2018-08-08" },
    ]);
    expect(await service.getSongPlayDates()).toEqual({
      "song-A": ["2010-01-01", "2012-06-15", "2015-03-20"],
      "song-B": ["2010-02-01", "2018-08-08"],
    });
  });

  test("returns an empty object when there are no plays", async () => {
    const { service } = makeStubbedService();
    expect(await service.getSongPlayDates()).toEqual({});
  });
});
