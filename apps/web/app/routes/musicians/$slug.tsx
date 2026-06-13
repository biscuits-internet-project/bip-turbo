import type { Instrument, Musician, MusicianAppearanceShow, Song, SongPagePerformance } from "@bip/domain";
import { CacheKeys } from "@bip/domain/cache-keys";
import { type DehydratedState, dehydrate } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { DateVenueCell } from "~/components/performance/date-venue-cell";
import { ShowDate } from "~/components/show-date";
import { FilteredSongsTable } from "~/components/song/filtered-songs-table";
import { DataTable } from "~/components/ui/data-table";
import { LinkButton } from "~/components/ui/link-button";
import { PageHeader } from "~/components/ui/page-header";
import { SortableHeader } from "~/components/ui/sortable-header";
import { StatBox } from "~/components/ui/stat-box";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { FilteredSongPerformanceTable } from "~/lib/filtered-song-performance-table";
import {
  classifyMusician,
  DRUMMER_ERAS,
  isOutsideEra,
  type MusicianTier,
  musicianTablePreset,
} from "~/lib/musicians-constants";
import { showUserDataQueryKey, trackUserRatingsQueryKey } from "~/lib/query-keys";
import { createPrefetchClient } from "~/lib/query-prefetch";
import { getMusicianMeta } from "~/lib/seo";
import { fetchFilteredSongs } from "~/lib/song-utilities";
import { services } from "~/server/services";
import { computeShowUserData } from "~/server/show-user-data";
import { computeTrackUserRatings } from "~/server/track-user-ratings";

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

/** The cached, non-user-scoped half of the profile payload. */
interface MusicianPageData {
  musician: MusicianWithInstrument;
  tier: MusicianTier;
  stats: { showCount: number; songCount: number };
  firstShow: MusicianAppearanceShow | null;
  lastShow: MusicianAppearanceShow | null;
  // Empty for core members; for drummers, shows outside their era; else all shows.
  shows: ShowRow[];
  // Songs the musician played (By Song table base list), scoped through the
  // /songs pipeline. Empty for core members.
  songs: Song[];
  // One row per performance (All Performances table base list). Empty for core.
  performances: SongPagePerformance[];
  // The linked author (null when none) and the songs they wrote, for the
  // Songs Written explorer pinned to that author.
  authorId: string | null;
  songsWritten: Song[];
}

type LoaderData = MusicianPageData & { dehydratedState: DehydratedState };

export const loader = publicLoader(async ({ params, context }): Promise<LoaderData> => {
  const slug = params.slug;
  if (!slug) throw notFound();

  const musician = await services.musicians.findBySlug(slug);
  if (!musician) throw notFound();

  // Cache the heavy, non-user-scoped half of the profile by slug (appearances,
  // songs played/written, performances, setlists).
  const data = await services.cache.getOrSet(
    CacheKeys.musicians.page(slug),
    async (): Promise<MusicianPageData> => {
      const defaultInstrument = musician.defaultInstrumentId
        ? await services.instruments.findById(musician.defaultInstrumentId)
        : null;

      const { showIds, songCount, firstShow, lastShow } = await services.musicians.findAppearances(musician.id);
      const tier = classifyMusician(slug);
      // A drummer's everyday shows are implied by their era; only out-of-era
      // appearances (sit-ins before/after their tenure) are notable, so every
      // table is scoped to exclude their era window.
      const era = tier === "drummer" ? DRUMMER_ERAS[slug] : undefined;

      // Songs this musician wrote = songs by their linked author, via the same
      // enriched /songs pipeline so the table renders identically.
      let songsWritten: Song[] = [];
      if (musician.authorId) {
        const url = new URL(`https://bip.local/?author=${musician.authorId}`);
        songsWritten = await fetchFilteredSongs(url, context);
      }

      // Core members appear on essentially every show, so their tables are
      // omitted; only counts render.
      let songs: Song[] = [];
      let performances: SongPagePerformance[] = [];
      let shows: ShowRow[] = [];
      if (tier !== "core" && showIds.length > 0) {
        const songsUrl = new URL(`https://bip.local/?musician=${slug}`);
        if (era?.startDate) songsUrl.searchParams.set("excludeStart", era.startDate.toISOString().slice(0, 10));
        if (era?.endDate) songsUrl.searchParams.set("excludeEnd", era.endDate.toISOString().slice(0, 10));

        const [songsPlayed, view, setlists] = await Promise.all([
          fetchFilteredSongs(songsUrl, context),
          services.songPageComposer.buildSongPerformances({
            playedByMusicianId: musician.id,
            ...(era?.startDate ? { excludeRangeStart: era.startDate } : {}),
            ...(era?.endDate ? { excludeRangeEnd: era.endDate } : {}),
          }),
          services.setlists.findManyByShowIds(showIds, { sort: [{ field: "date", direction: "desc" }] }),
        ]);

        songs = songsPlayed;
        performances = view.performances;
        const visibleSetlists = era
          ? setlists.filter((setlist) => isOutsideEra(new Date(setlist.show.date), era))
          : setlists;
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
        stats: { showCount: showIds.length, songCount },
        firstShow,
        lastShow,
        shows,
        songs,
        performances,
        authorId: musician.authorId,
        songsWritten,
      };
    },
    { ttl: 86400 },
  );

  // Per-user track ratings + show attendance for the All Performances table.
  // Computed every request OUTSIDE the slug cache — caching it under
  // musician:<slug> would leak one user's data to everyone.
  const trackIds = data.performances.map((performance) => performance.trackId);
  const showIds = [...new Set(data.performances.map((performance) => performance.show.id))];
  const queryClient = createPrefetchClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: trackUserRatingsQueryKey(trackIds),
      queryFn: () => computeTrackUserRatings(context, trackIds),
    }),
    queryClient.prefetchQuery({
      queryKey: showUserDataQueryKey(showIds),
      queryFn: () => computeShowUserData(context, showIds),
    }),
  ]);

  return { ...data, dehydratedState: dehydrate(queryClient) };
});

