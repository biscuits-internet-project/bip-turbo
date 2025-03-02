import type { ReviewMinimal, Setlist } from "@bip/domain";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { ReviewsList } from "~/components/review";
import { SetlistCard } from "~/components/setlist/setlist-card";
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

  return (
    <div className="container">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">{format(date, "MMMM d, yyyy")}</h1>
          <p className="text-xl text-gray-300 mt-1">
            {setlist.venue.name} - {setlist.venue.city}, {setlist.venue.state}
          </p>
        </div>

        <Button variant="outline">EDIT SHOW</Button>
      </div>

      <div className="space-y-6">
        <SetlistCard key={setlist.show.id} setlist={setlist} />
      </div>

      <ReviewsList reviews={reviews} />
    </div>
  );
}
