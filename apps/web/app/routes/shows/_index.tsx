import type { Setlist } from "@bip/domain";
import { ArrowUp, Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams, useSubmit } from "react-router-dom";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";

interface LoaderData {
  setlists: Setlist[];
  year: number;
  searchQuery?: string;
}

const years = Array.from({ length: 30 }, (_, i) => 2025 - i).reverse();
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

// Minimum characters required to trigger search
const MIN_SEARCH_CHARS = 5;

export const loader = publicLoader(async ({ request }): Promise<LoaderData> => {
  console.log("⚡️ shows loader start:", request.method, new URL(request.url).pathname);

  const url = new URL(request.url);
  const year = url.searchParams.get("year") || new Date().getFullYear();
  const yearInt = Number.parseInt(year as string);
  const searchQuery = url.searchParams.get("q") || undefined;

  console.log("⚡️ shows loader - params:", { year: yearInt, searchQuery });

  let setlists: Setlist[] = [];

  // If there's a search query with at least MIN_SEARCH_CHARS characters, use the search functionality
  if (searchQuery && searchQuery.length >= MIN_SEARCH_CHARS) {
    console.log("⚡️ shows loader - searching for:", searchQuery);

    // Get show IDs from search
    const shows = await services.shows.search(searchQuery);

    if (shows.length > 0) {
      // Get setlists for the found shows
      const showIds = shows.map((show) => show.id);

      // Fetch setlists for these shows
      setlists = await services.setlists.findManyByShowIds(showIds);
      console.log("⚡️ shows loader - found setlists from search:", setlists.length);
    }

    return { setlists, year: yearInt, searchQuery };
  }

  // Otherwise, get setlists for the specified year
  setlists = await services.setlists.findMany({
    filters: {
      year: yearInt,
    },
  });

  console.log("⚡️ shows loader - found setlists:", setlists.length);
  return { setlists, year: yearInt };
});

export function meta() {
  return [
    { title: "Shows | Biscuits Internet Project" },
    {
      name: "description",
      content: "Browse and discover Disco Biscuits shows, including setlists, recordings, and ratings.",
    },
  ];
}

