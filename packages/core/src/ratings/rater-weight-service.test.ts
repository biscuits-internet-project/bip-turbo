import { describe, expect, test, vi } from "vitest";
import { computeTrackDiscriminating, RaterWeightService, rankShowComparisons } from "./rater-weight-service";

describe("computeTrackDiscriminating", () => {
  const wide = { mean: 3, entropy: 2, ratingsCount: 30 }; // full weight
  const fluffer = { mean: 4.9, entropy: 0.3, ratingsCount: 20 }; // excluded → weight 0

  test("weights by rater and drops excluded fluffers, keeping raw (un-centered) low scores", () => {
    const stats = new Map([
      ["wide", wide],
      ["fluffer", fluffer],
    ]);
    const result = computeTrackDiscriminating(
      [
        { userId: "wide", value: 0.5 }, // a genuine low vote from a scale-user
        { userId: "fluffer", value: 5 }, // dropped
      ],
      (userId) => stats.get(userId),
      3,
    );
    // Only the wide rater counts, un-centered → the 0.5 survives intact.
    expect(result.discriminatingRating).toBeCloseTo(0.5, 5);
    expect(result.discriminatingRatingsCount).toBe(1);
  });

  test("returns null when every contributing rater is excluded or statless", () => {
    const result = computeTrackDiscriminating(
      [
        { userId: "fluffer", value: 5 },
        { userId: "unknown", value: 5 }, // no stats row → weight 0
      ],
      (userId) => (userId === "fluffer" ? fluffer : undefined),
      3,
    );
    expect(result.discriminatingRating).toBeNull();
    expect(result.discriminatingRatingsCount).toBe(0);
  });
});

