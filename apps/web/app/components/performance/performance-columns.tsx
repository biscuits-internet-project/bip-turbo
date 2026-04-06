import type { SongPagePerformance } from "@bip/domain";
import { type Column, type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, Flame } from "lucide-react";
import { CombinedNotes } from "./combined-notes";
import { TrackRatingCell } from "./track-rating-cell";

interface PerformanceColumnOptions {
  showSongColumn?: boolean;
  showAllTimerColumn?: boolean;
  songTitle?: string;
  userRatingMap: Map<string, number>;
  isAuthenticated: boolean;
}

function SortableHeader({ column, label }: { column: Column<SongPagePerformance, unknown>; label: string }) {
  if (!column.getCanSort()) return <span>{label}</span>;

  return (
    <button
      type="button"
      className="cursor-pointer select-none hover:text-content-text-primary w-full text-left"
      onClick={() => column.toggleSorting()}
    >
      <span className={column.getIsSorted() ? "text-content-text-primary font-semibold" : ""}>{label}</span>
      <span className={column.getIsSorted() ? "text-brand-primary ml-1" : "ml-1"}>
        {column.getIsSorted() === "asc" ? (
          <ArrowUpIcon className="h-4 w-4 inline" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDownIcon className="h-4 w-4 inline" />
        ) : (
          <ArrowUpDown className="h-4 w-4 inline" />
        )}
      </span>
    </button>
  );
}

export function createPerformanceColumns(options: PerformanceColumnOptions): ColumnDef<SongPagePerformance, unknown>[] {
  const { showSongColumn, showAllTimerColumn, songTitle, userRatingMap, isAuthenticated } = options;
  const columnHelper = createColumnHelper<SongPagePerformance>();
  const columns: ColumnDef<SongPagePerformance, unknown>[] = [];

  if (showSongColumn) {
    columns.push(
      columnHelper.accessor((row) => row.songTitle || "", {
        id: "song",
        header: ({ column }) => <SortableHeader column={column} label="Song" />,
        enableSorting: true,
        sortingFn: "alphanumeric",
        cell: (info) => {
          const title = info.getValue() as string;
          const slug = info.row.original.songSlug;
          return slug ? (
            <a href={`/songs/${slug}`} className="text-base text-brand-primary hover:text-brand-secondary font-medium">
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
    columns.push(
      columnHelper.accessor((row) => row.allTimer ?? false, {
        id: "allTimer",
        header: "",
        meta: { width: "24px" },
        enableSorting: false,
        cell: (info) => (info.getValue() ? <Flame className="h-3.5 w-3.5 text-orange-500" /> : null),
      }) as ColumnDef<SongPagePerformance, unknown>,
    );
  }

  columns.push(
    columnHelper.accessor("show.date", {
      id: "date",
      meta: { width: "120px" },
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      enableSorting: true,
      sortingFn: "datetime",
      cell: (info) => (
        <a
          href={`/shows/${info.row.original.show.slug}`}
          className="text-base text-brand-primary hover:text-brand-secondary"
        >
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
      meta: { width: "48px" },
      enableSorting: false,
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
        enableSorting: false,
        cell: (info) => {
          const { before, after, currentSong } = info.getValue();
          const parts = [];

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

          parts.push(
            <span key="current" className="font-bold" style={{ color: "#DDD6FE" }}>
              {currentSong}
            </span>,
          );

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
        enableSorting: false,
        cell: (info) => {
          const { annotations, notes } = info.getValue();
          const items = [];

          if (annotations && annotations.length > 0) {
            for (const annotation of annotations) {
              if (annotation.desc) {
                items.push(annotation.desc);
              }
            }
          }

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
      header: ({ column }) => <SortableHeader column={column} label="Rating" />,
      enableSorting: true,
      sortingFn: "basic",
      cell: (info) => {
        const rating = info.getValue();
        const ratingsCount = info.row.original.ratingsCount;
        const trackId = info.row.original.trackId;
        const showSlug = info.row.original.show.slug;
        const userRating = userRatingMap.get(trackId) ?? null;
        return (
          <TrackRatingCell
            trackId={trackId}
            showSlug={showSlug}
            initialRating={rating || null}
            ratingsCount={ratingsCount || null}
            userRating={userRating}
            isAuthenticated={isAuthenticated}
          />
        );
      },
    }) as ColumnDef<SongPagePerformance, unknown>,
  );

  return columns;
}
