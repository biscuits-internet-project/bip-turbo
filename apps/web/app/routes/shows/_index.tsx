import { CacheKeys, type Attendance, type Setlist } from "@bip/domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AdminOnly } from "~/components/admin/admin-only";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { fetchUserAttendances } from "~/lib/fetch-utils";
import { publicLoader } from "~/lib/base-loaders";
import { getShowsMeta } from "~/lib/seo";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";

interface LoaderData {
  setlists: Setlist[];
  year: number;
  searchQuery?: string;
  userAttendances: Attendance[];
}

const years = Array.from({ length: 30 }, (_, i) => 2025 - i).reverse();
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Minimum characters required to trigger search
const MIN_SEARCH_CHARS = 4;

export const loader = publicLoader(async ({ request, context }): Promise<LoaderData> => {
  const url = new URL(request.url);
  const year = url.searchParams.get("year") || new Date().getFullYear();
  const yearInt = Number.parseInt(year as string);
  const searchQuery = url.searchParams.get("q") || undefined;

  let setlists: Setlist[] = [];
  let userAttendances: Attendance[] = [];

  // If there's a search query with at least MIN_SEARCH_CHARS characters, use the search functionality
  if (searchQuery && searchQuery.length >= MIN_SEARCH_CHARS) {
    console.log(`🔍 Loading search results for query: ${searchQuery}`);
    // Get show IDs from search
    const shows = await services.shows.search(searchQuery);

    if (shows.length > 0) {
      // Get setlists for the found shows
      const showIds = shows.map((show) => show.id);

      // Fetch setlists for these shows
      setlists = await services.setlists.findManyByShowIds(showIds);

      // If user is authenticated, fetch their attendance data for search results
      userAttendances = await fetchUserAttendances(context.currentUser, showIds);
    }

    return {
      setlists,
      year: yearInt,
      searchQuery,
      userAttendances
    };
  }

  // Cache year-based listings - these are stable and cacheable
  const currentYear = new Date().getFullYear();
  const sortDirection = yearInt === currentYear ? "desc" : "asc";

  const yearCacheKey = CacheKeys.shows.list({
    year: yearInt,
    sort: sortDirection
  });

  setlists = await services.cache.getOrSet(
    yearCacheKey,
    async () => {
      console.log(`📅 Loading shows from DB for year: ${yearInt}`);
      return await services.setlists.findMany({
        filters: {
          year: yearInt,
        },
        sort: [{ field: "date", direction: sortDirection }],
      });
    }
  );

  userAttendances = await fetchUserAttendances(context.currentUser, setlists.map(setlist => setlist.show.id));

  console.log(`🎯 Year ${yearInt} shows loaded: ${setlists.length} shows, user attended ${userAttendances.length}`);

  return {
    setlists,
    year: yearInt,
    userAttendances
  };
});

export function meta({ data }: { data: LoaderData }) {
  return getShowsMeta(data.year, data.searchQuery);
}

export default function Shows() {
  const { setlists, year, searchQuery, userAttendances } = useSerializedLoaderData<LoaderData>();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const queryClient = useQueryClient();

  // Create a map for quick attendance lookup by showId
  const attendanceMap = useMemo(() => 
    new Map(userAttendances.map(attendance => [attendance.showId, attendance])),
    [userAttendances]
  );

  const rateMutation = useMutation({
    mutationFn: async ({ showId, rating }: { showId: string; rating: number }) => {
      const response = await fetch("/api/ratings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rateableId: showId,
          rateableType: "Show",
          value: rating,
        }),
      });

      if (response.status === 401) {
        window.location.href = "/auth/login";
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Failed to rate show");
      }

      const data = await response.json();
      return data;
    },
    onSuccess: (data, variables) => {
      toast.success("Rating submitted successfully");
      // Update the setlist in the cache with the new rating
      queryClient.setQueryData(["setlists"], (old: Setlist[] = []) => {
        return old.map((setlist) => {
          if (setlist.show.id === variables.showId) {
            return {
              ...setlist,
              show: {
                ...setlist.show,
                userRating: variables.rating,
                averageRating: data.averageRating,
              },
            };
          }
          return setlist;
        });
      });
    },
    onError: (error) => {
      console.error("rateMutation.onError called with:", error);
      toast.error("Failed to submit rating. Please try again.");
    },
  });

  // Create a stable reference to the mutation function
  const _stableRateMutation = useCallback(
    (showId: string, rating: number) => rateMutation.mutateAsync({ showId, rating }),
    [rateMutation.mutateAsync],
  );

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
      {} as Record<number, Setlist[]>,
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
          <div className="absolute top-0 right-0">
            <AdminOnly>
              <Button variant="outline" size="sm" asChild>
                <Link to="/shows/new" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>New Show</span>
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
          <div className="card-premium rounded-lg overflow-hidden">
            {/* Year navigation */}
            <div className="p-6 border-b border-content-bg-secondary">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                Filter by Year
                <span className="text-xs font-normal text-content-text-tertiary bg-content-bg-secondary px-2 py-1 rounded-full">
                  {years.length} years
                </span>
              </h2>
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                {years.map((y) => (
                  <Link
                    key={y}
                    to={`/shows?year=${y}`}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-center relative overflow-hidden shadow-sm",
                      y === year
                        ? "text-white bg-gradient-to-r from-brand-primary to-brand-secondary border-2 border-brand-primary/50 shadow-lg shadow-brand-primary/30 scale-110 font-bold ring-2 ring-brand-primary/20"
                        : "text-content-text-secondary bg-content-bg-secondary hover:bg-content-bg-tertiary hover:text-white hover:scale-105 hover:shadow-md",
                    )}
                  >
                    {y}
                  </Link>
                ))}
              </div>
            </div>

            {/* Month navigation */}
            <div className="p-6">
              <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                Jump to Month
                <span className="text-xs font-normal text-content-text-tertiary bg-content-bg-secondary px-2 py-1 rounded-full">
                  {monthsWithShows.length} active
                </span>
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {months.map((month, index) => (
                  <a
                    key={month}
                    href={monthsWithShows.includes(index) ? `#month-${index}` : undefined}
                    className={cn(
                      "px-3 py-2 text-xs font-medium rounded-lg transition-all duration-200 text-center",
                      monthsWithShows.includes(index)
                        ? "text-content-text-secondary bg-content-bg-secondary hover:bg-accent/20 hover:text-white cursor-pointer hover:scale-105"
                        : "text-content-text-tertiary bg-transparent cursor-not-allowed opacity-40",
                    )}
                  >
                    {month}
                  </a>
                ))}
              </div>
            </div>
          </div>
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
                      userAttendance={attendanceMap.get(setlist.show.id) || null}
                      userRating={null}
                      showRating={setlist.show.averageRating}
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
                                userAttendance={attendanceMap.get(setlist.show.id) || null}
                                userRating={null}
                                showRating={setlist.show.averageRating}
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
