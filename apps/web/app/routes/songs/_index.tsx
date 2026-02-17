import type { Song, TrendingSong } from "@bip/domain";
import { CacheKeys } from "@bip/domain/cache-keys";
import { Flame, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { AuthorSearch } from "~/components/author/author-search";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { useSession } from "~/hooks/use-session";
import { publicLoader } from "~/lib/base-loaders";
import { getSongsMeta } from "~/lib/seo";
import { ERA_OPTIONS, YEAR_OPTIONS } from "~/lib/song-filters";
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
  const cacheKey = CacheKeys.songs.index();
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

const selectTriggerClass =
  "h-[42px] bg-glass-bg border border-glass-border text-white hover:bg-glass-bg/80 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20";
const selectContentClass = "bg-glass-bg border-glass-border backdrop-blur-md";
const selectItemClass = "text-content-text-primary hover:bg-hover-glass";
const labelClass =
  "text-xs font-medium text-content-text-secondary uppercase tracking-wide mb-1.5 h-[18px] flex items-center";

export default function Songs() {
  const { songs, trendingSongs, yearlyTrendingSongs, recentShowsCount } = useSerializedLoaderData<LoaderData>();
  const { user } = useSession();
  const [searchParams] = useSearchParams();
  const yearParam = searchParams.get("year");
  const eraParam = searchParams.get("era");
  const playedParam = searchParams.get("played");
  const authorParam = searchParams.get("author");
  const coverParam = searchParams.get("cover");
  const attendedParam = searchParams.get("attended");

  const [selectedYear, setSelectedYear] = useState<string>(yearParam || "all");
  const [selectedEra, setSelectedEra] = useState<string>(eraParam || "all");
  const [playedFilter, setPlayedFilter] = useState<"played" | "notPlayed">(
    playedParam === "notPlayed" ? "notPlayed" : "played",
  );
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(authorParam || null);
  const [coverFilter, setCoverFilter] = useState<"all" | "cover" | "original">(
    coverParam === "cover" ? "cover" : coverParam === "original" ? "original" : "all",
  );
  const [attendedFilter, setAttendedFilter] = useState<"all" | "attended">(
    attendedParam === "attended" ? "attended" : "all",
  );
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songs);
  const [isLoadingFiltered, setIsLoadingFiltered] = useState(false);

  // Auto-expand if URL has advanced filter params
  const hasAdvancedParams = yearParam || eraParam || playedParam === "notPlayed" || attendedParam === "attended";
  const [showMoreFilters, setShowMoreFilters] = useState(!!hasAdvancedParams);

  const hasDateRange = selectedYear !== "all" || selectedEra !== "all";
  const hasAnyFilter = hasDateRange || selectedAuthor || coverFilter !== "all" || attendedFilter !== "all";

  // Helper to update URL without React Router re-render
  const updateUrl = (params: {
    year?: string;
    era?: string;
    played?: "played" | "notPlayed";
    author?: string | null;
    cover?: "all" | "cover" | "original";
    attended?: "all" | "attended";
  }) => {
    const newParams = new URLSearchParams(window.location.search);
    if (params.year && params.year !== "all") {
      newParams.set("year", params.year);
    } else {
      newParams.delete("year");
    }
    if (params.era && params.era !== "all") {
      newParams.set("era", params.era);
    } else {
      newParams.delete("era");
    }
    const hasDateRangeParam = (params.year && params.year !== "all") || (params.era && params.era !== "all");
    const hasAttendedParam = params.attended && params.attended !== "all";
    if ((hasDateRangeParam || hasAttendedParam) && params.played === "notPlayed") {
      newParams.set("played", "notPlayed");
    } else {
      newParams.delete("played");
    }
    if (params.author && params.author !== "none") {
      newParams.set("author", params.author);
    } else {
      newParams.delete("author");
    }
    if (params.cover && params.cover !== "all") {
      newParams.set("cover", params.cover);
    } else {
      newParams.delete("cover");
    }
    if (params.attended && params.attended !== "all") {
      newParams.set("attended", params.attended);
    } else {
      newParams.delete("attended");
    }
    const newUrl = newParams.toString()
      ? `${window.location.pathname}?${newParams.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  };

  // Fetch filtered songs when any filter changes
  useEffect(() => {
    if (
      selectedYear === "all" &&
      selectedEra === "all" &&
      !selectedAuthor &&
      coverFilter === "all" &&
      attendedFilter === "all"
    ) {
      setFilteredSongs(songs);
      setIsLoadingFiltered(false);
      return undefined;
    }

    const controller = new AbortController();

    // Only show loading if fetch takes more than 200ms to prevent flickering
    const loadingTimeout = setTimeout(() => {
      setIsLoadingFiltered(true);
    }, 200);

    const params = new URLSearchParams();
    if (selectedYear !== "all") {
      params.set("year", selectedYear);
    }
    if (selectedEra !== "all") {
      params.set("era", selectedEra);
    }
    if ((selectedYear !== "all" || selectedEra !== "all" || attendedFilter !== "all") && playedFilter === "notPlayed") {
      params.set("played", "notPlayed");
    }
    if (selectedAuthor && selectedAuthor !== "none") {
      params.set("author", selectedAuthor);
    }
    if (coverFilter !== "all") {
      params.set("cover", coverFilter);
    }
    if (attendedFilter !== "all") {
      params.set("attended", attendedFilter);
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
  }, [selectedYear, selectedEra, playedFilter, selectedAuthor, coverFilter, attendedFilter, songs]);

  const filterPanel = (
    <>
      <div className="flex flex-col">
        <label htmlFor="author-search" className={labelClass}>
          Author
        </label>
        <AuthorSearch
          value={selectedAuthor}
          onValueChange={(value) => {
            const newAuthor = value === "none" ? null : value;
            setSelectedAuthor(newAuthor);
            updateUrl({
              year: selectedYear,
              era: selectedEra,
              played: playedFilter,
              author: newAuthor,
              cover: coverFilter,
              attended: attendedFilter,
            });
          }}
          placeholder="All Authors"
          className="w-[150px] sm:w-[200px] h-[42px]"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="cover-filter" className={labelClass}>
          Original / Cover
        </label>
        <Select
          value={coverFilter}
          onValueChange={(value) => {
            const newCoverFilter = value as "all" | "cover" | "original";
            setCoverFilter(newCoverFilter);
            updateUrl({
              year: selectedYear,
              era: selectedEra,
              played: playedFilter,
              author: selectedAuthor,
              cover: newCoverFilter,
              attended: attendedFilter,
            });
          }}
        >
          <SelectTrigger id="cover-filter" className={`w-[120px] ${selectTriggerClass}`}>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            <SelectItem value="all" className={selectItemClass}>
              All
            </SelectItem>
            <SelectItem value="original" className={selectItemClass}>
              Original
            </SelectItem>
            <SelectItem value="cover" className={selectItemClass}>
              Cover
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col">
        <div className="h-[18px] mb-1.5" />
        <button
          type="button"
          onClick={() => setShowMoreFilters((v) => !v)}
          className="text-sm text-brand-primary hover:text-brand-secondary h-[42px] flex items-center whitespace-nowrap transition-colors"
        >
          {showMoreFilters ? "Hide More Filters" : "Show More Filters"}
        </button>
      </div>
    </>
  );

  const secondaryFilterPanel = (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        showMoreFilters ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-end flex-wrap gap-x-4 gap-y-3">
        <div className="flex flex-col">
          <label htmlFor="year-filter" className={labelClass}>
            Year
          </label>
          <Select
            value={selectedYear}
            onValueChange={(value) => {
              const newYear = value;
              setSelectedYear(newYear);
              if (newYear !== "all") {
                setSelectedEra("all");
              }
              updateUrl({
                year: newYear,
                era: newYear !== "all" ? "all" : selectedEra,
                played: playedFilter,
                author: selectedAuthor,
                cover: coverFilter,
                attended: attendedFilter,
              });
            }}
          >
            <SelectTrigger id="year-filter" className={`w-[130px] ${selectTriggerClass}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all" className={selectItemClass}>
                All Years
              </SelectItem>
              {YEAR_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className={selectItemClass}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="era-filter" className={labelClass}>
            Era
          </label>
          <Select
            value={selectedEra}
            onValueChange={(value) => {
              const newEra = value;
              setSelectedEra(newEra);
              if (newEra !== "all") {
                setSelectedYear("all");
              }
              updateUrl({
                year: newEra !== "all" ? "all" : selectedYear,
                era: newEra,
                played: playedFilter,
                author: selectedAuthor,
                cover: coverFilter,
                attended: attendedFilter,
              });
            }}
          >
            <SelectTrigger id="era-filter" className={`w-[170px] ${selectTriggerClass}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              <SelectItem value="all" className={selectItemClass}>
                All Eras
              </SelectItem>
              {ERA_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className={selectItemClass}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {user && (
          <div className="flex flex-col">
            <label htmlFor="attended-filter" className={labelClass}>
              Attendance
            </label>
            <Select
              value={attendedFilter}
              onValueChange={(value) => {
                const newAttendedFilter = value as "all" | "attended";
                setAttendedFilter(newAttendedFilter);
                updateUrl({
                  year: selectedYear,
                  era: selectedEra,
                  played: playedFilter,
                  author: selectedAuthor,
                  cover: coverFilter,
                  attended: newAttendedFilter,
                });
              }}
            >
              <SelectTrigger id="attended-filter" className={`w-[130px] ${selectTriggerClass}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                <SelectItem value="all" className={selectItemClass}>
                  All Shows
                </SelectItem>
                <SelectItem value="attended" className={selectItemClass}>
                  Attended
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {(hasDateRange || attendedFilter !== "all") && (
          <div className="flex flex-col">
            <label htmlFor="played-filter" className={labelClass}>
              Played
            </label>
            <Select
              value={playedFilter}
              onValueChange={(value) => {
                const newPlayedFilter = value as "played" | "notPlayed";
                setPlayedFilter(newPlayedFilter);
                updateUrl({
                  year: selectedYear,
                  era: selectedEra,
                  played: newPlayedFilter,
                  author: selectedAuthor,
                  cover: coverFilter,
                  attended: attendedFilter,
                });
              }}
            >
              <SelectTrigger id="played-filter" className={`w-[150px] ${selectTriggerClass}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                <SelectItem value="played" className={selectItemClass}>
                  Played
                </SelectItem>
                <SelectItem value="notPlayed" className={selectItemClass}>
                  Not Played
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {hasAnyFilter && (
          <div className="flex flex-col">
            <div className="h-[18px] mb-1.5" />
            <button
              type="button"
              onClick={() => {
                setSelectedYear("all");
                setSelectedEra("all");
                setPlayedFilter("played");
                setSelectedAuthor(null);
                setCoverFilter("all");
                setAttendedFilter("all");
                updateUrl({ year: "all", era: "all", played: "played", author: null, cover: "all", attended: "all" });
              }}
              className="text-sm text-content-text-tertiary hover:text-content-text-secondary underline h-[42px] flex items-center"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="">
      <div>
        <div className="relative">
          <h1 className="page-heading">SONGS</h1>
          <div className="absolute top-0 right-0 flex items-center gap-3">
            <Link
              to="/songs/all-timers"
              className="flex items-center gap-2 text-sm text-content-text-secondary hover:text-brand-primary transition-colors"
            >
              <Flame className="h-4 w-4 text-orange-500" />
              All-Timers
            </Link>
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

        <SongsTable songs={filteredSongs} filterComponent={filterPanel} secondaryFilterComponent={secondaryFilterPanel} isLoading={isLoadingFiltered} />
      </div>
    </div>
  );
}