describe("rankShowComparisons", () => {
  // The 2001-09-01 overlay scenario: two single-vote 5.0 shows top the raw-average
  // field, but the genuine #1 (highest average among well-rated shows) must own the
  // TOP-LIST rank — thin shows only inflate the `all` field, never the top list.
  // weightedRatingsCount == ratingsCount here (no bomber exclusion in the fixture);
  // date/dayOrder feed only the final full-tie tiebreak, which none of these hit.
  const rankable = (id: string, canonical: number, weighted: number, ratingsCount: number, date: string) => ({
    id,
    canonical,
    weighted,
    ratingsCount,
    weightedRatingsCount: ratingsCount,
    date,
    dayOrder: null,
  });

  test("thin shows inflate the all-field but never the top list", () => {
    const shows = [
      rankable("thin-a", 5.0, 5.0, 1, "2000-01-01"),
      rankable("thin-b", 5.0, 5.0, 2, "2000-01-02"),
      rankable("wetlands", 4.868, 4.8, 34, "2001-09-01"),
      rankable("haymaker", 4.839, 4.7, 31, "2002-10-05"),
    ];
    const wetlands = rankShowComparisons(shows, ["wetlands"], 3.93, 3).get("wetlands");
    // Over all shows the two thin 5.0s sit above it; on the real top list it's #1.
    expect(wetlands?.all).toMatchObject({ canonicalRank: 3, total: 4 });
    expect(wetlands?.top).toMatchObject({ canonicalRank: 1, total: 2 });
  });

  // A thin show keeps a real `all` rank (so its movement is visible) but is not in
  // the top list. Its raw average can top the all-field while its shrunk score sinks.
  test("a thin show is ranked in the all-field but absent from the top list", () => {
    const shows = [
      rankable("big1", 4.8, 4.8, 100, "2000-01-01"),
      rankable("big2", 4.6, 4.6, 100, "2000-01-02"),
      rankable("thin", 5.0, 5.0, 1, "2000-01-03"),
    ];
    const thin = rankShowComparisons(shows, ["thin"], 4.0, 3).get("thin");
    expect(thin?.top).toBeNull();
    // Raw 5.0 tops the all-field (#1 of 3); shrunk to ~4.25 it falls below both bigs (#3).
    expect(thin?.all).toMatchObject({ canonicalRank: 1, calibratedRank: 3, total: 3 });
  });

  // Canonical and calibrated are ranked independently within the top list:
  // count-shrinkage pulls a thinner high-average show below a heavily-rated one.
  test("ranks the calibrated (shrunk) score independently of canonical", () => {
    const shows = [rankable("a", 4.9, 4.9, 10, "2000-01-01"), rankable("b", 4.7, 4.7, 500, "2000-01-02")];
    const ranks = rankShowComparisons(shows, ["a", "b"], 4.0, 3);
    // a canonical 4.9 > b 4.7, but shrink(4.9,4.0,10,3)=4.692 < shrink(4.7,4.0,500,3)=4.696.
    expect(ranks.get("a")?.top).toMatchObject({ canonicalRank: 1, calibratedRank: 2 });
    expect(ranks.get("b")?.top).toMatchObject({ canonicalRank: 2, calibratedRank: 1 });
  });

  // Two shows whose calibrated scores differ only below the display precision must
  // TIE on the rounded score and resolve by the displayed count — here the calibrated
  // count is weighted_ratings_count, so the show with more contributing raters wins.
  test("a sub-precision calibrated gap ties on the rounded score, count breaks it", () => {
    const shows = [
      // Equal weighted (== anchor) makes both shrink to exactly 4.0, so the score
      // ties precisely and only the count tiebreak decides.
      {
        id: "fewer",
        canonical: 4.8,
        weighted: 4.8,
        ratingsCount: 30,
        weightedRatingsCount: 20,
        date: "2001-01-01",
        dayOrder: null,
      },
      {
        id: "more",
        canonical: 4.8,
        weighted: 4.8,
        ratingsCount: 30,
        weightedRatingsCount: 28,
        date: "2000-01-01",
        dayOrder: null,
      },
    ];
    const ranks = rankShowComparisons(shows, ["fewer", "more"], 4.0, 3);
    // Equal calibrated score → the higher weighted_ratings_count (28) ranks first,
    // even though "more" is the OLDER show (date tiebreak never reached).
    expect(ranks.get("more")?.top).toMatchObject({ calibratedRank: 1 });
    expect(ranks.get("fewer")?.top).toMatchObject({ calibratedRank: 2 });
  });
});

// recomputeUser persists via createMany; find the row in any createMany call's data array.
function createdRow(createMany: ReturnType<typeof vi.fn>, match: (data: Record<string, unknown>) => boolean) {
  for (const call of createMany.mock.calls) {
    const data = (call[0] as { data: Record<string, unknown>[] }).data;
    const row = data?.find(match);
    if (row) return row;
  }
  return undefined;
}

