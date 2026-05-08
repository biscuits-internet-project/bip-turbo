import { CacheKeys, type SetlistLight } from "@bip/domain";
import { ArrowUp, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ClientLoaderFunctionArgs } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { SetlistList } from "~/components/setlist/setlist-list";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { ShowFiltersNav } from "~/components/show-filters-nav";
import { Button } from "~/components/ui/button";
import { YearFilterNav } from "~/components/year-filter-nav";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { getShowsMeta } from "~/lib/seo";
import { parseTriState, type TriState, triStateToBoolean } from "~/lib/tri-state-filter";
import { cn } from "~/lib/utils";
import { applyExternalSourceFilters } from "~/server/apply-external-source-filters";
import { services } from "~/server/services";
import { computeShowCountsByYear } from "~/server/show-counts-by-year";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData, type ShowUserDataResponse } from "~/server/show-user-data";

interface LoaderData {
  setlists: SetlistLight[];
  year: number;
  searchQuery?: string;
  externalSources: Record<string, ShowExternalSources>;
  showCountsByYear: Record<number, number>;
  monthCounts: Record<number, number>;
  filters: { photos: TriState; youtube: TriState; nugs: TriState; archive: TriState };
  initialUserData: ShowUserDataResponse;
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

export const loader = publicLoader(async ({ request, params, context }): Promise<LoaderData> => {
  const url = new URL(request.url);
  const year = params.year || new Date().getFullYear();
  const yearInt = Number.parseInt(year as string, 10);
  const searchQuery = url.searchParams.get("q") || undefined;

  const filters = {
    photos: parseTriState(url.searchParams.get("photos")),
    youtube: parseTriState(url.searchParams.get("youtube")),
    nugs: parseTriState(url.searchParams.get("nugs")),
    archive: parseTriState(url.searchParams.get("archive")),
  };
  const emptyCounts: Record<number, number> = {};

  let setlists: SetlistLight[] = [];

  // If there's a search query with at least MIN_SEARCH_CHARS characters, use the search functionality.
  // Source filters are hidden in this branch — year-page browse nav is replaced by search results.
  if (searchQuery && searchQuery.length >= MIN_SEARCH_CHARS) {
    logger.info(`Loading search results for query: ${searchQuery}`);
    const shows = await services.shows.search(searchQuery);

    if (shows.length > 0) {
      const showIds = shows.map((show) => show.id);
      setlists = await services.setlists.findManyByShowIds(showIds);
    }

    return {
      setlists,
      year: yearInt,
      searchQuery,
      externalSources: await computeShowExternalSources(setlists.map((s) => s.show)),
      showCountsByYear: emptyCounts,
      monthCounts: emptyCounts,
      filters,
      initialUserData: await computeShowUserData(
        context,
        setlists.map((s) => s.show.id),
      ),
    };
  }

  // Cache year-based listings - these are stable and cacheable. Filter flags are part of the
  // cache key so each combination is memoized independently.
  const currentYear = new Date().getFullYear();
  const sortDirection = yearInt === currentYear ? "desc" : "asc";

  const yearCacheKey = CacheKeys.shows.list({
    year: yearInt,
    sort: sortDirection,
    photos: filters.photos,
    youtube: filters.youtube,
  });

  setlists = await services.cache.getOrSet(yearCacheKey, async () => {
    logger.info(`Loading shows from DB for year: ${yearInt}`);
    return await services.setlists.findManyLight({
      filters: {
        year: yearInt,
        hasPhotos: triStateToBoolean(filters.photos),
        hasYoutube: triStateToBoolean(filters.youtube),
      },
      sort: [{ field: "date", direction: sortDirection }],
    });
  });

  const externalSources = await computeShowExternalSources(setlists.map((s) => s.show));
  const filteredSetlists = applyExternalSourceFilters(setlists, externalSources, {
    nugs: filters.nugs,
    archive: filters.archive,
  });

  const showCountsByYear = await computeShowCountsByYear(filters);

  const monthCounts: Record<number, number> = {};
  for (const setlist of filteredSetlists) {
    const month = new Date(setlist.show.date).getMonth();
    monthCounts[month] = (monthCounts[month] ?? 0) + 1;
  }

  logger.info(`Year ${yearInt} shows loaded: ${filteredSetlists.length} shows`);

  return {
    setlists: filteredSetlists,
    year: yearInt,
    externalSources,
    showCountsByYear,
    monthCounts,
    filters,
    initialUserData: await computeShowUserData(
      context,
      filteredSetlists.map((s) => s.show.id),
    ),
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
  const { setlists, year, searchQuery, externalSources, showCountsByYear, monthCounts, initialUserData } =
    useSerializedLoaderData<LoaderData>();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Current URL search params drive the filter bar's active state and the
  // Filter-by-Year links preserving filters across year switches. Using
  // useLocation keeps this in sync with react-router navigations (SSR-safe).
  const location = useLocation();
  const currentURLParameters = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // Months with at least one show — drives the Jump-to-Month nav active state.
  const monthsWithShows = useMemo(() => Object.keys(monthCounts).map(Number), [monthCounts]);

  // Jump-to-Month collapses by default on mobile so the long month grid
  // doesn't push the show list far below the fold; CSS forces it open at sm+.
  const [jumpToMonthOpen, setJumpToMonthOpen] = useState(false);

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
          <div className="absolute top-0 right-0 flex items-start gap-2">
            {!searchQuery && (
              <div className="hidden sm:block">
                <ShowFiltersNav basePath={`/shows/year/${year}`} currentURLParameters={currentURLParameters} />
              </div>
            )}
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
          {!searchQuery && (
            <div className="mt-3 flex justify-center sm:hidden">
              <ShowFiltersNav basePath={`/shows/year/${year}`} currentURLParameters={currentURLParameters} />
            </div>
          )}
        </div>

        {/* Navigation - Only show when not searching */}
        {!searchQuery && (
          <>
            <YearFilterNav
              currentYear={year}
              basePath="/shows/year/"
              currentURLParameters={currentURLParameters}
              counts={showCountsByYear}
            />
            <div className="card-premium rounded-lg overflow-hidden">
              {/* Month navigation */}
              <div className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => setJumpToMonthOpen((open) => !open)}
                  aria-expanded={jumpToMonthOpen}
                  className={cn(
                    "sm:hidden w-full flex items-center gap-2 text-sm font-semibold text-white cursor-pointer select-none",
                    jumpToMonthOpen ? "mb-3" : "mb-0",
                  )}
                >
                  Jump to Month
                  <span className="text-xs font-normal text-content-text-tertiary bg-content-bg-secondary px-2 py-0.5 rounded-full">
                    {monthsWithShows.length} months
                  </span>
                  <span
                    className={cn("transition-transform duration-300 ml-2", jumpToMonthOpen ? "rotate-90" : "rotate-0")}
                    aria-hidden
                  >
                    ▶
                  </span>
                </button>
                <h2 className="hidden sm:flex text-sm font-semibold text-white mb-3 items-center gap-2">
                  Jump to Month
                  <span className="text-xs font-normal text-content-text-tertiary bg-content-bg-secondary px-2 py-0.5 rounded-full">
                    {monthsWithShows.length} months
                  </span>
                </h2>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 grid grid-cols-3 sm:grid-cols-12 gap-1.5 sm:!max-h-[1000px] sm:!opacity-100",
                    jumpToMonthOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  {months.map((month, index) => {
                    const active = monthsWithShows.includes(index);
                    const count = monthCounts[index] ?? 0;
                    return (
                      <a
                        key={month}
                        href={active ? `#month-${index}` : undefined}
                        className={cn(
                          "px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 text-center",
                          active
                            ? "text-content-text-secondary bg-content-bg-secondary hover:bg-content-bg-tertiary hover:text-white cursor-pointer"
                            : "text-content-text-tertiary bg-transparent cursor-not-allowed opacity-40",
                        )}
                      >
                        {month}
                        {active && count > 0 && <span className="ml-1 opacity-70 hidden sm:inline">({count})</span>}
                      </a>
                    );
                  })}
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

          {/* Results Content. Loader returns setlists pre-sorted (desc for the
              current year, asc otherwise); SetlistList preserves that order
              when grouping by month. */}
          <div>
            <div className="space-y-8">
              <SetlistList
                setlists={setlists}
                externalSources={externalSources}
                initialUserData={initialUserData}
                groupByMonth={!searchQuery}
                empty={
                  <div className="text-center py-8">
                    <p className="text-content-text-secondary text-lg">
                      {searchQuery ? "No shows found matching your search." : "No shows found for this year."}
                    </p>
                  </div>
                }
              />
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
