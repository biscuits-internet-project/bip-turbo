import type { Song, TrendingSong } from "@bip/domain";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { songsColumns } from "~/components/song/songs-columns";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getSongsMeta } from "~/lib/seo";
import { services } from "~/server/services";

interface LoaderData {
  songs: Song[];
  trendingSongs: TrendingSong[];
  yearlyTrendingSongs: TrendingSong[];
  recentShowsCount: number;
}

export const loader = publicLoader(async ({ request }): Promise<LoaderData> => {
  const cacheKey = "songs:index:full";
  const cacheOptions = { ttl: 3600 }; // 1 hour

  return await services.cache.getOrSet(
    cacheKey,
    async () => {
      const recentShowsCount = 10;
      const [allSongs, trendingSongs, yearlyTrendingSongs] = await Promise.all([
        services.songs.findMany({}),
        services.songs.findTrendingLastXShows(recentShowsCount, 6),
        services.songs.findTrendingLastYear(),
      ]);

      // Filter out songs with no plays
      const songs = allSongs.filter((song) => song.timesPlayed > 0);

      // Get unique show dates for first/last played venue lookup
      const showDates = new Set<string>();
      songs.forEach((song) => {
        if (song.dateFirstPlayed) {
          showDates.add(song.dateFirstPlayed.toISOString().split("T")[0]);
        }
        if (song.dateLastPlayed) {
          showDates.add(song.dateLastPlayed.toISOString().split("T")[0]);
        }
      });

      // Fetch shows with venues for those dates
      const showsWithVenues = showDates.size > 0 ? await services.shows.findManyByDates(Array.from(showDates)) : [];

      // Create lookup maps
      const showsByDate = new Map(showsWithVenues.map((show) => [show.date, show]));

      // Enhance songs with venue information
      const enhancedSongs = songs.map((song) => ({
        ...song,
        firstPlayedShow: song.dateFirstPlayed
          ? showsByDate.get(song.dateFirstPlayed.toISOString().split("T")[0])
          : null,
        lastPlayedShow: song.dateLastPlayed ? showsByDate.get(song.dateLastPlayed.toISOString().split("T")[0]) : null,
      }));

      return {
        songs: enhancedSongs,
        trendingSongs,
        yearlyTrendingSongs,
        recentShowsCount,
      };
    },
    cacheOptions,
  );
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
  const { songs, trendingSongs, yearlyTrendingSongs, recentShowsCount } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        <div className="relative">
          <h1 className="page-heading">SONGS</h1>
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

        <DataTable
          columns={songsColumns}
          data={songs}
          searchKey="title"
          searchPlaceholder="Search songs..."
          hidePagination
        />
      </div>
    </div>
  );
}
