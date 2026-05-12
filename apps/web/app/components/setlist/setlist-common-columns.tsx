import type { TrackLight } from "@bip/domain";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ShowDateLink } from "~/components/show-date-link";
import { SortableHeader } from "~/components/ui/sortable-header";
import { GapCell, type GapCellState } from "./gap-cell";
import { compareBySetThenPosition, countDistinctEncores, formatSetLabel } from "./set-label";

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
export function createShowDateLinkColumn<T>(opts: {
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
    // and last desc — matches what users expect for "—" rows.
    sortingFn: "alphanumeric",
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
export function createGapColumn<T>(opts: {
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
      sortingFn: "basic",
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
      meta: { width: "48px" },
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
      meta: { width: "56px", hideOnMobile: true },
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
    columnHelper.accessor((row) => row.song?.title ?? "", {
      id: "song",
      header: "Song",
      enableSorting: false,
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
