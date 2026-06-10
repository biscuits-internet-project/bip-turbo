import { compareByShowDate, type SongPageView } from "@bip/domain";
import { type DehydratedState, dehydrate } from "@tanstack/react-query";
import { BarChart3, FileTextIcon, Flame, GuitarIcon, History, ListMusic, Pencil } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { PerformanceTable } from "~/components/performance";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { RatingComponent } from "~/components/rating";
import { ShowDate } from "~/components/show-date";
import { YearlyPlayChart } from "~/components/song/yearly-play-chart";
import { isNoteworthy } from "~/components/track/noteworthy-marker";
import { LinkButton } from "~/components/ui/link-button";
import { PageHeader } from "~/components/ui/page-header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { StatBox } from "~/components/ui/stat-box";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { searchPerformance, usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { formatVenueLocation } from "~/lib/format-venue";
import { pickGapTier } from "~/lib/gap-tier";
import { showUserDataQueryKey, trackUserRatingsQueryKey } from "~/lib/query-keys";
import { createPrefetchClient } from "~/lib/query-prefetch";
import { getSongMeta, getSongStructuredData } from "~/lib/seo";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";
import { computeShowUserData } from "~/server/show-user-data";
import { computeTrackUserRatings } from "~/server/track-user-ratings";

type LoaderData = SongPageView & { dehydratedState: DehydratedState };

export const loader = publicLoader(async ({ params, context }: LoaderFunctionArgs): Promise<LoaderData> => {
  const slug = params.slug;
  if (!slug) throw new Response("Not Found", { status: 404 });

  const view = await services.songPageComposer.build(slug);

  const trackIds = view.performances.map((p) => p.trackId);
  const showIds = [...new Set(view.performances.map((p) => p.show.id))];
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

  return { ...view, dehydratedState: dehydrate(queryClient) };
});

function ReviewNote({ notes }: { notes: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const lines = notes.split("\n");
  const shouldTruncate = lines.length > 6;

  const displayText = isExpanded || !shouldTruncate ? notes : lines.slice(0, 6).join("\n");

  const isTruncated = shouldTruncate && !isExpanded && displayText.length < notes.length;

  return (
    <div className="mt-2 pt-2 border-t border-glass-border/30">
      <div className="text-base text-content-text-tertiary leading-relaxed">
        {displayText}
        {isTruncated && (
          <>
            <span>...</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="text-brand-primary hover:text-brand-secondary ml-1 underline"
            >
              read more
            </button>
          </>
        )}
        {shouldTruncate && isExpanded && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="text-brand-primary hover:text-brand-secondary ml-2 underline"
          >
            show less
          </button>
        )}
      </div>
    </div>
  );
}

export function meta({ data }: { data: LoaderData }) {
  return getSongMeta({
    ...data.song,
    timesPlayed: data.song.timesPlayed,
  });
}

/**
 * Builds the "Last Played" sublabel — "last show" when the song was played
 * at the most recent show, otherwise "N show(s) ago" with correct
 * pluralization. The backend's `showsSinceLastPlayed` is a strict count of
 * shows played AFTER this song's last performance, so 0 = last show.
 *
 * Colors the text by tier: amber when the current gap exceeds this song's
 * average frequency, red when it exceeds the longest gap on record.
 */
function lastPlayedSublabel(
  showsSince: number | null | undefined,
  average: number | null,
  longest: number | null,
): ReactNode | undefined {
  if (showsSince === null || showsSince === undefined) return undefined;
  if (showsSince === 0) return "last show";

  const text = showsSince === 1 ? "1 show ago" : `${showsSince} shows ago`;
  const tier = pickGapTier({ showsSince, average, longest });
  const tierClass =
    tier === "danger" ? "text-red-500 font-semibold" : tier === "warn" ? "text-amber-500 font-medium" : "";

  return tierClass ? <span className={tierClass}>{text}</span> : text;
}

/**
 * "Venue Name, City, State[, Country]" line under the First/Last Played stat
 * boxes. International venues (no state) fall back to the country via
 * formatVenueLocation so the line doesn't dangle a comma; a bare name with no
 * location stays just the name.
 */
function venueSublabel(venue: { name: string; city?: string; state?: string; country?: string }): string {
  const location = formatVenueLocation(venue);
  return location ? `${venue.name}, ${location}` : venue.name;
}

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return percentFormatter.format(value);
}

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
}

function formatAvgMedianGap(avg: number | null | undefined, median: number | null | undefined): string {
  const fmt = (v: number | null | undefined) => (v === null || v === undefined ? "—" : v.toFixed(1));
  if ((avg === null || avg === undefined) && (median === null || median === undefined)) return "—";
  return `${fmt(avg)} / ${fmt(median)}`;
}

