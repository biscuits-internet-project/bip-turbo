import { mockShallowComponent } from "@test/test-utils";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Mock server-side modules that can't run in jsdom
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));
vi.mock("~/lib/seo", () => ({ getSongsMeta: vi.fn() }));
vi.mock("~/lib/song-utilities", () => ({
  addVenueInfoToSongs: vi.fn(),
  fetchFilteredSongs: vi.fn(),
}));

vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => ({ songs: [] })),
}));

// Stub the shared FilteredSongsTable component
vi.mock("~/components/song/filtered-songs-table", () => ({
  FilteredSongsTable: (props: object) => mockShallowComponent("FilteredSongsTable", props),
}));

import Songs from "./_index";

function renderSongsIndex() {
  return render(
    <MemoryRouter initialEntries={["/songs"]}>
      <Songs />
    </MemoryRouter>,
  );
}

describe("Songs index page", () => {
  // The layout renders the heading, so the index page should not render its own.
  test("does not render its own SONGS heading", () => {
    renderSongsIndex();

    expect(screen.queryByText("SONGS")).not.toBeInTheDocument();
  });

  // The layout tab bar handles navigation to all-timers.
  test("does not render an all-timers link", () => {
    renderSongsIndex();

    expect(screen.queryByRole("link", { name: /all-timers/i })).not.toBeInTheDocument();
  });

  // The layout renders the admin "New Song" button.
  test("does not render a New Song button", () => {
    renderSongsIndex();

    expect(screen.queryByRole("link", { name: /new song/i })).not.toBeInTheDocument();
  });

  // The FilteredSongsTable renders the songs table with filter controls.
  test("renders the FilteredSongsTable", () => {
    renderSongsIndex();

    expect(screen.getByTestId("FilteredSongsTable")).toBeInTheDocument();
  });

  // Trending data is accessible via the "Last 10 Shows" and "This Year" tabs,
  // so the index page does not render its own trending sections.
  test("does not render Trending in Recent Shows section", () => {
    renderSongsIndex();

    expect(screen.queryByText("Trending in Recent Shows")).not.toBeInTheDocument();
  });

  // Popular This Year data is accessible via the "This Year" tab.
  test("does not render Popular This Year section", () => {
    renderSongsIndex();

    expect(screen.queryByText("Popular This Year")).not.toBeInTheDocument();
  });
});
