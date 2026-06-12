import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

const tableProps = vi.fn();
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("@bip/domain", () => ({
  // Loader imports CacheKeys.songs.allTimers() at module top level.
  CacheKeys: { songs: { allTimers: () => "test-key" } },
}));
vi.mock("~/lib/noteworthy-performance-loader", () => ({
  createNoteworthyLoader: vi.fn(),
}));
vi.mock("~/lib/filtered-song-performance-table", () => ({
  FilteredSongPerformanceTable: (props: object) => {
    tableProps(props);
    return <div data-testid="FilteredSongPerformanceTable" />;
  },
}));
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => ({ performances: [] })),
}));

import AllTimersPage from "./all-timers";

function renderAllTimers() {
  return render(
    <MemoryRouter initialEntries={["/songs/all-timers"]}>
      <AllTimersPage />
    </MemoryRouter>,
  );
}

describe("AllTimersPage", () => {
  // The layout tab bar handles the All-Timers heading,
  // so the page should not render its own.
  test("does not render its own All-Timers heading", () => {
    renderAllTimers();

    expect(screen.queryByRole("heading", { name: /all-timers/i })).not.toBeInTheDocument();
  });

  // Navigation between song pages is handled by the layout tab bar.
  test("does not render a Back to songs link", () => {
    renderAllTimers();

    expect(screen.queryByRole("link", { name: /back to songs/i })).not.toBeInTheDocument();
  });

  // Delegates to the shared FilteredSongPerformanceTable, scoping to all-timers
  // via the preset (the component derives which chips to hide).
  test("renders FilteredSongPerformanceTable scoped to all-timers", () => {
    renderAllTimers();

    expect(screen.getByTestId("FilteredSongPerformanceTable")).toBeInTheDocument();
    expect(tableProps).toHaveBeenCalledWith(expect.objectContaining({ presetFilters: { filters: "allTimer" } }));
  });
});
