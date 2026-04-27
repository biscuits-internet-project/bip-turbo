interface NarrowingFilterInputs {
  hasDateRange: boolean;
  hasAttendedUser: boolean;
  hasToggleFilters: boolean;
}

/**
 * True when at least one filter is active that restricts which performances
 * contribute to a count (date range, attended-shows, or a toggle like
 * encore/setOpener). Cover and author filters intentionally don't count —
 * they pick which songs appear but every matching song still surfaces its
 * full play history. Used by the "not played" gate and by the /songs UI to
 * decide whether the Filtered Plays column is meaningful.
 */
export function hasNarrowingFilter(inputs: NarrowingFilterInputs): boolean {
  return inputs.hasDateRange || inputs.hasAttendedUser || inputs.hasToggleFilters;
}

/**
 * Determines whether the "not played" filter should take effect. Requires both
 * the played=notPlayed param AND a narrowing filter that defines what "played
 * in this view" means.
 */
export function shouldShowNotPlayed(params: NarrowingFilterInputs & { playedParam: string | null }): boolean {
  return params.playedParam === "notPlayed" && hasNarrowingFilter(params);
}
