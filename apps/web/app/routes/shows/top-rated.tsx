import type { Show } from "@bip/domain";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { formatDateShort } from "~/lib/utils";
import { services } from "~/server/services";

interface LoaderData {
  shows: Show[];
}

export const loader = publicLoader<LoaderData>(async () => {
  // Get shows ordered by rating (highest first), limit to 100
  const shows = await services.shows.search("", {
    pagination: { page: 1, limit: 100 },
    sort: [{ field: "averageRating", direction: "desc" }],
    filters: [
      {
        field: "averageRating",
        operator: "gt",
        value: 0,
      },
      {
        field: "ratingsCount",
        operator: "gt",
        value: 10,
      },
    ],
    includes: ["venue"],
  });

  return { shows };
});

export function meta() {
  return [
    { title: "Top Rated Shows | Biscuits Internet Project" },
    {
      name: "description",
      content: "Discover the highest rated Disco Biscuits shows of all time.",
    },
  ];
}

export default function TopRated() {
  const { shows = [] } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Top Rated Shows</h1>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <div className="relative overflow-x-auto">
            <table className="w-full text-md">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border/40">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Number of Ratings</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Location</th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show, index) => (
                  <tr key={show.id} className="border-b border-border/40 hover:bg-accent/5">
                    <td className="p-4 text-white font-medium">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-white font-medium">{show.averageRating?.toFixed(1) || "—"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white">{show.ratingsCount}</td>
                    <td className="p-4 text-white">
                      <Link to={`/shows/${show.slug}`} className="hover:underline">
                        {formatDateShort(show.date)}
                      </Link>
                    </td>
                    <td className="p-4 text-white">{show.venue?.name || "Unknown Venue"}</td>
                    <td className="p-4 text-white font-medium">
                      {show.venue
                        ? [show.venue.city, show.venue.state, show.venue.country].filter(Boolean).join(", ")
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
