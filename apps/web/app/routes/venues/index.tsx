import type { Venue } from "@bip/domain";
import { Globe, MapPin, Plus, Search, Star, Ticket } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useSearchParams } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";

const ITEMS_PER_PAGE = 50;

export function meta() {
  return [
    { title: "Venues | Biscuits Internet Project" },
    {
      name: "description",
      content: "Browse and discover venues where the Disco Biscuits have performed.",
    },
  ];
}

interface LoaderData {
  venues: Venue[];
  recentVenues: Venue[];
  stats: {
    totalVenues: number;
    totalShows: number;
    totalStates: number;
    recentShowCount: number;
  };
  states: string[];
  nonUSACount: number;
}

export const loader = publicLoader(async ({ request }: LoaderFunctionArgs): Promise<LoaderData> => {
  const url = new URL(request.url);
  const stateFilter = url.searchParams.get("state") || undefined;

  const venues = await services.venues.findMany({
    sort: [{ field: "timesPlayed", direction: "desc" }],
  });

  // Define the specific list of US states to display in the filter
  const usStates = [
    "AL",
    "AR",
    "AZ",
    "CA",
    "CO",
    "CT",
    "DC",
    "DE",
    "FL",
    "GA",
    "IA",
    "ID",
    "IL",
    "IN",
    "KS",
    "KY",
    "LA",
    "MA",
    "MD",
    "ME",
    "MI",
    "MN",
    "MO",
    "MS",
    "MT",
    "NC",
    "NE",
    "NH",
    "NJ",
    "NM",
    "NV",
    "NY",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "TN",
    "TX",
    "UT",
    "VA",
    "VT",
    "WA",
    "WI",
    "WV",
    "WY",
  ].sort();

  // Count non-USA venues (those without a state or with a country other than USA)
  const nonUSACount = venues.filter(
    (v) =>
      (!v.state && v.country) ||
      (v.country && v.country.toLowerCase() !== "usa" && v.country.toLowerCase() !== "united states"),
  ).length;

  const recentVenues = venues.slice(0, 6);

  // Calculate stats
  const stats = {
    totalVenues: venues.length,
    totalShows: venues.reduce((acc, venue) => acc + (venue.timesPlayed || 0), 0),
    totalStates: usStates.length,
    recentShowCount: recentVenues.reduce((acc, venue) => acc + (venue.timesPlayed || 0), 0),
  };

  return { venues, recentVenues, stats, states: usStates, nonUSACount };
});

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sublabel?: string;
}

function StatBox({ icon, label, value, sublabel }: StatBoxProps) {
  return (
    <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
      <dt className="flex items-center gap-2 text-sm font-medium text-gray-400">
        {icon}
        {label}
      </dt>
      <dd className="mt-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {sublabel && <span className="ml-2 text-sm text-gray-500">{sublabel}</span>}
      </dd>
    </div>
  );
}

interface VenueCardProps {
  venue: Venue;
  showStats?: boolean;
}

function VenueCard({ venue, showStats = true }: VenueCardProps) {
  return (
    <Card className="bg-gray-900 border-gray-800 hover:bg-accent/10 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link to={`/venues/${venue.slug}`} className="text-white hover:text-purple-400">
            {venue.name || "Unnamed Venue"}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 mt-1 text-gray-400 shrink-0" />
            <p className="text-gray-400">
              {[venue.city, venue.state].filter(Boolean).join(", ") || "Location Unknown"}
              {venue.country &&
                venue.country.toLowerCase() !== "usa" &&
                venue.country.toLowerCase() !== "united states" &&
                ` (${venue.country})`}
            </p>
          </div>
          {showStats && venue.timesPlayed > 0 && (
            <div className="flex items-start gap-2">
              <Ticket className="h-4 w-4 mt-1 text-gray-400 shrink-0" />
              <div className="space-y-1">
                <p className="text-gray-400 text-sm">
                  {venue.timesPlayed} {venue.timesPlayed === 1 ? "show" : "shows"}
                </p>
              </div>
            </div>
          )}
        </div>
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
        placeholder="Search venues..."
        className="w-full pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-400"
      />
    </div>
  );
}

// Update the getStateAbbreviation function to handle all exceptions
function getStateAbbreviation(state: string): string {
  // US States
  const stateMap: Record<string, string> = {
    Alabama: "AL",
    Alaska: "AK",
    Arizona: "AZ",
    Arkansas: "AR",
    California: "CA",
    Colorado: "CO",
    Connecticut: "CT",
    Delaware: "DE",
    Florida: "FL",
    Georgia: "GA",
    Hawaii: "HI",
    Idaho: "ID",
    Illinois: "IL",
    Indiana: "IN",
    Iowa: "IA",
    Kansas: "KS",
    Kentucky: "KY",
    Louisiana: "LA",
    Maine: "ME",
    Maryland: "MD",
    Massachusetts: "MA",
    Michigan: "MI",
    Minnesota: "MN",
    Mississippi: "MS",
    Missouri: "MO",
    Montana: "MT",
    Nebraska: "NE",
    Nevada: "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    Ohio: "OH",
    Oklahoma: "OK",
    Oregon: "OR",
    Pennsylvania: "PA",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    Tennessee: "TN",
    Texas: "TX",
    Utah: "UT",
    Vermont: "VT",
    Virginia: "VA",
    Washington: "WA",
    "West Virginia": "WV",
    Wisconsin: "WI",
    Wyoming: "WY",
    "District of Columbia": "DC",
    // Canadian Provinces
    "British Columbia": "BC",
    Ontario: "ON",
    // Countries (keep full name for non-US/Canada)
    Canada: "Canada",
    Germany: "Germany",
    Iceland: "Iceland",
    Jamaica: "Jamaica",
    Japan: "Japan",
    Mexico: "Mexico",
    Scotland: "Scotland",
    Sweden: "Sweden",
    "U.K.": "U.K.",
    "United Kingdom": "U.K.",
  };

  // If the state is already an abbreviation, return it as is
  if (
    state.length <= 3 ||
    ["U.K."].includes(state) ||
    ["Canada", "Germany", "Iceland", "Jamaica", "Japan", "Mexico", "Scotland", "Sweden"].includes(state)
  ) {
    return state;
  }

  return stateMap[state] || state;
}

