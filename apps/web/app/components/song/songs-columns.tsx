import type { Show, Song } from "@bip/domain";
import type { ColumnDef, SortingFn } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShowDate } from "~/components/show-date";
import { Button } from "~/components/ui/button";

interface SongWithShows extends Song {
  firstPlayedShow?: Show | null;
  lastPlayedShow?: Show | null;
}

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

function nullsLastNumericSort<K extends keyof SongWithShows>(key: K): SortingFn<SongWithShows> {
  return (rowA, rowB) => {
    const a = rowA.original[key] as number | null | undefined;
    const b = rowB.original[key] as number | null | undefined;
    const aMissing = a === null || a === undefined;
    const bMissing = b === null || b === undefined;
    // Sort nulls last on asc; TanStack negates the comparator for desc, which
    // flips the sign so nulls end up first on desc — exactly what we want.
    if (aMissing && bMissing) return 0;
    if (aMissing) return 1;
    if (bMissing) return -1;
    return (a as number) - (b as number);
  };
}

function getSortIcon(sortState: false | "asc" | "desc"): ReactNode {
  const className = "h-4 w-4";
  if (sortState === "asc") return <ArrowUp className={`${className} text-brand-primary`} />;
  if (sortState === "desc") return <ArrowDown className={`${className} text-brand-primary`} />;
  return <ArrowUpDown className={className} />;
}

const HEADER_BUTTON_CLASS =
  "h-auto p-0 font-semibold text-left justify-start hover:bg-brand-primary/10 hover:text-brand-primary transition-colors whitespace-normal leading-tight flex-col items-start gap-0 sm:flex-row sm:items-start sm:gap-1";

interface SortableColumnOptions {
  accessorKey: keyof SongWithShows;
  label: ReactNode;
  /** Hover tooltip; used when `label` is a shorthand (e.g. "Gap" → "Current Gap"). */
  title?: string;
  width?: string;
  hideOnMobile?: boolean;
  cell: (row: SongWithShows) => ReactNode;
  sortingFn?: SortingFn<SongWithShows>;
}

/**
 * Standard sortable column on the /songs table: ghost-Button header with the
 * stacked-on-mobile / row-on-desktop layout, sort icon, and a cell renderer.
 * Centralizes the shared header chrome so adding a column is a few lines.
 */
function makeSortableColumn(opts: SortableColumnOptions): ColumnDef<SongWithShows> {
  const def: ColumnDef<SongWithShows> = {
    accessorKey: opts.accessorKey,
    meta: { width: opts.width, hideOnMobile: opts.hideOnMobile },
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        title={opts.title}
        className={HEADER_BUTTON_CLASS}
      >
        {opts.label}
        {getSortIcon(column.getIsSorted())}
      </Button>
    ),
    cell: ({ row }) => opts.cell(row.original),
  };
  if (opts.sortingFn) def.sortingFn = opts.sortingFn;
  return def;
}

/**
 * Renders a date with optional link to the show and a venue sublabel under
 * the date. Used by both Last Played and First Played columns — the only
 * difference between them is which date/show pair feeds in.
 */
function DateVenueCell({ date, show }: { date: Date | null; show?: Show | null }): ReactNode {
  if (!date) return <span className="text-content-text-tertiary text-sm">—</span>;
  const dateBlock = <ShowDate date={date} />;
  const venueLine = show?.venue ? (
    <div className="text-content-text-tertiary text-sm hidden sm:block">
      {show.venue.name}, {show.venue.city} {show.venue.state}
    </div>
  ) : null;
  if (show?.slug) {
    return (
      <Link to={`/shows/${show.slug}`} className="text-brand-primary hover:text-brand-secondary transition-colors">
        <div>{dateBlock}</div>
        {venueLine}
      </Link>
    );
  }
  return (
    <div>
      <div className="text-content-text-secondary">{dateBlock}</div>
      {venueLine}
    </div>
  );
}

function dashOrSpan(content: ReactNode | null | undefined, className = "text-content-text-primary"): ReactNode {
  if (content === null || content === undefined) return <span className="text-content-text-tertiary text-sm">—</span>;
  return <span className={className}>{content}</span>;
}

interface GetSongsColumnsOptions {
  showFilteredPlays: boolean;
}

/**
 * Produces the column definitions for the /songs table. The "Filtered Plays"
 * column is inserted only when a filter scope is active (time range, toggles,
 * tab-level extraParams, etc.); when absent, "Plays" alone represents all-time
 * counts.
 */
