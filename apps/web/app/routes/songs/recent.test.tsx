import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Mock server-side modules
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));
vi.mock("~/lib/song-utilities", () => ({
  addVenueInfoToSongs: vi.fn(),
  fetchFilteredSongs: vi.fn(),
}));

vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => ({ songs: [] })),
}));

// Stub the shared FilteredSongsStatsTable to inspect props
vi.mock("~/components/song/filtered-songs-stats-table", () => ({
  FilteredSongsStatsTable: (props: object) => mockShallowComponent("FilteredSongsStatsTable", props),
}));

import RecentPage from "./recent";

function renderRecent() {
  return render(
    <MemoryRouter initialEntries={["/songs/recent"]}>
      <RecentPage />
    </MemoryRouter>,
  );
}

describe("RecentPage", () => {
  // The Recent tab renders a FilteredSongsStatsTable with the last10shows time range.
  test("renders FilteredSongsStatsTable with last10shows extraParams and hideTimeRange", () => {
    renderRecent();

    const table = screen.getByTestId("FilteredSongsStatsTable");
    expect(table.textContent).toContain('"hideTimeRange":true');
  });
});
