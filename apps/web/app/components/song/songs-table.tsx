import type { Song } from "@bip/domain";
import { songsColumns } from "~/components/song/songs-columns";
import { SongsFilterNav } from "~/components/song/songs-filter-nav";
import { DataTable } from "~/components/ui/data-table";

interface SongsTableProps {
  songs: Song[];
  displayFilterNav?: boolean;
  currentSongFilter?: string | null;
  currentURLParameters?: URLSearchParams;
}

export function SongsTable({
  songs,
  displayFilterNav = true,
  currentSongFilter,
  currentURLParameters = new URLSearchParams(),
}: SongsTableProps) {
  return (
    <div>
      {displayFilterNav && (
        <SongsFilterNav currentSongFilter={currentSongFilter} currentURLParameters={currentURLParameters} />
      )}
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
