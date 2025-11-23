import type { Song } from "@bip/domain";
import { songsColumns } from "~/components/song/songs-columns";
import { DataTable } from "~/components/ui/data-table";

interface SongsTableProps {
  songs: Song[];
}

export function SongsTable({ songs }: SongsTableProps) {
  return (
    <DataTable
      columns={songsColumns}
      data={songs}
      searchKey="title"
      searchPlaceholder="Search songs..."
      hidePagination
    />
  );
}
