import type { Song } from "@bip/domain";
import type { LoaderFunctionArgs } from "react-router-dom";
import { NOT_PLAYED_SONG_FILTER_PARAM, SONG_FILTERS } from "~/components/song/song-filters";
import { SongsTable } from "~/components/song/songs-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { addVenueInfoToSongs } from "~/routes/songs/song-utilities";
import { services } from "~/server/services";

interface LoaderData {
  songs: Song[];
  songsNotPlayed: Song[];
  filter: string | null;
  searchParams: string;
}

export const loader = publicLoader(async ({ request, params }: LoaderFunctionArgs): Promise<LoaderData> => {
  const filter = params.filter || null;
  const cacheKey = `songs:index:filter-${filter}`;
  const cacheOptions = { ttl: 3600 }; // 1 hour
  const url = new URL(request.url);
  const results = await services.cache.getOrSet(
    cacheKey,
    async () => {
      const [allSongs, filteredSongs] = await Promise.all([
        services.songs.findMany({}),
        services.songs.findMany(filter ? SONG_FILTERS[filter as keyof typeof SONG_FILTERS] || {} : {}),
      ]);
      // Filter out songs with no plays
      const allSongsPlayed = allSongs.filter((song) => song.timesPlayed > 0);
      const filteredSongsPlayed = filteredSongs.filter((song) => song.timesPlayed > 0);

      // Remove all songs in filteredSongsPlayed from allSongsPlayed
      const songIdsPlayed = new Set(filteredSongsPlayed.map((song) => song.id));
      const songsNotPlayed = allSongsPlayed.filter((song) => !songIdsPlayed.has(song.id));

      const songsWithVenueInfo = await addVenueInfoToSongs(filteredSongsPlayed);
      const songsNotPlayedWithVenueInfo = await addVenueInfoToSongs(songsNotPlayed);
      return {
        songs: songsWithVenueInfo,
        songsNotPlayed: songsNotPlayedWithVenueInfo,
      };
    },
    cacheOptions,
  );
  return {
    ...results,
    filter,
    searchParams: url.searchParams.toString(),
  };
});

export default function FilteredSongs() {
  const { songs, songsNotPlayed, filter, searchParams } = useSerializedLoaderData<LoaderData>();
  const urlSearchParams = new URLSearchParams(searchParams);
  const showNotPlayed = urlSearchParams.has(NOT_PLAYED_SONG_FILTER_PARAM);
  return (
    <div className="">
      <div>
        <div className="relative">
          <h1 className="page-heading">Songs - {filter}</h1>
        </div>
        <div>
          <SongsTable
            songs={showNotPlayed ? songsNotPlayed : songs}
            currentSongFilter={filter}
            currentURLParameters={urlSearchParams}
          />
        </div>
      </div>
    </div>
  );
}
