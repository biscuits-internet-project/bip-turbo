import type { Song } from "@bip/domain";
import type { ReactNode } from "react";
import { songsColumns } from "~/components/song/songs-columns";
import { DataTable } from "~/components/ui/data-table";

interface SongsTableProps {
  songs: Song[];
  filterComponent?: ReactNode;
  isLoading?: boolean;
}

export function SongsTable({ songs, filterComponent, isLoading = false }: SongsTableProps) {
  return (
    <div>
      <DataTable
        columns={songsColumns}
        data={songs}
        hideSearch
        pageSize={50}
        filterComponent={filterComponent}
        isLoading={isLoading}
        initialSorting={[{ id: "timesPlayed", desc: true }]}
      />
    </div>
  );
}
