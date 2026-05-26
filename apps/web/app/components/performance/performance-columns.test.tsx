import type { SongPagePerformance } from "@bip/domain";
import { mockShallowComponent, setupWithRouter } from "@test/test-utils";
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
  // The default column set renders Date, Song Before, Song After,
  // Notes, and Rating headers. Each side of the setlist context is its own
  // searchable column. Venue isn't a separate column — it's folded into
  // the Date cell via DateVenueCell. Set was removed since the set number
  // isn't meaningful when scanning a single song across many shows.
  test("default columns include Date, Song Before, Song After, Notes, Rating headers", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Song Before")).toBeInTheDocument();
    expect(screen.getByText("Song After")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
    // Venue text lives in the Date cell, not in a standalone column.
    expect(screen.queryByRole("columnheader", { name: "Venue" })).not.toBeInTheDocument();
  });

  // The Date cell renders the venue underneath the date so the venue
  // information is preserved without a dedicated column. The venue line
  // is responsive (hidden sm:block) but still in the DOM for desktop users.
  test("Date cell renders venue name beneath the date", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

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

  // Song Before / Song After visibility depends on the surface:
  // - Single-song view (/songs/:slug, `showSongColumn` false): visible
  //   on mobile — segue context is the primary reason users scan the
  //   per-song table.
  // - Cross-song view (/songs/all-timers, /on-this-day, `showSongColumn`
  //   true): hidden on mobile — too many columns to fit alongside Song.
  test("Song Before / Song After hide on mobile only on cross-song surfaces", () => {
    const detailColumns = createPerformanceColumns(defaultOptions);
    const allTimerColumns = createPerformanceColumns({ ...defaultOptions, showSongColumn: true });

    const findColumn = (cols: typeof detailColumns, id: string) => cols.find((c) => "id" in c && c.id === id);

    expect(findColumn(detailColumns, "songBefore")?.meta?.hideOnMobile).toBeFalsy();
    expect(findColumn(detailColumns, "songAfter")?.meta?.hideOnMobile).toBeFalsy();
    expect(findColumn(allTimerColumns, "songBefore")?.meta?.hideOnMobile).toBe(true);
    expect(findColumn(allTimerColumns, "songAfter")?.meta?.hideOnMobile).toBe(true);
  });

  // Song Before cell: renders the prior song's title with a `>` arrow when
  // segued from the prior track, or a comma separator otherwise. The arrow
  // sits to the RIGHT of the title because it points INTO the current row.
  test("Song Before cell renders prior title with segue indicator", async () => {
    const performances = [
      makePerformance({
        trackId: "t-1",
        songBefore: { id: "p1", songId: "s1", songSlug: "tractorbeam", songTitle: "Tractorbeam", segue: ">" },
      }),
    ];
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const link = screen.getByRole("link", { name: /tractorbeam/i });
    expect(link).toHaveAttribute("href", "/songs/tractorbeam");
    // The current cell must include the `>` indicator since songBefore.segue
    // is truthy. Easiest assertion: the text content of the Song Before cell
    // contains a `>` character.
    const songBeforeCell = link.closest("td");
    expect(songBeforeCell?.textContent).toContain(">");
  });

  // Without a segue from the prior track, Song Before renders just the
  // title — no separator. The absence of the arrow is itself the signal
  // that the prior song was a non-segue (typically a set break).
  test("Song Before cell renders bare title (no arrow, no comma) when no segue from prior track", async () => {
    const performances = [
      makePerformance({
        trackId: "t-1",
        songBefore: { id: "p1", songId: "s1", songSlug: "munchkin", songTitle: "Munchkin", segue: null },
      }),
    ];
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const songBeforeCell = screen.getByRole("link", { name: /munchkin/i }).closest("td");
    expect(songBeforeCell?.textContent).not.toContain(",");
    expect(songBeforeCell?.textContent).not.toContain(">");
  });

  // Set openers have no prior track in the same set, so songBefore is
  // undefined. The cell renders empty (no placeholder, no separator).
  test("Song Before cell is empty when songBefore is undefined (set opener)", async () => {
    const performances = [makePerformance({ trackId: "t-opener", songBefore: undefined })];
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    // No link to a non-existent prior song. The Song Before cell is empty.
    expect(screen.queryByRole("link", { name: /tractorbeam|above the waves|munchkin/i })).not.toBeInTheDocument();
  });

  // Song After cell: the current track's `segue` field drives the indicator
  // because it describes how the CURRENT track exits into the next one.
  // The arrow sits to the LEFT of the next song's title (it points INTO the
  // next song).
  test("Song After cell renders next title with segue indicator driven by current row's segue", async () => {
    const performances = [
      makePerformance({
        trackId: "t-1",
        segue: ">",
        songAfter: { id: "n1", songId: "s2", songSlug: "above-the-waves", songTitle: "Above the Waves", segue: null },
      }),
    ];
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const link = screen.getByRole("link", { name: /above the waves/i });
    expect(link).toHaveAttribute("href", "/songs/above-the-waves");
    const songAfterCell = link.closest("td");
    expect(songAfterCell?.textContent).toContain(">");
  });

  // Without a current-row segue, Song After renders the bare title — no
  // arrow, no comma. The lack of an arrow signals the current track was a
  // non-segue ending (set close or hard cut).
  test("Song After cell renders bare title (no arrow, no comma) when current row has no segue", async () => {
    const performances = [
      makePerformance({
        trackId: "t-1",
        segue: null,
        songAfter: { id: "n1", songId: "s2", songSlug: "spaga", songTitle: "Spaga", segue: null },
      }),
    ];
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const songAfterCell = screen.getByRole("link", { name: /spaga/i }).closest("td");
    expect(songAfterCell?.textContent).not.toContain(",");
    expect(songAfterCell?.textContent).not.toContain(">");
  });

  // Set closers have no following track in the same set, so songAfter is
  // undefined. The cell renders empty.
  test("Song After cell is empty when songAfter is undefined (set closer)", async () => {
    const performances = [makePerformance({ trackId: "t-closer", songAfter: undefined })];
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    expect(screen.queryByRole("link", { name: /tractorbeam|above the waves|spaga/i })).not.toBeInTheDocument();
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

  // Filtered Gap appears only when a server-narrowing filter is active —
  // the column has no meaning otherwise (it would just duplicate Gap).
  test("Filtered Gap column is absent by default", () => {
    const columns = createPerformanceColumns(defaultOptions);
    const ids = columns.map((c) => ("id" in c ? c.id : undefined));
    expect(ids).not.toContain("filteredGap");
  });

  // When narrowing is active, Filtered Gap renders immediately after the
  // all-time Gap column so the two read as a paired comparison.
  test("Filtered Gap column is present when hasNarrowingFilter is true", () => {
    const columns = createPerformanceColumns({ ...defaultOptions, hasNarrowingFilter: true });
    const ids = columns.map((c) => ("id" in c ? c.id : undefined));
    const gapIdx = ids.indexOf("gap");
    const filteredGapIdx = ids.indexOf("filteredGap");
    expect(filteredGapIdx).toBeGreaterThan(-1);
    expect(filteredGapIdx).toBe(gapIdx + 1);
  });

  // Filtered Gap rides on the same `showGapColumns` gate as Gap. On
  // mixed-song surfaces (all-timers, on-this-day) the entire gap family
  // hides regardless of whether the filter is narrowing.
  test("Filtered Gap column is hidden when showGapColumns is false even with hasNarrowingFilter", () => {
    const columns = createPerformanceColumns({
      ...defaultOptions,
      showGapColumns: false,
      hasNarrowingFilter: true,
    });
    const ids = columns.map((c) => ("id" in c ? c.id : undefined));
    expect(ids).not.toContain("filteredGap");
  });

  // Cell rendering mirrors the all-time Gap column: ★ for debut of the
  // filtered set (filteredGap == null), ↺ for the second occurrence within
  // the same show, integer otherwise.
  test("Filtered Gap cell renders Star icon for filteredGap=null debut", async () => {
    const performances = [makePerformance({ trackId: "t-debut", filteredGap: null, position: 1 })];
    const columns = createPerformanceColumns({ ...defaultOptions, hasNarrowingFilter: true });
    const { container } = await setupWithRouter(
      <DataTable columns={columns} data={performances} hideSearch hidePagination />,
    );
    // Two stars expected: the all-time Gap column treats this row the same
    // way (its gap field defaulted to 5 from makePerformance, so the Gap
    // cell renders a number, not a star). Filtered Gap renders the star.
    expect(container.querySelectorAll(".lucide-star").length).toBe(1);
  });

  test("Filtered Gap cell renders rotate icon for within-show repeat", async () => {
    const performances = [
      makePerformance({
        trackId: "t-first",
        filteredGap: 3,
        position: 2,
        show: { id: "s-1", slug: "2024-06-15", date: "2024-06-15", venueId: "v", countForStats: true },
      }),
      makePerformance({
        trackId: "t-repeat",
        filteredGap: 3,
        position: 7,
        show: { id: "s-1", slug: "2024-06-15", date: "2024-06-15", venueId: "v", countForStats: true },
      }),
    ];
    const columns = createPerformanceColumns({ ...defaultOptions, hasNarrowingFilter: true });
    const { container } = await setupWithRouter(
      <DataTable columns={columns} data={performances} hideSearch hidePagination />,
    );
    // Within-show repeats render ↺ in both Gap AND Filtered Gap columns on
    // the second row — two `.lucide-rotate-ccw` icons total.
    expect(container.querySelectorAll(".lucide-rotate-ccw").length).toBe(2);
  });

  test("Filtered Gap cell renders the numeric value when not a debut or repeat", async () => {
    const performances = [makePerformance({ trackId: "t-1", filteredGap: 7, position: 1 })];
    const columns = createPerformanceColumns({ ...defaultOptions, hasNarrowingFilter: true });
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);
    // The Gap column renders 5 (from makePerformance default); Filtered Gap
    // renders 7. Looking for "7" is unambiguous since the all-time Gap is 5.
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  // The Song column only appears on /songs/all-timers where performances
  // span multiple songs. On /songs/$slug (single song), it's omitted.
  test("Song column present when showSongColumn is true, absent otherwise", async () => {
    const performances = [makePerformance({ songTitle: "Cassidy", songSlug: "cassidy" })];

    const withSong = createPerformanceColumns({ ...defaultOptions, showSongColumn: true });
    const { unmount } = await setupWithRouter(
      <DataTable columns={withSong} data={performances} hideSearch hidePagination />,
    );
    expect(screen.getByText("Song")).toBeInTheDocument();
    unmount();

    const withoutSong = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={withoutSong} data={performances} hideSearch hidePagination />);
    expect(screen.queryByText("Song")).not.toBeInTheDocument();
  });

  // The AllTimer flame marks standout performances. Renders twice in the
  // DOM per all-timer row: once in the standalone AllTimer column (hidden
  // on mobile via CSS), once inline in the Set cell (visible only on
  // mobile via CSS). jsdom doesn't apply media queries so both instances
  // appear in this test — the count of 2 is the contract.
  test("AllTimer flame renders in both the standalone column and inline in the Set cell", async () => {
    const performances = [makePerformance({ allTimer: true })];
    const columns = createPerformanceColumns({ ...defaultOptions, showAllTimerColumn: true });
    const { container } = await setupWithRouter(
      <DataTable columns={columns} data={performances} hideSearch hidePagination />,
    );

    expect(container.querySelectorAll(".lucide-flame").length).toBe(2);
  });

  // TrackRatingCell receives initialRating from the performance's rating
  // field, NOT from the userRatingMap. A performance with a community
  // average rating should always pass that rating to the cell, regardless
  // of whether the user has rated it or the userRatingMap is empty.
  test("passes initialRating from performance.rating even when userRatingMap is empty", async () => {
    const performances = [makePerformance({ trackId: "t1", rating: 3.5, ratingsCount: 2 })];
    const columns = createPerformanceColumns({ ...defaultOptions, userRatingMap: new Map() });
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

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
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

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
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    // Date is formatted M/D/YYYY (formatDateShort) for visual consistency
    // with /shows listings and song-detail stat cards.
    const dateLink = screen.getByRole("link", { name: /6\/15\/2024/ });
    expect(dateLink).toHaveAttribute("href", "/shows/2024-06-15-the-cap");
  });

  // Sortable columns (Date, Rating, Song Before, Song After) show an
  // up/down arrow icon even when not actively sorted, so users can see
  // at a glance which columns support sorting. Notes is the only non-
  // sortable header in the default set.
  test("sortable columns show sort indicator, non-sortable columns do not", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    // Sortable columns render a <button> with an SVG icon inside
    const dateHeader = screen.getByText("Date").closest("button");
    expect(dateHeader).not.toBeNull();
    expect(dateHeader?.querySelector("svg")).not.toBeNull();

    // Notes is not sortable — plain text header
    const notesHeader = screen.getByText("Notes").closest("th");
    expect(notesHeader?.querySelector("button")).toBeNull();

    const ratingHeader = screen.getByText("Rating").closest("button");
    expect(ratingHeader).not.toBeNull();
    expect(ratingHeader?.querySelector("svg")).not.toBeNull();

    // Song Before / Song After are sortable — title-alphabetical with
    // segue tiebreaker; users can scan "what comes after X" by clicking.
    const songBeforeHeader = screen.getByText("Song Before").closest("button");
    expect(songBeforeHeader).not.toBeNull();
    expect(songBeforeHeader?.querySelector("svg")).not.toBeNull();
    const songAfterHeader = screen.getByText("Song After").closest("button");
    expect(songAfterHeader).not.toBeNull();
    expect(songAfterHeader?.querySelector("svg")).not.toBeNull();
  });

  // Column order on the song-detail performances table reads as a
  // narrative: when did this happen (Date) → how rare was it (Gap) → when
  // was the last time before that (Last Played) → what came before /
  // after (Song Before, Song After). Pinning the order so future column
  // additions don't accidentally reshuffle this flow.
  test("column order is Date, Gap, Last Played, Song Before, Song After", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    const headers = Array.from(document.querySelectorAll("th"))
      .map((th) => th.textContent?.trim() ?? "")
      .filter(Boolean);
    const dateIdx = headers.findIndex((h) => h.startsWith("Date"));
    const gapIdx = headers.findIndex((h) => h.startsWith("Gap"));
    const lastPlayedIdx = headers.findIndex((h) => h.startsWith("Last Played"));
    const songBeforeIdx = headers.findIndex((h) => h.startsWith("Song Before"));
    const songAfterIdx = headers.findIndex((h) => h.startsWith("Song After"));
    expect(dateIdx).toBeGreaterThan(-1);
    expect(gapIdx).toBeGreaterThan(dateIdx);
    expect(lastPlayedIdx).toBeGreaterThan(gapIdx);
    expect(songBeforeIdx).toBeGreaterThan(lastPlayedIdx);
    expect(songAfterIdx).toBeGreaterThan(songBeforeIdx);
  });

  // A normal (non-debut, non-this-show) row renders the integer gap so users
  // can read "X shows since last play" directly.
  test("Gap column renders integer for normal rows", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    const performances = [makePerformance({ trackId: "t-cassidy", gap: 12, previousPerformanceShowId: "prev-1" })];
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

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
    const { container } = await setupWithRouter(
      <DataTable columns={columns} data={performances} hideSearch hidePagination />,
    );

    expect(container.querySelectorAll(".lucide-star").length).toBe(1);
  });

  // When a song is played twice in the same show, both tracks carry the
  // SAME gap value (the gap to the previous *show* the song was played).
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
    const { container } = await setupWithRouter(
      <DataTable columns={columns} data={performances} hideSearch hidePagination />,
    );

    // Exactly one rotate-ccw icon — the second occurrence; the first
    // occurrence still renders the integer 5.
    expect(container.querySelectorAll(".lucide-rotate-ccw").length).toBe(1);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  // The Last Played column shows the date of the song's prior performance
  // (sourced from the Track.previousPerformanceShowId join) and links to
  // that show. When sorted by Gap (or any non-date order), this column
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
    await setupWithRouter(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

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
    const { container } = await setupWithRouter(
      <DataTable columns={columns} data={performances} hideSearch hidePagination />,
    );

    // The cell sits between Set and Gap in the header order, so we look up
    // the third td in the row (after Date and Set). Rather than rely on
    // brittle positional indexing, check the row text contains the dash.
    expect(container.textContent).toContain("—");
  });

  // Gap column is sortable — header renders inside a button with a sort
  // indicator icon, just like Date and Rating.
  test("Gap column is sortable", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setupWithRouter(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    const gapHeader = screen.getByText("Gap").closest("button");
    expect(gapHeader).not.toBeNull();
    expect(gapHeader?.querySelector("svg")).not.toBeNull();
  });
}); // end of createPerformanceColumns

