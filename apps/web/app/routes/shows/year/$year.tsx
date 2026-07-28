import { CacheKeys, type Setlist } from "@bip/domain";
import type { DehydratedState } from "@tanstack/react-query";
import { ArrowUp, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ClientLoaderFunctionArgs, HeadersArgs, ShouldRevalidateFunction } from "react-router";
import { data } from "react-router";
import { useLocation } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { SetlistList } from "~/components/setlist/setlist-list";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { ShowsViewToggle } from "~/components/show/shows-view-toggle";
import { ShowFiltersNav } from "~/components/show-filters-nav";
import { Button } from "~/components/ui/button";
import { cardVariants } from "~/components/ui/card";
import { CollapsibleSection } from "~/components/ui/collapsible-section";
import { LinkButton } from "~/components/ui/link-button";
import { YearFilterNav } from "~/components/year-filter-nav";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { applyExternalSourceFilters } from "~/lib/apply-external-source-filters";
import { applyMediaCountFilters } from "~/lib/apply-media-count-filters";
import { publicLoader } from "~/lib/base-loaders";
import { logger } from "~/lib/logger";
import { showUserDataQueryKey } from "~/lib/query-keys";
import { createPrefetchClient, dehydrateAndClear } from "~/lib/query-prefetch";
import { getShowsMeta } from "~/lib/seo";
import { type ShowCountFacets, showCountsByYearFromFacets } from "~/lib/show-count-facets";
import { parseTriState } from "~/lib/tri-state-filter";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";
import { computeShowCountFacets } from "~/server/show-count-facets";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData } from "~/server/show-user-data";

/**
 * Deliberately filter-independent: the same payload serves every media-filter
 * combination, and the component narrows it. That's what lets one cached year
 * blob back all 3^5 combinations and lets {@link shouldRevalidate} skip the
 * refetch on a toggle.
 */
interface LoaderData {
  setlists: Setlist[];
  year: number;
  searchQuery?: string;
  externalSources: Record<string, ShowExternalSources>;
  showCountFacets: ShowCountFacets;
  dehydratedState: DehydratedState;
}

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Minimum characters required to trigger search
const MIN_SEARCH_CHARS = 4;

/**
 * Edge-cache policy for one year-listing response.
 *
 * Lives here rather than in the `headers` export because React Router's
 * `HeadersArgs` carries only `loaderHeaders` / `parentHeaders` /
 * `actionHeaders` / `errorHeaders`. A `headers` export cannot see loader data,
 * so any policy that depends on the request has to be decided here and handed
 * over as headers on the loader's own response.
 */
function yearListingCacheHeaders(url: URL, { isSearchResult }: { isSearchResult: boolean }): Record<string, string> {
  // Search results are one-offs keyed by whatever someone typed. Caching them
  // publicly fills the edge with single-use entries and serves a stale index
  // to the next person who searches the same words.
  if (isSearchResult) return { "Cache-Control": "private, no-cache" };

  // Only the bare URL is purgeable: Cloudflare's cache key includes the query
  // string, purge-by-URL matches a key exactly, and `purgeYearListings` emits
  // exactly `/shows/year/:year` plus its `.data` twin. Every other spelling
  // (any of the 3^5 media-filter combinations, a below-threshold `?q`, a
  // tracking parameter) forks the key beyond a purge's reach, so it gets a TTL
  // short enough to self-heal instead of a day-long one that cannot.
  if (url.search !== "") return { "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=300" };

  return { "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=3600" };
}

/**
 * Forward the loader's headers verbatim. Keep this a pure pass-through: adding
 * request-dependent logic here means reading a `data` field that `HeadersArgs`
 * does not have, which yields `undefined` and silently picks the wrong branch.
 * Route-level policy belongs in {@link yearListingCacheHeaders}.
 */
export function headers({ loaderHeaders }: HeadersArgs): Headers {
  return loaderHeaders;
}