describe("RaterWeightService.recomputeUser", () => {
  // A user who rates two Aucoin-era shows across the scale but bombs every
  // Marlon-era show at 0.5 — the barfly07/Stepnotonpets pattern.
  function makeDb() {
    const ratingFindMany = vi.fn().mockResolvedValue([
      { rateableId: "s1", rateableType: "Show", value: 5, createdAt: new Date("2010-01-02") },
      { rateableId: "s2", rateableType: "Show", value: 4, createdAt: new Date("2011-01-02") },
      { rateableId: "s3", rateableType: "Show", value: 0.5, createdAt: new Date("2026-01-02") },
      { rateableId: "s4", rateableType: "Show", value: 0.5, createdAt: new Date("2026-02-02") },
    ]);
    const showFindMany = vi.fn().mockResolvedValue([
      { id: "s1", date: "2010-01-01", averageRating: 4.5 },
      { id: "s2", date: "2011-01-01", averageRating: 4.2 },
      { id: "s3", date: "2026-01-01", averageRating: 4.0 },
      { id: "s4", date: "2026-02-01", averageRating: 3.8 },
    ]);
    const raterStatsFindMany = vi.fn().mockResolvedValue([]); // empty population → nobody flagged high-deviation
    const raterStatsDeleteMany = vi.fn().mockResolvedValue({ count: 0 });
    const raterStatsCreateMany = vi.fn().mockResolvedValue({ count: 0 });
    const db = {
      user: { findMany: vi.fn().mockResolvedValue([]) }, // no alias dedup in this fixture
      rating: { findMany: ratingFindMany, groupBy: vi.fn().mockResolvedValue([]) },
      show: { findMany: showFindMany },
      track: { findMany: vi.fn() },
      raterStats: { findMany: raterStatsFindMany, deleteMany: raterStatsDeleteMany, createMany: raterStatsCreateMany },
    } as never;
    return { db, raterStatsCreateMany, raterStatsDeleteMany };
  }

  test("writes a GLOBAL scope row spanning all of the user's ratings", async () => {
    const { db, raterStatsCreateMany } = makeDb();
    await new RaterWeightService(db).recomputeUser("u1");
    const global = createdRow(raterStatsCreateMany, (d) => d.era === "GLOBAL");
    expect(global?.ratingsCount).toBe(4);
  });

  test("splits ratings into per-era scope rows", async () => {
    const { db, raterStatsCreateMany } = makeDb();
    await new RaterWeightService(db).recomputeUser("u1");
    expect(createdRow(raterStatsCreateMany, (d) => d.era === "AUCOIN")?.ratingsCount).toBe(2);
    expect(createdRow(raterStatsCreateMany, (d) => d.era === "MARLON")?.ratingsCount).toBe(2);
  });

  test("records zero entropy for the era the user bombs (→ zero weight at scoring)", async () => {
    const { db, raterStatsCreateMany } = makeDb();
    await new RaterWeightService(db).recomputeUser("u1");
    const marlon = createdRow(raterStatsCreateMany, (d) => d.era === "MARLON");
    expect(marlon?.entropy).toBe(0);
  });

  test("deletes the user's existing scope rows before recomputing", async () => {
    const { db, raterStatsDeleteMany } = makeDb();
    await new RaterWeightService(db).recomputeUser("u1");
    expect(raterStatsDeleteMany).toHaveBeenCalledWith({ where: { userId: { in: ["u1"] } } });
  });

  test("a user with no ratings has their scope rows deleted", async () => {
    const raterStatsDeleteMany = vi.fn().mockResolvedValue({ count: 4 });
    const db = {
      user: { findMany: vi.fn().mockResolvedValue([]) },
      rating: { findMany: vi.fn().mockResolvedValue([]), groupBy: vi.fn().mockResolvedValue([]) },
      raterStats: { deleteMany: raterStatsDeleteMany, createMany: vi.fn() },
    } as never;
    await new RaterWeightService(db).recomputeUser("u1");
    expect(raterStatsDeleteMany).toHaveBeenCalledWith({ where: { userId: { in: ["u1"] } } });
  });
});

describe("RaterWeightService recompute settings", () => {
  // No settings row yet ⇒ treat as dirty so the very first recompute runs (the
  // migration seeds one with dirty=true, but absence must not silently skip).
  test("isDirty defaults to true when there is no settings row", async () => {
    const db = { ratingSettings: { findFirst: vi.fn().mockResolvedValue(null) } } as never;
    expect(await new RaterWeightService(db).isDirty()).toBe(true);
  });

  test("isDirty reflects the stored flag", async () => {
    const db = { ratingSettings: { findFirst: vi.fn().mockResolvedValue({ ratingsDirty: false }) } } as never;
    expect(await new RaterWeightService(db).isDirty()).toBe(false);
  });

  test("markRecomputed updates the existing singleton (anchor + clears dirty + stamps time)", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    const create = vi.fn();
    const db = {
      ratingSettings: { findFirst: vi.fn().mockResolvedValue({ id: "settings-1" }), update, create },
    } as never;
    await new RaterWeightService(db).markRecomputed(4.2);
    expect(create).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "settings-1" },
        data: expect.objectContaining({ showShrinkAnchor: 4.2, ratingsDirty: false }),
      }),
    );
  });

  test("markRecomputed creates the singleton when none exists", async () => {
    const update = vi.fn();
    const create = vi.fn().mockResolvedValue(undefined);
    const db = { ratingSettings: { findFirst: vi.fn().mockResolvedValue(null), update, create } } as never;
    await new RaterWeightService(db).markRecomputed(4.2);
    expect(update).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ showShrinkAnchor: 4.2, ratingsDirty: false }) }),
    );
  });
});

