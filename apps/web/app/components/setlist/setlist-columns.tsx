import type { TrackLight } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";
import { buildGapCellState, isWithinShowRepeat } from "./gap-cell";
import { createGapColumn, createSetlistCommonColumns, createShowDateLinkColumn } from "./setlist-common-columns";

/**
 * Row shape consumed by the gap-chart table. Narrowed from the full Setlist
 * tree so the column factory doesn't depend on Set/Show/Venue context —
 * just a TrackLight with the denormalized gap + previous-performance fields.
 */
export type SetlistTableRow = TrackLight;

/**
 * Columns for the SetlistCard "gap chart" view. Order is locked at
 * [Set, Track #, Song, Gap, Last Played]. The first three come from the
 * shared `createSetlistCommonColumns` helper; this factory adds the
 * gap-chart-specific Gap and Last Played columns.
 */
export function createSetlistColumns(): ColumnDef<SetlistTableRow, unknown>[] {
  return [
    ...createSetlistCommonColumns<SetlistTableRow>(),
    createGapColumn<SetlistTableRow>({
      id: "gap",
      label: "Gap",
      width: "64px",
      state: (row, allRows) => buildGapCellState({ isRepeat: isWithinShowRepeat(allRows, row), gap: row.gap }),
      debutLabel: "Debut",
      thisShowLabel: "This Show",
    }),
    createShowDateLinkColumn<SetlistTableRow>({
      id: "lastPlayed",
      label: "Last Played",
      accessor: (row) => row.previousPerformanceShow,
      width: "140px",
    }),
  ];
}
