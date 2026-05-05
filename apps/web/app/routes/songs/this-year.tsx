import type { Song } from "@bip/domain";
import { FilteredSongsTable } from "~/components/song/filtered-songs-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { fetchFilteredSongs } from "~/lib/song-utilities";

export const loader = publicLoader(async ({ request, context }) => {
  // Synthesize the timeRange into the URL so fetchFilteredSongs sees the
  // tab's implicit filter as if it were a regular query param. Same cache
  // entry as /api/songs?timeRange=thisYear.
  const url = new URL(request.url);
  url.searchParams.set("timeRange", "thisYear");
  return { songs: await fetchFilteredSongs(url, context) };
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
