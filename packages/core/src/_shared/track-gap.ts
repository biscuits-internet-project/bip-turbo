/**
 * Pure-function gap walk. Single source of truth for the algorithm that
 * produces `Track.gap` + `Track.previousPerformanceShowId` for one song
 * and the corresponding `Song.timesPlayed` / `dateFirst/LastPlayed` /
 * `yearlyPlayData` aggregates. Used by:
 *   * SongService.updateSongStatistics (one song)
 *   * StatsService.rebuildAffectedSongsSince (many songs)
 *
 * No DB access here — callers fetch the data, hand it in, and write the
 * results back. Pure functions are unit-tested without any Prisma mocking.
 */

/**
 * Track input shape for the gap walk. Pulled from the joined track + show
 * row, projecting only the fields the algorithm needs.
 */
export type TrackForGapWalk = {
  trackId: string;
  showId: string;
  /** ISO YYYY-MM-DD string (lex-sorts chronologically). */
  showDate: string;
  dayOrder: number | null;
  showCountForStats: boolean;
  /** Position of this track within its show, used as a tiebreaker. */
  position: number;
};

export type GapResult = {
  trackId: string;
  gap: number | null;
  previousPerformanceShowId: string | null;
};

export type SongStatsAggregate = {
  timesPlayed: number;
  dateFirstPlayed: Date | null;
  dateLastPlayed: Date | null;
  yearlyPlayData: Record<string, number>;
};

/**
 * Sort tracks chronologically with the canonical same-date tiebreakers
 * (date → dayOrder NULLS LAST → position → showId). Returns a new array
 * — input is not mutated.
 */
export function sortTracksForGapWalk(tracks: TrackForGapWalk[]): TrackForGapWalk[] {
  const compare = (a: TrackForGapWalk, b: TrackForGapWalk): number => {
    if (a.showDate !== b.showDate) return a.showDate < b.showDate ? -1 : 1;
    const aOrder = a.dayOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.dayOrder ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    if (a.position !== b.position) return a.position - b.position;
    return a.showId < b.showId ? -1 : a.showId > b.showId ? 1 : 0;
  };
  return [...tracks].sort(compare);
}

/**
 * First index where `dates[i] > target` — i.e., the first date strictly
 * greater. `dates` MUST be sorted ASC.
 */
function firstIndexGreaterThan(dates: string[], target: string): number {
  let lo = 0;
  let hi = dates.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (dates[mid] > target) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

/**
 * First index where `dates[i] >= target`. `dates` MUST be sorted ASC.
 */
function firstIndexGreaterOrEqual(dates: string[], target: string): number {
  let lo = 0;
  let hi = dates.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (dates[mid] >= target) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

/**
 * Walk a song's pre-sorted tracks and compute per-track gap +
 * previousPerformanceShowId. The walk only updates the "last performance"
 * cursor on count_for_stats=true shows — non-stats tracks (soundchecks,
 * radio sessions, etc.) get a gap value pointing at the prior stats-show
 * but never act as a "prev" for later tracks.
 *
 * `statsShowDates` is the chronologically-sorted list of show dates
 * where count_for_stats=true. The "shows between" denominator counts
 * dates strictly between the prior performance date and this one — done
 * via binary search so the walk is O(N tracks · log M dates) rather than
 * the naive O(N · M).
 */
export function computeTrackGaps(
  sortedTracks: TrackForGapWalk[],
  statsShowDates: string[],
): GapResult[] {
  const results: GapResult[] = [];
  let lastShowDate: string | null = null;
  let lastShowId: string | null = null;
  let currentShowId: string | null = null;
  let currentShowGap: number | null = null;
  let currentShowPrevId: string | null = null;

  for (const track of sortedTracks) {
    if (track.showId !== currentShowId) {
      // New show for this song — recompute gap+prev relative to the most
      // recent prior count_for_stats=true performance.
      if (lastShowDate === null) {
        currentShowGap = null;
        currentShowPrevId = null;
      } else {
        // Count dates strictly between (lastShowDate, track.showDate):
        //   * indices [0, leftBound)        → dates <= lastShowDate
        //   * indices [leftBound, rightBound) → lastShowDate < d < track.showDate  ← what we want
        //   * indices [rightBound, end)     → dates >= track.showDate
        // Clamp at 0: a same-date pair (lastShowDate == track.showDate)
        // produces leftBound > rightBound; the actual count is 0.
        const leftBound = firstIndexGreaterThan(statsShowDates, lastShowDate);
        const rightBound = firstIndexGreaterOrEqual(statsShowDates, track.showDate);
        currentShowGap = Math.max(0, rightBound - leftBound);
        currentShowPrevId = lastShowId;
      }
      currentShowId = track.showId;
      // Only count_for_stats=true shows advance the "last performance" cursor.
      if (track.showCountForStats) {
        lastShowDate = track.showDate;
        lastShowId = track.showId;
      }
    }
    results.push({
      trackId: track.trackId,
      gap: currentShowGap,
      previousPerformanceShowId: currentShowPrevId,
    });
  }

  return results;
}

/**
 * Aggregate Song.* from a song's count_for_stats=true tracks. Counts
 * unique shows (a song played twice in one show counts once) and bins
 * by year for the yearly play data graph.
 */
export function computeSongStats(
  statsTracks: { showId: string; showDate: string }[],
): SongStatsAggregate {
  const uniqueShowDates: string[] = [];
  const seen = new Set<string>();
  for (const t of statsTracks) {
    if (seen.has(t.showId)) continue;
    seen.add(t.showId);
    uniqueShowDates.push(t.showDate);
  }
  uniqueShowDates.sort();

  const yearlyPlayData: Record<string, number> = {};
  for (const d of uniqueShowDates) {
    const year = new Date(d).getFullYear().toString();
    yearlyPlayData[year] = (yearlyPlayData[year] || 0) + 1;
  }

  return {
    timesPlayed: uniqueShowDates.length,
    dateFirstPlayed: uniqueShowDates[0] ? new Date(uniqueShowDates[0]) : null,
    dateLastPlayed: uniqueShowDates[uniqueShowDates.length - 1]
      ? new Date(uniqueShowDates[uniqueShowDates.length - 1])
      : null,
    yearlyPlayData,
  };
}
