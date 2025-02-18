import type { Setlist } from "@bip/domain";
import { Search } from "lucide-react";
import type { LoaderFunctionArgs } from "react-router-dom";
import { Link, useLoaderData } from "react-router-dom";
import superjson from "superjson";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { services } from "~/server/services";

const years = Array.from({ length: 30 }, (_, i) => 2025 - i);
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    console.log("⚡️ shows loader start:", request.method, new URL(request.url).pathname);

    const url = new URL(request.url);
    const year = url.searchParams.get("year") || new Date().getFullYear() - 1;
    const yearInt = Number.parseInt(year as string);

    console.log("⚡️ shows loader - fetching setlists for year:", yearInt);
    const setlists = await services.setlists.findMany({
      year: yearInt,
    });
    console.log("⚡️ shows loader - found setlists:", setlists.length);

    const { json: data, meta } = superjson.serialize({ setlists, year });
    console.log("⚡️ shows loader end - success");
    return { data, meta };
  } catch (error) {
    console.error("⚡️ shows loader error:", error);
    throw error;
  }
}

export default function Shows() {
  const { data, meta } = useLoaderData<typeof loader>();
  const { setlists, year } = superjson.deserialize({ json: data, meta }) as { setlists: Setlist[]; year: string };

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
          <Link key={year} to={`/shows?year=${year}`} className="px-3 py-1 text-sm rounded-md hover:bg-accent hover:text-accent-foreground">
            {year}
          </Link>
        ))}
      </div>

      {/* Month navigation */}
      <div className="mb-8 flex gap-2">
        {months.map((month) => (
          <Link key={month} to={`/shows?month=${month}`} className="px-3 py-1 text-sm rounded-md hover:bg-accent hover:text-accent-foreground">
            {month}
          </Link>
        ))}
      </div>

      {/* View options */}
      <div className="mb-8 flex justify-end">
        <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
          VIEW COMPACT LIST
        </button>
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
