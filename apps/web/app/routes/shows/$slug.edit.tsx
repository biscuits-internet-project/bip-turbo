import type { Show } from "@bip/domain";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShowForm, type ShowFormValues } from "~/components/show/show-form";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";

interface LoaderData {
  show: Show;
}

export const loader = adminLoader(async ({ params }) => {
  const { slug } = params;
  const show = await services.shows.findBySlug(slug as string);

  if (!show) {
    throw notFound(`Show with slug "${slug}" not found`);
  }

  return { show };
});

export const action = adminLoader(async ({ request, params }) => {
  const { slug } = params;
  const formData = await request.formData();
  const date = formData.get("date") as string;

  // Update the show
  const show = await services.shows.update(slug as string, {
    date,
  });

  return { show };
});

export default function EditShow() {
  const { show } = useSerializedLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<ShowFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Set form values when show data is loaded
  useEffect(() => {
    if (show) {
      setDefaultValues({
        date: show.date,
      });
      setIsLoading(false);
    }
  }, [show]);

  const handleSubmit = async (data: ShowFormValues) => {
    const formData = new FormData();
    formData.append("date", data.date);

    const response = await fetch(`/shows/${show.slug}/edit`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      navigate(`/shows/${show.slug}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Edit Show</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/shows/${show.slug}`} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Show</span>
          </Link>
        </Button>
      </div>

      <Card className="relative overflow-hidden border-gray-800 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-purple-950/20 pointer-events-none" />
        <CardContent className="relative z-10 p-6">
          <ShowForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitLabel="Update Show"
            cancelHref={`/shows/${show.slug}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
