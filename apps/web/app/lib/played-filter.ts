/**
 * Determines whether the "not played" filter should take effect. Requires both
 * the played=notPlayed param AND a narrowing filter (date range, attended, or
 * toggle filters) that defines what "played in this view" means.
 */
export function shouldShowNotPlayed(params: {
  playedParam: string | null;
  hasDateRange: boolean;
  hasAttendedUser: boolean;
  hasToggleFilters: boolean;
}): boolean {
  return (
    params.playedParam === "notPlayed" && (params.hasDateRange || params.hasAttendedUser || params.hasToggleFilters)
  );
}
