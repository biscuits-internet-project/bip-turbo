/**
 * Aligns our ordered setlist tracks with the track list an external source
 * (nugs.net, archive.org) reports for the same show, so we can attach each of
 * our tracks a duration. The two lists never line up cleanly: external sources
 * insert filler tracks (crowd noise, tuning, banter), annotate titles with
 * track numbers and segue/encore markers, spell songs differently, and
 * occasionally reorder or split a song across consecutive files. The matcher
 * stays conservative — it only assigns a duration when titles agree — but it
 * aligns by longest common subsequence, so a local reorder or a single
 * mismatched title no longer strands the tracks around it.
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
 * Reduce a track title to a comparison key: lowercase, drop parenthetical and
 * bracketed annotations and a leading encore/set marker, fold "&"→"and", strip
 * remaining punctuation, collapse whitespace. So "Aceetobee >" / "aceetobee",
 * archive's "Spaga (1) ->" / "Spaga", "E: The Very Moon" / "The Very Moon", and
 * "On & On" / "On and On" each compare equal across our data and theirs.
 */
export function normalizeTrackTitle(title: string): string {
  return (
    title
      .toLowerCase()
      // archive.org appends a track-number / qualifier in parens or brackets
      // ("Spaga (1)", "Pygmy Twylyte (unf)", "The Overture [2]"); drop the whole
      // bracketed run before anything else reads it.
      .replace(/\([^)]*\)/g, " ")
      .replace(/\[[^\]]*\]/g, " ")
      // archive.org prefixes encores with "E:", "E)", or "enc:" (the "(e)" form
      // is already gone with the parens above).
      .replace(/^\s*(?:e|enc|encore)\s*[:)]\s*/, "")
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

/** Spelled-out forms for 0–20, indexed by value. Sources disagree on digits vs
 * words ("3 Wishes" vs "Three Wishes", "Sound 1" vs "Sound One", "5th Of
 * Beethoven" vs "A Fifth of Beethoven"); both sides canonicalize to the word so
 * the rest of the title can match. Values past twenty are left as digits —
 * they don't appear in the catalog and composing them isn't worth the risk. */
const CARDINAL_WORDS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];
const ORDINAL_WORDS = [
  "zeroth",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelfth",
  "thirteenth",
  "fourteenth",
  "fifteenth",
  "sixteenth",
  "seventeenth",
  "eighteenth",
  "nineteenth",
  "twentieth",
];

function numbersToWords(normalized: string): string {
  return normalized
    .split(" ")
    .map((token) => {
      const cardinal = /^\d+$/.test(token) ? Number(token) : null;
      if (cardinal !== null && cardinal < CARDINAL_WORDS.length) return CARDINAL_WORDS[cardinal];
      const ordinal = token.match(/^(\d+)(?:st|nd|rd|th)$/);
      if (ordinal) {
        const value = Number(ordinal[1]);
        if (value < ORDINAL_WORDS.length) return ORDINAL_WORDS[value];
      }
      return token;
    })
    .join(" ");
}

/** Split a normalized title on the " x " medley separator modern setlists use
 * ("The Great Abyss x D.M.T"). Returns a single-element array for ordinary
 * titles, so callers can treat "has more than one segment" as "is a medley". */
function medleySegments(normalized: string): string[] {
  return normalized.split(/ x /).filter((segment) => segment.length > 0);
}

/** Leading article, which never distinguishes one song from another — nugs
 * opens with bare "Overture" where our setlist has "The Overture". Stripped
 * from both sides before comparing so the article alone can't block a match. */
const LEADING_ARTICLE = /^(?:the|a|an) /;

function stripLeadingArticle(normalized: string): string {
  return normalized.replace(LEADING_ARTICLE, "");
}

/** Minimum length before any typo is tolerated — short titles ("On" vs "In")
 * are too easy to confuse, so fuzzy matching only kicks in for longer titles
 * where a differing character is almost certainly a typo. */
const TYPO_MIN_LENGTH = 6;

/** Minimum length (of the normalized titles compared) before a *two*-edit
 * difference is tolerated. A second edit roughly doubles the false-match risk,
 * so it's only allowed on titles long enough to stay distinctive — "pilin it
 * higher" (15) vs "pilin it high" (13) — while short pairs like "crickets" vs
 * "crackers" (8) stay apart. */
const TWO_EDIT_MIN_LENGTH = 10;

/**
 * Levenshtein edit distance (insert, delete, substitute), short-circuiting once
 * it provably exceeds `max` so the common no-match case stays cheap. Titles are
 * a handful of words, so the full DP is fine when the distance is small.
 */
function editDistanceWithin(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const dist = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      curr[j] = dist;
      if (dist < rowMin) rowMin = dist;
    }
    // Every remaining row only adds to the running minimum, so once a whole row
    // is past the budget the final cell can't come back under it.
    if (rowMin > max) return false;
    prev = curr;
  }
  return prev[b.length] <= max;
}

/**
 * True when two same-length titles differ in exactly one word, and that word
 * shares a long prefix on both sides — nugs' singular "Sugar Plum Fairy" for
 * our plural "Fairies". The 4-char shared-prefix floor (on a word the longer
 * side runs at least 6) keeps unrelated single-word swaps apart.
 */
