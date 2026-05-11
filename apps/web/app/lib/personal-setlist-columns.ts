import type { PersonalAttendance } from "@bip/core";
import { buildGapCellState, type GapCellState, isWithinShowRepeat } from "~/components/setlist/gap-cell";

/**
 * Pure helpers for the SetlistCard "personal" view. Computes per-row
 * user-history columns (Total Times Seen, Last Seen, Last Before, Your Gap)
 * from a user-scoped payload of attended-show records and per-song
 * attendance records. Kept pure so the table component is trivially
 * testable and the heavy logic doesn't live inside React.
 *
 * All dates are ISO `YYYY-MM-DD` strings — lexicographic order matches
 * chronological order, so we can binary-search them directly.
 */

// Alias: per-user gap states share the same three-kind shape as the
// catalog-wide gap cell. Keeping a distinct exported name preserves the
// per-user vocabulary at call sites while the rendering logic stays DRY.
export type PersonalGap = GapCellState;

export interface PersonalSetlistRow {
  /**
   * Count of attended performances of this song **strictly before** the
   * current show's date. Mirrors `lastSeen`'s "strictly before" semantic
   * so the two columns stay consistent — viewing a 2020 show won't pull
   * a 2024 attendance into the count.
   */
  totalTimesSeen: number;
  /**
   * The user's most recent attended performance of this song **strictly
   * before** the current show's date. Null when this is/was the user's
   * personal debut. The column header in the UI reads "Last Seen" — we
   * deliberately don't surface a separate "most recent ever" column
   * because on an attended past show every row would read as the show's
   * own date, which the card header already shows.
   */
  lastSeen: PersonalAttendance | null;
  yourGap: PersonalGap;
}

export interface TrackContext {
  id: string;
  songId: string;
  set: string;
  position: number;
}

/**
 * Largest index `i` such that `arr[i].date < target`. Returns -1 if no
 * element is strictly before target.
 */
function indexOfLastStrictlyBefore(arr: PersonalAttendance[], target: string): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid].date < target) lo = mid + 1;
    else hi = mid;
  }
  return lo - 1;
}

/**
 * Count of attendances `a` where `lo < a.date < hi` (strict bounds).
 * Used to compute Your Gap = attended shows strictly between Last Before
 * and the current show's date.
 */
function countStrictlyBetween(arr: PersonalAttendance[], lo: string, hi: string): number {
  // Smallest index with arr[i].date > lo
  let left = 0;
  let right = arr.length;
  while (left < right) {
    const mid = (left + right) >>> 1;
    if (arr[mid].date <= lo) left = mid + 1;
    else right = mid;
  }
  const startIdx = left;
  // Smallest index with arr[i].date >= hi
  left = startIdx;
  right = arr.length;
  while (left < right) {
    const mid = (left + right) >>> 1;
    if (arr[mid].date < hi) left = mid + 1;
    else right = mid;
  }
  return left - startIdx;
}

export function computePersonalRow(args: {
  track: TrackContext;
  showDate: string;
  setlistTracks: TrackContext[];
  songAttendances: PersonalAttendance[];
  attendedShows: PersonalAttendance[];
}): PersonalSetlistRow {
  const { track, showDate, setlistTracks, songAttendances, attendedShows } = args;

  const lastSeenIdx = indexOfLastStrictlyBefore(songAttendances, showDate);
  // The "strictly before" index is also the count of attendances before
  // the show date — both columns share the same binary-search result.
  const totalTimesSeen = lastSeenIdx + 1;
  const lastSeen = lastSeenIdx >= 0 ? songAttendances[lastSeenIdx] : null;

  const isRepeat = isWithinShowRepeat(setlistTracks, track);
  // Personal "Your Gap" uses the same precedence as the catalog gap cell:
  // a repeat overrides everything; otherwise null lastSeen means the song
  // is a personal debut; otherwise count attended shows between.
  const yourGap: PersonalGap = buildGapCellState({
    isRepeat,
    gap: lastSeen === null ? null : countStrictlyBetween(attendedShows, lastSeen.date, showDate),
  });

  return { totalTimesSeen, lastSeen, yourGap };
}

/**
 * The numeric gap values from a list of personal rows, with debuts and
 * within-show repeats filtered out. Feed to `average` / `median` from
 * `@bip/domain` at call sites — the wrapper functions were trivial enough
 * to inline.
 */
export function eligiblePersonalGaps(rows: PersonalSetlistRow[]): number[] {
  const out: number[] = [];
  for (const row of rows) {
    if (row.yourGap.kind === "count") out.push(row.yourGap.value);
  }
  return out;
}
