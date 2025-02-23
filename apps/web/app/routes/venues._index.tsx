import type { Venue } from "@bip/domain";
import { MapPin, Search, Star, Ticket } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "../lib/base-loaders";
import { services } from "../server/services";

const ITEMS_PER_PAGE = 50;

interface LoaderData {
  venues: Venue[];
  recentVenues: Venue[];
  stats: {
    totalVenues: number;
    totalShows: number;
    totalStates: number;
    recentShowCount: number;
  };
}

export const loader = publicLoader(async ({ request }): Promise<LoaderData> => {
  const venues = await services.venues.findMany({});
  const recentVenues = venues.slice(0, 6);

  // Calculate stats
  const stats = {
    totalVenues: venues.length,
    totalShows: venues.reduce((acc, venue) => acc + (venue.timesPlayed || 0), 0),
    totalStates: new Set(venues.map((v) => v.state).filter(Boolean)).size,
    recentShowCount: recentVenues.reduce((acc, venue) => acc + (venue.timesPlayed || 0), 0),
  };

  return { venues, recentVenues, stats };
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

export default function Venues() {
  const { venues, recentVenues, stats } = useSerializedLoaderData<LoaderData>();

  const [filteredVenues, setFilteredVenues] = useState(venues);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (!query) {
        setFilteredVenues(venues);
      } else {
        const lowerQuery = query.toLowerCase();
        const filtered = venues.filter(
          (venue: Venue) =>
            venue.name?.toLowerCase().includes(lowerQuery) ||
            false ||
            venue.city?.toLowerCase().includes(lowerQuery) ||
            false ||
            venue.state?.toLowerCase().includes(lowerQuery) ||
            false,
        );
        setFilteredVenues(filtered);
      }
      setDisplayCount(ITEMS_PER_PAGE);
    },
    [venues],
  );

  const visibleVenues = useMemo(() => filteredVenues.slice(0, displayCount), [filteredVenues, displayCount]);
  const hasMore = displayCount < filteredVenues.length;

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Venues</h1>
        </div>

        {/* Stats Grid */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox icon={<MapPin className="h-4 w-4" />} label="Total Venues" value={stats.totalVenues} />
          <StatBox icon={<Ticket className="h-4 w-4" />} label="Total Shows" value={stats.totalShows} />
          <StatBox icon={<MapPin className="h-4 w-4" />} label="States/Regions" value={stats.totalStates} />
          <StatBox
            icon={<Ticket className="h-4 w-4" />}
            label="Recent Shows"
            value={stats.recentShowCount}
            sublabel="last 6 venues"
          />
        </dl>

        {recentVenues.length > 0 && (
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

        {filteredVenues.length === 0 ? (
          <p className="text-gray-400">
            {searchQuery ? `No venues found matching "${searchQuery}"` : "No venues found"}
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
