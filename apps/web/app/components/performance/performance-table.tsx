import type { SongPagePerformance } from "@bip/domain";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { DataTable } from "~/components/ui/data-table";
import { ToggleFilterGroup } from "~/components/ui/filters";
import { useAttendanceRowHighlight } from "~/hooks/use-attendance-row-highlight";
import { useSession } from "~/hooks/use-session";
import { useTrackUserRatings } from "~/hooks/use-track-user-ratings";
import { createPerformanceColumns } from "./performance-columns";
import { usePerformanceFilters } from "./use-performance-filters";

const getShowId = (performance: SongPagePerformance) => performance.show.id;

interface PerformanceTableProps {
  performances: SongPagePerformance[];
  songTitle?: string;
  showSongColumn?: boolean;
  showAllTimerColumn?: boolean;
  headerContent?: ReactNode;
  excludeFilters?: string[];
}

/**
 * Composes DataTable with the standard performance-table building blocks:
 * attendance highlighting, tag-based toggle filters, track user ratings,
 * and the performance column factory. Used by both /songs/all-timers and
 * /songs/$slug to avoid duplicating the hook-wiring boilerplate.
 */
export function PerformanceTable({
  performances,
  songTitle,
  showSongColumn,
  showAllTimerColumn,
  headerContent,
  excludeFilters,
}: PerformanceTableProps) {
  const { user } = useSession();
  const isAuthenticated = !!user;

  const { rowClassName, isAttended } = useAttendanceRowHighlight(performances, getShowId);

  const trackIds = useMemo(() => performances.map((performance) => performance.trackId), [performances]);
  const { userRatingMap } = useTrackUserRatings(trackIds);

  const { filteredPerformances, activeFilters, toggleFilter, clearFilters, filterDefinitions } = usePerformanceFilters(
    performances,
    { isAttended },
  );

  const columns = useMemo(
    () => createPerformanceColumns({ showSongColumn, showAllTimerColumn, songTitle, userRatingMap, isAuthenticated }),
    [showSongColumn, showAllTimerColumn, songTitle, userRatingMap, isAuthenticated],
  );

  const filterComponent = (
    <div className="space-y-4">
      {headerContent}
      <ToggleFilterGroup
        filters={
          excludeFilters
            ? filterDefinitions.filter((filter) => !excludeFilters.includes(filter.key))
            : filterDefinitions
        }
        activeFilters={activeFilters}
        onToggle={toggleFilter}
        onClearAll={clearFilters}
      />
    </div>
  );

  return (
    <DataTable
      columns={columns}
      data={filteredPerformances}
      getRowId={(performance) => performance.trackId}
      hideSearch
      filterComponent={filterComponent}
      rowClassName={rowClassName}
      initialSorting={[{ id: "date", desc: true }]}
    />
  );
}
