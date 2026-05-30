/**
 * Aligns our ordered setlist tracks with the track list an external source
 * (nugs.net, archive.org) reports for the same show, so we can attach each of
 * our tracks a duration. The two lists never line up cleanly: external sources
 * insert filler tracks (crowd noise, tuning, banter), title songs with their
 * own punctuation and segue markers, and occasionally split one song across
 * consecutive files. The matcher is deliberately conservative — it only
 * assigns a duration when titles agree, and leaves anything ambiguous
 * unassigned for an admin to fill in.
 */

/** A track on our side, keyed by whatever identifier the caller wants back. */
export interface MatchableTrack {
  key: string;
  title: string;
}

/** A track from an external source, with its duration in seconds. */
export interface ExternalDurationTrack {
  title: string;
  seconds: number;
}

/**
 * Reduce a track title to a comparison key: lowercase, fold "&"→"and", drop
 * segue markers and punctuation, collapse whitespace. So "Aceetobee >" /
 * "aceetobee", "I-Man" / "I Man", and "On & On" / "On and On" each compare
 * equal across our data and theirs.
 */
export function normalizeTrackTitle(title: string): string {
  return (
    title
      .toLowerCase()
      // "&" and "and" are the same word ("On & On" vs "On and On"); fold before
      // dropping punctuation so the ampersand doesn't just vanish.
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Words that drift between sources and don't change which song a jam belongs
 * to — our "Mishawaka Improv Jam" is nugs' "Mishawaka Jam". Dropped before a
 * relaxed comparison so those titles still align on their distinctive words.
 */
const JAM_WORDS = new Set(["jam", "improv", "improvisation"]);

function hasJamWord(normalized: string): boolean {
  return normalized.split(" ").some((word) => JAM_WORDS.has(word));
}

function withoutJamWords(normalized: string): string {
  return normalized
    .split(" ")
    .filter((word) => word.length > 0 && !JAM_WORDS.has(word))
    .join(" ");
}

/** Minimum length before a single-character typo is tolerated — short titles
 * ("On" vs "In") are too easy to confuse, so fuzzy matching only kicks in for
 * longer titles where one differing character is almost certainly a typo. */
const TYPO_MIN_LENGTH = 6;

/**
 * True when `a` and `b` are within one edit (insert, delete, or substitute) —
 * i.e. Levenshtein distance ≤ 1. Used to forgive single-character typos in
 * external track titles (nugs' "Munckin Invasion" for "Munchkin Invasion").
 */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (long.length - short.length > 1) return false;
  if (long.length === short.length) {
    let diffs = 0;
    for (let i = 0; i < short.length; i++) {
      if (short[i] !== long[i] && ++diffs > 1) return false;
    }
    return diffs === 1;
  }
  // `long` is exactly one char longer — it matches with a single deletion.
  let i = 0;
  let j = 0;
  let skipped = false;
  while (i < short.length && j < long.length) {
    if (short[i] === long[j]) {
      i++;
      j++;
    } else {
      if (skipped) return false;
      skipped = true;
      j++;
    }
  }
  return true;
}

/**
 * True when two normalized titles refer to the same track. Exact match is the
 * common case. Word spacing drifts between sources ("Sugarplum" vs "Sugar
 * Plum"), so a space-insensitive compare is tried next; then jam/improv words
 * are stripped (so "Mishawaka Improv Jam" finds "Mishawaka Jam"); finally a
 * single-character typo in a long title is forgiven (nugs' "Munckin Invasion").
 */
function titlesMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (a.replaceAll(" ", "") === b.replaceAll(" ", "")) return true;
  if (hasJamWord(a) || hasJamWord(b)) {
    const strippedA = withoutJamWords(a);
    if (strippedA.length > 0 && strippedA === withoutJamWords(b)) return true;
  }
  return Math.min(a.length, b.length) >= TYPO_MIN_LENGTH && withinOneEdit(a, b);
}

/**
 * Returns a map of our-track `key` → duration seconds for every track we could
 * confidently align. Walks both lists with a two-pointer pass: on a title
 * match it assigns (summing consecutive external files that carry the same
 * title), otherwise it tries to resync by finding the current track later in
 * the external list (skipping filler/extra tracks) and gives up on a track
 * the source simply doesn't have.
 */
export function matchTrackDurations(ours: MatchableTrack[], external: ExternalDurationTrack[]): Map<string, number> {
  const result = new Map<string, number>();
  const ourNorms = ours.map((t) => normalizeTrackTitle(t.title));
  const extNorms = external.map((t) => normalizeTrackTitle(t.title));

  let i = 0;
  let j = 0;
  while (i < ours.length && j < external.length) {
    if (titlesMatch(ourNorms[i], extNorms[j])) {
      let sum = external[j].seconds > 0 ? external[j].seconds : 0;
      j++;
      // Sum consecutive external files for the same song (a split track), but
      // don't steal the duration of the same song played again next in our set.
      const nextOurNorm = i + 1 < ours.length ? ourNorms[i + 1] : null;
      while (j < external.length && extNorms[j] === ourNorms[i] && ourNorms[i] !== nextOurNorm) {
        if (external[j].seconds > 0) sum += external[j].seconds;
        j++;
      }
      if (sum > 0) result.set(ours[i].key, sum);
      i++;
    } else {
      // Look for our current track further down the external list, skipping
      // whatever filler/extra tracks sit in between.
      let found = -1;
      for (let k = j + 1; k < external.length; k++) {
        if (titlesMatch(ourNorms[i], extNorms[k])) {
          found = k;
          break;
        }
      }
      if (found !== -1) {
        j = found;
      } else {
        i++;
      }
    }
  }

  return result;
}
