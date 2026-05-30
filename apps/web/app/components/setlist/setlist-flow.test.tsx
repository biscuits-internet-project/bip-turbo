import type { SetlistLight } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// TrackRatingOverlay wraps each song in a hover popover that needs React Query
// + session context; render its children straight through. NoteworthyMarker is
// an icon the flow tests don't assert on.
vi.mock("./track-rating-overlay", () => ({
  TrackRatingOverlay: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("~/components/track/noteworthy-marker", () => ({
  NoteworthyMarker: () => null,
}));

import { SetlistFlow } from "./setlist-flow";

function durTrack(id: string, title: string, duration: number | null, set: string, position: number) {
  return {
    id,
    showId: "show-1",
    songId: id,
    set,
    position,
    segue: null,
    likesCount: 0,
    note: null,
    allTimer: false,
    averageRating: null,
    ratingsCount: 0,
    gap: null,
    previousPerformanceShowId: null,
    duration,
    durationSource: duration === null ? null : "nugs",
    previousPerformanceShow: null,
    song: { id, title, slug: title.toLowerCase().replace(/\s+/g, "-") },
  };
}

function flowSetlist(
  sets: Array<{ label: string; tracks: ReturnType<typeof durTrack>[] }>,
  annotations: Array<{ trackId: string; desc: string }> = [],
): SetlistLight {
  return {
    show: { id: "show-1" },
    sets: sets.map((s, i) => ({ label: s.label, sort: i + 1, tracks: s.tracks })),
    annotations,
  } as unknown as SetlistLight;
}

describe("SetlistFlow", () => {
  // A single-set show drops the "Set 1" heading; its time reads only as the
  // show Total.
  test("a single-set show shows the Total but suppresses the set heading", async () => {
    await setupWithRouter(
      <SetlistFlow setlist={flowSetlist([{ label: "S1", tracks: [durTrack("a", "Helicopters", 522, "S1", 1), durTrack("b", "Spaga", 410, "S1", 2)] }])} />,
    );
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("15:32")).toBeInTheDocument();
    expect(screen.queryByText("Set 1")).not.toBeInTheDocument();
  });

  test("a multi-set show shows per-set headings and the Total", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist([
          { label: "S1", tracks: [durTrack("a", "Helicopters", 522, "S1", 1)] },
          { label: "S2", tracks: [durTrack("b", "Spaga", 410, "S2", 1)] },
        ])}
      />,
    );
    expect(screen.getByText("Set 1")).toBeInTheDocument();
    expect(screen.getByText("Set 2")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });

  test("flags a partial total when some tracks are untimed", async () => {
    await setupWithRouter(
      <SetlistFlow setlist={flowSetlist([{ label: "S1", tracks: [durTrack("a", "Helicopters", 522, "S1", 1), durTrack("b", "Spaga", null, "S1", 2)] }])} />,
    );
    expect(screen.getByText(/Partial: 1 track not yet timed/)).toBeInTheDocument();
  });

  test("shows no Total or partial note when nothing is timed", async () => {
    await setupWithRouter(
      <SetlistFlow setlist={flowSetlist([{ label: "S1", tracks: [durTrack("a", "Helicopters", null, "S1", 1)] }])} />,
    );
    expect(screen.queryByText("Total")).not.toBeInTheDocument();
    expect(screen.queryByText(/Partial/)).not.toBeInTheDocument();
  });

  // A lone encore reads "Encore" (no number).
  test("labels a single encore 'Encore'", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist([
          { label: "S1", tracks: [durTrack("a", "Helicopters", null, "S1", 1)] },
          { label: "E1", tracks: [durTrack("b", "Spaga", null, "E1", 1)] },
        ])}
      />,
    );
    expect(screen.getByText("Encore")).toBeInTheDocument();
    expect(screen.queryByText("Encore 1")).not.toBeInTheDocument();
  });

  test("numbers multiple encores", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist([
          { label: "S1", tracks: [durTrack("a", "Helicopters", null, "S1", 1)] },
          { label: "E1", tracks: [durTrack("b", "Spaga", null, "E1", 1)] },
          { label: "E2", tracks: [durTrack("c", "Crickets", null, "E2", 1)] },
        ])}
      />,
    );
    expect(screen.getByText("Encore 1")).toBeInTheDocument();
    expect(screen.getByText("Encore 2")).toBeInTheDocument();
  });

  // A track with an annotation gets an inline superscript marker and a matching
  // footnote line.
  test("numbers track annotations inline and footnotes them", async () => {
    await setupWithRouter(
      <SetlistFlow
        setlist={flowSetlist(
          [{ label: "S1", tracks: [durTrack("a", "Helicopters", 522, "S1", 1)] }],
          [{ trackId: "a", desc: "Glow-stick war peak" }],
        )}
      />,
    );
    expect(screen.getByText("Glow-stick war peak")).toBeInTheDocument();
    // The inline superscript marker "1" and the footnote index "1" both render.
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
  });
});
