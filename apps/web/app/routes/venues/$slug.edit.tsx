import type { Venue } from "@bip/domain";
import { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { Card, CardContent } from "~/components/ui/card";
import { PageHeader } from "~/components/ui/page-header";
import { VenueForm, type VenueFormValues } from "~/components/venue/venue-form";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminAction, adminLoader } from "~/lib/base-loaders";
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

export const action = adminAction(async ({ request, params }) => {
  const { slug } = params;
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const city = formData.get("city") as string;
  const state = (formData.get("state") as string) || null;
  const country = formData.get("country") as string;

  // Update the venue. A name/city/state change re-slugs it, so redirect to the
  // new slug (the client navigates to the redirect target) rather than returning
  // the venue, which a plain fetch would receive as an HTML document.
  const venue = await services.venues.update(slug as string, {
    name,
    city,
    state,
    country,
  });

  return redirect(`/venues/${venue.slug}`);
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
        city: venue.city || "",
        state: venue.state,
        country: venue.country || "",
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
      // The action redirects to the (possibly re-slugged) venue URL; fetch
      // follows it, so response.url is the canonical slug. Navigate there
      // instead of the stale loader slug, which 404s on a rename.
      navigate(new URL(response.url).pathname);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <PageHeader title="Edit Venue" backLink={{ to: `/venues/${venue.slug}`, label: "Back to Venue" }} />
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
