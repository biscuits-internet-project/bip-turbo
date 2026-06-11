import type { SegueRecurrenceKind } from "@bip/domain";
import { CacheKeys, countSortedAfter } from "@bip/domain";
import type { CacheService } from "../_shared/cache/cache-service";
import type { DbClient } from "../_shared/database/models";
import { nonStubShowsSql, STATS_SHOWS_WHERE, statsShowsSql, TRACK_BY_SHOW_ORDER_ASC } from "../_shared/show-ordering";
import {
  computeRecurrence,
  computeSongStats,
  computeTrackGaps,
  flagPredicate,
  type GapResult,
  notSeguedInPredicate,
  notSeguedOutPredicate,
  type RecurrencePredicate,
  type RecurrenceTrackForWalk,
  sortTracksForGapWalk,
  standalonePredicate,
} from "../_shared/track-gap";

const ONE_DAY_SECONDS = 86400;

/** A track loaded for the gap / recurrence walk: scalar fields plus its show and flags. */
type RebuildSongTrack = {
  id: string;
  songId: string;
  set: string;
  position: number;
  segue: string | null;
  gap: number | null;
  previousPerformanceShowId: string | null;
  show: { id: string; date: string; dayOrder: number | null; countForStats: boolean } | null;
  trackFlags: Array<{ flag: string }>;
};

/** The denormalized song-stat columns the rebuild diffs its fresh compute against. */
type CurrentSongStats = {
  timesPlayed: number;
  dateFirstPlayed: Date | null;
  dateLastPlayed: Date | null;
  yearlyPlayData: unknown;
  mostCommonYear: number | null;
};

/**
 * Cross-domain aggregates that span shows and songs and back rarity /
 * normalization features (per-year graph denominator, "shows since debut",
 * etc.). Producers are lazy: first reader after invalidation pays the
 * compute cost; everyone else hits Redis.
 *
 * Also owns the denormalized-stats rebuild path. Adding/editing/deleting a
 * show changes the universe of `count_for_stats=true` shows, which ripples
 * to `Track.gap` for songs whose performance chains span the changed show's
 * date — even songs that weren't played at the changed show. The rebuild
 * walks every track and recomputes `Track.gap`, `Track.previousPerformanceShowId`,
 * `Song.timesPlayed`, `Song.dateFirstPlayed`, `Song.dateLastPlayed`, and
 * `Song.yearlyPlayData` against the current show set.
 */
export class StatsService {
  constructor(
    private readonly db: DbClient,
    /**
     * Optional. Required for cached read paths like `getShowsByYear()`,
     * not for the rebuild path. The sync-missing-shows script wires this
     * service without a cache (no Redis when REDIS_URL is unset locally),
     * so the rebuild stays usable in script contexts.
     */
    private readonly cache?: CacheService,
  ) {}

  /**
   * Returns `{[year]: showCount}` for every year that has at least one
   * show. Used by the song-detail "% of Shows" graph and the rarity stat
   * cards. Invalidated by show mutations via CacheInvalidationService.
   */
  async getShowsByYear(): Promise<Record<number, number>> {
    if (!this.cache) {
      throw new Error("StatsService.getShowsByYear() requires a cache; constructed without one");
    }
    return this.cache.getOrSet(
      CacheKeys.stats.showsByYear(),
      async () => {
        const rows = await this.db.$queryRaw<Array<{ year: number; count: bigint }>>`
          SELECT date_part('year', date::date)::int AS year, COUNT(*) AS count
          FROM shows
          WHERE date IS NOT NULL
            AND ${statsShowsSql("shows")}
            AND ${nonStubShowsSql("shows")}
          GROUP BY 1
          ORDER BY 1
        `;
        const out: Record<number, number> = {};
        for (const row of rows) {
          out[row.year] = Number(row.count);
        }
        return out;
      },
      { ttl: ONE_DAY_SECONDS },
    );
  }

