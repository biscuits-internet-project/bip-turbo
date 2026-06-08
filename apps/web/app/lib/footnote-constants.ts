// Client-safe constants for the auto-composed setlist footnotes (last-time-played
// and debut). Imports nothing from @bip/core so setlist components can reference
// these without the server-import-leak guardrail dragging core into the client
// bundle (see server-import-leak.test.ts).

/**
 * Master gate for the auto-composed last-time-played and debut footnotes. Kept
 * separate from MUSICIANS_FEATURE_ENABLED so the two can be validated and
 * shipped independently.
 */
export const AUTO_FOOTNOTES_ENABLED = true;

/**
 * A returning song earns a "last time played" footnote only once its gap (shows
 * since it last appeared) reaches this many shows. Below the threshold the
 * return isn't notable enough to annotate. Tuned by eye against real setlists.
 */
export const LAST_TIME_PLAYED_GAP_THRESHOLD = 40;

/**
 * Gate for the cross-show "completes" / "completed by" footnotes. Separate from
 * the other auto-footnote gates so the completion links can be validated and
 * shipped on their own.
 */
export const COMPLETIONS_FOOTNOTES_ENABLED = true;

/**
 * The first show whose debut footnotes are trustworthy. Earlier setlists are
 * incomplete enough that a song's "first appearance" is as often a gap in the
 * data as a real premiere, so debut footnotes are suppressed before this date.
 * ISO YYYY-MM-DD so a plain string compare orders it.
 */
export const DEBUT_FOOTNOTE_START_DATE = "1998-02-19";

/**
 * The first show whose gap-derived footnotes — "last played (N shows)" and the
 * "1st time" / "last time …" recurrence clauses — are trustworthy. A reliable
 * gap needs a denser performance history than a debut does, so this date is
 * later than DEBUT_FOOTNOTE_START_DATE. Structured flags, completion links,
 * annotations, and performer notes still render before it — they're observed
 * facts, not derived statistics.
 */
export const GAP_FOOTNOTE_START_DATE = "1998-08-28";

/**
 * Whether a footnote category is suppressed for a show because it predates the
 * category's trustworthy-data start date. Missing dates aren't suppressed — a
 * show with no date can't be placed in the scattered early era.
 */
function footnoteSuppressedBefore(showDate: string | undefined | null, startDate: string): boolean {
  return Boolean(showDate) && (showDate as string) < startDate;
}

/** Whether a show's debut footnotes are suppressed as pre-trustworthy. */
export function debutFootnoteSuppressed(showDate: string | undefined | null): boolean {
  return footnoteSuppressedBefore(showDate, DEBUT_FOOTNOTE_START_DATE);
}

/** Whether a show's gap-derived footnotes (last-played + recurrences) are
 *  suppressed as pre-trustworthy. */
export function gapFootnoteSuppressed(showDate: string | undefined | null): boolean {
  return footnoteSuppressedBefore(showDate, GAP_FOOTNOTE_START_DATE);
}
