import type { Band, RockOpera, Setlist, Show, ShowLineupMember, Track, Venue } from "@bip/domain";
import { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DeleteEntityButton } from "~/components/admin/delete-entity-button";
import { ShowDayOrderManager, type ShowDayOrderRow } from "~/components/show/show-day-order-manager";
import { ShowForm, type ShowFormValues } from "~/components/show/show-form";
import { ShowLineupManager } from "~/components/show/show-lineup-manager";
import { TrackManager } from "~/components/track/track-manager";
import { Card, CardContent } from "~/components/ui/card";
import { PageHeader } from "~/components/ui/page-header";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { services } from "~/server/services";

interface LoaderData {
  show: Show;
  bands: Band[];
  venues: Venue[];
  tracks: Track[];
  footnoteSetlist: Setlist | null;
  sameDateShows: ShowDayOrderRow[];
  rockOperas: RockOpera[];
  currentRockOperaIds: string[];
  initialLineup: ShowLineupMember[];
}

export const loader = adminLoader(async ({ params }) => {
  const { slug } = params;
  const show = await services.shows.findBySlug(slug as string);

  // TODO: Add band service when implemented
  const bands: Band[] = [];

  if (!show) {
    throw notFound(`Show with slug "${slug}" not found`);
  }

  // Get venues for the venue selector
  const venues = await services.venues.findMany({});

  // Get tracks for this show. The edit forms use this lighter shape; the
  // read-only footnotes derive from the heavier setlist below.
  const tracks = await services.tracks.findByShowId(show.id);

  // The full setlist carries flags/performers/completions/recurrence per track,
  // which TrackManager runs through the same footnote engine as the public
  // setlist so admins see the current derived state before editing.
  const footnoteSetlist = await services.setlists.findByShowSlug(slug as string);

  // Same-date show group — drives the reorder widget visibility/seed.
  const sameDateRaw = await services.shows.findByDate(show.date);
  const sameDateShows: ShowDayOrderRow[] = sameDateRaw.map((s) => ({
    id: s.id,
    slug: s.slug,
    date: s.date,
    dayOrder: s.dayOrder,
    venueName: s.venue?.name ?? null,
  }));

  // Rock opera checkbox source + current selection. The annotations call
  // returns each opera's slug; we map back to id for the form value via
  // the full list. Tiny lookup tables, both queries are cheap.
  const [rockOperas, currentRockOperaAnnotations] = await Promise.all([
    services.rockOperas.findAll(),
    services.rockOperas.findPerformancesForShow(show.id),
  ]);
  const slugToId = new Map(rockOperas.map((o) => [o.slug, o.id]));
  const currentRockOperaIds = currentRockOperaAnnotations
    .map((annotation) => slugToId.get(annotation.rockOpera.slug))
    .filter((id): id is string => id !== undefined);

  // Seed the lineup editor from the show's current ShowMusician rows.
  const initialLineup = await services.shows.getLineup(show.id);

  return {
    show,
    bands,
    venues,
    tracks,
    footnoteSetlist,
    sameDateShows,
    rockOperas,
    currentRockOperaIds,
    initialLineup,
  };
});

export const action = adminAction(async ({ request, params }) => {
  const { slug } = params;
  const formData = await request.formData();

  const venueId = formData.get("venueId") as string;
  const bandId = formData.get("bandId") as string;

  const data = {
    date: formData.get("date") as string,
    venueId: venueId === "none" ? undefined : venueId,
    bandId: bandId === "none" ? undefined : bandId,
    notes: (formData.get("notes") as string) || null,
    relistenUrl: (formData.get("relistenUrl") as string) || null,
    countForStats: formData.get("countForStats") === "true",
    // Multi-select: every checked id is appended under the same FormData key
    // so `getAll` returns the full selection (empty array = clear all tags).
    rockOperaIds: formData.getAll("rockOperaIds").map(String),
  };

  // Update the show. A date/venue change re-slugs it, so redirect to the new
  // slug (the client navigates to the redirect target) rather than returning
  // the show, which a plain fetch would receive as an HTML document.
  const show = await services.shows.update(slug as string, data);

  return redirect(`/shows/${show.slug}`);
});

export default function EditShow() {
  const { show, bands, tracks, footnoteSetlist, sameDateShows, rockOperas, currentRockOperaIds, initialLineup } =
    useSerializedLoaderData<LoaderData>();
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
        countForStats: show.countForStats ?? true,
        rockOperaIds: currentRockOperaIds,
      });
      setIsLoading(false);
    }
  }, [show, currentRockOperaIds]);

  const handleSubmit = async (data: ShowFormValues) => {
    const loadingToast = toast.loading("Updating show...");

    try {
      const formData = new FormData();
      formData.append("date", data.date);
      formData.append("venueId", data.venueId);
      formData.append("bandId", data.bandId);
      formData.append("notes", data.notes);
      formData.append("relistenUrl", data.relistenUrl);
      formData.append("countForStats", data.countForStats ? "true" : "false");
      for (const id of data.rockOperaIds) {
        formData.append("rockOperaIds", id);
      }

      const response = await fetch(`/shows/${show.slug}/edit`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // The action redirects to the (possibly re-slugged) show URL; fetch
        // follows it, so response.url is the canonical slug. Navigate there
        // instead of the stale loader slug, which 404s on a date/venue change.
        toast.success("Show updated successfully!", { id: loadingToast });
        navigate(new URL(response.url).pathname);
      } else {
        toast.error("Failed to update show. Please try again.", { id: loadingToast });
      }
    } catch (_error) {
      toast.error("An error occurred while updating the show.", { id: loadingToast });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <PageHeader
          title="Edit Show"
          backLink={{ to: `/shows/${show.slug}`, label: "Back to Show" }}
          actions={
            <DeleteEntityButton
              entityId={show.id}
              entityName={show.date}
              entityLabel="show"
              endpoint={`/api/shows/${show.id}`}
              variant="button"
              onDeleted={() => navigate("/shows")}
            />
          }
        />
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <ShowForm
              defaultValues={defaultValues}
              onSubmit={handleSubmit}
              submitLabel="Update Show"
              cancelHref={`/shows/${show.slug}`}
              bands={bands}
              showId={show.id}
              rockOperas={rockOperas}
            />
          </CardContent>
        </Card>

        <ShowLineupManager showId={show.id} initialLineup={initialLineup} />

        {sameDateShows.length >= 2 && (
          <ShowDayOrderManager currentShowId={show.id} date={show.date} initialShows={sameDateShows} />
        )}

        <div className="mt-6">
          <TrackManager showId={show.id} initialTracks={tracks} footnoteSetlist={footnoteSetlist ?? undefined} />
        </div>
      </div>
    </div>
  );
}
