import type { TrackLight } from "@bip/domain";
import { useMemo } from "react";
import { DataTable } from "~/components/ui/data-table";
import { createSetlistColumns } from "./setlist-columns";

interface SetlistTableProps {
  tracks: TrackLight[];
}

/**
 * Tabular "gap chart" rendering of a setlist. Pairs the column factory with
 * the shared DataTable shell. The average-song-gap summary line lives in
 * SetlistViewControl (rendered by SetlistCard above and below the table)
 * so it can sit on the same row as the setlist/gap-chart toggle.
 */
export function SetlistTable({ tracks }: SetlistTableProps) {
  const columns = useMemo(() => createSetlistColumns(), []);
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
