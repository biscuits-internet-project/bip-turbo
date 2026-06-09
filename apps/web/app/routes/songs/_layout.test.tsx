import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Mock Outlet so we don't need to wire up child routes
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, Outlet: () => <div data-testid="outlet" /> };
});

// Mock AdminOnly to render its children unconditionally in tests
vi.mock("~/components/admin/admin-only", () => ({
  AdminOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import SongsLayout from "./_layout";

function renderAtPath(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <SongsLayout />
    </MemoryRouter>,
  );
}

describe("SongsLayout", () => {
  // The layout should render a tab bar with five navigation tabs.
  test("renders five tab links: All Songs, All-Timers, Histories, Last 10 Shows, This Year", () => {
    renderAtPath("/songs");

    expect(screen.getByRole("link", { name: /all songs/i })).toHaveAttribute("href", "/songs");
    expect(screen.getByRole("link", { name: /all-timers/i })).toHaveAttribute("href", "/songs/all-timers");
    expect(screen.getByRole("link", { name: /histories/i })).toHaveAttribute("href", "/songs/histories");
    expect(screen.getByRole("link", { name: /last 10 shows/i })).toHaveAttribute("href", "/songs/recent");
    expect(screen.getByRole("link", { name: /this year/i })).toHaveAttribute("href", "/songs/this-year");
  });

  // The active tab should be visually distinguished via a border-brand-primary
  // class, determined by the current pathname.
  test("highlights 'All Songs' tab when on /songs", () => {
    renderAtPath("/songs");

    const allSongsLink = screen.getByRole("link", { name: /all songs/i });
    expect(allSongsLink.className).toContain("border-brand-primary");
  });

  // When navigated to /songs/all-timers, the All-Timers tab should be active.
  test("highlights 'All-Timers' tab when on /songs/all-timers", () => {
    renderAtPath("/songs/all-timers");

    const allTimersLink = screen.getByRole("link", { name: /all-timers/i });
    expect(allTimersLink.className).toContain("border-brand-primary");

    const allSongsLink = screen.getByRole("link", { name: /all songs/i });
    expect(allSongsLink.className).not.toContain("border-brand-primary");
  });

  // When navigated to /songs/histories, the Histories tab should be active.
  test("highlights 'Histories' tab when on /songs/histories", () => {
    renderAtPath("/songs/histories");

    const historiesLink = screen.getByRole("link", { name: /histories/i });
    expect(historiesLink.className).toContain("border-brand-primary");
  });

  // The tab bar should NOT render on song detail pages, edit pages, or new song page
  // because those are distinct views, not tabs.
  test("does not render tab bar on /songs/:slug", () => {
    renderAtPath("/songs/basis-for-a-day");

    expect(screen.queryByRole("link", { name: /all songs/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /all-timers/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /histories/i })).not.toBeInTheDocument();
  });

  // The tab bar should not render on the new song admin page.
  test("does not render tab bar on /songs/new", () => {
    renderAtPath("/songs/new");

    expect(screen.queryByRole("link", { name: /all songs/i })).not.toBeInTheDocument();
  });

  // The "SONGS" heading should appear in the layout on tabbed pages.
  test("renders SONGS heading on tabbed pages", () => {
    renderAtPath("/songs");

    expect(screen.getByText("SONGS")).toBeInTheDocument();
  });

  // On non-tabbed pages (detail, new, edit) the layout's SONGS header is
  // hidden so it doesn't stack a second heading above the page's own title.
  test("does not render the SONGS layout heading on song detail pages", () => {
    renderAtPath("/songs/basis-for-a-day");

    expect(screen.queryByText("SONGS")).not.toBeInTheDocument();
  });

  // The Outlet should always render regardless of path, since child routes
  // need to be rendered.
  test("always renders Outlet for child routes", () => {
    renderAtPath("/songs");

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  // On mobile, the tab strip is hidden via `sm:flex` (so it does not wrap
  // and clip the rightmost tab on narrow viewports). A native <select>
  // dropdown takes its place inside an `sm:hidden` container so users
  // still have a single-tap way to switch tabs.
  test("tab strip is hidden on mobile (uses sm:flex), select dropdown is mobile-only", () => {
    renderAtPath("/songs");

    const tabStrip = screen.getByRole("link", { name: /all songs/i }).closest("div[class*='border-b']");
    expect(tabStrip?.className).toContain("hidden");
    expect(tabStrip?.className).toContain("sm:flex");

    // The native select is rendered for mobile; its parent should be sm:hidden
    const select = screen.getByLabelText(/songs view/i);
    const wrapper = select.closest("div");
    expect(wrapper?.className).toContain("sm:hidden");
  });

  // The mobile select reflects the current tab as its value, so opening
  // the dropdown shows the user where they are.
  test("mobile select value reflects the current tab path", () => {
    renderAtPath("/songs/all-timers");

    const select = screen.getByLabelText(/songs view/i) as HTMLSelectElement;
    expect(select.value).toBe("/songs/all-timers");
  });

  // Changing the mobile select navigates to the chosen tab path.
  test("changing mobile select navigates to the new tab", () => {
    renderAtPath("/songs");

    const select = screen.getByLabelText(/songs view/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "/songs/all-timers" } });

    // The active tab in the desktop strip should now reflect the new path.
    const allTimersLink = screen.getByRole("link", { name: /all-timers/i });
    expect(allTimersLink.className).toContain("border-brand-primary");
  });

  // Admins get a shortcut to the authors admin from the songs header (AdminOnly
  // is mocked to passthrough here; its gating is covered by its own test).
  test("renders a Manage authors admin link in the header", () => {
    renderAtPath("/songs");

    expect(screen.getByRole("link", { name: /manage authors/i })).toHaveAttribute("href", "/admin/authors");
  });
});
