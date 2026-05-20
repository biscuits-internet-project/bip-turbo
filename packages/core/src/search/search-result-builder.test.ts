import type { SearchResult } from "@bip/domain";
import { describe, expect, test } from "vitest";
import { buildMixedSearchResults, type SongRowForResults, type VenueRowForResults } from "./search-result-builder";

// Helpers for compact fixtures. Disco Biscuits song/venue choices keep test
// intent obvious when scanning the assertions.
function songRow(
  opts: Partial<SongRowForResults> & Pick<SongRowForResults, "song_id" | "song_title" | "song_slug">,
): SongRowForResults {
  return { match_score: 100, ...opts };
}
function venueRow(
  opts: Partial<VenueRowForResults> & Pick<VenueRowForResults, "venue_id" | "venue_name" | "venue_slug">,
): VenueRowForResults {
  return { match_score: 100, venue_city: null, venue_state: null, ...opts };
}
function showResult(opts: Partial<SearchResult> & Pick<SearchResult, "id" | "score">): SearchResult {
  return {
    entityType: "show",
    entityId: opts.id,
    entitySlug: opts.id,
    displayText: "Some show",
    url: `/shows/${opts.id}`,
    ...opts,
  };
}

describe("buildMixedSearchResults", () => {
  // Core motivation: searching "Shadows" should surface the song page,
  // not just the list of shows where it was played.
  test("includes matching song as a song-entity SearchResult with /songs/<slug> url", () => {
    const results = buildMixedSearchResults({
      songs: [songRow({ song_id: "s1", song_title: "Shadows", song_slug: "shadows", match_score: 100 })],
      venues: [],
      shows: [],
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      entityType: "song",
      entityId: "s1",
      entitySlug: "shadows",
      url: "/songs/shadows",
      score: 100,
    });
  });

  // Songs with a stronger match score must outrank shows so the song-page link
  // appears at the top of the results list.
  test("orders a high-scoring song above lower-scoring shows", () => {
    const results = buildMixedSearchResults({
      songs: [
        songRow({ song_id: "s1", song_title: "Basis For A Day", song_slug: "basis-for-a-day", match_score: 100 }),
      ],
      venues: [],
      shows: [showResult({ id: "show1", score: 70 }), showResult({ id: "show2", score: 60 })],
    });

    expect(results[0].entityType).toBe("song");
    expect(results.slice(1).map((r) => r.entityType)).toEqual(["show", "show"]);
  });

  // Venues should also be searchable from the global bar — searching "Camp Bisco"
  // should surface the venue page, not just shows at that venue.
  test("includes matching venue as a venue-entity SearchResult with /venues/<slug> url", () => {
    const results = buildMixedSearchResults({
      songs: [],
      venues: [
        venueRow({
          venue_id: "v1",
          venue_name: "Camp Bisco",
          venue_slug: "camp-bisco",
          venue_city: "Mariaville",
          venue_state: "NY",
          match_score: 100,
        }),
      ],
      shows: [],
    });

    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      entityType: "venue",
      entityId: "v1",
      entitySlug: "camp-bisco",
      url: "/venues/camp-bisco",
      venueName: "Camp Bisco",
      venueLocation: "Mariaville, NY",
      score: 100,
    });
  });

  // Drop weak song matches (e.g., trigram-only hits) so the song bucket doesn't
  // pollute results when the query doesn't really refer to a song.
  test("filters out song matches below minSongScore", () => {
    const results = buildMixedSearchResults({
      songs: [
        songRow({ song_id: "strong", song_title: "Shadows", song_slug: "shadows", match_score: 100 }),
        songRow({ song_id: "weak", song_title: "Spaga", song_slug: "spaga", match_score: 20 }),
      ],
      venues: [],
      shows: [],
      minSongScore: 50,
    });

    expect(results.map((r) => r.entityId)).toEqual(["strong"]);
  });

  // Drop weak venue matches to avoid leaking unrelated venue hits.
  test("filters out venue matches below minVenueScore", () => {
    const results = buildMixedSearchResults({
      songs: [],
      venues: [
        venueRow({ venue_id: "strong", venue_name: "Camp Bisco", venue_slug: "camp-bisco", match_score: 100 }),
        venueRow({ venue_id: "weak", venue_name: "Random Bar", venue_slug: "random-bar", match_score: 5 }),
      ],
      shows: [],
      minVenueScore: 50,
    });

    expect(results.map((r) => r.entityId)).toEqual(["strong"]);
  });

  // Cap the number of injected song/venue results so they don't crowd out shows.
  test("caps songs at songLimit and venues at venueLimit", () => {
    const results = buildMixedSearchResults({
      songs: [
        songRow({ song_id: "s1", song_title: "Shadows", song_slug: "shadows", match_score: 100 }),
        songRow({ song_id: "s2", song_title: "Spaga", song_slug: "spaga", match_score: 99 }),
        songRow({ song_id: "s3", song_title: "Basis For A Day", song_slug: "basis-for-a-day", match_score: 98 }),
        songRow({ song_id: "s4", song_title: "M.E.M.P.H.I.S.", song_slug: "memphis", match_score: 97 }),
      ],
      venues: [],
      shows: [],
      songLimit: 2,
    });

    const songs = results.filter((r) => r.entityType === "song");
    expect(songs.map((r) => r.entityId)).toEqual(["s1", "s2"]);
  });

  // Final array must be sorted by score descending across all entity types so
  // the drawer can render it as-is.
  test("sorts the combined results by score desc across all types", () => {
    const results = buildMixedSearchResults({
      songs: [songRow({ song_id: "song-weak", song_title: "Shadows", song_slug: "shadows", match_score: 55 })],
      venues: [
        venueRow({ venue_id: "venue-strong", venue_name: "Camp Bisco", venue_slug: "camp-bisco", match_score: 95 }),
      ],
      shows: [showResult({ id: "show-mid", score: 75 })],
    });

    expect(results.map((r) => r.entityId)).toEqual(["venue-strong", "show-mid", "song-weak"]);
  });
});
