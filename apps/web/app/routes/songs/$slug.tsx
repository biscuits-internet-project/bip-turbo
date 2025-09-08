import type { SongPagePerformance, SongPageView } from "@bip/domain";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowLeft,
  ArrowUpIcon,
  BarChart3,
  FileTextIcon,
  GuitarIcon,
  History,
  Pencil,
  StarIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { Link } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AdminOnly } from "~/components/admin/admin-only";
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

function PerformanceTable({
  performances: initialPerformances,
  songTitle,
}: {
  performances: SongPagePerformance[];
  songTitle: string;
}) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const handleSortingChange = (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
    setSorting(updaterOrValue);
  };

  const toggleFilter = (filterKey: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filterKey)) {
      newFilters.delete(filterKey);
    } else {
      newFilters.add(filterKey);
    }
    setActiveFilters(newFilters);
  };

  // Filter performances based on active filters
  const filteredPerformances = useMemo(() => {
    if (activeFilters.size === 0) return initialPerformances;

    return initialPerformances.filter((perf) => {
      return Array.from(activeFilters).some((filterKey) => {
        switch (filterKey) {
          case "setOpener":
            return perf.tags?.setOpener;
          case "setCloser":
            return perf.tags?.setCloser;
          case "encore":
            return perf.tags?.encore;
          case "segueIn":
            return perf.tags?.segueIn;
          case "segueOut":
            return perf.tags?.segueOut;
          case "standalone":
            return perf.tags?.standalone;
          case "inverted":
            return perf.tags?.inverted;
          case "dyslexic":
            return perf.tags?.dyslexic;
          default:
            return false;
        }
      });
    });
  }, [initialPerformances, activeFilters]);

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
    columnHelper.accessor("set", {
      header: "Set",
      size: 64,
      enableSorting: true,
      cell: (info) => {
        const set = info.getValue();
        return set ? (
          <span className="text-content-text-secondary">{set}</span>
        ) : (
          <span className="text-content-text-tertiary">—</span>
        );
      },
    }),
    columnHelper.accessor(
      (row) => ({
        before: row.songBefore,
        after: row.songAfter,
        currentSong: songTitle,
      }),
      {
        id: "sequence",
        header: "Sequence",
        size: 384,
        enableSorting: false,
        cell: (info) => {
          const { before, after, currentSong } = info.getValue();

          const parts = [];

          // Add song before
          if (before?.songTitle) {
            parts.push(
              <a
                key="before"
                href={`/songs/${before.songSlug}`}
                className="text-content-text-secondary hover:text-brand-primary"
              >
                {before.songTitle}
              </a>,
            );
            if (before.segue) {
              parts.push(
                <span key="segue1" className="text-content-text-tertiary mx-1">
                  {" "}
                  &gt;{" "}
                </span>,
              );
            } else {
              parts.push(
                <span key="sep1" className="text-content-text-tertiary">
                  ,&nbsp;
                </span>,
              );
            }
          }

          // Add current song
          parts.push(
            <span key="current" className="font-bold" style={{ color: "#DDD6FE" }}>
              {currentSong}
            </span>,
          );

          // Add song after
          if (after?.songTitle) {
            if (info.row.original.segue) {
              parts.push(
                <span key="segue2" className="text-content-text-tertiary mx-1">
                  {" "}
                  &gt;{" "}
                </span>,
              );
            } else {
              parts.push(
                <span key="sep2" className="text-content-text-tertiary">
                  ,&nbsp;
                </span>,
              );
            }
            parts.push(
              <a
                key="after"
                href={`/songs/${after.songSlug}`}
                className="text-content-text-secondary hover:text-brand-primary"
              >
                {after.songTitle}
              </a>,
            );
          }

          return parts.length > 0 ? <div className="flex items-center flex-wrap">{parts}</div> : null;
        },
      },
    ),
    columnHelper.accessor(
      (row) => ({
        annotations: row.annotations,
        notes: row.notes,
      }),
      {
        id: "notes",
        header: "Notes",
        size: 256,
        enableSorting: false,
        cell: (info) => {
          const { annotations, notes } = info.getValue();

          const items = [];

          // Add annotations first
          if (annotations && annotations.length > 0) {
            annotations.forEach((annotation) => {
              if (annotation.desc) {
                items.push(annotation.desc);
              }
            });
          }

          // Add track notes
          if (notes) {
            items.push(notes);
          }

          if (items.length === 0) return null;

          return <CombinedNotes items={items} />;
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
          <span className="text-right block text-yellow-500">{`★ ${rating.toFixed(1)}`}</span>
        ) : (
          <span className="text-right block">—</span>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: filteredPerformances,
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

  const filterButtons = [
    { key: "setOpener", label: "Set Opener" },
    { key: "setCloser", label: "Set Closer" },
    { key: "encore", label: "Encore" },
    { key: "segueIn", label: "Segue In" },
    { key: "segueOut", label: "Segue Out" },
    { key: "standalone", label: "Standalone" },
    { key: "inverted", label: "Inverted" },
    { key: "dyslexic", label: "Dyslexic" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-content-text-secondary mr-2 self-center">Filters:</span>
        {filterButtons.map((filter) => (
          <button
            type="button"
            key={filter.key}
            onClick={() => toggleFilter(filter.key)}
            className={`px-3 py-1 text-sm rounded-md border transition-colors ${
              activeFilters.has(filter.key)
                ? "bg-brand-primary border-brand-primary text-white"
                : "bg-transparent border-glass-border text-content-text-secondary hover:border-brand-primary/60"
            }`}
          >
            {filter.label}
          </button>
        ))}
        {activeFilters.size > 0 && (
          <button
            type="button"
            onClick={() => setActiveFilters(new Set())}
            className="px-3 py-1 text-sm rounded-md bg-transparent border border-glass-border text-content-text-tertiary hover:text-content-text-secondary"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Performance count */}
      <div className="text-sm text-content-text-tertiary">
        Showing {filteredPerformances.length} of {initialPerformances.length} performances
      </div>

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
                        onClick={(_e) => {
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
    </div>
  );
}

function CombinedNotes({ items }: { items: string[] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Count total lines across all items
  const allLines = items.flatMap((item) => item.split("\n"));
  const shouldTruncate = allLines.length > 2;

  const displayItems =
    shouldTruncate && !isExpanded
      ? // Show only first 2 lines total
        (() => {
          const result = [];
          let lineCount = 0;
          for (const item of items) {
            const itemLines = item.split("\n");
            const remainingLines = 2 - lineCount;
            if (remainingLines <= 0) break;

            if (itemLines.length <= remainingLines) {
              result.push(item);
              lineCount += itemLines.length;
            } else {
              result.push(itemLines.slice(0, remainingLines).join("\n"));
              lineCount = 2;
              break;
            }
          }
          return result;
        })()
      : items;

  const showBullets = items.length > 1;

  return (
    <div className="text-sm text-content-text-secondary">
      <div className="leading-relaxed">
        {displayItems.map((item) => (
          <div key={item} className={showBullets ? "flex" : ""}>
            {showBullets && <span className="mr-1">•</span>}
            <span>{item}</span>
          </div>
        ))}
        {shouldTruncate && !isExpanded && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="text-brand-primary hover:text-brand-secondary ml-1 underline text-xs"
          >
            more
          </button>
        )}
        {shouldTruncate && isExpanded && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(false);
            }}
            className="text-brand-primary hover:text-brand-secondary ml-1 underline text-xs"
          >
            less
          </button>
        )}
      </div>
    </div>
  );
}

function ReviewNote({ notes }: { notes: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Split by newlines to count lines, but also account for long lines that wrap
  const lines = notes.split("\n");
  const shouldTruncate = lines.length > 6;

  const displayText = isExpanded || !shouldTruncate ? notes : lines.slice(0, 6).join("\n");

  // Only show read more if we're actually truncating content
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
            {/* Featured Performances (with reviews) */}
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
                          {p.rating && p.rating > 0 && (
                            <div className="text-base text-yellow-500">{`★ ${p.rating.toFixed(1)}`}</div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="text-brand-secondary/90 font-medium text-base">{p.venue?.name}</div>
                          {p.venue?.city && (
                            <div className="text-sm text-content-text-tertiary">
                              {p.venue.city}, {p.venue.state}
                            </div>
                          )}
                          {p.notes && <ReviewNote key={p.trackId} notes={p.notes} />}
                        </div>
                      </a>
                    ))}
                  </div>
                )
              );
            })()}

            {/* All Performances Table */}
            {(() => {
              const withoutNotes = allTimers
                .filter((p) => !p.notes)
                .sort((a, b) => new Date(b.show.date).getTime() - new Date(a.show.date).getTime());

              return (
                withoutNotes.length > 0 && (
                  <div className="glass-content rounded-lg p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-base">
                        <thead>
                          <tr className="text-left text-sm text-content-text-secondary border-b border-glass-border/30">
                            <th className="p-3">Date</th>
                            <th className="p-3">Venue</th>
                            <th className="p-3">Location</th>
                            <th className="p-3 text-right">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {withoutNotes.map((p) => (
                            <tr key={p.trackId} className="border-t border-glass-border/20 hover:bg-hover-glass">
                              <td className="p-3">
                                <a
                                  href={`/shows/${p.show.slug}`}
                                  className="text-brand-primary hover:text-brand-secondary"
                                >
                                  {p.show.date}
                                </a>
                              </td>
                              <td className="p-3">
                                <a
                                  href={`/shows/${p.show.slug}`}
                                  className="text-content-text-primary hover:text-brand-primary"
                                >
                                  {p.venue?.name}
                                </a>
                              </td>
                              <td className="p-3 text-content-text-secondary">
                                {p.venue?.city && `${p.venue.city}, ${p.venue.state}`}
                              </td>
                              <td className="p-3 text-right">
                                {p.rating && p.rating > 0 ? (
                                  <span className="text-yellow-500">{`★ ${p.rating.toFixed(1)}`}</span>
                                ) : (
                                  <span className="text-content-text-tertiary">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              );
            })()}
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
                      year: parseInt(year),
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
