import type { Song } from "@bip/domain";
import { type ReactNode, useMemo } from "react";
import { getSongsColumns } from "~/components/song/songs-columns";
import { DataTable } from "~/components/ui/data-table";

interface SongsTableProps {
  songs: Song[];
  filterComponent?: ReactNode;
  isLoading?: boolean;
  showFilteredPlays?: boolean;
}

export function SongsTable({ songs, filterComponent, isLoading = false, showFilteredPlays = false }: SongsTableProps) {
  const columns = useMemo(() => getSongsColumns({ showFilteredPlays }), [showFilteredPlays]);
  const initialSorting = useMemo(
    () => [{ id: showFilteredPlays ? "filteredTimesPlayed" : "timesPlayed", desc: true }],
    [showFilteredPlays],
  );

  return (
    <div>
      <DataTable
        // Remount when the filtered-plays column appears/disappears so the
        // default sort actually flips between `timesPlayed` and
        // `filteredTimesPlayed`. DataTable's `initialSorting` only runs
        // once per mount, so a prop change alone would leave the prior sort.
        key={showFilteredPlays ? "filtered" : "base"}
        columns={columns}
        data={songs}
        hideSearch
        pageSize={50}
        filterComponent={filterComponent}
        isLoading={isLoading}
        initialSorting={initialSorting}
      />
    </div>
  );
}