// Song Before / Song After sort comparators: sort by the adjacent song's
// title (case-insensitive, ignoring the segue indicator), with the segue
// state as the tiebreaker so identical-title groups cluster segue rows
// together. Verified via the exported comparator functions directly.
describe("songBeforeSortingFn", () => {
  // Primary axis: alphabetical ascending by prior song title. Case-
  // insensitive so "above the waves" and "Above the Waves" sort together.
  test("ascending: titles sort A→Z case-insensitively", async () => {
    const { songBeforeSortingFn } = await import("./performance-columns");
    const fakeRow = (songBefore: { songTitle: string; segue?: string | null } | undefined) =>
      ({ original: { songBefore } }) as unknown as Parameters<typeof songBeforeSortingFn>[0];

    expect(
      songBeforeSortingFn(fakeRow({ songTitle: "Above the Waves" }), fakeRow({ songTitle: "Tractorbeam" })),
    ).toBeLessThan(0);
    // Case insensitive: lowercase "above" still sorts before "Tractorbeam".
    expect(
      songBeforeSortingFn(fakeRow({ songTitle: "above the waves" }), fakeRow({ songTitle: "Tractorbeam" })),
    ).toBeLessThan(0);
  });

  // Tiebreaker: when two rows share the same prior song title, the segue
  // state breaks the tie — segue rows cluster ahead of non-segue rows in
  // ascending order. Lets users see "songs that came out of Munchkin via
  // segue" grouped together.
  test("tied titles: segue rows sort before non-segue rows", async () => {
    const { songBeforeSortingFn } = await import("./performance-columns");
    const fakeRow = (songBefore: { songTitle: string; segue?: string | null }) =>
      ({ original: { songBefore } }) as unknown as Parameters<typeof songBeforeSortingFn>[0];

    expect(
      songBeforeSortingFn(
        fakeRow({ songTitle: "Munchkin Invasion", segue: ">" }),
        fakeRow({ songTitle: "Munchkin Invasion", segue: null }),
      ),
    ).toBeLessThan(0);
    expect(
      songBeforeSortingFn(
        fakeRow({ songTitle: "Munchkin Invasion", segue: null }),
        fakeRow({ songTitle: "Munchkin Invasion", segue: ">" }),
      ),
    ).toBeGreaterThan(0);
  });

  // Set openers have no prior song. They sort last in ascending order so
  // the meaningful rows surface first; debuts get pushed to the bottom.
  test("undefined songBefore sorts last in ascending order", async () => {
    const { songBeforeSortingFn } = await import("./performance-columns");
    const fakeRow = (songBefore: { songTitle: string } | undefined) =>
      ({ original: { songBefore } }) as unknown as Parameters<typeof songBeforeSortingFn>[0];

    expect(songBeforeSortingFn(fakeRow({ songTitle: "Tractorbeam" }), fakeRow(undefined))).toBeLessThan(0);
    expect(songBeforeSortingFn(fakeRow(undefined), fakeRow({ songTitle: "Tractorbeam" }))).toBeGreaterThan(0);
    // Two undefined values compare equal so the table's secondary sort
    // (or insertion order) takes over.
    expect(songBeforeSortingFn(fakeRow(undefined), fakeRow(undefined))).toBe(0);
  });
});

