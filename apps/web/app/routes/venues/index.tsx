import { Globe, MapPin, Plus, Ticket } from "lucide-react";
import { useMemo, useState } from "react";
import { useRevalidator } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { DataTable } from "~/components/ui/data-table";
import { Dropdown } from "~/components/ui/dropdown";
import { LinkButton } from "~/components/ui/link-button";
import { PageHeader } from "~/components/ui/page-header";
import { StatBox } from "~/components/ui/stat-box";
import { getVenuesColumns } from "~/components/venue/venues-columns";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getVenuesMeta } from "~/lib/seo";
import { matchesStateFilter } from "~/lib/venue-filters";
import { buildVenueRows, type VenueRow } from "~/lib/venue-rows";
import { services } from "~/server/services";

export function meta() {
  return getVenuesMeta();
}

interface LoaderData {
  rows: VenueRow[];
  isAdmin: boolean;
  stats: {
    totalVenues: number;
    totalShows: number;
    totalStates: number;
    internationalCount: number;
  };
  states: string[];
}

export const loader = publicLoader(async ({ context }): Promise<LoaderData> => {
  const isAdmin = context.currentUser?.isAdmin ?? false;
  const [venues, aggregates] = await Promise.all([
    services.venues.findMany({ sort: [{ field: "name", direction: "asc" }] }),
    services.venues.getShowAggregates(),
  ]);

  // buildVenueRows returns every venue; zero-show ones get zeroed stats. The
  // stats and the public table count only venues with shows — admins also see
  // the zero-show rows so they can delete those stale entries.
  const allRows = buildVenueRows(venues, aggregates);
  const withShows = allRows.filter((row) => row.showCount > 0);

  const states = [
    ...new Set(withShows.map((row) => row.state).filter((state): state is string => Boolean(state))),
  ].sort();
  const internationalCount = withShows.filter((row) => matchesStateFilter(row, "international")).length;

  return {
    rows: isAdmin ? allRows : withShows,
    isAdmin,
    stats: {
      totalVenues: withShows.length,
      totalShows: withShows.reduce((total, row) => total + row.showCount, 0),
      totalStates: states.length,
      internationalCount,
    },
    states,
  };
});

// Radix Select forbids an empty-string item value, so "All States" uses a
// sentinel that maps back to the "" (match-everything) filter value.
const ALL_STATES = "all";

export default function VenuesPage() {
  const { rows, stats, states, isAdmin } = useSerializedLoaderData<LoaderData>();
  const { revalidate } = useRevalidator();
  const [stateFilter, setStateFilter] = useState("");

  const columns = useMemo(() => getVenuesColumns({ isAdmin, onDeleted: revalidate }), [isAdmin, revalidate]);
  const filteredRows = useMemo(() => rows.filter((row) => matchesStateFilter(row, stateFilter)), [rows, stateFilter]);

  const stateOptions = useMemo(
    () => [
      { value: ALL_STATES, label: "All States / Countries" },
      { value: "international", label: "International" },
      ...states.map((state) => ({ value: state, label: state })),
    ],
    [states],
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="VENUES"
        actions={
          <AdminOnly>
            <LinkButton to="/venues/new" icon={Plus} iconOnlyOnMobile>
              Create Venue
            </LinkButton>
          </AdminOnly>
        }
      />

      <dl className="grid grid-cols-2 lg:grid-cols-4 short:!grid-cols-4 gap-4 short:!gap-2">
        <StatBox icon={<MapPin className="h-4 w-4" />} label="Total Venues" value={stats.totalVenues} />
        <StatBox icon={<Ticket className="h-4 w-4" />} label="Total Shows" value={stats.totalShows} />
        <StatBox icon={<MapPin className="h-4 w-4" />} label="States" value={stats.totalStates} />
        <StatBox icon={<Globe className="h-4 w-4" />} label="International Venues" value={stats.internationalCount} />
      </dl>

      <DataTable
        columns={columns}
        data={filteredRows}
        getRowId={(row) => row.id}
        searchKey="name"
        searchPlaceholder="Search venues..."
        initialSorting={[{ id: "shows", desc: true }]}
        filterComponent={
          <Dropdown
            size="compact"
            value={stateFilter || ALL_STATES}
            onValueChange={(value) => setStateFilter(value === ALL_STATES ? "" : value)}
            options={stateOptions}
            ariaLabel="Filter by state"
            className="w-[200px]"
          />
        }
      />
    </div>
  );
}
