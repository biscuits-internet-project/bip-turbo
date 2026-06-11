import { describe, expect, test } from "vitest";
import {
  computeRecurrence,
  computeSongStats,
  computeTrackGaps,
  notSeguedInPredicate,
  notSeguedOutPredicate,
  type RecurrenceTrackForWalk,
  sortTracksForGapWalk,
  standalonePredicate,
  type TrackForGapWalk,
} from "./track-gap";

function track(
  opts: Partial<TrackForGapWalk> & Pick<TrackForGapWalk, "trackId" | "showId" | "showDate">,
): TrackForGapWalk {
  return {
    dayOrder: null,
    showCountForStats: true,
    set: "S1",
    position: 1,
    ...opts,
  };
}

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

describe("sortTracksForGapWalk", () => {
  // Different dates: chronological order wins.
  test("orders by date when dates differ", () => {
    const sorted = sortTracksForGapWalk([
      track({ trackId: "later", showId: "B", showDate: "2010-06-01" }),
      track({ trackId: "earlier", showId: "A", showDate: "2010-01-01" }),
    ]);
    expect(sorted.map((t) => t.trackId)).toEqual(["earlier", "later"]);
  });

  // Same date: explicit dayOrder breaks the tie. NULL sorts LAST in ASC.
  test("breaks same-date ties with dayOrder ascending, NULLs last", () => {
    const sorted = sortTracksForGapWalk([
      track({ trackId: "null-order", showId: "C", showDate: "2010-03-26", dayOrder: null }),
      track({ trackId: "second", showId: "B", showDate: "2010-03-26", dayOrder: 2 }),
      track({ trackId: "first", showId: "A", showDate: "2010-03-26", dayOrder: 1 }),
    ]);
    expect(sorted.map((t) => t.trackId)).toEqual(["first", "second", "null-order"]);
  });

  // Within-show ordering: same showId means same date and same dayOrder, so
  // position breaks the tie. Used for songs played twice in one show.
  test("within a show, position breaks ties", () => {
    const sorted = sortTracksForGapWalk([
      track({ trackId: "encore", showId: "X", showDate: "2010-03-26", position: 8 }),
      track({ trackId: "opener", showId: "X", showDate: "2010-03-26", position: 1 }),
    ]);
    expect(sorted.map((t) => t.trackId)).toEqual(["opener", "encore"]);
  });

  // Set play-order beats raw position: an encore (E1, position 1) is played
  // AFTER set 2 (S2, position 6), even though its position number is lower.
  // Encores don't sort alphabetically into play order, so the set rank wins.
  test("within a show, set play-order beats position (encore after set 2)", () => {
    const sorted = sortTracksForGapWalk([
      track({ trackId: "encore", showId: "X", showDate: "2025-09-05", set: "E1", position: 1 }),
      track({ trackId: "set2", showId: "X", showDate: "2025-09-05", set: "S2", position: 6 }),
    ]);
    expect(sorted.map((t) => t.trackId)).toEqual(["set2", "encore"]);
  });

  // Both NULL dayOrder on the same date: showId is the final tiebreaker for
  // stable ordering.
  test("falls back to showId when both dayOrders are null", () => {
    const sorted = sortTracksForGapWalk([
      track({ trackId: "second", showId: "show-z", showDate: "1995-12-01" }),
      track({ trackId: "first", showId: "show-a", showDate: "1995-12-01" }),
    ]);
    expect(sorted.map((t) => t.trackId)).toEqual(["first", "second"]);
  });
});