export function getSongsColumns({ showFilteredPlays }: GetSongsColumnsOptions): ColumnDef<SongWithShows>[] {
  const titleColumn = makeSortableColumn({
    accessorKey: "title",
    label: "Song",
    width: showFilteredPlays ? "22%" : "26%",
    cell: (song) => (
      <Link
        to={`/songs/${song.slug}`}
        className="inline-block min-w-[10ch] text-base text-brand-primary hover:text-brand-secondary font-medium [overflow-wrap:anywhere]"
      >
        {song.title}
      </Link>
    ),
  });

  const playsColumn = makeSortableColumn({
    accessorKey: "timesPlayed",
    label: "Plays",
    width: "8%",
    // When Filtered Plays is also visible there isn't room for both count
    // columns on mobile; the all-time count drops out at narrow widths.
    hideOnMobile: showFilteredPlays,
    cell: (song) =>
      song.timesPlayed > 0 ? (
        <span className="text-content-text-primary font-semibold">{song.timesPlayed}</span>
      ) : (
        <span className="text-content-text-tertiary text-sm italic">Never performed</span>
      ),
  });

  const filteredPlaysColumn = makeSortableColumn({
    accessorKey: "filteredTimesPlayed",
    label: "Filtered Plays",
    width: "10%",
    cell: (song) => {
      const plays = song.filteredTimesPlayed ?? 0;
      return plays > 0 ? (
        <span className="text-content-text-primary font-medium">{plays}</span>
      ) : (
        <span className="text-content-text-tertiary text-sm">—</span>
      );
    },
    sortingFn: (rowA, rowB) => {
      const aFiltered = rowA.original.filteredTimesPlayed ?? 0;
      const bFiltered = rowB.original.filteredTimesPlayed ?? 0;
      if (aFiltered !== bFiltered) return aFiltered - bFiltered;
      // Same direction tiebreaker on all-time Plays — TanStack flips the
      // sign of the whole comparator for desc, so the secondary sort
      // automatically follows the primary direction.
      return rowA.original.timesPlayed - rowB.original.timesPlayed;
    },
  });

  const percentSinceDebutColumn = makeSortableColumn({
    accessorKey: "percentSinceDebut",
    label: (
      <span className="flex flex-col leading-tight">
        <span>Since</span>
        <span>Debut</span>
      </span>
    ),
    title: "% Since Debut",
    width: showFilteredPlays ? "8%" : "6%",
    hideOnMobile: true,
    cell: (song) =>
      dashOrSpan(song.percentSinceDebut !== null ? percentFormatter.format(song.percentSinceDebut) : null),
    sortingFn: nullsLastNumericSort("percentSinceDebut"),
  });

  const avgGapColumn = makeSortableColumn({
    accessorKey: "averageShowsPerPlay",
    label: (
      <span className="flex flex-col leading-tight">
        <span>Avg</span>
        <span>Gap</span>
      </span>
    ),
    width: "7%",
    hideOnMobile: true,
    cell: (song) => dashOrSpan(song.averageShowsPerPlay !== null ? song.averageShowsPerPlay.toFixed(1) : null),
    sortingFn: nullsLastNumericSort("averageShowsPerPlay"),
  });

  const currentGapColumn = makeSortableColumn({
    accessorKey: "showsSinceLastPlayed",
    label: "Gap",
    title: "Current Gap",
    width: "7%",
    hideOnMobile: true,
    cell: (song) => dashOrSpan(song.showsSinceLastPlayed),
    sortingFn: nullsLastNumericSort("showsSinceLastPlayed"),
  });

  const lastPlayedColumn = makeSortableColumn({
    accessorKey: "dateLastPlayed",
    label: "Last Played",
    width: "22%",
    cell: (song) => <DateVenueCell date={song.dateLastPlayed} show={song.lastPlayedShow} />,
  });

  const firstPlayedColumn = makeSortableColumn({
    accessorKey: "dateFirstPlayed",
    label: "First Played",
    width: "22%",
    cell: (song) => <DateVenueCell date={song.dateFirstPlayed} show={song.firstPlayedShow} />,
  });

  const columns: ColumnDef<SongWithShows>[] = [titleColumn, playsColumn];
  if (showFilteredPlays) columns.push(filteredPlaysColumn);
  columns.push(percentSinceDebutColumn, avgGapColumn, currentGapColumn, lastPlayedColumn, firstPlayedColumn);
  return columns;
}