describe("songAfterSortingFn", () => {
  // Same alphabetical primary axis as songBefore, but uses the next-song
  // title from `songAfter` and tiebreaks on the CURRENT row's `segue`
  // field (which describes whether the current track segued INTO the next
  // one).
  test("ascending: titles sort A→Z and segue tiebreaks ahead of non-segue", async () => {
    const { songAfterSortingFn } = await import("./performance-columns");
    const fakeRow = (songAfter: { songTitle: string } | undefined, segue: string | null = null) =>
      ({ original: { songAfter, segue } }) as unknown as Parameters<typeof songAfterSortingFn>[0];

    // Primary: alphabetical.
    expect(songAfterSortingFn(fakeRow({ songTitle: "Above the Waves" }), fakeRow({ songTitle: "Spaga" }))).toBeLessThan(
      0,
    );

    // Tiebreaker: segue row sorts before non-segue row when titles tie.
    expect(
      songAfterSortingFn(fakeRow({ songTitle: "Tractorbeam" }, ">"), fakeRow({ songTitle: "Tractorbeam" }, null)),
    ).toBeLessThan(0);

    // Set closers (undefined songAfter) sort last.
    expect(songAfterSortingFn(fakeRow({ songTitle: "Spaga" }), fakeRow(undefined))).toBeLessThan(0);
  });
});

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