function tokensNearMatch(a: string, b: string): boolean {
  const wordsA = a.split(" ");
  const wordsB = b.split(" ");
  if (wordsA.length !== wordsB.length) return false;
  let differing = -1;
  for (let k = 0; k < wordsA.length; k++) {
    if (wordsA[k] !== wordsB[k]) {
      if (differing !== -1) return false;
      differing = k;
    }
  }
  if (differing === -1) return false;
  const x = wordsA[differing];
  const y = wordsB[differing];
  if (Math.max(x.length, y.length) < 6) return false;
  let prefix = 0;
  while (prefix < x.length && prefix < y.length && x[prefix] === y[prefix]) prefix++;
  return prefix >= 4;
}

/**
 * True when two normalized titles refer to the same track. Exact match is the
 * common case. Leading articles are dropped first ("The Overture" vs
 * "Overture"); word spacing drifts between sources ("Sugarplum" vs "Sugar
 * Plum"), so a space-insensitive compare follows; digits and spelled-out
 * numbers are reconciled ("3 Wishes" vs "Three Wishes"); jam/improv words are
 * stripped ("Mishawaka Improv Jam" vs "Mishawaka Jam"); an "A x B" medley
 * matches its lead song; a single differing word that shares a long prefix is
 * forgiven ("Fairies" vs "Fairy"); and finally a one- or two-character typo in
 * a long title is tolerated (nugs' "Munckin Invasion", "Pilin' It Higher").
 */
function titlesMatch(a: string, b: string): boolean {
  a = stripLeadingArticle(a);
  b = stripLeadingArticle(b);
  if (a === b) return true;
  if (a.replaceAll(" ", "") === b.replaceAll(" ", "")) return true;
  const numA = numbersToWords(a);
  const numB = numbersToWords(b);
  if ((numA !== a || numB !== b) && (numA === numB || numA.replaceAll(" ", "") === numB.replaceAll(" ", ""))) {
    return true;
  }
  if (hasJamWord(a) || hasJamWord(b)) {
    const strippedA = withoutJamWords(a);
    if (strippedA.length > 0 && strippedA === withoutJamWords(b)) return true;
  }
  const segments = medleySegments(a);
  if (segments.length > 1 && titlesMatch(segments[0], b)) return true;
  const minLength = Math.min(a.length, b.length);
  if (minLength < TYPO_MIN_LENGTH) return false;
  if (tokensNearMatch(a, b)) return true;
  return editDistanceWithin(a, b, minLength >= TWO_EDIT_MIN_LENGTH ? 2 : 1);
}

/**
 * Returns a map of our-track `key` → duration seconds for every track we could
 * confidently align.
 *
 * Alignment is by longest common subsequence over {@link titlesMatch}: the
 * longest order-preserving set of matched (our, external) pairs. That skips
 * filler the source inserts and extra tracks we list, and — unlike a greedy
 * forward walk — survives a local transposition (our set order disagreeing
 * with the source's disc order) or a lone mismatched title without stranding
 * the tracks around it.
 *
 * Each matched pair takes its external file's duration, plus any adjacent
 * unmatched external files that continue the same song: a split track the
 * source spread across consecutive files (same title), or the trailing
 * segments of an "A x B" medley the source lists separately.
 */
export function matchTrackDurations(ours: MatchableTrack[], external: ExternalDurationTrack[]): Map<string, number> {
  const result = new Map<string, number>();
  const n = ours.length;
  const m = external.length;
  if (n === 0 || m === 0) return result;

  const ourNorms = ours.map((t) => normalizeTrackTitle(t.title));
  const extNorms = external.map((t) => normalizeTrackTitle(t.title));

  // LCS length table over the title-match relation.
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = titlesMatch(ourNorms[i - 1], extNorms[j - 1])
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack into the matched (our index, external index) pairs, ascending.
  const pairs: Array<{ ourIndex: number; extIndex: number }> = [];
  for (let i = n, j = m; i > 0 && j > 0; ) {
    if (titlesMatch(ourNorms[i - 1], extNorms[j - 1]) && dp[i][j] === dp[i - 1][j - 1] + 1) {
      pairs.push({ ourIndex: i - 1, extIndex: j - 1 });
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  pairs.reverse();

  // Slide each match back over any preceding unmatched files of the same song,
  // so a split track anchors on the FIRST of its run and the forward sum below
  // picks up the rest. Bounded by the previous match so two pairs can't fight
  // over the same file.
  let floor = -1;
  for (const pair of pairs) {
    while (pair.extIndex - 1 > floor && extNorms[pair.extIndex - 1] === ourNorms[pair.ourIndex]) {
      pair.extIndex--;
    }
    floor = pair.extIndex;
  }

  const matchedExt = new Set(pairs.map((p) => p.extIndex));
  for (let p = 0; p < pairs.length; p++) {
    const { ourIndex, extIndex } = pairs[p];
    const nextExt = p + 1 < pairs.length ? pairs[p + 1].extIndex : m;
    let sum = external[extIndex].seconds > 0 ? external[extIndex].seconds : 0;

    const segments = medleySegments(ourNorms[ourIndex]);
    let nextSegment = 1;
    for (let k = extIndex + 1; k < nextExt && !matchedExt.has(k); k++) {
      if (extNorms[k] === ourNorms[ourIndex]) {
        // Split continuation: the source spread one song across files.
        if (external[k].seconds > 0) sum += external[k].seconds;
        continue;
      }
      if (segments.length > 1 && nextSegment < segments.length && titlesMatch(segments[nextSegment], extNorms[k])) {
        // The next song of an "A x B" medley, listed as its own file.
        if (external[k].seconds > 0) sum += external[k].seconds;
        nextSegment++;
        continue;
      }
      break;
    }

    if (sum > 0) result.set(ours[ourIndex].key, sum);
  }

  return result;
}
