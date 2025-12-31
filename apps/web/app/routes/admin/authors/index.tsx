import type { Author } from "@bip/domain";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { authorColumns } from "~/components/author/author-columns";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface LoaderData {
  authors: Array<Author & { songCount: number }>;
}

export const loader = adminLoader(async (): Promise<LoaderData> => {
  const authors = await services.authors.findManyWithSongCount();

  return { authors };
});

export default function AdminAuthorsIndex() {
  const { authors } = useSerializedLoaderData<LoaderData>();

  return (
    <AdminOnly>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-content-text-primary">Authors</h1>
          <Button asChild className="btn-primary">
            <Link to="/admin/authors/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Author
            </Link>
          </Button>
        </div>

        <DataTable columns={authorColumns} data={authors} searchKey="name" searchPlaceholder="Search authors..." />
      </div>
    </AdminOnly>
  );
}