// Allowlist used to validate the `:tab` URL segment so a typo'd path
// like /songs/triumph/foo falls back to the default tab instead of
// rendering nothing. Order is informational only.
const VALID_TABS = ["performances", "jam-charts", "all-timers", "stats", "history", "lyrics", "guitar-tabs"] as const;
type TabValue = (typeof VALID_TABS)[number];

export default function SongPage() {
  const { song, performances: allPerformances, showsByYear } = useSerializedLoaderData<LoaderData>();
  const params = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  // The :tab segment is the source of truth — Tabs renders whatever
  // the URL says, and clicking a tab navigates so back/forward and
  // shareable links work.
  const activeTab: TabValue =
    params.tab && (VALID_TABS as readonly string[]).includes(params.tab) ? (params.tab as TabValue) : "performances";
  const {
    filteredData: filteredPerformances,
    isLoading,
    selectedTimeRange,
    activeToggleSet,
    hasActiveFilters,
    searchText,
    setSearchText,
    updateFilter,
    toggleFilter,
    clearFilters,
  } = usePerformancePageFilters({
    initialData: allPerformances,
    apiUrl: "/api/songs/performances",
    extraParams: useMemo(() => ({ slug: song.slug }), [song.slug]),
    searchFilter: searchPerformance,
  });
  const handleTabChange = (value: string) => {
    clearFilters();
    // "performances" is the default; navigate to bare /songs/:slug so
    // the URL doesn't carry a redundant /performances suffix.
    navigate(value === "performances" ? `/songs/${song.slug}` : `/songs/${song.slug}/${value}`);
  };

  const hasAllTimers = useMemo(() => allPerformances.some((p) => p.allTimer), [allPerformances]);
  const filteredAllTimers = useMemo(() => filteredPerformances.filter((p) => p.allTimer), [filteredPerformances]);
  // Jam Charts: all-timer OR any track with a curated note (non-empty).
  // Superset of all-timers; the tab only appears when the song has at
  // least one such performance.
  const hasJamCharts = useMemo(() => allPerformances.some(isNoteworthy), [allPerformances]);
  const filteredJamCharts = useMemo(() => filteredPerformances.filter(isNoteworthy), [filteredPerformances]);
  // Server-narrowing filter active = any UI filter that affects the
  // performance set the server returned. Excludes `searchText` (client-only).
  // Used to render the Filtered Gap column in the performances table.
  const hasServerNarrowingFilter = selectedTimeRange !== "all" || activeToggleSet.size > 0;
  // Tab-specific noteworthy-toggle suppression: when the active tab is
  // already scoped to "all-timers" or "jam-charts", the matching chip
  // (and the chip that strictly subsets it) shouldn't reappear in the
  // filter row because toggling it would either be a no-op or
  // contradict the tab's scope. Mirrors how the global pages hide
  // those chips on their own routes.
  const renderFilterContent = (overrides?: { hideAllTimerToggle?: boolean; hideJamChartToggle?: boolean }) => (
    <PerformanceFilterControls
      selectedTimeRange={selectedTimeRange}
      activeToggleSet={activeToggleSet}
      updateFilter={updateFilter}
      toggleFilter={toggleFilter}
      clearFilters={clearFilters}
      searchValue={searchText}
      onSearchChange={setSearchText}
      hasActiveFilters={hasActiveFilters}
      showAllTimerToggle={!overrides?.hideAllTimerToggle}
      showJamChartToggle={!overrides?.hideJamChartToggle}
    />
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: getSongStructuredData({
            ...song,
            timesPlayed: song.timesPlayed,
          }),
        }}
      />

      <div className="space-y-2">
        <PageHeader
          title={song.title}
          backLink={{ to: "/songs", label: "All Songs" }}
          actions={
            <AdminOnly>
              <LinkButton to={`/songs/${song.slug}/edit`} icon={Pencil} intent="secondary" iconOnlyOnMobile>
                Edit Song
              </LinkButton>
            </AdminOnly>
          }
        />
        {(song.authorName || song.kind) && (
          <div className="flex flex-wrap items-baseline justify-center gap-x-3 text-content-text-secondary text-lg">
            {song.authorName && (
              <span>
                by <span className="text-brand-primary">{song.authorName}</span>
              </span>
            )}
            {song.kind && <span className="text-content-text-tertiary">{song.kind}</span>}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <dl className="grid grid-cols-2 lg:grid-cols-4 short:!grid-cols-4 gap-4 short:!gap-2">
        <StatBox label="Times Played" value={song.timesPlayed} />
        <StatBox label="Avg / Median Gap" value={formatAvgMedianGap(song.averageGapShows, song.medianGapShows)} />
        {song.lastShowSlug ? (
          <Link to={`/shows/${song.lastShowSlug}`} className="block">
            <StatBox
              label="Last Played"
              value={song.actualLastPlayedDate ? <ShowDate date={song.actualLastPlayedDate} /> : "Never"}
              sublabel={
                song.actualLastPlayedDate
                  ? lastPlayedSublabel(song.showsSinceLastPlayed, song.averageGapShows, song.longestGapShows)
                  : undefined
              }
              sublabel2={song.lastVenue ? venueSublabel(song.lastVenue) : undefined}
            />
          </Link>
        ) : (
          <StatBox
            label="Last Played"
            value={song.actualLastPlayedDate ? <ShowDate date={song.actualLastPlayedDate} /> : "Never"}
            sublabel={
              song.actualLastPlayedDate
                ? lastPlayedSublabel(song.showsSinceLastPlayed, song.averageGapShows, song.longestGapShows)
                : undefined
            }
            sublabel2={song.lastVenue ? venueSublabel(song.lastVenue) : undefined}
          />
        )}
        {song.firstShowSlug ? (
          <Link to={`/shows/${song.firstShowSlug}`} className="block">
            <StatBox
              label="First Played"
              value={song.dateFirstPlayed ? <ShowDate date={song.dateFirstPlayed} /> : "Never"}
              sublabel2={song.firstVenue ? venueSublabel(song.firstVenue) : undefined}
            />
          </Link>
        ) : (
          <StatBox
            label="First Played"
            value={song.dateFirstPlayed ? <ShowDate date={song.dateFirstPlayed} /> : "Never"}
            sublabel2={song.firstVenue ? venueSublabel(song.firstVenue) : undefined}
          />
        )}
        <StatBox label="% of All Shows" value={formatPercent(song.percentOfAllShows)} />
        <StatBox label="% Since Debut" value={formatPercent(song.percentSinceDebut)} />
        <StatBox
          label="Shows Before / Since Debut"
          value={`${formatCount(song.showsBeforeDebut)} / ${formatCount(song.showsSinceDebut)}`}
        />
        <StatBox label="Most Common Year" value={song.mostCommonYear || "—"} />
      </dl>

      {song.notes && (
        <div className="glass-content rounded-lg p-4">
          <div
            className="text-md text-content-text-tertiary leading-relaxed"
            dangerouslySetInnerHTML={{ __html: song.notes }}
          />
        </div>
      )}

      <Tabs value={activeTab} className="w-full" onValueChange={handleTabChange}>
        <div className="sm:hidden mb-4" data-testid="mobile-song-view">
          <Select value={activeTab} onValueChange={handleTabChange}>
            <SelectTrigger
              aria-label="Song view"
              className="w-full h-11 bg-glass-bg border border-glass-border text-content-text-primary hover:bg-glass-bg/80 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/20"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-glass-bg border-glass-border backdrop-blur-md">
              <SelectItem value="performances">All Performances</SelectItem>
              {hasJamCharts && <SelectItem value="jam-charts">Jam Charts</SelectItem>}
              {hasAllTimers && <SelectItem value="all-timers">All-Timers</SelectItem>}
              <SelectItem value="stats">Stats</SelectItem>
              {song.history && <SelectItem value="history">History</SelectItem>}
              {song.lyrics && <SelectItem value="lyrics">Lyrics</SelectItem>}
              {(song.tabs || song.guitarTabsUrl) && <SelectItem value="guitar-tabs">Guitar Tabs</SelectItem>}
            </SelectContent>
          </Select>
        </div>
        <TabsList className="w-full hidden sm:flex justify-start border-b border-glass-border/30 rounded-none bg-transparent p-0">
          <TabsTrigger
            value="performances"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
              "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
              "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
            )}
          >
            <ListMusic className="h-4 w-4" />
            All Performances
          </TabsTrigger>
          {hasJamCharts && (
            <TabsTrigger
              value="jam-charts"
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
                "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
              )}
            >
              <Flame className="h-4 w-4" />
              Jam Charts
            </TabsTrigger>
          )}
          {hasAllTimers && (
            <TabsTrigger
              value="all-timers"
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
                "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
              )}
            >
              <Flame className="h-4 w-4 text-orange-500" />
              All-Timers
            </TabsTrigger>
          )}
          <TabsTrigger
            value="stats"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
              "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
              "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
            )}
          >
            <BarChart3 className="h-4 w-4" />
            Graphs
          </TabsTrigger>
          {song.history && (
            <TabsTrigger
              value="history"
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
                "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
              )}
            >
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          )}
          {song.lyrics && (
            <TabsTrigger
              value="lyrics"
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
                "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
              )}
            >
              <FileTextIcon className="h-4 w-4" />
              Lyrics
            </TabsTrigger>
          )}
          {(song.tabs || song.guitarTabsUrl) && (
            <TabsTrigger
              value="guitar-tabs"
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
                "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
              )}
            >
              <GuitarIcon className="h-4 w-4" />
              Guitar Tabs
            </TabsTrigger>
          )}
        </TabsList>

        {hasJamCharts && (
          <TabsContent value="jam-charts" className="mt-6">
            <PerformanceTable
              performances={filteredJamCharts}
              isLoading={isLoading}
              showAllTimerColumn
              hasNarrowingFilter={hasServerNarrowingFilter}
              headerContent={renderFilterContent({ hideJamChartToggle: true })}
            />
          </TabsContent>
        )}

        {hasAllTimers && (
          <TabsContent value="all-timers" className="mt-6 space-y-8">
            {/* Featured cards for performances with notes */}
            {(() => {
              const withNotes = filteredAllTimers.filter((p) => p.notes).sort((a, b) => compareByShowDate(b, a));

              return (
                withNotes.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {withNotes.map((p) => (
                      <a
                        href={`/shows/${p.show.slug}`}
                        key={p.trackId}
                        className="glass-content block rounded-lg hover:border-brand-primary/60 transition-all duration-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="text-lg font-medium text-content-text-primary">{p.show.date}</div>
                          <RatingComponent rating={p.rating || null} ratingsCount={p.ratingsCount} />
                        </div>
                        <div className="space-y-2">
                          <div className="text-brand-secondary/90 font-medium text-base">{p.venue?.name}</div>
                          {p.venue?.city && (
                            <div className="text-sm text-content-text-tertiary">
                              {p.venue.city}, {p.venue.state}
                            </div>
                          )}
                          {p.notes && <ReviewNote notes={p.notes} />}
                        </div>
                      </a>
                    ))}
                  </div>
                )
              );
            })()}

            <PerformanceTable
              performances={filteredAllTimers}
              isLoading={isLoading}
              hasNarrowingFilter={hasServerNarrowingFilter}
              headerContent={renderFilterContent({ hideAllTimerToggle: true, hideJamChartToggle: true })}
            />
          </TabsContent>
        )}

        <TabsContent value="performances" className="mt-6">
          <PerformanceTable
            performances={filteredPerformances}
            showAllTimerColumn
            isLoading={isLoading}
            hasNarrowingFilter={hasServerNarrowingFilter}
            headerContent={renderFilterContent()}
          />
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <YearlyPlayChart
            yearlyPlayData={(song.yearlyPlayData || {}) as Record<number, number>}
            showsByYear={showsByYear}
          />
        </TabsContent>

        {song.history && (
          <TabsContent value="history" className="mt-4">
            <div className="glass-content rounded-lg p-6">
              <div
                className="text-base text-content-text-tertiary leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0"
                dangerouslySetInnerHTML={{
                  __html: song.history
                    // First try to split on sentences that end with periods followed by spaces and capital letters
                    .replace(/(\. )([A-Z])/g, "$1</p><p>$2")
                    // Also handle line breaks
                    .replace(/\n/g, "<br>")
                    // Wrap the whole thing in a paragraph
                    .replace(/^/, "<p>")
                    .replace(/$/, "</p>"),
                }}
              />
            </div>
          </TabsContent>
        )}

        {song.lyrics && (
          <TabsContent value="lyrics" className="mt-4">
            <div className="glass-content rounded-lg p-4">
              <div className="overflow-x-auto">
                <div
                  className="text-md text-content-text-tertiary leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: song.lyrics }}
                />
              </div>
            </div>
          </TabsContent>
        )}

        {(song.tabs || song.guitarTabsUrl) && (
          <TabsContent value="guitar-tabs" className="mt-4">
            <div className="glass-content rounded-lg p-4">
              <div className="overflow-x-auto">
                <div className="text-md text-content-text-tertiary leading-relaxed">
                  {song.tabs ? (
                    <div dangerouslySetInnerHTML={{ __html: song.tabs }} />
                  ) : song.guitarTabsUrl ? (
                    <a
                      href={song.guitarTabsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-primary hover:text-brand-secondary hover:underline"
                    >
                      View Guitar Tabs
                    </a>
                  ) : (
                    <p>No guitar tabs available for this song.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
