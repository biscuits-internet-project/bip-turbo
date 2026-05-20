import type { SearchResult } from "@bip/domain";

/**
 * Raw song-search SQL row, narrowed to the fields needed for result building.
 * Decoupled from the larger SongResult type in postgres-search-service.ts so
 * the builder stays unit-testable without a database.
 */
export interface SongRowForResults {
  song_id: string;
  song_title: string;
  song_slug: string;
  match_score: number;
}

/**
 * Raw venue-search SQL row, narrowed to the fields needed for result building.
 * City/state are optional but used to build the displayed location string.
 */
export interface VenueRowForResults {
  venue_id: string;
  venue_name: string;
  venue_slug: string;
  match_score: number;
  venue_city?: string | null;
  venue_state?: string | null;
}

export interface BuildMixedSearchResultsOptions {
  songs?: SongRowForResults[];
  venues?: VenueRowForResults[];
  shows: SearchResult[];
  songLimit?: number;
  venueLimit?: number;
  minSongScore?: number;
  minVenueScore?: number;
}

const DEFAULT_SONG_LIMIT = 3;
const DEFAULT_VENUE_LIMIT = 3;
const DEFAULT_MIN_SONG_SCORE = 50;
const DEFAULT_MIN_VENUE_SCORE = 50;

/**
 * Compose the global search drawer's final result list from raw song, venue,
 * and (already-converted) show results. Songs and venues are added as their
 * own entity-typed SearchResults so the drawer can link directly to
 * /songs/<slug> and /venues/<slug>, rather than only showing shows that played
 * the song or were held at the venue. Weak matches are filtered and the
 * combined list is sorted by score so the drawer can render it as-is.
 */
export function buildMixedSearchResults({
  songs = [],
  venues = [],
  shows,
  songLimit = DEFAULT_SONG_LIMIT,
  venueLimit = DEFAULT_VENUE_LIMIT,
  minSongScore = DEFAULT_MIN_SONG_SCORE,
  minVenueScore = DEFAULT_MIN_VENUE_SCORE,
}: BuildMixedSearchResultsOptions): SearchResult[] {
  const songResults: SearchResult[] = songs
    .filter((s) => s.match_score >= minSongScore)
    .slice(0, songLimit)
    .map((s) => ({
      id: s.song_id,
      entityType: "song",
      entityId: s.song_id,
      entitySlug: s.song_slug,
      displayText: s.song_title,
      score: Math.min(100, Math.round(s.match_score)),
      url: `/songs/${s.song_slug}`,
      songTitle: s.song_title,
    }));

  const venueResults: SearchResult[] = venues
    .filter((v) => v.match_score >= minVenueScore)
    .slice(0, venueLimit)
    .map((v) => {
      const location =
        v.venue_city && v.venue_state
          ? `${v.venue_city}, ${v.venue_state}`
          : v.venue_city || v.venue_state || undefined;
      return {
        id: v.venue_id,
        entityType: "venue",
        entityId: v.venue_id,
        entitySlug: v.venue_slug,
        displayText: location ? `${v.venue_name} • ${location}` : v.venue_name,
        score: Math.min(100, Math.round(v.match_score)),
        url: `/venues/${v.venue_slug}`,
        venueName: v.venue_name,
        venueLocation: location,
      };
    });

  return [...songResults, ...venueResults, ...shows].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
