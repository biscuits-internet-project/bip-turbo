import type { Instrument } from "@bip/domain";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { ActionFunctionArgs } from "react-router";
import { Link, redirect, useNavigate } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { DeleteEntityButton } from "~/components/admin/delete-entity-button";
import { InstrumentForm, type InstrumentFormValues } from "~/components/musician/instrument-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
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
  const [defaultValues, setDefaultValues] = useState<InstrumentFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (instrument) {
      setDefaultValues({
        name: instrument.name,
      });
      setIsLoading(false);
    }
  }, [instrument]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AdminOnly>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-content-text-primary">Edit Instrument</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/instruments" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Instruments</span>
            </Link>
          </Button>
        </div>

        <Card className="card-premium">
          <CardContent className="p-6 space-y-6">
            <InstrumentForm defaultValues={defaultValues} submitLabel="Save Changes" cancelHref="/admin/instruments" />
            <div className="border-t border-glass-border pt-6">
              {usageCount > 0 ? (
                <p className="text-sm text-content-text-secondary">
                  In use by {usageCount} record(s) — remove those references before this instrument can be deleted.
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
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  );
}
