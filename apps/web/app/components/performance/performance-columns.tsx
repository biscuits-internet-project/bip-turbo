import { compareByShowDate, type SongPagePerformance } from "@bip/domain";
import { type Column, type ColumnDef, createColumnHelper, type Row } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, Filter, Flame, RotateCcw, Star } from "lucide-react";
import { GapIcon } from "~/components/gap-icon";
import { formatSetLabel } from "~/components/setlist/set-label";
import { ShowDate } from "~/components/show-date";
import { CombinedNotes } from "./combined-notes";
import { DateVenueCell } from "./date-venue-cell";
import { TrackRatingCell } from "./track-rating-cell";

/**
 * Sort comparator for any gap-flavored column. Debuts (gap=null) sort first
 * because a debut is the rarest possible event; remaining rows sort by gap
 * ascending. Ties break by show date so all rows from the same show —
 * including within-show repeats, which share both gap and date — cluster
 * together; track position is the final tiebreak so within-show repeats
 * stay in setlist order relative to each other.
 *
 * Parameterized by `key` so the same comparator drives both Gap (`gap`)
 * and Filtered Gap (`filteredGap`).
 */
function makeGapSortingFn(key: "gap" | "filteredGap") {
  return (a: Row<SongPagePerformance>, b: Row<SongPagePerformance>): number => {
    const aGap = a.original[key];
    const bGap = b.original[key];
    const aKey = aGap == null ? Number.NEGATIVE_INFINITY : aGap;
    const bKey = bGap == null ? Number.NEGATIVE_INFINITY : bGap;
    if (aKey !== bKey) return aKey - bKey;
    const dateCmp = compareByShowDate(a.original, b.original);
    if (dateCmp !== 0) return dateCmp;
    return (a.original.position ?? 0) - (b.original.position ?? 0);
  };
}

export const gapSortingFn = makeGapSortingFn("gap");
export const filteredGapSortingFn = makeGapSortingFn("filteredGap");

/**
 * Shared cell renderer for Gap and Filtered Gap. Same icon semantics: ★
 * for a debut (null), ↺ for the second occurrence within the same show,
 * tabular number otherwise.
 */
function renderGapCell({ value, isRepeat }: { value: number | null | undefined; isRepeat: boolean }) {
  if (isRepeat) {
    return <GapIcon icon={<RotateCcw className="h-4 w-4 text-content-text-secondary" />} label="Same Show" />;
  }
  if (value == null) {
    return <GapIcon icon={<Star className="h-4 w-4 text-content-text-secondary" />} label="Debut" />;
  }
  return <span className="text-content-text-secondary tabular-nums">{value}</span>;
}

/**
 * Detects whether `row` is the second-or-later occurrence of its song
 * within the same show. The gap and filtered-gap values themselves are
 * shared across within-show repeats, so the icon — not the number —
 * distinguishes the repeat from its first occurrence.
 */
function isWithinShowRepeat(row: SongPagePerformance, allRows: Array<{ original: SongPagePerformance }>): boolean {
  return allRows.some(
    (other) => other.original.show.id === row.show.id && (other.original.position ?? 0) < (row.position ?? 0),
  );
}

interface PerformanceColumnOptions {
  showSongColumn?: boolean;
  showAllTimerColumn?: boolean;
  /**
   * Gap + Last Played are per-song signals. On surfaces that mix songs
   * (all-timers, on-this-day), pass `false` to hide both. Defaults true.
   */
  showGapColumns?: boolean;
  /**
   * When true, render the Filtered Gap column alongside the all-time Gap.
   * The route sets this from `hasNarrowingFilter` so the column only
   * appears when the filtered set differs from all-time.
   */
  hasNarrowingFilter?: boolean;
  songTitle?: string;
  userRatingMap: Map<string, number>;
  isAuthenticated: boolean;
}

