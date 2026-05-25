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
  const iconRow = filtered ? <FilterMark /> : reserveIconRow ? <span className="block h-3" aria-hidden="true" /> : null;
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
  /**
   * Relative width share of *leftover* space under `table-layout: fixed`.
   * Defaults to 1. Use > 1 for text columns; ignored when `fixedWidth` is
   * set.
   */
  weight?: number;
  /** Fixed column width (e.g. `"3rem"`) for short-content columns that
   * shouldn't grow when the table widens. Wins over `weight`. */
  fixedWidth?: string;
  /** Mobile-specific fixed width — applied below the `sm` breakpoint.
   * Use when a column's mobile rendering has a knowable max (e.g. dates
   * without venue) and shouldn't gobble the leftover flex space that
   * primary columns need. */
  mobileFixedWidth?: string;
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
    meta: {
      weight: opts.weight,
      fixedWidth: opts.fixedWidth,
      mobileFixedWidth: opts.mobileFixedWidth,
      hideOnMobile: opts.hideOnMobile,
    },
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
 * the date. The cell is its own inline-size container, so the venue line
 * drops out automatically when the column gets squeezed (many columns picked
 * or a narrow layout) without callers passing a `hideVenue` flag. The date
 * format collapses to compact via ShowDate's own container query.
 */
function DateVenueCell({ date, show }: { date: Date | null; show?: Show | null }): ReactNode {
  if (!date) return <span className="text-content-text-tertiary text-sm">—</span>;
  const dateBlock = <ShowDate date={date} />;
  // Venue only shows at `sm` and above (mobile keeps each row tight to
  // a single date line), AND when the column is genuinely wide enough
  // to hold it on desktop.
  const venueLine = show?.venue ? (
    <div className="text-content-text-tertiary text-sm hidden sm:@[8rem]/datecell:block">
      {show.venue.name}, {show.venue.city} {show.venue.state}
    </div>
  ) : null;
  if (show?.slug) {
    return (
      <Link
        to={`/shows/${show.slug}`}
        className="@container/datecell block text-brand-primary hover:text-brand-secondary transition-colors"
      >
        <div>{dateBlock}</div>
        {venueLine}
      </Link>
    );
  }
  return (
    <div className="@container/datecell">
      <div className="text-content-text-secondary">{dateBlock}</div>
      {venueLine}
    </div>
  );
}

function dashOrSpan(content: ReactNode | null | undefined, className = "text-content-text-primary"): ReactNode {
  if (content === null || content === undefined) return <span className="text-content-text-tertiary text-sm">—</span>;
  return <span className={className}>{content}</span>;
}

/**
 * Right-aligns digits inside an inline-block sized to the column's widest
 * realistic value, so 1 / 10 / 100 stack with their ones digit aligned and
 * larger numbers extend further left. The block itself sits flush-left in
 * the cell (cells are left-aligned), so the whole column reads as
 * "left-anchored numbers with right-aligned digits" rather than as a
 * right-aligned column. `width` is the min-width of the slot in `ch`
 * units; tabular-nums makes every digit the same `0`-glyph width so the
 * digit columns actually align.
 */
