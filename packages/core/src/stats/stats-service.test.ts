import { describe, expect, test, vi } from "vitest";
import type { CacheService } from "../_shared/cache";
import type { RecurrenceTrackForWalk } from "../_shared/track-gap";
import { computeRecurrenceForSong, StatsService, songStatsChanged } from "./stats-service";

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

describe("computeRecurrenceForSong", () => {
  const statsShows = ["2003-01-01", "2003-01-05", "2003-01-10", "2003-01-20", "2003-02-01"];

  function recurrenceTrack(
    opts: Partial<RecurrenceTrackForWalk> & Pick<RecurrenceTrackForWalk, "trackId" | "showId" | "showDate">,
  ): RecurrenceTrackForWalk {
    return {
      dayOrder: null,
      showCountForStats: true,
      set: "S1",
      position: 1,
      segue: null,
      seguedIn: false,
      flags: [],
      ...opts,
    };
  }

  // One dyslexic occurrence ⇒ a flag-recurrence row keyed by (track, flag) with
  // null gap/prev. No segue rows for kinds the track never qualifies for... but
  // every standalone track qualifies for STANDALONE, so that row exists too.
  test("a single dyslexic standalone track yields first-time flag + segue rows", () => {
    const tracks = [recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01", flags: ["DYSLEXIC"] })];
    const { flagRecurrences, segueRecurrences } = computeRecurrenceForSong(tracks, statsShows);

    expect(flagRecurrences).toEqual([
      { trackId: "a", flag: "DYSLEXIC", gap: null, versionGap: 0, previousShowId: null },
    ]);
    // A lone standalone track is first-of-each segue kind it qualifies for.
    expect(segueRecurrences).toEqual([
      { trackId: "a", kind: "STANDALONE", gap: null, versionGap: 0, previousShowId: null },
      { trackId: "a", kind: "NOT_SEGUED_IN", gap: null, versionGap: 0, previousShowId: null },
      { trackId: "a", kind: "NOT_SEGUED_OUT", gap: null, versionGap: 0, previousShowId: null },
    ]);
  });

  // Two dyslexic performances ⇒ the later carries the gap + prev show.
  test("two dyslexic performances: later track records gap and previous show", () => {
    const tracks = [
      recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01", flags: ["DYSLEXIC"] }),
      recurrenceTrack({ trackId: "b", showId: "B", showDate: "2003-01-20", flags: ["DYSLEXIC"] }),
    ];
    const { flagRecurrences } = computeRecurrenceForSong(tracks, statsShows);
    expect(flagRecurrences).toContainEqual({
      trackId: "a",
      flag: "DYSLEXIC",
      gap: null,
      versionGap: 0,
      previousShowId: null,
    });
    // Strictly between 01-01 and 01-20: 01-05, 01-10 → 2 shows. Versions: a and b
    // are consecutive dyslexic versions with nothing between → versionGap 0.
    expect(flagRecurrences).toContainEqual({
      trackId: "b",
      flag: "DYSLEXIC",
      gap: 2,
      versionGap: 0,
      previousShowId: "A",
    });
  });

  // A track that segues out qualifies only for NOT_SEGUED_IN (not standalone /
  // not-segued-out), so only that kind's row is emitted for it.
  test("a segued-out track only qualifies for NOT_SEGUED_IN", () => {
    const tracks = [recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01", segue: ">" })];
    const { segueRecurrences } = computeRecurrenceForSong(tracks, statsShows);
    expect(segueRecurrences).toEqual([
      { trackId: "a", kind: "NOT_SEGUED_IN", gap: null, versionGap: 0, previousShowId: null },
    ]);
  });

  // A segued-into track qualifies only for NOT_SEGUED_OUT (not standalone, not
  // not-segued-in), so only that kind's row is emitted for it.
  test("a segued-into track only qualifies for NOT_SEGUED_OUT", () => {
    const tracks = [recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01", seguedIn: true })];
    const { segueRecurrences } = computeRecurrenceForSong(tracks, statsShows);
    expect(segueRecurrences).toEqual([
      { trackId: "a", kind: "NOT_SEGUED_OUT", gap: null, versionGap: 0, previousShowId: null },
    ]);
  });

  // A song with no flags emits no flag-recurrence rows.
  test("a song with no flags emits no flag-recurrence rows", () => {
    const tracks = [recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01" })];
    const { flagRecurrences } = computeRecurrenceForSong(tracks, statsShows);
    expect(flagRecurrences).toEqual([]);
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

// The per-song recurrence recompute is what a GUI flag edit triggers: it must
// rebuild ONLY the edited song's recurrence (cheap, scoped) rather than the
// date-wide fan-out. These pin the scoping and the flag-recurrence write.
describe("StatsService.recomputeSongRecurrence", () => {
  type StubTrack = {
    id: string;
    songId: string;
    set: string;
    position: number;
    segue: string | null;
    gap: number | null;
    previousPerformanceShowId: string | null;
    show: { id: string; date: string; dayOrder: number | null; countForStats: boolean };
    trackFlags: Array<{ flag: string }>;
  };

  function stubTrack(id: string, showId: string, date: string, flags: string[]): StubTrack {
    return {
      id,
      songId: "tractorbeam",
      set: "S1",
      position: 1,
      segue: null,
      gap: null,
      previousPerformanceShowId: null,
      show: { id: showId, date, dayOrder: null, countForStats: true },
      trackFlags: flags.map((flag) => ({ flag })),
    };
  }

  function makeService(songTracks: StubTrack[], statsShowDates: string[]) {
    const db = {
      show: { findMany: vi.fn().mockResolvedValue(statsShowDates.map((date) => ({ date }))) },
      track: { findMany: vi.fn().mockResolvedValue(songTracks) },
      song: {
        findMany: vi
          .fn()
          .mockResolvedValue([
            { id: "tractorbeam", timesPlayed: 2, dateFirstPlayed: null, dateLastPlayed: null, yearlyPlayData: {} },
          ]),
      },
      $queryRaw: vi.fn().mockResolvedValue([]),
      $executeRaw: vi.fn().mockResolvedValue(undefined),
    } as unknown as ConstructorParameters<typeof StatsService>[0];
    return new StatsService(db);
  }

  // Two dyslexic versions of one song: the recompute writes flag recurrence for
  // exactly those two track ids (proves it doesn't touch the whole catalog).
  test("recomputes only the given song's tracks and writes their flag recurrence", async () => {
    const statsShows = ["2003-01-01", "2003-01-10", "2003-01-20"];
    const tracks = [
      stubTrack("a", "A", "2003-01-01", ["DYSLEXIC"]),
      stubTrack("b", "B", "2003-01-20", ["DYSLEXIC"]),
    ];
    const service = makeService(tracks, statsShows);
    const replaceFlag = vi.spyOn(
      service as unknown as { replaceFlagRecurrence: (ids: string[], recs: unknown[]) => Promise<void> },
      "replaceFlagRecurrence",
    );
    const replaceSegue = vi.spyOn(
      service as unknown as { replaceSegueRecurrence: (ids: string[], recs: unknown[]) => Promise<void> },
      "replaceSegueRecurrence",
    );

    await service.recomputeSongRecurrence("tractorbeam");

    expect(replaceFlag).toHaveBeenCalledTimes(1);
    expect(replaceFlag.mock.calls[0][0]).toEqual(["a", "b"]);
    expect(replaceFlag.mock.calls[0][1]).toContainEqual(
      expect.objectContaining({ trackId: "b", flag: "DYSLEXIC", previousShowId: "A" }),
    );
    expect(replaceSegue).toHaveBeenCalledWith(["a", "b"], expect.any(Array));
  });
});
