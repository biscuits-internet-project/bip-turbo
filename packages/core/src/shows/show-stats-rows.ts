import { type ShowStatsRow, START_YEAR } from "@bip/domain";
import { Prisma } from "@prisma/client";
import { nonStubShowsSql, showOrderBySql } from "../_shared/show-ordering";
import { noteworthyTrackSql } from "../tracks/noteworthy-track";

/**
 * Raw column shape `showStatsRowsSql` projects. Counts are cast to `int` in the
 * query rather than arriving as `bigint`, so every numeric field maps straight
 * across — with a dozen numbers per row, one cast in SQL beats a dozen
 * `Number()` calls and the one that eventually gets forgotten. `slug` is
 * non-null because the query filters slugless rows out.
 */
export interface RawShowStatsRow {
  id: string;
  slug: string;
  date: string;
  count_for_stats: boolean;
  venue_name: string | null;
  venue_city: string | null;
  venue_state: string | null;
  average_rating: number | null;
  ratings_count: number;
  duration: number | null;
  untimed_tracks: number | null;
  median_gap: number | null;
  longest_gap: number | null;
  vintage: number | null;
  jam_charts: number | null;
  photos_count: number;
  youtube_count: number;
}

/**
 * Every show with its setlist rarity numbers, one row each — the single row-set
 * definition behind `/shows/stats`, the year page's table view, and a
 * musician profile's shows section, so the three can't drift.
 *
 * `count_for_stats=false` shows are INCLUDED: the table renders them dimmed and
 * offers a filter, because each row's numbers describe that show's own setlist
 * rather than aggregating across shows. Orphan placeholder shows (no venue) are
 * excluded via `nonStubShowsSql` — they duplicate a real show on the same date
 * and a user can't act on them.
 *
 * The rarity aggregates MUST match what a single show's page reports for itself,
 * or the same show reads two different numbers depending on where you look. The
 * show page computes these in TypeScript over one loaded setlist; this query has
 * to reproduce those rules over the whole catalog at once:
 *
 *   Gap — `eligibleGapsForAggregation` in setlist-service: drop debuts
 *   (`gap IS NULL`), keep one row per song (its earliest position), then take a
 *   CONTINUOUS median, which averages the two middle values on an even count.
 *
 *   Vintage — `computeDebutYearStats` in debut-year-chart: one row per song,
 *   skip songs whose debut year falls outside [START_YEAR, this show's year],
 *   continuous median, rounded to a whole year.
 *
 * `PERCENTILE_CONT` (not `_DISC`) is load-bearing: the discrete form returns the
 * lower of the two middle values, which is how the table came to report a 1998
 * vintage for a show whose own page said 2000.
 *
 * Jam charts and untimed tracks deliberately DON'T dedupe — they count
 * performances, not repertoire, so a song noted twice in a night is two.
 */
export function showStatsRowsSql(): Prisma.Sql {
  return Prisma.sql`
    WITH show_tracks AS (
      SELECT t.show_id,
             t.gap,
             t.duration,
             t.all_timer,
             t.note,
             EXTRACT(YEAR FROM sg.date_first_played)::int AS debut_year,
             EXTRACT(YEAR FROM s.date::date)::int AS show_year,
             ROW_NUMBER() OVER (PARTITION BY t.show_id, t.song_id ORDER BY t.position) AS song_occurrence
      FROM tracks t
      JOIN songs sg ON sg.id = t.song_id
      JOIN shows s ON s.id = t.show_id
    ),
    per_show AS (
      SELECT show_id,
             COUNT(*) FILTER (WHERE ${noteworthyTrackSql("show_tracks")})::int AS jam_charts,
             COUNT(*) FILTER (WHERE duration IS NULL)::int AS untimed_tracks,
             PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY gap)
               FILTER (WHERE song_occurrence = 1) AS median_gap,
             MAX(gap) FILTER (WHERE song_occurrence = 1)::int AS longest_gap,
             ROUND(
               PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY debut_year)
                 FILTER (WHERE song_occurrence = 1 AND debut_year BETWEEN ${START_YEAR} AND show_year)
             )::int AS vintage
      FROM show_tracks
      GROUP BY show_id
    )
    SELECT s.id,
           s.slug,
           s.date,
           s.count_for_stats,
           v.name AS venue_name,
           v.city AS venue_city,
           v.state AS venue_state,
           s.average_rating,
           s.ratings_count,
           s.duration,
           p.untimed_tracks,
           p.median_gap,
           p.longest_gap,
           p.vintage,
           p.jam_charts,
           s.show_photos_count AS photos_count,
           s.show_youtubes_count AS youtube_count
    FROM shows s
    LEFT JOIN venues v ON v.id = s.venue_id
    LEFT JOIN per_show p ON p.show_id = s.id
    WHERE ${nonStubShowsSql("s")}
      AND s.slug IS NOT NULL
    ORDER BY ${showOrderBySql("s", "DESC")}
  `;
}

/**
 * Project one raw row onto the domain shape. Two things the query can't express
 * cleanly land here: the unrated-show gate, and defaulting a setlist-less show's
 * counts to zero.
 */
export function mapShowStatsRow(raw: RawShowStatsRow): ShowStatsRow {
  return {
    id: raw.id,
    slug: raw.slug,
    date: raw.date,
    countForStats: raw.count_for_stats,
    venueName: raw.venue_name,
    venueCity: raw.venue_city,
    venueState: raw.venue_state,
    // `shows.average_rating` defaults to 0 instead of NULL, so an unrated show
    // would otherwise render a hard 0.00 and sort below genuinely low-rated
    // shows. Same gate as RatingService.getAveragesForRateables.
    averageRating: raw.ratings_count > 0 ? raw.average_rating : null,
    ratingsCount: raw.ratings_count,
    duration: raw.duration,
    medianGap: raw.median_gap,
    untimedTracks: raw.untimed_tracks ?? 0,
    longestGap: raw.longest_gap,
    vintage: raw.vintage,
    // The tracks aggregate is LEFT JOINed: a show with no setlist entered yields
    // a NULL count but still belongs in the table.
    jamCharts: raw.jam_charts ?? 0,
    photosCount: raw.photos_count,
    youtubeCount: raw.youtube_count,
  };
}
