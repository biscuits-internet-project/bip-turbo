import type { Song } from "@bip/domain";
import { FilteredSongsStatsTable } from "~/components/song/filtered-songs-stats-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getSongsMeta } from "~/lib/seo";
import { fetchFilteredSongs } from "~/lib/song-utilities";

export const loader = publicLoader(async ({ request, context }) => {
  const url = new URL(request.url);
  return { songs: await fetchFilteredSongs(url, context) };
});

export function meta() {
  return getSongsMeta();
}

export default function Songs() {
  const { songs } = useSerializedLoaderData<{ songs: Song[] }>();

  return <FilteredSongsStatsTable songs={songs} />;
}
