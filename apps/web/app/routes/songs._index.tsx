import type { TrendingSong } from "@bip/core";
import type { Song } from "@bip/domain";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router-dom";
import superjson from "superjson";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { services } from "../server/services";

// Add this to your root layout or main CSS file:
// <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

const ITEMS_PER_PAGE = 50; // Number of items to show initially and each time "Load More" is clicked

type LoaderData = {
  songs: Song[];
  trendingSongs: TrendingSong[];
  yearlyTrendingSongs: TrendingSong[];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const [songs, trendingSongs, yearlyTrendingSongs] = await Promise.all([
    services.songs.findMany({}),
    services.songs.findTrending(),
    services.songs.findTrendingLastYear(),
  ]);

  const data: LoaderData = { songs, trendingSongs, yearlyTrendingSongs };
  return superjson.serialize(data);
}

interface SongCardProps {
  song: Song;
}

function SongCard({ song }: SongCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link to={`/songs/${song.slug}`} className="text-foreground hover:text-primary">
            {song.title}
          </Link>
        </CardTitle>
      </CardHeader>
      {song.timesPlayed > 0 && (
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Played {song.timesPlayed} times
            {song.dateLastPlayed && ` (Last: ${song.dateLastPlayed.toLocaleDateString()})`}
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
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader>
        <CardTitle className="text-lg">
          <Link to={`/songs/${song.slug}`} className="text-foreground hover:text-primary">
            {song.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-primary">Played in {song.count} of the last 10 shows</p>
        <p className="text-muted-foreground text-sm">{song.timesPlayed} times total</p>
      </CardContent>
    </Card>
  );
}

function SearchForm({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue.length >= 3 || searchValue.length === 0) {
        onSearch(searchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, onSearch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          placeholder="Search songs..."
          className="input"
        />
      </div>
    </div>
  );
}

function YearlyTrendingSongs() {
  const result = useLoaderData<typeof loader>();
  const { yearlyTrendingSongs } = superjson.deserialize(result) as LoaderData;

  if (yearlyTrendingSongs.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Popular This Year</h2>
      <Card>
        <CardContent className="p-4">
          <div className="divide-y divide-border">
            {yearlyTrendingSongs.map((song, index) => (
              <div key={song.id} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-medium w-5">{index + 1}</span>
                  <Link to={`/songs/${song.slug}`} className="text-foreground hover:text-primary">
                    {song.title}
                  </Link>
                </div>
                <span className="text-muted-foreground text-sm">{song.count} shows</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Songs() {
  const result = useLoaderData<typeof loader>();
  const { songs, trendingSongs, yearlyTrendingSongs } = superjson.deserialize(result) as LoaderData;

  const [filteredSongs, setFilteredSongs] = useState(songs);
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading) return;

      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 800;

      if (scrolledToBottom && displayCount < filteredSongs.length) {
        setIsLoading(true);
        console.log("Loading more songs...", displayCount, filteredSongs.length);
        setTimeout(() => {
          setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
          setIsLoading(false);
        }, 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [displayCount, filteredSongs.length, isLoading]);

  // Update filtered songs when songs change
  useEffect(() => {
    setFilteredSongs(songs);
  }, [songs]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query) {
        setFilteredSongs(songs);
      } else {
        const lowerQuery = query.toLowerCase();
        const filtered = songs.filter((song) => song.title.toLowerCase().includes(lowerQuery));
        setFilteredSongs(filtered);
      }
      setDisplayCount(ITEMS_PER_PAGE); // Reset display count when searching
    },
    [songs],
  );

  const visibleSongs = useMemo(() => filteredSongs.slice(0, displayCount), [filteredSongs, displayCount]);

  const hasMore = displayCount < filteredSongs.length;

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Songs</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {trendingSongs.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Trending in Recent Shows</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {trendingSongs.map((song) => (
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
          <p className="text-muted-foreground">
            {searchQuery ? `No songs found matching "${searchQuery}"` : "No songs found"}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>

            {hasMore && (
              <div className="py-8 text-center text-muted-foreground">
                {isLoading ? "Loading more songs..." : `${filteredSongs.length - displayCount} more songs`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
