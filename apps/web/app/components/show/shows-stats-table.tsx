import type { ShowStatsRow } from "@bip/domain";
import type { SortingState } from "@tanstack/react-table";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { Card } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import { useAttendanceRowHighlight } from "~/hooks/use-attendance-row-highlight";
import { useSession } from "~/hooks/use-session";
import {
  filterShowStatsRows,
  readShowStatsFilters,
  type ShowStatsFilterState,
  UNFILTERED_SHOW_STATS,
  writeShowStatsFilters,
} from "~/lib/show-stats-filters";
import { readSortingParams, writeSortingParams } from "~/lib/table-sort-params";
import { getShowsColumns } from "./shows-columns";
import { ShowsFilterControls } from "./shows-filter-controls";

const getShowId = (row: ShowStatsRow) => row.id;

/** Newest first, matching the order the loader already returns rows in. */
const DEFAULT_SORTING: SortingState = [{ id: "date", desc: true }];

interface ShowsStatsTableProps {
  rows: ShowStatsRow[];
  externalSources: Record<string, ShowExternalSources>;
  /**
   * Path the filter links compose onto — the route rendering this table. Omit
   * to render the columns without any filter chrome, which is also the only
   * safe option on a page that already spends `timeRange` / `q` on another
   * table (the musician profile): the two would otherwise share URL params and
   * filter each other.
   */
  basePath?: string;
  /** Collapse the filter chrome on desktop too, for dense pages. */
  collapsibleOnDesktop?: boolean;
}

/**
 * Sortable, filterable table over the whole show catalog. Every row ships in a
 * single cached payload, so filtering, sorting, and pagination all happen here
 * rather than round-tripping — see `StatsService.getShowStatsRows`.
 *
 * Two independent row signals stack, matching the performances table:
 *   * count_for_stats=false (soundchecks, radio sessions, late-night sets) → muted text
 *   * the viewer attended → green left border
 */
export function ShowsStatsTable({ rows, externalSources, basePath, collapsibleOnDesktop }: ShowsStatsTableProps) {
  const { user } = useSession();
  const isAuthenticated = !!user;
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => (basePath ? readShowStatsFilters(searchParams) : UNFILTERED_SHOW_STATS),
    [basePath, searchParams],
  );
  const updateFilters = useCallback(
    (updates: Partial<ShowStatsFilterState>) => {
      // Typing in the search box shouldn't leave a history entry per keystroke.
      setSearchParams(writeShowStatsFilters(searchParams, updates), { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // Sorting rides in the URL too, so a "rarest 1999 shows" view is a shareable
  // link. Only on its own route — without filter chrome the table has no claim
  // on the page's params (the musician profile spends them on its song tables).
  const sorting = useMemo(
    () => (basePath ? readSortingParams(searchParams, DEFAULT_SORTING) : undefined),
    [basePath, searchParams],
  );
  const handleSortingChange = useCallback(
    (next: SortingState) => {
      setSearchParams(writeSortingParams(searchParams, next, DEFAULT_SORTING), { replace: true });
    },
    [searchParams, setSearchParams],
  );

  // One per-viewer fetch for the whole row set, shared by the green-row
  // highlight, the Attended filter, and the rating column. The community
  // average and count are NOT read from it — those ride along with the cached
  // rows so ratings render on first paint rather than after the fetch resolves.
  const {
    rowClassName: attendanceRowClassName,
    isAttended,
    attendanceMap,
    userRatingMap,
    displayedRatingMap,
  } = useAttendanceRowHighlight(rows, getShowId);

  // The map only carries shows the viewer actually attended, so its keys are
  // the set the Attended filter matches against.
  const attendedShowIds = useMemo(() => new Set(attendanceMap.keys()), [attendanceMap]);

  const visibleRows = useMemo(
    () => filterShowStatsRows(rows, filters, { externalSources, attendedShowIds }),
    [rows, filters, externalSources, attendedShowIds],
  );

  const columns = useMemo(
    () => getShowsColumns({ externalSources, userRatingMap, displayedRatingMap, isAuthenticated }),
    [externalSources, userRatingMap, displayedRatingMap, isAuthenticated],
  );

  const rowClassName = (row: ShowStatsRow) => {
    const parts: string[] = [];
    if (!row.countForStats) parts.push("opacity-60 text-content-text-tertiary");
    const attendance = attendanceRowClassName(row);
    if (attendance) parts.push(attendance);
    return parts.length > 0 ? parts.join(" ") : undefined;
  };

  const rowAttributes = (row: ShowStatsRow) => ({
    "data-attended": String(isAttended(row)),
    "data-counts-for-stats": String(row.countForStats),
  });

  const filterControls = basePath ? (
    <ShowsFilterControls
      filters={filters}
      onChange={updateFilters}
      basePath={basePath}
      currentURLParameters={searchParams}
      isAuthenticated={isAuthenticated}
      collapsibleOnDesktop={collapsibleOnDesktop}
    />
  ) : undefined;

  return (
    <Card className="py-4 px-1">
      <DataTable
        columns={columns}
        data={visibleRows}
        getRowId={getShowId}
        hideSearch
        filterComponent={filterControls}
        rowClassName={rowClassName}
        rowAttributes={rowAttributes}
        initialSorting={DEFAULT_SORTING}
        sorting={sorting}
        onSortingChange={basePath ? handleSortingChange : undefined}
      />
    </Card>
  );
}
