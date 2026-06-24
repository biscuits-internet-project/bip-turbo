/**
 * Duplicate-rater-account handling. One human sometimes rates under several
 * usernames — case/space/underscore variants (the same login typed differently)
 * or re-registrations after losing an old account. Left alone, that person's
 * opinion is counted two or three times on every show they rated under multiple
 * names, inflating the score. We collapse those to one identity at scoring time.
 *
 * Two layers:
 *  - `normalize` folds case/space/underscore, which provably catches login
 *    variants (e.g. "RyKnow" / "RyKnow ", "Digital Buddha" / "DigitalBuddha").
 *  - `ALIAS_MERGE_GROUPS` curates spelling variants that normalization misses
 *    (e.g. "Invisble" vs "Invisible"). Only confirmed-same-person groups go here;
 *    fuzzy matches that might be distinct people are deliberately excluded.
 */

/** Fold a username to its login-variant key: lowercase, no spaces or underscores. */
export function normalize(username: string): string {
  return username.toLowerCase().replace(/[\s_]/g, "");
}

/**
 * Confirmed same-person groups whose normalized keys still differ (spelling
 * variants). Each inner array lists the normalized forms that should merge.
 */
const ALIAS_MERGE_GROUPS: string[][] = [
  // "InvisbleBuddha" (misspelled) + "Invisiblebuddha" (correct) + "invisblebuddha".
  ["invisblebuddha", "invisiblebuddha"],
];

/** normalized form → the group's chosen representative key. */
const MERGE_REMAP = new Map<string, string>();
for (const group of ALIAS_MERGE_GROUPS) {
  const representative = group[0];
  for (const member of group) MERGE_REMAP.set(member, representative);
}

/**
 * Normalized keys held OUT of auto-merge pending human review. Email mismatch
 * alone does NOT disqualify a merge — email is unique per account, so a user
 * locked out of an old account must re-register with a different email, making a
 * mismatch the expected signature of a re-registration. The real disambiguator
 * is activity: a clean handoff (old account quiet, new one picks up) points to
 * one person; overlapping activity points to two. Only `digitalbuddha` remains
 * genuinely unclear AND affects scoring (both accounts rated, no email/name link,
 * only a weak handoff). The other same-name pairs are either corroborated
 * (handoff + username-as-email for axemoney) or have an empty side (moot).
 */
export const NO_AUTO_MERGE = new Set(["digitalbuddha"]);

/**
 * The identity key a username belongs to — same key ⇒ treated as same person.
 * `denySoloKey` (the account's own id) is returned for deny-listed names so each
 * stays its own identity despite sharing a normalized form.
 */
export function aliasKey(username: string, denySoloKey?: string): string {
  const norm = normalize(username);
  if (denySoloKey && NO_AUTO_MERGE.has(norm)) return `solo:${denySoloKey}`;
  return MERGE_REMAP.get(norm) ?? norm;
}

/**
 * Collapse ratings to one per identity: the most-recent vote within each key
 * group. `keyOf` maps a rating to its identity key (the {@link aliasKey} of its
 * username, or a prebuilt canonical-user id), so callers choose how accounts are
 * grouped. The single home for the "one human, one vote" reduction, shared by the
 * canonical average and the calibrated score.
 */
export function mostRecentPerKey<T extends { createdAt: Date }>(
  ratings: ReadonlyArray<T>,
  keyOf: (rating: T) => string,
): T[] {
  const best = new Map<string, T>();
  for (const rating of ratings) {
    const key = keyOf(rating);
    const current = best.get(key);
    if (!current || rating.createdAt > current.createdAt) best.set(key, rating);
  }
  return [...best.values()];
}
