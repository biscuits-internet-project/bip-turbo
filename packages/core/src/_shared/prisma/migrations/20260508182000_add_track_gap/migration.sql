-- Adds denormalized gap + previous-performance pointer to tracks. The gap
-- column stores the count of shows strictly between this performance and
-- the song's prior performance. NULL gap means either a debut OR a track on
-- a show with count_for_stats=false (soundcheck/radio/cancelled/etc) which
-- is invisible to the stats walk.
--
-- Ordering rules used here and in the matching service code:
--   1. show.date ASC
--   2. show.day_order ASC NULLS LAST  (tiebreaker for same-date shows)
--   3. track.position ASC             (tiebreaker within a show)
--   4. show.id                        (final stable tiebreaker for unset day_order)
--
-- Stats rules:
--   * The "shows between" denominator counts only count_for_stats=true shows.
--   * count_for_stats=false shows can POINT AT a prior count_for_stats=true
--     performance via gap+prev (so someone viewing a soundcheck row sees
--     "last really played N shows ago"), but they are NEVER pointed at —
--     the next count_for_stats=true performance walks back past them to
--     the prior count_for_stats=true performance. This is implemented as
--     two passes below: pass 1 handles stats-shows via LAG over the
--     stats-only chain; pass 2 handles non-stats-shows via LATERAL lookup
--     of the most recent prior stats-show.
--   * Song.timesPlayed / dateFirstPlayed / dateLastPlayed / yearlyPlayData
--     are recomputed below to exclude count_for_stats=false shows.

ALTER TABLE "tracks"
  ADD COLUMN "gap" INTEGER,
  ADD COLUMN "previous_performance_show_id" UUID;

ALTER TABLE "tracks"
  ADD CONSTRAINT "fk_tracks_previous_performance_show_id"
  FOREIGN KEY ("previous_performance_show_id")
  REFERENCES "shows"("id")
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

-- =========================================================================
-- Track.gap + Track.previous_performance_show_id backfill (two passes)
-- =========================================================================

-- Pass 1: count_for_stats=true tracks. LAG over the stats-only chain gives
-- each (song, stats-show) its prior stats-show. Within-show repeats share
-- via DISTINCT ON.
WITH first_per_show AS (
  SELECT DISTINCT ON (t.song_id, t.show_id)
    t.song_id,
    t.show_id,
    s.date AS show_date,
    LAG(t.show_id) OVER w  AS prev_show_id,
    LAG(s.date)    OVER w  AS prev_show_date
  FROM tracks t
  JOIN shows s ON s.id = t.show_id
  WHERE s.count_for_stats = TRUE
  WINDOW w AS (
    PARTITION BY t.song_id
    ORDER BY s.date, s.day_order NULLS LAST, t.position, s.id
  )
  ORDER BY t.song_id, t.show_id, s.date, s.day_order NULLS LAST, t.position, s.id
),
gap_per_show AS (
  SELECT
    fps.song_id,
    fps.show_id,
    fps.prev_show_id,
    CASE
      WHEN fps.prev_show_date IS NULL THEN NULL
      ELSE (
        SELECT COUNT(*)::INTEGER
        FROM shows s2
        WHERE s2.date > fps.prev_show_date
          AND s2.date < fps.show_date
          AND s2.count_for_stats = TRUE
      )
    END AS gap
  FROM first_per_show fps
)
UPDATE tracks t
   SET gap = gps.gap,
       previous_performance_show_id = gps.prev_show_id
  FROM gap_per_show gps
 WHERE gps.song_id = t.song_id
   AND gps.show_id = t.show_id;