describe("RaterWeightService.rankedShows", () => {
  // Simple mode ranks by the ROUNDED average users see, so two shows that print the
  // same score tie on the primary key and the more-rated one wins — even when its
  // full-precision average is lower. Sorting by the raw float would flip this.
  test("simple mode ranks by rounded rating, then ratings_count", async () => {
    const rows = [
      {
        id: "many",
        date: "2002-01-01",
        dayOrder: null,
        average: 4.807,
        weighted: null,
        ratingsCount: 50,
        weightedRatingsCount: 0,
      },
      {
        id: "few",
        date: "2001-01-01",
        dayOrder: null,
        average: 4.814,
        weighted: null,
        ratingsCount: 40,
        weightedRatingsCount: 0,
      },
    ];
    const db = { ratingSettings: { findFirst: vi.fn() }, $queryRaw: vi.fn().mockResolvedValue(rows) } as never;
    const ranked = await new RaterWeightService(db).rankedShows("simple", 5);
    // Both round to 4.81 → tie → "many" (50 ratings) outranks "few", flipping the
    // full-precision order where 4.814 would beat 4.807.
    expect(ranked.map((s) => s.id)).toEqual(["many", "few"]);
  });

  // The calibrated path sorts in JS, so equal shrunk scores must resolve through the
  // shared comparator, tiebreaking on the DISPLAYED count (weighted_ratings_count).
  // Feeding the same rows in different input orders must yield one stable order:
  // more-contributing-raters first, then newest-date first.
  test("calibrated mode breaks equal scores by weighted_ratings_count then date (stable across input order)", async () => {
    // Anchor 4 with weighted == anchor makes shrinkToward return exactly 4 for every
    // count, so all three shows tie on score and only the tiebreak decides order.
    const rows = [
      {
        id: "older-30",
        date: "2008-01-01",
        dayOrder: null,
        average: null,
        weighted: 4,
        ratingsCount: 40,
        weightedRatingsCount: 30,
      },
      {
        id: "fewer-20",
        date: "2005-01-01",
        dayOrder: null,
        average: null,
        weighted: 4,
        ratingsCount: 40,
        weightedRatingsCount: 20,
      },
      {
        id: "newer-30",
        date: "2010-01-01",
        dayOrder: null,
        average: null,
        weighted: 4,
        ratingsCount: 40,
        weightedRatingsCount: 30,
      },
    ];
    const expected = ["newer-30", "older-30", "fewer-20"];

    async function rank(inputOrder: typeof rows) {
      const db = {
        ratingSettings: { findFirst: vi.fn().mockResolvedValue({ showShrinkAnchor: 4 }) },
        $queryRaw: vi.fn().mockResolvedValue(inputOrder),
      } as never;
      const ranked = await new RaterWeightService(db).rankedShows("calibrated", 5);
      return ranked.map((s) => s.id);
    }

    expect(await rank(rows)).toEqual(expected);
    expect(await rank([...rows].reverse())).toEqual(expected);
  });
});

