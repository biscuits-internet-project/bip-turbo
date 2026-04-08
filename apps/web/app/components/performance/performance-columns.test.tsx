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
    show: { id: "show-1", slug: "2024-06-15-the-cap", date: "2024-06-15", venueId: "venue-1" },
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
    tags: {},
    ...overrides,
  };
}

const defaultOptions = {
  userRatingMap: new Map<string, number>(),
  isAuthenticated: false,
};

describe("createPerformanceColumns", () => {
  // The default column set (no optional columns) renders Date, Venue, Set,
  // Sequence, Notes, and Rating headers. These are always present regardless
  // of which page renders the table.
  test("default columns include Date, Venue, Set, Sequence, Notes, Rating headers", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Venue")).toBeInTheDocument();
    expect(screen.getByText("Set")).toBeInTheDocument();
    expect(screen.getByText("Sequence")).toBeInTheDocument();
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Rating")).toBeInTheDocument();
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
  // field, NOT from the userRatingMap.
  test("passes initialRating from performance.rating even when userRatingMap is empty", async () => {
    const performances = [makePerformance({ trackId: "t1", rating: 3.5, ratingsCount: 2 })];
    const columns = createPerformanceColumns({ ...defaultOptions, userRatingMap: new Map() });
    await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const cell = screen.getByTestId("TrackRatingCell");
    expect(cell.textContent).toContain('"initialRating":3.5');
    expect(cell.textContent).toContain('"ratingsCount":2');
  });

  // A performance with rating=0 or rating=undefined should pass
  // initialRating as null (not 0) so TrackRatingCell shows "Rate".
  test("passes initialRating as null when performance.rating is undefined", async () => {
    const performances = [makePerformance({ trackId: "t1", rating: undefined, ratingsCount: undefined })];
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const cell = screen.getByTestId("TrackRatingCell");
    expect(cell.textContent).toContain('"initialRating":null');
    expect(cell.textContent).toContain('"ratingsCount":null');
  });

  // Each Date cell links to the show's detail page.
  test("Date cell links to /shows/{show.slug}", async () => {
    const performances = [
      makePerformance({ show: { id: "s1", slug: "2024-06-15-the-cap", date: "2024-06-15", venueId: "v1" } }),
    ];
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const dateLink = screen.getByRole("link", { name: "2024-06-15" });
    expect(dateLink).toHaveAttribute("href", "/shows/2024-06-15-the-cap");
  });

  // Sortable columns show sort indicators; non-sortable columns do not.
  test("sortable columns show sort indicator, non-sortable columns do not", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination />);

    const dateHeader = screen.getByText("Date").closest("button");
    expect(dateHeader).not.toBeNull();
    expect(dateHeader?.querySelector("svg")).not.toBeNull();

    const setHeader = screen.getByText("Set").closest("th");
    expect(setHeader?.querySelector("button")).toBeNull();

    const ratingHeader = screen.getByText("Rating").closest("button");
    expect(ratingHeader).not.toBeNull();
    expect(ratingHeader?.querySelector("svg")).not.toBeNull();

    const venueHeader = screen.getByText("Venue").closest("th");
    expect(venueHeader?.querySelector("button")).toBeNull();

    const sequenceHeader = screen.getByText("Sequence").closest("th");
    expect(sequenceHeader?.querySelector("button")).toBeNull();
  });

  // Columns that need constrained widths set explicit meta.width.
  test("allTimer and Set columns have explicit meta.width", () => {
    const columns = createPerformanceColumns({ ...defaultOptions, showAllTimerColumn: true });

    const allTimerColumn = columns.find((column) => "id" in column && column.id === "allTimer");
    expect(allTimerColumn?.meta?.width).toBe("24px");

    const setColumn = columns.find((column) => "accessorKey" in column && column.accessorKey === "set");
    expect(setColumn?.meta?.width).toBe("48px");
  });
});
