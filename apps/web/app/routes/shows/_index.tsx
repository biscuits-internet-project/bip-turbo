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
const MIN_SEARCH_CHARS = 4;

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const submit = useSubmit();
  const pendingSearchRef = useRef<AbortController | null>(null);

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
      const scrollThreshold = window.innerHeight * 2;
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

  // Clear search and return to year view
  const clearSearch = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }

    // Cancel any pending search
    if (pendingSearchRef.current) {
      pendingSearchRef.current.abort();
      pendingSearchRef.current = null;
    }

    setIsSearching(false);

    const params = new URLSearchParams();
    if (year) {
      params.set("year", year.toString());
    }
    submit(params, { method: "get", replace: true });
  }, [year, submit]);

  // Perform search with the current input value
  const performSearch = useCallback(() => {
    const value = searchInputRef.current?.value || "";

    // Cancel any pending search
    if (pendingSearchRef.current) {
      pendingSearchRef.current.abort();
      pendingSearchRef.current = null;
    }

    if (value.length >= MIN_SEARCH_CHARS) {
      setIsSearching(true);

      const formData = new FormData();
      formData.append("q", value);
      submit(formData, { method: "get", replace: true });
    } else if (value.length === 0 && searchQuery) {
      clearSearch();
    }
  }, [submit, searchQuery, clearSearch]);

  // Handle search input change with debounce
  const handleSearchInputChange = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const value = searchInputRef.current?.value || "";

    if (value.length === 0 && searchQuery) {
      clearSearch();
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch();
    }, 1000);
  }, [performSearch, searchQuery, clearSearch]);

  // Reset loading state and initialize search input when query changes
  useEffect(() => {
    setIsSearching(false);

    // Initialize search input from URL
    if (searchInputRef.current) {
      searchInputRef.current.value = searchQuery || "";
    }

    return () => {
      // Clean up any pending searches and timeouts
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (pendingSearchRef.current) {
        pendingSearchRef.current.abort();
        pendingSearchRef.current = null;
      }
    };
  }, [searchQuery]);

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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              ref={searchInputRef}
              type="search"
              placeholder="Search by venue, city, state, song (min 4 characters)..."
              className="w-full pl-9 bg-transparent border border-gray-800 focus:border-purple-500 rounded-md text-white placeholder:text-gray-500 text-sm h-9 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
              onChange={handleSearchInputChange}
            />
            {searchInputRef.current?.value && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isSearching && searchInputRef.current?.value && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
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

        {/* Results Section */}
        <div className="relative min-h-[200px]">
          {/* Search Results Count - Fade in/out */}
          <div
            className={cn(
              "absolute w-full transition-opacity duration-200",
              searchQuery && !isSearching ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="text-gray-400 mb-4">
              Found {setlists.length} {setlists.length === 1 ? "show" : "shows"}
            </div>
          </div>

          {/* Results Content */}
          <div className={cn("transition-all duration-300", isSearching ? "opacity-50" : "opacity-100")}>
            {/* Setlist cards */}
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
                    <SetlistCard
                      key={setlist.show.id}
                      setlist={setlist}
                      className={cn(
                        "transition-all duration-300 transform",
                        isSearching ? "opacity-50 scale-[0.98] translate-y-2" : "opacity-100 scale-100 translate-y-0",
                      )}
                    />
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
                          <SetlistCard
                            setlist={setlist}
                            className="transition-all duration-300 transform hover:scale-[1.01]"
                          />
                        </div>
                      ))}
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Loading Overlay */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
              isSearching ? "opacity-100" : "opacity-0 pointer-events-none",
            )}
          >
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800">
              <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
              <span className="text-gray-200">Searching...</span>
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
          className="h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
