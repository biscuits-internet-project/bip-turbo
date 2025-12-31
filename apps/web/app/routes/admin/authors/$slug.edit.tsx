import type { Author } from "@bip/domain";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { ActionFunctionArgs } from "react-router";
import { Link, redirect } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { AuthorForm, type AuthorFormValues } from "~/components/author/author-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";

interface LoaderData {
  author: Author;
}

export const loader = adminLoader(async ({ params }) => {
  const { slug } = params;
  const author = await services.authors.findBySlug(slug as string);

  if (!author) {
    throw notFound(`Author with slug "${slug}" not found`);
  }

  return { author };
});

export const action = adminAction(async ({ request, params }: ActionFunctionArgs) => {
  const { slug } = params;
  const formData = await request.formData();
  const name = formData.get("name") as string;

  await services.authors.update(slug as string, { name });

  return redirect("/admin/authors");
});

export default function EditAuthor() {
  const { author } = useSerializedLoaderData<LoaderData>();
  const [defaultValues, setDefaultValues] = useState<AuthorFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Set form values when author data is loaded
  useEffect(() => {
    if (author) {
      setDefaultValues({
        name: author.name,
      });
      setIsLoading(false);
    }
  }, [author]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminOnly>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-content-text-primary">Edit Author</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/authors" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Authors</span>
            </Link>
          </Button>
        </div>

        <Card className="card-premium">
          <CardContent className="p-6">
            <AuthorForm defaultValues={defaultValues} submitLabel="Save Changes" cancelHref="/admin/authors" />
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  );
}
