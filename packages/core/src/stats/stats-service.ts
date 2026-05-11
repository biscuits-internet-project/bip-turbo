import { CacheKeys } from "@bip/domain";
import type { CacheService } from "../_shared/cache/cache-service";
import type { DbClient } from "../_shared/database/models";
import { STATS_SHOWS_WHERE, statsShowsSql, TRACK_BY_SHOW_ORDER_ASC } from "../_shared/show-ordering";
import {
  computeSongStats,
  computeTrackGaps,
  type GapResult,
  sortTracksForGapWalk,
  type TrackForGapWalk,
} from "../_shared/track-gap";

const ONE_DAY_SECONDS = 86400;

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
          ORDER BY date
        `;
        return rows.map((r) => r.d);
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
    return countShowsAfter(dates, toIsoDate(dateLastPlayed));
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
      out.set(song.id, countShowsAfter(dates, toIsoDate(song.dateLastPlayed)));
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

    const [statsShows, allTracks, currentSongs] = await Promise.all([
      this.db.show.findMany({
        where: STATS_SHOWS_WHERE,
        select: { date: true },
        orderBy: { date: "asc" },
      }),
      this.db.track.findMany({
        where: { songId: { in: affectedSongIds } },
        include: {
          show: { select: { id: true, date: true, dayOrder: true, countForStats: true } },
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
        },
      }),
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

    for (const [songId, songTracks] of tracksBySong) {
      const walkInput: TrackForGapWalk[] = songTracks.flatMap((t) => {
        if (!t.show) return [];
        return [
          {
            trackId: t.id,
            showId: t.show.id,
            showDate: t.show.date,
            dayOrder: t.show.dayOrder,
            showCountForStats: t.show.countForStats,
            position: t.position,
          },
        ];
      });
      const sortedTracks = sortTracksForGapWalk(walkInput);
      const gapResults = computeTrackGaps(sortedTracks, statsShowDates);

      // Diff each computed (gap, prevId) against the current row. Tracks
      // before sinceDate can't change, but they're cheap to check and the
      // filter is the whole point.
      const trackById = new Map(songTracks.map((t) => [t.id, t]));
      for (const r of gapResults) {
        const existing = trackById.get(r.trackId);
        if (!existing) continue;
        if (existing.gap !== r.gap || existing.previousPerformanceShowId !== r.previousPerformanceShowId) {
          changedGapResults.push(r);
        }
      }

      const songStats = computeSongStats(
        walkInput.filter((t) => t.showCountForStats).map((t) => ({ showId: t.showId, showDate: t.showDate })),
      );
      const current = currentSongById.get(songId);
      if (!current || songStatsChanged(current, songStats)) {
        changedSongUpdates.push({ songId, stats: songStats });
      }
    }

    await Promise.all([this.bulkUpdateTrackGaps(changedGapResults), this.bulkUpdateSongStats(changedSongUpdates)]);
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
    await this.db.$executeRaw`
      UPDATE songs s
         SET times_played      = u.times_played,
             date_first_played = u.date_first_played,
             date_last_played  = u.date_last_played,
             yearly_play_data  = u.yearly_play_data::jsonb,
             updated_at        = NOW()
        FROM (
          SELECT
            UNNEST(${songIds}::uuid[])           AS song_id,
            UNNEST(${timesPlayed}::int[])        AS times_played,
            UNNEST(${dateFirstPlayed}::date[])   AS date_first_played,
            UNNEST(${dateLastPlayed}::date[])    AS date_last_played,
            UNNEST(${yearlyPlayData}::text[])    AS yearly_play_data
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
  },
  fresh: ReturnType<typeof computeSongStats>,
): boolean {
  if (current.timesPlayed !== fresh.timesPlayed) return true;
  if (dateMs(current.dateFirstPlayed) !== dateMs(fresh.dateFirstPlayed)) return true;
  if (dateMs(current.dateLastPlayed) !== dateMs(fresh.dateLastPlayed)) return true;
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

/**
 * Counts entries strictly greater than `target` in a sorted-ascending
 * string array via binary search. Strictly-greater (not `>=`) so a song
 * played at the most recent stats-eligible show reads "0 shows ago",
 * not "1 show ago".
 */
export function countShowsAfter(sortedDates: string[], target: string): number {
  if (sortedDates.length === 0) return 0;
  // Find the index of the first element strictly greater than target.
  let lo = 0;
  let hi = sortedDates.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sortedDates[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return sortedDates.length - lo;
}

/**
 * Counts entries on or after `target` in a sorted-ascending string array.
 * Used as the denominator for Filtered Since Debut / Filtered Avg Gap on
 * /songs — "matching-universe shows from this song's first filtered play
 * onward", which includes the debut show itself.
 */
export function countShowsOnOrAfter(sortedDates: string[], target: string): number {
  if (sortedDates.length === 0) return 0;
  let lo = 0;
  let hi = sortedDates.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (sortedDates[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return sortedDates.length - lo;
}

function stableYearlyJson(value: unknown): string {
  if (!value || typeof value !== "object") return "[]";
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return JSON.stringify(entries);
}
