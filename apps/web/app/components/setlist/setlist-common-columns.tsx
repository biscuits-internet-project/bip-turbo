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
    // Sized for the busiest badge form: "★ 5.00 · 999 | 4½" — community
    // average + 3-digit vote count + the viewer's own half-step rating
    // (4½ is the widest valid user value; ratings cap at 5). Matches the
    // performance table's rating column width so the column reads
    // consistently across setlist and song-detail tables. The 5-star
    // picker pops in a popover overlay, so the column doesn't need a
    // wider expanded state.
    meta: { fixedWidth: "8.25rem", mobileFixedWidth: "6.75rem" },
    enableSorting: true,
    // Ties resolve first to vote count (more votes = more confidence in the
    // average), then to canonical set+position so "all unrated tracks" still
    // read top-to-bottom in the order they were played. Every row in a
    // setlist shares the same show date, so date can't disambiguate here —
    // set+position is the canonical narrative tiebreak instead.
    sortingFn: withSetPositionTiebreak<T>((a, b) => {
      const aRating = a.averageRating ?? Number.NEGATIVE_INFINITY;
      const bRating = b.averageRating ?? Number.NEGATIVE_INFINITY;
      if (aRating !== bRating) return aRating - bRating;
      return (a.ratingsCount ?? 0) - (b.ratingsCount ?? 0);
    }),
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
 * Stacked-label count column used by both gap-chart views: catalog "Played
 * Before" and personal "Seen Before". The two columns share header shape,
 * sort config, and cell rendering — only the accessor, label words, and
 * mobile presentation differ. Centralizing here avoids drift between the
 * two factories.
 *
 * The accessor returns `null` to indicate "not loaded yet" (the catalog
 * variant fetches its data asynchronously); rendered as an em-dash so the
 * column doesn't flash a misleading "0" before settling on the real count.
 * Synchronous callers (personal view) can return `0` directly and never
 * see the placeholder.
 */
