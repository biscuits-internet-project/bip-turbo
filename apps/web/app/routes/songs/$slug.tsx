import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { SongPagePerformance, SongPageView } from "@bip/domain";
import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowLeft, ArrowUpIcon, BarChart2Icon, FileTextIcon, GuitarIcon, Pencil, StarIcon } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Markdown from "react-markdown";
import Masonry from "react-masonry-css";
import type { LoaderFunctionArgs } from "react-router";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { AdminOnly } from "~/components/admin/admin-only";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { cn } from "~/lib/utils";
import { services } from "~/server/services";

export const loader = publicLoader(async ({ request, params }: LoaderFunctionArgs): Promise<SongPageView> => {
  const slug = params.slug;
  if (!slug) throw new Response("Not Found", { status: 404 });

  return services.songPageComposer.build(slug);
});

interface StatBoxProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

function StatBox({ label, value, sublabel }: StatBoxProps) {
  return (
    <div className="glass-content p-6 rounded-lg">
      <dt className="text-sm font-medium text-content-text-secondary">{label}</dt>
      <dd className="mt-2">
        <span className="text-3xl font-bold text-content-text-primary">{value}</span>
        {sublabel && <span className="ml-2 text-sm text-content-text-tertiary">{sublabel}</span>}
      </dd>
    </div>
  );
}