describe("computeTrackGaps", () => {
  // First-ever performance: gap=null, prev=null. Renders as "Debut".
  test("debut: single track gets gap=null and prev=null", () => {
    const tracks = [track({ trackId: "t1", showId: "show-A", showDate: "1998-04-15" })];
    const results = computeTrackGaps(tracks, ["1998-04-15"]);
    expect(results).toEqual([{ trackId: "t1", gap: null, previousPerformanceShowId: null }]);
  });

  // Back-to-back: song played at consecutive shows → gap=0 on the second.
  test("back-to-back shows produce gap=0", () => {
    const tracks = sortTracksForGapWalk([
      track({ trackId: "t1", showId: "A", showDate: "2001-06-01" }),
      track({ trackId: "t2", showId: "B", showDate: "2001-06-02" }),
    ]);
    const results = computeTrackGaps(tracks, ["2001-06-01", "2001-06-02"]);
    expect(results).toEqual([
      { trackId: "t1", gap: null, previousPerformanceShowId: null },
      { trackId: "t2", gap: 0, previousPerformanceShowId: "A" },
    ]);
  });

  // Three unrelated shows between performances → gap counts shows strictly
  // between (exclusive bounds).
  test("N shows between: gap counts shows strictly between performances", () => {
    const tracks = sortTracksForGapWalk([
      track({ trackId: "t1", showId: "A", showDate: "2003-10-10" }),
      track({ trackId: "t2", showId: "E", showDate: "2003-10-20" }),
    ]);
    const statsShows = ["2003-10-10", "2003-10-12", "2003-10-15", "2003-10-18", "2003-10-20"];
    const results = computeTrackGaps(tracks, statsShows);
    expect(results).toEqual([
      { trackId: "t1", gap: null, previousPerformanceShowId: null },
      { trackId: "t2", gap: 3, previousPerformanceShowId: "A" },
    ]);
  });

  // Within-show repeat: both tracks share gap+prev computed against the
  // song's prior *show*, not against the earlier track in this show. The
  // "this show" repeat marker is a render-time concern.
  test("within-show repeat: both tracks share gap+prev from prior show", () => {
    const tracks = sortTracksForGapWalk([
      track({ trackId: "t1", showId: "A", showDate: "2005-02-01" }),
      track({ trackId: "t2a", showId: "B", showDate: "2005-02-05", position: 3 }),
      track({ trackId: "t2b", showId: "B", showDate: "2005-02-05", position: 8 }),
    ]);
    const statsShows = ["2005-02-01", "2005-02-03", "2005-02-05"];
    const results = computeTrackGaps(tracks, statsShows);
    expect(results).toEqual([
      { trackId: "t1", gap: null, previousPerformanceShowId: null },
      { trackId: "t2a", gap: 1, previousPerformanceShowId: "A" },
      { trackId: "t2b", gap: 1, previousPerformanceShowId: "A" },
    ]);
  });

  // count_for_stats=false tracks get a gap value pointing at the prior real
  // performance, but they DO NOT advance the "last performance" cursor —
  // the next stats-show walks back past them.
  test("count_for_stats=false: track points at prior stats-show; never pointed at", () => {
    const tracks = sortTracksForGapWalk([
      track({ trackId: "t-A", showId: "A", showDate: "2010-06-01" }),
      track({ trackId: "t-SC", showId: "SC", showDate: "2010-06-10", showCountForStats: false }),
      track({ trackId: "t-B", showId: "B", showDate: "2010-06-15" }),
    ]);
    const statsShows = ["2010-06-01", "2010-06-15"];
    const results = computeTrackGaps(tracks, statsShows);
    expect(results).toEqual([
      { trackId: "t-A", gap: null, previousPerformanceShowId: null },
      // SC points at A, even though SC doesn't count for stats.
      { trackId: "t-SC", gap: 0, previousPerformanceShowId: "A" },
      // B walks back to A, NOT to SC. Stats shows between A and B = 0.
      { trackId: "t-B", gap: 0, previousPerformanceShowId: "A" },
    ]);
  });

  // Same-date pair where the song is played at both shows — dayOrder
  // tiebreaker determines which is "first" for gap purposes. The earlier
  // (day_order=1) is the song's debut on that date, gap=0 on day_order=2.
  test("same-date pair: dayOrder=1 is treated as the earlier show", () => {
    const tracks = sortTracksForGapWalk([
      track({ trackId: "t-after", showId: "after", showDate: "2010-03-26", dayOrder: 2 }),
      track({ trackId: "t-fest", showId: "fest", showDate: "2010-03-26", dayOrder: 1 }),
    ]);
    const statsShows = ["2010-03-26", "2010-03-26"];
    const results = computeTrackGaps(tracks, statsShows);
    expect(results).toEqual([
      { trackId: "t-fest", gap: null, previousPerformanceShowId: null },
      { trackId: "t-after", gap: 0, previousPerformanceShowId: "fest" },
    ]);
  });
});