  /**
   * Returns sorted ISO date strings (`YYYY-MM-DD`) for every
   * count_for_stats=true show. Cached 24h. Read by callers that need to
   * count stats-eligible shows after a given date (Gap to Now on /songs,
   * "X shows ago" sublabel on song detail) — a single fetch backs every
   * such computation across the request.
   */
  async getStatsShowDates(): Promise<string[]> {
    if (!this.cache) {
      throw new Error("StatsService.getStatsShowDates() requires a cache; constructed without one");
    }
    return this.cache.getOrSet(
      CacheKeys.stats.showDates(),
      async () => {
        const rows = await this.db.$queryRaw<Array<{ d: string }>>`
          SELECT to_char(date::date, 'YYYY-MM-DD') AS d
          FROM shows
          WHERE date IS NOT NULL
            AND ${statsShowsSql("shows")}
            AND ${nonStubShowsSql("shows")}
          ORDER BY date
        `;
        return rows.map((r) => r.d);
      },
      { ttl: ONE_DAY_SECONDS },
    );
  }

  /**
   * Returns `{songId: [date, ...]}` covering every stats-eligible
   * performance of every song, each per-song array sorted ascending.
   * Backs the gap-chart "Played Before" column: clients fetch this
   * once per session and binary-search prior counts client-side, so
   * year/top-rated pages don't pay a per-show query when users open
   * the gap-chart view. Sort happens in SQL so the JS group step is
   * O(n) — preserving insertion order is enough to keep arrays sorted.
   */
  async getSongPlayDates(): Promise<Record<string, string[]>> {
    if (!this.cache) {
      throw new Error("StatsService.getSongPlayDates() requires a cache; constructed without one");
    }
    return this.cache.getOrSet(
      CacheKeys.stats.songPlayDates(),
      async () => {
        const rows = await this.db.$queryRaw<Array<{ song_id: string; d: string }>>`
          SELECT tracks.song_id, to_char(shows.date::date, 'YYYY-MM-DD') AS d
          FROM tracks
          JOIN shows ON tracks.show_id = shows.id
          WHERE shows.date IS NOT NULL
            AND ${statsShowsSql("shows")}
            AND ${nonStubShowsSql("shows")}
          ORDER BY shows.date ASC
        `;
        const out: Record<string, string[]> = {};
        for (const row of rows) {
          const arr = out[row.song_id];
          if (arr) arr.push(row.d);
          else out[row.song_id] = [row.d];
        }
        return out;
      },
      { ttl: ONE_DAY_SECONDS },
    );
  }

  /**
   * Number of stats-eligible shows strictly after a song's `dateLastPlayed`
   * — drives the "X shows ago" reading on the song detail page and the
   * Gap to Now column on /songs.
   */
  async getShowsSinceLastPlayed(dateLastPlayed: Date | string): Promise<number> {
    const dates = await this.getStatsShowDates();
    return countSortedAfter(dates, toIsoDate(dateLastPlayed));
  }

  /**
   * Returns a `Map<songId, gap>` where `gap` is the number of stats-eligible
   * shows that have happened since each song's `dateLastPlayed`. Drives the
   * Gap to Now column on `/songs` — same semantic as `showsSinceLastPlayed`
   * on the song detail page, but computed in bulk for the songs index.
   *
   * Songs without `dateLastPlayed` (never played) and songs not present in
   * the input list are absent from the map; callers render em-dash for
   * missing entries.
   */
  async getShowsSinceLastPlayedBySongIds(songIds: string[]): Promise<Map<string, number>> {
    if (songIds.length === 0) return new Map();
    const [songs, dates] = await Promise.all([
      this.db.song.findMany({
        where: { id: { in: songIds }, dateLastPlayed: { not: null } },
        select: { id: true, dateLastPlayed: true },
      }),
      this.getStatsShowDates(),
    ]);
    const out = new Map<string, number>();
    for (const song of songs) {
      if (!song.dateLastPlayed) continue;
      out.set(song.id, countSortedAfter(dates, toIsoDate(song.dateLastPlayed)));
    }
    return out;
  }

