import type { TrackLight } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SetlistTable } from "./setlist-table";

function makeTrack(overrides: Partial<TrackLight> & { songId: string; position: number }): TrackLight {
  return {
    id: `t-${overrides.position}`,
    showId: "show-1",
    songId: overrides.songId,
    set: overrides.set ?? "S1",
    position: overrides.position,
    segue: null,
    likesCount: 0,
    note: null,
    allTimer: false,
    averageRating: null,
    ratingsCount: 0,
    gap: overrides.gap ?? null,
    previousPerformanceShowId: overrides.previousPerformanceShowId ?? null,
    previousPerformanceShow: overrides.previousPerformanceShow ?? null,
    song: overrides.song ?? { id: overrides.songId, title: "Basis for a Day", slug: "basis-for-a-day" },
  };
}

describe("SetlistTable", () => {
  // Default sort = set order then position. The composer already returns
  // rows in this order; SetlistTable applies the matching initial sort so
  // that rendering through DataTable (which would otherwise leave rows in
  // input order) preserves the canonical narrative even after the user has
  // toggled into a different sort and back via the column headers.
  test("default sort puts S1 before S2 before E1, with tracks in position order", async () => {
    await setupWithRouter(
      <SetlistTable
        tracks={[
          makeTrack({
            songId: "c",
            position: 30,
            set: "E1",
            song: { id: "c", title: "Crickets", slug: "c" },
          }),
          makeTrack({
            songId: "b",
            position: 12,
            set: "S2",
            song: { id: "b", title: "Tempest", slug: "t" },
          }),
          makeTrack({
            songId: "a",
            position: 1,
            set: "S1",
            song: { id: "a", title: "Basis for a Day", slug: "x" },
          }),
          makeTrack({
            songId: "a2",
            position: 2,
            set: "S1",
            song: { id: "a2", title: "Above the Waves", slug: "y" },
          }),
        ]}
      />,
    );
    const cells = screen.getAllByRole("cell").filter((_, i) => i % 5 === 2);
    expect(cells.map((c) => c.textContent?.replace(">", "").trim())).toEqual([
      "Basis for a Day",
      "Above the Waves",
      "Tempest",
      "Crickets",
    ]);
  });

  // Sanity: each track row appears in the rendered table body so callers
  // know SetlistTable is handing the data through to DataTable + columns.
  test("renders a row per track", async () => {
    await setupWithRouter(
      <SetlistTable
        tracks={[
          makeTrack({
            songId: "a",
            position: 1,
            gap: 5,
            song: { id: "a", title: "Above the Waves", slug: "above-the-waves" },
          }),
          makeTrack({
            songId: "b",
            position: 2,
            gap: 10,
            song: { id: "b", title: "Confrontation", slug: "confrontation" },
          }),
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Above the Waves" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Confrontation" })).toBeInTheDocument();
  });
});