describe("computeRecurrence", () => {
  const statsShows = ["2003-01-01", "2003-01-05", "2003-01-10", "2003-01-20", "2003-02-01"];

  // A predicate that only counts tracks carrying a given flag — models the
  // per-flag recurrence walk (e.g. "every dyslexic performance").
  const hasFlag =
    (flag: string) =>
    (track: RecurrenceTrackForWalk): boolean =>
      track.flags.includes(flag);

  // First-ever qualifying instance: gap null + prev null mark it as first-time;
  // versionGap carries VERSIONS BEFORE this one (here 0 — it's the song's debut).
  test("first qualifying track is the song's debut: versionGap 0 (versions before), prev null", () => {
    const tracks = sortTracksForGapWalk([
      recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01", flags: ["DYSLEXIC"] }),
      recurrenceTrack({ trackId: "b", showId: "B", showDate: "2003-01-05" }),
    ]);
    const results = computeRecurrence(tracks, hasFlag("DYSLEXIC"), statsShows);
    expect(results).toEqual([{ trackId: "a", gap: null, versionGap: 0, previousShowId: null }]);
  });

  // First-ever qualifying instance LATE in the song's life: versionGap = the
  // count of prior performances. Drives "1st <…> (after X versions)".
  test("first qualifying track after prior versions: versionGap = versions before it", () => {
    const tracks = sortTracksForGapWalk([
      // Three prior performances of the song, none dyslexic.
      recurrenceTrack({ trackId: "p1", showId: "A", showDate: "2003-01-01" }),
      recurrenceTrack({ trackId: "p2", showId: "B", showDate: "2003-01-05" }),
      recurrenceTrack({ trackId: "p3", showId: "C", showDate: "2003-01-10" }),
      // First-ever dyslexic version — 3 versions preceded it.
      recurrenceTrack({ trackId: "d", showId: "D", showDate: "2003-01-20", flags: ["DYSLEXIC"] }),
    ]);
    const results = computeRecurrence(tracks, hasFlag("DYSLEXIC"), statsShows);
    expect(results).toEqual([{ trackId: "d", gap: null, versionGap: 3, previousShowId: null }]);
  });

  // Two qualifying performances: the later one's gap counts stats-shows strictly
  // between the two qualifying shows (NOT every show), prev points at the first.
  test("two qualifying tracks: gap counts stats-shows between them", () => {
    const tracks = sortTracksForGapWalk([
      recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01", flags: ["DYSLEXIC"] }),
      recurrenceTrack({ trackId: "skip", showId: "B", showDate: "2003-01-05" }),
      recurrenceTrack({ trackId: "c", showId: "C", showDate: "2003-01-20", flags: ["DYSLEXIC"] }),
    ]);
    const results = computeRecurrence(tracks, hasFlag("DYSLEXIC"), statsShows);
    // Between 2003-01-01 and 2003-01-20: 2003-01-05 and 2003-01-10 → gap 2.
    // versionGap: a, skip, c are versions 1,2,3 → 1 intervening (skip) → 1.
    expect(results).toEqual([
      { trackId: "a", gap: null, versionGap: 0, previousShowId: null },
      { trackId: "c", gap: 2, versionGap: 1, previousShowId: "A" },
    ]);
  });

  // standalone = the track neither segues out (own segue empty) nor is segued
  // into (seguedIn=false). seguedIn is precomputed per track from its set
  // neighbor, NOT inferred from walk order.
  test("standalone predicate: skips a segued-out track and a segued-into track", () => {
    const tracks = sortTracksForGapWalk([
      recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01" }),
      recurrenceTrack({ trackId: "out", showId: "B", showDate: "2003-01-05", segue: ">" }),
      recurrenceTrack({ trackId: "in", showId: "C", showDate: "2003-01-10", seguedIn: true }),
      recurrenceTrack({ trackId: "d", showId: "D", showDate: "2003-01-20" }),
    ]);
    const results = computeRecurrence(tracks, standalonePredicate, statsShows);
    // Qualifying: a (standalone, first), d (standalone). `out` segues out; `in` is segued into.
    // versionGap at d: a,out,in,d are versions 1-4 → 2 intervening (out, in) → 2.
    expect(results).toEqual([
      { trackId: "a", gap: null, versionGap: 0, previousShowId: null },
      { trackId: "d", gap: 2, versionGap: 2, previousShowId: "A" },
    ]);
  });

  // notSeguedIn reads the precomputed `seguedIn` flag: a segued-into track is skipped.
  test("notSeguedIn predicate: skips a segued-into track", () => {
    const tracks = sortTracksForGapWalk([
      recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01" }),
      recurrenceTrack({ trackId: "in", showId: "B", showDate: "2003-01-05", seguedIn: true }),
      recurrenceTrack({ trackId: "c", showId: "C", showDate: "2003-01-20" }),
    ]);
    const results = computeRecurrence(tracks, notSeguedInPredicate, statsShows);
    // a qualifies (first), c qualifies. `in` is segued into.
    // versionGap at c: a,in,c versions 1-3 → 1 intervening (in) → 1.
    expect(results).toEqual([
      { trackId: "a", gap: null, versionGap: 0, previousShowId: null },
      { trackId: "c", gap: 2, versionGap: 1, previousShowId: "A" },
    ]);
  });

  // notSeguedOut = the track's own segue is empty.
  test("notSeguedOut predicate: skips tracks that segue out", () => {
    const tracks = sortTracksForGapWalk([
      recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01", segue: ">" }),
      recurrenceTrack({ trackId: "b", showId: "B", showDate: "2003-01-10" }),
      recurrenceTrack({ trackId: "c", showId: "C", showDate: "2003-01-20" }),
    ]);
    const results = computeRecurrence(tracks, notSeguedOutPredicate, statsShows);
    // a segues out → skipped. b first, c gap = stats-shows between (2003-01-10, 2003-01-20) excl = 0.
    // versionGap at c: a,b,c versions 1-3; b qualifies (v2), c qualifies (v3) → 0 intervening → 0.
    expect(results).toEqual([
      { trackId: "b", gap: null, versionGap: 1, previousShowId: null },
      { trackId: "c", gap: 0, versionGap: 0, previousShowId: "B" },
    ]);
  });

  // Non-stats shows do not advance the qualifying cursor: a later qualifying
  // track on a stats show walks back past a non-stats qualifying track.
  test("non-stats qualifying track does not become a 'previous'", () => {
    const tracks = sortTracksForGapWalk([
      recurrenceTrack({ trackId: "a", showId: "A", showDate: "2003-01-01" }),
      recurrenceTrack({ trackId: "sc", showId: "SC", showDate: "2003-01-05", showCountForStats: false }),
      recurrenceTrack({ trackId: "b", showId: "B", showDate: "2003-01-20" }),
    ]);
    const results = computeRecurrence(tracks, () => true, statsShows);
    expect(results).toEqual([
      { trackId: "a", gap: null, versionGap: 0, previousShowId: null },
      // sc points at A even though it doesn't count for stats; it's not a version itself.
      { trackId: "sc", gap: 0, versionGap: 0, previousShowId: "A" },
      // b walks back to A, not SC. Stats shows strictly between A and B: 01-05, 01-10 → 2.
      // versions: only a and b count (sc is non-stats) → 0 intervening versions → 0.
      { trackId: "b", gap: 2, versionGap: 0, previousShowId: "A" },
    ]);
  });

  // The Bazaar case: a song absent for many shows returns in the SAME shape it
  // last had — no intervening version, so versionGap is 0 even though the SHOW
  // gap is large. This is what suppresses the vacuous "1st ... since" footnote.
  test("absent then returns in same shape: versionGap 0 while show-gap is large", () => {
    const tracks = sortTracksForGapWalk([
      recurrenceTrack({ trackId: "old", showId: "A", showDate: "2003-01-01" }),
      // No performances of this song until much later; many unrelated shows pass.
      recurrenceTrack({ trackId: "new", showId: "E", showDate: "2003-02-01" }),
    ]);
    const results = computeRecurrence(tracks, notSeguedOutPredicate, statsShows);
    // Show-gap: stats shows strictly between 01-01 and 02-01 → 01-05,01-10,01-20 → 3.
    // versionGap: old and new are consecutive versions → 0 intervening → 0.
    expect(results).toEqual([
      { trackId: "old", gap: null, versionGap: 0, previousShowId: null },
      { trackId: "new", gap: 3, versionGap: 0, previousShowId: "A" },
    ]);
  });

  // A standalone version with three intervening versions of a different shape →
  // versionGap 3 (a genuine shape streak worth a footnote).
  test("standalone after three differently-shaped versions: versionGap 3", () => {
    const tracks = sortTracksForGapWalk([
      recurrenceTrack({ trackId: "s1", showId: "A", showDate: "2003-01-01" }),
      recurrenceTrack({ trackId: "x1", showId: "B", showDate: "2003-01-05", segue: ">" }),
      recurrenceTrack({ trackId: "x2", showId: "C", showDate: "2003-01-10", segue: ">" }),
      recurrenceTrack({ trackId: "x3", showId: "D", showDate: "2003-01-20", segue: ">" }),
      recurrenceTrack({ trackId: "s2", showId: "E", showDate: "2003-02-01" }),
    ]);
    const results = computeRecurrence(tracks, standalonePredicate, statsShows);
    // s1 first (null); s2 has x1,x2,x3 between → versionGap 3.
    expect(results).toEqual([
      { trackId: "s1", gap: null, versionGap: 0, previousShowId: null },
      { trackId: "s2", gap: 3, versionGap: 3, previousShowId: "A" },
    ]);
  });

  // A song played twice in one show, both same shape: nothing intervenes
  // between the two, so versionGap is 0 (strictly-between, like the show-gap).
  // Under the ~20 threshold this never fires on its own — harmless.
  test("same-show repeat: versionGap 0 (nothing intervenes)", () => {
    const tracks = sortTracksForGapWalk([
      recurrenceTrack({ trackId: "first", showId: "A", showDate: "2003-01-01", position: 1 }),
      recurrenceTrack({ trackId: "second", showId: "A", showDate: "2003-01-01", position: 8 }),
    ]);
    const results = computeRecurrence(tracks, notSeguedOutPredicate, statsShows);
    expect(results).toEqual([
      { trackId: "first", gap: null, versionGap: 0, previousShowId: null },
      { trackId: "second", gap: 0, versionGap: 0, previousShowId: "A" },
    ]);
  });
});

