import type { Setlist, Venue } from "@bip/domain";
import { format } from "date-fns";
import { ArrowLeft, CalendarDays, Edit, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { SetlistList } from "~/components/setlist/setlist-list";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getVenueMeta, getVenueStructuredData } from "~/lib/seo";
import { services } from "~/server/services";
import { computeShowExternalSources } from "~/server/show-external-sources";
import { computeShowUserData, type ShowUserDataResponse } from "~/server/show-user-data";

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
  initialUserData: ShowUserDataResponse;
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
  const initialUserData = await computeShowUserData(context, showIds);

  return { venue, setlists, stats, externalSources, initialUserData };
});

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null;
  sublabel?: string;
}

function StatBox({ icon, label, value, sublabel }: StatBoxProps) {
  return (
    <Card className="glass-content">
      <CardContent className="p-6">
        <div className="flex items-center space-x-2 text-content-text-secondary mb-2">
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-2xl font-bold text-content-text-primary">{value || "—"}</div>
        {sublabel && <div className="text-xs text-content-text-tertiary mt-1">{sublabel}</div>}
      </CardContent>
    </Card>
  );
}

export function meta({ data }: { data: LoaderData }) {
  return getVenueMeta({
    ...data.venue,
    showCount: data.stats.totalShows,
    firstShowYear: data.stats.firstShow ? new Date(data.stats.firstShow).getFullYear() : undefined,
    lastShowYear: data.stats.lastShow ? new Date(data.stats.lastShow).getFullYear() : undefined,
  });
}

export default function VenuePage() {
  const { venue, setlists, stats, externalSources, initialUserData } = useSerializedLoaderData<LoaderData>();

  return (
    <div>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getVenueStructuredData(venue),
        }}
      />

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-content-text-primary">{venue.name}</h1>
            <div className="flex items-center text-content-text-secondary mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{[venue.city, venue.state, venue.country].filter(Boolean).join(", ")}</span>
            </div>
          </div>

          <AdminOnly>
            <Button asChild size="sm" className="btn-secondary">
              <Link to={`/venues/${venue.slug}/edit`} className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                <span>Edit Venue</span>
              </Link>
            </Button>
          </AdminOnly>
        </div>

        {/* Subtle back link */}
        <div className="flex justify-start">
          <Link
            to="/venues"
            className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to venues</span>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Stats Grid */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox icon={<Ticket className="h-4 w-4" />} label="Total Shows" value={stats.totalShows} />
          <StatBox
            icon={<CalendarDays className="h-4 w-4" />}
            label="First Show"
            value={stats.firstShow ? format(stats.firstShow, "MMM d, yyyy") : null}
          />
          <StatBox
            icon={<CalendarDays className="h-4 w-4" />}
            label="Last Show"
            value={stats.lastShow ? format(stats.lastShow, "MMM d, yyyy") : null}
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
            initialUserData={initialUserData}
            empty={
              <div className="glass-content rounded-lg p-6 text-center text-content-text-secondary">
                No shows found for this venue.
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
