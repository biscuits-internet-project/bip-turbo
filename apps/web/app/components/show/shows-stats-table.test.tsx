import type { Attendance, ShowStatsRow } from "@bip/domain";
import { mockShallowComponent, setupWithRouter } from "@test/test-utils";
import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/hooks/use-session", () => ({
  useSession: vi.fn(() => ({ user: null, supabase: null })),
}));
vi.mock("~/hooks/use-show-user-data", () => ({
  useShowUserData: vi.fn(() => ({
    attendanceMap: new Map(),
    userRatingMap: new Map(),
    averageRatingMap: new Map(),
    displayedRatingMap: new Map(),
    rankComparisonMap: new Map(),
    isLoading: false,
    error: null,
  })),
}));

// The rating badge posts and reads preferences; the table's contract is that it
// hands the badge the row's own rating, which the marker makes assertable.
vi.mock("~/components/rating/rating-badge-button", () => ({
  RatingBadgeButton: (props: object) => mockShallowComponent("RatingBadgeButton", props),
}));

import { useSession } from "~/hooks/use-session";
import { useShowUserData } from "~/hooks/use-show-user-data";
import { ShowsStatsTable } from "./shows-stats-table";

function makeRow(overrides: Partial<ShowStatsRow> = {}): ShowStatsRow {
  return {
    id: "show-1",
    slug: "2001-09-01-wetlands-preserve-new-york-ny",
    date: "2001-09-01",
    countForStats: true,
    venueName: "Wetlands Preserve",
    venueCity: "New York",
    venueState: "NY",
    averageRating: 4.88,
    ratingsCount: 33,
    duration: 13218,
    untimedTracks: 0,
    medianGap: 8,
    longestGap: 25,
    vintage: 1998,
    jamCharts: 6,
    photosCount: 43,
    youtubeCount: 0,
    ...overrides,
  };
}

function renderTable(rows: ShowStatsRow[]) {
  return setupWithRouter(<ShowsStatsTable rows={rows} externalSources={{}} />);
}

/** Body rows in render order, which is the table's default date-descending sort. */
const bodyRows = () => screen.getAllByRole("row").filter((row) => row.querySelector("td"));

beforeEach(() => {
  vi.mocked(useSession).mockReturnValue({ user: null, supabase: null } as ReturnType<typeof useSession>);
});

