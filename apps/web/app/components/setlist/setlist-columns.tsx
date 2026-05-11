import type { TrackLight } from "@bip/domain";
import { type Column, type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpDown, ArrowUpIcon, RotateCcw, Star } from "lucide-react";
import { GapIcon } from "~/components/gap-icon";
import { ShowDate } from "~/components/show-date";
import { countDistinctEncores, formatSetLabel } from "./set-label";

/**
 * Row shape consumed by the gap-chart table. Narrowed from the full Setlist
 * tree so the column factory doesn't depend on Set/Show/Venue context —
 * just a TrackLight with the denormalized gap + previous-performance fields.
 */
export type SetlistTableRow = TrackLight;

/**
 * Numeric sort key for a set label. Mirrors the server-side composer so the
 * client default sort matches the order the loader already produced. Sets
 * before encores; soundcheck before everything; unknowns at the end.
 */
function setSortKey(label: string): number {
  const upper = label.toUpperCase();
  if (label.toLowerCase() === "soundcheck") return 0;
  if (upper === "S1") return 10;
  if (upper === "S2") return 20;
  if (upper === "S3") return 30;
  if (upper === "S4") return 40;
  if (upper === "E1") return 50;
  if (upper === "E2") return 60;
  if (upper === "E3") return 70;
  return 999;
}

/**
 * Sort comparator shared by the Set and Track columns. Both produce the
 * same ordering — set bucket first, then track position within the set —
 * because sorting on either should restore the canonical narrative order
 * the composer already returns.
 */
function compareBySetThenPosition(a: SetlistTableRow, b: SetlistTableRow): number {
  const setDiff = setSortKey(a.set) - setSortKey(b.set);
  if (setDiff !== 0) return setDiff;
  return a.position - b.position;
}

function SortableHeader({ column, label }: { column: Column<SetlistTableRow, unknown>; label: string }) {
  if (!column.getCanSort()) return <span>{label}</span>;
  return (
    <button
      type="button"
      className="cursor-pointer select-none hover:text-content-text-primary text-left"
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

/**
 * Columns for the SetlistCard "gap chart" view. Order is locked at
 * [Set, Track #, Song, Gap, Last Played]. Within-show repeats are detected
 * from the row's table context — a track whose songId already appeared at
 * an earlier position in the same render.
 */
export function createSetlistColumns(): ColumnDef<SetlistTableRow, unknown>[] {
  const columnHelper = createColumnHelper<SetlistTableRow>();

  return [
    columnHelper.accessor("set", {
      id: "set",
      header: ({ column }) => <SortableHeader column={column} label="Set" />,
      meta: { width: "48px" },
      enableSorting: true,
      sortingFn: (a, b) => compareBySetThenPosition(a.original, b.original),
      cell: (info) => {
        const raw = info.getValue();
        const encoresInSet = countDistinctEncores(info.table.getCoreRowModel().rows.map((r) => r.original));
        // When the active sort IS the Set column, runs of same-set rows
        // cluster together — show the label only on the first row of each
        // run so the grouping is visually obvious. Other sorts (Gap, Last
        // Played) interleave sets and need every row labeled.
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
    }) as ColumnDef<SetlistTableRow, unknown>,
    columnHelper.display({
      id: "track",
      header: ({ column }) => <SortableHeader column={column} label="Track" />,
      // Drops on narrow viewports — the Set column already orients the row,
      // and a tiny "Track #" column would steal width from Song on mobile.
      meta: { width: "56px", hideOnMobile: true },
      enableSorting: true,
      // Track # = position-within-set, computed at render time from the
      // unsorted row model. The comparator falls through to the same
      // set+position order as the Set column, so sorting either restores
      // the canonical narrative.
      sortingFn: (a, b) => compareBySetThenPosition(a.original, b.original),
      cell: (info) => {
        const row = info.row.original;
        const allRows = info.table.getCoreRowModel().rows;
        const trackNumber =
          allRows.filter((r) => r.original.set === row.set && r.original.position < row.position).length + 1;
        return <span className="text-content-text-secondary tabular-nums">{trackNumber}</span>;
      },
    }) as ColumnDef<SetlistTableRow, unknown>,
    columnHelper.accessor((row) => row.song?.title ?? "", {
      id: "song",
      header: "Song",
      enableSorting: false,
      cell: (info) => {
        const title = info.getValue() as string;
        const slug = info.row.original.song?.slug;
        const segue = info.row.original.segue;
        const titleNode = slug ? (
          <a href={`/songs/${slug}`} className="text-base text-brand-primary hover:text-brand-secondary font-medium">
            {title}
          </a>
        ) : (
          <span className="text-content-text-secondary">{title}</span>
        );
        // Preserve the flow view's segue marker so "Tractorbeam > Above the
        // Waves" still reads as a continuous run inside the table.
        return (
          <>
            {titleNode}
            {segue && <span className="text-content-text-secondary ml-1 font-medium">&gt;</span>}
          </>
        );
      },
    }) as ColumnDef<SetlistTableRow, unknown>,
    columnHelper.accessor((row) => row.gap ?? Number.POSITIVE_INFINITY, {
      id: "gap",
      header: ({ column }) => <SortableHeader column={column} label="Gap" />,
      meta: { width: "64px" },
      enableSorting: true,
      // Numeric ascending; debuts (gap=null) become +∞ so they cluster at
      // the end on asc and at the start on desc. Within-show repeats share
      // their first occurrence's gap value — sort treats them as equal and
      // the icon (not the value) tells the story per row.
      sortingFn: "basic",
      // First click sorts ascending. TanStack auto-flips to desc-first for
      // numeric accessors; force asc so "smallest gap first" matches the
      // mental model "what was the rarest play in this show."
      sortDescFirst: false,
      cell: (info) => {
        const row = info.row.original;
        const allRows = info.table.getCoreRowModel().rows;
        const isRepeat = allRows.some(
          (other) => other.original.songId === row.songId && other.original.position < row.position,
        );
        if (isRepeat) {
          return <GapIcon icon={<RotateCcw className="h-4 w-4 text-content-text-secondary" />} label="This Show" />;
        }
        if (row.gap == null) {
          return <GapIcon icon={<Star className="h-4 w-4 text-content-text-secondary" />} label="Debut" />;
        }
        return <span className="text-content-text-secondary tabular-nums">{row.gap}</span>;
      },
    }) as ColumnDef<SetlistTableRow, unknown>,
    columnHelper.accessor((row) => row.previousPerformanceShow?.date ?? "", {
      id: "lastPlayed",
      header: ({ column }) => <SortableHeader column={column} label="Last Played" />,
      meta: { width: "140px" },
      enableSorting: true,
      // YYYY-MM-DD strings sort lexicographically the same as chronologically,
      // so the default alphanumeric comparator is correct here. Empty strings
      // (debuts) sort to the start ascending, end descending.
      sortingFn: "alphanumeric",
      cell: (info) => {
        const prev = info.row.original.previousPerformanceShow;
        if (!prev) return <span className="text-content-text-tertiary">—</span>;
        return (
          <a href={`/shows/${prev.slug}`} className="text-base text-brand-primary hover:text-brand-secondary">
            <ShowDate date={prev.date} />
          </a>
        );
      },
    }) as ColumnDef<SetlistTableRow, unknown>,
  ];
}
