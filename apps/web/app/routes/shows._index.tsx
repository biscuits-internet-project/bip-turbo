import type { Setlist } from "@bip/domain";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import superjson from "superjson";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
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
    year: yearInt,
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
    <>
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by date, venue, city, state, song, photos, youtube, reviews, relisten..."
          className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm"
        />
      </div>

      {/* Year navigation */}
      <div className="mb-8 flex flex-wrap gap-2">
        {years.map((year) => (
          <Link
            key={year}
            to={`/shows?year=${year}`}
            className="px-3 py-1 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            {year}
          </Link>
        ))}
      </div>

      {/* Month navigation */}
      <div className="mb-8 flex gap-2">
        {months.map((month) => (
          <Link
            key={month}
            to={`/shows?month=${month}`}
            className="px-3 py-1 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            {month}
          </Link>
        ))}
      </div>

      {/* Setlist cards */}
      <div className="space-y-6">
        {setlists.map((setlist) => (
          <SetlistCard key={setlist.show.id} setlist={setlist} />
        ))}
      </div>
    </>
  );
}