describe("ShowsStatsTable", () => {
  test("renders the rarity numbers at the precision each one carries", async () => {
    await renderTable([makeRow({ medianGap: 8, longestGap: 25, vintage: 1998, jamCharts: 6 })]);

    const row = bodyRows()[0];
    // Median gap is a continuous median, so it keeps a decimal — a show's own
    // page prints it the same way. Everything else is a whole number.
    expect(within(row).getByText("8.0")).toBeDefined();
    expect(within(row).getByText("25")).toBeDefined();
    expect(within(row).getByText("1998")).toBeDefined();
    expect(within(row).getByText("6")).toBeDefined();
  });

  test("keeps the half-step a continuous median lands on", async () => {
    // 383 shows in the catalog have an even song count and a fractional median.
    await renderTable([makeRow({ medianGap: 5.5 })]);

    expect(within(bodyRows()[0]).getByText("5.5")).toBeDefined();
  });

  test("formats the show total as running time, not seconds", async () => {
    await renderTable([makeRow({ duration: 13218 })]);

    expect(screen.getByText("3:40:18")).toBeDefined();
  });

  test("flags a running time that only covers the tracks we've timed", async () => {
    // Same asterisk the setlist view wears, so a partial sum never reads as the
    // show's real length. ~400 shows in the catalog are partially timed.
    await renderTable([makeRow({ duration: 13218, untimedTracks: 5 })]);

    const total = screen.getByText(/3:40:18/);
    expect(total.textContent).toBe("3:40:18*");
    expect(total.getAttribute("title")).toBe("Partial: 5 tracks not yet timed");
  });

  test("leaves a fully-timed running time unmarked", async () => {
    await renderTable([makeRow({ duration: 13218, untimedTracks: 0 })]);

    const total = screen.getByText("3:40:18");
    expect(total.textContent).toBe("3:40:18");
    expect(total.getAttribute("title")).toBeNull();
  });

  test("renders an em dash for a show whose setlist has no timing or gap data", async () => {
    await renderTable([makeRow({ duration: null, medianGap: null, longestGap: null, vintage: null })]);

    // Four stat columns with nothing to show.
    expect(screen.getAllByText("—")).toHaveLength(4);
  });

  test("marks a non-stats show so it can be dimmed", async () => {
    await renderTable([
      makeRow({ id: "soundcheck", slug: "b", date: "2001-09-02", countForStats: false }),
      makeRow({ id: "regular", slug: "a", countForStats: true }),
    ]);

    const [newest, older] = bodyRows();
    expect(newest.getAttribute("data-counts-for-stats")).toBe("false");
    expect(older.getAttribute("data-counts-for-stats")).toBe("true");
  });

  test("marks the rows the viewer attended", async () => {
    vi.mocked(useSession).mockReturnValue({ user: { id: "u-1" }, supabase: null } as ReturnType<typeof useSession>);
    vi.mocked(useShowUserData).mockReturnValue({
      attendanceMap: new Map([["seen", { id: "att-1", showId: "seen", userId: "u-1" } as Attendance]]),
      userRatingMap: new Map(),
      averageRatingMap: new Map(),
      displayedRatingMap: new Map(),
      rankComparisonMap: new Map(),
      isLoading: false,
      error: null,
    });

    await renderTable([makeRow({ id: "missed", slug: "b", date: "2001-09-02" }), makeRow({ id: "seen", slug: "a" })]);

    const [missed, seen] = bodyRows();
    expect(missed.getAttribute("data-attended")).toBe("false");
    expect(seen.getAttribute("data-attended")).toBe("true");
  });

  test("shows the venue alongside the date", async () => {
    await renderTable([makeRow()]);

    expect(screen.getByText("Wetlands Preserve, New York, NY")).toBeDefined();
  });

  test("seeds the rating badge from the row rather than waiting on the per-viewer fetch", async () => {
    // The community average ships with the cached payload precisely so ratings
    // paint on first render.
    await renderTable([makeRow({ averageRating: 4.88, ratingsCount: 33 })]);

    const badge = screen.getByTestId("RatingBadgeButton");
    expect(badge.textContent).toContain('"initialRating":4.88');
    expect(badge.textContent).toContain('"ratingsCount":33');
  });

  test("sorts a calibrated viewer's ratings by the score they can actually see", async () => {
    // Reading the calibrated score for the cell while sorting on the canonical
    // average produces a list whose visible numbers are out of order — which is
    // what shipped first. The two shows below rank opposite ways under the two
    // scores, so this fails loudly if they ever diverge again.
    vi.mocked(useSession).mockReturnValue({ user: { id: "u-1" }, supabase: null } as ReturnType<typeof useSession>);
    vi.mocked(useShowUserData).mockReturnValue({
      attendanceMap: new Map(),
      userRatingMap: new Map(),
      averageRatingMap: new Map(),
      displayedRatingMap: new Map([
        ["higher-canonical", { rating: 4.389, count: 20 }],
        ["lower-canonical", { rating: 4.521, count: 30 }],
      ]),
      rankComparisonMap: new Map(),
      isLoading: false,
      error: null,
    });

    const { user } = await renderTable([
      makeRow({ id: "higher-canonical", slug: "a", date: "2001-09-02", averageRating: 4.9, ratingsCount: 20 }),
      makeRow({ id: "lower-canonical", slug: "b", date: "2001-09-01", averageRating: 4.1, ratingsCount: 30 }),
    ]);

    await user.click(screen.getByRole("button", { name: /Rating/ }));

    expect(within(bodyRows()[0]).getByTestId("RatingBadgeButton").textContent).toContain('"initialRating":4.521');
  });

  // A show with no known runtime is useless at the top of the list in either
  // direction: one click should show the shortest known show, the next the
  // longest, with the unknowns out of the way both times.
  test.each([
    ["shortest first", 1],
    ["longest first", 2],
  ])("keeps shows with no runtime at the bottom when sorting %s", async (_label, clicks) => {
    const { user } = await renderTable([
      makeRow({ id: "unknown", slug: "a", date: "2001-09-03", duration: null }),
      makeRow({ id: "long", slug: "b", date: "2001-09-02", duration: 13218 }),
      makeRow({ id: "short", slug: "c", date: "2001-09-01", duration: 5000 }),
    ]);

    const header = screen.getByRole("button", { name: /Show time/ });
    for (let click = 0; click < clicks; click += 1) await user.click(header);

    const lastRow = bodyRows().at(-1);
    expect(within(lastRow as HTMLElement).getByText("—")).toBeDefined();
  });

  test("sorts longest-first on the first click and shortest-first on the second", async () => {
    // Numeric columns start descending (TanStack infers it from the value type),
    // matching Plays on /songs — the interesting end of a stat is usually the top.
    const { user } = await renderTable([
      makeRow({ id: "short", slug: "c", date: "2001-09-02", duration: 5000 }),
      makeRow({ id: "long", slug: "b", date: "2001-09-01", duration: 13218 }),
    ]);

    const header = screen.getByRole("button", { name: /Show time/ });
    await user.click(header);
    expect(within(bodyRows()[0]).getByText("3:40:18")).toBeDefined();

    await user.click(header);
    expect(within(bodyRows()[0]).getByText("1:23:20")).toBeDefined();
  });

  test("renders no filter chrome when the caller gives it no base path", async () => {
    // The musician profile mounts it this way: that page already spends
    // `timeRange` / `q` on its song tables.
    await renderTable([makeRow()]);

    expect(screen.queryByText("Search & Filters")).toBeNull();
  });

  test("renders the filter chrome when mounted on its own route", async () => {
    await setupWithRouter(<ShowsStatsTable rows={[makeRow()]} externalSources={{}} basePath="/shows/stats" />);

    expect(within(document.body).getByText(/Search & Filters/)).toBeDefined();
  });

  describe("on its own route, with no filters in the URL", () => {
    const mixedRows = [
      makeRow({ id: "soundcheck", slug: "b", date: "2001-09-02", countForStats: false }),
      makeRow({ id: "regular", slug: "a", countForStats: true }),
    ];

    test("scopes to stats shows, matching how the rest of the site counts", async () => {
      await setupWithRouter(<ShowsStatsTable rows={mixedRows} externalSources={{}} basePath="/shows/stats" />);

      expect(bodyRows()).toHaveLength(1);
      expect(bodyRows()[0].getAttribute("data-counts-for-stats")).toBe("true");
    });

    test("shows the stats-only chip already pressed", async () => {
      await setupWithRouter(<ShowsStatsTable rows={mixedRows} externalSources={{}} basePath="/shows/stats" />);

      expect(screen.getByRole("button", { name: "Stats shows only" }).getAttribute("aria-pressed")).toBe("true");
    });

    test("lets the viewer widen it back to every show", async () => {
      const { user } = await setupWithRouter(
        <ShowsStatsTable rows={mixedRows} externalSources={{}} basePath="/shows/stats" />,
      );

      await user.click(screen.getByRole("button", { name: "Stats shows only" }));

      expect(bodyRows()).toHaveLength(2);
    });
  });

  test("keeps non-stats shows when it has no filter chrome to un-hide them with", async () => {
    // The musician profile mounts it this way. Defaulting the scope on there
    // would drop rows with no visible control to get them back — and that page's
    // row set is already stats-scoped upstream, so there's nothing to gain.
    await renderTable([
      makeRow({ id: "soundcheck", slug: "b", date: "2001-09-02", countForStats: false }),
      makeRow({ id: "regular", slug: "a", countForStats: true }),
    ]);

    expect(bodyRows()).toHaveLength(2);
  });
});
