import { formatDuration, type ShowStatsRow } from "@bip/domain";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { DateVenueCell } from "~/components/performance/date-venue-cell";
import { RatingBadgeButton } from "~/components/rating/rating-badge-button";
import { PARTIAL_DURATION_MARKER, partialDurationNote } from "~/components/setlist/setlist-duration";
import { ShowExternalBadges, type ShowExternalSources } from "~/components/setlist/show-external-badges";
import { ShowDate } from "~/components/show-date";
import { NumberCell } from "~/components/ui/number-cell";
import { SortableHeader } from "~/components/ui/sortable-header";

/** Rendered in place of any statistic a show doesn't have. */
function EmptyCell() {
  return <span className="text-content-text-tertiary text-sm">—</span>;
}

/**
 * Keeps rows with no value at the bottom in BOTH sort directions, so one click
 * shows the shortest known runtime and the next shows the longest — instead of
 * a screenful of em dashes. TanStack negates a comparator's result for
 * descending, so a comparator can't express this on its own; `sortUndefined`
 * is applied before that negation and returns early.
 *
 * It only recognizes `undefined`, never `null`, which is why every accessor
 * below coalesces its missing value.
 */
const SORT_MISSING_LAST = "last" as const;

const STAT_COLUMN_WEIGHT = 0.85;

/**
 * Wrapper width at which the two widest optional columns join in. Below it the
 * table shows Date, Show time, both gaps, Vintage, and Rating; the 176px Sources
 * block plus Jam charts only fit once there's desktop room, and forcing them in
 * earlier squeezes everything else. Sized from the columns' own minimums: the
 * full set needs ~700px of content width.
 */
const WIDE_LAYOUT_PX = 900;

/** Numeric column shared by every rarity stat: same width, sort, and empty state. */
function makeStatColumn(options: {
  id: string;
  label: string;
  pick: (row: ShowStatsRow) => number | null;
  /**
   * Decimals to render. Median gap carries one because it's a continuous median
   * — it lands on `x.5` for an even song count, and a show's own page prints
   * that decimal too.
   */
  decimals?: number;
  hideOnMobile?: boolean;
  /** Wrapper width below which the column hides; see `WIDE_LAYOUT_PX`. */
  hideBelow?: number;
  /**
   * Width below `sm`, where weights alone leave the surviving columns too
   * narrow to hold their content — and they clip rather than wrap. Sized to the
   * header, which is wider than the values in every case.
   */
  mobileFixedWidth?: string;
  digits: string;
}): ColumnDef<ShowStatsRow> {
  return {
    id: options.id,
    accessorFn: (row) => options.pick(row) ?? undefined,
    meta: {
      weight: STAT_COLUMN_WEIGHT,
      mobileFixedWidth: options.mobileFixedWidth,
      hideOnMobile: options.hideOnMobile,
      hideBelow: options.hideBelow,
    },
    header: ({ column }) => <SortableHeader column={column} label={options.label} />,
    sortingFn: "basic",
    sortUndefined: SORT_MISSING_LAST,
    cell: ({ row }) => {
      const value = options.pick(row.original);
      if (value === null) return <EmptyCell />;
      return <NumberCell width={options.digits}>{value.toFixed(options.decimals ?? 0)}</NumberCell>;
    },
  };
}

export interface ShowsColumnsContext {
  externalSources: Record<string, ShowExternalSources>;
  /** Viewer's own rating per show id; empty when logged out or unrated. */
  userRatingMap: Map<string, number>;
  /**
   * The viewer's calibrated score per show id, present only when their resolved
   * mode is calibrated. Falls back to the row's canonical average, which ships
   * with the cached payload so ratings render on first paint instead of after
   * the per-viewer fetch resolves.
   */
  displayedRatingMap: Map<string, { rating: number; count: number }>;
  isAuthenticated: boolean;
}

/**
 * Columns for the shows stats table, revealed in three tiers as the table gets
 * room. Visibility runs through TanStack (see `hideOnMobile` / `hideBelow` in
 * DataTable) rather than CSS, so `<colgroup>` widths stay aligned with the
 * rendered cells.
 *
 *   phone (<640px)   Date, Median gap, Longest gap, Rating
 *   between          + Show time, Vintage
 *   >=900px          + Jam charts, Sources
 *
 * The phone set is four because a 375px row can't hold a fifth column next to a
 * rating badge the viewer has rated, the widest cell in the table. The two gap
 * columns win that space: they're the rarity story (typical versus standout) and
 * they're populated - longest gap is non-zero on 99.5% of shows against 41.5%
 * for jam charts, which would render a bare 0 on most rows.
 *
 * Only Sources and Rating take fixed widths; the rest share what's left by
 * weight. Date is the sole text column, so fixing the numeric ones too would
 * hand it every spare pixel and leave a cavernous Date beside cramped headers.
 */
