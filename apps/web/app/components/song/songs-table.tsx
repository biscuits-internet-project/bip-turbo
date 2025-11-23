import type { Song } from "@bip/domain";
import { songsColumns } from "~/components/song/songs-columns";
import { SongsFilterNav } from "~/components/song/songs-filter-nav";
import { DataTable } from "~/components/ui/data-table";

interface SongsTableProps {
  songs: Song[];
  displayFilterNav?: boolean;
  currentSongFilter?: string | null;
}

export function SongsTable({ songs, displayFilterNav = true, currentSongFilter }: SongsTableProps) {
  return (
    <div>
      {displayFilterNav && <SongsFilterNav currentSongFilter={currentSongFilter} />}
      <DataTable
        columns={songsColumns}
        data={songs}
        searchKey="title"
        searchPlaceholder="Search songs..."
        hidePagination
      />
    </div>
  );
}