export function createCountColumn<T extends TrackLight>(opts: {
  id: string;
  accessor: (row: T) => number | null;
  /**
   * Two-word header rendered as stacked spans so the column can stay
   * narrow on phones (e.g., `["Played", "Before"]`, `["Seen", "Before"]`).
   */
  label: [string, string];
  hideOnMobile?: boolean;
  mobileFixedWidth?: string;
}): ColumnDef<T, unknown> {
  const columnHelper = createColumnHelper<T>();
  return columnHelper.accessor((row) => opts.accessor(row) ?? Number.NEGATIVE_INFINITY, {
    id: opts.id,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label={
          <span className="flex flex-col items-start leading-tight">
            <span>{opts.label[0]}</span>
            <span>{opts.label[1]}</span>
          </span>
        }
      />
    ),
    // 4-digit max content (catalog's most-played songs land in the high
    // hundreds), so 4.5rem fits the stacked header + sort arrow on its
    // own row below without slack.
    meta: {
      fixedWidth: "4.5rem",
      ...(opts.hideOnMobile ? { hideOnMobile: true } : {}),
      ...(opts.mobileFixedWidth ? { mobileFixedWidth: opts.mobileFixedWidth } : {}),
    },
    enableSorting: true,
    sortingFn: "basic",
    sortDescFirst: false,
    cell: (info) => {
      const value = opts.accessor(info.row.original);
      return <span className="text-content-text-secondary tabular-nums">{value === null ? "—" : value}</span>;
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
  /**
   * Desktop column width. Date content is bounded ("MMM DD, YYYY" max
   * ~100px), so callers should generally pass a fixedWidth here rather
   * than relying on weight — flexing eats space the Song column wants.
   */
  fixedWidth: string;
  hideOnMobile?: boolean;
}): ColumnDef<T, unknown> {
  const columnHelper = createColumnHelper<T>();
  return columnHelper.accessor((row) => opts.accessor(row)?.date ?? "", {
    id: opts.id,
    // Label words stack vertically so the header floor is the widest
    // single word ("Played" / "Seen" ~ 50px) instead of the full phrase
    // ("Last Played" ~ 76px). Combined with SortableHeader's flex-wrap,
    // the sort arrow drops onto its own line below when the column is
    // narrow, letting the date cells (~80px content) drive the column
    // width instead of the header.
    header: ({ column }) => (
      <SortableHeader
        column={column}
        label={
          <span className="flex flex-col leading-tight">
            {opts.label.split(" ").map((word) => (
              <span key={word}>{word}</span>
            ))}
          </span>
        }
      />
    ),
    // Mobile: 4.5rem locks the column to compact "M/D/YY" width — same
    // pattern as the other date-only mobile cells — so the Rating column
    // can sit alongside without crowding Song.
    meta: opts.hideOnMobile
      ? { fixedWidth: opts.fixedWidth, mobileFixedWidth: "4.5rem", hideOnMobile: true }
      : { fixedWidth: opts.fixedWidth, mobileFixedWidth: "4.5rem" },
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
  weight: number;
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
      // Gap content is bounded (debut icon, repeat icon, or up to 3
      // digits) — fix both desktop (3rem) and mobile (2.5rem with the
      // sort arrow wrapping onto its own line below the "Gap" label).
      meta: { fixedWidth: "3rem", mobileFixedWidth: "2.5rem" },
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
      // "Set" label is sr-only on mobile — the column shrinks below the
      // word's width, and "Set" + sort affordance are redundant when the
      // cells themselves show "1", "2", "E1" right below.
      header: ({ column }) => (
        <SortableHeader
          column={column}
          label={
            <span>
              <span className="sr-only sm:not-sr-only">Set</span>
            </span>
          }
        />
      ),
      // Set values max out at "E2" (2 chars). Bounded content → fixed
      // 3rem on desktop. On mobile the column also doubles as the home
      // for the all-timer flame icon (standalone AllTimer column is
      // hidden on mobile to save space), so it's wide enough for either
      // the flame or "E1" stacked vertically.
      meta: {
        fixedWidth: "2.5rem",
        mobileFixedWidth: "1.25rem",
        cellClassName: "!px-0 sm:!px-2",
        headerClassName: "!px-0 sm:!px-2",
      },
      enableSorting: true,
      sortingFn: (a, b) => compareBySetThenPosition(a.original, b.original),
      cell: (info) => {
        const raw = info.getValue() as string;
        const row = info.row.original;
        const encoresInSet = countDistinctEncores(info.table.getCoreRowModel().rows.map((r) => r.original));
        // Show the set label only on the first row of a same-set run when
        // sorted by Set — keeps the grouping visually obvious. Other sorts
        // interleave sets, so every row keeps its label.
        const sorting = info.table.getState().sorting;
        const groupBySet = sorting.length > 0 && sorting[0].id === "set";
        let hideSetLabel = false;
        if (groupBySet) {
          const sortedRows = info.table.getSortedRowModel().rows;
          const idx = sortedRows.findIndex((r) => r.id === info.row.id);
          if (idx > 0 && sortedRows[idx - 1].original.set === row.set) {
            hideSetLabel = true;
          }
        }
        return (
          <div className="flex flex-col items-center sm:items-start gap-0.5">
            {!hideSetLabel && (
              <span className="text-content-text-secondary">{formatSetLabel(raw, { encoresInSet })}</span>
            )}
            <span className="sm:hidden">
              <AllTimerCell track={row} />
            </span>
          </div>
        );
      },
    }) as ColumnDef<T, unknown>,
    columnHelper.display({
      id: "track",
      header: ({ column }) => <SortableHeader column={column} label="Track" />,
      // Drops on narrow viewports — the Set column already orients the row,
      // and a tiny Track column would steal width from Song on mobile.
      // Track # (position within set) — bounded to 3 digits max. 3.5rem
      // accommodates the "Track" header word + sort arrow + tighter
      // padding on desktop.
      meta: { fixedWidth: "3.5rem", hideOnMobile: true },
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
      // Hidden on mobile here — the setlist Set cell renders the flame
      // inline on phones to recover the 16px this column would consume.
      meta: { ...allTimerColumnMeta, hideOnMobile: true },
      enableSorting: false,
      cell: (info) => <AllTimerCell track={info.row.original} />,
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
