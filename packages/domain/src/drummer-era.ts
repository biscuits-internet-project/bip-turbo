/**
 * Disco Biscuits drummer eras: the span each drummer held the drum seat in the
 * band. Era is a property of the period, not of an individual show, so it's
 * derived from the show date rather than the show's own lineup: a one-off guest
 * or sit-in doesn't change whose era a date falls in.
 */

export const DRUMMER_ERAS = ["ALTMAN", "AUCOIN", "MARLON"] as const;
export type DrummerEra = (typeof DRUMMER_ERAS)[number];

/**
 * Canonical drummer-era data: the single source of truth for era boundaries, the
 * drummer who defines each era, and the labels used across the app. `start` is the
 * drummer's first show, the inclusive boundary that opens the era for date
 * bucketing; `end` is their last show, used by windowed lineup/filter checks that
 * intentionally exclude the gap between drummers. The opening era has no `start`,
 * the current era has no `end`. ISO `YYYY-MM-DD` strings compare with `>=`.
 *
 * Consumed by drummerEraForDate, the musicians GUI (lineup windows in
 * musicians-constants), and the song-filter era options, so these dates live in
 * exactly one place.
 */
export interface DrummerEraInfo {
  era: DrummerEra;
  /** The drummer's musician slug, matching the musicians table. */
  musicianSlug: string;
  /** Full drummer name, for display. */
  drummerName: string;
  /** Stable key for the song-filter era option. */
  filterKey: string;
  /** Human label for the era filter. */
  filterLabel: string;
  /** First show, inclusive (YYYY-MM-DD). Absent for the opening era. */
  start?: string;
  /** Last show, inclusive (YYYY-MM-DD). Absent for the current era. */
  end?: string;
}

export const DRUMMER_ERA_INFO: readonly DrummerEraInfo[] = [
  {
    era: "ALTMAN",
    musicianSlug: "sam-altman",
    drummerName: "Sam Altman",
    filterKey: "sammy",
    filterLabel: "Sammy Era",
    end: "2005-08-27",
  },
  {
    era: "AUCOIN",
    musicianSlug: "allen-aucoin",
    drummerName: "Allen Aucoin",
    filterKey: "allen",
    filterLabel: "Allen Era",
    start: "2005-12-28",
    end: "2025-09-07",
  },
  {
    era: "MARLON",
    musicianSlug: "marlon-lewis",
    drummerName: "Marlon Lewis",
    filterKey: "marlon",
    filterLabel: "Marlon Era",
    start: "2025-10-31",
  },
];

// Successor first-show dates, latest-first, so the first start a date reaches wins.
const ERA_STARTS = DRUMMER_ERA_INFO.filter(
  (info): info is DrummerEraInfo & { start: string } => info.start != null,
).sort((a, b) => (a.start < b.start ? 1 : -1));

export function drummerEraForDate(date: string): DrummerEra {
  for (const { era, start } of ERA_STARTS) {
    if (date >= start) return era;
  }
  // Before any successor's first show: the opening era (the one with no start).
  return "ALTMAN";
}

/**
 * An era's bounds as `Date` objects, omitting an absent side, for the windowed
 * lineup/filter checks that work in `Date`s rather than the canonical ISO strings.
 */
export function eraDateWindow(info: DrummerEraInfo): { startDate?: Date; endDate?: Date } {
  const window: { startDate?: Date; endDate?: Date } = {};
  if (info.start) window.startDate = new Date(info.start);
  if (info.end) window.endDate = new Date(info.end);
  return window;
}
