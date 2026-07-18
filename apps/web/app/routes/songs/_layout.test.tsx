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

  // The active tab is marked aria-current="page" (which the brand-primary
  // underline styling follows), determined by the current pathname.
  test("marks 'All Songs' current when on /songs", () => {
    renderAtPath("/songs");

    expect(screen.getByRole("link", { name: /all songs/i })).toHaveAttribute("aria-current", "page");
  });

  // When navigated to /songs/all-timers, the All-Timers tab is current and the
  // others are not.
  test("marks 'All-Timers' current when on /songs/all-timers", () => {
    renderAtPath("/songs/all-timers");

    expect(screen.getByRole("link", { name: /all-timers/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /all songs/i })).not.toHaveAttribute("aria-current");
  });

  // When navigated to /songs/histories, the Histories tab is current.
  test("marks 'Histories' current when on /songs/histories", () => {
    renderAtPath("/songs/histories");

    expect(screen.getByRole("link", { name: /histories/i })).toHaveAttribute("aria-current", "page");
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

  // Two switchers render together: the desktop tab strip and a native <select>
  // for mobile. Which one is visible at which width is CSS (a browser concern);
  // jsdom only sees that both controls exist.
  test("renders both the desktop tab strip and the mobile select", () => {
    renderAtPath("/songs");

    expect(screen.getByRole("link", { name: /all songs/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/songs view/i)).toBeInTheDocument();
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
    expect(screen.getByRole("link", { name: /all-timers/i })).toHaveAttribute("aria-current", "page");
  });

  // Admins get a shortcut to the authors admin from the songs header (AdminOnly
  // is mocked to passthrough here; its gating is covered by its own test).
  test("renders a Manage authors admin link in the header", () => {
    renderAtPath("/songs");

    expect(screen.getByRole("link", { name: /manage authors/i })).toHaveAttribute("href", "/admin/authors");
  });
});
