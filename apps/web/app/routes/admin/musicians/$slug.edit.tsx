import type { Musician } from "@bip/domain";
import { useEffect, useState } from "react";
import type { ActionFunctionArgs } from "react-router";
import { redirect, useNavigate } from "react-router-dom";
import { AdminFormPage } from "~/components/admin/admin-form-page";
import { DeleteEntityButton } from "~/components/admin/delete-entity-button";
import { MusicianForm, type MusicianFormValues } from "~/components/musician/musician-form";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { parseMusicianForm } from "~/lib/parse-musician-form";
import { services } from "~/server/services";

interface LoaderData {
  musician: Musician;
  referenceCount: number;
}

export const loader = adminLoader(async ({ params }) => {
  const { slug } = params;
  const musician = await services.musicians.findBySlug(slug as string);

  if (!musician) {
    throw notFound(`Musician with slug "${slug}" not found`);
  }

  const referenceCount = await services.musicians.countReferences(musician.id);

  return { musician, referenceCount };
});

export const action = adminAction(async ({ request, params }: ActionFunctionArgs) => {
  const { slug } = params;
  const formData = await request.formData();

  await services.musicians.update(slug as string, parseMusicianForm(formData));

  return redirect("/musicians");
});

export default function EditMusician() {
  const { musician, referenceCount } = useSerializedLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<MusicianFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (musician) {
      setDefaultValues({
        name: musician.name,
        knownFrom: musician.knownFrom ?? "",
        defaultInstrumentId: musician.defaultInstrumentId,
      });
      setIsLoading(false);
    }
  }, [musician]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminFormPage
      title="Edit Musician"
      backHref="/musicians"
      backLabel="Back to Musicians"
      footer={
        referenceCount > 0 ? (
          <p className="text-sm text-content-text-secondary">
            In use by {referenceCount} record(s); remove those references before this musician can be deleted.
          </p>
        ) : (
          <DeleteEntityButton
            entityId={musician.id}
            entityName={musician.name}
            entityLabel="musician"
            endpoint="/api/admin/musicians"
            onDeleted={() => navigate("/musicians")}
            variant="button"
          />
        )
      }
    >
      <MusicianForm defaultValues={defaultValues} submitLabel="Save Changes" cancelHref="/musicians" />
    </AdminFormPage>
  );
}
