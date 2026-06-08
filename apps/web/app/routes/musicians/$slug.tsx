import type { Instrument, Musician, MusicianAppearanceShow, MusicianPerformance, MusicianSongPlay } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { DateVenueCell } from "~/components/performance/date-venue-cell";
import { ShowDate } from "~/components/show-date";
import { DataTable } from "~/components/ui/data-table";
import { SortableHeader } from "~/components/ui/sortable-header";
import { StatBox } from "~/components/ui/stat-box";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { classifyMusician, DRUMMER_ERAS, isOutsideEra, type MusicianTier } from "~/lib/musicians-constants";
import { services } from "~/server/services";

export const routeParam = "slug";

interface MusicianWithInstrument extends Musician {
  defaultInstrument: Instrument | null;
}

interface ShowRow {
  showId: string;
  slug: string;
  date: string;
  venueName: string;
  venueCity: string | null;
  venueState: string | null;
}

interface LoaderData {
  musician: MusicianWithInstrument;
  tier: MusicianTier;
  stats: { showCount: number; trackCount: number };
  firstShow: MusicianAppearanceShow | null;
  lastShow: MusicianAppearanceShow | null;
  // Empty for core members (counts only); for drummers, shows outside their
  // era; for guests, all shows.
  shows: ShowRow[];
  // All-time songs the musician has played, aggregated. Empty for core members.
  songs: MusicianSongPlay[];
  // One row per individual performance. Empty for core members.
  performances: MusicianPerformance[];
}

export const loader = publicLoader(async ({ params }): Promise<LoaderData> => {
  const slug = params.slug;
  if (!slug) throw notFound();

  const musician = await services.musicians.findBySlug(slug);
  if (!musician) throw notFound();

  const defaultInstrument = musician.defaultInstrumentId
    ? await services.instruments.findById(musician.defaultInstrumentId)
    : null;

  const { showIds, trackCount, firstShow, lastShow } = await services.musicians.findAppearances(musician.id);
  const tier = classifyMusician(slug);

  // Core members appear on essentially every show, so their tables are omitted;
  // only counts render. Drummers and guests get both tables.
  let shows: ShowRow[] = [];
  let songs: MusicianSongPlay[] = [];
  let performances: MusicianPerformance[] = [];
  if (tier !== "core" && showIds.length > 0) {
    const [setlists, songsPlayed, performancesPlayed] = await Promise.all([
      services.setlists.findManyByShowIds(showIds, { sort: [{ field: "date", direction: "desc" }] }),
      services.musicians.findSongsPlayed(musician.id),
      services.musicians.findPerformances(musician.id),
    ]);
    // A drummer's everyday shows are implied by their era; only out-of-era
    // appearances (sit-ins before or after their tenure) are notable, so every
    // table is filtered to out-of-era for drummers and left whole otherwise.
    const era = tier === "drummer" ? DRUMMER_ERAS[slug] : undefined;
    const visibleSetlists = era
      ? setlists.filter((setlist) => isOutsideEra(new Date(setlist.show.date), era))
      : setlists;
    performances = era
      ? performancesPlayed.filter((performance) => isOutsideEra(new Date(performance.date), era))
      : performancesPlayed;
    songs = era ? aggregatePerformances(performances) : songsPlayed;
    shows = visibleSetlists.map((setlist) => ({
      showId: setlist.show.id,
      slug: setlist.show.slug,
      date: setlist.show.date,
      venueName: setlist.venue.name,
      venueCity: setlist.venue.city,
      venueState: setlist.venue.state,
    }));
  }

  return {
    musician: { ...musician, defaultInstrument },
    tier,
    stats: { showCount: showIds.length, trackCount },
    firstShow,
    lastShow,
    shows,
    songs,
    performances,
  };
});

/** Roll up performances into the aggregated by-song shape (used for drummers,
 *  whose tables are era-scoped so the all-time aggregate doesn't apply). */
function aggregatePerformances(performances: MusicianPerformance[]): MusicianSongPlay[] {
  const bySong = new Map<string, MusicianSongPlay>();
  // performances arrive newest-first; walk oldest-first so first/last land right.
  for (const performance of [...performances].reverse()) {
    const show: MusicianAppearanceShow = {
      date: performance.date,
      slug: performance.showSlug,
      venue: performance.venue,
    };
    const existing = bySong.get(performance.songSlug);
    if (existing) {
      existing.playCount += 1;
      existing.lastShow = show;
    } else {
      bySong.set(performance.songSlug, {
        songId: performance.songSlug,
        title: performance.songTitle,
        slug: performance.songSlug,
        playCount: 1,
        firstShow: show,
        lastShow: show,
      });
    }
  }
  return [...bySong.values()].sort((a, b) => a.title.localeCompare(b.title));
}

/** Venue line under a first/last performance card, matching the song page. */
function venueSublabel(venue: MusicianAppearanceShow["venue"]): string | undefined {
  if (!venue?.name) return undefined;
  return [venue.name, venue.city, venue.state].filter(Boolean).join(", ");
}

/** A first/last performance stat card linking to its show, like the song page. */
function PerformanceStatBox({ label, show }: { label: string; show: MusicianAppearanceShow | null }) {
  const card = (
    <StatBox
      label={label}
      value={show ? <ShowDate date={show.date} /> : "Never"}
      sublabel2={show ? venueSublabel(show.venue) : undefined}
    />
  );
  return show?.slug ? (
    <Link to={`/shows/${show.slug}`} className="block">
      {card}
    </Link>
  ) : (
    card
  );
}

