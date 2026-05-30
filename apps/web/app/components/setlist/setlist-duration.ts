/** Running-time helpers for the SetlistCard flow view. Pure (no React) so the
 * total/partial math and the set-heading labels are unit-tested directly. */

export interface DurationSummary {
  /** Sum of known track durations (seconds). */
  seconds: number;
  /** How many tracks carry a known duration. */
  known: number;
  /** How many tracks are still untimed. */
  missing: number;
}

/**
 * Sum the known track durations and count how many are still untimed, so the
 * UI can render a Total and flag a partial sum (some tracks not yet resolved)
 * rather than imply the figure is complete.
 */
export function summarizeDurations(tracks: ReadonlyArray<{ duration: number | null }>): DurationSummary {
  let seconds = 0;
  let known = 0;
  for (const track of tracks) {
    if (track.duration != null) {
      seconds += track.duration;
      known += 1;
    }
  }
  return { seconds, known, missing: tracks.length - known };
}

/**
 * Block-style set heading for the flow view: spelled-out "Set 1" / "Encore" /
 * "Encore 2" (vs the compact "1" / "E" the table views use). A lone encore
 * drops its number, so pass the show's distinct-encore count. Unknown labels
 * (e.g. "Soundcheck") render verbatim.
 */
export function formatSetHeading(label: string, encoresInSet: number): string {
  const upper = label.toUpperCase();
  const setMatch = upper.match(/^S(\d+)$/);
  if (setMatch) return `Set ${setMatch[1]}`;
  const encoreMatch = upper.match(/^E(\d+)$/);
  if (encoreMatch) return encoresInSet === 1 ? "Encore" : `Encore ${encoreMatch[1]}`;
  return label;
}
