import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { MusicianTier } from "~/lib/musicians-constants";

// The two shared tables client-fetch and pull in React Query; stub them to
// markers that echo their presetFilters so the page's wiring is assertable
// without the fetch machinery.
vi.mock("~/components/song/filtered-songs-table", () => ({
  FilteredSongsTable: ({ presetFilters }: { presetFilters?: Record<string, string> }) => (
    <div data-testid="songs-table" data-preset={JSON.stringify(presetFilters ?? null)} />
  ),
}));
vi.mock("~/lib/filtered-song-performance-table", () => ({
  FilteredSongPerformanceTable: ({ presetFilters }: { presetFilters?: Record<string, string> }) => (
    <div data-testid="perf-table" data-preset={JSON.stringify(presetFilters ?? null)} />
  ),
}));

vi.mock("~/components/admin/admin-only", () => ({
  AdminOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// The route module's loader drags in server-only helpers at import time; stub
// them so importing the component in jsdom doesn't load the db client or env.
vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/lib/base-loaders", () => ({ publicLoader: <T,>(fn: T) => fn }));
vi.mock("~/lib/song-utilities", () => ({ fetchFilteredSongs: vi.fn() }));
vi.mock("~/lib/query-prefetch", () => ({ createPrefetchClient: vi.fn() }));
vi.mock("~/server/track-user-ratings", () => ({ computeTrackUserRatings: vi.fn() }));
vi.mock("~/server/show-user-data", () => ({ computeShowUserData: vi.fn() }));

const loaderData = vi.fn();
vi.mock("~/hooks/use-serialized-loader-data", () => ({
  useSerializedLoaderData: () => loaderData(),
}));

import MusicianPage from "./$slug";

interface Overrides {
  slug?: string;
  tier?: MusicianTier;
  songs?: unknown[];
  performances?: unknown[];
  shows?: unknown[];
}

function makeData({ slug = "mike-greenfield", tier = "guest", songs, performances, shows }: Overrides) {
  const hasTables = tier !== "core";
  return {
    musician: {
      id: `m-${slug}`,
      name: "Test Musician",
      slug,
      knownFrom: null,
      defaultInstrumentId: null,
      defaultInstrument: null,
      authorId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    tier,
    stats: { showCount: 5, songCount: 3 },
    firstShow: null,
    lastShow: null,
    shows:
      shows ??
      (hasTables
        ? [
            {
              showId: "s1",
              slug: "2024-01-01",
              date: "2024-01-01",
              venueName: "The Cap",
              venueCity: "Port Chester",
              venueState: "NY",
            },
          ]
        : []),
    songs: songs ?? (hasTables ? [{ id: "song-1" }] : []),
    performances: performances ?? (hasTables ? [{ trackId: "t-1" }] : []),
    authorId: null,
    songsWritten: [],
  };
}

describe("MusicianPage body", () => {
  // A guest's everyday appearances are all notable, so both shared tables pin
  // only the musician slug (no era exclusion).
  test("a guest renders the shared By Song table pinned to the musician with no era window", async () => {
    loaderData.mockReturnValue(makeData({ slug: "mike-greenfield", tier: "guest" }));

    await setupWithRouter(<MusicianPage />);

    const songsTable = screen.getByTestId("songs-table");
    expect(JSON.parse(songsTable.getAttribute("data-preset") ?? "{}")).toEqual({ musician: "mike-greenfield" });
    // The "All Song Performances" tab is wired even though Radix only mounts
    // the active tab's content.
    expect(screen.getByRole("tab", { name: /all song performances/i })).toBeInTheDocument();
  });

  // A drummer's tables exclude their era so only out-of-era plays surface; the
  // exclude window must thread through to the table preset.
  test("a drummer pins the era exclude window and labels the shows section accordingly", async () => {
    loaderData.mockReturnValue(makeData({ slug: "allen-aucoin", tier: "drummer" }));

    await setupWithRouter(<MusicianPage />);

    const songsTable = screen.getByTestId("songs-table");
    expect(JSON.parse(songsTable.getAttribute("data-preset") ?? "{}")).toEqual({
      musician: "allen-aucoin",
      excludeStart: "2005-12-28",
      excludeEnd: "2025-09-07",
    });
    // Both sections carry the out-of-era framing for drummers.
    expect(screen.getByRole("heading", { name: "Songs Outside Their Era" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Shows Outside Their Era" })).toBeInTheDocument();
  });

  // Core members appear on essentially every show, so the tables are omitted —
  // only counts and a note render.
  test("a core member omits the song tables", async () => {
    loaderData.mockReturnValue(makeData({ slug: "jon-gutwillig", tier: "core" }));

    await setupWithRouter(<MusicianPage />);

    expect(screen.queryByTestId("songs-table")).not.toBeInTheDocument();
    expect(screen.queryByTestId("perf-table")).not.toBeInTheDocument();
    expect(screen.getByText(/core member/i)).toBeInTheDocument();
  });

  // Shows moved below songs: the Songs section heading precedes the Shows
  // heading in document order.
  test("the Shows section sits below the Songs section", async () => {
    loaderData.mockReturnValue(makeData({ slug: "mike-greenfield", tier: "guest" }));

    await setupWithRouter(<MusicianPage />);

    const songsHeading = screen.getByRole("heading", { name: "Songs" });
    const showsHeading = screen.getByRole("heading", { name: "Shows" });
    expect(songsHeading.compareDocumentPosition(showsHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  // Empty sections aren't rendered: a drummer with no out-of-era plays shows
  // neither the Songs nor the Shows section, just the stats.
  test("omits the Songs and Shows sections when the musician has no in-scope plays", async () => {
    loaderData.mockReturnValue(
      makeData({ slug: "allen-aucoin", tier: "drummer", songs: [], performances: [], shows: [] }),
    );

    await setupWithRouter(<MusicianPage />);

    expect(screen.queryByTestId("songs-table")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Songs" })).not.toBeInTheDocument();
    expect(screen.queryByText("Shows Outside Their Era")).not.toBeInTheDocument();
  });
});