const showColumns: ColumnDef<ShowRow>[] = [
  {
    accessorKey: "date",
    meta: { weight: 1 },
    header: ({ column }) => <SortableHeader column={column} label="Date" />,
    cell: ({ row }) => (
      <Link to={`/shows/${row.original.slug}`} className="text-brand-primary hover:text-brand-secondary block">
        <DateVenueCell
          date={<ShowDate date={row.original.date} />}
          venue={{ name: row.original.venueName, city: row.original.venueCity, state: row.original.venueState }}
        />
      </Link>
    ),
  },
];

const songColumns: ColumnDef<MusicianSongPlay>[] = [
  {
    accessorKey: "title",
    meta: { weight: 2 },
    header: ({ column }) => <SortableHeader column={column} label="Song" />,
    cell: ({ row }) => (
      <Link to={`/songs/${row.original.slug}`} className="text-brand-primary hover:text-brand-secondary font-medium">
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "playCount",
    meta: { fixedWidth: "5rem", cellClassName: "tabular-nums" },
    header: ({ column }) => <SortableHeader column={column} label="Times" />,
  },
  {
    id: "firstShowDate",
    accessorFn: (row) => row.firstShow?.date ?? "",
    meta: { weight: 1, hideOnMobile: true },
    header: ({ column }) => <SortableHeader column={column} label="First" />,
    cell: ({ row }) => <SongDateVenueCell show={row.original.firstShow} />,
  },
  {
    id: "lastShowDate",
    accessorFn: (row) => row.lastShow?.date ?? "",
    meta: { weight: 1, hideOnMobile: true },
    header: ({ column }) => <SortableHeader column={column} label="Last" />,
    cell: ({ row }) => <SongDateVenueCell show={row.original.lastShow} />,
  },
];

const performanceColumns: ColumnDef<MusicianPerformance>[] = [
  {
    accessorKey: "date",
    meta: { weight: 1 },
    header: ({ column }) => <SortableHeader column={column} label="Date" />,
    cell: ({ row }) =>
      row.original.showSlug ? (
        <Link to={`/shows/${row.original.showSlug}`} className="text-brand-primary hover:text-brand-secondary block">
          <DateVenueCell date={<ShowDate date={row.original.date} />} venue={row.original.venue ?? undefined} />
        </Link>
      ) : (
        <DateVenueCell date={<ShowDate date={row.original.date} />} venue={row.original.venue ?? undefined} />
      ),
  },
  {
    accessorKey: "songTitle",
    meta: { weight: 1 },
    header: ({ column }) => <SortableHeader column={column} label="Song" />,
    cell: ({ row }) => (
      <Link
        to={`/songs/${row.original.songSlug}`}
        className="text-brand-primary hover:text-brand-secondary font-medium"
      >
        {row.original.songTitle}
      </Link>
    ),
  },
];

/** Date + venue cell for a song's first/last performance, linked to the show. */
function SongDateVenueCell({ show }: { show: MusicianAppearanceShow | null }) {
  if (!show) return <span className="text-content-text-tertiary">-</span>;
  const cell = (
    <DateVenueCell
      date={<ShowDate date={show.date} />}
      venue={show.venue ? { name: show.venue.name, city: show.venue.city, state: show.venue.state } : undefined}
    />
  );
  return show.slug ? (
    <Link to={`/shows/${show.slug}`} className="text-brand-primary hover:text-brand-secondary block">
      {cell}
    </Link>
  ) : (
    cell
  );
}

export default function MusicianPage() {
  const { musician, tier, stats, firstShow, lastShow, shows, songs, performances } =
    useSerializedLoaderData<LoaderData>();

  const showsHeading = tier === "drummer" ? "Shows Outside Their Era" : "Shows";

  return (
    <div>
      <div className="space-y-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-content-text-primary">{musician.name}</h1>
          <div className="flex flex-wrap items-center gap-x-3 text-content-text-secondary mt-1">
            {musician.defaultInstrument && <span className="lowercase">{musician.defaultInstrument.name}</span>}
            {musician.knownFrom && <span className="text-content-text-tertiary">Known from {musician.knownFrom}</span>}
          </div>
        </div>

        <div className="flex justify-start">
          <Link
            to="/musicians"
            className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to musicians</span>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox label="Shows Played" value={stats.showCount} />
          <StatBox label="Songs Played" value={stats.trackCount} />
          <PerformanceStatBox label="First Performance" show={firstShow} />
          <PerformanceStatBox label="Last Performance" show={lastShow} />
        </dl>

        {tier === "core" ? (
          <div className="glass-content rounded-lg p-6 text-content-text-secondary">
            Core member: appears on essentially every show. The full shows and songs tables are omitted.
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-content-text-primary">{showsHeading}</h2>
              <DataTable
                columns={showColumns}
                data={shows}
                getRowId={(show) => show.showId}
                initialSorting={[{ id: "date", desc: true }]}
                hideSearch
              />
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-content-text-primary">Songs</h2>
              <Tabs defaultValue="by-song">
                <TabsList>
                  <TabsTrigger value="by-song">By Song</TabsTrigger>
                  <TabsTrigger value="all-performances">All Performances</TabsTrigger>
                </TabsList>
                <TabsContent value="by-song" className="mt-4">
                  <DataTable
                    columns={songColumns}
                    data={songs}
                    getRowId={(song) => song.songId}
                    searchKey="title"
                    searchPlaceholder="Search songs..."
                    initialSorting={[{ id: "playCount", desc: true }]}
                  />
                </TabsContent>
                <TabsContent value="all-performances" className="mt-4">
                  <DataTable
                    columns={performanceColumns}
                    data={performances}
                    getRowId={(performance) => performance.trackId}
                    searchKey="songTitle"
                    searchPlaceholder="Search songs..."
                    initialSorting={[{ id: "date", desc: true }]}
                  />
                </TabsContent>
              </Tabs>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
