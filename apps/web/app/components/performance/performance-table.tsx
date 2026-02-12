import type { SongPagePerformance } from "@bip/domain";
import {
  type ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, Flame } from "lucide-react";
import { useMemo, useState } from "react";
import { CombinedNotes } from "./combined-notes";
import { TrackRatingCell } from "./track-rating-cell";

interface PerformanceTableProps {
  performances: SongPagePerformance[];
  songTitle?: string;
  showSongColumn?: boolean;
  showAllTimerColumn?: boolean;
}

export function PerformanceTable({
  performances: initialPerformances,
  songTitle,
  showSongColumn = false,
  showAllTimerColumn = false,
}: PerformanceTableProps) {
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
          case "allTimer":
            return perf.allTimer;
          default:
            return false;
        }
      });
    });
  }, [initialPerformances, activeFilters]);

  const columnHelper = createColumnHelper<SongPagePerformance>();

  const columns = useMemo(() => {
    const cols: ColumnDef<SongPagePerformance, unknown>[] = [];

    if (showSongColumn) {
      cols.push(
        columnHelper.accessor((row) => row.songTitle || "", {
          id: "song",
          header: "Song",
          size: 200,
          enableSorting: true,
          sortingFn: "alphanumeric",
          cell: (info) => {
            const title = info.getValue() as string;
            const slug = info.row.original.songSlug;
            return slug ? (
              <a href={`/songs/${slug}`} className="text-brand-primary hover:text-brand-secondary font-medium">
                {title}
              </a>
            ) : (
              <span className="text-content-text-secondary">{title}</span>
            );
          },
        }) as ColumnDef<SongPagePerformance, unknown>,
      );
    }

    if (showAllTimerColumn) {
      cols.push(
        columnHelper.accessor((row) => row.allTimer ?? false, {
          id: "allTimer",
          header: "",
          size: 32,
          enableSorting: false,
          cell: (info) =>
            info.getValue() ? <Flame className="h-3.5 w-3.5 text-orange-500" /> : null,
        }) as ColumnDef<SongPagePerformance, unknown>,
      );
    }

    cols.push(
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
      }) as ColumnDef<SongPagePerformance, unknown>,
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
      ) as ColumnDef<SongPagePerformance, unknown>,
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
      }) as ColumnDef<SongPagePerformance, unknown>,
      columnHelper.accessor(
        (row) => ({
          before: row.songBefore,
          after: row.songAfter,
          currentSong: songTitle || row.songTitle || "",
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
      ) as ColumnDef<SongPagePerformance, unknown>,
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
              for (const annotation of annotations) {
                if (annotation.desc) {
                  items.push(annotation.desc);
                }
              }
            }

            // Add track notes
            if (notes) {
              items.push(notes);
            }

            if (items.length === 0) return null;

            return <CombinedNotes items={items} />;
          },
        },
      ) as ColumnDef<SongPagePerformance, unknown>,
      columnHelper.accessor((row) => row.rating ?? 0, {
        id: "rating",
        header: "Rating",
        size: 180,
        enableSorting: true,
        sortingFn: "basic",
        cell: (info) => {
          const rating = info.getValue();
          const ratingsCount = info.row.original.ratingsCount;
          const trackId = info.row.original.trackId;
          const showSlug = info.row.original.show.slug;
          return (
            <TrackRatingCell
              trackId={trackId}
              showSlug={showSlug}
              initialRating={rating || null}
              ratingsCount={ratingsCount || null}
            />
          );
        },
      }) as ColumnDef<SongPagePerformance, unknown>,
    );

    return cols;
  }, [showSongColumn, showAllTimerColumn, songTitle, columnHelper]);

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
    { key: "allTimer", label: "All-Timer" },
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
                  <th key={header.id} className={header.id === "allTimer" ? "p-0 w-6" : "p-3"} style={{ width: header.getSize() }}>
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
                  <td key={cell.id} className={cell.column.id === "allTimer" ? "p-0 w-6" : "p-3"}>
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
