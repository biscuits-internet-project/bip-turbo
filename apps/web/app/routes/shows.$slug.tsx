import type { ReviewMinimal, Setlist } from "@bip/domain";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { ReviewsList } from "~/components/review";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { SetlistHighlights } from "~/components/setlist/setlist-highlights";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";
import { publicLoader } from "../lib/base-loaders";

interface ShowLoaderData {
  setlist: Setlist;
  reviews: ReviewMinimal[];
}

export const loader = publicLoader(async ({ params }): Promise<ShowLoaderData> => {
  console.log("⚡️ shows.$slug loader:", params.slug);
  const slug = params.slug;
  if (!slug) throw notFound();

  const setlist = await services.setlists.findByShowSlug(slug);
  if (!setlist) throw notFound();

  const reviews = await services.reviews.findByShowId(setlist.show.id);

  return { setlist, reviews };
});

export default function Show() {
  const { setlist, reviews } = useSerializedLoaderData<ShowLoaderData>();
  const date = new Date(setlist.show.date);
  const rating = setlist.show.averageRating || 0;

  return (
    <div className="w-full px-4 md:px-6">
      {/* Header with show date and venue */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-4">
        <div>
          <h1 className="text-4xl font-bold text-white">{format(date, "MMMM d, yyyy")}</h1>
          <p className="text-xl text-gray-300 mt-1">
            {setlist.venue.name} - {setlist.venue.city}, {setlist.venue.state}
          </p>
        </div>

        {/* <Button variant="outline">EDIT SHOW</Button> */}
      </div>

      {/* Main content area with responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Setlist */}
        <div className="lg:col-span-8">
          <SetlistCard key={setlist.show.id} setlist={setlist} />

          {/* Reviews section moved up to fill whitespace */}
          <div className="mt-6">
            <ReviewsList reviews={reviews} />
          </div>
        </div>

        {/* Right column: Highlights and additional content */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-4 space-y-6">
            {/* Highlights panel */}
            <SetlistHighlights setlist={setlist} />

            {/* Additional content could go here */}
            {rating > 0 && (
              <div className="bg-gradient-to-br from-gray-900 to-gray-900/80 border border-gray-800 rounded-lg p-5">
                <h3 className="text-lg font-medium text-white mb-3">Show Rating</h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={star <= Math.round(rating) ? "currentColor" : "none"}
                        stroke="currentColor"
                        className={`w-6 h-6 ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-600"}`}
                        aria-hidden="true"
                        role="img"
                      >
                        <title>Star {star}</title>
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-yellow-400">{rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">/ 5.0</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
