import type { Song, TrendingSong } from "@bip/domain";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getSongsMeta } from "~/lib/seo";
import { addVenueInfoToSongs } from "~/lib/song-utilities";
import { services } from "~/server/services";
import { SongsTable } from "../../components/song/songs-table";

interface LoaderData {
  songs: Song[];
  trendingSongs: TrendingSong[];
  yearlyTrendingSongs: TrendingSong[];
  recentShowsCount: number;
}

export const loader = publicLoader(async (): Promise<LoaderData> => {
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

      const songsWithVenueInfo = await addVenueInfoToSongs(songs);
      return {
        songs: songsWithVenueInfo,
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

const ERA_OPTIONS = [
  { value: "sammy", label: "Sammy Era" },
  { value: "allen", label: "Allen Era" },
  { value: "marlon", label: "Marlon Era" },
  { value: "triscuits", label: "Triscuits" },
] as const;

export default function Songs() {
  const { songs, trendingSongs, yearlyTrendingSongs, recentShowsCount } = useSerializedLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const eraParam = searchParams.get("era");
  const playedParam = searchParams.get("played");
  // Open filter panel if there are filters in the URL
  const [showFilters, setShowFilters] = useState(!!eraParam || !!playedParam);
  // Default to "played" if not specified
  const [selectedEra, setSelectedEra] = useState<string>(eraParam || "all");
  const [playedFilter, setPlayedFilter] = useState<"played" | "notPlayed">(
    playedParam === "notPlayed" ? "notPlayed" : "played",
  );
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songs);
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);

  // Helper to update URL without React Router re-render
  const updateUrl = (params: { era?: string; played?: "played" | "notPlayed" }) => {
    const newParams = new URLSearchParams(window.location.search);
    if (params.era && params.era !== "all") {
      newParams.set("era", params.era);
    } else {
      newParams.delete("era");
    }
    if (params.played === "notPlayed") {
      newParams.set("played", "notPlayed");
    } else {
      newParams.delete("played");
    }
    const newUrl = newParams.toString()
      ? `${window.location.pathname}?${newParams.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  };

  // Fetch filtered songs when era or playedFilter changes
  useEffect(() => {
    if (selectedEra === "all") {
      setFilteredSongs(songs);
      setIsLoadingFiltered(false);
      return undefined;
    }

    const controller = new AbortController();

    // Only show loading if fetch takes more than 200ms to prevent flickering
    const loadingTimeout = setTimeout(() => {
      setIsLoadingFiltered(true);
    }, 200);

    const params = new URLSearchParams({ era: selectedEra });
    if (playedFilter === "notPlayed") {
      params.set("played", "notPlayed");
    }

    fetch(`/api/songs?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Song[]) => {
        clearTimeout(loadingTimeout);
        setIsLoadingFiltered(false);
        setFilteredSongs(data);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }
        clearTimeout(loadingTimeout);
        setIsLoadingFiltered(false);
        setFilteredSongs([]);
      });

    return () => {
      controller.abort();
      clearTimeout(loadingTimeout);
    };
  }, [selectedEra, playedFilter, songs]);

  const filterLink = (
    <button
      type="button"
      onClick={() => setShowFilters(!showFilters)}
      className="text-base font-medium text-brand-primary hover:text-brand-secondary transition-colors duration-200 whitespace-nowrap"
    >
      {showFilters ? "hide filters" : "show filters"}
    </button>
  );

  const filterPanel = (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        showFilters ? "max-h-[1000px] opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"
      }`}
    >
      <div className="card-premium rounded-lg p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-base font-semibold text-white whitespace-nowrap pr-4">filters:</h2>
          <Select
            value={selectedEra === "all" ? "" : selectedEra}
            onValueChange={(value) => {
              const newEra = value || "all";
              setSelectedEra(newEra);
              setPlayedFilter("played");
              updateUrl({ era: newEra, played: "played" });
            }}
          >
            <SelectTrigger
              id="era-filter"
              className="w-[200px] bg-glass-bg border-glass-border text-content-text-primary focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <SelectValue placeholder="Era" />
            </SelectTrigger>
            <SelectContent className="bg-glass-bg border-glass-border backdrop-blur-md">
              {ERA_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-content-text-primary hover:bg-hover-glass"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedEra !== "all" && (
            <Select
              value={playedFilter}
              onValueChange={(value) => {
                const newPlayedFilter = value as "played" | "notPlayed";
                setPlayedFilter(newPlayedFilter);
                updateUrl({ era: selectedEra, played: newPlayedFilter });
              }}
            >
              <SelectTrigger
                id="played-filter"
                className="w-[150px] bg-glass-bg border-glass-border text-content-text-primary focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-glass-bg border-glass-border backdrop-blur-md">
                <SelectItem value="played" className="text-content-text-primary hover:bg-hover-glass">
                  Played
                </SelectItem>
                <SelectItem value="notPlayed" className="text-content-text-primary hover:bg-hover-glass">
                  Not Played
                </SelectItem>
              </SelectContent>
            </Select>
          )}
          {selectedEra !== "all" && (
            <button
              type="button"
              onClick={() => {
                setSelectedEra("all");
                setPlayedFilter("played");
                updateUrl({ era: "all", played: "played" });
              }}
              className="text-sm text-content-text-tertiary hover:text-content-text-secondary underline"
            >
              clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="">
      <div>
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

        <SongsTable
          songs={filteredSongs}
          filterComponent={filterPanel}
          searchActions={filterLink}
          isLoading={isLoadingFiltered}
        />
      </div>
    </div>
  );
}
