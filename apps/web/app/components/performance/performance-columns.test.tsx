import type { SongPagePerformance } from "@bip/domain";
import { screen } from "@testing-library/react";
import { mockShallowComponent, setup } from "@test/test-utils";
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

  // Each Date cell links to the show's detail page so users can click
  // through to see the full setlist.
  test("Date cell links to /shows/{show.slug}", async () => {
    const performances = [
      makePerformance({ show: { id: "s1", slug: "2024-06-15-the-cap", date: "2024-06-15", venueId: "v1" } }),
    ];
    const columns = createPerformanceColumns(defaultOptions);
    await setup(<DataTable columns={columns} data={performances} hideSearch hidePagination />);

    const dateLink = screen.getByRole("link", { name: "2024-06-15" });
    expect(dateLink).toHaveAttribute("href", "/shows/2024-06-15-the-cap");
  });

  // Sortable columns (Date, Set, Rating, Song) show an up/down arrow icon
  // even when not actively sorted, so users can see at a glance which
  // columns support sorting. Non-sortable columns (Venue, Sequence, Notes)
  // render plain text headers with no icon.
  test("sortable columns show sort indicator, non-sortable columns do not", async () => {
    const columns = createPerformanceColumns(defaultOptions);
    await setup(
      <DataTable columns={columns} data={[makePerformance()]} hideSearch hidePagination variant="plain" />,
    );

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
    const venueHeader = screen.getByText("Venue").closest("th");
    expect(venueHeader?.querySelector("button")).toBeNull();

    const sequenceHeader = screen.getByText("Sequence").closest("th");
    expect(sequenceHeader?.querySelector("button")).toBeNull();
  });

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
