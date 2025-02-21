import type { Venue } from "@bip/domain";
import type { LoaderFunctionArgs } from "react-router";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "../lib/base-loaders";
import { services } from "../server/services";

interface LoaderData {
  venue: Venue;
}

export const loader = publicLoader(async ({ params }: LoaderFunctionArgs): Promise<LoaderData> => {
  const slug = params.slug;
  if (!slug) throw new Error("Slug is required");

  const venue = await services.venues.findBySlug(slug);
  if (!venue) throw new Error("Venue not found");

  return { venue };
});

export default function VenuePage() {
  const { venue } = useSerializedLoaderData<LoaderData>();

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{venue.name}</h1>
        </div>
      </div>
    </div>
  );
}
