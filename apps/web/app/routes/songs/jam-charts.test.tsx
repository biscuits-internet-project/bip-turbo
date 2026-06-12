import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

const tableProps = vi.fn();
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("@bip/domain", () => ({
  CacheKeys: { songs: { jamCharts: () => "test-key" } },
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

import JamChartsPage from "./jam-charts";

describe("JamChartsPage", () => {
  // The page delegates to the shared FilteredSongPerformanceTable, scoping to
  // jam-charts via the preset (the component derives that only the Jam Chart
  // chip hides; the All-Timer chip stays visible so users can narrow further).
  test("renders FilteredSongPerformanceTable scoped to jam-charts", () => {
    render(
      <MemoryRouter initialEntries={["/songs/jam-charts"]}>
        <JamChartsPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("FilteredSongPerformanceTable")).toBeInTheDocument();
    expect(tableProps).toHaveBeenCalledWith(expect.objectContaining({ presetFilters: { filters: "jamChart" } }));
  });
});
