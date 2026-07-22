import { Prisma } from "@prisma/client";
import { statsShowsSql } from "../_shared/show-ordering";

/**
 * Every show a musician appeared on, shared by the /musicians index and a
 * musician's profile so the two can never disagree about the same number.
 *
 * A musician appears on a show when they are in its lineup or have a
 * present=true sit-in delta on one of its tracks. Lineup membership alone is
 * enough on purpose: early shows have no setlist entered, and those are real
 * appearances even though they contribute no songs or plays.
 *
 * Pass a musician id to scope the scan to one musician; omit it for the
 * all-musicians index, where callers group by `musician_id`.
 */
export function musicianAppearanceShowsSql(musicianId?: string): Prisma.Sql {
  const lineupScope = musicianId ? Prisma.sql`AND sm.musician_id = ${musicianId}::uuid` : Prisma.empty;
  const sitInScope = musicianId ? Prisma.sql`AND tm.musician_id = ${musicianId}::uuid` : Prisma.empty;

  return Prisma.sql`
    SELECT sm.musician_id, sm.show_id
    FROM show_musicians sm
    JOIN shows s ON s.id = sm.show_id
    WHERE ${statsShowsSql("s")}
      ${lineupScope}
    UNION
    SELECT tm.musician_id, t.show_id
    FROM track_musicians tm
    JOIN tracks t ON t.id = tm.track_id
    JOIN shows s ON s.id = t.show_id
    WHERE tm.present = true
      AND ${statsShowsSql("s")}
      ${sitInScope}
  `;
}

/**
 * Every song a musician played, one row per (musician, show, song).
 *
 * A musician plays a track when they are in that show's lineup and have no
 * sat-out delta for the track, OR they have a present=true sit-in delta for
 * it. Scopes exactly like `musicianAppearanceShowsSql`.
 */
export function musicianSongPlaysSql(musicianId?: string): Prisma.Sql {
  const lineupScope = musicianId ? Prisma.sql`AND sm.musician_id = ${musicianId}::uuid` : Prisma.empty;
  const sitInScope = musicianId ? Prisma.sql`AND tm.musician_id = ${musicianId}::uuid` : Prisma.empty;

  return Prisma.sql`
    SELECT sm.musician_id, t.show_id, t.song_id
    FROM show_musicians sm
    JOIN tracks t ON t.show_id = sm.show_id
    JOIN shows s ON s.id = t.show_id
    WHERE ${statsShowsSql("s")}
      ${lineupScope}
      AND NOT EXISTS (
        SELECT 1 FROM track_musicians tm
        WHERE tm.track_id = t.id AND tm.musician_id = sm.musician_id AND tm.present = false
      )
    UNION
    SELECT tm.musician_id, t.show_id, t.song_id
    FROM track_musicians tm
    JOIN tracks t ON t.id = tm.track_id
    JOIN shows s ON s.id = t.show_id
    WHERE tm.present = true
      AND ${statsShowsSql("s")}
      ${sitInScope}
  `;
}

/**
 * The two play aggregates, defined once so "songs" and "plays" mean the same
 * thing wherever they surface. `play_count` counts distinct (song, show) pairs
 * — the same "a song twice in one show counts once" math as Song.timesPlayed,
 * so a musician's plays never exceed the per-song totals shown elsewhere;
 * `song_count` collapses those plays to the distinct repertoire behind them.
 *
 * Splice into a SELECT over `musicianSongPlaysSql` aliased as `p`.
 */
export const MUSICIAN_SONG_PLAY_COUNTS_SQL = Prisma.sql`
  COUNT(DISTINCT p.song_id) AS song_count,
  COUNT(DISTINCT (p.song_id, p.show_id)) AS play_count
`;

/** Raw shape of the columns `MUSICIAN_SONG_PLAY_COUNTS_SQL` projects. */
export interface MusicianSongPlayCountsRow {
  song_count: bigint;
  play_count: bigint;
}
