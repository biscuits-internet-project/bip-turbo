/**
 * A single recording hosted on archive.org. The same show date can have many —
 * different tapers, source lineages, and remasters — which is why
 * {@link pickPrimaryArchiveRecording} exists. Lives in `@bip/domain` (not
 * `@bip/core`) so both the server-side catalog service and the client-side UI
 * can import the same type and ranking logic.
 */
export interface ArchiveDotOrgRecording {
  /** archive.org slug — used to load per-recording metadata from the player. */
  identifier: string;
  /** Human-readable title from archive.org; falls back to the identifier if missing. */
  title: string;
  /** Taper's signal-chain description (e.g. "Schoeps CCM41 > Edirol UA5"). Drives quality ranking. */
  source?: string;
  /** ISO timestamp of when the recording was uploaded. Useful for spotting recent remasters. */
  addedDate?: string;
  /** Pre-built public details URL on archive.org. Consumers link directly to this. */
  url: string;
}

/**
 * Rank a single recording by substring signals in its identifier and source.
 * Captures what a fan would pick when confronted with multiple tapes for the
 * same show: remasters and soundboard/matrix sources are almost always better
 * than the original audience transfer. The numbers are chosen so a remaster
 * (+750) beats a plain audience tape (+200) but loses to an actual soundboard
 * (+1000), and a soundboard remaster still wins decisively.
 */
function scoreRecording(recording: ArchiveDotOrgRecording): number {
  const haystack = `${recording.identifier} ${recording.source ?? ""}`.toLowerCase();
  let score = 0;
  if (/\b(sbd|soundboard|matrix)\b/.test(haystack)) score += 1000;
  if (/\b(aud|audience)\b/.test(haystack)) score += 200;
  if (/(mastered|remaster)/.test(haystack)) score += 750;
  if (/(flac16|flac24)/.test(haystack)) score += 25;
  return score;
}

/**
 * Choose the recording a player should load by default. Scores every
 * candidate by {@link scoreRecording} and breaks ties alphabetically on
 * identifier so the pick is deterministic across requests and across the
 * server/client boundary. Returns `null` only for an empty input — callers
 * don't need a second "nothing available" branch when they've already passed
 * a non-empty array.
 *
 * @param recordings All candidates for a single show date. Order doesn't
 *   matter; the function produces the same result for any permutation.
 */
export function pickPrimaryArchiveRecording(recordings: ArchiveDotOrgRecording[]): ArchiveDotOrgRecording | null {
  if (recordings.length === 0) return null;
  if (recordings.length === 1) return recordings[0];

  const scored = recordings.map((r) => ({ recording: r, score: scoreRecording(r) }));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.recording.identifier.localeCompare(b.recording.identifier);
  });
  return scored[0].recording;
}
