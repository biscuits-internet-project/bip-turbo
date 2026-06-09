import type { Instrument } from "@bip/domain";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { Link, useRevalidator } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { getInstrumentColumns } from "~/components/musician/instrument-columns";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-content-text-primary">Instruments</h1>
          <Button asChild className="btn-primary">
            <Link to="/admin/instruments/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Instrument
            </Link>
          </Button>
        </div>

        <DataTable columns={columns} data={instruments} searchKey="name" searchPlaceholder="Search instruments..." />
      </div>
    </AdminOnly>
  );
}