export default function VenuesPage() {
  const { venues, recentVenues, stats, states, nonUSACount } = useSerializedLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const stateFilter = searchParams.get("state") || "";

  // Filter venues based on search query and state filter
  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      // Apply search filter if present
      const matchesSearch =
        searchQuery === null || searchQuery === "" || searchQuery === undefined
          ? true
          : venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (venue.city?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (venue.state?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            (venue.country?.toLowerCase() || "").includes(searchQuery.toLowerCase());

      // Apply state filter if present
      let matchesState = true;
      if (stateFilter) {
        if (stateFilter === "international") {
          matchesState = Boolean(
            (!venue.state && venue.country) ||
              (venue.country &&
                venue.country.toLowerCase() !== "usa" &&
                venue.country.toLowerCase() !== "united states"),
          );
        } else {
          matchesState = venue.state === stateFilter;
        }
      }

      return matchesSearch && matchesState;
    });
  }, [venues, searchQuery, stateFilter]);

  const handleSearch = useCallback(
    (query: string) => {
      const newParams = new URLSearchParams(searchParams);
      if (query) {
        newParams.set("q", query);
      } else {
        newParams.delete("q");
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams],
  );

  const handleStateFilter = useCallback(
    (state: string) => {
      const newParams = new URLSearchParams(searchParams);
      if (state && state !== stateFilter) {
        newParams.set("state", state);
      } else {
        newParams.delete("state");
      }
      // Keep search query if present
      if (searchQuery) {
        newParams.set("q", searchQuery);
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams, stateFilter, searchQuery],
  );

  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const first = entries[0];
          if (first.isIntersecting && !isLoading && displayCount < filteredVenues.length) {
            setIsLoading(true);
            setTimeout(() => {
              setDisplayCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredVenues.length));
              setIsLoading(false);
            }, 100);
          }
        },
        { rootMargin: "800px" },
      );

      observer.observe(node);
    },
    [displayCount, filteredVenues.length, isLoading],
  );

  const visibleVenues = useMemo(() => filteredVenues.slice(0, displayCount), [filteredVenues, displayCount]);
  const hasMore = displayCount < filteredVenues.length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Venues</h1>
        <AdminOnly>
          <Button asChild size="sm">
            <Link to="/venues/new" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Create Venue</span>
            </Link>
          </Button>
        </AdminOnly>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* Stats Grid */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox icon={<MapPin className="h-4 w-4" />} label="Total Venues" value={stats.totalVenues} />
          <StatBox icon={<Ticket className="h-4 w-4" />} label="Total Shows" value={stats.totalShows} />
          <StatBox icon={<MapPin className="h-4 w-4" />} label="States/Regions" value={stats.totalStates} />
          <StatBox icon={<Globe className="h-4 w-4" />} label="International Venues" value={nonUSACount} />
        </dl>

        {/* State Filter */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <h2 className="text-sm font-medium text-gray-400 mb-3">Filter by State</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                !stateFilter ? "bg-purple-500 text-white" : "text-gray-400 hover:bg-accent/10 hover:text-white",
              )}
              onClick={() => handleStateFilter("")}
            >
              All
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                stateFilter === "international"
                  ? "bg-purple-500 text-white"
                  : "text-gray-400 hover:bg-accent/10 hover:text-white",
              )}
              onClick={() => handleStateFilter("international")}
            >
              <Globe className="h-3 w-3 mr-1" />
              International
            </Button>

            {states.map((state) => (
              <Button
                key={state}
                variant="ghost"
                size="sm"
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-colors",
                  stateFilter === state
                    ? "bg-purple-500 text-white"
                    : "text-gray-400 hover:bg-accent/10 hover:text-white",
                )}
                onClick={() => handleStateFilter(state)}
              >
                {getStateAbbreviation(state)}
              </Button>
            ))}
          </div>
        </div>

        {recentVenues.length > 0 && !stateFilter && !searchQuery && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Recent Venues</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} showStats={false} />
              ))}
            </div>
          </div>
        )}

        <SearchForm onSearch={handleSearch} />

        {/* Filter information */}
        {(stateFilter || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2">
            {stateFilter && (
              <div className="flex items-center gap-2 bg-gray-800 rounded-md px-3 py-1">
                <span className="text-gray-300">
                  {stateFilter === "international" ? "International Venues" : `State: ${stateFilter}`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                  onClick={() => handleStateFilter("")}
                >
                  <span className="sr-only">Clear state filter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </Button>
              </div>
            )}
          </div>
        )}

        {filteredVenues.length === 0 ? (
          <p className="text-gray-400">
            {searchQuery || stateFilter ? "No venues found matching your filters" : "No venues found"}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>

            {hasMore && (
              <div ref={loadMoreRef} className="py-8 text-center text-gray-400">
                {isLoading ? "Loading more venues..." : `${filteredVenues.length - displayCount} more venues`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
