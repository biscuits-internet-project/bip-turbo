import type { Setlist } from "@bip/domain";
import { Search } from "lucide-react";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";
import { publicLoader } from "../lib/base-loaders";
interface ShowLoaderData {
  setlist: Setlist;
}

export const loader = publicLoader(async ({ params }): Promise<ShowLoaderData> => {
  console.log("⚡️ shows.$slug loader:", params.slug);
  const slug = params.slug;
  if (!slug) throw notFound();

  // retrieve shows for the given year using drizzle SQL<Shows>
  const setlist = await services.setlists.findBySlug(slug);
  if (!setlist) throw notFound();

  return { setlist };
});

export default function Show() {
  const { setlist } = useSerializedLoaderData<ShowLoaderData>();

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">
          {setlist.show.date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}
        </h1>

        <Button variant="outline">EDIT SHOW</Button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search by date, venue, city, state, song, photos, youtube, reviews, relisten..."
          className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm"
        />
      </div>

      <div className="space-y-6">
        <SetlistCard key={setlist.show.id} setlist={setlist} />
      </div>
    </div>
  );
}