export const loader = publicLoader(async ({ request, params, context }) => {
  const url = new URL(request.url);
  const year = params.year || new Date().getFullYear();
  const yearInt = Number.parseInt(year as string, 10);
  const searchQuery = url.searchParams.get("q") || undefined;

  let setlists: Setlist[] = [];

  // If there's a search query with at least MIN_SEARCH_CHARS characters, use the search functionality.
  // Source filters are hidden in this branch — year-page browse nav is replaced by search results.
  if (searchQuery && searchQuery.length >= MIN_SEARCH_CHARS) {
    logger.info(`Loading search results for query: ${searchQuery}`);
    const shows = await services.shows.search(searchQuery);

    if (shows.length > 0) {
      const showIds = shows.map((show) => show.id);
      setlists = await services.setlists.findManyByShowIds(showIds);
    }

    const searchShowIds = setlists.map((s) => s.show.id);
    const searchClient = createPrefetchClient();
    await searchClient.prefetchQuery({
      queryKey: showUserDataQueryKey(searchShowIds),
      queryFn: () => computeShowUserData(context, searchShowIds),
    });
    const searchPayload: LoaderData = {
      setlists,
      year: yearInt,
      searchQuery,
      externalSources: await computeShowExternalSources(setlists.map((s) => s.show)),
      // Search spans every year and hides the Filter-by-Year nav, so there are
      // no per-year counts to derive.
      showCountFacets: {},
      dehydratedState: dehydrateAndClear(searchClient),
    };
    return data(searchPayload, { headers: yearListingCacheHeaders(url, { isSearchResult: true }) });
  }

  // Cache one unfiltered set per (year, sort). All five media/source filters
  // are applied by the component, so the tri-state combinations share a single
  // cached year blob instead of each caching a near-full-year payload.
  const currentYear = new Date().getFullYear();
  const sortDirection = yearInt === currentYear ? "desc" : "asc";

  const yearCacheKey = CacheKeys.shows.list({ year: yearInt, sort: sortDirection });

  setlists = await services.cache.getOrSet(yearCacheKey, async () => {
    logger.info(`Loading shows from DB for year: ${yearInt}`);
    return await services.setlists.findMany({
      filters: { year: yearInt },
      sort: [{ field: "date", direction: sortDirection }],
    });
  });

  const [externalSources, showCountFacets] = await Promise.all([
    computeShowExternalSources(setlists.map((s) => s.show)),
    computeShowCountFacets(),
  ]);

  logger.info(`Year ${yearInt} shows loaded: ${setlists.length} shows`);

  // Prefetched for the whole year, matching the `userDataShowIds` the component
  // hands SetlistList — a key derived from the filtered subset would miss on
  // every toggle and refetch what's already here.
  const showIds = setlists.map((s) => s.show.id);
  const queryClient = createPrefetchClient();
  await queryClient.prefetchQuery({
    queryKey: showUserDataQueryKey(showIds),
    queryFn: () => computeShowUserData(context, showIds),
  });

  const payload: LoaderData = {
    setlists,
    year: yearInt,
    externalSources,
    showCountFacets,
    dehydratedState: dehydrateAndClear(queryClient),
  };
  return data(payload, { headers: yearListingCacheHeaders(url, { isSearchResult: false }) });
});