export default function Shows() {
  const { setlists, year, searchQuery } = useSerializedLoaderData<LoaderData>();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const submit = useSubmit();

  // Group setlists by month
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
      // Show button when user scrolls down 2 viewport heights
      const scrollThreshold = window.innerHeight * 2;
      setShowBackToTop(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize search input from URL on mount and when URL changes
  useEffect(() => {
    if (searchQuery && searchInputRef.current) {
      searchInputRef.current.value = searchQuery;
    }
  }, [searchQuery]);

  // Reset loading state when data is loaded
  useEffect(() => {
    // When new data is loaded, reset the loading state
    setIsSearching(false);

    // Clear any safety timeout
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Clear search and return to year view
  const clearSearch = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    // Set a safety timeout to reset loading state if navigation takes too long
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
    }

    safetyTimeoutRef.current = setTimeout(() => {
      setIsSearching(false);
    }, 5000);

    setIsSearching(true);

    // Navigate directly to the year page instead of modifying search params
    const yearParam = year ? `?year=${year}` : "";
    window.location.href = `/shows${yearParam}`;

    // As a fallback, also update search params (this might not execute if redirect happens quickly)
    const params = new URLSearchParams(searchParams);
    params.delete("q");
    if (year) {
      params.set("year", year.toString());
    }
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams, year]);

  // Perform search with the current input value
  const performSearch = useCallback(() => {
    const value = searchInputRef.current?.value || "";

    if (value.length >= MIN_SEARCH_CHARS) {
      setIsSearching(true);

      // Set a safety timeout to reset loading state if search takes too long
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }

      safetyTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
      }, 5000);

      const formData = new FormData();
      formData.append("q", value);
      submit(formData, { method: "get", replace: true });
    } else if (value.length === 0 && searchQuery) {
      // If search is cleared, return to year view
      clearSearch();
    }
  }, [submit, searchQuery, clearSearch]);

  // Handle search input change with debounce
  const handleSearchInputChange = useCallback(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const value = searchInputRef.current?.value || "";

    // If input is empty and we were previously searching, clear the search
    if (value.length === 0 && searchQuery) {
      clearSearch();
      return;
    }

    // Set a new timeout for debounce (800ms)
    searchTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 800);
  }, [performSearch, searchQuery, clearSearch]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Shows</h1>
            {!searchQuery && <span className="text-gray-400 text-lg">{year}</span>}
            {searchQuery && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-lg">Search results for "{searchQuery}"</span>
                <Button variant="outline" size="sm" onClick={clearSearch} disabled={isSearching}>
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="search"
              defaultValue={searchQuery || ""}
              placeholder={`Search by venue, city, state, song (min ${MIN_SEARCH_CHARS} characters)...`}
              className="w-full rounded-md border border-border/40 bg-black/20 pl-10 pr-10 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isSearching}
              autoComplete="off"
              onChange={handleSearchInputChange}
            />
            {searchInputRef.current?.value && !isSearching && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                aria-label="Clear search input"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4">
                <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
              </div>
            )}
          </div>
          {/* Warning message for minimum characters */}
          <div className="min-h-[20px]">
            {!isSearching &&
              searchInputRef.current?.value &&
              searchInputRef.current.value.length > 0 &&
              searchInputRef.current.value.length < MIN_SEARCH_CHARS && (
                <div className="text-amber-500 text-xs mt-1 ml-1">
                  Please enter at least {MIN_SEARCH_CHARS} characters to search
                </div>
              )}
          </div>
        </div>

        {/* Navigation - Only show when not searching */}
        {!searchQuery && (
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
            {/* Year navigation */}
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-400 mb-3">Filter by Year</h2>
              <div className="flex flex-wrap gap-2">
                {years.map((y) => (
                  <Link
                    key={y}
                    to={`/shows?year=${y}`}
                    className={cn(
                      "px-3 py-1 text-sm rounded-md transition-colors",
                      y === year ? "bg-purple-500 text-white" : "text-gray-400 hover:bg-accent/10 hover:text-white",
                    )}
                  >
                    {y}
                  </Link>
                ))}
              </div>
            </div>

            {/* Month navigation */}
            <div>
              <h2 className="text-sm font-medium text-gray-400 mb-3">Jump to Month</h2>
              <div className="flex flex-wrap gap-2">
                {months.map((month, index) => (
                  <a
                    key={month}
                    href={monthsWithShows.includes(index) ? `#month-${index}` : undefined}
                    className={cn(
                      "px-3 py-1 text-sm rounded-md transition-colors",
                      monthsWithShows.includes(index)
                        ? "text-gray-300 hover:bg-accent/10 hover:text-white cursor-pointer"
                        : "text-gray-600 cursor-not-allowed",
                    )}
                  >
                    {month}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search results count */}
        {searchQuery && (
          <div className="text-gray-400">
            Found {setlists.length} {setlists.length === 1 ? "show" : "shows"}
          </div>
        )}

        {/* Loading state */}
        {isSearching && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-purple-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Searching...</span>
            </div>
          </div>
        )}

        {/* Setlist cards */}
        {!isSearching && (
          <div className="space-y-8">
            {setlists.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">
                  {searchQuery ? "No shows found matching your search." : "No shows found for this year."}
                </p>
              </div>
            ) : searchQuery ? (
              // When searching, display all setlists without month grouping
              <div className="space-y-4">
                {setlists.map((setlist) => (
                  <SetlistCard key={setlist.show.id} setlist={setlist} />
                ))}
              </div>
            ) : (
              // When not searching, group by month
              monthsWithShows
                .sort((a, b) => a - b)
                .map((month) => (
                  <div key={month} className="space-y-4">
                    {setlistsByMonth[month].map((setlist, index) => (
                      <div key={setlist.show.id}>
                        {index === 0 && <div id={`month-${month}`} className="scroll-mt-20" />}
                        <SetlistCard setlist={setlist} />
                      </div>
                    ))}
                  </div>
                ))
            )}
          </div>
        )}
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
          className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
