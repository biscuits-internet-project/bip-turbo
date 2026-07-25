/**
 * Duplicate-rater-account handling. One human sometimes rates under several
 * usernames — case/space/underscore variants (the same login typed differently)
 * or re-registrations after losing an old account. Left alone, that person's
 * opinion is counted two or three times on every show they rated under multiple
 * names, inflating the score. We collapse those to one identity at scoring time.
 *
 * Two layers:
 *  - `normalize` folds case/space/underscore, which provably catches login
 *    variants (e.g. "Rock Candy" / "RockCandy " / "rock_candy").
 *  - An {@link AliasRuleset} carries the same-person groups normalization misses (a
 *    one-letter spelling variant, or accounts sharing one confirmed email
 *    namespace), plus the names held out of merging. Those rules
 *    live in the `rater_alias_groups` table and are loaded by
 *    `AliasRulesetService` — see that file for why they are data, not code.
 *
 * Only same-person links backed by account *infrastructure* — a shared confirmed
 * email namespace, or near-identical usernames created minutes apart — earn a merge.
 * Behavioral "switch" evidence (one account re-rating another's batch with matching
 * scores) is deliberately NOT sufficient: a shared community score source, or a
 * script, produces that same pattern across genuinely different people. Several
 * rater accounts here re-rate one identical show-batch in lockstep yet never once
 * operate concurrently, so batch-mirroring cannot tell one operator from a shared
 * sheet.
 */

/** Fold a username to its login-variant key: lowercase, no spaces or underscores. */
export function normalize(username: string): string {
  return username.toLowerCase().replace(/[\s_]/g, "");
}

/** The merge rules {@link aliasKey} applies, as loaded from `rater_alias_groups`. */
export interface AliasRuleset {
  /** Normalized username → the identity key its votes fold into. */
  mergeRemap: ReadonlyMap<string, string>;
  /**
   * Normalized usernames held OUT of merging, so each account sharing the name stays
   * its own identity. Email mismatch alone does NOT disqualify a merge — email is
   * unique per account, so a user locked out of an old account must re-register with
   * a different address, making a mismatch the expected signature of a
   * re-registration. The real disambiguator is activity: a clean handoff (old account
   * quiet, new one picks up) points to one person, overlapping activity to two.
   */
  heldOut: ReadonlySet<string>;
}

/**
 * No curated rules — {@link aliasKey} then folds login variants and nothing else.
 * The correct ruleset for a unit test whose fixtures don't exercise curated merges;
 * production paths always pass the loaded one.
 */
export const EMPTY_ALIAS_RULESET: AliasRuleset = { mergeRemap: new Map(), heldOut: new Set() };

/**
 * The identity key a username belongs to — same key ⇒ treated as same person.
 * `denySoloKey` (the account's own id) is returned for held-out names so each stays
 * its own identity despite sharing a normalized form.
 */
export function aliasKey(username: string, denySoloKey: string | undefined, ruleset: AliasRuleset): string {
  const norm = normalize(username);
  if (denySoloKey && ruleset.heldOut.has(norm)) return `solo:${denySoloKey}`;
  return ruleset.mergeRemap.get(norm) ?? norm;
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