/**
 * A media-filter toggle only rewrites the query string: the payload covers the
 * whole year regardless, and the component re-derives the visible list, the
 * month counts, and the per-year counts from what it already has. Refetching
 * would re-pay a full SSR render (~880ms and 2.4MB for a year like 2001) for
 * identical data. `q` is the exception — search results come from a server
 * query, so a changed search still needs the loader.
 *
 * This also swallows the `revalidator.revalidate()` that a star rating fires,
 * which is only ever redundant here: nothing in this payload carries ratings or
 * attendance. Those ride React Query, which StarRating updates directly.
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({ currentUrl, nextUrl, defaultShouldRevalidate }) => {
  if (currentUrl.pathname !== nextUrl.pathname) return defaultShouldRevalidate;
  if (currentUrl.searchParams.get("q") !== nextUrl.searchParams.get("q")) return defaultShouldRevalidate;
  return false;
};

// Destructured as `loaderData` because `data` is the React Router helper this
// module imports to attach cache headers.
export function meta({ data: loaderData }: { data: LoaderData }) {
  return getShowsMeta(loaderData.year, loaderData.searchQuery);
}

// Client loader enables hydration when page is served from CDN cache
export const clientLoader = async ({ serverLoader }: ClientLoaderFunctionArgs) => {
  return serverLoader();
};
clientLoader.hydrate = true;

export default function ShowsByYear() {
  const { setlists, year, searchQuery, externalSources, showCountFacets } = useSerializedLoaderData<LoaderData>();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Current URL search params drive the filter bar's active state and the
  // Filter-by-Year links preserving filters across year switches. Using
  // useLocation keeps this in sync with react-router navigations (SSR-safe).
  const location = useLocation();
  const currentURLParameters = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const filters = useMemo(
    () => ({
      photos: parseTriState(currentURLParameters.get("photos")),
      youtube: parseTriState(currentURLParameters.get("youtube")),
      nugs: parseTriState(currentURLParameters.get("nugs")),
      archive: parseTriState(currentURLParameters.get("archive")),
      relisten: parseTriState(currentURLParameters.get("relisten")),
    }),
    [currentURLParameters],
  );

  // Search replaces the browse nav, filter bar included, so a filter left over
  // from browsing must not silently narrow what the search turned up.
  const visibleSetlists = useMemo(() => {
    if (searchQuery) return setlists;
    return applyExternalSourceFilters(
      applyMediaCountFilters(setlists, { photos: filters.photos, youtube: filters.youtube }),
      externalSources,
      { nugs: filters.nugs, archive: filters.archive, relisten: filters.relisten },
    );
  }, [setlists, searchQuery, filters, externalSources]);

  const monthCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (const setlist of visibleSetlists) {
      const month = new Date(setlist.show.date).getMonth();
      counts[month] = (counts[month] ?? 0) + 1;
    }
    return counts;
  }, [visibleSetlists]);

  const showCountsByYear = useMemo(
    () => showCountsByYearFromFacets(showCountFacets, filters),
    [showCountFacets, filters],
  );

  // The loader prefetched per-user data for the whole year; keying on that same
  // set keeps the hydrated cache entry a hit as filters narrow the list.
  const userDataShowIds = useMemo(() => setlists.map((s) => s.show.id), [setlists]);

  // Months with at least one show — drives the Jump-to-Month nav active state.
  const monthsWithShows = useMemo(() => Object.keys(monthCounts).map(Number), [monthCounts]);

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
          {!searchQuery && (
            <div className="absolute top-0 left-0 hidden sm:block">
              <ShowFiltersNav basePath={`/shows/year/${year}`} currentURLParameters={currentURLParameters} />
            </div>
          )}
          <div className="absolute top-0 right-0 flex items-start gap-3">
            {/* The corners flank a centered heading, which leaves no room for
                them on a phone — both drop into the flow row below instead. */}
            {!searchQuery && (
              <div className="hidden sm:block">
                <ShowsViewToggle active="setlist" currentURLParameters={currentURLParameters} year={year} />
              </div>
            )}
            <AdminOnly>
              <LinkButton to="/shows/new" icon={Plus} iconOnlyOnMobile>
                Create Show
              </LinkButton>
            </AdminOnly>
          </div>
          <div className="flex flex-wrap items-baseline justify-center gap-4 -mt-4">
            {!searchQuery && <span className="text-content-text-secondary text-xl font-medium">{year}</span>}
            {searchQuery && (
              <span className="text-content-text-secondary text-lg">Search results for "{searchQuery}"</span>
            )}
          </div>
          {!searchQuery && (
            <div className="mt-3 flex flex-col items-center gap-3 sm:hidden">
              <ShowsViewToggle active="setlist" currentURLParameters={currentURLParameters} year={year} />
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
            <CollapsibleSection
              className={cardVariants({ variant: "elevated", className: "rounded-lg overflow-hidden" })}
              title="Jump to Month"
              titleClassName="text-sm font-semibold text-white"
              headerExtra={
                <span className="text-xs font-normal text-content-text-tertiary px-2 py-0.5 rounded-full">
                  {monthsWithShows.length} months
                </span>
              }
              headerClassName="px-4 py-3"
              contentClassName="px-4 pb-3"
              breakpoint="sm"
              collapseOnLandscape
            >
              <div className="grid grid-cols-3 sm:grid-cols-12 gap-1.5">
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
                          ? "text-content-text-secondary hover:text-white cursor-pointer"
                          : "text-content-text-tertiary bg-transparent cursor-not-allowed opacity-40",
                      )}
                    >
                      {month}
                      {active && count > 0 && <span className="ml-1 opacity-70 hidden sm:inline">({count})</span>}
                    </a>
                  );
                })}
              </div>
            </CollapsibleSection>
          </>
        )}

        {/* Results Section */}
        <div className="space-y-4">
          {/* Search Results Count */}
          {searchQuery && (
            <div className="text-content-text-secondary">
              Found {visibleSetlists.length} {visibleSetlists.length === 1 ? "show" : "shows"}
            </div>
          )}

          {/* Results Content. Loader returns setlists pre-sorted (desc for the
              current year, asc otherwise); SetlistList preserves that order
              when grouping by month. */}
          <div>
            <div className="space-y-8">
              <SetlistList
                setlists={visibleSetlists}
                userDataShowIds={userDataShowIds}
                externalSources={externalSources}
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
