import { describe, expect, test } from "vitest";
import {
  computeSongStats,
  computeTrackGaps,
  sortTracksForGapWalk,
  type TrackForGapWalk,
} from "./track-gap";

function track(opts: Partial<TrackForGapWalk> & Pick<TrackForGapWalk, "trackId" | "showId" | "showDate">): TrackForGapWalk {
  return {
    dayOrder: null,
    showCountForStats: true,
    position: 1,
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

describe("computeSongStats", () => {
  // Empty stats-track list → all-zero/null aggregates.
  test("no stats tracks: returns zero/null defaults", () => {
    expect(computeSongStats([])).toEqual({
      timesPlayed: 0,
      dateFirstPlayed: null,
      dateLastPlayed: null,
      yearlyPlayData: {},
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
});
