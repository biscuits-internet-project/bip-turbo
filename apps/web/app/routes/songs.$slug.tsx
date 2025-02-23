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
import { ArrowDownIcon, ArrowUpIcon, BarChart2Icon, FileTextIcon, GuitarIcon, StarIcon } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Markdown from "react-markdown";
import Masonry from "react-masonry-css";
import type { LoaderFunctionArgs } from "react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "../lib/base-loaders";
import { services } from "../server/services";

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
    <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
      <dt className="text-sm font-medium text-gray-400">{label}</dt>
      <dd className="mt-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {sublabel && <span className="ml-2 text-sm text-gray-500">{sublabel}</span>}
      </dd>
    </div>
  );
}

function PerformanceTable({ performances: initialPerformances }: { performances: SongPagePerformance[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);

  const columnHelper = createColumnHelper<SongPagePerformance>();
  const columns = [
    columnHelper.accessor("show.date", {
      id: "date",
      header: "Date",
      size: 128,
      cell: (info) => (
        <a href={`/shows/${info.row.original.show.slug}`} className="">
          {info.getValue().toLocaleDateString("en-US", { timeZone: "UTC" })}
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
        cell: (info) => {
          const venue = info.getValue();
          return venue.city ? (
            <a href={`/shows/${venue.slug}`} className="">
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
        header: "Before",
        size: 192,
        cell: (info) => {
          const song = info.getValue();
          return song.slug ? (
            <a href={`/songs/${song.slug}`} className="text-muted-foreground">
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
        header: "After",
        size: 192,
        cell: (info) => {
          const song = info.getValue();
          return song.slug ? (
            <a href={`/songs/${song.slug}`} className="text-muted-foreground">
              {song.title} {song.segue ? ">" : ""}
            </a>
          ) : null;
        },
      },
    ),
    columnHelper.accessor("rating", {
      header: "Rating",
      size: 64,
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
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-md">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-left text-sm text-muted-foreground">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3" style={{ width: header.getSize() }}>
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none hover:text-white w-full text-left"
                          : "w-full text-left"
                      }
                      onClick={() => header.column.toggleSorting()}
                    >
                      <span className={header.column.getIsSorted() ? "text-white font-semibold" : ""}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </span>
                      {header.column.getIsSorted() && (
                        <span className="text-purple-400 ml-1">
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
            <tr key={row.id} className="border-t border-border/40 hover:bg-accent/5">
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

export default function SongPage() {
  const { song, performances } = useSerializedLoaderData<SongPageView>();
  const allTimers = performances.filter((p) => p.allTimer);

  return (
    <div className="w-full p-4 md:p-6">
      <div className="space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap items-baseline gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">{song.title}</h1>
            {song.legacyAuthor && (
              <span className="text-gray-400 text-lg">
                by <span className="text-blue-400">{song.legacyAuthor}</span>
              </span>
            )}
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

        <Tabs defaultValue="all-timers" className="w-full">
          <TabsList>
            <TabsTrigger value="all-timers" className="flex items-center gap-2">
              <StarIcon className="h-4 w-4" />
              All-Timers
            </TabsTrigger>
            <TabsTrigger value="lyrics" className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              Lyrics
            </TabsTrigger>
            <TabsTrigger value="yearly-plays" className="flex items-center gap-2">
              <BarChart2Icon className="h-4 w-4" />
              Yearly Plays
            </TabsTrigger>
            <TabsTrigger value="guitar-tabs" className="flex items-center gap-2">
              <GuitarIcon className="h-4 w-4" />
              Guitar Tabs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all-timers">
            {allTimers.length > 0 && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allTimers.map((p) => (
                    <a
                      href={`/shows/${p.show.slug}`}
                      key={p.trackId}
                      className="block rounded-lg border border-border/40 bg-black/20 hover:bg-accent/10 transition-all duration-200"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="text-lg font-medium text-white">
                            {p.show.date.toLocaleDateString("en-US", {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                              timeZone: "UTC",
                            })}
                          </div>
                          {p.rating && p.rating > 0 && (
                            <div className="text-sm text-gray-400">{`★ ${p.rating.toFixed(1)}`}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="text-purple-400/90 font-medium text-base">{p.venue?.name}</div>
                          {p.venue?.city && (
                            <div className="text-sm text-gray-400">
                              {p.venue.city}, {p.venue.state}
                            </div>
                          )}
                          {p.notes && (
                            <div className="mt-3 pt-3 border-t border-border/40">
                              <div className="text-sm text-gray-400">{p.notes}</div>
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

          <TabsContent value="lyrics">
            {song.lyrics && (
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                <div className="overflow-x-auto">
                  <div className="text-md text-gray-400 whitespace-pre-wrap leading-relaxed">
                    <Markdown>{song.lyrics.replace(/<br\/?>/g, "\n")}</Markdown>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="yearly-plays">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
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
                  <Bar dataKey="plays" fill="rgb(168, 85, 247)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>
          {(song.tabs || song.guitarTabsUrl) && (
            <TabsContent value="guitar-tabs">
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
                <div className="overflow-x-auto">
                  <div className="text-md text-gray-400 whitespace-pre-wrap leading-relaxed">
                    {song.tabs ? (
                      <Markdown>{song.tabs}</Markdown>
                    ) : (
                      <a href={song.guitarTabsUrl || ""} target="_blank" rel="noreferrer">
                        Guitar Tabs
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Performance History */}
        <div className="w-full">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 md:p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Performance History</h2>
            <PerformanceTable performances={performances} />
          </div>
        </div>
      </div>
    </div>
  );
}