function SortableHeader({
  column,
  label,
}: {
  column: Column<SongPagePerformance, unknown>;
  label: string | React.ReactNode;
}) {
  if (!column.getCanSort()) return <span>{label}</span>;

  return (
    <button
      type="button"
      className="cursor-pointer select-none hover:text-content-text-primary w-full text-left flex items-start gap-1"
      onClick={() => column.toggleSorting()}
    >
      <span className={column.getIsSorted() ? "text-content-text-primary font-semibold" : ""}>{label}</span>
      <span className={column.getIsSorted() ? "text-brand-primary" : ""}>
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
  const {
    showSongColumn,
    showAllTimerColumn,
    showGapColumns,
    hasNarrowingFilter,
    songTitle,
    userRatingMap,
    isAuthenticated,
  } = options;
  const includeGapColumns = showGapColumns !== false;
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
            <a
              href={`/songs/${slug}`}
              className="inline-block min-w-[10ch] text-base text-brand-primary hover:text-brand-secondary font-medium [overflow-wrap:anywhere]"
            >
              {title}
            </a>
          ) : (
            <span className="inline-block min-w-[10ch] text-content-text-secondary [overflow-wrap:anywhere]">
              {title}
            </span>
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
        // Flame icon sits flush against the row edge at every viewport —
        // the default cell padding (`px-1.5` on mobile, `sm:p-3` on
        // desktop) doubles the visual width of the column for no benefit.
        meta: { width: "24px", cellClassName: "px-0 sm:px-0" },
        enableSorting: false,
        cell: (info) => (info.getValue() ? <Flame className="h-3.5 w-3.5 text-orange-500" /> : null),
      }) as ColumnDef<SongPagePerformance, unknown>,
    );
  }

  columns.push(
    columnHelper.accessor("show.date", {
      id: "date",
      meta: { width: "180px" },
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      enableSorting: true,
      sortingFn: (a, b) => compareByShowDate(a.original, b.original),
      cell: (info) => {
        const date = info.getValue();
        const showSlug = info.row.original.show.slug;
        const venue = info.row.original.venue;
        return (
          <a href={`/shows/${showSlug}`} className="text-base text-brand-primary hover:text-brand-secondary block">
            <DateVenueCell
              date={<ShowDate date={date} />}
              venue={{ name: venue?.name, city: venue?.city, state: venue?.state }}
            />
          </a>
        );
      },
    }) as ColumnDef<SongPagePerformance, unknown>,
  );

  if (includeGapColumns) {
    columns.push(
      columnHelper.accessor((row) => row.gap ?? Number.NEGATIVE_INFINITY, {
        id: "gap",
        meta: { width: "64px" },
        header: ({ column }) => <SortableHeader column={column} label="Gap" />,
        enableSorting: true,
        sortingFn: gapSortingFn,
        cell: (info) => {
          const row = info.row.original;
          return renderGapCell({
            value: row.gap,
            isRepeat: isWithinShowRepeat(row, info.table.getCoreRowModel().rows),
          });
        },
      }) as ColumnDef<SongPagePerformance, unknown>,
    );
    if (hasNarrowingFilter) {
      columns.push(
        columnHelper.accessor((row) => row.filteredGap ?? Number.NEGATIVE_INFINITY, {
          id: "filteredGap",
          meta: { width: "72px" },
          header: ({ column }) => (
            <SortableHeader
              column={column}
              label={
                <span className="inline-flex items-center gap-1">
                  <Filter className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">Filtered</span>
                  Gap
                </span>
              }
            />
          ),
          enableSorting: true,
          sortingFn: filteredGapSortingFn,
          cell: (info) => {
            const row = info.row.original;
            return renderGapCell({
              value: row.filteredGap,
              isRepeat: isWithinShowRepeat(row, info.table.getCoreRowModel().rows),
            });
          },
        }) as ColumnDef<SongPagePerformance, unknown>,
      );
    }
    columns.push(
      columnHelper.accessor((row) => row.previousShow?.date ?? "", {
        id: "lastPlayed",
        meta: { width: "110px", hideOnMobile: true },
        header: ({ column }) => <SortableHeader column={column} label="Last Played" />,
        enableSorting: true,
        sortingFn: "alphanumeric",
        cell: (info) => {
          const previousShow = info.row.original.previousShow;
          if (!previousShow) {
            return <span className="text-content-text-tertiary">—</span>;
          }
          return (
            <a href={`/shows/${previousShow.slug}`} className="text-base text-brand-primary hover:text-brand-secondary">
              <ShowDate date={previousShow.date} />
            </a>
          );
        },
      }) as ColumnDef<SongPagePerformance, unknown>,
    );
  }

  columns.push(
    columnHelper.accessor("set", {
      header: "Set",
      meta: { width: "48px" },
      enableSorting: false,
      cell: (info) => {
        const set = info.getValue();
        if (!set) return <span className="text-content-text-tertiary">—</span>;
        // Cross-show table — we don't know the encore count of any one
        // show, so single-encore collapse (E1 → E) is left off here.
        return <span className="text-content-text-secondary">{formatSetLabel(set)}</span>;
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
        // Hidden on mobile only when there's a Song column already
        // competing for room — the song-detail page (no Song column)
        // has the slack to keep Sequence visible at narrow widths.
        meta: { hideOnMobile: Boolean(showSongColumn) },
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

          return parts.length > 0 ? (
            <div className="flex items-center flex-wrap [overflow-wrap:anywhere]">{parts}</div>
          ) : null;
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
        meta: { hideOnMobile: true },
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
