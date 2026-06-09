import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router-dom";
import { AdminFormPage } from "~/components/admin/admin-form-page";
import { MusicianForm } from "~/components/musician/musician-form";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { parseMusicianForm } from "~/lib/parse-musician-form";
import { services } from "~/server/services";

export const loader = adminLoader(async () => {
  return { ok: true };
});

export const action = adminAction(async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  await services.musicians.create(parseMusicianForm(formData));

  return redirect("/musicians");
});

export default function NewMusician() {
  return (
    <AdminFormPage title="Create Musician" backHref="/musicians" backLabel="Back to Musicians">
      <MusicianForm submitLabel="Create Musician" cancelHref="/musicians" />
    </AdminFormPage>
  );
}
