import type { SongPageView } from "@bip/domain";
import { ArrowLeft, BarChart3, FileTextIcon, GuitarIcon, History, Pencil, StarIcon } from "lucide-react";
import { useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminOnly } from "~/components/admin/admin-only";
import { PerformanceTable } from "~/components/performance";
import { RatingComponent } from "~/components/rating";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
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
  value: string | number;
  sublabel?: string;
  sublabel2?: string;
}

function StatBox({ label, value, sublabel, sublabel2 }: StatBoxProps) {
  return (
    <div className="glass-content p-6 rounded-lg">
      <dt className="text-sm font-medium text-content-text-secondary">{label}</dt>
      <dd className="mt-2">
        <span className="text-3xl font-bold text-content-text-primary">{value}</span>
        {sublabel && <span className="ml-2 text-sm text-content-text-tertiary">{sublabel}</span>}
        {sublabel2 && <div className="mt-3 text-sm text-content-text-tertiary">{sublabel2}</div>}
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

export default function SongPage() {
  const { song, performances } = useSerializedLoaderData<SongPageView>();
  const allTimers = performances.filter((p) => p.allTimer);

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
        <AdminOnly>
          <Button asChild variant="outline" className="btn-secondary">
            <Link to={`/songs/${song.slug}/edit`} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </AdminOnly>
      </div>

      {/* Subtle back link */}
      <div className="flex justify-start">
        <Link
          to="/songs"
          className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back to songs</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Times Played" value={song.timesPlayed} sublabel="total plays" />
        {song.firstShowSlug ? (
          <Link to={`/shows/${song.firstShowSlug}`} className="block">
            <StatBox
              label="First Played"
              value={
                song.dateFirstPlayed
                  ? (() => {
                      const date = new Date(song.dateFirstPlayed);
                      const month = date.getUTCMonth() + 1;
                      const day = date.getUTCDate();
                      const year = date.getUTCFullYear();
                      return `${month}/${day}/${year}`;
                    })()
                  : "Never"
              }
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
            value={
              song.dateFirstPlayed
                ? (() => {
                    const date = new Date(song.dateFirstPlayed);
                    const month = date.getUTCMonth() + 1;
                    const day = date.getUTCDate();
                    const year = date.getUTCFullYear();
                    return `${month}/${day}/${year}`;
                  })()
                : "Never"
            }
            sublabel2={
              song.firstVenue
                ? song.firstVenue.city && song.firstVenue.state
                  ? `${song.firstVenue.name}, ${song.firstVenue.city}, ${song.firstVenue.state}`
                  : song.firstVenue.name
                : undefined
            }
          />
        )}
        {song.lastShowSlug ? (
          <Link to={`/shows/${song.lastShowSlug}`} className="block">
            <StatBox
              label="Last Played"
              value={
                song.actualLastPlayedDate
                  ? (() => {
                      const date = new Date(song.actualLastPlayedDate);
                      const month = date.getUTCMonth() + 1;
                      const day = date.getUTCDate();
                      const year = date.getUTCFullYear();
                      return `${month}/${day}/${year}`;
                    })()
                  : "Never"
              }
              sublabel={
                song.actualLastPlayedDate &&
                song.showsSinceLastPlayed !== null &&
                song.showsSinceLastPlayed !== undefined
                  ? song.showsSinceLastPlayed <= 1
                    ? "last show"
                    : `${song.showsSinceLastPlayed} shows ago`
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
            value={
              song.actualLastPlayedDate
                ? (() => {
                    const date = new Date(song.actualLastPlayedDate);
                    const month = date.getUTCMonth() + 1;
                    const day = date.getUTCDate();
                    const year = date.getUTCFullYear();
                    return `${month}/${day}/${year}`;
                  })()
                : "Never"
            }
            sublabel={
              song.actualLastPlayedDate && song.showsSinceLastPlayed !== null && song.showsSinceLastPlayed !== undefined
                ? song.showsSinceLastPlayed <= 1
                  ? "last show"
                  : `${song.showsSinceLastPlayed} shows ago`
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

      <Tabs defaultValue="performances" className="w-full">
        <TabsList className="w-full flex justify-start border-b border-glass-border/30 rounded-none bg-transparent p-0">
          <TabsTrigger
            value="performances"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
              "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
              "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
            )}
          >
            <FileTextIcon className="h-4 w-4" />
            All Performances
          </TabsTrigger>
          {allTimers.length > 0 && (
            <TabsTrigger
              value="all-timers"
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
                "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
              )}
            >
              <StarIcon className="h-4 w-4 stroke-yellow-500 fill-transparent" />
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
            Stats
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

        {allTimers.length > 0 && (
          <TabsContent value="all-timers" className="mt-6 space-y-8">
            {/* Featured cards for performances with notes */}
            {(() => {
              const withNotes = allTimers
                .filter((p) => p.notes)
                .sort((a, b) => new Date(b.show.date).getTime() - new Date(a.show.date).getTime());

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

            {/* Full performance table for all all-timers */}
            <div className="glass-content rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-semibold text-content-text-primary mb-4">All-Timer Performances</h3>
              <PerformanceTable performances={allTimers} songTitle={song.title} />
            </div>
          </TabsContent>
        )}

        <TabsContent value="performances" className="mt-6">
          <div className="glass-content rounded-lg p-4 md:p-6">
            <h3 className="text-lg font-semibold text-content-text-primary mb-4">All Performances</h3>
            <PerformanceTable performances={performances} songTitle={song.title} />
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="glass-content rounded-lg p-6">
            <h3 className="text-lg font-semibold text-content-text-primary mb-4">Times Played by Year</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={Object.entries(song.yearlyPlayData || {})
                    .map(([year, count]) => ({
                      year: Number.parseInt(year, 10),
                      plays: count as number,
                    }))
                    .sort((a, b) => a.year - b.year)}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "6px",
                      color: "#F3F4F6",
                    }}
                    labelStyle={{ color: "#F3F4F6" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="plays"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#8B5CF6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
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
