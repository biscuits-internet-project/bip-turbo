import type { Song, TrendingSong } from "@bip/domain";
import { Plus } from "lucide-react";
import { Link, type LoaderFunctionArgs } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { NOT_PLAYED_SONG_FILTER_PARAM, SONG_FILTERS, SONGS_FILTER_PARAM } from "~/components/song/song-filters";
import { SongsTable } from "~/components/song/songs-table";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getSongsMeta } from "~/lib/seo";
import { addVenueInfoToSongs } from "~/lib/song-utilities";
import { services } from "~/server/services";

interface LoaderData {
  songs: Song[];
  songsNotPlayed: Song[];
  filter: string | null;
  searchParams: string;
  trendingSongs: TrendingSong[];
  yearlyTrendingSongs: TrendingSong[];
  recentShowsCount: number;
}

export const loader = publicLoader(async ({ request }: LoaderFunctionArgs): Promise<LoaderData> => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const filter = searchParams.get(SONGS_FILTER_PARAM) || null;
  searchParams.delete(SONGS_FILTER_PARAM);
  const cacheKey = filter ? `songs:index:filter-${filter}` : "songs:index:full";
  const cacheOptions = { ttl: 3600 }; // 1 hour

  const results = await services.cache.getOrSet(
    cacheKey,
    async () => {
      const recentShowsCount = 10;
      const [allSongs, filteredSongs, trendingSongs, yearlyTrendingSongs] = await Promise.all([
        services.songs.findMany({}),
        services.songs.findManyInDateRange(filter ? SONG_FILTERS[filter as keyof typeof SONG_FILTERS] || {} : {}),
        services.songs.findTrendingLastXShows(recentShowsCount, 6),
        services.songs.findTrendingLastYear(),
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
        trendingSongs,
        yearlyTrendingSongs,
        recentShowsCount,
      };
    },
    cacheOptions,
  );
  return {
    ...results,
    filter,
    searchParams: searchParams.toString(),
  };
});

interface TrendingSongCardProps {
  song: TrendingSong;
  recentShowsCount: number;
}

function TrendingSongCard({ song, recentShowsCount }: TrendingSongCardProps) {
  return (
    <Card className="glass-content hover:border-brand-primary/50 transition-all duration-300 group">
      <CardContent className="p-4">
        <div className="space-y-3">
          <Link
            to={`/songs/${song.slug}`}
            className="block text-lg font-semibold text-brand-primary hover:text-brand-secondary transition-colors group-hover:text-brand-secondary"
          >
            {song.title}
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary font-bold text-sm">
                {song.count}
              </div>
              <span className="text-content-text-secondary text-sm">of {recentShowsCount} recent shows</span>
            </div>
          </div>

          <div className="text-xs text-content-text-tertiary">{song.timesPlayed} total performances</div>
        </div>
      </CardContent>
    </Card>
  );
}

function YearlyTrendingSongs() {
  const { yearlyTrendingSongs } = useSerializedLoaderData<LoaderData>();

  if (yearlyTrendingSongs.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-content-text-primary">Popular This Year</h2>
      <Card className="card-premium">
        <CardContent className="p-4">
          <div className="divide-y divide-glass-border/30">
            {yearlyTrendingSongs.map((song: TrendingSong, index: number) => (
              <div
                key={song.id}
                className="py-2 flex items-center justify-between hover:bg-hover-glass transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-content-text-secondary font-medium w-5">{index + 1}</span>
                  <Link to={`/songs/${song.slug}`} className="text-brand-primary hover:text-brand-secondary">
                    {song.title}
                  </Link>
                </div>
                <span className="text-content-text-secondary text-sm">{song.count} shows</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function meta() {
  return getSongsMeta();
}

export default function Songs() {
  const { songs, songsNotPlayed, trendingSongs, yearlyTrendingSongs, recentShowsCount, filter, searchParams } =
    useSerializedLoaderData<LoaderData>();
  const urlSearchParams = new URLSearchParams(searchParams);
  const showNotPlayed = urlSearchParams.has(NOT_PLAYED_SONG_FILTER_PARAM);
  const title = filter ? `Songs - ${filter}` : "Songs";

  return (
    <div>
      <div>
        <div className="relative">
          <h1 className="page-heading">{title}</h1>
          <div className="absolute top-0 right-0">
            <AdminOnly>
              <Button asChild className="btn-primary">
                <Link to="/songs/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Song
                </Link>
              </Button>
            </AdminOnly>
          </div>
        </div>

        {!filter && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {trendingSongs.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-content-text-primary">Trending in Recent Shows</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {trendingSongs.map((song: TrendingSong) => (
                      <TrendingSongCard key={song.id} song={song} recentShowsCount={recentShowsCount} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">{yearlyTrendingSongs.length > 0 && <YearlyTrendingSongs />}</div>
          </div>
        )}

        <SongsTable
          songs={showNotPlayed ? songsNotPlayed : songs}
          currentSongFilter={filter}
          currentURLParameters={urlSearchParams}
        />
      </div>
    </div>
  );
}