  /**
   * Returns a `Map<songId, avgGap>` where `avgGap` is `AVG(tracks.gap)`
   * restricted to count_for_stats=true tracks (`tracks.gap` is NULL on
   * debuts, so the average naturally covers only closed gaps between
   * consecutive plays). Drives the Avg Gap column on /songs.
   *
   * Songs with fewer than two stats plays have no closed gaps to average
   * and are absent from the map; callers render em-dash.
   */
  async getAverageGapShowsBySongIds(songIds: string[]): Promise<Map<string, number>> {
    if (songIds.length === 0) return new Map();
    const rows = await this.db.$queryRaw<Array<{ song_id: string; avg_gap: number | null }>>`
      SELECT tracks.song_id, AVG(tracks.gap)::float AS avg_gap
      FROM tracks
      JOIN shows ON tracks.show_id = shows.id
      WHERE tracks.song_id = ANY(${songIds}::uuid[])
        AND tracks.gap IS NOT NULL
        AND ${statsShowsSql("shows")}
      GROUP BY tracks.song_id
    `;
    const out = new Map<string, number>();
    for (const row of rows) {
      if (row.avg_gap !== null) out.set(row.song_id, row.avg_gap);
    }
    return out;
  }

  /**
   * Recompute Track.gap + Track.previousPerformanceShowId for every track
   * at a show on or after `sinceDate`, and Song.timesPlayed /
   * dateFirstPlayed / dateLastPlayed / yearlyPlayData for every song with
   * at least one such track. Called after any show mutation (create /
   * update / delete) — adding or removing a count_for_stats=true show
   * changes the "shows between" denominator for chains spanning that date.
   * Pre-`sinceDate` tracks are not touched: their universe of prior shows
   * is unchanged because the mutated show is later than them.
   *
   * Implementation: fetch affected ids, stats-show dates, all tracks for
   * affected songs, and current Song.* aggregates in parallel; run the
   * pure-function gap walk per song; diff the computed values against
   * what's already in the DB and write only the rows that actually
   * changed. Writes dominate this path's runtime, so skipping unchanged
   * rows is the lever that matters.
   */
  async rebuildGapsAndSongStatsSince(sinceDate: string): Promise<void> {
    const affected = await this.db.track.findMany({
      where: { show: { date: { gte: sinceDate } } },
      select: { songId: true },
      distinct: ["songId"],
    });
    if (affected.length === 0) return;
    const affectedSongIds = affected.map((a) => a.songId);

    const [statsShows, allTracks, currentSongs, seguedInTrackIds] = await Promise.all([
      this.db.show.findMany({
        where: STATS_SHOWS_WHERE,
        select: { date: true },
        orderBy: { date: "asc" },
      }),
      this.db.track.findMany({
        where: { songId: { in: affectedSongIds } },
        include: {
          show: { select: { id: true, date: true, dayOrder: true, countForStats: true } },
          trackFlags: { select: { flag: true } },
        },
        orderBy: TRACK_BY_SHOW_ORDER_ASC,
      }),
      this.db.song.findMany({
        where: { id: { in: affectedSongIds } },
        select: {
          id: true,
          timesPlayed: true,
          dateFirstPlayed: true,
          dateLastPlayed: true,
          yearlyPlayData: true,
          mostCommonYear: true,
        },
      }),
      this.seguedInTrackIds(affectedSongIds),
    ]);
    const statsShowDates = statsShows.map((s) => s.date);
    const currentSongById = new Map(currentSongs.map((s) => [s.id, s]));

    const tracksBySong = new Map<string, typeof allTracks>();
    for (const t of allTracks) {
      const arr = tracksBySong.get(t.songId);
      if (arr) arr.push(t);
      else tracksBySong.set(t.songId, [t]);
    }

    const changedGapResults: GapResult[] = [];
    const changedSongUpdates: Array<{ songId: string; stats: ReturnType<typeof computeSongStats> }> = [];
    const flagRecurrences: FlagRecurrenceResult[] = [];
    const segueRecurrences: SegueRecurrenceResult[] = [];

    for (const [songId, songTracks] of tracksBySong) {
      const result = this.computeSongRebuild(songId, songTracks, statsShowDates, seguedInTrackIds, currentSongById);
      changedGapResults.push(...result.changedGapResults);
      changedSongUpdates.push(...result.changedSongUpdates);
      flagRecurrences.push(...result.flagRecurrences);
      segueRecurrences.push(...result.segueRecurrences);
    }

    const affectedTrackIds = allTracks.map((t) => t.id);
    await Promise.all([
      this.bulkUpdateTrackGaps(changedGapResults),
      this.bulkUpdateSongStats(changedSongUpdates),
      this.replaceFlagRecurrence(affectedTrackIds, flagRecurrences),
      this.replaceSegueRecurrence(affectedTrackIds, segueRecurrences),
    ]);
  }

