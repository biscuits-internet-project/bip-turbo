import type { Song } from "@bip/domain";
import { CacheKeys } from "@bip/domain/cache-keys";
import { FilteredSongsTable } from "~/components/song/filtered-songs-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { SONG_FILTERS } from "~/lib/song-filters";
import { loadSongsWithVenueInfo } from "~/lib/song-utilities";

export const loader = publicLoader(async () => {
  const { startDate, endDate } = SONG_FILTERS.thisYear;
  return loadSongsWithVenueInfo(
    CacheKeys.songs.filtered({ timeRange: "thisYear" }),
    { startDate, endDate },
  );
});

export function meta() {
  return [
    { title: "This Year | Songs" },
    { name: "description", content: `Songs played in ${new Date().getFullYear()}` },
  ];
}

export default function ThisYearPage() {
  const { songs } = useSerializedLoaderData<{ songs: Song[] }>();

  return <FilteredSongsTable songs={songs} extraParams={{ timeRange: "thisYear" }} hideTimeRange />;
}
