import { compareByShowDate, type SongPageView } from "@bip/domain";
import { ArrowLeft, BarChart3, FileTextIcon, Flame, GuitarIcon, History, ListMusic, Pencil } from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link, useSearchParams } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { PerformanceTable } from "~/components/performance";
import { PerformanceFilterControls } from "~/components/performance/performance-filter-controls";
import { RatingComponent } from "~/components/rating";
import { ShowDate } from "~/components/show-date";
import { YearlyPlayChart } from "~/components/song/yearly-play-chart";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { searchPerformance, usePerformancePageFilters } from "~/hooks/use-performance-page-filters";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { pickGapTier } from "~/lib/gap-tier";
import { getSongMeta, getSongStructuredData } from "~/lib/seo";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ params }: LoaderFunctionArgs): Promise<SongPageView> => {
  const slug = params.slug;
  if (!slug) throw new Response("Not Found", { status: 404 });

  return services.songPageComposer.build(slug);
});

interface StatBoxProps {
  label: string;
  value: ReactNode;
  sublabel?: ReactNode;
  sublabel2?: string;
}

function StatBox({ label, value, sublabel, sublabel2 }: StatBoxProps) {
  return (
    <div className="glass-content p-2 sm:p-3 rounded-lg h-full">
      <dt className="text-sm font-medium text-content-text-secondary">{label}</dt>
      <dd className="mt-2">
        <span className="text-xl sm:text-3xl font-bold text-content-text-primary">{value}</span>
        {sublabel && <div className="mt-1 text-sm text-content-text-tertiary">{sublabel}</div>}
        {sublabel2 && <div className="mt-3 text-sm text-content-text-tertiary hidden sm:block">{sublabel2}</div>}
      </dd>
    </div>
  );
}

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

export function meta({ data }: { data: SongPageView }) {
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

function formatDecimal(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toFixed(1);
}

export default function SongPage() {
  const { song, performances: allPerformances, showsByYear } = useSerializedLoaderData<SongPageView>();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = ["performances", "all-timers", "stats", "history", "lyrics", "guitar-tabs"];
  const defaultTab = tabParam && validTabs.includes(tabParam) ? tabParam : "performances";
  const [activeTab, setActiveTab] = useState(defaultTab);
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

  const hasAllTimers = useMemo(() => allPerformances.some((p) => p.allTimer), [allPerformances]);
  const filteredAllTimers = useMemo(() => filteredPerformances.filter((p) => p.allTimer), [filteredPerformances]);
  const filterContent = (
    <PerformanceFilterControls
      selectedTimeRange={selectedTimeRange}
      activeToggleSet={activeToggleSet}
      updateFilter={updateFilter}
      toggleFilter={toggleFilter}
      clearFilters={clearFilters}
      searchValue={searchText}
      onSearchChange={setSearchText}
      hasActiveFilters={hasActiveFilters}
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

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-baseline gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-content-text-primary">{song.title}</h1>
          {song.authorName && (
            <span className="text-content-text-secondary text-lg">
              by <span className="text-brand-primary">{song.authorName}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/songs"
            className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to songs</span>
          </Link>
          <AdminOnly>
            <Button asChild variant="outline" className="btn-secondary">
              <Link to={`/songs/${song.slug}/edit`} className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          </AdminOnly>
        </div>
      </div>

      {/* Stats Grid */}
      <dl className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Times Played" value={song.timesPlayed} />
        <StatBox label="Average Gap" value={formatDecimal(song.averageShowsPerPlay)} />
        {song.lastShowSlug ? (
          <Link to={`/shows/${song.lastShowSlug}`} className="block">
            <StatBox
              label="Last Played"
              value={song.actualLastPlayedDate ? <ShowDate date={song.actualLastPlayedDate} /> : "Never"}
              sublabel={
                song.actualLastPlayedDate
                  ? lastPlayedSublabel(song.showsSinceLastPlayed, song.averageShowsPerPlay, song.longestGapShows)
                  : undefined
              }
              sublabel2={
                song.lastVenue
                  ? song.lastVenue.city && song.lastVenue.state
                    ? `${song.lastVenue.name}, ${song.lastVenue.city}, ${song.lastVenue.state}`
                    : song.lastVenue.name
                  : undefined
              }
            />
          </Link>
        ) : (
          <StatBox
            label="Last Played"
            value={song.actualLastPlayedDate ? <ShowDate date={song.actualLastPlayedDate} /> : "Never"}
            sublabel={
              song.actualLastPlayedDate
                ? lastPlayedSublabel(song.showsSinceLastPlayed, song.averageShowsPerPlay, song.longestGapShows)
                : undefined
            }
            sublabel2={
              song.lastVenue
                ? song.lastVenue.city && song.lastVenue.state
                  ? `${song.lastVenue.name}, ${song.lastVenue.city}, ${song.lastVenue.state}`
                  : song.lastVenue.name
                : undefined
            }
          />
        )}
        {song.firstShowSlug ? (
          <Link to={`/shows/${song.firstShowSlug}`} className="block">
            <StatBox
              label="First Played"
              value={song.dateFirstPlayed ? <ShowDate date={song.dateFirstPlayed} /> : "Never"}
              sublabel2={
                song.firstVenue
                  ? song.firstVenue.city && song.firstVenue.state
                    ? `${song.firstVenue.name}, ${song.firstVenue.city}, ${song.firstVenue.state}`
                    : song.firstVenue.name
                  : undefined
              }
            />
          </Link>
        ) : (
          <StatBox
            label="First Played"
            value={song.dateFirstPlayed ? <ShowDate date={song.dateFirstPlayed} /> : "Never"}
            sublabel2={
              song.firstVenue
                ? song.firstVenue.city && song.firstVenue.state
                  ? `${song.firstVenue.name}, ${song.firstVenue.city}, ${song.firstVenue.state}`
                  : song.firstVenue.name
                : undefined
            }
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

      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={(value) => {
          setActiveTab(value);
          clearFilters();
        }}
      >
        <div className="sm:hidden mb-4">
          <label htmlFor="song-view-select" className="sr-only">
            Song view
          </label>
          <select
            id="song-view-select"
            value={activeTab}
            onChange={(event) => {
              setActiveTab(event.target.value);
              clearFilters();
            }}
            className="w-full h-11 px-3 rounded-md bg-glass-bg border border-glass-border text-content-text-primary focus:outline-none focus:ring-1 focus:ring-ring/20"
          >
            <option value="performances">All Performances</option>
            {hasAllTimers && <option value="all-timers">All-Timers</option>}
            <option value="stats">Stats</option>
            {song.history && <option value="history">History</option>}
            {song.lyrics && <option value="lyrics">Lyrics</option>}
            {(song.tabs || song.guitarTabsUrl) && <option value="guitar-tabs">Guitar Tabs</option>}
          </select>
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
              songTitle={song.title}
              isLoading={isLoading}
              headerContent={filterContent}
            />
          </TabsContent>
        )}

        <TabsContent value="performances" className="mt-6">
          <PerformanceTable
            performances={filteredPerformances}
            songTitle={song.title}
            showAllTimerColumn
            isLoading={isLoading}
            headerContent={filterContent}
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