function NumberCell({ width, className, children }: { width: string; className?: string; children: ReactNode }) {
  return (
    <span className={`inline-block text-right tabular-nums ${className ?? ""}`} style={{ minWidth: width }}>
      {children}
    </span>
  );
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
    reservesIconRow: showFilteredPlays,
    accessorKey: "title",
    // Dense view (filtered cols competing): Song needs a healthy share so
    // single-word titles like "Shem-Rah Boo" fit on one line. Sparse view
    // (2 date cols): Song should yield space to the date columns so their
    // venue sublabels read on 1-2 lines instead of being squeezed to 3+.
    weight: showFilteredPlays ? 3 : 1.5,
    // No mobileFixedWidth: on dense mobile the all-time pair columns are
    // hidden, so Song claims whatever leftover the 4 numeric + 2 date
    // filter cols leave. Single-word titles fit one line; multi-word wrap.
    label: <HeaderLabel reserveIconRow={showFilteredPlays}>Song</HeaderLabel>,
    cell: (song) => (
      <Link to={`/songs/${song.slug}`} className="text-base text-brand-primary hover:text-brand-secondary font-medium">
        {song.title}
      </Link>
    ),
  });

  const playsColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "timesPlayed",
    fixedWidth: "4rem",
    label: <HeaderLabel reserveIconRow={showFilteredPlays}>Plays</HeaderLabel>,
    // When Filtered Plays is also visible the all-time count is paired
    // beside it; mobile-hide on the dense layout keeps both legible.
    hideOnMobile: showFilteredPlays,
    cell: (song) =>
      song.timesPlayed > 0 ? (
        <NumberCell width="3ch" className="text-content-text-primary font-semibold">
          {song.timesPlayed}
        </NumberCell>
      ) : (
        <span className="text-content-text-tertiary text-sm italic">Never performed</span>
      ),
  });

  const filteredPlaysColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "filteredTimesPlayed",
    fixedWidth: "4rem",
    // Mobile dense view fits 4 numeric filter cols + 2 date filter cols
    // alongside Song. 2.5rem matches the other numeric filter cols so the
    // row reads as a consistent block, and filtered counts top out at ~36.
    mobileFixedWidth: "2.5rem",
    label: (
      <HeaderLabel filtered reserveIconRow>
        <span>Plays</span>
      </HeaderLabel>
    ),
    title: "Filtered Plays",
    cell: (song) => {
      const plays = song.filteredTimesPlayed ?? 0;
      return plays > 0 ? (
        <NumberCell width="3ch" className="text-content-text-primary font-medium">
          {plays}
        </NumberCell>
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

  const percentSinceDebutColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "percentSinceDebut",
    fixedWidth: "4rem",
    label: (
      <HeaderLabel reserveIconRow={showFilteredPlays}>
        <span>Since</span>
        <span>Debut</span>
      </HeaderLabel>
    ),
    title: "% Since Debut",
    hideOnMobile: true,
    cell: (song) =>
      dashOrSpan(
        song.percentSinceDebut !== null ? (
          <NumberCell width="6ch">{sinceDebutFormatter.format(song.percentSinceDebut)}</NumberCell>
        ) : null,
      ),
    sortingFn: nullsLastNumericSort("percentSinceDebut"),
  });

  const filteredPercentSinceDebutColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "filteredPercentSinceDebut",
    fixedWidth: "4rem",
    // Hidden on mobile: the dense layout already crams Plays + Avg Gap
    // + Gap to End + 2 date cols next to Song; this is the first filter
    // col to drop because it's a derivable summary (plays / total shows).
    hideOnMobile: true,
    label: (
      <HeaderLabel filtered reserveIconRow>
        <span>Since</span>
        <span>First</span>
      </HeaderLabel>
    ),
    title: "Filtered Since First",
    cell: (song) =>
      dashOrSpan(
        song.filteredPercentSinceDebut != null ? (
          <NumberCell width="5ch">{sinceDebutFormatter.format(song.filteredPercentSinceDebut)}</NumberCell>
        ) : null,
      ),
    sortingFn: nullsLastNumericSort("filteredPercentSinceDebut"),
  });

  const avgGapColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "averageGapShows",
    fixedWidth: "4rem",
    label: (
      <HeaderLabel reserveIconRow={showFilteredPlays}>
        <span>Avg</span>
        <span>Gap</span>
      </HeaderLabel>
    ),
    hideOnMobile: true,
    cell: (song) =>
      dashOrSpan(
        song.averageGapShows !== null ? <NumberCell width="4ch">{song.averageGapShows.toFixed(1)}</NumberCell> : null,
      ),
    sortingFn: nullsLastNumericSort("averageGapShows"),
  });

  const filteredAvgGapColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "filteredAverageGapShows",
    fixedWidth: "4rem",
    mobileFixedWidth: "2.5rem",
    label: (
      <HeaderLabel filtered reserveIconRow>
        <span>Avg</span>
        <span>Gap</span>
      </HeaderLabel>
    ),
    title: "Filtered Avg Gap",
    cell: (song) =>
      dashOrSpan(
        song.filteredAverageGapShows != null ? (
          <NumberCell width="4ch">{song.filteredAverageGapShows.toFixed(1)}</NumberCell>
        ) : null,
      ),
    sortingFn: nullsLastNumericSort("filteredAverageGapShows"),
  });

  const currentGapColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "showsSinceLastPlayed",
    fixedWidth: "4rem",
    // Spelled out vs. plain "Gap" so users can't confuse it with "Avg Gap"
    // on a quick scan. "to Now" anchors that this is the count up to today
    // (the filtered variant uses "to End" because its denominator stops
    // at the filter boundary).
    label: <HeaderLabel reserveIconRow={showFilteredPlays}>Gap to Now</HeaderLabel>,
    title: "Gap to Now",
    hideOnMobile: true,
    cell: (song) =>
      dashOrSpan(
        song.showsSinceLastPlayed != null ? <NumberCell width="4ch">{song.showsSinceLastPlayed}</NumberCell> : null,
      ),
    sortingFn: nullsLastNumericSort("showsSinceLastPlayed"),
  });

  const filteredCurrentGapColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "filteredShowsSinceLastPlayed",
    fixedWidth: "4rem",
    mobileFixedWidth: "2.5rem",
    label: (
      <HeaderLabel filtered reserveIconRow>
        <span>Gap to End</span>
      </HeaderLabel>
    ),
    title: "Filtered Gap to End",
    cell: (song) =>
      dashOrSpan(
        song.filteredShowsSinceLastPlayed != null ? (
          <NumberCell width="3ch">{song.filteredShowsSinceLastPlayed}</NumberCell>
        ) : null,
      ),
    sortingFn: nullsLastNumericSort("filteredShowsSinceLastPlayed"),
  });

  // Date columns flex — they share leftover space with the Song column.
  // On the sparse view (2 date cols, no filtered siblings) the dates
  // yield extra width to Song so the title column reads cleanly; on the
  // dense filtered view they're already squeezed by their 4-up layout
  // so the weight stays higher to keep each date legible.
  const dateColumnWeight = showFilteredPlays ? 1.4 : 1.0;

  // All-time date columns only render on mobile in the sparse view (no
  // filters). 4.5rem comfortably fits the compact "M/D/YY" form ShowDate
  // produces below its 6rem container-query threshold.
  const allTimeDateMobileWidth = "4.5rem";

  // Filtered date columns share mobile space with Song + 4 numeric filter
  // cols, so they tighten to 4rem. Still above the compact-form CQ
  // threshold; M/D/YY (max 8 chars) fits with text-xs and cell padding.
  const filteredDateMobileWidth = "4rem";

  const lastPlayedColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "dateLastPlayed",
    weight: dateColumnWeight,
    mobileFixedWidth: allTimeDateMobileWidth,
    // Hidden on mobile in dense view so the filtered date pair has room.
    hideOnMobile: showFilteredPlays,
    label: <HeaderLabel reserveIconRow={showFilteredPlays}>Last Played</HeaderLabel>,
    cell: (song) => <DateVenueCell date={song.dateLastPlayed} show={song.lastPlayedShow} />,
  });

  const filteredLastPlayedColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "dateLastFilteredPlayed",
    weight: dateColumnWeight,
    mobileFixedWidth: filteredDateMobileWidth,
    label: (
      <HeaderLabel filtered reserveIconRow>
        Last
      </HeaderLabel>
    ),
    title: "Filtered Last Played",
    cell: (song) => <DateVenueCell date={song.dateLastFilteredPlayed ?? null} show={song.lastFilteredPlayedShow} />,
  });

  const firstPlayedColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "dateFirstPlayed",
    weight: dateColumnWeight,
    mobileFixedWidth: allTimeDateMobileWidth,
    hideOnMobile: showFilteredPlays,
    label: <HeaderLabel reserveIconRow={showFilteredPlays}>First Played</HeaderLabel>,
    cell: (song) => <DateVenueCell date={song.dateFirstPlayed} show={song.firstPlayedShow} />,
  });

  const filteredFirstPlayedColumn = makeSortableColumn({
    reservesIconRow: showFilteredPlays,
    accessorKey: "dateFirstFilteredPlayed",
    weight: dateColumnWeight,
    mobileFixedWidth: filteredDateMobileWidth,
    label: (
      <HeaderLabel filtered reserveIconRow>
        First
      </HeaderLabel>
    ),
    title: "Filtered First Played",
    cell: (song) => <DateVenueCell date={song.dateFirstFilteredPlayed ?? null} show={song.firstFilteredPlayedShow} />,
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