function PerformanceTable({ performances: initialPerformances }: { performances: SongPagePerformance[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);

  const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
    setSorting(updaterOrValue);
  };

  const columnHelper = createColumnHelper<SongPagePerformance>();
  const columns = [
    columnHelper.accessor("show.date", {
      id: "date",
      header: "Date",
      size: 128,
      enableSorting: true,
      sortingFn: "datetime",
      cell: (info) => (
        <a href={`/shows/${info.row.original.show.slug}`} className="text-brand-primary hover:text-brand-secondary">
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor(
      (row) => ({
        name: row.venue?.name,
        city: row.venue?.city,
        state: row.venue?.state,
        slug: row.show.slug,
      }),
      {
        id: "venue",
        header: "Venue",
        enableSorting: false,
        cell: (info) => {
          const venue = info.getValue();
          return venue.city ? (
            <a href={`/shows/${venue.slug}`} className="text-brand-primary hover:text-brand-secondary">
              {venue.name}
              <br />
              {venue.city}, {venue.state}
            </a>
          ) : null;
        },
      },
    ),
    columnHelper.accessor(
      (row) => ({
        title: row.songBefore?.songTitle,
        slug: row.songBefore?.songSlug,
        segue: row.songBefore?.segue,
      }),
      {
        id: "before",
        header: "Song before",
        size: 192,
        enableSorting: false,
        cell: (info) => {
          const song = info.getValue();
          return song.slug ? (
            <a href={`/songs/${song.slug}`} className="text-content-text-secondary hover:text-brand-primary">
              {song.title} {song.segue ? ">" : ""}
            </a>
          ) : null;
        },
      },
    ),
    columnHelper.accessor(
      (row) => ({
        title: row.songAfter?.songTitle,
        slug: row.songAfter?.songSlug,
        segue: row.songAfter?.segue,
      }),
      {
        id: "after",
        header: "Song after",
        size: 192,
        enableSorting: false,
        cell: (info) => {
          const song = info.getValue();
          return song.slug ? (
            <a href={`/songs/${song.slug}`} className="text-content-text-secondary hover:text-brand-primary">
              {song.title} {song.segue ? ">" : ""}
            </a>
          ) : null;
        },
      },
    ),
    columnHelper.accessor("rating", {
      header: "Rating",
      size: 64,
      enableSorting: true,
      cell: (info) => {
        const rating = info.getValue();
        return rating && rating > 0 ? (
          <span className="text-right block">{`★ ${rating.toFixed(1)}`}</span>
        ) : (
          <span className="text-right block">—</span>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: initialPerformances,
    columns,
    state: {
      sorting,
    },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
    enableMultiSort: false,
  });

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-md">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-left text-sm text-content-text-secondary">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3" style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none hover:text-content-text-primary w-full text-left"
                          : "w-full text-left"
                      }
                      onClick={(e) => {
                        header.column.toggleSorting();
                      }}
                    >
                      <span className={header.column.getIsSorted() ? "text-content-text-primary font-semibold" : ""}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {header.column.getIsSorted() && (
                        <span className="text-brand-primary ml-1">
                          {header.column.getIsSorted() === "asc" ? (
                            <ArrowUpIcon className="h-4 w-4 inline" />
                          ) : (
                            <ArrowDownIcon className="h-4 w-4 inline" />
                          )}
                        </span>
                      )}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-glass-border/30 hover:bg-hover-glass">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function meta({ data }: { data: SongPageView }) {
  return [
    { title: `${data.song.title} - Biscuits Internet Project` },
    {
      name: "description",
      content: `View details, lyrics, tabs, and performance history for ${data.song.title} by The Disco Biscuits.`,
    },
  ];
}

export default function SongPage() {
  const { song, performances } = useSerializedLoaderData<SongPageView>();
  const allTimers = performances.filter((p) => p.allTimer);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
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
            <Button
              asChild
              variant="outline"
              className="btn-secondary"
            >
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
      </div>

      {/* Stats Grid */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox label="Times Played" value={song.timesPlayed} sublabel="total plays" />
        <StatBox
          label="Last Played"
          value={
            song.dateLastPlayed
              ? new Date(song.dateLastPlayed).toLocaleDateString("en-US", {
                  timeZone: "UTC",
                })
              : "Never"
          }
        />
        <StatBox label="Most Common Year" value={song.mostCommonYear || "—"} />
        <StatBox label="Least Common Year" value={song.leastCommonYear || "—"} />
      </dl>

      {song.notes && (
        <div className="glass-content rounded-lg p-4">
          <div className="text-md text-content-text-tertiary whitespace-pre-wrap leading-relaxed">
            <Markdown>{song.notes}</Markdown>
          </div>
        </div>
      )}

      <Tabs defaultValue="all-timers" className="w-full">
        <TabsList className="w-full flex justify-start border-b border-glass-border/30 rounded-none bg-transparent p-0">
          <TabsTrigger
            value="all-timers"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
              "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
              "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
            )}
          >
            <StarIcon className="h-4 w-4" />
            All-Timers
          </TabsTrigger>
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
          <TabsTrigger
            value="yearly-plays"
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-none data-[state=active]:shadow-none",
              "data-[state=active]:border-b-2 data-[state=active]:border-brand-primary data-[state=active]:bg-transparent",
              "data-[state=inactive]:bg-transparent data-[state=inactive]:text-content-text-tertiary",
            )}
          >
            <BarChart2Icon className="h-4 w-4" />
            Yearly Plays
          </TabsTrigger>
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
        </TabsList>

        <TabsContent value="all-timers" className="mt-4">
          {allTimers.length > 0 && (
            <div className="glass-content rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allTimers.map((p) => (
                  <a
                    href={`/shows/${p.show.slug}`}
                    key={p.trackId}
                    className="card-premium block rounded-lg hover:border-brand-primary/60 transition-all duration-200"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="text-lg font-medium text-content-text-primary">{p.show.date}</div>
                        {p.rating && p.rating > 0 && (
                          <div className="text-sm text-content-text-tertiary">{`★ ${p.rating.toFixed(1)}`}</div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="text-brand-secondary/90 font-medium text-base">{p.venue?.name}</div>
                        {p.venue?.city && (
                          <div className="text-sm text-content-text-tertiary">
                            {p.venue.city}, {p.venue.state}
                          </div>
                        )}
                        {p.notes && (
                          <div className="mt-3 pt-3 border-t border-glass-border/30">
                            <div className="text-sm text-content-text-tertiary">{p.notes}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="lyrics" className="mt-4">
          {song.lyrics && (
            <div className="glass-content rounded-lg p-4">
              <div className="overflow-x-auto">
                <div className="text-md text-content-text-tertiary whitespace-pre-wrap leading-relaxed">
                  <Markdown>{song.lyrics.replace(/<br\/?>/g, "\n")}</Markdown>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="yearly-plays" className="mt-4">
          <div className="glass-content rounded-lg p-4">
            <ChartContainer config={{}} className="min-h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={Object.entries(song.yearlyPlayData || {}).map(([year, count]) => ({
                  year: Number.parseInt(year),
                  plays: count,
                }))}
                margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tick={{ fill: "rgba(255,255,255,0.7)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tick={{ fill: "rgba(255,255,255,0.7)" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Bar dataKey="plays" fill="theme(colors.chart.primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </TabsContent>

        <TabsContent value="guitar-tabs" className="mt-4">
          <div className="glass-content rounded-lg p-4">
            <div className="overflow-x-auto">
              <div className="text-md text-content-text-tertiary whitespace-pre-wrap leading-relaxed">
                {song.tabs ? (
                  <Markdown>{song.tabs}</Markdown>
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
      </Tabs>

      {/* Performance History */}
      <div className="w-full">
        <div className="card-premium rounded-lg p-4 md:p-6">
          <h2 className="text-xl font-semibold text-content-text-primary mb-4">Performance History</h2>
          <PerformanceTable performances={performances} />
        </div>
      </div>
    </div>
  );
}
