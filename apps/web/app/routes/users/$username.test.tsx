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
// The rating-display card reads flags via this hook; off by default in these tests.
vi.mock("~/hooks/use-feature-flags", () => ({
  useFeatureFlags: () => ({
    calibratedEnabled: false,
    toggleVisible: false,
    compareVisible: false,
    defaultCalibrated: false,
    explainerNavLink: false,
    recomputeEnabled: false,
  }),
}));

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
import UserProfile, { parseTab, shouldRevalidate } from "./$username";

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

  // On your own profile the Settings tab (display preferences) leads the
  // strip — it replaces the settings cards that used to stack above the tabs.
  test("Settings is the leftmost tab on your own profile", () => {
    renderProfile();

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveTextContent(/settings/i);
  });

  // Tab order matters — Settings leads on your own profile, then the activity
  // surfaces (Shows, Reviews, Ratings, Blog).
  test("tabs render in order: Settings, Shows Attended, Reviews, Show Ratings, Song Version Ratings", () => {
    renderProfile();

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveTextContent(/settings/i);
    expect(tabs[1]).toHaveTextContent(/shows attended/i);
    expect(tabs[2]).toHaveTextContent(/reviews/i);
    expect(tabs[3]).toHaveTextContent(/show ratings/i);
    expect(tabs[4]).toHaveTextContent(/song version ratings/i);
  });

  // The display-preference cards live under the Settings tab now, not stacked
  // above the strip. They only render when the Settings tab is active.
  test("Settings tab holds the display-preference cards on your own profile", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValue({ ...baseLoaderData, activeTab: "settings" });

    renderProfile("/users/evan?tab=settings");

    expect(screen.getByText(/rating display/i)).toBeInTheDocument();
    expect(screen.getByText(/setlist display/i)).toBeInTheDocument();
  });

  // Regression guard: the settings cards must not leak above the tab strip on
  // the default (Shows) landing — they belong to the Settings tab only.
  test("does not render the settings cards above the tab strip", () => {
    renderProfile();

    expect(screen.queryByText(/rating display/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/setlist display/i)).not.toBeInTheDocument();
  });

  // Settings are personal, so another user's profile has no Settings tab and
  // leads with their Shows Attended activity.
  test("no Settings tab when viewing another user's profile; Shows Attended leads", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValue({
      ...baseLoaderData,
      isOwnProfile: false,
      user: { ...baseLoaderData.user, username: "barberj" },
    });

    renderProfile("/users/barberj");

    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveTextContent(/shows attended/i);
    expect(screen.queryByRole("tab", { name: /^settings/i })).not.toBeInTheDocument();
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
      [/^settings/i, "?tab=settings"],
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

  // The Charts/Table sub-tab is URL-driven (`?view=`), so a shared or
  // refreshed link lands on the same view. `view=table` renders the table
  // immediately, no click needed.
  test("renders the ratings table directly when ?view=table is in the URL", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValue({
      ...baseLoaderData,
      activeTab: "show-ratings",
      showRatings: [showRatingRow],
      ratingsPagination: { page: 1, pageSize: 100, totalPages: 1, total: 1 },
    });

    renderProfile("/users/evan?tab=show-ratings&view=table");

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByTestId("RatingCharts")).not.toBeInTheDocument();
  });

  // Absent `view` (or `view=charts`) defaults to the Charts view.
  test("defaults to the Charts view when no view param is present", () => {
    vi.mocked(useSerializedLoaderData).mockReturnValue({
      ...baseLoaderData,
      activeTab: "show-ratings",
      showRatings: [showRatingRow],
      ratingsPagination: { page: 1, pageSize: 100, totalPages: 1, total: 1 },
    });

    renderProfile("/users/evan?tab=show-ratings");

    expect(screen.getByTestId("RatingCharts")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
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

describe("parseTab", () => {
  // Own profile leads with (and defaults to) the Settings tab.
  test("defaults to settings on your own profile", () => {
    expect(parseTab(null, true)).toBe("settings");
  });

  // Other profiles have no Settings tab, so they default to Shows Attended.
  test("defaults to shows on another user's profile", () => {
    expect(parseTab(null, false)).toBe("shows");
  });

  // A ?tab=settings link to someone else's profile can't select the
  // (non-existent) Settings tab — it falls back to the default.
  test("rejects settings on another user's profile", () => {
    expect(parseTab("settings", false)).toBe("shows");
  });

  // A valid non-settings tab is honored regardless of ownership.
  test("honors an explicit tab param", () => {
    expect(parseTab("track-ratings", true)).toBe("track-ratings");
    expect(parseTab("track-ratings", false)).toBe("track-ratings");
  });
});

describe("shouldRevalidate", () => {
  const run = (current: string, next: string) =>
    shouldRevalidate({
      currentUrl: new URL(`https://x.test${current}`),
      nextUrl: new URL(`https://x.test${next}`),
      defaultShouldRevalidate: true,
      // biome-ignore lint/suspicious/noExplicitAny: only the three fields above are read.
    } as any);

  // Toggling Charts/Table changes only `view`, which the loader ignores — so
  // it must not refetch the (heavy) ratings query.
  test("skips revalidation when only the view sub-tab changes", () => {
    expect(run("/users/evan?tab=show-ratings", "/users/evan?tab=show-ratings&view=table")).toBe(false);
  });

  // A tab / page / sort / dir change is loader-relevant and must revalidate.
  test("revalidates when a loader-relevant param changes", () => {
    expect(run("/users/evan?tab=show-ratings", "/users/evan?tab=track-ratings")).toBe(true);
    expect(run("/users/evan?tab=show-ratings&page=1", "/users/evan?tab=show-ratings&page=2")).toBe(true);
    expect(run("/users/evan?tab=show-ratings&sort=date", "/users/evan?tab=show-ratings&sort=rating")).toBe(true);
    expect(run("/users/evan?tab=show-ratings&dir=desc", "/users/evan?tab=show-ratings&dir=asc")).toBe(true);
  });
});
