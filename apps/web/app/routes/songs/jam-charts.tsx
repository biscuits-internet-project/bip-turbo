import { CacheKeys } from "@bip/domain";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { FilteredSongPerformanceTable } from "~/lib/filtered-song-performance-table";
import { createNoteworthyLoader, type NoteworthyLoaderData } from "~/lib/noteworthy-performance-loader";
import { services } from "~/server/services";

export const loader = createNoteworthyLoader({
  cacheKey: CacheKeys.songs.jamCharts(),
  build: () => services.songPageComposer.buildSongPerformances({ jamChart: true }),
});

export function meta() {
  return [
    { title: "Jam Charts | Songs" },
    { name: "description", content: "Noteworthy performances: all-timers and curated jam-chart picks" },
  ];
}

export default function JamChartsPage() {
  const { performances } = useSerializedLoaderData<NoteworthyLoaderData>();
  return <FilteredSongPerformanceTable performances={performances} presetFilters={{ filters: "jamChart" }} />;
}
