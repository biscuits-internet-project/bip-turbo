import { redirect, useSubmit } from "react-router-dom";
import { ShowForm, type ShowFormValues } from "~/components/show/show-form";
import { Card, CardContent } from "~/components/ui/card";
import { PageHeader } from "~/components/ui/page-header";
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
    <div>
      <div className="mb-6">
        <PageHeader title="Create Show" backLink={{ to: "/shows", label: "Back to Shows" }} />
      </div>

      <Card className="card-premium">
        <CardContent className="p-6">
          <ShowForm onSubmit={handleSubmit} submitLabel="Create Show" cancelHref="/shows" />
        </CardContent>
      </Card>
    </div>
  );
}