  /**
   * Recompute gaps, song stats, and flag/segue recurrence for ONE song, then
   * write the diffed results. The cheap path an admin flag edit takes: a flag
   * change only moves that song's recurrence, so there's no need to walk the
   * whole catalog from a date like `rebuildGapsAndSongStatsSince`. Loads the
   * song's tracks (same shape the full rebuild uses) and applies the four bulk
   * writes scoped to those track ids.
   */
  async recomputeSongRecurrence(songId: string): Promise<void> {
    const [statsShows, songTracks, currentSongs, seguedInTrackIds] = await Promise.all([
      this.db.show.findMany({
        where: STATS_SHOWS_WHERE,
        select: { date: true },
        orderBy: { date: "asc" },
      }),
      this.db.track.findMany({
        where: { songId },
        include: {
          show: { select: { id: true, date: true, dayOrder: true, countForStats: true } },
          trackFlags: { select: { flag: true } },
        },
        orderBy: TRACK_BY_SHOW_ORDER_ASC,
      }),
      this.db.song.findMany({
        where: { id: songId },
        select: {
          id: true,
          timesPlayed: true,
          dateFirstPlayed: true,
          dateLastPlayed: true,
          yearlyPlayData: true,
          mostCommonYear: true,
        },
      }),
      this.seguedInTrackIds([songId]),
    ]);
    const statsShowDates = statsShows.map((s) => s.date);
    const currentSongById = new Map(currentSongs.map((s) => [s.id, s]));

    const result = this.computeSongRebuild(songId, songTracks, statsShowDates, seguedInTrackIds, currentSongById);

    const affectedTrackIds = songTracks.map((t) => t.id);
    await Promise.all([
      this.bulkUpdateTrackGaps(result.changedGapResults),
      this.bulkUpdateSongStats(result.changedSongUpdates),
      this.replaceFlagRecurrence(affectedTrackIds, result.flagRecurrences),
      this.replaceSegueRecurrence(affectedTrackIds, result.segueRecurrences),
    ]);
  }

  /**
   * Recompute one song's gap / song-stat / recurrence results and diff them
   * against the current rows, returning only the changed writes. Shared by the
   * date-wide rebuild (called per song) and the single-song recompute so both
   * derive identical numbers from the same walk.
   */
  private computeSongRebuild(
    songId: string,
    songTracks: RebuildSongTrack[],
    statsShowDates: string[],
    seguedInTrackIds: Set<string>,
    currentSongById: Map<string, CurrentSongStats>,
  ): {
    changedGapResults: GapResult[];
    changedSongUpdates: Array<{ songId: string; stats: ReturnType<typeof computeSongStats> }>;
    flagRecurrences: FlagRecurrenceResult[];
    segueRecurrences: SegueRecurrenceResult[];
  } {
    const recurrenceInput: RecurrenceTrackForWalk[] = songTracks.flatMap((t) => {
      if (!t.show) return [];
      return [
        {
          trackId: t.id,
          showId: t.show.id,
          showDate: t.show.date,
          dayOrder: t.show.dayOrder,
          showCountForStats: t.show.countForStats,
          set: t.set,
          position: t.position,
          segue: t.segue,
          seguedIn: seguedInTrackIds.has(t.id),
          flags: t.trackFlags.map((f) => f.flag),
        },
      ];
    });
    const sortedTracks = sortTracksForGapWalk(recurrenceInput);
    const gapResults = computeTrackGaps(sortedTracks, statsShowDates);
    const { flagRecurrences, segueRecurrences } = computeRecurrenceForSong(recurrenceInput, statsShowDates);

    // Diff each computed (gap, prevId) against the current row so only moved
    // tracks get written.
    const changedGapResults: GapResult[] = [];
    const trackById = new Map(songTracks.map((t) => [t.id, t]));
    for (const r of gapResults) {
      const existing = trackById.get(r.trackId);
      if (!existing) continue;
      if (existing.gap !== r.gap || existing.previousPerformanceShowId !== r.previousPerformanceShowId) {
        changedGapResults.push(r);
      }
    }

    const changedSongUpdates: Array<{ songId: string; stats: ReturnType<typeof computeSongStats> }> = [];
    const songStats = computeSongStats(
      recurrenceInput.filter((t) => t.showCountForStats).map((t) => ({ showId: t.showId, showDate: t.showDate })),
    );
    const current = currentSongById.get(songId);
    if (!current || songStatsChanged(current, songStats)) {
      changedSongUpdates.push({ songId, stats: songStats });
    }

    return { changedGapResults, changedSongUpdates, flagRecurrences, segueRecurrences };
  }

