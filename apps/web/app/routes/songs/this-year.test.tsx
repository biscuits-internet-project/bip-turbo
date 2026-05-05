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

// Stub the shared FilteredSongsTable to inspect props
vi.mock("~/components/song/filtered-songs-table", () => ({
  FilteredSongsTable: (props: object) => mockShallowComponent("FilteredSongsTable", props),
}));

import ThisYearPage from "./this-year";

function renderThisYear() {
  return render(
    <MemoryRouter initialEntries={["/songs/this-year"]}>
      <ThisYearPage />
    </MemoryRouter>,
  );
}

describe("ThisYearPage", () => {
  // The This Year tab renders a FilteredSongsTable with the thisYear time range.
  test("renders FilteredSongsTable with thisYear extraParams and hideTimeRange", () => {
    renderThisYear();

    const table = screen.getByTestId("FilteredSongsTable");
    expect(table.textContent).toContain('"hideTimeRange":true');
  });
});
