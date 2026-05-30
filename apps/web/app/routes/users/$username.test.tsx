import { mockShallowComponent } from "@test/test-utils";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// Server-side modules — stubbed so the component can import the route file
// without pulling Prisma/Supabase into the test bundle.
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/server/show-external-sources", () => ({ computeShowExternalSources: vi.fn() }));
vi.mock("~/server/show-user-data", () => ({ computeShowUserData: vi.fn() }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));

// Default loader payload — most attendance has a Disco Biscuits setlist
// (per project test convention).
const baseLoaderData = {
  user: {
    id: "u1",
    email: "evan@foo.net",
    username: "evan",
    avatarUrl: null,
    createdAt: new Date("2020-01-01T00:00:00Z"),
  },
  reviews: [],
  blogPosts: [],
  attendedSetlists: [
    {
      show: {
        id: "show-1",
        date: "2024-08-12",
        slug: "2024-08-12-port-chester-ny",
        averageRating: 4.5,
        venue: { name: "The Capitol Theatre", city: "Port Chester", state: "NY" },
      },
      sets: [{ label: "S1", tracks: [{ id: "t1", song: { title: "Basis for a Day" } }] }],
    },
  ],
  attendedExternalSources: {},
  dehydratedState: { mutations: [], queries: [] },
  attendedPagination: { page: 1, pageSize: 100, totalPages: 1, total: 1 },
  ratingsPagination: { page: 1, pageSize: 100, totalPages: 1, total: 0 },
  activeTab: "shows" as const,
  showRatings: [],
  trackRatings: [],
  attendanceCount: 1,
  reviewCount: 0,
  showRatingsCount: 0,
  trackRatingsCount: 0,
  totalRatings: 0,
  userStat: { communityScore: 0, badges: [], blogPostCount: 0 },
  firstShow: { id: "show-1", date: "2024-08-12" },
  lastShow: { id: "show-1", date: "2024-08-12" },
  isOwnProfile: true,
};

vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => baseLoaderData),
}));

// Stub the heavy SetlistList child. We still want to verify the `empty`
// slot, so we render it inline when no setlists were passed — mirroring
// SetlistList's own behavior. When setlists is non-empty we surface the
// count and first show id as data-attrs so tests can assert wiring without
// depending on JSON-stringified prop serialization (mockShallowComponent's
// replacer drops nested keys).
vi.mock("~/components/setlist/setlist-list", () => ({
  SetlistList: (props: {
    setlists: Array<{ show: { id: string } }>;
    empty?: React.ReactNode;
    externalSources?: Record<string, unknown>;
  }) => {
    if (!props.setlists || props.setlists.length === 0) {
      return <div data-testid="SetlistList">{props.empty}</div>;
    }
    return (
      <div
        data-testid="SetlistList"
        data-setlists-count={props.setlists.length}
        data-first-show-id={props.setlists[0]?.show?.id ?? ""}
      >
        {mockShallowComponent("SetlistListShallow", { setlistsCount: props.setlists.length })}
      </div>
    );
  },
}));

// Stub the charts view — it's the default on the rating tabs, but it renders
// recharts (unreliable in jsdom) and these tests cover routing/table/pagination
// wiring, not the chart internals (those are unit-tested in rating-charts.test.ts).
vi.mock("~/components/rating/rating-charts", () => ({
  RatingCharts: () => <div data-testid="RatingCharts" />,
}));

import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import UserProfile from "./$username";

// Minimal rating rows so the rating tabs render their table (the tab is empty,
// not paginated, when the list is empty). Disco Biscuits song per convention.
const showRatingRow = {
  id: "sr1",
  value: 5,
  createdAt: new Date("2024-01-02T00:00:00Z"),
  show: {
    slug: "2024-08-12-port-chester-ny",
    date: "2024-08-12",
    venue: { name: "The Cap", city: "Port Chester", state: "NY" },
  },
};
const trackRatingRow = {
  id: "tr1",
  value: 4.5,
  createdAt: new Date("2024-01-02T00:00:00Z"),
  track: {
    slug: "basis-for-a-day-t1",
    position: 1,
    set: "S1",
    encoresInSet: 0,
    show: { slug: "2024-08-12-port-chester-ny", date: "2024-08-12", venue: { name: "The Cap" } },
    song: { slug: "basis-for-a-day", title: "Basis for a Day" },
  },
};

function renderProfile(initialEntry = "/users/evan") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <UserProfile />
    </MemoryRouter>,
  );
}