  /**
   * Full-catalog rebuild entrypoint: recompute recurrence (and gaps / song
   * stats) for every track by walking from the earliest show forward. A manual
   * convenience for local/one-off backfills; prod's initial population runs via
   * the recompute queue (a migration enqueues the earliest date, the deploy-time
   * recompute-pending then rebuilds the whole catalog through the same path).
   */
  async rebuildAllRecurrence(): Promise<void> {
    const earliest = await this.db.show.findFirst({
      orderBy: { date: "asc" },
      select: { date: true },
    });
    if (!earliest) return;
    await this.rebuildGapsAndSongStatsSince(earliest.date);
  }

  /**
   * Set the `flag_gap` / `flag_previous_show_id` columns on the recurrence-
   * bearing track_flags rows, and clear them on every other flag row for the
   * affected tracks (a track that no longer qualifies for a flag's recurrence
   * — e.g. the flag was removed — must lose its stale recurrence). Two
   * UNNEST-driven statements, mirroring `bulkUpdateTrackGaps`.
   */
  private async replaceFlagRecurrence(affectedTrackIds: string[], recurrences: FlagRecurrenceResult[]): Promise<void> {
    if (affectedTrackIds.length === 0) return;
    // Clear first so rows that dropped out of a recurrence series reset to null.
    await this.db.$executeRaw`
      UPDATE track_flags
         SET flag_gap = NULL, flag_version_gap = NULL, flag_previous_show_id = NULL, updated_at = NOW()
       WHERE track_id = ANY(${affectedTrackIds}::uuid[])
         AND (flag_gap IS NOT NULL OR flag_version_gap IS NOT NULL OR flag_previous_show_id IS NOT NULL)
    `;
    if (recurrences.length === 0) return;
    const trackIds = recurrences.map((r) => r.trackId);
    const flags = recurrences.map((r) => r.flag);
    const gaps = recurrences.map((r) => r.gap);
    const versionGaps = recurrences.map((r) => r.versionGap);
    const previousShowIds = recurrences.map((r) => r.previousShowId);
    await this.db.$executeRaw`
      UPDATE track_flags tf
         SET flag_gap = u.gap,
             flag_version_gap = u.version_gap,
             flag_previous_show_id = u.previous_show_id,
             updated_at = NOW()
        FROM (
          SELECT
            UNNEST(${trackIds}::uuid[])        AS track_id,
            UNNEST(${flags}::track_flag[])     AS flag,
            UNNEST(${gaps}::int[])             AS gap,
            UNNEST(${versionGaps}::int[])      AS version_gap,
            UNNEST(${previousShowIds}::uuid[]) AS previous_show_id
        ) AS u
       WHERE tf.track_id = u.track_id AND tf.flag = u.flag
    `;
  }

  /**
   * Replace the track_segue_recurrence rows for the affected tracks: delete
   * them all, then re-insert the freshly-computed set. A delete+insert (rather
   * than upsert+prune) because the qualifying set per track changes wholesale
   * when a segue is added or removed, and the affected-track scope is bounded.
   */
  private async replaceSegueRecurrence(
    affectedTrackIds: string[],
    recurrences: SegueRecurrenceResult[],
  ): Promise<void> {
    if (affectedTrackIds.length === 0) return;
    await this.db.$executeRaw`
      DELETE FROM track_segue_recurrence WHERE track_id = ANY(${affectedTrackIds}::uuid[])
    `;
    if (recurrences.length === 0) return;
    const trackIds = recurrences.map((r) => r.trackId);
    const kinds = recurrences.map((r) => r.kind);
    const gaps = recurrences.map((r) => r.gap);
    const versionGaps = recurrences.map((r) => r.versionGap);
    const previousShowIds = recurrences.map((r) => r.previousShowId);
    await this.db.$executeRaw`
      INSERT INTO track_segue_recurrence (track_id, kind, gap, version_gap, previous_show_id, updated_at)
      SELECT
        UNNEST(${trackIds}::uuid[]),
        UNNEST(${kinds}::segue_recurrence_kind[]),
        UNNEST(${gaps}::int[]),
        UNNEST(${versionGaps}::int[]),
        UNNEST(${previousShowIds}::uuid[]),
        NOW()
    `;
  }

