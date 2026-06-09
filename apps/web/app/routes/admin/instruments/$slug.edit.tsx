import type { Instrument } from "@bip/domain";
import { useEffect, useState } from "react";
import type { ActionFunctionArgs } from "react-router";
import { redirect, useNavigate } from "react-router-dom";
import { AdminFormPage } from "~/components/admin/admin-form-page";
import { DeleteEntityButton } from "~/components/admin/delete-entity-button";
import { EntityNameForm, type NameFormValues } from "~/components/admin/entity-name-form";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";

interface LoaderData {
  instrument: Instrument;
  usageCount: number;
}

export const loader = adminLoader(async ({ params }) => {
  const { slug } = params;
  const instrument = await services.instruments.findBySlug(slug as string);

  if (!instrument) {
    throw notFound(`Instrument with slug "${slug}" not found`);
  }

  const usageCount = await services.instruments.countReferences(instrument.id);

  return { instrument, usageCount };
});

export const action = adminAction(async ({ request, params }: ActionFunctionArgs) => {
  const { slug } = params;
  const formData = await request.formData();
  const name = formData.get("name") as string;

  await services.instruments.update(slug as string, { name });

  return redirect("/admin/instruments");
});

export default function EditInstrument() {
  const { instrument, usageCount } = useSerializedLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<NameFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (instrument) {
      setDefaultValues({ name: instrument.name });
      setIsLoading(false);
    }
  }, [instrument]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminFormPage
      title="Edit Instrument"
      backHref="/admin/instruments"
      backLabel="Back to Instruments"
      footer={
        usageCount > 0 ? (
          <p className="text-sm text-content-text-secondary">
            In use by {usageCount} record(s); remove those references before this instrument can be deleted.
          </p>
        ) : (
          <DeleteEntityButton
            entityId={instrument.id}
            entityName={instrument.name}
            entityLabel="instrument"
            endpoint="/api/admin/instruments"
            onDeleted={() => navigate("/admin/instruments")}
            variant="button"
          />
        )
      }
    >
      <EntityNameForm
        noun="instrument"
        defaultValues={defaultValues}
        submitLabel="Save Changes"
        cancelHref="/admin/instruments"
      />
    </AdminFormPage>
  );
}
