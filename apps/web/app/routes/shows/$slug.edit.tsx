import type { Show, Band, Venue, Track } from "@bip/domain";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ShowForm, type ShowFormValues } from "~/components/show/show-form";
import { TrackManager } from "~/components/track/track-manager";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";

interface LoaderData {
  show: Show;
  bands: Band[];
  venues: Venue[];
  tracks: Track[];
}

export const loader = adminLoader(async ({ params }) => {
  const { slug } = params;
  const show = await services.shows.findBySlug(slug as string);
  
  // TODO: Add band service when implemented
  const bands: Band[] = [];

  if (!show) {
    throw notFound(`Show with slug "${slug}" not found`);
  }

  // Get tracks for this show
  const tracks = await services.tracks.findByShowId(show.id);

  return { show, bands, tracks };
});

export const action = adminLoader(async ({ request, params }) => {
  const { slug } = params;
  const formData = await request.formData();
  
  const venueId = formData.get("venueId") as string;
  const bandId = formData.get("bandId") as string;
  
  const data = {
    date: formData.get("date") as string,
    venueId: venueId === "none" ? undefined : venueId,
    bandId: bandId === "none" ? undefined : bandId,
    notes: formData.get("notes") as string || null,
    relistenUrl: formData.get("relistenUrl") as string || null,
  };

  // Update the show
  const show = await services.shows.update(slug as string, data);

  return { show };
});

export default function EditShow() {
  const { show, bands, tracks } = useSerializedLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<ShowFormValues | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Set form values when show data is loaded
  useEffect(() => {
    if (show) {
      setDefaultValues({
        date: show.date,
        venueId: show.venueId || "none",
        bandId: show.bandId || "none",
        notes: show.notes || "",
        relistenUrl: show.relistenUrl || "",
      });
      setIsLoading(false);
    }
  }, [show]);

  const handleSubmit = async (data: ShowFormValues) => {
    const loadingToast = toast.loading("Updating show...");
    
    try {
      const formData = new FormData();
      formData.append("date", data.date);
      formData.append("venueId", data.venueId);
      formData.append("bandId", data.bandId);
      formData.append("notes", data.notes);
      formData.append("relistenUrl", data.relistenUrl);

      const response = await fetch(`/shows/${show.slug}/edit`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Show updated successfully!", { id: loadingToast });
        navigate(`/shows/${show.slug}`);
      } else {
        toast.error("Failed to update show. Please try again.", { id: loadingToast });
      }
    } catch (error) {
      toast.error("An error occurred while updating the show.", { id: loadingToast });
      console.error("Show update error:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-content-text-primary">Edit Show</h1>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/shows/${show.slug}`} className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Show</span>
          </Link>
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="card-premium">
          <CardContent className="p-6">
            <ShowForm
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              submitLabel="Update Show"
              cancelHref={`/shows/${show.slug}`}
              bands={bands}
            />
          </CardContent>
        </Card>

        <div className="mt-6">
          <TrackManager showId={show.id} initialTracks={tracks} />
        </div>
      </div>
    </div>
  );
}
