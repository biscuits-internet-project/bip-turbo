import type { SongPagePerformance } from "@bip/domain";
import { mockShallowComponent, setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { DataTable } from "~/components/ui/data-table";
import { createPerformanceColumns } from "./performance-columns";

vi.mock("./track-rating-cell", () => ({
  TrackRatingCell: (props: object) => mockShallowComponent("TrackRatingCell", props),
}));
vi.mock("./combined-notes", () => ({
  CombinedNotes: (props: object) => mockShallowComponent("CombinedNotes", props),
}));

function makePerformance(overrides: Partial<SongPagePerformance> = {}): SongPagePerformance {
  return {
    trackId: "track-1",
    show: { id: "show-1", slug: "2024-06-15-the-cap", date: "2024-06-15", venueId: "venue-1", countForStats: true },
    venue: {
      id: "venue-1",
      slug: "the-cap",
      name: "The Capitol Theatre",
      city: "Port Chester",
      state: "NY",
      country: "USA",
    },
    songBefore: undefined,
    songAfter: undefined,
    rating: 4.5,
    ratingsCount: 12,
    notes: undefined,
    allTimer: false,
    segue: null,
    annotations: [],
    set: "S1",
    position: 3,
    gap: 5,
    previousPerformanceShowId: "prev-show",
    tags: {},
    ...overrides,
  };
}

const defaultOptions = {
  userRatingMap: new Map<string, number>(),
  isAuthenticated: false,
};

describe("createPerformanceColumns", () => {
  // The default column set renders Date, Set, Sequence, Notes, and Rating
  // headers. Venue isn't a separate column — it's folded into the Date
  // cell via DateVenueCell so narrow viewports show date-only and wider
  // viewports stack venue beneath the date in the same column.
  test("default columns include Date, Set, Sequence, Notes, Rating headers (Venue is not a separate column)", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Set")).toBeInTheDocument();
    expect(screen.getByText("Sequence")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    // No standalone Venue column header — venue text lives in the Date cell.
    expect(screen.queryByRole("columnheader", { name: "Venue" })).not.toBeInTheDocument();
  });

  // The Date cell renders the venue underneath the date so the venue
  // information is preserved without a dedicated column. The venue line
  // is responsive (hidden sm:block) but still in the DOM for desktop users.
  test("Date cell renders venue name beneath the date", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    expect(screen.getByText(/The Capitol Theatre, Port Chester, NY/)).toBeInTheDocument();
  });

  // The Notes column carries `hideOnMobile` so the long free-text annotations
  // do not crowd narrow viewports — DataTable reads this meta and hides the
  // column on mobile.
  test("Notes column has meta.hideOnMobile = true", () => {
    const columns = createPerformanceColumns(defaultOptions);
    const notesColumn = columns.find((column) => "id" in column && column.id === "notes");
    expect(notesColumn?.meta?.hideOnMobile).toBe(true);
  });

  // When the Song column is present (all-timers, on-this-day), Sequence
  // gets hidden on mobile because the row is already too tight — Song is
  // the more important column there.
  test("Sequence column has meta.hideOnMobile when showSongColumn is true", () => {
    const columns = createPerformanceColumns({ ...defaultOptions, showSongColumn: true });
    const sequenceColumn = columns.find((column) => "id" in column && column.id === "sequence");
    expect(sequenceColumn?.meta?.hideOnMobile).toBe(true);
  });

  // On the song-detail page the Song column is absent (we already know which
  // song this is), leaving room for Sequence on mobile — and Sequence is
  // one of the most useful columns in that view.
  test("Sequence column does not hide on mobile when showSongColumn is false", () => {
    const columns = createPerformanceColumns(defaultOptions);
    const sequenceColumn = columns.find((column) => "id" in column && column.id === "sequence");
    expect(sequenceColumn?.meta?.hideOnMobile).toBeFalsy();
  });

  // Gap and Last Played are per-song signals — they only make sense when
  // every row of the table refers to the same song. On surfaces that mix
  // songs (`/songs/all-timers`, `/on-this-day/:monthDay`), the columns
  // become noise and the caller passes `showGapColumns={false}` to hide
  // both at once.
  test("Gap and Last Played columns are present by default", () => {
    const columns = createPerformanceColumns(defaultOptions);
    const ids = columns.map((c) => ("id" in c ? c.id : undefined));
    expect(ids).toContain("gap");
    expect(ids).toContain("lastPlayed");
  });

  test("Gap and Last Played columns are absent when showGapColumns is false", () => {
    const columns = createPerformanceColumns({ ...defaultOptions, showGapColumns: false });
    const ids = columns.map((c) => ("id" in c ? c.id : undefined));
    expect(ids).not.toContain("gap");
    expect(ids).not.toContain("lastPlayed");
  });

  // The Song column only appears on /songs/all-timers where performances
  // span multiple songs. On /songs/$slug (single song), it's omitted.
  test("Song column present when showSongColumn is true, absent otherwise", async () => {
    const performances = [makePerformance({ songTitle: "Cassidy", songSlug: "cassidy" })];

    const withSong = createPerformanceColumns({ ...defaultOptions, showSongColumn: true });
    const { unmount } = await setup(<DataTable columns={withSong} data={performances} hideSearch hidePagination />);
    expect(screen.getByText("Song")).toBeInTheDocument();
    unmount();

    const withoutSong = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={withoutSong} data={performances} hideSearch hidePagination />);
    expect(screen.queryByText("Song")).not.toBeInTheDocument();
  });

  // The AllTimer flame column marks standout performances. Only shown on
  // the "All Performances" tab of /songs/$slug, not on /songs/all-timers
  // (where every row is already an all-timer by definition).
  test("AllTimer flame column present when showAllTimerColumn is true", async () => {
    const performances = [makePerformance({ allTimer: true })];
    const columns = createPerformanceColumns({ ...defaultOptions, showAllTimerColumn: true });
    const { container } = await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    expect(container.querySelectorAll(".lucide-flame").length).toBe(1);
  });

  // TrackRatingCell receives initialRating from the performance's rating
  // field, NOT from the userRatingMap. A performance with a community
  // average rating should always pass that rating to the cell, regardless
  // of whether the user has rated it or the userRatingMap is empty.
  test("passes initialRating from performance.rating even when userRatingMap is empty", async () => {
    const performances = [makePerformance({ trackId: "t1", rating: 3.5, ratingsCount: 2 })];
    const columns = createPerformanceColumns({ ...defaultOptions, userRatingMap: new Map() });
    await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const cell = screen.getByTestId("TrackRatingCell");
    // initialRating should be 3.5, not null
    expect(cell.textContent).toContain('"initialRating":3.5');
    expect(cell.textContent).toContain('"ratingsCount":2');
  });

  // A performance with rating=0 or rating=undefined should pass
  // initialRating as null (not 0) so TrackRatingCell shows "Rate".
  // This is correct — there's no community rating to display.
  test("passes initialRating as null when performance.rating is undefined", async () => {
    const performances = [makePerformance({ trackId: "t1", rating: undefined, ratingsCount: undefined })];
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const cell = screen.getByTestId("TrackRatingCell");
    expect(cell.textContent).toContain('"initialRating":null');
    expect(cell.textContent).toContain('"ratingsCount":null');
  });

  // Each Date cell links to the show's detail page so users can click
  // through to see the full setlist.
  test("Date cell links to /shows/{show.slug}", async () => {
    const performances = [
      makePerformance({
        show: { id: "s1", slug: "2024-06-15-the-cap", date: "2024-06-15", venueId: "v1", countForStats: true },
      }),
    ];
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    // Date is formatted M/D/YYYY (formatDateShort) for visual consistency
    // with /shows listings and song-detail stat cards.
    const dateLink = screen.getByRole("link", { name: /6\/15\/2024/ });
    expect(dateLink).toHaveAttribute("href", "/shows/2024-06-15-the-cap");
  });

  // Sortable columns (Date, Set, Rating, Song) show an up/down arrow icon
  // even when not actively sorted, so users can see at a glance which
  // columns support sorting. Non-sortable columns (Venue, Sequence, Notes)
  // render plain text headers with no icon.
  test("sortable columns show sort indicator, non-sortable columns do not", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    // Sortable columns render a <button> with an SVG icon inside
    const dateHeader = screen.getByText("Date").closest("button");
    expect(dateHeader).not.toBeNull();
    expect(dateHeader?.querySelector("svg")).not.toBeNull();

    // Set is not sortable — plain text header
    const setHeader = screen.getByText("Set").closest("th");
    expect(setHeader?.querySelector("button")).toBeNull();

    const ratingHeader = screen.getByText("Rating").closest("button");
    expect(ratingHeader).not.toBeNull();
    expect(ratingHeader?.querySelector("svg")).not.toBeNull();

    // Non-sortable columns render a plain <span> with no button
    const sequenceHeader = screen.getByText("Sequence").closest("th");
    expect(sequenceHeader?.querySelector("button")).toBeNull();
  });

  // Column order on the song-detail performances table reads as a
  // narrative: when did this happen (Date) → how rare was it (Gap) → when
  // was the last time before that (Last Played) → which set was it (Set) →
  // what came around it (Sequence). Pinning the order so future column
  // additions don't accidentally reshuffle this flow.
  test("column order is Date, Gap, Last Played, Set, Sequence", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    const headers = Array.from(document.querySelectorAll("th"))
      .map((th) => th.textContent?.trim() ?? "")
      .filter(Boolean);
    const dateIdx = headers.findIndex((h) => h.startsWith("Date"));
    const gapIdx = headers.findIndex((h) => h.startsWith("Gap"));
    const lastPlayedIdx = headers.findIndex((h) => h.startsWith("Last Played"));
    const setIdx = headers.findIndex((h) => h.startsWith("Set") && !h.startsWith("Sequence"));
    const seqIdx = headers.findIndex((h) => h.startsWith("Sequence"));
    expect(dateIdx).toBeGreaterThan(-1);
    expect(gapIdx).toBeGreaterThan(dateIdx);
    expect(lastPlayedIdx).toBeGreaterThan(gapIdx);
    expect(setIdx).toBeGreaterThan(lastPlayedIdx);
    expect(seqIdx).toBeGreaterThan(setIdx);
  });

  // A normal (non-debut, non-this-show) row renders the integer gap so users
  // can read "X shows since last play" directly.
  test("Gap column renders integer for normal rows", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    const performances = [makePerformance({ trackId: "t-cassidy", gap: 12, previousPerformanceShowId: "prev-1" })];
    await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    expect(screen.getByText("12")).toBeInTheDocument();
  });

  // A debut performance has gap=null and no earlier-position row in the same
  // show, so we render a Star icon (not a number) to mark it visually as the
  // song's first ever appearance.
  test("Gap column renders Star icon for debut rows (gap=null, no earlier same-show row)", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    const performances = [
      makePerformance({
        trackId: "t-debut",
        show: { id: "show-debut", slug: "2010-01-01-debut", date: "2010-01-01", venueId: "v", countForStats: true },
        position: 1,
        gap: null,
        previousPerformanceShowId: null,
      }),
    ];
    const { container } = await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    expect(container.querySelectorAll(".lucide-star").length).toBe(1);
  });

  // When a song is played twice in the same show, Phase 1 stores the SAME
  // gap on both tracks (the gap to the previous *show* the song was played).
  // The repeat is identified at render time by checking for an earlier-
  // position track in the same show, and gets a RotateCcw icon instead of
  // a number to flag the within-show repeat.
  test("Gap column renders RotateCcw icon for within-show repeats", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    const sharedShow = {
      id: "show-repeat",
      slug: "2012-08-15-camp",
      date: "2012-08-15",
      venueId: "v",
      countForStats: true,
    };
    const performances = [
      makePerformance({ trackId: "t-first", show: sharedShow, position: 3, gap: 5, previousPerformanceShowId: "p" }),
      makePerformance({ trackId: "t-repeat", show: sharedShow, position: 8, gap: 5, previousPerformanceShowId: "p" }),
    ];
    const { container } = await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    // Exactly one rotate-ccw icon — the second occurrence; the first
    // occurrence still renders the integer 5.
    expect(container.querySelectorAll(".lucide-rotate-ccw").length).toBe(1);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  // The Last Played column shows the date of the song's prior performance
  // (sourced from Phase 1's Track.previousPerformanceShowId join) and links
  // to that show. When sorted by Gap (or any non-date order), this column
  // gives users back the chronological context the Date column otherwise
  // provides at a glance.
  test("Last Played column renders linked date for non-debut rows", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    const performances = [
      makePerformance({
        trackId: "t-with-prior",
        gap: 12,
        previousPerformanceShowId: "prev-show",
        previousShow: { slug: "2018-02-14-bowery", date: "2018-02-14" },
      }),
    ];
    await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const link = screen.getByRole("link", { name: /2\/14\/2018/ });
    expect(link).toHaveAttribute("href", "/shows/2018-02-14-bowery");
  });

  // Debuts have no prior performance, so the Last Played cell renders an
  // em-dash placeholder — same convention as the Set column's empty state.
  test("Last Played column shows em-dash for debut rows", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    const performances = [
      makePerformance({
        trackId: "t-debut",
        gap: null,
        previousPerformanceShowId: null,
        previousShow: undefined,
      }),
    ];
    const { container } = await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    // The cell sits between Set and Gap in the header order, so we look up
    // the third td in the row (after Date and Set). Rather than rely on
    // brittle positional indexing, check the row text contains the dash.
    expect(container.textContent).toContain("—");
  });

  // Gap column is sortable — header renders inside a button with a sort
  // indicator icon, just like Date and Rating.
  test("Gap column is sortable", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    const gapHeader = screen.getByText("Gap").closest("button");
    expect(gapHeader).not.toBeNull();
    expect(gapHeader?.querySelector("svg")).not.toBeNull();
  });
}); // end of createPerformanceColumns

