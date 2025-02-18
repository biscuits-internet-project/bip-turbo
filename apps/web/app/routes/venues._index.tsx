import type { Song, Venue } from "@bip/domain";
import type { LoaderFunctionArgs } from "react-router";
import { Form, Link, useLoaderData, useSearchParams } from "react-router-dom";
import superjson from "superjson";
import { services } from "../server/services";

const SORT_OPTIONS = {
  title: { field: "title", label: "Title", order: "asc" as const },
  timesPlayed: { field: "timesPlayed", label: "Most Played", order: "desc" as const },
  firstPlayed: { field: "dateLastPlayed", label: "Debut Date", order: "desc" as const },
} as const;

type SortKey = keyof typeof SORT_OPTIONS;

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const sortKey = (url.searchParams.get("sort") as SortKey) || "timesPlayed";
  const searchQuery = url.searchParams.get("q") || "";
  const { field, order } = SORT_OPTIONS[sortKey];

  const venues = await services.venues.findMany({});
  const { json: data, meta } = superjson.serialize({ venues });
  return { data, meta, searchQuery };
}

interface VenueCardProps {
  venue: Venue;
}

function VenueCard({ venue }: VenueCardProps) {
  return (
    <div className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold">{venue.name}</h2>
      <p className="text-gray-600">
        Location: {venue.street}, {venue.city}, {venue.state} {venue.postalCode}
      </p>
      {venue.timesPlayed > 0 && <p className="text-gray-500 text-sm">Played {venue.timesPlayed} times</p>}
    </div>
  );
}

function SearchForm() {
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  return (
    <Form className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          name="q"
          defaultValue={currentQuery}
          placeholder="Search songs..."
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input type="hidden" name="sort" value={searchParams.get("sort") || "timesPlayed"} />
      </div>
    </Form>
  );
}

function SortSelect() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get("sort") || "timesPlayed";

  return (
    <select
      className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={currentSort}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", e.target.value);
        setSearchParams(params);
      }}
    >
      {Object.entries(SORT_OPTIONS).map(([key, { label }]) => (
        <option key={key} value={key}>
          Sort by {label}
        </option>
      ))}
    </select>
  );
}

export default function Venues() {
  const { data, meta, searchQuery } = useLoaderData<typeof loader>();
  const { venues } = superjson.deserialize({ json: data, meta }) as { venues: Venue[] };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Venues</h1>
          <SortSelect />
        </div>

        <SearchForm />

        {venues.length === 0 ? (
          <p className="text-gray-600">{searchQuery ? `No venues found matching "${searchQuery}"` : "No venues found"}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {venues.map((venue: Venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