  /**
   * The ids of the affected-song tracks that are segued INTO — i.e. the track
   * at position-1 in the same show+set segued out. The set neighbor usually
   * belongs to a DIFFERENT song than the one being rebuilt, so this can't be
   * derived from the per-song track list; a self-join resolves it in one query.
   */
  private async seguedInTrackIds(songIds: string[]): Promise<Set<string>> {
    if (songIds.length === 0) return new Set();
    const rows = await this.db.$queryRaw<Array<{ id: string }>>`
      SELECT t.id
      FROM tracks t
      JOIN tracks prev
        ON prev.show_id = t.show_id
       AND prev.set = t.set
       AND prev.position = t.position - 1
      WHERE t.song_id = ANY(${songIds}::uuid[])
        AND prev.segue IS NOT NULL
        AND prev.segue != ''
    `;
    return new Set(rows.map((r) => r.id));
  }

  /**
   * Apply N song-stat updates to N songs in a single round-trip via UNNEST
   * over five parallel arrays. Same trick as `bulkUpdateTrackGaps`.
   */
  private async bulkUpdateSongStats(
    updates: Array<{ songId: string; stats: ReturnType<typeof computeSongStats> }>,
  ): Promise<void> {
    if (updates.length === 0) return;
    const songIds = updates.map((u) => u.songId);
    const timesPlayed = updates.map((u) => u.stats.timesPlayed);
    const dateFirstPlayed = updates.map((u) => u.stats.dateFirstPlayed);
    const dateLastPlayed = updates.map((u) => u.stats.dateLastPlayed);
    const yearlyPlayData = updates.map((u) => JSON.stringify(u.stats.yearlyPlayData));
    const mostCommonYear = updates.map((u) => u.stats.mostCommonYear);
    await this.db.$executeRaw`
      UPDATE songs s
         SET times_played      = u.times_played,
             date_first_played = u.date_first_played,
             date_last_played  = u.date_last_played,
             yearly_play_data  = u.yearly_play_data::jsonb,
             most_common_year  = u.most_common_year,
             updated_at        = NOW()
        FROM (
          SELECT
            UNNEST(${songIds}::uuid[])           AS song_id,
            UNNEST(${timesPlayed}::int[])        AS times_played,
            UNNEST(${dateFirstPlayed}::date[])   AS date_first_played,
            UNNEST(${dateLastPlayed}::date[])    AS date_last_played,
            UNNEST(${yearlyPlayData}::text[])    AS yearly_play_data,
            UNNEST(${mostCommonYear}::int[])     AS most_common_year
        ) AS u
       WHERE s.id = u.song_id
    `;
  }

  /**
   * Apply N gap+prev updates to N tracks in a single round-trip. Passes
   * three parallel arrays as scalar parameters and uses `UNNEST` to turn
   * them into rows — sidesteps Postgres's per-statement parameter limit
   * (which a `(VALUES (...), (...), ...)` form would blow through at
   * thousands of rows) while keeping us to one network round-trip.
   * Pure values list, no business logic.
   */
  private async bulkUpdateTrackGaps(gapResults: GapResult[]): Promise<void> {
    if (gapResults.length === 0) return;
    const trackIds = gapResults.map((g) => g.trackId);
    const gaps = gapResults.map((g) => g.gap);
    const previousShowIds = gapResults.map((g) => g.previousPerformanceShowId);
    await this.db.$executeRaw`
      UPDATE tracks t
         SET gap = u.gap,
             previous_performance_show_id = u.previous_show_id
        FROM (
          SELECT
            UNNEST(${trackIds}::uuid[])        AS track_id,
            UNNEST(${gaps}::int[])             AS gap,
            UNNEST(${previousShowIds}::uuid[]) AS previous_show_id
        ) AS u
       WHERE t.id = u.track_id
    `;
  }
}

