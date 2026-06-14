import { compareByShowDate, type SongPagePerformance } from "@bip/domain";
import { type Column, type ColumnDef, createColumnHelper, type Row } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, Filter, RotateCcw, Star } from "lucide-react";
import { GapIcon } from "~/components/gap-icon";
import { formatSetLabel } from "~/components/setlist/set-label";
import { ShowDate } from "~/components/show-date";
import { ShowDateLink } from "~/components/show-date-link";
import { AllTimerCell, allTimerColumnMeta } from "~/components/track/all-timer-cell";
import { DurationValue } from "~/components/track/duration-cell";
import { NumberCell } from "~/components/ui/number-cell";
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
 * Sort comparator for the Rating column. Tracks with the same community
 * average resolve by vote count first (more votes = more confidence in the
 * average), then by show date, then by position so within-show repeats with
 * matching rating + vote count stay in setlist order relative to each other.
 *
 * Missing ratings collapse to -Infinity so unrated rows cluster at the
 * bottom on desc and the top on asc, matching the Gap column's treatment
 * of debuts/repeats.
 */
export function ratingSortingFn(a: Row<SongPagePerformance>, b: Row<SongPagePerformance>): number {
  const aRating = a.original.rating ?? Number.NEGATIVE_INFINITY;
  const bRating = b.original.rating ?? Number.NEGATIVE_INFINITY;
  if (aRating !== bRating) return aRating - bRating;
  const aVotes = a.original.ratingsCount ?? 0;
  const bVotes = b.original.ratingsCount ?? 0;
  if (aVotes !== bVotes) return aVotes - bVotes;
  const dateCmp = compareByShowDate(a.original, b.original);
  if (dateCmp !== 0) return dateCmp;
  return (a.original.position ?? 0) - (b.original.position ?? 0);
}

/**
 * Adapt a SongPagePerformance row to the minimal Track-like shape the
 * shared AllTimerCell + TrackRatingOverlay expect. The performance DTO
 * uses `notes` (plural) for the note field and exposes the song title
 * at the top level rather than under `song.title`; this normalizes both.
 * Returns a structural subset of TrackLight — only the fields the
 * overlay actually reads — since fabricating a full TrackLight with
 * never-read defaults would be misleading.
 */
function trackFromPerformance(row: SongPagePerformance) {
  return {
    id: row.trackId,
    allTimer: row.allTimer ?? null,
    note: row.notes ?? null,
    song: { title: row.songTitle ?? "", slug: row.songSlug ?? "" },
    averageRating: row.rating ?? null,
    ratingsCount: row.ratingsCount ?? null,
    likesCount: 0,
  };
}

/**
 * Sort comparator factory for the Song Before / Song After columns. The
 * primary axis is the adjacent song's title (case-insensitive). The
 * tiebreaker reads the relevant segue field — segue rows sort ahead of
 * non-segue rows when titles tie so identical-title groups cluster
 * segue-first. Rows missing the adjacent song (set openers / closers)
 * sort last in ascending order.
 */
function makeAdjacentSongSortingFn(
  pickAdjacent: (row: SongPagePerformance) => { songTitle?: string | null } | undefined,
  pickSegue: (row: SongPagePerformance) => string | null | undefined,
) {
  return (a: Row<SongPagePerformance>, b: Row<SongPagePerformance>): number => {
    const aTitle = pickAdjacent(a.original)?.songTitle ?? null;
    const bTitle = pickAdjacent(b.original)?.songTitle ?? null;
    if (aTitle === null && bTitle === null) return 0;
    if (aTitle === null) return 1;
    if (bTitle === null) return -1;
    const titleCmp = aTitle.localeCompare(bTitle, undefined, { sensitivity: "base" });
    if (titleCmp !== 0) return titleCmp;
    const aSegue = !!pickSegue(a.original);
    const bSegue = !!pickSegue(b.original);
    if (aSegue === bSegue) return 0;
    return aSegue ? -1 : 1;
  };
}

export const songBeforeSortingFn = makeAdjacentSongSortingFn(
  (row) => row.songBefore,
  // The incoming segue lives on the prior track, surfaced via songBefore.segue.
  (row) => row.songBefore?.segue,
);
export const songAfterSortingFn = makeAdjacentSongSortingFn(
  (row) => row.songAfter,
  // The outgoing segue lives on the CURRENT row — it describes whether
  // the current track segued into the next one.
  (row) => row.segue,
);

/**
 * Shared cell renderer for Gap and Filtered Gap. Same icon semantics: ★
 * for a debut (null), ↺ for the second occurrence within the same show,
 * tabular number otherwise.
 */
