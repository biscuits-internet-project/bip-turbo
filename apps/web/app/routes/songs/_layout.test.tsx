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
  // The layout should render a tab bar with three navigation tabs
  // linking to /songs, /songs/all-timers, and /songs/histories.
  test("renders three tab links: All Songs, All-Timers, Histories", () => {
    renderAtPath("/songs");

    expect(screen.getByRole("link", { name: /all songs/i })).toHaveAttribute("href", "/songs");
    expect(screen.getByRole("link", { name: /all-timers/i })).toHaveAttribute("href", "/songs/all-timers");
    expect(screen.getByRole("link", { name: /histories/i })).toHaveAttribute("href", "/songs/histories");
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

  // The heading should also appear on non-tabbed pages (slug, new, edit)
  // since the layout wraps all songs routes.
  test("renders SONGS heading on song detail pages", () => {
    renderAtPath("/songs/basis-for-a-day");

    expect(screen.getByText("SONGS")).toBeInTheDocument();
  });

  // The Outlet should always render regardless of path, since child routes
  // need to be rendered.
  test("always renders Outlet for child routes", () => {
    renderAtPath("/songs");

    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });
});
