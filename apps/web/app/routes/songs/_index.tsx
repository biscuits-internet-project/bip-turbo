import type { Song, TrendingSong } from "@bip/domain";
import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useInfiniteScroll } from "~/hooks/use-infinite-scroll";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

const ITEMS_PER_PAGE = 50; // Number of items to show initially and each time "Load More" is clicked

interface LoaderData {
  songs: Song[];
  trendingSongs: TrendingSong[];
  yearlyTrendingSongs: TrendingSong[];
}

export const loader = publicLoader(async ({ request }): Promise<LoaderData> => {
  const [songs, trendingSongs, yearlyTrendingSongs] = await Promise.all([
    services.songs.findMany({}),
    services.songs.findTrendingLastXShows(10, 6),
    services.songs.findTrendingLastYear(),
  ]);

  return { songs, trendingSongs, yearlyTrendingSongs };
});

interface SongCardProps {
  song: Song;
}

function SongCard({ song }: SongCardProps) {
  return (
    <Card className="card-premium hover:border-brand-primary/60 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link to={`/songs/${song.slug}`} className="text-brand-primary hover:text-brand-secondary">
            {song.title}
          </Link>
        </CardTitle>
      </CardHeader>
      {song.timesPlayed > 0 && (
        <CardContent>
          <p className="text-content-text-secondary text-sm">
            Played {song.timesPlayed} times
            {song.dateLastPlayed && (
              <span className="text-content-text-tertiary">
                {" "}
                (Last: {new Date(song.dateLastPlayed).toLocaleDateString("en-US", { timeZone: "UTC" })})
              </span>
            )}
          </p>
        </CardContent>
      )}
    </Card>
  );
}

interface TrendingSongCardProps {
  song: TrendingSong;
}

function TrendingSongCard({ song }: TrendingSongCardProps) {
  return (
    <Card className="card-premium hover:border-brand-tertiary/60 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg">
          <Link to={`/songs/${song.slug}`} className="text-brand-primary hover:text-brand-secondary">
            {song.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-brand-tertiary">{song.count} of the last 10 shows</p>
        <p className="text-content-text-secondary text-sm">{song.timesPlayed} times total</p>
      </CardContent>
    </Card>
  );
}

function SearchForm({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchValue, setSearchValue] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      onSearch(value);
    },
    [onSearch],
  );

  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-content-text-secondary" />
      <Input
        type="search"
        value={searchValue}
        onChange={handleChange}
        placeholder="Search songs..."
        className="search-input w-full pl-10"
      />
    </div>
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
              <div key={song.id} className="py-2 flex items-center justify-between hover:bg-hover-glass transition-colors">
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
  return [
    { title: "Songs | Biscuits Internet Project" },
    {
      name: "description",
      content: "Browse and discover Disco Biscuits songs, including lyrics, history, and performances.",
    },
  ];
}

export default function Songs() {
  const { songs, trendingSongs, yearlyTrendingSongs } = useSerializedLoaderData<LoaderData>();

  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [searchQuery, setSearchQuery] = useState("");

  const { loadMoreRef, isLoading, currentCount, reset } = useInfiniteScroll({
    totalItems: filteredSongs.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query) {
        setFilteredSongs(songs);
      } else {
        const lowerQuery = query.toLowerCase();
        const filtered = songs.filter((song: Song) => song.title.toLowerCase().includes(lowerQuery));
        setFilteredSongs(filtered);
      }
      reset();
    },
    [songs, reset],
  );

  const visibleSongs = useMemo(() => filteredSongs.slice(0, currentCount), [filteredSongs, currentCount]);

  const hasMore = currentCount < filteredSongs.length;

  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-content-text-primary">Songs</h1>
          <AdminOnly>
            <Button asChild className="btn-primary">
              <Link to="/songs/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Song
              </Link>
            </Button>
          </AdminOnly>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {trendingSongs.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-content-text-primary">Trending in Recent Shows</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {trendingSongs.map((song: TrendingSong) => (
                    <TrendingSongCard key={song.id} song={song} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">{yearlyTrendingSongs.length > 0 && <YearlyTrendingSongs />}</div>
        </div>

        <SearchForm onSearch={handleSearch} />

        {filteredSongs.length === 0 ? (
          <p className="text-content-text-secondary">{searchQuery ? `No songs found matching "${searchQuery}"` : "No songs found"}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleSongs.map((song: Song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>

            {hasMore && (
              <div ref={loadMoreRef} className="py-8 text-center text-content-text-secondary">
                {isLoading ? "Loading more songs..." : `${filteredSongs.length - currentCount} more songs`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
