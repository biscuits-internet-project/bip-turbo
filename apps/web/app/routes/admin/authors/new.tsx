import { ArrowLeft } from "lucide-react";
import type { ActionFunctionArgs } from "react-router";
import { Link, redirect } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { AuthorForm } from "~/components/author/author-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

export const loader = adminLoader(async () => {
  return { ok: true };
});

export const action = adminAction(async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name") as string;

  const _author = await services.authors.create({ name });

  return redirect("/admin/authors");
});

export default function NewAuthor() {
  return (
    <AdminOnly>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-content-text-primary">Create Author</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/authors" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Authors</span>
            </Link>
          </Button>
        </div>

        <Card className="card-premium">
          <CardContent className="p-6">
            <AuthorForm submitLabel="Create Author" cancelHref="/admin/authors" />
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  );
}
