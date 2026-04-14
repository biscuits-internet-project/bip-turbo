import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// Mock server-side modules
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));
vi.mock("@bip/domain/cache-keys", () => ({ CacheKeys: { songs: { histories: vi.fn() } } }));

// Mock the loader data hook to return songs with history content
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: vi.fn(() => ({
    songs: [
      {
        id: "1",
        title: "Basis for a Day",
        slug: "basis-for-a-day",
        history: "Basis for a Day was composed by Marc Brownstein in the early days of the band. It quickly became a fan favorite.",
      },
      {
        id: "2",
        title: "Above the Waves",
        slug: "above-the-waves",
        history: "Above the Waves was first performed in 2003 and has been a staple of the band's second set ever since.",
      },
    ],
  })),
}));

import HistoriesPage from "./histories";

function renderHistories() {
  return render(
    <MemoryRouter initialEntries={["/songs/histories"]}>
      <HistoriesPage />
    </MemoryRouter>,
  );
}

describe("HistoriesPage", () => {
  // Each song with history content should appear as a row in the table
  // with its title linking to the song's history tab.
  test("renders song titles as links to the song history tab", () => {
    renderHistories();

    const basisLink = screen.getByRole("link", { name: "Basis for a Day" });
    expect(basisLink).toHaveAttribute("href", "/songs/basis-for-a-day?tab=history");

    const wavesLink = screen.getByRole("link", { name: "Above the Waves" });
    expect(wavesLink).toHaveAttribute("href", "/songs/above-the-waves?tab=history");
  });

  // Each row should show a preview snippet of the history text so users
  // can browse without clicking through.
  test("renders a preview of each song's history text", () => {
    renderHistories();

    expect(screen.getByText(/Basis for a Day was composed by Marc Brownstein/)).toBeInTheDocument();
    expect(screen.getByText(/Above the Waves was first performed in 2003/)).toBeInTheDocument();
  });

  // The table should support pagination for when more histories are written.
  // With only 2 items and a page size of 50, pagination nav should be hidden.
  test("hides pagination when all items fit on one page", () => {
    renderHistories();

    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });
});
