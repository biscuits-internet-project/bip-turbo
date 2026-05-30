import type { Annotation, SongPagePerformance } from "@bip/domain";
import { CacheKeys } from "@bip/domain";
import { Prisma } from "@prisma/client";
import { describe, expect, test, vi } from "vitest";
import {
  assignFilteredGaps,
  buildSetPositionKey,
  computeRarityStats,
  computeTagsForPerformance,
  isNarrowingFilter,
  type PerformanceDto,
  SongPageComposer,
  transformToSongPagePerformanceView,
} from "./song-page-composer";

// --- fixture helpers ---

function makePerformance(overrides: Partial<SongPagePerformance> = {}): SongPagePerformance {
  return {
    trackId: "track-1",
    show: {
      id: "show-1",
      slug: "2024-06-15",
      date: "2024-06-15",
      venueId: "venue-1",
      dayOrder: null,
      countForStats: true,
    },
    set: "S1",
    position: 3,
    segue: null,
    allTimer: false,
    annotations: [],
    ...overrides,
  };
}

function makeSetPositionData(
  entries: Array<[string, string, number, number]>,
): Map<string, { min: number; max: number }> {
  const map = new Map<string, { min: number; max: number }>();
  for (const [showId, set, min, max] of entries) {
    map.set(buildSetPositionKey(showId, set), { min, max });
  }
  return map;
}

function makeAnnotation(desc: string): Annotation {
  return {
    id: "ann-1",
    trackId: "track-1",
    desc,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  };
}