// Rating column sort comparator: tracks with the same community average
// resolve by vote count (more votes = more confidence), then by show date,
// then by track position. Verified via the exported comparator directly so
// edge cases stay focused on the comparator math rather than the full table.
describe("ratingSortingFn", () => {
  // Primary axis: higher rating > lower rating. Comparator returns a positive
  // number when `a > b` so TanStack treats `b` as smaller in ascending order
  // and surfaces `a` first when sorted descending (the column's default).
  test("ascending: lower rating < higher rating", async () => {
    const { ratingSortingFn } = await import("./performance-columns");
    const fakeRow = (rating: number | null, ratingsCount: number, date: string, position: number) =>
      ({ original: { rating, ratingsCount, position, show: { date } } }) as unknown as Parameters<
        typeof ratingSortingFn
      >[0];

    expect(ratingSortingFn(fakeRow(3.5, 5, "2024-01-01", 1), fakeRow(4.5, 5, "2024-01-01", 1))).toBeLessThan(0);
    expect(ratingSortingFn(fakeRow(4.5, 5, "2024-01-01", 1), fakeRow(3.5, 5, "2024-01-01", 1))).toBeGreaterThan(0);
  });

  // Missing ratings (null) collapse to -Infinity so unrated tracks cluster at
  // the bottom on desc (best-first) and the top on asc — matching the gap
  // column's treatment of debuts/repeats.
  test("null ratings sort below all rated rows", async () => {
    const { ratingSortingFn } = await import("./performance-columns");
    const fakeRow = (rating: number | null, ratingsCount: number, date: string, position: number) =>
      ({ original: { rating, ratingsCount, position, show: { date } } }) as unknown as Parameters<
        typeof ratingSortingFn
      >[0];

    expect(ratingSortingFn(fakeRow(null, 0, "2024-01-01", 1), fakeRow(1.0, 1, "2024-01-01", 1))).toBeLessThan(0);
  });

  // First tiebreak: when two rows share a rating, the one with more votes
  // sorts higher. More votes = higher confidence the average is real, so
  // when scanning "best rated", a 4.8/100-votes version should beat a
  // 4.8/3-votes version.
  test("tied rating: more votes wins the tiebreak", async () => {
    const { ratingSortingFn } = await import("./performance-columns");
    const fakeRow = (rating: number | null, ratingsCount: number, date: string, position: number) =>
      ({ original: { rating, ratingsCount, position, show: { date } } }) as unknown as Parameters<
        typeof ratingSortingFn
      >[0];

    // 4.8/3-votes < 4.8/100-votes (less votes sorts first in asc).
    expect(ratingSortingFn(fakeRow(4.8, 3, "2024-01-01", 1), fakeRow(4.8, 100, "2024-01-01", 1))).toBeLessThan(0);
    expect(ratingSortingFn(fakeRow(4.8, 100, "2024-01-01", 1), fakeRow(4.8, 3, "2024-01-01", 1))).toBeGreaterThan(0);
  });

  // Second tiebreak: rating + votes both equal → fall through to show date so
  // identical-quality performances across shows still cluster by show.
  test("tied rating and votes: earlier date wins the tiebreak", async () => {
    const { ratingSortingFn } = await import("./performance-columns");
    const fakeRow = (rating: number | null, ratingsCount: number, date: string, position: number) =>
      ({ original: { rating, ratingsCount, position, show: { date } } }) as unknown as Parameters<
        typeof ratingSortingFn
      >[0];

    expect(ratingSortingFn(fakeRow(4.5, 10, "2018-06-01", 1), fakeRow(4.5, 10, "2024-08-15", 1))).toBeLessThan(0);
    expect(ratingSortingFn(fakeRow(4.5, 10, "2024-08-15", 1), fakeRow(4.5, 10, "2018-06-01", 1))).toBeGreaterThan(0);
  });

  // Final tiebreak: rating + votes + date all equal (within-show repeat) →
  // position breaks so repeats stay in setlist order relative to each other.
  test("tied rating, votes, and date: position breaks the tie", async () => {
    const { ratingSortingFn } = await import("./performance-columns");
    const fakeRow = (rating: number | null, ratingsCount: number, date: string, position: number) =>
      ({ original: { rating, ratingsCount, position, show: { date } } }) as unknown as Parameters<
        typeof ratingSortingFn
      >[0];

    expect(ratingSortingFn(fakeRow(5.0, 12, "2012-08-15", 3), fakeRow(5.0, 12, "2012-08-15", 8))).toBeLessThan(0);
  });
});

describe("createPerformanceColumns extras", () => {
  // Icon-only / ultra-narrow columns declare `fixedWidth` so they never
  // grow or shrink with the table — they hold a single glyph or 1-2
  // chars. Other columns flex via `weight` to fill the remainder.
  test("allTimer column is fixed-width", () => {
    const columns = createPerformanceColumns({ ...defaultOptions, showAllTimerColumn: true });

    const allTimerColumn = columns.find((column) => "id" in column && column.id === "allTimer");
    expect(allTimerColumn?.meta?.fixedWidth).toBeTruthy();
  });
});