export function getShowsColumns(context: ShowsColumnsContext): ColumnDef<ShowStatsRow>[] {
  /**
   * The rating the viewer actually sees: their calibrated score when their mode
   * resolves to calibrated, else the canonical average. The column MUST sort and
   * display through this same function — reading the calibrated score for the
   * cell while sorting on the canonical average produces a list whose visible
   * numbers are out of order.
   */
  const displayedRating = (row: ShowStatsRow) => {
    const calibrated = context.displayedRatingMap.get(row.id);
    return {
      rating: calibrated?.rating ?? row.averageRating,
      count: calibrated?.count ?? row.ratingsCount,
    };
  };

  const dateColumn: ColumnDef<ShowStatsRow> = {
    id: "date",
    accessorKey: "date",
    meta: { weight: 3 },
    header: ({ column }) => <SortableHeader column={column} label="Date" />,
    cell: ({ row }) => {
      const show = row.original;
      return (
        <Link
          to={`/shows/${show.slug}`}
          className="block text-brand-primary hover:text-brand-secondary transition-colors"
        >
          <DateVenueCell
            date={<ShowDate date={show.date} />}
            venue={{ name: show.venueName, city: show.venueCity, state: show.venueState }}
          />
        </Link>
      );
    },
  };

  const sourcesColumn: ColumnDef<ShowStatsRow> = {
    id: "sources",
    // Sized to the busiest night in the catalog: 6 favicons (a dual-nugs release
    // plus youtube / archive / relisten / photos) need 160px, and the strip
    // clips rather than shrinks. 5 shows carry 5+, one carries 6.
    meta: { fixedWidth: "11rem", hideBelow: WIDE_LAYOUT_PX },
    header: ({ column }) => <SortableHeader column={column} label="Sources" />,
    enableSorting: false,
    cell: ({ row }) => {
      const show = row.original;
      return (
        <ShowExternalBadges
          sources={context.externalSources[show.id] ?? {}}
          photosHref={`/shows/${show.slug}#photos`}
          photosCount={show.photosCount}
          // A three-digit count next to four favicons overflows this column and
          // squeezes the icons; the number stays in the badge's tooltip.
          hidePhotosCount
        />
      );
    },
  };

  const ratingColumn: ColumnDef<ShowStatsRow> = {
    id: "rating",
    accessorFn: (row) => displayedRating(row).rating ?? undefined,
    // Fixed, not weighted: the cell holds a chip that can't reflow, so a share
    // of leftover space is the wrong model — at ~700px wide the share came to
    // 64px for ~99px of content and the badge overran the table's right edge.
    // Sized against the widest case, a badge the viewer has rated (star + score
    // + count + divider + their own value): 119px at desktop type, 105px at
    // mobile type. That's the cell box, so subtract ~16px of padding — 8rem left
    // 112px of content box and still clipped by 7px.
    //
    // One width at every size rather than a mobile override: the override is
    // chosen by the table wrapper's width while the cell's padding and type come
    // from Tailwind's viewport-based `sm:`, so between roughly 640 and 665px a
    // mobile width pairs with desktop padding and desktop type. Sizing for the
    // widest combination is simpler than sizing for that seam.
    meta: { fixedWidth: "9rem" },
    header: ({ column }) => <SortableHeader column={column} label="Rating" />,
    sortDescFirst: true,
    sortUndefined: SORT_MISSING_LAST,
    sortingFn: (rowA, rowB) => {
      const a = displayedRating(rowA.original);
      const b = displayedRating(rowB.original);
      // Unrated rows never reach here — sortUndefined settles them first.
      const difference = (a.rating ?? 0) - (b.rating ?? 0);
      // More votes means more confidence in the same average.
      return difference !== 0 ? difference : a.count - b.count;
    },
    cell: ({ row }) => {
      const show = row.original;
      const displayed = displayedRating(show);
      return (
        <RatingBadgeButton
          rateableId={show.id}
          rateableType="Show"
          showSlug={show.slug}
          initialRating={displayed.rating}
          ratingsCount={displayed.count}
          userRating={context.userRatingMap.get(show.id) ?? null}
          isAuthenticated={context.isAuthenticated}
          size="compact"
        />
      );
    },
  };

  const durationColumn: ColumnDef<ShowStatsRow> = {
    id: "duration",
    accessorFn: (row) => row.duration ?? undefined,
    meta: { weight: 1.1, hideOnMobile: true },
    header: ({ column }) => <SortableHeader column={column} label="Show time" />,
    sortingFn: "basic",
    sortUndefined: SORT_MISSING_LAST,
    cell: ({ row }) => {
      const { duration, untimedTracks } = row.original;
      if (duration === null) return <EmptyCell />;
      // Same asterisk the setlist view wears, so a partial sum never reads as
      // the show's real length. A cell has nowhere to put the footnote line the
      // setlist uses, so the explanation lives in the tooltip.
      const partialNote = partialDurationNote(untimedTracks);
      return (
        <NumberCell width="7ch" title={partialNote ?? undefined}>
          {formatDuration(duration)}
          {partialNote && PARTIAL_DURATION_MARKER}
        </NumberCell>
      );
    },
  };

  // Sources and Rating sit rightmost, in that order, matching every other
  // table's placement of the rating affordance.
  return [
    dateColumn,
    durationColumn,
    makeStatColumn({
      id: "medianGap",
      label: "Median gap",
      pick: (row) => row.medianGap,
      decimals: 1,
      digits: "5ch",
      mobileFixedWidth: "3.6rem",
    }),
    makeStatColumn({
      id: "longestGap",
      label: "Longest gap",
      pick: (row) => row.longestGap,
      digits: "4ch",
      mobileFixedWidth: "3.9rem",
    }),
    makeStatColumn({
      id: "vintage",
      label: "Vintage",
      pick: (row) => row.vintage,
      digits: "4ch",
      hideOnMobile: true,
    }),
    makeStatColumn({
      id: "jamCharts",
      label: "Jam charts",
      pick: (row) => row.jamCharts,
      digits: "2ch",
      hideBelow: WIDE_LAYOUT_PX,
    }),
    sourcesColumn,
    ratingColumn,
  ];
}
