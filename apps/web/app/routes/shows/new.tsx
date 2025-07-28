import type { Show } from "@bip/domain";
import { ArrowLeft } from "lucide-react";
import { Link, redirect, useSubmit } from "react-router-dom";
import { ShowForm, type ShowFormValues } from "~/components/show/show-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = adminLoader(async () => {
  return { ok: true };
});

export const action = adminAction(async ({ request }) => {
  const formData = await request.formData();
  const date = formData.get("date") as string;
  const venueId = formData.get("venueId") as string;
  const bandId = formData.get("bandId") as string;
  const notes = formData.get("notes") as string;
  const relistenUrl = formData.get("relistenUrl") as string;

  // Create the show
  const show = await services.shows.create({
    date,
    venueId: venueId === "none" ? undefined : venueId,
    bandId: bandId === "none" ? undefined : bandId,
    notes: notes || undefined,
    relistenUrl: relistenUrl || undefined,
  });

  return redirect(`/shows/${show.slug}`);
});

export default function NewShow() {
  const submit = useSubmit();

  const handleSubmit = async (data: ShowFormValues) => {
    const formData = new FormData();
    formData.append("date", data.date);
    formData.append("venueId", data.venueId);
    formData.append("bandId", data.bandId);
    formData.append("notes", data.notes);
    formData.append("relistenUrl", data.relistenUrl);

    submit(formData, { method: "post" });
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Create Show</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to="/shows" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Shows</span>
          </Link>
        </Button>
      </div>

      <Card className="relative overflow-hidden border-content-bg-secondary transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-purple-950/20 pointer-events-none" />
        <CardContent className="relative z-10 p-6">
          <ShowForm onSubmit={handleSubmit} submitLabel="Create Show" cancelHref="/shows" />
        </CardContent>
      </Card>
    </div>
  );
}
