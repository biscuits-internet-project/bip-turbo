import type { Song } from "@bip/domain";
import { CacheKeys } from "@bip/domain/cache-keys";
import { FilteredSongsTable } from "~/components/song/filtered-songs-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { resolveLast10ShowsDateRange } from "~/lib/performance-filter-params";
import { loadSongsWithVenueInfo } from "~/lib/song-utilities";

export const loader = publicLoader(async () => {
  const dateRange = await resolveLast10ShowsDateRange();
  return loadSongsWithVenueInfo(
    CacheKeys.songs.filtered({ timeRange: "last10shows" }),
    dateRange ?? undefined,
  );
});

export function meta() {
  return [{ title: "Last 10 Shows | Songs" }, { name: "description", content: "Songs played in the last 10 shows" }];
}

export default function RecentPage() {
  const { songs } = useSerializedLoaderData<{ songs: Song[] }>();

  return <FilteredSongsTable songs={songs} extraParams={{ timeRange: "last10shows" }} hideTimeRange />;
}
