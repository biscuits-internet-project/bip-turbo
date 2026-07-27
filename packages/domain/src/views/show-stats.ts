/**
 * One row of the cross-show statistics table (`/shows/stats`, the year page's
 * table view, and a musician profile's shows section). Deliberately flat and
 * primitive-only: the whole catalog ships to the client in a single payload so
 * sorting, filtering, and pagination all happen there, and every extra nested
 * object costs ~2k rows' worth of JSON.
 *
 * The rarity numbers describe the show's own setlist — the median and longest
 * `Track.gap` across its tracks, and the median debut year of the songs played
 * — so a row stays meaningful whether or not the viewer has narrowed the table
 * to stats-eligible shows.
 */
export interface ShowStatsRow {
  id: string;
  slug: string;
  date: string;
  /** False for soundchecks, radio sessions, and late-night side-project sets. */
  countForStats: boolean;

  venueName: string | null;
  venueCity: string | null;
  venueState: string | null;

  /**
   * Community average + count, denormalized on `shows`. Null when unrated.
   * These ship with the row (rather than coming from the per-viewer endpoint
   * alongside attendance) so ratings render on first paint. A viewer in
   * calibrated mode gets their shrunk score layered on top client-side.
   */
  averageRating: number | null;
  ratingsCount: number;

  /** Total run time in seconds — the sum of the show's track durations. */
  duration: number | null;
  /**
   * Tracks with no resolved duration. Non-zero means `duration` is a partial
   * sum, which the UI has to flag rather than present as the show's real length.
   */
  untimedTracks: number;

  /** Median shows-since-last-played across the show's tracks. Null on a show with no gap data. */
  medianGap: number | null;
  /** The show's rarest song, by shows since it was last played. */
  longestGap: number | null;
  /** Median debut year of the songs played — how vintage the setlist is. */
  vintage: number | null;

  /** Tracks that are all-timers or carry a curator note. */
  jamCharts: number;
  /** Denormalized media counts, backing the photos / youtube tri-state filters. */
  photosCount: number;
  youtubeCount: number;
}
