import type { Song, Venue } from "@bip/domain";
import type { LoaderFunctionArgs } from "react-router";
import { Form, Link, useLoaderData, useSearchParams } from "react-router-dom";
import superjson from "superjson";
import { services } from "../server/services";

export async function loader({ params }: LoaderFunctionArgs) {
  const slug = params.slug;
  if (!slug) throw new Error("Slug is required");

  const venue = await services.venues.findBySlug(slug);
  if (!venue) throw new Error("Venue not found");

  const { json: data, meta } = superjson.serialize({ venue });
  return { data, meta };
}

export default function VenuePage() {
  const { data, meta } = useLoaderData<typeof loader>();
  const { venue } = superjson.deserialize({ json: data, meta }) as { venue: Venue };

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
