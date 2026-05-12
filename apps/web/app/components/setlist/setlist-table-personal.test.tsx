import type { TrackLight } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// Stub the React Query hook with a fixed payload so the table renders
// synchronously with known per-song attendance data. This is the same
// shape the server endpoint returns.
vi.mock("~/hooks/use-personal-song-history", () => ({
  usePersonalSongHistory: () => ({
    data: {
      attendedShows: [
        { date: "2018-04-15", slug: "2018-04-15-radio-city" },
        { date: "2020-06-10", slug: "2020-06-10-port-chester" },
        { date: "2024-07-19", slug: "2024-07-19-camden" },
      ],
      songAttendances: {
        // Tractorbeam: seen twice, last on 2020-06-10 before this show
        "song-tractorbeam": [
          { date: "2018-04-15", slug: "2018-04-15-radio-city" },
          { date: "2020-06-10", slug: "2020-06-10-port-chester" },
        ],
        // Mr. Don: never seen → renders Debut ★
      },
    },
    isLoading: false,
  }),
}));

const { SetlistTablePersonal } = await import("./setlist-table-personal");

function makeTrack(overrides: Partial<TrackLight> & { id: string; songId: string; position: number }): TrackLight {
  return {
    id: overrides.id,
    showId: "show-current",
    songId: overrides.songId,
    set: overrides.set ?? "S1",
    position: overrides.position,
    segue: null,
    likesCount: 0,
    note: null,
    allTimer: false,
    averageRating: null,
    ratingsCount: 0,
    gap: null,
    previousPerformanceShowId: null,
    previousPerformanceShow: null,
    song: overrides.song ?? { id: overrides.songId, title: "Tractorbeam", slug: "tractorbeam" },
  };
}

describe("SetlistTablePersonal", () => {
  // Personal columns render the correct icon per row state: a song the
  // user has seen before renders a numeric gap; a song they've never seen
  // renders ★ "Your debut"; a repeat earlier in the same show renders ↺.
  test("renders ★ for personal debut, ↺ for within-show repeat, numeric gap otherwise", async () => {
    await setupWithRouter(
      <SetlistTablePersonal
        showDate="2024-07-19"
        tracks={[
          makeTrack({
            id: "t1",
            songId: "song-tractorbeam",
            position: 1,
            song: { id: "song-tractorbeam", title: "Tractorbeam", slug: "tractorbeam" },
          }),
          makeTrack({
            id: "t2",
            songId: "song-mrdon",
            position: 2,
            song: { id: "song-mrdon", title: "Mr. Don", slug: "mr-don" },
          }),
          // Tractorbeam played a second time later in the same show — ↺
          makeTrack({
            id: "t3",
            songId: "song-tractorbeam",
            position: 6,
            set: "S2",
            song: { id: "song-tractorbeam", title: "Tractorbeam", slug: "tractorbeam" },
          }),
        ]}
      />,
    );

    // Debut row shows the "Your debut" icon
    expect(screen.getByLabelText("Your debut")).toBeInTheDocument();
    // Within-show repeat row shows the "Earlier this show" icon
    expect(screen.getByLabelText("Earlier this show")).toBeInTheDocument();
    // Numeric gap renders the bare value (no "show/shows" suffix) so the
    // column matches the gap-chart visual treatment. Two "0" cells expected:
    // Tractorbeam's Your Gap (lastBefore == 2020-06-10, no attended dates
    // strictly between) and Mr. Don's Total Times Seen.
    expect(screen.getAllByRole("cell", { name: "0" })).toHaveLength(2);
  });

  // Calls back to the parent with the computed average + median so the
  // parent can render the summary on the same row as the toggle. The
  // tracks used here all resolve to numeric gaps (no debuts/repeats).
  test("invokes onSummaryChange with computed average + median", async () => {
    const onSummaryChange = vi.fn();
    await setupWithRouter(
      <SetlistTablePersonal
        showDate="2024-07-19"
        tracks={[
          makeTrack({
            id: "t1",
            songId: "song-tractorbeam",
            position: 1,
            song: { id: "song-tractorbeam", title: "Tractorbeam", slug: "tractorbeam" },
          }),
        ]}
        onSummaryChange={onSummaryChange}
      />,
    );
    expect(onSummaryChange).toHaveBeenCalledWith({ average: 0, median: 0, debutCount: 0 });
  });
});
