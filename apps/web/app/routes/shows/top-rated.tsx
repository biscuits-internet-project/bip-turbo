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
          <h1 className="text-3xl md:text-4xl font-bold text-content-text-primary">Top Rated Shows</h1>
        </div>

        <Card className="card-premium">
          <div className="relative overflow-x-auto">
            <table className="w-full text-md">
              <thead>
                <tr className="text-left text-sm text-content-text-secondary border-b border-glass-border/40">
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
                  <tr key={show.id} className="border-b border-glass-border/40 group">
                    <td className="p-0" colSpan={6}>
                      <Link to={`/shows/${show.slug}`} className="flex w-full hover:bg-hover-glass transition-colors">
                        <div className="p-4 w-[100px]">
                          <span className="text-content-text-primary font-medium">{index + 1}</span>
                        </div>
                        <div className="p-4 w-[140px]">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-rating-gold mr-1" />
                            <span className="text-content-text-primary font-medium">{show.averageRating?.toFixed(1) || "—"}</span>
                          </div>
                        </div>
                        <div className="p-4 w-[180px]">
                          <span className="text-content-text-primary">{show.ratingsCount}</span>
                        </div>
                        <div className="p-4 w-[140px]">
                          <span className="text-brand-primary group-hover:underline group-hover:text-brand-secondary">{formatDateShort(show.date)}</span>
                        </div>
                        <div className="p-4 flex-1">
                          <span className="text-content-text-primary">{show.venue?.name || "Unknown Venue"}</span>
                        </div>
                        <div className="p-4 flex-1">
                          <span className="text-content-text-secondary font-medium">
                            {show.venue
                              ? [show.venue.city, show.venue.state, show.venue.country].filter(Boolean).join(", ")
                              : ""}
                          </span>
                        </div>
                      </Link>
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
