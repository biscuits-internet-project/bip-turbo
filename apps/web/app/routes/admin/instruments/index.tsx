import type { Instrument } from "@bip/domain";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useRevalidator } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { getInstrumentColumns } from "~/components/musician/instrument-columns";
import { DataTable } from "~/components/ui/data-table";
import { LinkButton } from "~/components/ui/link-button";
import { PageHeader } from "~/components/ui/page-header";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface LoaderData {
  instruments: Array<Instrument & { usageCount: number }>;
}

export const loader = adminLoader(async (): Promise<LoaderData> => {
  const instruments = await services.instruments.findManyWithUsageCount();

  return { instruments };
});

export default function AdminInstrumentsIndex() {
  const { instruments } = useSerializedLoaderData<LoaderData>();
  const revalidator = useRevalidator();
  const columns = useMemo(() => getInstrumentColumns(() => revalidator.revalidate()), [revalidator]);

  return (
    <AdminOnly>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <PageHeader
            title="INSTRUMENTS ADMIN"
            backLink={{ to: "/musicians", label: "All Musicians" }}
            actions={
              <LinkButton to="/admin/instruments/new" icon={Plus} iconOnlyOnMobile>
                Create Instrument
              </LinkButton>
            }
          />
        </div>

        <DataTable columns={columns} data={instruments} searchKey="name" searchPlaceholder="Search instruments..." />
      </div>
    </AdminOnly>
  );
}
