import type { Show, Song } from "@bip/domain";
import type { ColumnDef, SortingFn } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Filter } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShowDate } from "~/components/show-date";
import { Button } from "~/components/ui/button";

/**
 * Inline funnel icon used to mark "this column / control is the filtered
 * variant". Drop-in replacement for the word "Filtered" so the header
 * compresses to one short token + the secondary word.
 */
function FilterMark() {
  return (
    <>
      <Filter className="h-3 w-3 inline-block shrink-0" aria-hidden="true" />
      <span className="sr-only">Filtered </span>
    </>
  );
}

interface SongWithShows extends Song {
  firstPlayedShow?: Show | null;
  lastPlayedShow?: Show | null;
  firstFilteredPlayedShow?: Show | null;
  lastFilteredPlayedShow?: Show | null;
}

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

// Filtered percent columns are already narrower (4 columns share the row
// with the all-time pair) so the extra decimal makes them feel cramped.
// Whole-percent reads cleanly enough — drop the decimal in the filtered
// variant only.
const wholePercentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
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

/**
 * Wraps a header's text content. Reserves a leading row that holds either
 * the funnel icon (filtered columns) or an invisible spacer of the same
 * height (non-filtered columns when any filtered column is visible). That
 * way every label's text starts on the same line — the icon-vs-no-icon
 * distinction lives one line above the words and doesn't push them down.
 *
 * `reserveIconRow` is false when no filtered columns are visible at all;
 * the spacer would just waste vertical space.
 */
function HeaderLabel({
  filtered,
  reserveIconRow,
  children,
}: {
  filtered?: boolean;
  reserveIconRow: boolean;
  children: ReactNode;
}) {
  const iconRow = filtered ? (
    <FilterMark />
  ) : reserveIconRow ? (
    <span className="block h-3" aria-hidden="true" />
  ) : null;
  return (
    <span className="flex flex-col leading-tight items-start">
      {iconRow}
      {children}
    </span>
  );
}

interface SortableColumnOptions {
  accessorKey: keyof SongWithShows;
  label: ReactNode;
  /** Hover tooltip; used when the visible label needs disambiguation in prose. */
  title?: string;
  width?: string;
  hideOnMobile?: boolean;
  cell: (row: SongWithShows) => ReactNode;
  sortingFn?: SortingFn<SongWithShows>;
  /**
   * True when the header reserves a top icon row (filter-icon or matching
   * spacer). The sort indicator gets pushed down by that row's height so it
   * sits on the same line as the text, not the icon.
   */
  reservesIconRow?: boolean;
}

/**
 * Standard sortable column on the /songs table: ghost-Button header with the
 * stacked-on-mobile / row-on-desktop layout, sort icon, and a cell renderer.
 * Centralizes the shared header chrome so adding a column is a few lines.
 */
