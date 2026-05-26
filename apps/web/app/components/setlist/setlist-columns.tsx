import type { TrackLight } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";
import { buildGapCellState, isWithinShowRepeat } from "./gap-cell";
import {
  createGapColumn,
  createRatingColumn,
  createSetlistCommonColumns,
  createShowDateLinkColumn,
  type SetlistRatingContext,
} from "./setlist-common-columns";

/**
 * Row shape consumed by the gap-chart table. Narrowed from the full Setlist
 * tree so the column factory doesn't depend on Set/Show/Venue context —
 * just a TrackLight with the denormalized gap + previous-performance fields.
 */
export type SetlistTableRow = TrackLight;

/**
 * Columns for the SetlistCard "gap chart" view. Order is locked at
 * [Set, Track #, Song, Gap, Last Played, Rating]. The first three come
 * from the shared `createSetlistCommonColumns` helper; this factory adds
 * the gap-chart-specific Gap, Last Played, and the shared interactive
 * Rating column on the right edge. Args default to anonymous + empty so
 * isolated column tests stay terse.
 */
export function createSetlistColumns(ctx?: Partial<SetlistRatingContext>): ColumnDef<SetlistTableRow, unknown>[] {
  const ratingCtx: SetlistRatingContext = {
    showSlug: ctx?.showSlug ?? "",
    userRatingMap: ctx?.userRatingMap ?? new Map(),
    isAuthenticated: ctx?.isAuthenticated ?? false,
  };
  return [
    ...createSetlistCommonColumns<SetlistTableRow>(),
    createGapColumn<SetlistTableRow>({
      id: "gap",
      label: "Gap",
      weight: 0.8,
      state: (row, allRows) => buildGapCellState({ isRepeat: isWithinShowRepeat(allRows, row), gap: row.gap }),
      debutLabel: "Debut",
      thisShowLabel: "This Show",
    }),
    createShowDateLinkColumn<SetlistTableRow>({
      id: "lastPlayed",
      label: "Last Played",
      accessor: (row) => row.previousPerformanceShow,
      fixedWidth: "7.5rem",
    }),
    createRatingColumn<SetlistTableRow>(ratingCtx),
  ];
}