describe("RaterWeightService.recomputeRateable", () => {
  // A Marlon-era show rated 5 by a full-range credible rater (entropy 2 → full
  // weight) and 0.5 by a zero-entropy bomber.
  function makeDb() {
    const ratingFindMany = vi.fn().mockResolvedValue([
      { userId: "credible", value: 5 },
      { userId: "bomber", value: 0.5 },
    ]);
    const showFindMany = vi.fn().mockResolvedValue([{ id: "s1", date: "2026-01-01", averageRating: 2.75 }]);
    const raterStatsFindMany = vi.fn().mockResolvedValue([
      { userId: "credible", era: "GLOBAL", mean: 4, entropy: 2, ratingsCount: 20, isExcluded: false },
      { userId: "bomber", era: "GLOBAL", mean: 0.5, entropy: 0, ratingsCount: 30, isExcluded: false },
      // The bomber is flagged bad-faith in this show's era (MARLON) → dropped before scoring.
      { userId: "bomber", era: "MARLON", mean: 0.5, entropy: 0, ratingsCount: 28, isExcluded: true },
    ]);
    const showUpdate = vi.fn().mockResolvedValue(undefined);
    const db = {
      user: { findMany: vi.fn().mockResolvedValue([]) },
      rating: { findMany: ratingFindMany, groupBy: vi.fn().mockResolvedValue([]) },
      show: { findMany: showFindMany, update: showUpdate },
      track: { findMany: vi.fn() },
      raterStats: { findMany: raterStatsFindMany },
      ratingSettings: { findFirst: vi.fn().mockResolvedValue(null) },
      $queryRaw: vi.fn().mockResolvedValue([{ mean: 2.75, stddev: 1 }]), // populationStats
    } as never;
    return { db, showUpdate };
  }

  test("writes the calibrated score to shows.weighted_rating, dropping the bad-faith bomber", async () => {
    const { db, showUpdate } = makeDb();
    await new RaterWeightService(db).recomputeRateable("Show", "s1");
    const data = (showUpdate.mock.calls[0][0] as { data: { weightedRating: number; weightedRatingsCount: number } })
      .data;
    // Bomber excluded in MARLON → dropped. credible (count 20): cold-start mean
    // shrink(4, pop 2.75, 20, k=5) = 3.75; center(5, 3.75, 2.75) = 4.0, full weight.
    expect(data.weightedRating).toBeCloseTo(4.0, 10);
    expect(data.weightedRatingsCount).toBe(1);
  });

  // A track rating write must land on tracks.discriminating_rating immediately —
  // the setlist headline reads that column, so leaving it to the hourly batch
  // shows the pre-rating score and count on the very next page load.
  test("writes the calibrated score to tracks.discriminating_rating, dropping the zero-entropy fluffer", async () => {
    const trackUpdate = vi.fn().mockResolvedValue(undefined);
    const db = {
      user: { findMany: vi.fn().mockResolvedValue([]) },
      rating: {
        findMany: vi.fn().mockResolvedValue([
          { userId: "wide", value: 0.5 },
          { userId: "fluffer", value: 5 },
        ]),
        groupBy: vi.fn().mockResolvedValue([]),
      },
      show: { findMany: vi.fn(), update: vi.fn() },
      track: { findMany: vi.fn(), update: trackUpdate },
      raterStats: {
        findMany: vi.fn().mockResolvedValue([
          { userId: "wide", mean: 3, entropy: 2, ratingsCount: 30 },
          { userId: "fluffer", mean: 4.9, entropy: 0.3, ratingsCount: 20 },
        ]),
      },
      ratingSettings: { findFirst: vi.fn().mockResolvedValue(null) },
    } as never;

    await new RaterWeightService(db).recomputeRateable("Track", "t1");

    const data = (
      trackUpdate.mock.calls[0][0] as {
        data: { discriminatingRating: number; discriminatingRatingsCount: number };
      }
    ).data;
    // Raw (un-centered) stars: the fluffer's 5 drops to weight 0, leaving the
    // wide rater's genuine 0.5 as the whole score.
    expect(data.discriminatingRating).toBeCloseTo(0.5, 10);
    expect(data.discriminatingRatingsCount).toBe(1);
  });

  test("zeroes a track whose last rating was removed", async () => {
    const trackUpdate = vi.fn().mockResolvedValue(undefined);
    const db = {
      user: { findMany: vi.fn().mockResolvedValue([]) },
      rating: { findMany: vi.fn().mockResolvedValue([]), groupBy: vi.fn().mockResolvedValue([]) },
      show: { findMany: vi.fn(), update: vi.fn() },
      track: { findMany: vi.fn(), update: trackUpdate },
      raterStats: { findMany: vi.fn().mockResolvedValue([]) },
      ratingSettings: { findFirst: vi.fn().mockResolvedValue(null) },
    } as never;

    await new RaterWeightService(db).recomputeRateable("Track", "t1");

    expect(trackUpdate.mock.calls[0][0]).toEqual({
      where: { id: "t1" },
      data: { discriminatingRating: null, discriminatingRatingsCount: 0 },
    });
  });

  test("ignores rateable types with no denormalized calibrated column", async () => {
    const { db, showUpdate } = makeDb();
    await new RaterWeightService(db).recomputeRateable("Review", "r1");
    expect(showUpdate).not.toHaveBeenCalled();
  });

  // Cold-start: a brand-new rater (no rater_stats row yet) must still move the
  // score — count 0 → pop-centered + full entropy weight, so a lone 5 reads as 5.
  test("a brand-new rater with no stats row still moves the score", async () => {
    const showUpdate = vi.fn().mockResolvedValue(undefined);
    const db = {
      user: { findMany: vi.fn().mockResolvedValue([]) },
      rating: {
        findMany: vi.fn().mockResolvedValue([{ userId: "newbie", value: 5 }]),
        groupBy: vi.fn().mockResolvedValue([]),
      },
      show: {
        findMany: vi.fn().mockResolvedValue([{ id: "s1", date: "2026-01-01", averageRating: 5 }]),
        update: showUpdate,
      },
      track: { findMany: vi.fn() },
      raterStats: { findMany: vi.fn().mockResolvedValue([]) }, // newbie has no stats
      ratingSettings: { findFirst: vi.fn().mockResolvedValue(null) },
      $queryRaw: vi.fn().mockResolvedValue([{ mean: 4.07, stddev: 1 }]),
    } as never;
    await new RaterWeightService(db).recomputeRateable("Show", "s1");
    const data = (showUpdate.mock.calls[0][0] as { data: { weightedRating: number; weightedRatingsCount: number } })
      .data;
    expect(data.weightedRating).toBeCloseTo(5, 10);
    expect(data.weightedRatingsCount).toBe(1);
  });

  // Regression: a multi-account rater whose latest vote on a show came from their
  // SECONDARY account must still be scored with their real stats. The fix remaps each
  // vote to the canonical account before dedup, so rater_stats (stored under the
  // canonical id) are looked up by the canonical id — not the secondary id, which would
  // miss them and wrongly treat a known rater as a brand-new statless one.
  test("looks up a duplicate-account rater's stats by their canonical id", async () => {
    const raterStatsFindMany = vi
      .fn()
      .mockResolvedValue([
        { userId: "u-primary", era: "GLOBAL", mean: 4, entropy: 2, ratingsCount: 20, isExcluded: false },
      ]);
    const db = {
      user: {
        findMany: vi.fn().mockResolvedValue([
          { id: "u-primary", username: "Tractorbeam" },
          { id: "u-dup", username: "tractorbeam" }, // same person, case variant → canonical = u-primary (more ratings)
        ]),
      },
      rating: {
        findMany: vi.fn().mockResolvedValue([{ userId: "u-dup", value: 5, createdAt: new Date(2026, 0, 1) }]),
        groupBy: vi.fn().mockResolvedValue([
          { userId: "u-primary", _count: { id: 20 } },
          { userId: "u-dup", _count: { id: 1 } },
        ]),
      },
      show: {
        findMany: vi.fn().mockResolvedValue([{ id: "s1", date: "2026-01-01", averageRating: 5 }]),
        update: vi.fn().mockResolvedValue(undefined),
      },
      track: { findMany: vi.fn() },
      raterStats: { findMany: raterStatsFindMany },
      ratingSettings: { findFirst: vi.fn().mockResolvedValue(null) },
      $queryRaw: vi.fn().mockResolvedValue([{ mean: 4.07 }]),
    } as never;

    await new RaterWeightService(db).recomputeRateable("Show", "s1");

    const where = (raterStatsFindMany.mock.calls[0][0] as { where: { userId: { in: string[] } } }).where;
    expect(where.userId.in).toContain("u-primary"); // canonical id
    expect(where.userId.in).not.toContain("u-dup"); // not the secondary account
  });
});

