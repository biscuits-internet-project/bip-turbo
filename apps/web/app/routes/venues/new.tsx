import type { Venue } from "@bip/domain";
import { ArrowLeft } from "lucide-react";
import { Link, redirect, useSubmit } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { VenueForm, type VenueFormValues } from "~/components/venue/venue-form";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = adminLoader(async () => {
  return { ok: true };
});

export const action = adminAction(async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const city = (formData.get("city") as string) || null;
  const state = (formData.get("state") as string) || null;
  const country = (formData.get("country") as string) || null;

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
    if (data.city) formData.append("city", data.city);
    if (data.state) formData.append("state", data.state);
    if (data.country) formData.append("country", data.country);

    submit(formData, { method: "post" });
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-content-text-primary">Create Venue</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to="/venues" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Venues</span>
          </Link>
        </Button>
      </div>

      <Card className="card-premium">
        <CardContent className="p-6">
          <VenueForm onSubmit={handleSubmit} submitLabel="Create Venue" cancelHref="/venues" />
        </CardContent>
      </Card>
    </div>
  );
}
