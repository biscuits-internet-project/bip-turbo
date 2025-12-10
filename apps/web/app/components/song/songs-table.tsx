import type { Song } from "@bip/domain";
import type { ReactNode } from "react";
import { songsColumns } from "~/components/song/songs-columns";
import { DataTable } from "~/components/ui/data-table";

interface SongsTableProps {
  songs: Song[];
  filterComponent?: ReactNode;
  searchActions?: ReactNode;
  isLoading?: boolean;
}

export function SongsTable({ songs, filterComponent, searchActions, isLoading = false }: SongsTableProps) {
  return (
    <div>
      <DataTable
        columns={songsColumns}
        data={songs}
        searchKey="title"
        searchPlaceholder="Search songs..."
        hidePagination
        filterComponent={filterComponent}
        searchActions={searchActions}
        isLoading={isLoading}
      />
    </div>
  );
}
