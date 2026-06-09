import type { Author } from "@bip/domain";
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
  author: Author;
  songCount: number;
}

export const loader = adminLoader(async ({ params }) => {
  const { slug } = params;
  const author = await services.authors.findBySlug(slug as string);

  if (!author) {
    throw notFound(`Author with slug "${slug}" not found`);
  }

  const songCount = await services.authors.countSongs(author.id);

  return { author, songCount };
});

export const action = adminAction(async ({ request, params }: ActionFunctionArgs) => {
  const { slug } = params;
  const formData = await request.formData();
  const name = formData.get("name") as string;

  await services.authors.update(slug as string, { name });

  return redirect("/admin/authors");
});

export default function EditAuthor() {
  const { author, songCount } = useSerializedLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<NameFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (author) {
      setDefaultValues({ name: author.name });
      setIsLoading(false);
    }
  }, [author]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminFormPage
      title="Edit Author"
      backHref="/admin/authors"
      backLabel="Back to Authors"
      footer={
        songCount > 0 ? (
          <p className="text-sm text-content-text-secondary">
            In use by {songCount} song(s); reassign those songs before this author can be deleted.
          </p>
        ) : (
          <DeleteEntityButton
            entityId={author.id}
            entityName={author.name}
            entityLabel="author"
            endpoint="/api/admin/authors"
            onDeleted={() => navigate("/admin/authors")}
            variant="button"
          />
        )
      }
    >
      <EntityNameForm
        noun="author"
        defaultValues={defaultValues}
        submitLabel="Save Changes"
        cancelHref="/admin/authors"
      />
    </AdminFormPage>
  );
}