describe("RaterWeightService.getDisplayedForShows", () => {
  // The displayed count must be the calibrated, post-exclusion count
  // (weighted_ratings_count), NOT the canonical deduped count — so the number shown
  // beside a calibrated score reflects the cleaned population it was built from. The
  // shrink itself still smooths by the deduped count.
  test("returns the calibrated count (weighted_ratings_count), shrinking by the deduped count", async () => {
    const db = {
      show: {
        findMany: vi
          .fn()
          .mockResolvedValue([{ id: "s1", weightedRating: 5, ratingsCount: 9, weightedRatingsCount: 3 }]),
      },
      ratingSettings: { findFirst: vi.fn().mockResolvedValue({ showShrinkAnchor: 3 }) },
    } as never;

    const byId = await new RaterWeightService(db).getDisplayedForShows(["s1"]);

    // count = weighted_ratings_count (3), the bomber-excluded contributing count.
    expect(byId.s1.count).toBe(3);
    // rating = shrinkToward(5, anchor 3, deduped count 9, k=3) = (5*9 + 3*3)/(9+3) = 4.5
    // (shrinking by the deduped 9, not the weighted 3 — which would give 4.0).
    expect(byId.s1.rating).toBeCloseTo(4.5, 10);
  });

  test("omits shows with no calibrated score", async () => {
    const db = {
      show: { findMany: vi.fn().mockResolvedValue([]) },
      ratingSettings: { findFirst: vi.fn().mockResolvedValue({ showShrinkAnchor: 3.93 }) },
    } as never;

    expect(await new RaterWeightService(db).getDisplayedForShows(["s1"])).toEqual({});
  });
});

