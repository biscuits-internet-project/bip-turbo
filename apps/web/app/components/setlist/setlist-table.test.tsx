import type { TrackLight } from "@bip/domain";
import { mockShallowComponent, setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

// Stub useSession + useTrackUserRatings so SetlistTable renders synchronously
// without network calls. The auth state + rating map are wired through
// vi.mocked() inside each test that cares; default is anonymous + empty.
vi.mock("~/hooks/use-session", () => ({
  useSession: vi.fn(() => ({ user: null, supabase: null })),
}));
vi.mock("~/hooks/use-track-user-ratings", () => ({
  useTrackUserRatings: vi.fn(() => ({
    userRatingMap: new Map<string, number>(),
    averageRatingMap: new Map<string, { average: number; count: number }>(),
    isLoading: false,
  })),
}));
vi.mock("~/hooks/use-song-play-dates", () => ({
  useSongPlayDates: vi.fn(() => ({ data: {} as Record<string, string[]>, isLoading: false })),
}));
// Stub TrackRatingCell so the rating column emits a deterministic, prop-
// dumping node — the rating cell internals are covered elsewhere.
vi.mock("~/components/performance/track-rating-cell", () => ({
  TrackRatingCell: (props: object) => mockShallowComponent("TrackRatingCell", props),
}));

const { useSession } = await import("~/hooks/use-session");
const { useTrackUserRatings } = await import("~/hooks/use-track-user-ratings");
const { useSongPlayDates } = await import("~/hooks/use-song-play-dates");
const { SetlistTable } = await import("./setlist-table");

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
    gap: overrides.gap ?? null,
    previousPerformanceShowId: overrides.previousPerformanceShowId ?? null,
    duration: overrides.duration ?? null,
    durationSource: overrides.durationSource ?? null,
    previousPerformanceShow: overrides.previousPerformanceShow ?? null,
    flags: overrides.flags ?? [],
    flagRecurrences: overrides.flagRecurrences ?? [],
    segueRecurrences: overrides.segueRecurrences ?? [],
    completes: overrides.completes ?? [],
    completedBy: overrides.completedBy ?? [],
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
        showSlug="2024-07-19-camden"
        showDate="2024-07-19"
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
    const cells = screen.getAllByRole("cell").filter((_, i) => i % 9 === 3);
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
        showSlug="2024-07-19-camden"
        showDate="2024-07-19"
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

  // SetlistTable threads useTrackUserRatings into the column factory so the
  // rightmost Rating column gets BOTH the live community average (from
  // averageRatingMap — track ratings no longer ride in the row/blob) and the
  // viewer's own rating (userRatingMap). useTrackUserRatings is invoked with
  // the row's trackIds; both maps show up in each TrackRatingCell.
  test("passes the live average + user-rating maps and auth state into rating cells", async () => {
    vi.mocked(useSession).mockReturnValue({
      // biome-ignore lint/suspicious/noExplicitAny: minimal mock; test only reads `user`
      user: { id: "user-1" } as any,
      // biome-ignore lint/suspicious/noExplicitAny: minimal mock
      supabase: null as any,
    });
    vi.mocked(useTrackUserRatings).mockReturnValue({
      userRatingMap: new Map([["t-1", 5]]),
      averageRatingMap: new Map([["t-1", { average: 4.4, count: 22 }]]),
      isLoading: false,
    });

    await setupWithRouter(
      <SetlistTable
        showSlug="2024-07-19-camden"
        showDate="2024-07-19"
        tracks={[
          makeTrack({
            songId: "song-basis",
            position: 1,
            song: { id: "song-basis", title: "Basis for a Day", slug: "basis-for-a-day" },
          }),
        ]}
      />,
    );

    expect(useTrackUserRatings).toHaveBeenCalledWith(["t-1"]);
    expect(screen.getByTestId("TrackRatingCell")).toBeInTheDocument();
    const cell = screen.getByTestId("TrackRatingCell").textContent ?? "";
    expect(cell).toContain('"showSlug":"2024-07-19-camden"');
    expect(cell).toContain('"userRating":5');
    expect(cell).toContain('"isAuthenticated":true');
    // The community average + count come from the tier-2 map, not the row.
    expect(cell).toContain('"initialRating":4.4');
    expect(cell).toContain('"ratingsCount":22');
  });

  // Wiring: SetlistTable threads each row's songId into the catalog blob,
  // counts dates strictly before `showDate`, and surfaces that count in the
  // Played Before cell. Stubs return a non-empty blob so the augmentation
  // path actually runs (loading state already covered in setlist-columns
  // tests via the em-dash rendering).
  test("renders the prior-performance count derived from the catalog blob", async () => {
    vi.mocked(useSongPlayDates).mockReturnValue({
      data: {
        // Three plays strictly before 2024-07-19 → cell renders "3".
        "song-tractorbeam": ["2018-12-31", "2020-06-10", "2022-04-14", "2024-07-19", "2025-01-01"],
        // No prior plays → "0" (a personal debut from the catalog's view).
        "song-debut": ["2024-07-19"],
      },
      isLoading: false,
    });

    await setupWithRouter(
      <SetlistTable
        showSlug="2024-07-19-camden"
        showDate="2024-07-19"
        tracks={[
          makeTrack({
            songId: "song-tractorbeam",
            position: 1,
            song: { id: "song-tractorbeam", title: "Tractorbeam", slug: "tractorbeam" },
          }),
          makeTrack({
            songId: "song-debut",
            position: 2,
            song: { id: "song-debut", title: "Munchkin Invasion", slug: "munchkin-invasion" },
          }),
        ]}
      />,
    );

    // Each row has 9 cells; Played Before is index 7. Cells 7 + 16 are the
    // Played Before cells for the two rows respectively.
    const cells = screen.getAllByRole("cell");
    expect(cells[7].textContent).toBe("3");
    expect(cells[16].textContent).toBe("0");
  });
});
