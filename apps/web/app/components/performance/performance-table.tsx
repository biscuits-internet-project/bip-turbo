import type { SongPagePerformance } from "@bip/domain";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { DataTable } from "~/components/ui/data-table";
import { useAttendanceRowHighlight } from "~/hooks/use-attendance-row-highlight";
import { useSession } from "~/hooks/use-session";
import { useTrackUserRatings } from "~/hooks/use-track-user-ratings";
import { createPerformanceColumns } from "./performance-columns";

const getShowId = (performance: SongPagePerformance) => performance.show.id;

interface PerformanceTableProps {
  performances: SongPagePerformance[];
  songTitle?: string;
  showSongColumn?: boolean;
  showAllTimerColumn?: boolean;
  headerContent?: ReactNode;
}

/**
 * Composes DataTable with the standard performance-table building blocks:
 * attendance row highlighting, track user ratings, and the performance
 * column factory. Filtering is handled server-side by the calling route.
 */
export function PerformanceTable({
  performances,
  songTitle,
  showSongColumn,
  showAllTimerColumn,
  headerContent,
}: PerformanceTableProps) {
  const { user } = useSession();
  const isAuthenticated = !!user;

  const { rowClassName } = useAttendanceRowHighlight(performances, getShowId);

  const trackIds = useMemo(() => performances.map((performance) => performance.trackId), [performances]);
  const { userRatingMap } = useTrackUserRatings(trackIds);

  const columns = useMemo(
    () => createPerformanceColumns({ showSongColumn, showAllTimerColumn, songTitle, userRatingMap, isAuthenticated }),
    [showSongColumn, showAllTimerColumn, songTitle, userRatingMap, isAuthenticated],
  );

  return (
    <DataTable
      columns={columns}
      data={performances}
      getRowId={(performance) => performance.trackId}
      hideSearch
      filterComponent={headerContent}
      rowClassName={rowClassName}
      initialSorting={[{ id: "date", desc: true }]}
    />
  );
}
