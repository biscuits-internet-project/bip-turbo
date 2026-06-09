import { ArrowLeft } from "lucide-react";
import type { ActionFunctionArgs } from "react-router";
import { Link, redirect } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { InstrumentForm } from "~/components/musician/instrument-form";
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

  await services.instruments.create({ name });

  return redirect("/admin/instruments");
});

export default function NewInstrument() {
  return (
    <AdminOnly>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-content-text-primary">Create Instrument</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/instruments" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Instruments</span>
            </Link>
          </Button>
        </div>

        <Card className="card-premium">
          <CardContent className="p-6">
            <InstrumentForm submitLabel="Create Instrument" cancelHref="/admin/instruments" />
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  );
}
