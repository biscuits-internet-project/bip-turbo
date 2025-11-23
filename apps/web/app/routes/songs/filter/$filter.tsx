import type { Song } from "@bip/domain";
import type { LoaderFunctionArgs } from "react-router-dom";
import { SONG_FILTERS } from "~/components/song/song-filters";
import { SongsTable } from "~/components/song/songs-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { addVenueInfoToSongs } from "~/routes/songs/song-utilities";
import { services } from "~/server/services";

interface LoaderData {
  songs: Song[];
  filter: string | null;
}

export const loader = publicLoader(async ({ params }: LoaderFunctionArgs): Promise<LoaderData> => {
  const filter = params.filter || null;
  const cacheKey = `songs:index:filter-${filter}`;
  const cacheOptions = { ttl: 3600 }; // 1 hour

  return await services.cache.getOrSet(
    cacheKey,
    async () => {
      const [allSongs] = await Promise.all([
        services.songs.findMany(filter ? SONG_FILTERS[filter as keyof typeof SONG_FILTERS] || {} : {}),
      ]);
      // Filter out songs with no plays
      const songs = allSongs.filter((song) => song.timesPlayed > 0);

      const songsWithVenueInfo = await addVenueInfoToSongs(songs);
      return {
        songs: songsWithVenueInfo,
        filter,
      };
    },
    cacheOptions,
  );
});

export default function FilteredSongs() {
  const { songs, filter } = useSerializedLoaderData<LoaderData>();
  return (
    <div className="">
      <div>
        <div className="relative">
          <h1 className="page-heading">Songs - {filter}</h1>
        </div>
        <div>
          <SongsTable songs={songs} currentSongFilter={filter} />
        </div>
      </div>
    </div>
  );
}
