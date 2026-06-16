import type { Song } from "@bip/domain";
import { type ReactNode, useMemo } from "react";
import { getSongsColumns } from "~/components/song/songs-columns";
import { Card } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";

interface SongsTableProps {
  songs: Song[];
  filterComponent?: ReactNode;
  isLoading?: boolean;
  showFilteredPlays?: boolean;
  /**
   * Musician profile: render the standard single column set sourced from the
   * musician-scoped filtered fields (no all-time vs filtered pairing). Wins
   * over `showFilteredPlays`, which is forced off so the layout stays sparse.
   */
  filteredAsPrimary?: boolean;
}

export function SongsTable({
  songs,
  filterComponent,
  isLoading = false,
  showFilteredPlays = false,
  filteredAsPrimary = false,
}: SongsTableProps) {
  // filteredAsPrimary owns the layout: the standard sparse columns, sourced
  // from filtered fields. Force showFilteredPlays off so no pairing/icon-row
  // styling leaks in.
  const columns = useMemo(
    () => getSongsColumns({ showFilteredPlays: filteredAsPrimary ? false : showFilteredPlays, filteredAsPrimary }),
    [showFilteredPlays, filteredAsPrimary],
  );
  // Both the filtered-as-primary Plays column and the paired Filtered Plays
  // column sort on `filteredTimesPlayed`; only the plain all-time view sorts
  // on `timesPlayed`.
  const sortColumnId = filteredAsPrimary || showFilteredPlays ? "filteredTimesPlayed" : "timesPlayed";
  const initialSorting = useMemo(() => [{ id: sortColumnId, desc: true }], [sortColumnId]);

  return (
    <Card className="py-4 px-1">
      <DataTable
        // Remount when the sort column changes so the default sort actually
        // flips. DataTable's `initialSorting` only runs once per mount, so a
        // prop change alone would leave the prior sort.
        key={filteredAsPrimary ? "filtered-primary" : showFilteredPlays ? "filtered" : "base"}
        columns={columns}
        data={songs}
        hideSearch
        pageSize={50}
        filterComponent={filterComponent}
        isLoading={isLoading}
        initialSorting={initialSorting}
      />
    </Card>
  );
}
