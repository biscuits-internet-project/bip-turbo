import type { TrackLight } from "@bip/domain";
import { type ColumnDef, createColumnHelper, type Row, type SortingFn } from "@tanstack/react-table";
import { TrackRatingCell } from "~/components/performance/track-rating-cell";
import { ShowDateLink } from "~/components/show-date-link";
import { AllTimerCell, allTimerColumnMeta } from "~/components/track/all-timer-cell";
import { SortableHeader } from "~/components/ui/sortable-header";
import { GapCell, type GapCellState } from "./gap-cell";
import { compareBySetThenPosition, countDistinctEncores, formatSetLabel } from "./set-label";

/**
 * Wraps a value-compare with the canonical set/track tiebreaker so two
 * rows with the same Gap, Rating, Song title, or Last-Played date still
 * resolve to a stable canonical order ("S1 #3 before S1 #4" etc.). Used
 * by every sortable column in the setlist views except Set/Track
 * themselves (which already sort on set+position).
 */
function withSetPositionTiebreak<T extends TrackLight>(primary: (a: T, b: T) => number): SortingFn<T> {
  return (rowA: Row<T>, rowB: Row<T>) => {
    const cmp = primary(rowA.original, rowB.original);
    if (cmp !== 0) return cmp;
    return compareBySetThenPosition(rowA.original, rowB.original);
  };
}

/**
 * Per-row inputs the rating column needs that the row itself doesn't carry:
 * the show slug (target of any rating mutation), the viewer's rating map
 * (resolved from useTrackUserRatings at the table level), and the auth
 * state. Identical between the catalog and personal column factories.
 */
export interface SetlistRatingContext {
  showSlug: string;
  userRatingMap: Map<string, number>;
  isAuthenticated: boolean;
}

/**
 * Rightmost column for both gap-chart views: an interactive rating badge
 * per track. Reuses TrackRatingCell (compact RatingBadgeButton) so editing
 * skips route revalidation. Hidden on phone-portrait — the badge is small
 * but the row is already dense with Set / # / Song / Gap / Last X.
 */
export function createRatingColumn<T extends TrackLight>(ctx: SetlistRatingContext): ColumnDef<T, unknown> {
  const columnHelper = createColumnHelper<T>();
  // Sort by community average; unrated tracks (null) collapse to -Infinity
  // so they cluster at the bottom on desc and the top on asc. First click
  // sorts descending — "best rated first" matches the mental model when
  // scanning a setlist for highlights.
  return columnHelper.accessor((row) => row.averageRating ?? Number.NEGATIVE_INFINITY, {
    id: "rating",
    header: ({ column }) => <SortableHeader column={column} label="Rating" />,
    meta: { width: "120px", hideOnMobile: true },
    enableSorting: true,
    // Ties resolve to canonical set+position so "all unrated tracks" still
    // read top-to-bottom in the order they were played.
    sortingFn: withSetPositionTiebreak<T>(
      (a, b) => (a.averageRating ?? Number.NEGATIVE_INFINITY) - (b.averageRating ?? Number.NEGATIVE_INFINITY),
    ),
    sortDescFirst: true,
    cell: (info) => {
      const row = info.row.original;
      return (
        <TrackRatingCell
          trackId={row.id}
          showSlug={ctx.showSlug}
          initialRating={row.averageRating ?? null}
          ratingsCount={row.ratingsCount ?? null}
          userRating={ctx.userRatingMap.get(row.id) ?? null}
          isAuthenticated={ctx.isAuthenticated}
        />
      );
    },
  }) as ColumnDef<T, unknown>;
}

/**
 * Set, Track, and Song columns are identical across every SetlistCard
 * table view (gap chart, personal gap chart, and anything we add later).
 * Centralize them here so the per-view column factories can focus on
 * what's actually different (rarity stats, user-history columns, etc.).
 *
 * Generic over the concrete row type because callers attach extra fields
 * (e.g., `personal` on PersonalSetlistTableRow) — every row must still
 * extend TrackLight so the column accessors can read `set`/`position`/`song`.
 */
