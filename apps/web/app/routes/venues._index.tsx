import type { Venue } from "@bip/domain";
import { Form, Link, useSearchParams } from "react-router-dom";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { publicLoader } from "../lib/base-loaders";
import { services } from "../server/services";

interface LoaderData {
  venues: Venue[];
}

export const loader = publicLoader(async ({ request }): Promise<LoaderData> => {
  const venues = await services.venues.findMany({});
  return { venues };
});

interface VenueCardProps {
  venue: Venue;
}

function VenueCard({ venue }: VenueCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl">
          <Link to={`/venues/${venue.slug}`} className="text-foreground hover:text-primary">
            {venue.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground">
          {venue.city}, {venue.state}
        </p>
        {venue.timesPlayed > 0 && <p className="text-muted-foreground text-sm">Played {venue.timesPlayed} times</p>}
      </CardContent>
    </Card>
  );
}

function SearchForm() {
  const [searchParams] = useSearchParams();
  const currentQuery = searchParams.get("q") || "";

  return (
    <Form className="w-full max-w-lg mx-auto">
      <div className="relative">
        <input
          type="text"
          name="q"
          defaultValue={currentQuery}
          placeholder="Search venues..."
          className="w-full px-4 py-2 rounded-lg bg-card text-card-foreground border border-input shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input type="hidden" name="sort" value={searchParams.get("sort") || "timesPlayed"} />
      </div>
    </Form>
  );
}

export default function Venues() {
  const { venues } = useSerializedLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Venues</h1>
        </div>

        <SearchForm />

        {venues.length === 0 ? (
          <p className="text-muted-foreground">
            {searchQuery ? `No venues found matching "${searchQuery}"` : "No venues found"}
          </p>
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
