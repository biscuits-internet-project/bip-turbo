import type { Annotation, SongPagePerformance } from "@bip/domain";
import { describe, expect, test } from "vitest";
import {
  buildSetPositionKey,
  computeTagsForPerformance,
  type PerformanceDto,
  transformToSongPagePerformanceView,
} from "./song-page-composer";

// --- fixture helpers ---

function makePerformance(overrides: Partial<SongPagePerformance> = {}): SongPagePerformance {
  return {
    trackId: "track-1",
    show: { id: "show-1", slug: "2024-06-15", date: "2024-06-15", venueId: "venue-1" },
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

  // Null optional scalars map to `undefined` (via `|| undefined` in the
  // current impl). Documented quirk: `|| undefined` means `0` values also
  // become `undefined`, which is fine for rating/ratingsCount but worth
  // pinning so the behavior is explicit.
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