/**
 * Date-with-link column factory used by both view's "last X" columns —
 * gap-chart's "Last Played" and personal's "Last Seen". Centralizes the
 * accessor → header → ShowDateLink cell shape so the two call sites
 * differ only in id/label/width/visibility.
 */
export function createShowDateLinkColumn<T extends TrackLight>(opts: {
  id: string;
  label: string;
  accessor: (row: T) => { date: string; slug: string | null } | null | undefined;
  width: string;
  hideOnMobile?: boolean;
}): ColumnDef<T, unknown> {
  const columnHelper = createColumnHelper<T>();
  return columnHelper.accessor((row) => opts.accessor(row)?.date ?? "", {
    id: opts.id,
    header: ({ column }) => <SortableHeader column={column} label={opts.label} />,
    meta: opts.hideOnMobile ? { width: opts.width, hideOnMobile: true } : { width: opts.width },
    enableSorting: true,
    // ISO YYYY-MM-DD strings sort lexicographically the same as
    // chronologically. Empty strings (no prior performance) sort first asc
    // and last desc — matches what users expect for "—" rows. Ties resolve
    // to set+position so rows with the same prior date keep narrative order.
    sortingFn: withSetPositionTiebreak<T>((a, b) => {
      const aDate = opts.accessor(a)?.date ?? "";
      const bDate = opts.accessor(b)?.date ?? "";
      return aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
    }),
    cell: (info) => <ShowDateLink show={opts.accessor(info.row.original)} />,
  }) as ColumnDef<T, unknown>;
}

/**
 * Gap-style column factory used by both view's gap columns — gap-chart's
 * "Gap" and personal's "Your Gap". The caller supplies the row-level
 * state derivation (since the catalog reads from `Track.gap` + repeat
 * detection while personal reads a pre-computed discriminator) and the
 * tooltip labels; the column shape (header, width, sort, GapCell render)
 * is the same on both sides.
 */
export function createGapColumn<T extends TrackLight>(opts: {
  id: string;
  label: string;
  width: string;
  /** Row-level state — must be stable per row so sort + cell agree. */
  state: (row: T, allRows: ReadonlyArray<T>) => GapCellState;
  debutLabel: string;
  thisShowLabel: string;
}): ColumnDef<T, unknown> {
  const columnHelper = createColumnHelper<T>();
  // Sort accessor pulls the row's state once and turns non-count states
  // into +Infinity so debut/this-show rows cluster at the end on asc.
  return columnHelper.accessor(
    (row) => {
      // The accessor doesn't have allRows in scope; non-count states are
      // intrinsic to the row so pass an empty list — within-show-repeat
      // detection isn't needed for sorting either side's column.
      const s = opts.state(row, []);
      return s.kind === "count" ? s.value : Number.POSITIVE_INFINITY;
    },
    {
      id: opts.id,
      header: ({ column }) => <SortableHeader column={column} label={opts.label} />,
      meta: { width: opts.width },
      enableSorting: true,
      // Numeric compare with set+position tiebreaker — rows that share the
      // same gap value still read in canonical narrative order.
      sortingFn: withSetPositionTiebreak<T>((a, b) => {
        const av = opts.state(a, []);
        const bv = opts.state(b, []);
        const an = av.kind === "count" ? av.value : Number.POSITIVE_INFINITY;
        const bn = bv.kind === "count" ? bv.value : Number.POSITIVE_INFINITY;
        return an - bn;
      }),
      // First click sorts ascending — "smallest gap first" matches the
      // mental model "what was the rarest play."
      sortDescFirst: false,
      cell: (info) => {
        const allRows = info.table.getCoreRowModel().rows.map((r) => r.original);
        const state = opts.state(info.row.original, allRows);
        return <GapCell state={state} debutLabel={opts.debutLabel} thisShowLabel={opts.thisShowLabel} />;
      },
    },
  ) as ColumnDef<T, unknown>;
}