export function meta({ data }: { data?: LoaderData }) {
  if (!data) return [];
  return getMusicianMeta({
    name: data.musician.name,
    slug: data.musician.slug,
    knownFrom: data.musician.knownFrom,
    defaultInstrumentName: data.musician.defaultInstrument?.name ?? null,
    showCount: data.stats.showCount,
  });
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

export default function MusicianPage() {
  const { musician, tier, stats, firstShow, lastShow, shows, songs, performances, authorId, songsWritten } =
    useSerializedLoaderData<LoaderData>();

  // Drummers' tables are scoped to out-of-era plays, so both section titles
  // carry that framing.
  const songsHeading = tier === "drummer" ? "Songs Outside Their Era" : "Songs";
  const showsHeading = tier === "drummer" ? "Shows Outside Their Era" : "Shows";
  const songsWrittenPreset = useMemo(() => (authorId ? { author: authorId } : undefined), [authorId]);
  // Both song tables pin to this musician; drummers also exclude their era.
  const musicianPreset = useMemo(() => musicianTablePreset(musician.slug, tier), [musician.slug, tier]);
  const hasSongs = songs.length > 0 || performances.length > 0;

  return (
    <div>
      <div className="space-y-2 mb-6">
        <PageHeader
          title={musician.name}
          backLink={{ to: "/musicians", label: "All Musicians" }}
          actions={
            <AdminOnly>
              <LinkButton
                to={`/admin/musicians/${musician.slug}/edit`}
                icon={Pencil}
                intent="secondary"
                iconOnlyOnMobile
              >
                Edit Musician
              </LinkButton>
            </AdminOnly>
          }
        />
        <div className="flex flex-wrap items-center justify-center gap-x-3 text-content-text-secondary">
          {musician.defaultInstrument && <span className="lowercase">{musician.defaultInstrument.name}</span>}
          {musician.knownFrom && <span className="text-content-text-tertiary">Known from {musician.knownFrom}</span>}
        </div>
      </div>

      <div className="space-y-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox label="Shows Played" value={stats.showCount} />
          <StatBox label="Songs Played" value={stats.songCount} />
          <PerformanceStatBox label="First Performance" show={firstShow} />
          <PerformanceStatBox label="Last Performance" show={lastShow} />
        </dl>

        {authorId && songsWritten.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-content-text-primary">Songs Written</h2>
            <FilteredSongsTable songs={songsWritten} presetFilters={songsWrittenPreset} />
          </section>
        )}

        {tier === "core" ? (
          <div className="glass-content rounded-lg p-6 text-content-text-secondary">
            Core member: appears on essentially every show. The full shows and songs tables are omitted.
          </div>
        ) : (
          <>
            {hasSongs && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold text-content-text-primary">{songsHeading}</h2>
                <Tabs defaultValue="by-song">
                  <TabsList>
                    <TabsTrigger value="by-song">Song Statistics</TabsTrigger>
                    <TabsTrigger value="all-performances">All Song Performances</TabsTrigger>
                  </TabsList>
                  <TabsContent value="by-song" className="mt-4">
                    <FilteredSongsTable songs={songs} presetFilters={musicianPreset} filteredAsPrimary />
                  </TabsContent>
                  <TabsContent value="all-performances" className="mt-4">
                    <FilteredSongPerformanceTable performances={performances} presetFilters={musicianPreset} />
                  </TabsContent>
                </Tabs>
              </section>
            )}

            {shows.length > 0 && (
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
