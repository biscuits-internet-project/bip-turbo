import { describe, expect, test } from "vitest";
import { noteworthyTrackSql } from "../tracks/noteworthy-track";
import { mapShowStatsRow, type RawShowStatsRow, showStatsRowsSql } from "./show-stats-rows";

describe("showStatsRowsSql", () => {
  // The jam-charts count and the jamChart performance filter are the same
  // definition; this is the wiring that keeps them one source rather than two
  // hand-written copies that agree until someone edits one.
  test("counts jam charts through the shared noteworthy predicate", () => {
    expect(showStatsRowsSql().sql).toContain(noteworthyTrackSql("show_tracks").sql);
  });

  // A show's own page reports these numbers over one row per song, using a
  // continuous median. The discrete form returns the lower of two middle
  // values, which is how the table came to say a 1998 vintage for a show whose
  // page said 2000 — on 651 shows.
  test("takes both medians continuously, over one row per song", () => {
    const { sql } = showStatsRowsSql();

    expect(sql).not.toContain("PERCENTILE_DISC");
    expect(sql.match(/PERCENTILE_CONT/g)).toHaveLength(2);
    expect(sql.match(/song_occurrence = 1/g)?.length).toBeGreaterThanOrEqual(3);
  });

  // Jam charts and untimed tracks count performances, not repertoire, so they
  // deliberately skip the per-song dedupe the rarity numbers apply.
  test("counts untimed tracks without deduping to one row per song", () => {
    const { sql } = showStatsRowsSql();
    const untimedClause = sql.slice(0, sql.indexOf("AS untimed_tracks"));

    expect(untimedClause.slice(-80)).toContain("duration IS NULL");
    expect(untimedClause.slice(-80)).not.toContain("song_occurrence");
  });

  test("bounds debut years to the catalog window and the show's own year", () => {
    const { sql, values } = showStatsRowsSql();

    expect(sql).toContain("debut_year BETWEEN");
    expect(sql).toContain("AND show_year");
    expect(values).toContain(1995);
  });

  // Orphan placeholder rows duplicate a real show on the same date and can't be
  // acted on, so they never reach the table.
  test("excludes venueless and slugless shows", () => {
    const { sql } = showStatsRowsSql();

    expect(sql).toContain("venue_id IS NOT NULL");
    expect(sql).toContain("s.slug IS NOT NULL");
  });
});

function makeRaw(overrides: Partial<RawShowStatsRow> = {}): RawShowStatsRow {
  return {
    id: "show-1",
    slug: "1999-12-31-theater-of-the-living-arts-philadelphia-pa",
    date: "1999-12-31",
    count_for_stats: true,
    venue_name: "Theater of the Living Arts",
    venue_city: "Philadelphia",
    venue_state: "PA",
    average_rating: 4.74,
    ratings_count: 27,
    duration: 17655,
    untimed_tracks: 0,
    median_gap: 5,
    longest_gap: 104,
    vintage: 1997,
    jam_charts: 4,
    photos_count: 2,
    youtube_count: 1,
    ...overrides,
  };
}

describe("mapShowStatsRow", () => {
  test("renames the query's snake_case columns onto the domain row", () => {
    expect(mapShowStatsRow(makeRaw())).toEqual({
      id: "show-1",
      slug: "1999-12-31-theater-of-the-living-arts-philadelphia-pa",
      date: "1999-12-31",
      countForStats: true,
      venueName: "Theater of the Living Arts",
      venueCity: "Philadelphia",
      venueState: "PA",
      averageRating: 4.74,
      ratingsCount: 27,
      duration: 17655,
      untimedTracks: 0,
      medianGap: 5,
      longestGap: 104,
      vintage: 1997,
      jamCharts: 4,
      photosCount: 2,
      youtubeCount: 1,
    });
  });

  test("reports an unrated show as having no average, not an average of zero", () => {
    // `shows.average_rating` defaults to 0 rather than NULL, so 128 shows in the
    // catalog would otherwise render a hard 0.00 and sort below genuinely bad
    // shows. Mirrors the gate in RatingService.getAveragesForRateables.
    const row = mapShowStatsRow(makeRaw({ average_rating: 0, ratings_count: 0 }));

    expect(row.averageRating).toBeNull();
    expect(row.ratingsCount).toBe(0);
  });

  test("keeps a genuine zero average when the show has ratings", () => {
    const row = mapShowStatsRow(makeRaw({ average_rating: 0, ratings_count: 3 }));

    expect(row.averageRating).toBe(0);
  });

  test("passes through missing rarity numbers so the cells can render an em dash", () => {
    const row = mapShowStatsRow(makeRaw({ duration: null, median_gap: null, longest_gap: null, vintage: null }));

    expect(row.duration).toBeNull();
    expect(row.medianGap).toBeNull();
    expect(row.longestGap).toBeNull();
    expect(row.vintage).toBeNull();
  });

  test("counts a show with no setlist as zero jam charts rather than dropping it", () => {
    // The tracks aggregate is LEFT JOINed, so a show with no setlist entered
    // yields a NULL count. Those shows still belong in the table.
    const row = mapShowStatsRow(makeRaw({ jam_charts: null, photos_count: 0 }));

    expect(row.jamCharts).toBe(0);
  });
});