export function createSetlistCommonColumns<T extends TrackLight>(options?: {
  /** Optional query suffix appended to every Song-cell `/songs/{slug}` link. */
  songLinkSearchParams?: string;
}): ColumnDef<T, unknown>[] {
  const columnHelper = createColumnHelper<T>();
  const songLinkSuffix = options?.songLinkSearchParams ? `?${options.songLinkSearchParams}` : "";

  return [
    columnHelper.accessor((row) => row.set, {
      id: "set",
      header: ({ column }) => <SortableHeader column={column} label="Set" />,
      meta: { width: "36px" },
      enableSorting: true,
      sortingFn: (a, b) => compareBySetThenPosition(a.original, b.original),
      cell: (info) => {
        const raw = info.getValue() as string;
        const encoresInSet = countDistinctEncores(info.table.getCoreRowModel().rows.map((r) => r.original));
        // Show the set label only on the first row of a same-set run when
        // sorted by Set — keeps the grouping visually obvious. Other sorts
        // interleave sets, so every row keeps its label.
        const sorting = info.table.getState().sorting;
        const groupBySet = sorting.length > 0 && sorting[0].id === "set";
        if (groupBySet) {
          const sortedRows = info.table.getSortedRowModel().rows;
          const idx = sortedRows.findIndex((r) => r.id === info.row.id);
          if (idx > 0 && sortedRows[idx - 1].original.set === info.row.original.set) {
            return null;
          }
        }
        return <span className="text-content-text-secondary">{formatSetLabel(raw, { encoresInSet })}</span>;
      },
    }) as ColumnDef<T, unknown>,
    columnHelper.display({
      id: "track",
      header: ({ column }) => <SortableHeader column={column} label="Track" />,
      // Drops on narrow viewports — the Set column already orients the row,
      // and a tiny Track column would steal width from Song on mobile.
      meta: { width: "42px", hideOnMobile: true },
      enableSorting: true,
      // Track # = position-within-set, computed at render time from the
      // unsorted row model. The comparator falls through to the canonical
      // set+position order so sorting either restores narrative order.
      sortingFn: (a, b) => compareBySetThenPosition(a.original, b.original),
      cell: (info) => {
        const row = info.row.original;
        const allRows = info.table.getCoreRowModel().rows;
        const trackNumber =
          allRows.filter((r) => r.original.set === row.set && r.original.position < row.position).length + 1;
        return <span className="text-content-text-secondary tabular-nums">{trackNumber}</span>;
      },
    }) as ColumnDef<T, unknown>,
    columnHelper.display({
      id: "allTimer",
      header: () => null,
      meta: allTimerColumnMeta,
      enableSorting: false,
      cell: (info) => (info.row.original.allTimer ? <AllTimerCell /> : null),
    }) as ColumnDef<T, unknown>,
    columnHelper.accessor((row) => row.song?.title ?? "", {
      id: "song",
      header: ({ column }) => <SortableHeader column={column} label="Song" />,
      enableSorting: true,
      // Alphabetical title compare with set+position tiebreaker so back-
      // to-back same-name plays (rare but possible across two encores)
      // still resolve in canonical order.
      sortingFn: withSetPositionTiebreak<T>((a, b) => {
        const at = a.song?.title ?? "";
        const bt = b.song?.title ?? "";
        return at.localeCompare(bt);
      }),
      sortDescFirst: false,
      cell: (info) => {
        const title = info.getValue() as string;
        const slug = info.row.original.song?.slug;
        const segue = info.row.original.segue;
        const titleNode = slug ? (
          <a
            href={`/songs/${slug}${songLinkSuffix}`}
            className="text-base text-brand-primary hover:text-brand-secondary font-medium"
          >
            {title}
          </a>
        ) : (
          <span className="text-content-text-secondary">{title}</span>
        );
        // Preserve the flow view's segue marker so "Tractorbeam > Above
        // the Waves" still reads as a continuous run inside the table.
        return (
          <>
            {titleNode}
            {segue && <span className="text-content-text-secondary ml-1 font-medium">&gt;</span>}
          </>
        );
      },
    }) as ColumnDef<T, unknown>,
  ];
}