describe("RaterWeightService.getCalibratedDistribution", () => {
  // A MARLON-era show (2026-01-01) rated by a full-range credible rater, a middle
  // one-note rater (always 3, NOT a bomber), and a flagged floor-bomber.
  function makeDb(overrides?: { bomberExcluded?: boolean; onenoteExcluded?: boolean }) {
    const ratingFindMany = vi.fn().mockResolvedValue([
      { userId: "credible", value: 5, createdAt: new Date("2026-01-02") },
      { userId: "onenote", value: 3, createdAt: new Date("2026-01-03") },
      { userId: "bomber", value: 0.5, createdAt: new Date("2026-01-04") },
    ]);
    const showFindMany = vi.fn().mockResolvedValue([{ id: "s1", date: "2026-01-01" }]);
    const raterStatsFindMany = vi.fn().mockResolvedValue([
      { userId: "credible", era: "GLOBAL", mean: 4, entropy: 2, ratingsCount: 20, isExcluded: false },
      {
        userId: "onenote",
        era: "MARLON",
        mean: 3,
        entropy: 0,
        ratingsCount: 12,
        isExcluded: overrides?.onenoteExcluded ?? false,
      },
      {
        userId: "bomber",
        era: "MARLON",
        mean: 0.5,
        entropy: 0,
        ratingsCount: 28,
        isExcluded: overrides?.bomberExcluded ?? true,
      },
    ]);
    const showUpdate = vi.fn().mockResolvedValue(undefined);
    const db = {
      user: { findMany: vi.fn().mockResolvedValue([]) }, // no alias dedup in this fixture
      rating: { findMany: ratingFindMany, groupBy: vi.fn().mockResolvedValue([]) },
      show: { findMany: showFindMany, update: showUpdate },
      track: { findMany: vi.fn() },
      raterStats: { findMany: raterStatsFindMany },
      ratingSettings: { findFirst: vi.fn().mockResolvedValue(null) },
      $queryRaw: vi.fn().mockResolvedValue([{ mean: 2.75 }]), // populationStats (recompute path only)
    } as never;
    return { db, showUpdate };
  }

  function asMap(buckets: Array<{ value: number; count: number }>): Record<number, number> {
    return Object.fromEntries(buckets.map((b) => [b.value, b.count]));
  }

  test("drops the era-flagged bomber but keeps a middle one-note rater (raw star values)", async () => {
    const { db } = makeDb();
    const buckets = await new RaterWeightService(db).getCalibratedDistribution("s1");
    // bomber (0.5) excluded; credible (5) and the non-extreme one-note (3) remain.
    expect(asMap(buckets)).toEqual({ 5: 1, 3: 1 });
  });

  test("its bar total equals the weighted_ratings_count the score path writes", async () => {
    const { db, showUpdate } = makeDb();
    const service = new RaterWeightService(db);
    const buckets = await service.getCalibratedDistribution("s1");
    await service.recomputeRateable("Show", "s1");
    const total = buckets.reduce((sum, b) => sum + b.count, 0);
    const written = (showUpdate.mock.calls[0][0] as { data: { weightedRatingsCount: number } }).data
      .weightedRatingsCount;
    expect(total).toBe(written);
  });

  test("falls back to the full deduped set when every rater is excluded (never empty)", async () => {
    const db = {
      user: { findMany: vi.fn().mockResolvedValue([]) },
      rating: {
        findMany: vi.fn().mockResolvedValue([
          { userId: "credible", value: 5, createdAt: new Date("2026-01-02") },
          { userId: "onenote", value: 3, createdAt: new Date("2026-01-03") },
          { userId: "bomber", value: 0.5, createdAt: new Date("2026-01-04") },
        ]),
        groupBy: vi.fn().mockResolvedValue([]),
      },
      show: { findMany: vi.fn().mockResolvedValue([{ id: "s1", date: "2026-01-01" }]) },
      track: { findMany: vi.fn() },
      raterStats: {
        findMany: vi.fn().mockResolvedValue([
          { userId: "credible", era: "MARLON", mean: 5, entropy: 0, ratingsCount: 10, isExcluded: true },
          { userId: "onenote", era: "MARLON", mean: 3, entropy: 0, ratingsCount: 12, isExcluded: true },
          { userId: "bomber", era: "MARLON", mean: 0.5, entropy: 0, ratingsCount: 28, isExcluded: true },
        ]),
      },
    } as never;
    const buckets = await new RaterWeightService(db).getCalibratedDistribution("s1");
    expect(asMap(buckets)).toEqual({ 5: 1, 3: 1, 0.5: 1 });
  });

  test("returns no buckets for an unrated show", async () => {
    const db = {
      user: { findMany: vi.fn().mockResolvedValue([]) },
      rating: { findMany: vi.fn().mockResolvedValue([]), groupBy: vi.fn().mockResolvedValue([]) },
      show: { findMany: vi.fn().mockResolvedValue([{ id: "s1", date: "2026-01-01" }]) },
      track: { findMany: vi.fn() },
      raterStats: { findMany: vi.fn().mockResolvedValue([]) },
    } as never;
    expect(await new RaterWeightService(db).getCalibratedDistribution("s1")).toEqual([]);
  });
});
