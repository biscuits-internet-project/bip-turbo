import { CacheKeys } from "@bip/domain";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { FilteredSongPerformanceTable } from "~/lib/filtered-song-performance-table";
import { createNoteworthyLoader, type NoteworthyLoaderData } from "~/lib/noteworthy-performance-loader";
import { services } from "~/server/services";

export const loader = createNoteworthyLoader({
  cacheKey: CacheKeys.songs.allTimers(),
  build: () => services.songPageComposer.buildSongPerformances({ allTimer: true }),
});

export function meta() {
  return [{ title: "All-Timers | Songs" }, { name: "description", content: "The best performances across all songs" }];
}

export default function AllTimersPage() {
  const { performances } = useSerializedLoaderData<NoteworthyLoaderData>();
  return <FilteredSongPerformanceTable performances={performances} presetFilters={{ filters: "allTimer" }} />;
}
