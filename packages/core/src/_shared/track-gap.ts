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

import { setSortKey } from "./show-ordering";

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
  /** Set label ("S1", "S2", "E1", …). Ranked via `setSortKey` so encores sort
   *  into play order after the regular sets, ahead of raw position. */
  set: string;
  /** Position of this track within its set, used as the final in-show tiebreaker. */
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
  mostCommonYear: number | null;
};

/** The fields the chronological sort reads — a subset of TrackForGapWalk so
 *  the richer recurrence-walk track shape sorts through the same function. */
type SortableTrack = Pick<TrackForGapWalk, "showId" | "showDate" | "dayOrder" | "set" | "position">;

/**
 * Sort tracks chronologically with the canonical same-date tiebreakers
 * (date → dayOrder NULLS LAST → set play-order → position → showId). Set rank
 * comes before position because encores carry low position numbers but play
 * last; `setSortKey` is the shared S1<S2<E1 ranking. Returns a new array
 * — input is not mutated.
 */
export function sortTracksForGapWalk<T extends SortableTrack>(tracks: T[]): T[] {
  const compare = (a: T, b: T): number => {
    if (a.showDate !== b.showDate) return a.showDate < b.showDate ? -1 : 1;
    const aOrder = a.dayOrder ?? Number.MAX_SAFE_INTEGER;
    const bOrder = b.dayOrder ?? Number.MAX_SAFE_INTEGER;
    if (aOrder !== bOrder) return aOrder - bOrder;
    const aSet = setSortKey(a.set);
    const bSet = setSortKey(b.set);
    if (aSet !== bSet) return aSet - bSet;
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
export function computeTrackGaps(sortedTracks: TrackForGapWalk[], statsShowDates: string[]): GapResult[] {
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
 * Track input shape for the recurrence walk. Extends the gap-walk shape with
 * the fields the recurrence predicates read: `segue` (non-empty ⇒ this track
 * segues out), `seguedIn` (the track's SET neighbor at position-1 segued into
 * it — computed at fetch time, NOT inferable from the per-song walk order), and
 * `flags` (the structured TrackFlag values on it).
 */
export type RecurrenceTrackForWalk = TrackForGapWalk & {
  /** Raw segue string; non-empty (e.g. ">") means this track segues out. */
  segue: string | null;
  /** True when the prior track in this track's set (position-1) segued into it. */
  seguedIn: boolean;
  /** The structured flag values on this track, as plain strings. */
  flags: string[];
};

export type RecurrenceResult = {
  trackId: string;
  /** Stats-shows strictly between this qualifying track and the prior one. */
  gap: number | null;
  /** Dual-meaning version count, disambiguated by `previousShowId`:
   *  - REPEAT (previousShowId set): versions of the SONG (its own stats
   *    performances, any shape) strictly between this qualifying track and the
   *    prior qualifying one. 0 ⇒ the prior version was also qualifying (no shape
   *    change).
   *  - FIRST-EVER (previousShowId null): versions of the song BEFORE this one —
   *    how late the shape/flag first appeared, for the "(after X versions)" note.
   *  In practice always a number (a first-ever debut carries 0), but typed
   *  nullable to match the DB column the rebuild writes it to. */
  versionGap: number | null;
  previousShowId: string | null;
};

/** Decides whether a track "counts" for a recurrence series. */
export type RecurrencePredicate = (track: RecurrenceTrackForWalk) => boolean;

/** True when a track segues out (its own segue is non-empty). */
function seguesOut(track: RecurrenceTrackForWalk): boolean {
  return track.segue !== null && track.segue !== "";
}

/** Qualifies a track that neither segues out nor is segued in. */
export const standalonePredicate: RecurrencePredicate = (track) => !seguesOut(track) && !track.seguedIn;

/** Qualifies a track that is not segued into. */
export const notSeguedInPredicate: RecurrencePredicate = (track) => !track.seguedIn;

/** Qualifies a track that does not segue out. */
export const notSeguedOutPredicate: RecurrencePredicate = (track) => !seguesOut(track);

/** Builds a predicate that qualifies tracks carrying the given flag. */
export function flagPredicate(flag: string): RecurrencePredicate {
  return (track) => track.flags.includes(flag);
}

/**
 * Generic recurrence walk. Walks a song's pre-sorted tracks chronologically
 * and, for each track where `qualifies(track, prevTrackInWalk)` holds, emits
 * its `gap` (count of stats-shows strictly between it and the prior QUALIFYING
 * performance) and `previousShowId` (null ⇒ first qualifying performance).
 *
 * Mirrors `computeTrackGaps`: only count_for_stats=true qualifying tracks
 * advance the "last qualifying performance" cursor, so a non-stats qualifying
 * track gets a gap pointing at the prior stats performance but is never itself
 * pointed at. The same binary-search "shows between" denominator is used, so
 * the gap is comparable to the song-level gap.
 *
 * Emits TWO denominators per qualifying track: `gap` (stats-SHOWS between) and
 * `versionGap` (the song's own stats PERFORMANCES between). `versionGap` is the
 * meaningful one for shape/flag recurrence — a value of 0 means the prior
 * version was also qualifying (no shape change), so a footnote keyed on it
 * won't fire on a song that was merely absent and returned in the same shape.
 * The version counter advances on every stats-show track the walk visits
 * (including the qualifying ones), so it counts intervening versions strictly
 * between consecutive qualifiers; non-stats tracks don't count as versions.
 */
export function computeRecurrence(
  sortedTracks: RecurrenceTrackForWalk[],
  qualifies: RecurrencePredicate,
  statsShowDates: string[],
): RecurrenceResult[] {
  const results: RecurrenceResult[] = [];
  let lastShowDate: string | null = null;
  let lastShowId: string | null = null;
  // Count of stats-show performances of this song seen so far, and the count as
  // of the prior qualifying performance — their difference is `versionGap`.
  let seenVersions = 0;
  let lastQualifyingVersionCount = 0;

  for (const track of sortedTracks) {
    if (qualifies(track)) {
      let gap: number | null;
      let versionGap: number | null;
      let previousShowId: string | null;
      if (lastShowDate === null) {
        // First-ever qualifying instance. `previousShowId` null marks it as
        // first-time; `versionGap` carries VERSIONS BEFORE this one (how late in
        // the song's life the shape/flag first appeared) — drives the
        // "1st <…> (after X versions)" footnote. Distinct meaning from the
        // repeat case below (where versionGap is the gap BETWEEN instances), but
        // callers disambiguate via the null previousShowId.
        gap = null;
        versionGap = seenVersions;
        previousShowId = null;
      } else {
        const leftBound = firstIndexGreaterThan(statsShowDates, lastShowDate);
        const rightBound = firstIndexGreaterOrEqual(statsShowDates, track.showDate);
        gap = Math.max(0, rightBound - leftBound);
        versionGap = seenVersions - lastQualifyingVersionCount;
        previousShowId = lastShowId;
      }
      results.push({ trackId: track.trackId, gap, versionGap, previousShowId });
      // Only stats shows advance the qualifying + version cursors.
      if (track.showCountForStats) {
        lastShowDate = track.showDate;
        lastShowId = track.showId;
        seenVersions++;
        lastQualifyingVersionCount = seenVersions;
      }
    } else if (track.showCountForStats) {
      // A non-qualifying stats performance is still a version of the song.
      seenVersions++;
    }
  }

  return results;
}

/**
 * Aggregate Song.* from a song's count_for_stats=true tracks. Counts
 * unique shows (a song played twice in one show counts once) and bins
 * by year for the yearly play data graph.
 */
export function computeSongStats(statsTracks: { showId: string; showDate: string }[]): SongStatsAggregate {
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

  // The year with the most plays. uniqueShowDates is sorted ascending, so
  // walking years in ascending order and keeping a strict `>` comparison
  // makes ties resolve to the earliest year — deterministic across recomputes.
  let mostCommonYear: number | null = null;
  let mostCommonCount = 0;
  for (const year of Object.keys(yearlyPlayData).sort()) {
    if (yearlyPlayData[year] > mostCommonCount) {
      mostCommonCount = yearlyPlayData[year];
      mostCommonYear = Number(year);
    }
  }

  return {
    timesPlayed: uniqueShowDates.length,
    dateFirstPlayed: uniqueShowDates[0] ? new Date(uniqueShowDates[0]) : null,
    dateLastPlayed: uniqueShowDates[uniqueShowDates.length - 1]
      ? new Date(uniqueShowDates[uniqueShowDates.length - 1])
      : null,
    yearlyPlayData,
    mostCommonYear,
  };
}
