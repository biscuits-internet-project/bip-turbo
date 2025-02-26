import type { Song, TrendingSong } from "@bip/domain";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { publicLoader } from "../lib/base-loaders";
import { services } from "../server/services";

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
    <Card className="bg-gray-900 border-gray-800 hover:bg-accent/10 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link to={`/songs/${song.slug}`} className="text-white hover:text-purple-400">
            {song.title}
          </Link>
        </CardTitle>
      </CardHeader>
      {song.timesPlayed > 0 && (
        <CardContent>
          <p className="text-gray-400 text-sm">
            Played {song.timesPlayed} times
            {song.dateLastPlayed && (
              <span className="text-gray-500">
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
    <Card className="bg-gray-900 border-gray-800 hover:bg-accent/10 transition-colors">
      <CardHeader>
        <CardTitle className="text-lg">
          <Link to={`/songs/${song.slug}`} className="text-white hover:text-purple-400">
            {song.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-purple-400">{song.count} of the last 10 shows</p>
        <p className="text-gray-400 text-sm">{song.timesPlayed} times total</p>
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
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        value={searchValue}
        onChange={handleChange}
        placeholder="Search songs..."
        className="w-full pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-400"
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
      <h2 className="text-xl font-semibold mb-4 text-white">Popular This Year</h2>
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-4">
          <div className="divide-y divide-gray-800">
            {yearlyTrendingSongs.map((song: TrendingSong, index: number) => (
              <div key={song.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-medium w-5">{index + 1}</span>
                  <Link to={`/songs/${song.slug}`} className="text-white hover:text-purple-400">
                    {song.title}
                  </Link>
                </div>
                <span className="text-gray-400 text-sm">{song.count} shows</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Songs() {
  const { songs, trendingSongs, yearlyTrendingSongs } = useSerializedLoaderData<LoaderData>();

  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first.isIntersecting && !isLoading && displayCount < filteredSongs.length) {
            setIsLoading(true);
            setTimeout(() => {
              setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredSongs.length));
              setIsLoading(false);
            }, 100);
          }
        },
        { rootMargin: "800px" },
      );

      observer.observe(node);
    },
    [displayCount, filteredSongs.length, isLoading],
  );

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
      setDisplayCount(ITEMS_PER_PAGE);
    },
    [songs],
  );

  const visibleSongs = useMemo(() => filteredSongs.slice(0, displayCount), [filteredSongs, displayCount]);

  const hasMore = displayCount < filteredSongs.length;

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Songs</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {trendingSongs.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Trending in Recent Shows</h2>
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
          <p className="text-gray-400">{searchQuery ? `No songs found matching "${searchQuery}"` : "No songs found"}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleSongs.map((song: Song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>

            {hasMore && (
              <div ref={loadMoreRef} className="py-8 text-center text-gray-400">
                {isLoading ? "Loading more songs..." : `${filteredSongs.length - displayCount} more songs`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
