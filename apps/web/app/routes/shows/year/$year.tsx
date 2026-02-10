import { CacheKeys, type SetlistLight } from "@bip/domain";
import { ArrowUp, Camera, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, type LoaderFunctionArgs } from "react-router-dom";
import type { ClientLoaderFunctionArgs } from "react-router";
import { AdminOnly } from "~/components/admin/admin-only";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { Button } from "~/components/ui/button";
import { YearFilterNav } from "~/components/year-filter-nav";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { publicLoader } from "~/lib/base-loaders";
import { getShowsMeta } from "~/lib/seo";
import { logger } from "~/lib/logger";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";

interface LoaderData {
  setlists: SetlistLight[];
  year: number;
  searchQuery?: string;
}

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Minimum characters required to trigger search
const MIN_SEARCH_CHARS = 4;

// Cache headers for CDN edge caching - different TTLs for current vs past years
export function headers({ loaderHeaders, data }: { loaderHeaders: Headers; data: LoaderData | undefined }): Headers {
  const headers = new Headers(loaderHeaders);
  const loaderData = data;
  const currentYear = new Date().getFullYear();
  const isCurrentYear = loaderData?.year === currentYear;
  const hasSearchQuery = !!loaderData?.searchQuery;

  // Don't cache search results
  if (hasSearchQuery) {
    headers.set("Cache-Control", "private, no-cache");
    return headers;
  }

  // Current year: shorter cache (5 min CDN) since new shows may be added
  // Past years: longer cache (1 day CDN) since data is stable
  if (isCurrentYear) {
    headers.set("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
    headers.set("Cache-Tag", `year-${loaderData?.year}`);
  } else {
    headers.set("Cache-Control", "public, max-age=300, s-maxage=86400, stale-while-revalidate=3600");
    headers.set("Cache-Tag", `year-${loaderData?.year}`);
  }

  return headers;
}

export const loader = publicLoader(async ({ request, params }: LoaderFunctionArgs): Promise<LoaderData> => {
  const url = new URL(request.url);
  const year = params.year || new Date().getFullYear();
  const yearInt = Number.parseInt(year as string, 10);
  const searchQuery = url.searchParams.get("q") || undefined;

  let setlists: SetlistLight[] = [];

  // If there's a search query with at least MIN_SEARCH_CHARS characters, use the search functionality
  if (searchQuery && searchQuery.length >= MIN_SEARCH_CHARS) {
    logger.info(`Loading search results for query: ${searchQuery}`);
    // Get show IDs from search
    const shows = await services.shows.search(searchQuery);

    if (shows.length > 0) {
      // Get setlists for the found shows
      const showIds = shows.map((show) => show.id);

      // Fetch setlists for these shows
      setlists = await services.setlists.findManyByShowIds(showIds);
    }

    return {
      setlists,
      year: yearInt,
      searchQuery,
    };
  }

  // Cache year-based listings - these are stable and cacheable
  const currentYear = new Date().getFullYear();
  const sortDirection = yearInt === currentYear ? "desc" : "asc";

  const yearCacheKey = CacheKeys.shows.list({
    year: yearInt,
    sort: sortDirection,
  });

  setlists = await services.cache.getOrSet(yearCacheKey, async () => {
    logger.info(`Loading shows from DB for year: ${yearInt}`);
    return await services.setlists.findManyLight({
      filters: {
        year: yearInt,
      },
      sort: [{ field: "date", direction: sortDirection }],
    });
  });

  logger.info(`Year ${yearInt} shows loaded: ${setlists.length} shows`);

  return {
    setlists,
    year: yearInt,
  };
});

export function meta({ data }: { data: LoaderData }) {
  return getShowsMeta(data.year, data.searchQuery);
}

// Client loader enables hydration when page is served from CDN cache
export const clientLoader = async ({ serverLoader }: ClientLoaderFunctionArgs) => {
  return serverLoader();
};
clientLoader.hydrate = true;

export default function ShowsByYear() {
  const { setlists, year, searchQuery } = useSerializedLoaderData<LoaderData>();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Extract show IDs for client-side data fetching
  const showIds = useMemo(() => setlists.map((setlist) => setlist.show.id), [setlists]);

  // Fetch user-specific data client-side (attendances, user ratings, average ratings)
  const { attendanceMap, userRatingMap, averageRatingMap } = useShowUserData(showIds);

  // Group setlists by month - memoize to prevent unnecessary recalculation
  const setlistsByMonth = useMemo(() => {
    return setlists.reduce(
      (acc, setlist) => {
        const date = new Date(setlist.show.date);
        const month = date.getMonth();
        if (!acc[month]) {
          acc[month] = [];
        }
        acc[month].push(setlist);
        return acc;
      },
      {} as Record<number, SetlistLight[]>,
    );
  }, [setlists]);

  // Get months that have shows
  const monthsWithShows = useMemo(() => {
    return Object.keys(setlistsByMonth).map(Number);
  }, [setlistsByMonth]);

  // Handle scroll event to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = window.innerHeight * 0.5; // Show after half screen height
      setShowBackToTop(window.scrollY > scrollThreshold);
    };

    // Check initial scroll position
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="relative">
      <div className="space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="relative">
          <h1 className="page-heading">SHOWS</h1>
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="hidden sm:flex">
              <Link to="/shows/with-photos" className="flex items-center gap-1">
                <Camera className="h-4 w-4" />
                <span>Photos</span>
              </Link>
            </Button>
            <AdminOnly>
              <Button variant="outline" size="sm" asChild>
                <Link to="/shows/new" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Show</span>
                </Link>
              </Button>
            </AdminOnly>
          </div>
          <div className="flex flex-wrap items-baseline justify-center gap-4 -mt-4">
            {!searchQuery && <span className="text-content-text-secondary text-xl font-medium">{year}</span>}
            {searchQuery && (
              <span className="text-content-text-secondary text-lg">Search results for "{searchQuery}"</span>
            )}
          </div>
        </div>

        {/* Navigation - Only show when not searching */}
        {!searchQuery && (
          <>
            <YearFilterNav currentYear={year} basePath="/shows/year/" />
            <div className="card-premium rounded-lg overflow-hidden">
              {/* Month navigation */}
              <div className="px-4 py-3">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  Jump to Month
                  <span className="text-xs font-normal text-content-text-tertiary bg-content-bg-secondary px-2 py-0.5 rounded-full">
                    {monthsWithShows.length} active
                  </span>
                </h2>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                  {months.map((month, index) => (
                    <a
                      key={month}
                      href={monthsWithShows.includes(index) ? `#month-${index}` : undefined}
                      className={cn(
                        "px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 text-center",
                        monthsWithShows.includes(index)
                          ? "text-content-text-secondary bg-content-bg-secondary hover:bg-content-bg-tertiary hover:text-white cursor-pointer"
                          : "text-content-text-tertiary bg-transparent cursor-not-allowed opacity-40",
                      )}
                    >
                      {month}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Results Section */}
        <div className="space-y-4">
          {/* Search Results Count */}
          {searchQuery && (
            <div className="text-content-text-secondary">
              Found {setlists.length} {setlists.length === 1 ? "show" : "shows"}
            </div>
          )}

          {/* Results Content */}
          <div>
            {/* Setlist cards */}
            <div className="space-y-8">
              {setlists.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-content-text-secondary text-lg">
                    {searchQuery ? "No shows found matching your search." : "No shows found for this year."}
                  </p>
                </div>
              ) : searchQuery ? (
                <div className="space-y-4">
                  {setlists.map((setlist) => (
                    <SetlistCard
                      key={setlist.show.id}
                      setlist={setlist}
                      userAttendance={attendanceMap.get(setlist.show.id) ?? null}
                      userRating={userRatingMap.get(setlist.show.id) ?? null}
                      showRating={averageRatingMap.get(setlist.show.id)?.average ?? setlist.show.averageRating}
                      className="transition-all duration-300 transform hover:scale-[1.01]"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {monthsWithShows
                    .sort((a, b) => (year === new Date().getFullYear() ? b - a : a - b))
                    .map((month) => (
                      <div key={month} className="space-y-4">
                        {setlistsByMonth[month]
                          .sort((a, b) => {
                            const dateA = new Date(a.show.date).getTime();
                            const dateB = new Date(b.show.date).getTime();
                            return year === new Date().getFullYear() ? dateB - dateA : dateA - dateB;
                          })
                          .map((setlist, index) => (
                            <div key={setlist.show.id}>
                              {index === 0 && <div id={`month-${month}`} className="scroll-mt-20" />}
                              <SetlistCard
                                setlist={setlist}
                                userAttendance={attendanceMap.get(setlist.show.id) ?? null}
                                userRating={userRatingMap.get(setlist.show.id) ?? null}
                                showRating={
                                  averageRatingMap.get(setlist.show.id)?.average ?? setlist.show.averageRating
                                }
                                className="transition-all duration-300 transform hover:scale-[1.01]"
                              />
                            </div>
                          ))}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <div
        className={cn(
          "fixed bottom-6 right-6 transition-all duration-300 z-50",
          showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none",
        )}
      >
        <Button
          onClick={scrollToTop}
          size="icon"
          className="h-14 w-14 rounded-full bg-brand-primary hover:bg-brand-secondary shadow-xl border-2 border-white/20"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
