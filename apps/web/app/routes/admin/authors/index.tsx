import type { Author } from "@bip/domain";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useRevalidator } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { getAuthorColumns } from "~/components/author/author-columns";
import { DataTable } from "~/components/ui/data-table";
import { LinkButton } from "~/components/ui/link-button";
import { PageHeader } from "~/components/ui/page-header";
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
  const revalidator = useRevalidator();
  const columns = useMemo(() => getAuthorColumns(() => revalidator.revalidate()), [revalidator]);

  return (
    <AdminOnly>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <PageHeader
            title="AUTHORS ADMIN"
            backLink={{ to: "/songs", label: "All Songs" }}
            actions={
              <LinkButton to="/admin/authors/new" icon={Plus} iconOnlyOnMobile>
                Create Author
              </LinkButton>
            }
          />
        </div>

        <DataTable columns={columns} data={authors} searchKey="name" searchPlaceholder="Search authors..." />
      </div>
    </AdminOnly>
  );
}