describe("computeSongStats", () => {
  // Empty stats-track list → all-zero/null aggregates.
  test("no stats tracks: returns zero/null defaults", () => {
    expect(computeSongStats([])).toEqual({
      timesPlayed: 0,
      dateFirstPlayed: null,
      dateLastPlayed: null,
      yearlyPlayData: {},
      mostCommonYear: null,
    });
  });

  // timesPlayed counts UNIQUE shows: a song played twice in one show
  // counts once.
  test("timesPlayed counts unique shows", () => {
    const stats = computeSongStats([
      { showId: "A", showDate: "2010-01-01" },
      { showId: "A", showDate: "2010-01-01" }, // within-show repeat
      { showId: "B", showDate: "2010-06-01" },
    ]);
    expect(stats.timesPlayed).toBe(2);
  });

  // First/last played track the chronological extremes.
  test("dateFirst/LastPlayed track chronological extremes", () => {
    const stats = computeSongStats([
      { showId: "B", showDate: "2010-06-01" },
      { showId: "A", showDate: "2010-01-01" },
      { showId: "C", showDate: "2010-12-01" },
    ]);
    expect(stats.dateFirstPlayed?.toISOString().slice(0, 10)).toBe("2010-01-01");
    expect(stats.dateLastPlayed?.toISOString().slice(0, 10)).toBe("2010-12-01");
  });

  // yearlyPlayData buckets unique-shows by year.
  test("yearlyPlayData buckets unique shows by year", () => {
    const stats = computeSongStats([
      { showId: "A", showDate: "1999-04-15" },
      { showId: "B", showDate: "2001-08-15" },
      { showId: "C", showDate: "2001-12-31" },
      { showId: "D", showDate: "2010-06-01" },
    ]);
    expect(stats.yearlyPlayData).toEqual({ "1999": 1, "2001": 2, "2010": 1 });
  });

  // mostCommonYear is the year a song was played most — the argmax of
  // yearlyPlayData. Backs the "Most Common Year" stat box.
  test("mostCommonYear is the year with the most plays", () => {
    const stats = computeSongStats([
      { showId: "A", showDate: "2010-06-01" },
      { showId: "B", showDate: "2012-03-15" },
      { showId: "C", showDate: "2012-07-15" },
      { showId: "D", showDate: "2012-11-15" },
      { showId: "E", showDate: "2015-06-01" },
    ]);
    expect(stats.mostCommonYear).toBe(2012);
  });

  // Ties resolve to the earliest year so the value is deterministic across
  // recomputes (object key order is otherwise unspecified). Mid-year dates
  // keep the year unambiguous regardless of the runner's timezone.
  test("mostCommonYear breaks ties toward the earliest year", () => {
    const stats = computeSongStats([
      { showId: "A", showDate: "2015-06-01" },
      { showId: "B", showDate: "2015-09-01" },
      { showId: "C", showDate: "2010-06-01" },
      { showId: "D", showDate: "2010-09-01" },
    ]);
    expect(stats.mostCommonYear).toBe(2010);
  });
});
