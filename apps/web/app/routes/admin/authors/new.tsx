import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router-dom";
import { AdminFormPage } from "~/components/admin/admin-form-page";
import { EntityNameForm } from "~/components/admin/entity-name-form";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = adminLoader(async () => {
  return { ok: true };
});

export const action = adminAction(async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;

  await services.authors.create({ name });

  return redirect("/admin/authors");
});

export default function NewAuthor() {
  return (
    <AdminFormPage title="Create Author" backHref="/admin/authors" backLabel="Back to Authors">
      <EntityNameForm noun="author" submitLabel="Create Author" cancelHref="/admin/authors" />
    </AdminFormPage>
  );
}