describe("UserProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSerializedLoaderData).mockReturnValue(baseLoaderData);
  });

  // The Shows Attended tab is the user's primary activity record and should
  // be the first thing seen on the profile page.
  test("Shows Attended is the leftmost tab", () => {
    renderProfile();

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveTextContent(/shows attended/i);
  });

  // Tab order matters — keep Reviews/Ratings/Blog after Shows so the most
  // common landing surface is at the start.
  test("tabs render in order: Shows Attended, Reviews, Show Ratings, Song Version Ratings", () => {
    renderProfile();

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveTextContent(/shows attended/i);
    expect(tabs[1]).toHaveTextContent(/reviews/i);
    expect(tabs[2]).toHaveTextContent(/show ratings/i);
    expect(tabs[3]).toHaveTextContent(/song version ratings/i);
  });

  // Default selection is "shows" — landing on a profile shows the attended
  // setlist list, not the (often empty) reviews tab.
  test("Shows Attended tab is selected by default", () => {
    renderProfile();

    const showsTab = screen.getByRole("tab", { name: /shows attended/i });
    expect(showsTab.getAttribute("data-state")).toBe("active");
  });

  // Active tab is driven by the loader-provided `activeTab` (parsed from
  // `?tab=` on the server). Loading the page with ?tab=track-ratings should
  // surface that tab as active so a refresh / shared link lands on the same
  // surface. `mockReturnValue` (not Once) covers React's potential double-
  // render in concurrent mode.
  test("active tab follows the loader's activeTab value", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValue({
      ...baseLoaderData,
      activeTab: "track-ratings",
    });

    renderProfile("/users/evan?tab=track-ratings");

    const trackTab = screen.getByRole("tab", { name: /song version ratings/i });
    expect(trackTab.getAttribute("data-state")).toBe("active");
    const showsTab = screen.getByRole("tab", { name: /shows attended/i });
    expect(showsTab.getAttribute("data-state")).toBe("inactive");
  });

  // Each tab is rendered as a <Link> (via Radix asChild) so clicking
  // triggers a full navigation — the loader re-runs and fetches only that
  // tab's data. Radix overrides the anchor's role to "tab", so we query by
  // tab role and verify the underlying href.
  test("each tab links to ?tab=<value> for server-side navigation", () => {
    renderProfile();

    const expectedTargets: Array<[RegExp, string]> = [
      [/shows attended/i, "?tab=shows"],
      [/^reviews/i, "?tab=reviews"],
      [/^show ratings/i, "?tab=show-ratings"],
      [/song version ratings/i, "?tab=track-ratings"],
    ];
    for (const [label, expectedHref] of expectedTargets) {
      const tab = screen.getByRole("tab", { name: label });
      expect(tab.getAttribute("href")).toContain(expectedHref);
    }
  });

  // Profile tabs render as a <select> on mobile (sm:hidden) and the
  // horizontal tab strip at sm+. Mirrors the song-detail page pattern so
  // the long "Song Version Ratings" label doesn't clip on phones.
  test("tabs render as a select on mobile and a tab strip at sm+", () => {
    renderProfile();

    const tabList = screen.getByRole("tablist");
    expect(tabList.className).toContain("hidden");
    expect(tabList.className).toContain("sm:flex");

    const select = screen.getByLabelText(/profile view/i);
    const wrapper = select.closest("div");
    expect(wrapper?.className).toContain("sm:hidden");
  });

  // The route delegates rendering to SetlistList, passing through the
  // loader-built setlists and external sources. Load-bearing wiring test:
  // if the loader keys are renamed without updating the JSX, this catches
  // it via the stub's surfaced data-attrs. (SSR cache seeding now flows
  // through the root HydrationBoundary, not a SetlistList prop.)
  test("renders SetlistList with the loader's attended-shows payload", () => {
    renderProfile();

    const setlistList = screen.getByTestId("SetlistList");
    expect(setlistList).toBeInTheDocument();
    expect(setlistList.getAttribute("data-setlists-count")).toBe("1");
    expect(setlistList.getAttribute("data-first-show-id")).toBe("show-1");
  });

  // Empty attended-shows list: SetlistList renders the `empty` slot when
  // no setlists are passed; the route's empty copy must be wired through.
  test("renders the own-profile empty copy when no attended shows", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      ...baseLoaderData,
      attendedSetlists: [],
      attendedExternalSources: {},
      attendanceCount: 0,
    });

    renderProfile();

    expect(screen.getByText("No Shows Attended")).toBeInTheDocument();
    expect(screen.getByText(/you haven't marked any shows/i)).toBeInTheDocument();
  });

  // Pagination chrome is hidden when there's only one page — most users
  // have <100 attended shows so we shouldn't show empty Prev/Next controls.
  test("does not render pagination when totalPages is 1", () => {
    renderProfile();
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  // Heaviest user case: 459 shows across 5 pages of 100. Pagination chrome
  // renders both above and below the list, so we expect two of each button.
  // PaginationControls also surfaces a "Page [input] of N" widget — both
  // page-input fields should reflect the current page.
  test("renders Prev/Next buttons and row range when totalPages > 1", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      ...baseLoaderData,
      attendedPagination: { page: 3, pageSize: 100, totalPages: 5, total: 459 },
    });

    renderProfile();
    // "Showing 201 to 300 of 459 results" (desktop) — two pagination strips.
    expect(screen.getAllByText(/Showing 201 to 300 of 459 results/)).toHaveLength(2);
    expect(screen.getAllByText(/of 5/)).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /previous/i })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /next/i })).toHaveLength(2);
    // The page input is a spinbutton with the current page as defaultValue.
    const pageInputs = screen.getAllByRole("spinbutton");
    expect(pageInputs).toHaveLength(2);
    for (const input of pageInputs) {
      expect(input).toHaveAttribute("max", "5");
      expect((input as HTMLInputElement).defaultValue).toBe("3");
    }
  });

  // Show-Ratings and Track-Ratings tabs paginate at 100/page to keep the
  // rendered DOM small on heavy users (~7,800 track ratings at the top end). The
  // loader provides `ratingsPagination` whenever the active tab is one of
  // the rating tabs; component renders PaginationControls below the list.
  test("shows show-ratings pagination in the table view when totalPages > 1", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValue({
      ...baseLoaderData,
      activeTab: "show-ratings",
      showRatings: [showRatingRow],
      ratingsPagination: { page: 1, pageSize: 100, totalPages: 18, total: 1739 },
    });

    renderProfile("/users/evan?tab=show-ratings");
    // Charts is the default view, so pagination isn't shown until the user
    // switches to the table.
    expect(screen.queryByText(/Showing 1 to 100 of 1739 results/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^table$/i }));
    // Pagination chrome renders both above and below the table.
    expect(screen.getAllByText(/Showing 1 to 100 of 1739 results/)).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: /next/i })).toHaveLength(2);
  });

  // Same for track-ratings — pagination chrome is shared infrastructure.
  test("shows track-ratings pagination in the table view when totalPages > 1", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValue({
      ...baseLoaderData,
      activeTab: "track-ratings",
      trackRatings: [trackRatingRow],
      ratingsPagination: { page: 2, pageSize: 100, totalPages: 78, total: 7784 },
    });

    renderProfile("/users/evan?tab=track-ratings");
    fireEvent.click(screen.getByRole("button", { name: /^table$/i }));
    expect(screen.getAllByText(/Showing 101 to 200 of 7784 results/)).toHaveLength(2);
  });

  // Pagination chrome stays hidden on the rating tabs when the user has
  // fewer ratings than a single page — avoids noisy "Page 1 of 1" UI for
  // the typical user who has <100 ratings.
  test("hides rating-tab pagination when totalPages is 1", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValue({
      ...baseLoaderData,
      activeTab: "show-ratings",
      showRatings: [showRatingRow],
      ratingsPagination: { page: 1, pageSize: 100, totalPages: 1, total: 5 },
    });

    renderProfile("/users/evan?tab=show-ratings");
    fireEvent.click(screen.getByRole("button", { name: /^table$/i }));
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
  });

  // Last page: Next button is rendered but disabled. Previous remains enabled.
  test("disables Next on the last page", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      ...baseLoaderData,
      attendedPagination: { page: 5, pageSize: 100, totalPages: 5, total: 459 },
    });

    renderProfile();
    const nextButtons = screen.getAllByRole("button", { name: /next/i });
    const prevButtons = screen.getAllByRole("button", { name: /previous/i });
    expect(nextButtons).toHaveLength(2);
    expect(prevButtons).toHaveLength(2);
    for (const btn of nextButtons) {
      expect(btn).toBeDisabled();
    }
    for (const btn of prevButtons) {
      expect(btn).not.toBeDisabled();
    }
  });

  // Other-user view: the empty-state copy switches from second-person to
  // third-person and includes the viewed user's username.
  test("empty-state copy references the username when viewing another user's profile", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValueOnce({
      ...baseLoaderData,
      attendedSetlists: [],
      attendanceCount: 0,
      isOwnProfile: false,
      user: { ...baseLoaderData.user, username: "barberj" },
    });

    renderProfile();

    expect(screen.getByText(/barberj hasn't marked any shows/i)).toBeInTheDocument();
  });
});
