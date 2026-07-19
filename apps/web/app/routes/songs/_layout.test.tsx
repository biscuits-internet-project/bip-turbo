import { render, screen } from "@testing-library/react";
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
  // The layout renders a TabNav whose route tabs keep real hrefs (so they open
  // in new tabs / prefetch), one per songs view.
  test("renders five tab links: All Songs, All-Timers, Histories, Last 10 Shows, This Year", () => {
    renderAtPath("/songs");

    expect(screen.getByRole("tab", { name: /all songs/i })).toHaveAttribute("href", "/songs");
    expect(screen.getByRole("tab", { name: /all-timers/i })).toHaveAttribute("href", "/songs/all-timers");
    expect(screen.getByRole("tab", { name: /histories/i })).toHaveAttribute("href", "/songs/histories");
    expect(screen.getByRole("tab", { name: /last 10 shows/i })).toHaveAttribute("href", "/songs/recent");
    expect(screen.getByRole("tab", { name: /this year/i })).toHaveAttribute("href", "/songs/this-year");
  });

  // The active tab is marked selected (data-state=active drives the brand
  // underline), determined by the current pathname.
  test("marks 'All Songs' active when on /songs", () => {
    renderAtPath("/songs");

    expect(screen.getByRole("tab", { name: /all songs/i })).toHaveAttribute("data-state", "active");
  });

  // When navigated to /songs/all-timers, the All-Timers tab is active and the
  // others are not.
  test("marks 'All-Timers' active when on /songs/all-timers", () => {
    renderAtPath("/songs/all-timers");

    expect(screen.getByRole("tab", { name: /all-timers/i })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("tab", { name: /all songs/i })).toHaveAttribute("data-state", "inactive");
  });

  // When navigated to /songs/histories, the Histories tab is active.
  test("marks 'Histories' active when on /songs/histories", () => {
    renderAtPath("/songs/histories");

    expect(screen.getByRole("tab", { name: /histories/i })).toHaveAttribute("data-state", "active");
  });

  // The tab bar should NOT render on song detail pages, edit pages, or new song page
  // because those are distinct views, not tabs.
  test("does not render tab bar on /songs/:slug", () => {
    renderAtPath("/songs/basis-for-a-day");

    expect(screen.queryByRole("tab", { name: /all songs/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /all-timers/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /histories/i })).not.toBeInTheDocument();
  });

  // The tab bar should not render on the new song admin page.
  test("does not render tab bar on /songs/new", () => {
    renderAtPath("/songs/new");

    expect(screen.queryByRole("tab", { name: /all songs/i })).not.toBeInTheDocument();
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

  // The single TabNav control carries the accessible name "Songs view"; its
  // bar-vs-dropdown responsiveness is exercised in tab-nav.test.tsx.
  test("renders the songs view tablist", () => {
    renderAtPath("/songs");

    expect(screen.getByRole("tablist", { name: /songs view/i })).toBeInTheDocument();
  });

  // Admins get a shortcut to the authors admin from the songs header (AdminOnly
  // is mocked to passthrough here; its gating is covered by its own test).
  test("renders a Manage authors admin link in the header", () => {
    renderAtPath("/songs");

    expect(screen.getByRole("link", { name: /manage authors/i })).toHaveAttribute("href", "/admin/authors");
  });
});