function renderGapCell({ value, isRepeat }: { value: number | null | undefined; isRepeat: boolean }) {
  if (isRepeat) {
    return (
      <NumberCell width="3ch">
        <GapIcon icon={<RotateCcw className="h-4 w-4 text-content-text-secondary" />} label="Same Show" />
      </NumberCell>
    );
  }
  if (value == null) {
    return (
      <NumberCell width="3ch">
        <GapIcon icon={<Star className="h-4 w-4 text-content-text-secondary" />} label="Debut" />
      </NumberCell>
    );
  }
  return (
    <NumberCell width="3ch" className="text-content-text-secondary">
      {value}
    </NumberCell>
  );
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
   * When true (and `showAllTimerColumn` is on), keep the flame column
   * visible on mobile and instead hide the Set column there — the
   * noteworthy marker is the critical signal on jam-charts surfaces,
   * while the set number is secondary in that context.
   */
  mobileFlamePriority?: boolean;
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
      className="cursor-pointer select-none hover:text-content-text-primary w-full text-left flex flex-wrap items-start gap-x-1"
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
    mobileFlamePriority,
    showGapColumns,
    hasNarrowingFilter,
    userRatingMap,
    isAuthenticated,
  } = options;
  const includeGapColumns = showGapColumns !== false;
  const columnHelper = createColumnHelper<SongPagePerformance>();
  const columns: ColumnDef<SongPagePerformance, unknown>[] = [];

  // AllTimer column comes first so the flame anchors the leftmost slot
  // on the surfaces that show it (jam-charts, song-detail jam-charts +
  // all-performances tabs) — the visual hierarchy reads "noteworthy
  // marker → song/date → context columns" left to right.
  if (showAllTimerColumn) {
    columns.push(
      columnHelper.accessor((row) => row.allTimer ?? false, {
        id: "allTimer",
        header: "",
        // Hidden on mobile by default — the Set cell renders the flame
        // inline on phones to recover the 16px this column would
        // otherwise consume. `mobileFlamePriority` flips that on
        // jam-charts surfaces where the marker is the critical signal
        // and the Set column hides on mobile instead.
        meta: { ...allTimerColumnMeta, hideOnMobile: !mobileFlamePriority },
        enableSorting: false,
        cell: (info) => <AllTimerCell track={trackFromPerformance(info.row.original)} />,
      }) as ColumnDef<SongPagePerformance, unknown>,
    );
  }

  if (showSongColumn) {
    columns.push(
      columnHelper.accessor((row) => row.songTitle || "", {
        id: "song",
        header: ({ column }) => <SortableHeader column={column} label="Song" />,
        // Cross-song surfaces (this column only renders there): the song
        // title is the primary signal, so it claims a large share of the
        // leftover space against the secondary date / context columns.
        meta: { weight: 3 },
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

  columns.push(
    columnHelper.accessor("show.date", {
      id: "date",
      // Desktop: weight 3 gives room for "MMM D, YYYY" + a venue line
      // (DateVenueCell's @container/datecell drops the venue when the
      // column gets squeezed). Mobile: fixed 5rem fits "M/D/YYYY" on one
      // line and locks the column so the song-before / song-after flex
      // columns can claim the rest.
      meta: { weight: 3, mobileFixedWidth: "5rem" },
      header: ({ column }) => <SortableHeader column={column} label="Date" />,
      enableSorting: true,
      sortingFn: (a, b) => compareByShowDate(a.original, b.original),
      cell: (info) => {
        const date = info.getValue();
        const showSlug = info.row.original.show.slug;
        const venue = info.row.original.venue;
        const track = trackFromPerformance(info.row.original);
        return (
          <div className="flex flex-col gap-0.5">
            <a href={`/shows/${showSlug}`} className="text-base text-brand-primary hover:text-brand-secondary block">
              <DateVenueCell
                date={<ShowDate date={date} />}
                venue={{ name: venue?.name, city: venue?.city, state: venue?.state }}
              />
            </a>
            {!showSongColumn && (
              <span className="sm:hidden">
                <AllTimerCell track={track} align="start" />
              </span>
            )}
          </div>
        );
      },
    }) as ColumnDef<SongPagePerformance, unknown>,
  );

  // Track length, sitting between Date and Gap. Hidden on mobile — the row is
  // already dense. Always present (incl. cross-song surfaces like all-timers /
  // on-this-day); rows without a resolved duration render an em-dash.
  columns.push(
    columnHelper.accessor((row) => row.duration ?? Number.NEGATIVE_INFINITY, {
      id: "duration",
      meta: { fixedWidth: "4.5rem", hideOnMobile: true },
      header: ({ column }) => <SortableHeader column={column} label="Time" />,
      enableSorting: true,
      sortingFn: (a, b) => {
        const av = a.original.duration ?? -1;
        const bv = b.original.duration ?? -1;
        if (av !== bv) return av - bv;
        return compareByShowDate(a.original, b.original);
      },
      sortDescFirst: true,
      cell: (info) => (
        <NumberCell width="5ch">
          <DurationValue seconds={info.row.original.duration} />
        </NumberCell>
      ),
    }) as ColumnDef<SongPagePerformance, unknown>,
  );

  if (includeGapColumns) {
    columns.push(
      columnHelper.accessor((row) => row.gap ?? Number.NEGATIVE_INFINITY, {
        id: "gap",
        meta: { fixedWidth: "3.5rem", mobileFixedWidth: "2rem" },
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
          meta: { fixedWidth: "3.5rem", mobileFixedWidth: "2rem" },
          header: ({ column }) => (
            <SortableHeader
              column={column}
              label={
                <span className="flex flex-col items-start leading-tight">
                  <Filter className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">Filtered</span>
                  <span>Gap</span>
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
        meta: { fixedWidth: "5rem", hideOnMobile: true },
        header: ({ column }) => <SortableHeader column={column} label="Last Played" />,
        enableSorting: true,
        sortingFn: "alphanumeric",
        cell: (info) => <ShowDateLink show={info.row.original.previousShow} />,
      }) as ColumnDef<SongPagePerformance, unknown>,
    );
  }

  if (showSongColumn) {
    // Cross-song surfaces (e.g. /songs/all-timers, /on-this-day) bring
    // Set back as a column — when rows span many shows, the set label
    // ("1", "E1") is the only on-row hint of where in the show this
    // happened. On the single-song surfaces (/songs/:slug) Set was
    // removed because every row's set is in the surrounding context.
    columns.push(
      columnHelper.accessor("set", {
        id: "set",
        header: "Set",
        meta: { fixedWidth: "2.5rem", hideOnMobile: mobileFlamePriority },
        enableSorting: false,
        cell: (info) => {
          const set = info.getValue();
          return (
            <NumberCell width="2ch" className={set ? "text-content-text-secondary" : "text-content-text-tertiary"}>
              {set ? formatSetLabel(set, { encoresInSet: info.row.original.encoresInSet }) : "—"}
            </NumberCell>
          );
        },
      }) as ColumnDef<SongPagePerformance, unknown>,
    );
  }

  columns.push(
    columnHelper.accessor((row) => row.songBefore, {
      id: "songBefore",
      header: ({ column }) => <SortableHeader column={column} label="Song Before" />,
      enableSorting: true,
      sortingFn: songBeforeSortingFn,
      // Cross-song surfaces hide adjacency on mobile — too many columns
      // to fit. Per-song surfaces keep them visible (user-requested).
      meta: { weight: 1.6, hideOnMobile: showSongColumn },
      cell: (info) => {
        const before = info.getValue();
        if (!before?.songTitle) return null;
        // Arrow renders only on segues; its absence implicitly signals a non-segue.
        return (
          <span>
            <a href={`/songs/${before.songSlug}`} className="text-content-text-secondary hover:text-brand-primary">
              {before.songTitle}
            </a>
            {before.segue && <span className="text-content-text-tertiary"> &gt;</span>}
          </span>
        );
      },
    }) as ColumnDef<SongPagePerformance, unknown>,
    columnHelper.accessor((row) => row.songAfter, {
      id: "songAfter",
      header: ({ column }) => <SortableHeader column={column} label="Song After" />,
      enableSorting: true,
      sortingFn: songAfterSortingFn,
      meta: { weight: 1.6, hideOnMobile: showSongColumn },
      cell: (info) => {
        const after = info.getValue();
        if (!after?.songTitle) return null;
        const outgoingSegue = info.row.original.segue;
        return (
          <span>
            {outgoingSegue && <span className="text-content-text-tertiary">&gt; </span>}
            <a href={`/songs/${after.songSlug}`} className="text-content-text-secondary hover:text-brand-primary">
              {after.songTitle}
            </a>
          </span>
        );
      },
    }) as ColumnDef<SongPagePerformance, unknown>,
    columnHelper.accessor(
      (row) => ({
        annotations: row.annotations,
        notes: row.notes,
      }),
      {
        id: "notes",
        header: "Notes",
        enableSorting: false,
        meta: { weight: 2.8, hideOnMobile: true },
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
      // Rating ties resolve to vote count (more votes = more confidence),
      // then show date, then track position — same chain as gapSortingFn so
      // identical-rating runs across multiple shows still read in a stable
      // order. Sort defaults to descending ("best first") via sortDescFirst.
      sortingFn: ratingSortingFn,
      sortDescFirst: true,
      // Sized for the busiest badge form: "★ 5.00 · 999 | 4½" — community
      // average + 3-digit vote count + the viewer's own half-step rating
      // (4½ is the widest valid user value; ratings cap at 5). Measured at
      // ~120px on desktop / ~103px on mobile. Desktop 8.25rem (132px)
      // leaves ~12px slack; mobile 6.75rem (108px) leaves ~5px so typical
      // rows (no user rating, 1-2 digit count) don't carry obvious empty
      // space. The 5-star editor pops in a popover that overlays the
      // badge, so the column doesn't need a wider expanded state.
      meta: { fixedWidth: "8.25rem", mobileFixedWidth: "6.75rem" },
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
