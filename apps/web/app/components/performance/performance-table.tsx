import type { SongPagePerformance } from "@bip/domain";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Card } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import { useAttendanceRowHighlight } from "~/hooks/use-attendance-row-highlight";
import { useSession } from "~/hooks/use-session";
import { useTrackUserRatings } from "~/hooks/use-track-user-ratings";
import { createPerformanceColumns } from "./performance-columns";

const getShowId = (performance: SongPagePerformance) => performance.show.id;

interface PerformanceTableProps {
  performances: SongPagePerformance[];
  showSongColumn?: boolean;
  showAllTimerColumn?: boolean;
  /**
   * When true (and `showAllTimerColumn` is on), keep the flame column
   * visible on mobile and hide the Set column there instead. Used on
   * jam-charts surfaces where the noteworthy marker is the critical
   * signal at narrow viewports.
   */
  mobileFlamePriority?: boolean;
  showGapColumns?: boolean;
  /**
   * When true, render the Filtered Gap column. Route is responsible for
   * deriving this from its server-narrowing filter state (timeRange,
   * attended, toggles) — `searchText` does not count.
   */
  hasNarrowingFilter?: boolean;
  headerContent?: ReactNode;
  isLoading?: boolean;
  pageSize?: number;
}

/**
 * Composes DataTable with the standard performance-table building blocks:
 * attendance row highlighting, track user ratings, and the performance
 * column factory. Filtering is handled server-side by the calling route.
 */
export function PerformanceTable({
  performances,
  showSongColumn,
  showAllTimerColumn,
  mobileFlamePriority,
  showGapColumns,
  hasNarrowingFilter,
  headerContent,
  isLoading,
  pageSize,
}: PerformanceTableProps) {
  const { user } = useSession();
  const isAuthenticated = !!user;

  const { rowClassName: attendanceRowClassName } = useAttendanceRowHighlight(performances, getShowId);

  // Two independent row signals that can stack:
  //   * count_for_stats=false (soundchecks, radio sessions, cancelled stubs,
  //     late-night Tractorbeam sets) → muted text.
  //   * the user attended this show → green left border (from useAttendanceRowHighlight).
  // A soundcheck the user attended gets both — the dim text doesn't hide
  // the attendance border.
  const rowClassName = (perf: SongPagePerformance) => {
    const parts: string[] = [];
    if (perf.show.countForStats === false) parts.push("opacity-60 text-content-text-tertiary");
    const attendance = attendanceRowClassName(perf);
    if (attendance) parts.push(attendance);
    return parts.length > 0 ? parts.join(" ") : undefined;
  };

  const trackIds = useMemo(() => performances.map((performance) => performance.trackId), [performances]);
  const { userRatingMap, displayRatingMap, comparisonMap } = useTrackUserRatings(trackIds);

  const columns = useMemo(
    () =>
      createPerformanceColumns({
        showSongColumn,
        showAllTimerColumn,
        mobileFlamePriority,
        showGapColumns,
        hasNarrowingFilter,
        userRatingMap,
        isAuthenticated,
        displayRatingMap,
        comparisonMap,
      }),
    [
      showSongColumn,
      showAllTimerColumn,
      mobileFlamePriority,
      showGapColumns,
      hasNarrowingFilter,
      userRatingMap,
      isAuthenticated,
      displayRatingMap,
      comparisonMap,
    ],
  );

  return (
    <Card className="py-4 px-1">
      <DataTable
        columns={columns}
        data={performances}
        getRowId={(performance) => performance.trackId}
        hideSearch
        isLoading={isLoading}
        filterComponent={headerContent}
        rowClassName={rowClassName}
        initialSorting={[{ id: "date", desc: true }]}
        pageSize={pageSize}
      />
    </Card>
  );
}
