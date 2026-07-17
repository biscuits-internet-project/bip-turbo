import { countSortedBefore, type TrackLight } from "@bip/domain";
import { useMemo } from "react";
import { DataTable } from "~/components/ui/data-table";
import { usePreferences } from "~/hooks/use-preferences";
import { useSession } from "~/hooks/use-session";
import { useSongPlayDates } from "~/hooks/use-song-play-dates";
import { useTrackUserRatings } from "~/hooks/use-track-user-ratings";
import { createSetlistColumns, type SetlistTableRow } from "./setlist-columns";
import { applyTimePreference } from "./setlist-common-columns";

interface SetlistTableProps {
  tracks: TrackLight[];
  /**
   * Show slug — target of any rating submission from the in-row rating
   * cells. Threaded down to RatingBadgeButton.
   */
  showSlug: string;
  /**
   * Show date in `YYYY-MM-DD`. Drives the Played Before column — for each
   * row we count stats performances of the song strictly before this date.
   */
  showDate: string;
}

/**
 * Tabular "gap chart" rendering of a setlist. Pairs the column factory with
 * the shared DataTable shell. The average-song-gap summary line lives in
 * SetlistViewControl (rendered by SetlistCard above and below the table)
 * so it can sit on the same row as the setlist/gap-chart toggle.
 *
 * Calls `useTrackUserRatings` and `useSongPlayDates` lazily — this component
 * only mounts when the card is in `view="gap-chart"`, so list pages don't
 * fetch either dataset until a user actually opens the chart view. The
 * catalog play-dates blob is one fetch per session that powers Played
 * Before for every gap-chart toggle thereafter.
 */
export function SetlistTable({ tracks, showSlug, showDate }: SetlistTableProps) {
  const { user } = useSession();
  const { showSetlistTimes } = usePreferences();
  const isAuthenticated = !!user;
  const trackIds = useMemo(() => tracks.map((t) => t.id), [tracks]);
  const { userRatingMap, averageRatingMap } = useTrackUserRatings(trackIds);
  const { data: songPlayDates, isLoading: isPlayDatesLoading } = useSongPlayDates();

  const rows: SetlistTableRow[] = useMemo(() => {
    return tracks.map((track) => ({
      ...track,
      priorPerformanceCount: isPlayDatesLoading ? null : countSortedBefore(songPlayDates[track.songId] ?? [], showDate),
    }));
  }, [tracks, songPlayDates, isPlayDatesLoading, showDate]);

  const columns = useMemo(
    () =>
      applyTimePreference(
        createSetlistColumns({ showSlug, averageRatingMap, userRatingMap, isAuthenticated }),
        showSetlistTimes,
      ),
    [showSlug, averageRatingMap, userRatingMap, isAuthenticated, showSetlistTimes],
  );
  return (
    <DataTable
      columns={columns}
      data={rows}
      hideSearch
      hidePagination
      hidePaginationText
      // Set+position is the canonical order the composer already returns.
      // Pinning it as initial sort means clicking a header to sort then
      // clicking back to "Set" restores the canonical narrative.
      initialSorting={[{ id: "set", desc: false }]}
    />
  );
}
