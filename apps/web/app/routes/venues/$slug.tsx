import type { Setlist, Venue } from "@bip/domain";
import type { DehydratedState } from "@tanstack/react-query";
import { CalendarDays, Edit, MapPin, Ticket } from "lucide-react";
import { AdminOnly } from "~/components/admin/admin-only";
import { SetlistList } from "~/components/setlist/setlist-list";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { ShowDate } from "~/components/show-date";
import { cardVariants } from "~/components/ui/card";
import { LinkButton } from "~/components/ui/link-button";
import { PageHeader } from "~/components/ui/page-header";
import { StatBox } from "~/components/ui/stat-box";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { showUserDataQueryKey } from "~/lib/query-keys";
import { createPrefetchClient, dehydrateAndClear } from "~/lib/query-prefetch";
import { getVenueMeta, getVenueStructuredData } from "~/lib/seo";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData } from "~/server/show-user-data";

export const routeParam = "slug";

interface LoaderData {
  venue: Venue;
  setlists: Setlist[];
  stats: {
    totalShows: number;
    firstShow: Date | null;
    lastShow: Date | null;
    yearsPlayed: number[];
  };
  externalSources: Record<string, ShowExternalSources>;
  dehydratedState: DehydratedState;
}

export const loader = publicLoader(async ({ params, context }): Promise<LoaderData> => {
  const slug = params.slug;
  if (!slug) throw new Error("Slug is required");

  const venue = await services.venues.findBySlug(slug);
  if (!venue) throw new Error("Venue not found");

  // Fetch setlists for this venue
  const setlists = await services.setlists.findMany({
    filters: { venueId: venue.id },
    sort: [{ field: "date", direction: "desc" }],
  });

  // Calculate stats
  const showDates = setlists.map((setlist) => setlist.show.date);
  const yearsPlayed = [...new Set(showDates.map((date) => new Date(date).getFullYear()))].sort((a, b) => b - a);

  const stats = {
    totalShows: setlists.length,
    firstShow: showDates.length ? new Date(Math.min(...showDates.map((d) => new Date(d).getTime()))) : null,
    lastShow: showDates.length ? new Date(Math.max(...showDates.map((d) => new Date(d).getTime()))) : null,
    yearsPlayed,
  };

  const showIds = setlists.map((setlist) => setlist.show.id);
  const externalSources = await computeShowExternalSources(setlists.map((s) => s.show));

  const queryClient = createPrefetchClient();
  await queryClient.prefetchQuery({
    queryKey: showUserDataQueryKey(showIds),
    queryFn: () => computeShowUserData(context, showIds),
  });

  return { venue, setlists, stats, externalSources, dehydratedState: dehydrateAndClear(queryClient) };
});

export function meta({ data }: { data: LoaderData }) {
  return getVenueMeta({
    ...data.venue,
    showCount: data.stats.totalShows,
    firstShowYear: data.stats.firstShow ? new Date(data.stats.firstShow).getFullYear() : undefined,
    lastShowYear: data.stats.lastShow ? new Date(data.stats.lastShow).getFullYear() : undefined,
  });
}

export default function VenuePage() {
  const { venue, setlists, stats, externalSources } = useSerializedLoaderData<LoaderData>();

  return (
    <div>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getVenueStructuredData(venue),
        }}
      />

      <div className="space-y-2 mb-6">
        <PageHeader
          title={venue.name}
          backLink={{ to: "/venues", label: "All Venues" }}
          actions={
            <AdminOnly>
              <LinkButton to={`/venues/${venue.slug}/edit`} icon={Edit} intent="secondary" iconOnlyOnMobile>
                Edit Venue
              </LinkButton>
            </AdminOnly>
          }
        />
        <div className="flex items-center justify-center text-content-text-secondary">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{[venue.city, venue.state, venue.country].filter(Boolean).join(", ")}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Stats Grid */}
        <dl className="grid grid-cols-2 lg:grid-cols-4 short:!grid-cols-4 gap-4 short:!gap-2">
          <StatBox icon={<Ticket className="h-4 w-4" />} label="Total Shows" value={stats.totalShows} />
          <StatBox
            icon={<CalendarDays className="h-4 w-4" />}
            label="First Show"
            value={stats.firstShow ? <ShowDate date={stats.firstShow} /> : "—"}
          />
          <StatBox
            icon={<CalendarDays className="h-4 w-4" />}
            label="Last Show"
            value={stats.lastShow ? <ShowDate date={stats.lastShow} /> : "—"}
          />
          <StatBox
            icon={<CalendarDays className="h-4 w-4" />}
            label="Years Played"
            value={stats.yearsPlayed.length}
            sublabel={stats.yearsPlayed.join(", ")}
          />
        </dl>

        {/* Setlists */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-content-text-primary mb-4">Shows at this Venue</h2>
          <SetlistList
            setlists={setlists}
            externalSources={externalSources}
            empty={
              <div
                className={cardVariants({
                  variant: "panel",
                  className: "rounded-lg p-6 text-center text-content-text-secondary",
                })}
              >
                No shows found for this venue.
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
