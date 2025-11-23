import { FilterNav } from "~/components/filter-nav";
import { SONG_FILTERS } from "~/components/song/song-filters";

interface SongsFilterNavProps {
  currentSongFilter?: string | null;
}

export function SongsFilterNav({ currentSongFilter }: SongsFilterNavProps) {
  return (
    <FilterNav
      title={"Filter Songs"}
      items={Object.keys(SONG_FILTERS)}
      basePath="/songs/filter/"
      showAllButton={true}
      allURL="/songs"
      currentItem={currentSongFilter}
      widerItems={true}
    />
  );
}