function makeDto(overrides: Partial<PerformanceDto> = {}): PerformanceDto {
  return {
    // Show fields
    id: "show-1",
    date: "2024-06-15",
    venue_id: "venue-1",
    slug: "2024-06-15",
    day_order: null,
    count_for_stats: true,
    // Venue fields
    venue_name: "The Capitol Theatre",
    venue_city: "Port Chester",
    venue_state: "NY",
    venue_slug: "the-cap",
    venue_country: "USA",
    // Track fields
    track_id: "track-1",
    song_id: "song-1",
    segue: null,
    set: "S1",
    position: 3,
    all_timer: false,
    average_rating: 4.5,
    ratings_count: 12,
    note: null,
    gap: null,
    duration: null,
    duration_source: null,
    previous_performance_show_id: null,
    previous_show_slug: null,
    previous_show_date: null,
    // Next/Prev track segues
    next_track_segue: null,
    prev_track_segue: null,
    // Next/Prev song fields
    next_song_id: null,
    next_song_title: null,
    next_song_slug: null,
    prev_song_id: null,
    prev_song_title: null,
    prev_song_slug: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// computeTagsForPerformance — pure tag classification
// ---------------------------------------------------------------------------

describe("computeTagsForPerformance", () => {
  // Sets starting with "E" (E1, E2, etc.) are encores. The encore check runs
  // first and short-circuits the opener/closer computation, because encores
  // aren't treated as normal sets.
  test("sets starting with E are tagged as encore, and skip opener/closer", () => {
    const setData = makeSetPositionData([["show-1", "E1", 1, 2]]);
    const tags = computeTagsForPerformance(makePerformance({ set: "E1", position: 1 }), setData);
    expect(tags.encore).toBe(true);
    expect(tags.setOpener).toBeUndefined();
    expect(tags.setCloser).toBeUndefined();

    // Second encore (E2) also matches
    const tags2 = computeTagsForPerformance(makePerformance({ set: "E2", position: 1 }), setData);
    expect(tags2.encore).toBe(true);
  });

  // Non-encore sets never have the `encore` tag set (absent, not false).
  // Distinction matters because downstream filter predicates check
  // `performance.tags?.encore` — truthy for `true`, falsy for `undefined`.
  test("non-encore sets do not set encore tag", () => {
    const setData = makeSetPositionData([["show-1", "S1", 1, 8]]);
    const tags = computeTagsForPerformance(makePerformance({ set: "S1", position: 3 }), setData);
    expect(tags.encore).toBeUndefined();
  });

  // The set opener is the track whose position equals the min for its
  // (show, set) pair. One-per-show-per-set by definition.
  test("position === min marks the performance as setOpener", () => {
    const setData = makeSetPositionData([["show-1", "S1", 1, 8]]);
    const tags = computeTagsForPerformance(makePerformance({ set: "S1", position: 1 }), setData);
    expect(tags.setOpener).toBe(true);
    expect(tags.setCloser).toBe(false);
  });

  // The set closer is the track whose position equals the max. Symmetric
  // with the opener test.
  test("position === max marks the performance as setCloser", () => {
    const setData = makeSetPositionData([["show-1", "S1", 1, 8]]);
    const tags = computeTagsForPerformance(makePerformance({ set: "S1", position: 8 }), setData);
    expect(tags.setCloser).toBe(true);
    expect(tags.setOpener).toBe(false);
  });

  // Edge case: a one-song set (common for encores, rare for main sets) has
  // min === max, so the single performance is both opener AND closer.
  test("single-song set marks the performance as both opener and closer", () => {
    const setData = makeSetPositionData([["show-1", "S2", 1, 1]]);
    const tags = computeTagsForPerformance(makePerformance({ set: "S2", position: 1 }), setData);
    expect(tags.setOpener).toBe(true);
    expect(tags.setCloser).toBe(true);
  });

  // Defensive behavior: if set-position data is missing for this show+set
  // (shouldn't happen in production, but could if the lookup is incomplete),
  // opener/closer tags are left absent rather than set to `false`.
  test("opener/closer tags are absent when set-position data is missing", () => {
    const setData = makeSetPositionData([]); // empty
    const tags = computeTagsForPerformance(makePerformance({ set: "S1", position: 1 }), setData);
    expect(tags.setOpener).toBeUndefined();
    expect(tags.setCloser).toBeUndefined();
  });

  // Segue tags are booleans based on adjacent track segues:
  //   - segueIn: the previous track in the show has a `segue` value
  //   - segueOut: THIS track has a `segue` value
  //   - standalone: neither
  // One test with three fixture variants covers all three cases.
  test("segueIn, segueOut, and standalone flags reflect adjacent segues", () => {
    const setData = makeSetPositionData([["show-1", "S1", 1, 8]]);

    // Both segues present
    const bothTags = computeTagsForPerformance(
      makePerformance({
        segue: ">",
        songBefore: { id: "b", songId: "b", segue: ">", songSlug: "prev", songTitle: "Prev" },
      }),
      setData,
    );
    expect(bothTags.segueIn).toBe(true);
    expect(bothTags.segueOut).toBe(true);
    expect(bothTags.standalone).toBe(false);

    // Only segue in
    const inTags = computeTagsForPerformance(
      makePerformance({
        segue: null,
        songBefore: { id: "b", songId: "b", segue: ">", songSlug: "prev", songTitle: "Prev" },
      }),
      setData,
    );
    expect(inTags.segueIn).toBe(true);
    expect(inTags.segueOut).toBe(false);
    expect(inTags.standalone).toBe(false);

    // Neither segue
    const noneTags = computeTagsForPerformance(makePerformance({ segue: null, songBefore: undefined }), setData);
    expect(noneTags.segueIn).toBe(false);
    expect(noneTags.segueOut).toBe(false);
    expect(noneTags.standalone).toBe(true);
  });

  // Inverted/dyslexic tags come from annotation text (case-insensitive
  // substring match on `annotation.desc`). Current impl uses
  // `annotationText.includes("inverted")`, so substrings like "not inverted"
  // would also match — noted for a future scoped discussion, but the current
  // behavior is what we're pinning.
  test("inverted and dyslexic tags match annotation desc case-insensitively", () => {
    const setData = makeSetPositionData([["show-1", "S1", 1, 8]]);

    const invertedTags = computeTagsForPerformance(
      makePerformance({ annotations: [makeAnnotation("Inverted version")] }),
      setData,
    );
    expect(invertedTags.inverted).toBe(true);
    expect(invertedTags.dyslexic).toBe(false);

    const dyslexicTags = computeTagsForPerformance(
      makePerformance({ annotations: [makeAnnotation("DYSLEXIC Cassidy")] }),
      setData,
    );
    expect(dyslexicTags.dyslexic).toBe(true);
    expect(dyslexicTags.inverted).toBe(false);

    const noAnnotationsTags = computeTagsForPerformance(makePerformance({ annotations: [] }), setData);
    expect(noAnnotationsTags.inverted).toBe(false);
    expect(noAnnotationsTags.dyslexic).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// transformToSongPagePerformanceView — DTO → view mapping
// ---------------------------------------------------------------------------

describe("transformToSongPagePerformanceView", () => {
  // Happy path: every DTO field is populated. Verifies the entire view shape
  // is built correctly.
  test("maps all DTO fields to the view shape", () => {
    const view = transformToSongPagePerformanceView(makeDto());

    expect(view.trackId).toBe("track-1");
    expect(view.show).toEqual({
      id: "show-1",
      slug: "2024-06-15",
      date: "2024-06-15",
      venueId: "venue-1",
      dayOrder: null,
      countForStats: true,
    });
    expect(view.venue).toEqual({
      id: "venue-1",
      slug: "the-cap",
      name: "The Capitol Theatre",
      city: "Port Chester",
      state: "NY",
      country: "USA",
    });
    expect(view.rating).toBe(4.5);
    expect(view.ratingsCount).toBe(12);
    expect(view.set).toBe("S1");
    expect(view.position).toBe(3);
    expect(view.allTimer).toBe(false);
    expect(view.segue).toBe(null);
  });

  // When the DTO has null venue fields (legacy shows with missing venue
  // relations), `venue` is set to `undefined` rather than building a
  // partial venue object.
  test("sets venue to undefined when venue fields are null", () => {
    const view = transformToSongPagePerformanceView(
      makeDto({ venue_id: null as never, venue_slug: null, venue_name: null }),
    );
    expect(view.venue).toBeUndefined();
  });

  // When the previous track fields are null (e.g., first track of the set
  // or a show with missing track relations), `songBefore` is `undefined`.
  test("sets songBefore to undefined when prev_song fields are null", () => {
    const view = transformToSongPagePerformanceView(
      makeDto({ prev_song_id: null, prev_song_title: null, prev_song_slug: null }),
    );
    expect(view.songBefore).toBeUndefined();
  });

  // Symmetric: last track of the set, or missing relations.
  test("sets songAfter to undefined when next_song fields are null", () => {
    const view = transformToSongPagePerformanceView(
      makeDto({ next_song_id: null, next_song_title: null, next_song_slug: null }),
    );
    expect(view.songAfter).toBeUndefined();
  });

  // When the DTO includes song-level fields (from the songs table join in
  // buildAllTimers), cover and authorId are mapped to the view.
  test("maps song_cover and song_author_id to cover and authorId", () => {
    const view = transformToSongPagePerformanceView(makeDto({ song_cover: true, song_author_id: "author-1" }));
    expect(view.cover).toBe(true);
    expect(view.authorId).toBe("author-1");
  });

  // When song-level fields are absent (build() path where songs isn't
  // joined), cover and authorId default to undefined/null.
  test("cover is undefined and authorId is null when song fields are absent", () => {
    const view = transformToSongPagePerformanceView(makeDto());
    expect(view.cover).toBeUndefined();
    expect(view.authorId).toBeNull();
  });

  // Null optional scalars map to `undefined` (via `|| undefined` in the
  // current impl). Documented quirk: `|| undefined` means `0` values also
  // become `undefined`, which is fine for rating/ratingsCount but worth
  // pinning so the behavior is explicit.
  // gap is denormalized on Track. The composer must surface gap and
  // previousPerformanceShowId on the view so the song-detail performances
  // table can render the Gap column without an extra query per row.
  test("maps gap and previous_performance_show_id through to the view", () => {
    const debutView = transformToSongPagePerformanceView(makeDto({ gap: null, previous_performance_show_id: null }));
    expect(debutView.gap).toBeNull();
    expect(debutView.previousPerformanceShowId).toBeNull();

    const subsequentView = transformToSongPagePerformanceView(
      makeDto({ gap: 7, previous_performance_show_id: "prior-show-id" }),
    );
    expect(subsequentView.gap).toBe(7);
    expect(subsequentView.previousPerformanceShowId).toBe("prior-show-id");
  });

  test("null rating, ratings_count, and note all map to undefined", () => {
    const view = transformToSongPagePerformanceView(
      makeDto({ average_rating: null as never, ratings_count: null as never, note: null }),
    );
    expect(view.rating).toBeUndefined();
    expect(view.ratingsCount).toBeUndefined();
    expect(view.notes).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// buildSetPositionKey — key format
// ---------------------------------------------------------------------------

describe("buildSetPositionKey", () => {
  // The exact key separator ("|||") is load-bearing: the same function is
  // called on both the writer side (when populating setPositionData from
  // SQL results) and the reader side (when looking up each performance's
  // set range). If the format ever drifts between those two sites, opener/
  // closer tags silently break. Pins the format so accidental changes fail.
  test('produces "showId|||set" format', () => {
    expect(buildSetPositionKey("show-1", "S1")).toBe("show-1|||S1");
    expect(buildSetPositionKey("abc-123", "E2")).toBe("abc-123|||E2");
  });
});

// ---------------------------------------------------------------------------
// buildFilterQuery — static filter-to-SQL builder
// ---------------------------------------------------------------------------

describe("buildFilterQuery", () => {
  // With no filter options, only the caller's base conditions should be
  // returned — no extra WHERE clauses or JOINs injected.
  test("returns only base conditions when no options provided", () => {
    const base = [Prisma.sql`tracks.all_timer = true`];
    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery(base);

    expect(conditions).toHaveLength(1);
    expect(extraJoins).toHaveLength(0);
  });

  // Boolean toggle filters (encore, segueOut, etc.) produce WHERE conditions,
  // not JOINs. Verifies the encore filter generates the expected SQL fragment.
  test("adds encore condition when encore is true", () => {
    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery([], { encore: true });

    expect(conditions.length).toBeGreaterThan(0);
    expect(extraJoins).toHaveLength(0);
    // The encore condition should reference tracks.set LIKE 'E%'
    const sql = conditions[0].strings.join("");
    expect(sql).toContain("tracks.set LIKE");
  });

  // The attended filter is special: it produces a JOIN (on the attendances
  // table) rather than a WHERE condition. Important because JOINs and
  // conditions are injected at different points in the SQL template.
  test("adds attendedUserId as a join, not a condition", () => {
    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery([], {
      attendedUserId: "user-123",
    });

    expect(conditions).toHaveLength(0);
    expect(extraJoins).toHaveLength(1);
    const joinSql = extraJoins[0].strings.join("");
    expect(joinSql).toContain("attendances");
  });

  // Multiple active filters are combined with AND: base conditions plus each
  // active filter's condition/join. Verifies the accumulation logic and that
  // JOINs and conditions are collected separately.
  test("combines multiple filters with AND semantics", () => {
    const base = [Prisma.sql`tracks.all_timer = true`];
    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery(base, {
      encore: true,
      segueOut: true,
      attendedUserId: "user-123",
    });

    // base + encore + segueOut = 3 conditions
    expect(conditions).toHaveLength(3);
    // attendedUserId produces a join
    expect(extraJoins).toHaveLength(1);
  });

  // The monthDay filter produces a LIKE condition on shows.date (VARCHAR
  // "YYYY-MM-DD") to match any year for a given month+day. Used by the
  // On This Day page to fetch all-timers for a calendar day.
  test("monthDay filter produces a LIKE condition on shows.date", () => {
    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery([], { monthDay: "04-08" });

    expect(conditions).toHaveLength(1);
    expect(extraJoins).toHaveLength(0);
    const sql = conditions[0].strings.join("");
    expect(sql).toContain("shows.date LIKE");
  });

  // monthDay composes with base conditions (e.g., all_timer = true) via AND,
  // so buildAllTimers({ monthDay }) produces the right two-condition WHERE.
  test("monthDay combines with base conditions", () => {
    const base = [Prisma.sql`tracks.all_timer = true`];
    const { conditions, extraJoins } = SongPageComposer.buildFilterQuery(base, { monthDay: "12-31" });

    expect(conditions).toHaveLength(2);
    expect(extraJoins).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// buildSongPerformanceCounts — aggregation query
// ---------------------------------------------------------------------------

describe("buildSongPerformanceCounts", () => {
  // Helper: creates a SongPageComposer with a mocked $queryRaw that returns
  // the given rows. Used to test the result transformation without hitting a DB.
  function createComposer(queryRawResult: Array<{ song_id: string; count: string }>) {
    const mockDb = {
      $queryRaw: vi.fn().mockResolvedValue(queryRawResult),
    };
    const mockSongService = {} as never;
    return { composer: new SongPageComposer(mockDb as never, mockSongService), mockDb };
  }

  // The raw SQL returns count as text (to avoid BigInt issues). Verifies
  // the method parses string counts into numbers and keys by song_id.
  test("returns Record<string, number> from raw query result rows", async () => {
    const { composer } = createComposer([
      { song_id: "song-1", count: "5" },
      { song_id: "song-2", count: "3" },
    ]);

    const result = await composer.buildSongPerformanceCounts();

    expect(result).toEqual({ "song-1": 5, "song-2": 3 });
  });

  // When no performances match the filter (e.g., no encores exist), the
  // result should be an empty object — not null, not undefined.
  test("returns empty record when no rows match", async () => {
    const { composer } = createComposer([]);

    const result = await composer.buildSongPerformanceCounts({ encore: true });

    expect(result).toEqual({});
  });

  // Verifies that the method actually executes a query when filters are
  // provided. The SQL correctness is tested via buildFilterQuery; this
  // confirms the integration point calls $queryRaw.
  test("passes filter options through to the query", async () => {
    const { composer, mockDb } = createComposer([]);

    await composer.buildSongPerformanceCounts({ encore: true, segueIn: true });

    expect(mockDb.$queryRaw).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// buildJamCharts — all-timers ∪ tracks-with-notes
// ---------------------------------------------------------------------------

describe("buildJamCharts", () => {
  // Flattens a $queryRaw mock call (TemplateStringsArray + Prisma.Sql
  // interpolations) into a single SQL string so the test can assert the
  // base WHERE clause is composed of the right two conditions. Prisma.Sql
  // exposes its raw template parts under `.strings`.
  function flattenSqlFromMockCall(call: unknown[]): string {
    const [templateStrings, ...interpolations] = call as [readonly string[], ...unknown[]];
    const interpolated = interpolations
      .map((v) => {
        if (v && typeof v === "object" && Array.isArray((v as { strings?: unknown[] }).strings)) {
          return (v as { strings: string[] }).strings.join(" ");
        }
        return "";
      })
      .join(" ");
    return `${[...templateStrings].join(" ")} ${interpolated}`;
  }

  function createComposer(rows: Array<Partial<PerformanceDto>>) {
    const mockDb = {
      $queryRaw: vi.fn().mockResolvedValue(rows.map((r) => makeDto(r as Partial<PerformanceDto>))),
      // enrichPerformances looks up annotations + previous-show data per
      // returned track. Stub both to empty so the test focuses on the
      // base WHERE composition and the result shape.
      annotation: { findMany: vi.fn().mockResolvedValue([]) },
    };
    const mockSongService = {} as never;
    return { composer: new SongPageComposer(mockDb as never, mockSongService), mockDb };
  }

  // The whole point of the jam-charts page: include tracks flagged as
  // all-timers AND tracks that carry a curated note, in a single result.
  // The WHERE clause must OR the two conditions so neither set is
  // dropped on the way to the UI.
  test("base WHERE clause unions all_timer with note IS NOT NULL", async () => {
    const { composer, mockDb } = createComposer([]);
    await composer.buildJamCharts();
    expect(mockDb.$queryRaw).toHaveBeenCalledTimes(1);
    const sql = flattenSqlFromMockCall(mockDb.$queryRaw.mock.calls[0]);
    expect(sql).toMatch(/tracks\.all_timer\s*=\s*true/);
    expect(sql).toMatch(/tracks\.note\s+IS\s+NOT\s+NULL/);
    // Empty-string notes must be filtered out too — the note column
    // historically allows '' as well as NULL for "no note", and the UI
    // treats both as absent.
    expect(sql).toMatch(/tracks\.note\s*<>\s*''/);
    // Both branches must be ORed together (otherwise note-only tracks
    // get filtered out when all_timer is false).
    expect(sql).toMatch(/all_timer.*OR.*note/s);
  });

  // The method returns the standard AllTimersPageView shape so the route
  // can drop it straight into PerformanceTable without bespoke wiring.
  test("returns AllTimersPageView shape (performances array) populated from rows", async () => {
    const { composer } = createComposer([
      { track_id: "t-allTimer", all_timer: true, note: null, song_id: "song-1" },
      { track_id: "t-note", all_timer: false, note: "Big Type II Spaga." },
    ]);
    const result = await composer.buildJamCharts();
    expect(result.performances).toHaveLength(2);
    const ids = result.performances.map((p) => p.trackId).sort();
    expect(ids).toEqual(["t-allTimer", "t-note"]);
  });

  // Filter options compose: jam-charts plus, say, a year range or cover
  // filter, should AND together. Verifies the call still goes through and
  // the additional filter shows up in the SQL.
  test("forwards filter options through buildFilterQuery", async () => {
    const { composer, mockDb } = createComposer([]);
    await composer.buildJamCharts({ monthDay: "07-26" });
    const sql = flattenSqlFromMockCall(mockDb.$queryRaw.mock.calls[0]);
    expect(sql).toMatch(/shows\.date\s+LIKE/);
  });
});

describe("buildSongPerformances populates songTitle/songSlug", () => {
  // The single-song composer queries without a song join (the song is
  // already known in context). The cross-song UI components that
  // consume `SongPagePerformance` (TrackRatingOverlay's popover header,
  // for instance) read `songTitle` / `songSlug` directly — so the
  // composer must fill those fields from the page's song context, or
  // the popover renders with an empty title.
  test("propagates the page song's title and slug onto every returned performance", async () => {
    const mockDb = {
      $queryRaw: vi.fn().mockResolvedValue([makeDto({ track_id: "t-1" }), makeDto({ track_id: "t-2" })]),
      annotation: { findMany: vi.fn().mockResolvedValue([]) },
    };
    const mockSongService = {
      findBySlug: vi.fn().mockResolvedValue({
        id: "song-1",
        title: "King of the World",
        slug: "king-of-the-world",
        cover: false,
        authorId: null,
      }),
    };
    const composer = new SongPageComposer(mockDb as never, mockSongService as never);

    const performances = await composer.buildSongPerformances("king-of-the-world");

    expect(performances).toHaveLength(2);
    for (const p of performances) {
      expect(p.songTitle).toBe("King of the World");
      expect(p.songSlug).toBe("king-of-the-world");
    }
  });
});

describe("CacheKeys.songs.jamCharts", () => {
  // Mirrors the cache-key shape of `allTimers`. Versioned suffix is
  // bumped together with the rest of the songs cache family.
  test("returns a stable, versioned key string", () => {
    expect(CacheKeys.songs.jamCharts()).toBe("songs:jam-charts:v4");
  });
});

// ---------------------------------------------------------------------------
// isNarrowingFilter — gate for filteredGap computation
// ---------------------------------------------------------------------------

describe("isNarrowingFilter", () => {
  // No options at all → nothing to narrow against. Callers skip filteredGap
  // computation and the column stays hidden.
  test("returns false when options is undefined", () => {
    expect(isNarrowingFilter(undefined)).toBe(false);
  });

  // Empty options object → no active filter. Same outcome as undefined.
  test("returns false for an empty options object", () => {
    expect(isNarrowingFilter({})).toBe(false);
  });

  // Cover/author filters pick which songs appear on /songs but don't narrow
  // which performances of a given song count — every performance of a cover
  // song is still a cover. They must NOT trigger filteredGap.
  test("returns false when only cover or author is set", () => {
    expect(isNarrowingFilter({ cover: true })).toBe(false);
    expect(isNarrowingFilter({ authorId: "author-1" })).toBe(false);
  });

  // Each narrowing axis on its own is sufficient. Parameterized so adding
  // a new narrowing filter shows up here visibly.
  test.each([
    ["startDate", { startDate: new Date("2024-01-01") }],
    ["endDate", { endDate: new Date("2024-12-31") }],
    ["attendedUserId", { attendedUserId: "user-1" }],
    ["encore", { encore: true }],
    ["setOpener", { setOpener: true }],
    ["setCloser", { setCloser: true }],
    ["segueIn", { segueIn: true }],
    ["segueOut", { segueOut: true }],
    ["standalone", { standalone: true }],
    ["inverted", { inverted: true }],
    ["dyslexic", { dyslexic: true }],
    ["allTimer", { allTimer: true }],
    ["monthDay", { monthDay: "07-26" }],
  ])("returns true when %s is set", (_label, options) => {
    expect(isNarrowingFilter(options)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// assignFilteredGaps — per-performance gap walk against the filtered universe
// ---------------------------------------------------------------------------

describe("assignFilteredGaps", () => {
  // Helper: builds a minimal SongPagePerformance with the fields the gap
  // walk reads (trackId, show.id, show.date, show.dayOrder, position).
  // Other fields kept thin so the test focuses on gap semantics.
  function perf(overrides: {
    trackId: string;
    showId: string;
    date: string;
    position?: number;
    dayOrder?: number | null;
  }): SongPagePerformance {
    return {
      trackId: overrides.trackId,
      show: {
        id: overrides.showId,
        slug: overrides.date,
        date: overrides.date,
        venueId: "venue-1",
        dayOrder: overrides.dayOrder ?? null,
        countForStats: true,
      },
      position: overrides.position ?? 1,
      set: "S1",
      segue: null,
      allTimer: false,
      annotations: [],
    };
  }

  // The very first filtered performance has no prior, so gap = null (★ debut
  // of filtered set). Subsequent performances get a number.
  test("first filtered performance has filteredGap null", () => {
    const performances = [perf({ trackId: "t-confrontation-2024", showId: "s-2024", date: "2024-06-15" })];

    assignFilteredGaps(performances, ["2024-06-15"]);

    expect(performances[0].filteredGap).toBeNull();
  });

  // Two filtered performances over a four-show filter-matching universe:
  // play #1 at index 0, play #2 at index 3 → exactly 2 matching shows
  // strictly between (indices 1, 2). Mirrors the existing Track.gap math.
  test("counts filter-matching shows strictly between consecutive performances", () => {
    const performances = [
      perf({ trackId: "t-basis-1", showId: "s-1", date: "2024-01-10" }),
      perf({ trackId: "t-basis-2", showId: "s-4", date: "2024-04-10" }),
    ];

    // Filter-matching set: 4 shows ordered chronologically. The song was
    // played at the first and the last; the 2 shows in the middle count.
    assignFilteredGaps(performances, ["2024-01-10", "2024-02-15", "2024-03-20", "2024-04-10"]);

    expect(performances[0].filteredGap).toBeNull();
    expect(performances[1].filteredGap).toBe(2);
  });

  // Within-show repeat: two performances at the same show. The gap walk
  // shares the same numeric gap across both — the icon (↺) in the cell
  // distinguishes the repeat, not the gap value. Mirrors Track.gap.
  test("within-show repeat shares the same filteredGap as the first occurrence", () => {
    const performances = [
      perf({ trackId: "t-aceetobee-pre", showId: "s-pre", date: "2024-01-10" }),
      perf({ trackId: "t-spaga-1", showId: "s-repeat", date: "2024-05-01", position: 2 }),
      perf({ trackId: "t-spaga-2", showId: "s-repeat", date: "2024-05-01", position: 7 }),
    ];

    assignFilteredGaps(performances, ["2024-01-10", "2024-03-01", "2024-05-01"]);

    expect(performances[0].filteredGap).toBeNull();
    // Both tracks at the repeat-show inherit the same gap value (1 show
    // between 2024-01-10 and 2024-05-01 in the filtered set).
    expect(performances[1].filteredGap).toBe(1);
    expect(performances[2].filteredGap).toBe(1);
  });

  // An empty filter-matching universe (no shows match the filter at all)
  // means even the song's own performances aren't in the universe. The
  // first performance is still a "debut" of the filtered set; subsequent
  // ones gap against the previous filtered performance — but the universe
  // has no other shows in between, so gap is 0.
  test("with no shows in matching universe between performances, gap is 0", () => {
    const performances = [
      perf({ trackId: "t-helicopters-1", showId: "s-a", date: "2024-01-10" }),
      perf({ trackId: "t-helicopters-2", showId: "s-b", date: "2024-02-10" }),
    ];

    // Only the song's own two shows are in the matching universe — nothing
    // else falls between them in the filtered set.
    assignFilteredGaps(performances, ["2024-01-10", "2024-02-10"]);

    expect(performances[0].filteredGap).toBeNull();
    expect(performances[1].filteredGap).toBe(0);
  });

  // The helper sorts internally before walking — callers can pass
  // performances in any order (e.g., a query that returned DESC) and the
  // gap math still uses canonical chronological order.
  test("walks chronologically even when input order is reversed", () => {
    const performances = [
      perf({ trackId: "t-late", showId: "s-late", date: "2024-04-10" }),
      perf({ trackId: "t-early", showId: "s-early", date: "2024-01-10" }),
    ];

    assignFilteredGaps(performances, ["2024-01-10", "2024-02-15", "2024-04-10"]);

    // Early track is the debut of the filtered set regardless of input order.
    const early = performances.find((p) => p.trackId === "t-early");
    const late = performances.find((p) => p.trackId === "t-late");
    expect(early?.filteredGap).toBeNull();
    expect(late?.filteredGap).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// buildFilteredSongRarity — per-song filtered analogs of /songs rarity columns
// ---------------------------------------------------------------------------

describe("buildFilteredSongRarity", () => {
  // The helper sequences two queries: first `getFilterMatchingShowDates`
  // (the matching universe), then a GROUP-BY-song aggregation (per-song
  // first/last filtered show + count). Mock both responses by chaining
  // `mockResolvedValueOnce`.
  function createComposer(
    matchingDates: Array<{ d: string }>,
    songRows: Array<{ song_id: string; show_count: string; first_date: string; last_date: string }>,
  ) {
    const $queryRaw = vi.fn().mockResolvedValueOnce(matchingDates).mockResolvedValueOnce(songRows);
    const mockDb = { $queryRaw };
    return new SongPageComposer(mockDb as never, {} as never);
  }

  // Empty song id list → short-circuits before any queries fire. Used by the
  // loader when the filter matched zero songs.
  test("returns an empty map when songIds is empty", async () => {
    const composer = createComposer([], []);

    const result = await composer.buildFilteredSongRarity([], { encore: true });

    expect(result.size).toBe(0);
  });

  // When the matching universe is empty (no shows fit the filter at all),
  // there can be no per-song aggregates — return empty without firing the
  // second query.
  test("returns an empty map when no shows match the filter", async () => {
    const composer = createComposer(
      [],
      [{ song_id: "above-the-waves", show_count: "0", first_date: "2024-01-01", last_date: "2024-01-01" }],
    );

    const result = await composer.buildFilteredSongRarity(["above-the-waves"], { encore: true });

    expect(result.size).toBe(0);
  });

  // Core math: a song played at the first and last of 5 matching shows.
  //  - filteredShowsSinceLastPlayed: shows strictly after last play  → 0
  //    (the last play IS the latest matching show).
  //  - showsOnOrAfterDebut: 5 (debut at index 0, inclusive).
  //  - filteredPercentSinceDebut: 2 / 5 = 0.4.
  //  - filteredAverageGapShows: shows-in-gaps / number-of-gaps =
  //    (5 - 2) / (2 - 1) = 3.0 (3 matching shows fell between the 2 plays).
  test("computes filteredShowsSinceLastPlayed, percentSinceDebut, averageShowsPerPlay against the matching universe", async () => {
    const composer = createComposer(
      [{ d: "2024-01-01" }, { d: "2024-02-01" }, { d: "2024-03-01" }, { d: "2024-04-01" }, { d: "2024-05-01" }],
      [{ song_id: "above-the-waves", show_count: "2", first_date: "2024-01-01", last_date: "2024-05-01" }],
    );

    const result = await composer.buildFilteredSongRarity(["above-the-waves"], { encore: true });

    const row = result.get("above-the-waves");
    expect(row?.filteredShowsSinceLastPlayed).toBe(0);
    expect(row?.filteredPercentSinceDebut).toBeCloseTo(0.4);
    expect(row?.filteredAverageGapShows).toBeCloseTo(3);
  });

  // When the song's last filtered play is the earliest matching show and
  // there are more matching shows after it → the gap is the number of
  // shows after. Sanity check that `countShowsAfter` semantics propagate.
  // A single play has no gaps to average, so filteredAverageGapShows
  // must be null (em-dash in the UI), not a degenerate 1.0.
  test("filteredShowsSinceLastPlayed counts matching shows strictly after the last filtered play", async () => {
    const composer = createComposer(
      [{ d: "2024-01-01" }, { d: "2024-02-01" }, { d: "2024-03-01" }, { d: "2024-04-01" }],
      [{ song_id: "confrontation", show_count: "1", first_date: "2024-01-01", last_date: "2024-01-01" }],
    );

    const result = await composer.buildFilteredSongRarity(["confrontation"], { attendedUserId: "user-1" });

    const row = result.get("confrontation");
    // Three matching shows are strictly after the one filtered play.
    expect(row?.filteredShowsSinceLastPlayed).toBe(3);
    // One filtered play → no gaps → null average.
    expect(row?.filteredAverageGapShows).toBeNull();
  });

  // Trailing-tail correctness: the song's filtered plays are clustered at
  // the start of the filter window and many matching shows have happened
  // since the last play. filteredAverageGapShows must be the mean of the
  // single closed gap (1 show between the two plays at indexes 0 and 2 of
  // 5), NOT inflated by the 2 matching shows in the trailing tail. The
  // earlier formula `(showsOnOrAfterDebut - timesPlayed) / (timesPlayed - 1)`
  // would have returned 3 — wrong, because it swept the tail into the
  // numerator. New formula uses `countShowsBetween(first, last)`.
  test("filteredAverageGapShows excludes the trailing tail after the last filtered play", async () => {
    const composer = createComposer(
      [{ d: "2024-01-01" }, { d: "2024-02-01" }, { d: "2024-03-01" }, { d: "2024-04-01" }, { d: "2024-05-01" }],
      [{ song_id: "electric-slinky", show_count: "2", first_date: "2024-01-01", last_date: "2024-03-01" }],
    );

    const result = await composer.buildFilteredSongRarity(["electric-slinky"], { encore: true });

    const row = result.get("electric-slinky");
    // 2 matching shows are strictly after the last filtered play (apr/may).
    expect(row?.filteredShowsSinceLastPlayed).toBe(2);
    // 1 matching show strictly between first (Jan) and last (Mar) play; one
    // closed gap → 1 / 1 = 1.
    expect(row?.filteredAverageGapShows).toBeCloseTo(1);
  });
});

// ---------------------------------------------------------------------------
// getFilterMatchingShowDates — denominator for filtered rarity columns
// ---------------------------------------------------------------------------

describe("getFilterMatchingShowDates", () => {
  // The helper returns the set of stats-eligible shows that contain at least
  // one track matching the active filters. It drives the "shows between" /
  // "shows since" counts for the Filtered Gap column on song detail and the
  // filtered rarity columns on /songs.
  function createComposer(queryRawResult: Array<{ d: string }>) {
    const mockDb = {
      $queryRaw: vi.fn().mockResolvedValue(queryRawResult),
    };
    return { composer: new SongPageComposer(mockDb as never, {} as never), mockDb };
  }

  // The raw query returns dates as `YYYY-MM-DD` strings, already ORDER BY'd
  // ascending. The method should pass them through as-is so callers can
  // binary-search via `countShowsAfter`.
  test("returns ISO date strings from raw query result rows", async () => {
    const { composer } = createComposer([{ d: "2024-06-15" }, { d: "2024-07-26" }, { d: "2024-12-31" }]);

    const result = await composer.getFilterMatchingShowDates({ encore: true });

    expect(result).toEqual(["2024-06-15", "2024-07-26", "2024-12-31"]);
  });

  // No filter combination matches → empty array, not null. Callers treat
  // empty as "no matching shows" and short-circuit downstream gap math.
  test("returns empty array when no rows match", async () => {
    const { composer } = createComposer([]);

    const result = await composer.getFilterMatchingShowDates({ encore: true, segueIn: true });

    expect(result).toEqual([]);
  });

  // Confirms the helper actually executes a query when called. SQL
  // correctness is covered by buildFilterQuery tests; this just verifies
  // the integration point fires.
  test("executes a query through the db client", async () => {
    const { composer, mockDb } = createComposer([{ d: "2024-06-15" }]);

    await composer.getFilterMatchingShowDates({ attendedUserId: "user-1" });

    expect(mockDb.$queryRaw).toHaveBeenCalledTimes(1);
  });

  // No filters at all → still queries (returns all stats-eligible shows).
  // Callers may pass `{}` when there's no narrowing; the method must not
  // throw or short-circuit before issuing the query.
  test("executes a query even when no filter options are provided", async () => {
    const { composer, mockDb } = createComposer([{ d: "2024-01-01" }]);

    const result = await composer.getFilterMatchingShowDates({});

    expect(mockDb.$queryRaw).toHaveBeenCalledTimes(1);
    expect(result).toEqual(["2024-01-01"]);
  });
});

// ---------------------------------------------------------------------------
// CacheKeys — on-this-day all-timers key
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// countAllTimersByMonthDay — raw count query
// ---------------------------------------------------------------------------

describe("countAllTimersByMonthDay", () => {
  // Parses the raw SQL count string result into a number. Used by the
  // home page to show how many all-timer performances occurred on a day.
  test("returns parsed count from raw query", async () => {
    const mockDb = {
      $queryRaw: vi.fn().mockResolvedValue([{ count: "12" }]),
    };
    const composer = new SongPageComposer(mockDb as never, {} as never);

    const result = await composer.countAllTimersByMonthDay("04-08");

    expect(result).toBe(12);
    expect(mockDb.$queryRaw).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// CacheKeys — on-this-day keys
// ---------------------------------------------------------------------------

describe("CacheKeys", () => {
  // The on-this-day all-timers cache key must embed the monthDay so each
  // calendar day gets its own cache entry.
  test("allTimersOnThisDay includes the monthDay in the key", () => {
    expect(CacheKeys.songs.allTimersOnThisDay("04-08")).toBe("songs:all-timers:on-this-day:04-08:v3");
  });

  // The on-this-day counts cache key is used by the home page to cache
  // show + all-timer counts for today's calendar day.
  test("onThisDayCounts includes the monthDay in the key", () => {
    expect(CacheKeys.shows.onThisDayCounts("04-08")).toBe("shows:on-this-day-counts:04-08");
  });
});

// ---------------------------------------------------------------------------
// computeRarityStats — pure rarity math driven by the per-year show counts
// ---------------------------------------------------------------------------

describe("computeRarityStats", () => {
  // Song that debuted in the catalogue's earliest year: all five fields
  // populate, percentages compute against their proper denominators, and
  // Before + Since must equal totalShows. That invariant is the whole
  // reason we split the pair this way, so it gets its own assertion.
  test("debut in earliest year yields complementary Before/Since and full percentages", () => {
    const showsByYear = { 2000: 50, 2001: 60, 2002: 70, 2003: 80 };
    const dateFirstPlayed = new Date(Date.UTC(2000, 5, 15));
    const timesPlayed = 130;

    const result = computeRarityStats({ dateFirstPlayed, timesPlayed }, showsByYear);

    expect(result.totalShows).toBe(260);
    expect(result.showsBeforeDebut).toBe(0);
    expect(result.showsSinceDebut).toBe(260);
    expect(result.percentOfAllShows).toBeCloseTo(0.5, 5);
    expect(result.percentSinceDebut).toBeCloseTo(0.5, 5);
    expect((result.showsBeforeDebut ?? 0) + (result.showsSinceDebut ?? 0)).toBe(result.totalShows);
  });

  // Song that entered the rotation late: most of the catalogue precedes
  // the debut year, and Since is the debut-year-onward sum (year cutoff
  // is inclusive of the debut year). % Since Debut should be higher than
  // % of All Shows for a song with these proportions.
  test("recent debut puts most of the catalogue in Before and inclusively buckets the debut year into Since", () => {
    const showsByYear = { 2000: 50, 2001: 60, 2002: 70, 2003: 80, 2024: 40, 2025: 20 };
    const dateFirstPlayed = new Date(Date.UTC(2024, 2, 1));
    const timesPlayed = 6;

    const result = computeRarityStats({ dateFirstPlayed, timesPlayed }, showsByYear);

    expect(result.totalShows).toBe(320);
    expect(result.showsBeforeDebut).toBe(260);
    expect(result.showsSinceDebut).toBe(60);
    expect(result.percentOfAllShows).toBeCloseTo(6 / 320, 5);
    expect(result.percentSinceDebut).toBeCloseTo(6 / 60, 5);
    // Sanity: scarcity reads stronger against the song's own era.
    expect(result.percentSinceDebut).toBeGreaterThan(result.percentOfAllShows ?? 0);
  });

  // No debut date: Before/Since/% Since must all be null so the UI can
  // render "—" without dividing by zero or producing NaN/Infinity.
  // % of All Shows is 0 (real and meaningful: the song accounts for none
  // of the catalogue). totalShows still populates because it's
  // catalogue-level, not song-level.
  test("never-played song nulls debut-relative fields and avoids divide-by-zero", () => {
    const showsByYear = { 2000: 50, 2001: 60 };

    const result = computeRarityStats({ dateFirstPlayed: null, timesPlayed: 0 }, showsByYear);

    expect(result.totalShows).toBe(110);
    expect(result.showsBeforeDebut).toBeNull();
    expect(result.showsSinceDebut).toBeNull();
    expect(result.percentSinceDebut).toBeNull();
    expect(result.percentOfAllShows).toBe(0);
  });

  // Single-play song still gets percentSinceDebut populated (1 play out of
  // the 1 show in the song's era = 100%). Avg/median/longest gap stats live
  // on the page composer, not here, since they require track-level data.
  test("single-play song still computes percentSinceDebut", () => {
    const showsByYear = { 2024: 50 };
    const dateFirstPlayed = new Date(Date.UTC(2024, 0, 1));

    const result = computeRarityStats({ dateFirstPlayed, timesPlayed: 1 }, showsByYear);

    expect(result.percentSinceDebut).toBeCloseTo(1 / 50, 5);
  });
});