-- Pass 2: count_for_stats=false tracks. For each (song, non-stats-show)
-- find the most recent prior count_for_stats=true performance of the same
-- song via LATERAL. Gap = stats-shows strictly between those two dates.
WITH non_stats_perfs AS (
  SELECT DISTINCT t.song_id, t.show_id, s.date AS show_date, s.day_order, s.id AS sid
  FROM tracks t
  JOIN shows s ON s.id = t.show_id
  WHERE s.count_for_stats = FALSE
),
stats_perfs AS (
  SELECT DISTINCT t.song_id, t.show_id, s.date AS show_date, s.day_order, s.id AS sid
  FROM tracks t
  JOIN shows s ON s.id = t.show_id
  WHERE s.count_for_stats = TRUE
),
prev_per_perf AS (
  SELECT
    nsp.song_id,
    nsp.show_id,
    nsp.show_date,
    prev.prev_show_id,
    prev.prev_show_date
  FROM non_stats_perfs nsp
  LEFT JOIN LATERAL (
    SELECT sp.show_id AS prev_show_id, sp.show_date AS prev_show_date
    FROM stats_perfs sp
    WHERE sp.song_id = nsp.song_id
      AND ROW(sp.show_date, COALESCE(sp.day_order, 2147483647), sp.sid)
        < ROW(nsp.show_date, COALESCE(nsp.day_order, 2147483647), nsp.sid)
    ORDER BY sp.show_date DESC, COALESCE(sp.day_order, 2147483647) DESC, sp.sid DESC
    LIMIT 1
  ) prev ON TRUE
),
gap_for_non_stats AS (
  SELECT
    ppp.song_id,
    ppp.show_id,
    ppp.prev_show_id,
    CASE
      WHEN ppp.prev_show_date IS NULL THEN NULL
      ELSE (
        SELECT COUNT(*)::INTEGER
        FROM shows s2
        WHERE s2.date > ppp.prev_show_date
          AND s2.date < ppp.show_date
          AND s2.count_for_stats = TRUE
      )
    END AS gap
  FROM prev_per_perf ppp
)
UPDATE tracks t
   SET gap = gns.gap,
       previous_performance_show_id = gns.prev_show_id
  FROM gap_for_non_stats gns
 WHERE gns.song_id = t.song_id
   AND gns.show_id = t.show_id;

-- =========================================================================
-- Song stats recompute — timesPlayed, dateFirstPlayed, dateLastPlayed,
-- yearlyPlayData. All four exclude count_for_stats=false shows.
-- This must stay in sync with SongService.updateSongStatistics().
-- =========================================================================

WITH song_show AS (
  -- One row per (song_id, show_id) for shows that count toward stats.
  SELECT DISTINCT t.song_id, t.show_id, s.date::date AS show_date
  FROM tracks t
  JOIN shows s ON s.id = t.show_id
  WHERE s.count_for_stats = TRUE
),
song_yearly AS (
  -- {year: count} aggregated per song, as a JSONB object.
  SELECT
    song_id,
    COALESCE(
      jsonb_object_agg(year::text, cnt) FILTER (WHERE year IS NOT NULL),
      '{}'::jsonb
    ) AS yearly
  FROM (
    SELECT song_id, EXTRACT(YEAR FROM show_date)::int AS year, COUNT(*)::int AS cnt
    FROM song_show
    GROUP BY song_id, EXTRACT(YEAR FROM show_date)
  ) y
  GROUP BY song_id
),
song_agg AS (
  SELECT
    ss.song_id,
    COUNT(DISTINCT ss.show_id)::int AS times_played,
    MIN(ss.show_date)               AS date_first_played,
    MAX(ss.show_date)               AS date_last_played
  FROM song_show ss
  GROUP BY ss.song_id
)
UPDATE songs sg SET
  times_played      = COALESCE(sa.times_played, 0),
  date_first_played = sa.date_first_played,
  date_last_played  = sa.date_last_played,
  yearly_play_data  = COALESCE(sy.yearly, '{}'::jsonb),
  updated_at        = NOW()
FROM songs sg2
LEFT JOIN song_agg sa  ON sa.song_id = sg2.id
LEFT JOIN song_yearly sy ON sy.song_id = sg2.id
WHERE sg.id = sg2.id;