// Sort comparator unit tests target the exported gapSortingFn directly so
// the rarity-first ordering rules can be verified without spinning up a
// full DataTable.
describe("gapSortingFn", () => {
  // Ascending order surfaces debuts (gap=null) FIRST since a debut is the
  // rarest possible event; then non-null gaps in numeric ascending order.
  // Tied gaps fall back to show date so all rows from the same show
  // cluster (including within-show repeats), then to track position as
  // the final tiebreak.
  test("ascending: debut first, then numeric, date tiebreak, position final tiebreak", async () => {
    const { gapSortingFn } = await import("./performance-columns");
    const fakeRow = (gap: number | null, date: string, position: number) =>
      ({ original: { gap, position, show: { date } } }) as unknown as Parameters<typeof gapSortingFn>[0];

    // Primary: debut < non-null gap.
    expect(gapSortingFn(fakeRow(null, "2024-01-01", 5), fakeRow(0, "2024-01-01", 1))).toBeLessThan(0);
    // Primary: smaller gap < larger gap.
    expect(gapSortingFn(fakeRow(0, "2024-01-01", 1), fakeRow(3, "2024-01-01", 1))).toBeLessThan(0);
    // Secondary: tied gap, earlier date sorts first.
    expect(gapSortingFn(fakeRow(5, "2018-06-01", 1), fakeRow(5, "2024-08-15", 1))).toBeLessThan(0);
    expect(gapSortingFn(fakeRow(5, "2024-08-15", 1), fakeRow(5, "2018-06-01", 1))).toBeGreaterThan(0);
    // Tertiary: tied gap AND tied date (within-show repeat), position breaks.
    expect(gapSortingFn(fakeRow(5, "2012-08-15", 3), fakeRow(5, "2012-08-15", 8))).toBeLessThan(0);
    // Two debuts at different shows still respect date tiebreak.
    expect(gapSortingFn(fakeRow(null, "2010-01-01", 1), fakeRow(null, "2012-01-01", 1))).toBeLessThan(0);
  });
});

describe("createPerformanceColumns extras", () => {
  // Columns that need constrained widths (like the narrow allTimer flame
  // icon and the Set label) set explicit meta.width. Other columns auto-size
  // to avoid wasted space.
  test("allTimer and Set columns have explicit meta.width", () => {
    const columns = createPerformanceColumns({ ...defaultOptions, showAllTimerColumn: true });

    const allTimerColumn = columns.find((column) => "id" in column && column.id === "allTimer");
    expect(allTimerColumn?.meta?.width).toBe("24px");

    const setColumn = columns.find((column) => "accessorKey" in column && column.accessorKey === "set");
    expect(setColumn?.meta?.width).toBe("48px");
  });
});
