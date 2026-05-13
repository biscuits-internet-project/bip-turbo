import type { TrackLight } from "@bip/domain";
import { useMemo } from "react";
import { DataTable } from "~/components/ui/data-table";
import { useSession } from "~/hooks/use-session";
import { useTrackUserRatings } from "~/hooks/use-track-user-ratings";
import { createSetlistColumns } from "./setlist-columns";

interface SetlistTableProps {
  tracks: TrackLight[];
  /**
   * Show slug — target of any rating submission from the in-row rating
   * cells. Threaded down to RatingBadgeButton.
   */
  showSlug: string;
}

/**
 * Tabular "gap chart" rendering of a setlist. Pairs the column factory with
 * the shared DataTable shell. The average-song-gap summary line lives in
 * SetlistViewControl (rendered by SetlistCard above and below the table)
 * so it can sit on the same row as the setlist/gap-chart toggle.
 *
 * Calls `useTrackUserRatings` lazily — this component only mounts when the
 * card is in `view="gap-chart"`, so list pages don't fetch viewer ratings
 * until a user actually opens the chart view.
 */
export function SetlistTable({ tracks, showSlug }: SetlistTableProps) {
  const { user } = useSession();
  const isAuthenticated = !!user;
  const trackIds = useMemo(() => tracks.map((t) => t.id), [tracks]);
  const { userRatingMap } = useTrackUserRatings(trackIds);

  const columns = useMemo(
    () => createSetlistColumns({ showSlug, userRatingMap, isAuthenticated }),
    [showSlug, userRatingMap, isAuthenticated],
  );
  return (
    <DataTable
      columns={columns}
      data={tracks}
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
