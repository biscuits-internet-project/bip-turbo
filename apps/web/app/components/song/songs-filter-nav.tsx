import { FilterNav } from "~/components/filter-nav";
import { NOT_PLAYED_SONG_FILTER_PARAM, SONG_FILTERS } from "~/components/song/song-filters";

interface SongsFilterNavProps {
  currentURLParameters?: URLSearchParams;
  currentSongFilter?: string | null;
}

export function SongsFilterNav({ currentURLParameters, currentSongFilter }: SongsFilterNavProps) {
  return (
    <FilterNav
      title={"Filter Songs"}
      filters={Object.keys(SONG_FILTERS)}
      basePath="/songs"
      showAllButton={true}
      allURL="/songs"
      currentFilter={currentSongFilter}
      widerItems={true}
      parameters={[NOT_PLAYED_SONG_FILTER_PARAM]}
      filterAsParameter={true}
      currentURLParameters={currentURLParameters}
    />
  );
}
