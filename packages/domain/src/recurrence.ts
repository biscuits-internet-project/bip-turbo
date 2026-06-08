import type { SegueRecurrenceKind, TrackFlag } from "./models/track";

/** The kinds a recurrence threshold can be keyed by: every track flag plus the
 *  three segue kinds. */
export type RecurrenceKind = TrackFlag | SegueRecurrenceKind;

/**
 * Per-kind firing rule for a recurrence footnote. A recurrence fires when:
 *   versionGap >= `version`
 *   OR (versionGap > `minVersions` AND showGap > `minShows`)
 * i.e. a big version gap always fires; a moderate one fires only if it's also a
 * long calendar absence. (A first-ever, non-debut occurrence always fires; that
 * path doesn't consult these numbers.) "versionGap" = the song's own stats
 * performances since the prior same-shape / same-flag one; "showGap" = calendar
 * shows since. Rare flags (dyslexic/inverted) can run lower than the common
 * segue kinds — each kind carries its own numbers.
 */
export type RecurrenceThreshold = {
  /** versionGap at or above this always fires. */
  version: number;
  /** versionGap strictly above this fires IF showGap also clears `minShows`. */
  minVersions: number;
  /** show gap that a moderate (`> minVersions`) version gap must also clear. */
  minShows: number;
};

/**
 * Per-kind recurrence firing rules. A kind absent from this map never renders.
 *
 * IMPORTANT: these values are baked into the cached setlist payload — the
 * mapper gates server-side on them. Editing any value, or adding/removing a
 * kind, is a payload-shape change: bump every setlist-carrying cache key in
 * `cache-keys.ts` (show.data, setlist.data, shows.list, home.recentSetlists,
 * users.attendedSetlists, rock-operas.performances) or deployed instances will
 * serve stale recurrence notes until the TTL expires.
 */
export const RECURRENCE_THRESHOLDS: Partial<Record<RecurrenceKind, RecurrenceThreshold>> = {
  DYSLEXIC: { version: 20, minVersions: 10, minShows: 100 },
  INVERTED: { version: 20, minVersions: 10, minShows: 100 },
  STANDALONE: { version: 20, minVersions: 10, minShows: 100 },
  NOT_SEGUED_IN: { version: 20, minVersions: 10, minShows: 100 },
  NOT_SEGUED_OUT: { version: 20, minVersions: 10, minShows: 100 },
};