function makeSortableColumn(opts: SortableColumnOptions): ColumnDef<SongWithShows> {
  // Push the sort indicator down to text-row height when the label
  // reserves an icon row on top; otherwise it would sit on the icon line
  // and look detached from the words below.
  const sortIconWrapperClass = opts.reservesIconRow ? "sm:mt-3" : "";
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
        <span className={sortIconWrapperClass}>{getSortIcon(column.getIsSorted())}</span>
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
function DateVenueCell({
  date,
  show,
  hideVenue,
  compact,
}: {
  date: Date | null;
  show?: Show | null;
  hideVenue?: boolean;
  compact?: boolean;
}): ReactNode {
  if (!date) return <span className="text-content-text-tertiary text-sm">—</span>;
  const dateBlock = <ShowDate date={date} compact={compact} />;
  const venueLine =
    show?.venue && !hideVenue ? (
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
  const titleColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "title",
    label: <HeaderLabel reserveIconRow={showFilteredPlays}>Song</HeaderLabel>,
    width: showFilteredPlays ? "14%" : "26%",
    cell: (song) => (
      <Link
        to={`/songs/${song.slug}`}
        className="inline-block min-w-[10ch] text-base text-brand-primary hover:text-brand-secondary font-medium [overflow-wrap:anywhere]"
      >
        {song.title}
      </Link>
    ),
  });

  const playsColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "timesPlayed",
    label: <HeaderLabel reserveIconRow={showFilteredPlays}>Plays</HeaderLabel>,
    width: showFilteredPlays ? "5%" : "8%",
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

  const filteredPlaysColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "filteredTimesPlayed",
    label: (
      <HeaderLabel filtered reserveIconRow>
        <span>Plays</span>
      </HeaderLabel>
    ),
    title: "Filtered Plays",
    width: "5%",
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

  // With filtered columns active the row is busy; both percent columns drop
  // their decimal so the all-time and filtered values read as a clean pair
  // at the same precision.
  const sinceDebutFormatter = showFilteredPlays ? wholePercentFormatter : percentFormatter;

  const percentSinceDebutColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "percentSinceDebut",
    label: (
      <HeaderLabel reserveIconRow={showFilteredPlays}>
        <span>Since</span>
        <span>Debut</span>
      </HeaderLabel>
    ),
    title: "% Since Debut",
    width: showFilteredPlays ? "7%" : "6%",
    hideOnMobile: true,
    cell: (song) =>
      dashOrSpan(
        song.percentSinceDebut !== null ? (
          <span className="whitespace-nowrap">{sinceDebutFormatter.format(song.percentSinceDebut)}</span>
        ) : null,
      ),
    sortingFn: nullsLastNumericSort("percentSinceDebut"),
  });

  const filteredPercentSinceDebutColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "filteredPercentSinceDebut",
    label: (
      <HeaderLabel filtered reserveIconRow>
        <span>Since</span>
        <span>First</span>
      </HeaderLabel>
    ),
    title: "Filtered Since First",
    width: "7%",
    hideOnMobile: true,
    cell: (song) =>
      dashOrSpan(
        song.filteredPercentSinceDebut != null ? (
          <span className="whitespace-nowrap">{sinceDebutFormatter.format(song.filteredPercentSinceDebut)}</span>
        ) : null,
      ),
    sortingFn: nullsLastNumericSort("filteredPercentSinceDebut"),
  });

  const avgGapColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "averageShowsPerPlay",
    label: (
      <HeaderLabel reserveIconRow={showFilteredPlays}>
        <span>Avg</span>
        <span>Gap</span>
      </HeaderLabel>
    ),
    width: "7%",
    hideOnMobile: true,
    cell: (song) => dashOrSpan(song.averageShowsPerPlay !== null ? song.averageShowsPerPlay.toFixed(1) : null),
    sortingFn: nullsLastNumericSort("averageShowsPerPlay"),
  });

  const filteredAvgGapColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "filteredAverageShowsPerPlay",
    label: (
      <HeaderLabel filtered reserveIconRow>
        <span>Avg</span>
        <span>Gap</span>
      </HeaderLabel>
    ),
    title: "Filtered Avg Gap",
    width: "7%",
    hideOnMobile: true,
    cell: (song) =>
      dashOrSpan(song.filteredAverageShowsPerPlay != null ? song.filteredAverageShowsPerPlay.toFixed(1) : null),
    sortingFn: nullsLastNumericSort("filteredAverageShowsPerPlay"),
  });

  const currentGapColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "showsSinceLastPlayed",
    // Spelled out vs. plain "Gap" so users can't confuse it with "Avg Gap"
    // on a quick scan. "to Now" anchors that this is the count up to today
    // (the filtered variant uses "to End" because its denominator stops
    // at the filter boundary).
    label: <HeaderLabel reserveIconRow={showFilteredPlays}>Gap to Now</HeaderLabel>,
    title: "Gap to Now",
    width: "7%",
    hideOnMobile: true,
    cell: (song) => dashOrSpan(song.showsSinceLastPlayed),
    sortingFn: nullsLastNumericSort("showsSinceLastPlayed"),
  });

  const filteredCurrentGapColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "filteredShowsSinceLastPlayed",
    label: (
      <HeaderLabel filtered reserveIconRow>
        <span>Gap to End</span>
      </HeaderLabel>
    ),
    title: "Filtered Gap to End",
    width: "7%",
    hideOnMobile: true,
    cell: (song) => dashOrSpan(song.filteredShowsSinceLastPlayed ?? null),
    sortingFn: nullsLastNumericSort("filteredShowsSinceLastPlayed"),
  });

  // When filtered columns are active the row is wider; drop the venue
  // sublabel and shrink the date columns to make room.
  const dateColumnWidth = showFilteredPlays ? "8%" : "22%";

  const lastPlayedColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "dateLastPlayed",
    label: <HeaderLabel reserveIconRow={showFilteredPlays}>Last Played</HeaderLabel>,
    width: dateColumnWidth,
    cell: (song) => (
      <DateVenueCell
        date={song.dateLastPlayed}
        show={song.lastPlayedShow}
        hideVenue={showFilteredPlays}
        compact={showFilteredPlays}
      />
    ),
  });

  const filteredLastPlayedColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "dateLastFilteredPlayed",
    label: (
      <HeaderLabel filtered reserveIconRow>
        Last
      </HeaderLabel>
    ),
    title: "Filtered Last Played",
    width: dateColumnWidth,
    cell: (song) => (
      <DateVenueCell
        date={song.dateLastFilteredPlayed ?? null}
        show={song.lastFilteredPlayedShow}
        hideVenue
        compact
      />
    ),
  });

  const firstPlayedColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "dateFirstPlayed",
    label: <HeaderLabel reserveIconRow={showFilteredPlays}>First Played</HeaderLabel>,
    width: dateColumnWidth,
    cell: (song) => (
      <DateVenueCell
        date={song.dateFirstPlayed}
        show={song.firstPlayedShow}
        hideVenue={showFilteredPlays}
        compact={showFilteredPlays}
      />
    ),
  });

  const filteredFirstPlayedColumn = makeSortableColumn({ reservesIconRow: showFilteredPlays,
    accessorKey: "dateFirstFilteredPlayed",
    label: (
      <HeaderLabel filtered reserveIconRow>
        First
      </HeaderLabel>
    ),
    title: "Filtered First Played",
    width: dateColumnWidth,
    cell: (song) => (
      <DateVenueCell
        date={song.dateFirstFilteredPlayed ?? null}
        show={song.firstFilteredPlayedShow}
        hideVenue
        compact
      />
    ),
  });

  const columns: ColumnDef<SongWithShows>[] = [titleColumn, playsColumn];
  if (showFilteredPlays) columns.push(filteredPlaysColumn);
  columns.push(percentSinceDebutColumn);
  if (showFilteredPlays) columns.push(filteredPercentSinceDebutColumn);
  columns.push(avgGapColumn);
  if (showFilteredPlays) columns.push(filteredAvgGapColumn);
  columns.push(currentGapColumn);
  if (showFilteredPlays) columns.push(filteredCurrentGapColumn);
  columns.push(lastPlayedColumn);
  if (showFilteredPlays) columns.push(filteredLastPlayedColumn);
  columns.push(firstPlayedColumn);
  if (showFilteredPlays) columns.push(filteredFirstPlayedColumn);
  return columns;
}