/** One computed flag-recurrence row: the recurrence of `flag` at `trackId`. */
export type FlagRecurrenceResult = {
  trackId: string;
  flag: string;
  gap: number | null;
  versionGap: number | null;
  previousShowId: string | null;
};

/** One computed segue-recurrence row: the recurrence of `kind` at `trackId`. */
export type SegueRecurrenceResult = {
  trackId: string;
  kind: SegueRecurrenceKind;
  gap: number | null;
  versionGap: number | null;
  previousShowId: string | null;
};

// The three segue kinds and their qualifying predicates, walked for every song.
const SEGUE_RECURRENCE_PREDICATES: ReadonlyArray<{ kind: SegueRecurrenceKind; predicate: RecurrencePredicate }> = [
  { kind: "STANDALONE", predicate: standalonePredicate },
  { kind: "NOT_SEGUED_IN", predicate: notSeguedInPredicate },
  { kind: "NOT_SEGUED_OUT", predicate: notSeguedOutPredicate },
];

/**
 * Compute every flag-recurrence and segue-recurrence row for one song's
 * tracks. Runs the generic recurrence walk once per distinct flag present on
 * the song and once per segue kind. Pure — the rebuild fetches the tracks and
 * writes the diffed results. Input need not be pre-sorted.
 */
export function computeRecurrenceForSong(
  tracks: RecurrenceTrackForWalk[],
  statsShowDates: string[],
): { flagRecurrences: FlagRecurrenceResult[]; segueRecurrences: SegueRecurrenceResult[] } {
  const sorted = sortTracksForGapWalk(tracks);

  const distinctFlags = [...new Set(sorted.flatMap((t) => t.flags))];
  const flagRecurrences = distinctFlags.flatMap((flag) =>
    computeRecurrence(sorted, flagPredicate(flag), statsShowDates).map((r) => ({
      trackId: r.trackId,
      flag,
      gap: r.gap,
      versionGap: r.versionGap,
      previousShowId: r.previousShowId,
    })),
  );

  const segueRecurrences = SEGUE_RECURRENCE_PREDICATES.flatMap(({ kind, predicate }) =>
    computeRecurrence(sorted, predicate, statsShowDates).map((r) => ({
      trackId: r.trackId,
      kind,
      gap: r.gap,
      versionGap: r.versionGap,
      previousShowId: r.previousShowId,
    })),
  );

  return { flagRecurrences, segueRecurrences };
}

/**
 * True iff the freshly-computed song aggregate differs from what's on the
 * row already. Date comparison goes through getTime() so two Date objects
 * with the same wall-clock value compare equal; yearlyPlayData compares
 * via a stable key-sorted serialization (Postgres jsonb doesn't preserve
 * insertion order on round-trip).
 */
export function songStatsChanged(
  current: {
    timesPlayed: number;
    dateFirstPlayed: Date | null;
    dateLastPlayed: Date | null;
    yearlyPlayData: unknown;
    mostCommonYear: number | null;
  },
  fresh: ReturnType<typeof computeSongStats>,
): boolean {
  if (current.timesPlayed !== fresh.timesPlayed) return true;
  if (dateMs(current.dateFirstPlayed) !== dateMs(fresh.dateFirstPlayed)) return true;
  if (dateMs(current.dateLastPlayed) !== dateMs(fresh.dateLastPlayed)) return true;
  if (current.mostCommonYear !== fresh.mostCommonYear) return true;
  return stableYearlyJson(current.yearlyPlayData) !== stableYearlyJson(fresh.yearlyPlayData);
}

function dateMs(d: Date | null): number | null {
  return d ? d.getTime() : null;
}

/**
 * Coerces a `Date` or already-ISO string to a `YYYY-MM-DD` string. Used to
 * key into `getStatsShowDates()` which returns dates in that exact format.
 */
function toIsoDate(d: Date | string): string {
  if (typeof d === "string") return d.length > 10 ? d.slice(0, 10) : d;
  return d.toISOString().slice(0, 10);
}

function stableYearlyJson(value: unknown): string {
  if (!value || typeof value !== "object") return "[]";
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return JSON.stringify(entries);
}
