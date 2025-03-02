import type { Setlist, TourDate } from "@bip/domain";
import { ArrowRight, Calendar, MapPin, Music, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { Card } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface LoaderData {
  tourDates: TourDate[];
  recentShows: Setlist[];
}

export const loader = publicLoader<LoaderData>(async () => {
  // Get upcoming tour dates
  const tourDates = Array.isArray(await services.tourDatesService.getTourDates())
    ? await services.tourDatesService.getTourDates()
    : [];

  // Get recent shows (last 5)
  const recentShows = await services.setlists.findMany({
    pagination: { limit: 5 },
    sort: [{ field: "date", direction: "desc" }],
  });

  return { tourDates, recentShows };
});

export default function Index() {
  const { tourDates = [], recentShows = [] } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10">
      {/* Hero section */}
      <div className="py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent">
          Welcome to BIP 3.0
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your ultimate resource for the Disco Biscuits - shows, setlists, stats, and more.
        </p>
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search shows, songs, venues..."
            className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-3 text-lg"
          />
        </div>
      </div>

      {/* Main content grid - Setlists and Tour Dates */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 mb-16">
        {/* Recent Shows Section - Takes 4/7 of the grid on large screens */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Shows</h2>
            <Link to="/shows" className="text-purple-500 hover:text-purple-400 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {recentShows.length > 0 ? (
            <div className="grid gap-6">
              {recentShows.map((setlist) => (
                <SetlistCard key={setlist.show.id} setlist={setlist} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No recent shows available</p>
            </div>
          )}
        </div>

        {/* Upcoming Tour Dates Section - Takes 3/7 of the grid on large screens */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Upcoming Tour Dates</h2>
          </div>

          {tourDates.length > 0 ? (
            <Card className="bg-gray-900 border-gray-800 h-full">
              <div className="relative overflow-x-auto">
                <table className="w-full text-md">
                  <thead>
                    <tr className="text-left text-sm text-muted-foreground border-b border-border/40">
                      <th className="p-4">Date</th>
                      <th className="p-4">Venue</th>
                      <th className="hidden md:table-cell p-4">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tourDates.map((td: TourDate) => (
                      <tr
                        key={td.formattedStartDate + td.venueName}
                        className="border-b border-border/40 hover:bg-accent/5"
                      >
                        <td className="p-4 text-white">
                          {td.formattedStartDate === td.formattedEndDate
                            ? td.formattedStartDate
                            : `${td.formattedStartDate} - ${td.formattedEndDate}`}
                        </td>
                        <td className="p-4 text-white font-medium">{td.venueName}</td>
                        <td className="hidden md:table-cell p-4 text-gray-400">{td.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No upcoming tour dates available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
