import { redirect, useSubmit } from "react-router-dom";
import { Card, CardContent } from "~/components/ui/card";
import { PageHeader } from "~/components/ui/page-header";
import { VenueForm, type VenueFormValues } from "~/components/venue/venue-form";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = adminLoader(async () => {
  return { ok: true };
});

export const action = adminAction(async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const city = formData.get("city") as string;
  const state = (formData.get("state") as string) || null;
  const country = formData.get("country") as string;

  // Create the venue
  const venue = await services.venues.create({
    name,
    city,
    state,
    country,
  });

  return redirect(`/venues/${venue.slug}`);
});

export default function NewVenue() {
  const submit = useSubmit();

  const handleSubmit = async (data: VenueFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("city", data.city);
    if (data.state) formData.append("state", data.state);
    formData.append("country", data.country);

    submit(formData, { method: "post" });
  };

  return (
    <div>
      <div className="mb-6">
        <PageHeader title="Create Venue" backLink={{ to: "/venues", label: "Back to Venues" }} />
      </div>

      <Card>
        <CardContent className="p-6">
          <VenueForm onSubmit={handleSubmit} submitLabel="Create Venue" cancelHref="/venues" />
        </CardContent>
      </Card>
    </div>
  );
}
