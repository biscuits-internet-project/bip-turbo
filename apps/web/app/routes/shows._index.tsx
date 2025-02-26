import type { Setlist } from "@bip/domain";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";
import { publicLoader } from "../lib/base-loaders";

interface LoaderData {
  setlists: Setlist[];
  year: number;
}

const years = Array.from({ length: 30 }, (_, i) => 2025 - i);
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const loader = publicLoader(async ({ request }): Promise<LoaderData> => {
  console.log("⚡️ shows loader start:", request.method, new URL(request.url).pathname);

  const url = new URL(request.url);
  const year = url.searchParams.get("year") || new Date().getFullYear() - 1;
  const yearInt = Number.parseInt(year as string);

  console.log("⚡️ shows loader - fetching setlists for year:", yearInt);

  const cacheKey = `shows-${yearInt}`;
  try {
    const cachedSetlists = await services.redis.get<Setlist[]>(cacheKey);
    if (cachedSetlists) {
      console.log("⚡️ shows loader - found cached setlists:", cachedSetlists.length);
      return { setlists: cachedSetlists, year: yearInt };
    }
  } catch (error) {
    console.error("Redis cache error:", error);
    // Continue to database query
  }

  const setlists = await services.setlists.findMany({
    filters: [
      { field: "date", operator: "gte", value: new Date(yearInt, 0, 1) },
      { field: "date", operator: "lte", value: new Date(yearInt, 11, 31) },
    ],
  });

  if (setlists.length > 0) {
    await services.redis.set<Setlist[]>(cacheKey, setlists);
  }

  console.log("⚡️ shows loader - found setlists:", setlists.length);
  return { setlists, year: yearInt };
});

export default function Shows() {
  const { setlists, year } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="w-full p-4 md:p-6">
      <div className="space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Shows</h1>
            <span className="text-gray-400 text-lg">{year}</span>
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by date, venue, city, state, song, photos, youtube, reviews, relisten..."
              className="w-full rounded-md border border-border/40 bg-black/20 pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Navigation */}
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
            <h2 className="text-sm font-medium text-gray-400 mb-3">Filter by Month</h2>
            <div className="flex flex-wrap gap-2">
              {months.map((month) => (
                <Link
                  key={month}
                  to={`/shows?month=${month}`}
                  className="px-3 py-1 text-sm rounded-md text-gray-400 hover:bg-accent/10 hover:text-white transition-colors"
                >
                  {month}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Setlist cards */}
        <div className="space-y-4">
          {setlists.map((setlist) => (
            <SetlistCard key={setlist.show.id} setlist={setlist} />
          ))}
        </div>
      </div>
    </div>
  );
}
