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

  await services.instruments.create({ name });

  return redirect("/admin/instruments");
});

export default function NewInstrument() {
  return (
    <AdminFormPage title="Create Instrument" backHref="/admin/instruments" backLabel="Back to Instruments">
      <EntityNameForm noun="instrument" submitLabel="Create Instrument" cancelHref="/admin/instruments" />
    </AdminFormPage>
  );
}
