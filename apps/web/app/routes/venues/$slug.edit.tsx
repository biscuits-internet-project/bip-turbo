import type { Venue } from "@bip/domain";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { VenueForm, type VenueFormValues } from "~/components/venue/venue-form";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";

interface LoaderData {
  venue: Venue;
}

export const loader = adminLoader(async ({ params }) => {
  const { slug } = params;
  const venue = await services.venues.getBySlug(slug as string);

  if (!venue) {
    throw notFound(`Venue with slug "${slug}" not found`);
  }

  return { venue };
});

export const action = adminLoader(async ({ request, params }) => {
  const { slug } = params;
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const city = (formData.get("city") as string) || null;
  const state = (formData.get("state") as string) || null;
  const country = (formData.get("country") as string) || null;

  // Update the venue
  const venue = await services.venues.update(slug as string, {
    name,
    city,
    state,
    country,
  });

  return { venue };
});

export default function EditVenue() {
  const { venue } = useSerializedLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<VenueFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Set form values when venue data is loaded
  useEffect(() => {
    if (venue) {
      setDefaultValues({
        name: venue.name,
        city: venue.city,
        state: venue.state,
        country: venue.country,
      });
      setIsLoading(false);
    }
  }, [venue]);

  const handleSubmit = async (data: VenueFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.city) formData.append("city", data.city);
    if (data.state) formData.append("state", data.state);
    if (data.country) formData.append("country", data.country);

    const response = await fetch(`/venues/${venue.slug}/edit`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      navigate(`/venues/${venue.slug}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-content-text-primary">Edit Venue</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/venues/${venue.slug}`} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Venue</span>
          </Link>
        </Button>
      </div>

      <Card className="card-premium">
        <CardContent className="p-6">
          <VenueForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitLabel="Update Venue"
            cancelHref={`/venues/${venue.slug}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
