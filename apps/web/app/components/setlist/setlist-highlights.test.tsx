import type { Setlist, Track } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SetlistHighlights } from "./setlist-highlights";

// Setlist-wide fixture defaults are stubbed where the component never
// reads them — these tests focus on the tracks/sets the highlights panel
// actually iterates over.
function makeSetlist(sets: Array<{ label: string; tracks: Partial<Track>[] }>): Setlist {
  return {
    show: { id: "show-1", slug: "1995-10-21" } as Setlist["show"],
    venue: { id: "venue-1", name: "The Wetlands" } as Setlist["venue"],
    annotations: [],
    averageSongGap: null,
    medianSongGap: null,
    debutCount: 0,
    rockOperaPerformances: [],
    sets: sets.map((set, sortIdx) => ({
      label: set.label,
      sort: sortIdx,
      tracks: set.tracks.map((t, i) => makeTrack({ set: set.label, position: i + 1, ...t })),
    })),
  };
}

function makeTrack(overrides: Partial<Track>): Track {
  const song =
    (overrides.song as Track["song"]) ??
    ({
      id: "song-default",
      title: "Sound One",
      slug: "sound-one",
    } as unknown as Track["song"]);
  return {
    id: overrides.id ?? `track-${overrides.position ?? 0}-${song?.slug ?? "x"}`,
    showId: "show-1",
    songId: song?.id ?? "song-default",
    set: overrides.set ?? "S1",
    position: overrides.position ?? 1,
    segue: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    likesCount: 0,
    slug: null,
    note: overrides.note ?? null,
    allTimer: overrides.allTimer ?? false,
    previousTrackId: null,
    nextTrackId: null,
    averageRating: 0,
    ratingsCount: 0,
    gap: null,
    previousPerformanceShowId: null,
    previousPerformanceShow: null,
    song,
    annotations: [],
  } as unknown as Track;
}

describe("SetlistHighlights (compressed)", () => {
  // When no track is an all-timer or has a note, there is nothing to
  // highlight — the whole section is omitted so the right rail doesn't
  // show an empty placeholder.
  test("renders nothing when no tracks have allTimer or notes", async () => {
    const setlist = makeSetlist([
      {
        label: "S1",
        tracks: [{ song: { id: "a", title: "Above the Waves", slug: "above-the-waves" } as Track["song"] }],
      },
    ]);
    const { container } = await setupWithRouter(<SetlistHighlights setlist={setlist} />);
    expect(container.firstChild).toBeNull();
  });

  // The compressed section is one list — not two subsections. Verifies
  // we don't render separate "All-Timers" / "Track Notes" / "Jam Charts"
  // sub-headers on the show page.
  test("does not render separate All-Timers / Track Notes / Jam Charts subsection headers", async () => {
    const setlist = makeSetlist([
      {
        label: "S1",
        tracks: [
          { allTimer: true, song: { id: "a", title: "Aceetobee", slug: "aceetobee" } as Track["song"] },
          {
            note: "Type II exploration.",
            song: { id: "b", title: "Basis for a Day", slug: "basis-for-a-day" } as Track["song"],
          },
        ],
      },
    ]);
    await setupWithRouter(<SetlistHighlights setlist={setlist} />);
    expect(screen.queryByText("All-Timers")).not.toBeInTheDocument();
    expect(screen.queryByText("Track Notes")).not.toBeInTheDocument();
    expect(screen.queryByText("Jam Charts")).not.toBeInTheDocument();
    // The single section heading does remain.
    expect(screen.getByText("Show Highlights")).toBeInTheDocument();
  });

  // Both all-timers (no note) and noted-but-not-all-timer tracks land in
  // the compressed list, with the song title as a link to /songs/{slug}.
  test("lists both all-timer and noted tracks with song-page links", async () => {
    const setlist = makeSetlist([
      {
        label: "S1",
        tracks: [
          { allTimer: true, song: { id: "a", title: "Aceetobee", slug: "aceetobee" } as Track["song"] },
          {
            note: "Glow-stick frenzy.",
            song: { id: "b", title: "Basis for a Day", slug: "basis-for-a-day" } as Track["song"],
          },
        ],
      },
    ]);
    await setupWithRouter(<SetlistHighlights setlist={setlist} />);
    expect(screen.getByRole("link", { name: "Aceetobee" })).toHaveAttribute("href", "/songs/aceetobee");
    expect(screen.getByRole("link", { name: "Basis for a Day" })).toHaveAttribute("href", "/songs/basis-for-a-day");
  });

  // The note text renders inline below the song name so users can read
  // the curated commentary without a popover hop — the compressed section
  // is the canonical place to scan notes.
  test("renders note text below the song name", async () => {
    const setlist = makeSetlist([
      {
        label: "S1",
        tracks: [
          {
            note: "Type II Spaga, near 20 minutes.",
            song: { id: "s", title: "Spaga", slug: "spaga" } as Track["song"],
          },
        ],
      },
    ]);
    await setupWithRouter(<SetlistHighlights setlist={setlist} />);
    expect(screen.getByText(/Type II Spaga, near 20 minutes/)).toBeInTheDocument();
  });

  // Set labels in the highlights panel match the rest of the app's
  // formatting via `formatSetLabel` — "S1" → "1", and the encore drops
  // its number when the show has exactly one encore.
  test("formats set labels via formatSetLabel: S1 -> 1, single E1 -> E", async () => {
    const setlist = makeSetlist([
      {
        label: "S1",
        tracks: [{ allTimer: true, song: { id: "a", title: "Aceetobee", slug: "aceetobee" } as Track["song"] }],
      },
      {
        label: "E1",
        tracks: [{ allTimer: true, song: { id: "c", title: "Crickets", slug: "crickets" } as Track["song"] }],
      },
    ]);
    await setupWithRouter(<SetlistHighlights setlist={setlist} />);
    // "S1" never appears — only "1".
    expect(screen.queryByText("S1")).not.toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    // Single encore collapses to "E", not "E1".
    expect(screen.queryByText("E1")).not.toBeInTheDocument();
    expect(screen.getByText("E")).toBeInTheDocument();
  });

  // With more than one encore in the show, the encore numerals stay so
  // users can distinguish E1 from E2.
  test("keeps the encore numeral when the show has multiple encores", async () => {
    const setlist = makeSetlist([
      {
        label: "E1",
        tracks: [{ allTimer: true, song: { id: "x", title: "Aceetobee", slug: "aceetobee" } as Track["song"] }],
      },
      {
        label: "E2",
        tracks: [{ allTimer: true, song: { id: "y", title: "Crickets", slug: "crickets" } as Track["song"] }],
      },
    ]);
    await setupWithRouter(<SetlistHighlights setlist={setlist} />);
    expect(screen.getByText("E1")).toBeInTheDocument();
    expect(screen.getByText("E2")).toBeInTheDocument();
  });

  // The flame icon sits to the LEFT of the song title — same reading
  // order as the rest of the app, and visually anchors each row.
  test("renders the flame icon to the left of the song title", async () => {
    const setlist = makeSetlist([
      {
        label: "S1",
        tracks: [{ allTimer: true, song: { id: "a", title: "Aceetobee", slug: "aceetobee" } as Track["song"] }],
      },
    ]);
    await setupWithRouter(<SetlistHighlights setlist={setlist} />);
    const row = screen.getByRole("link", { name: "Aceetobee" }).closest("li") as HTMLElement;
    const flame = within(row).getByLabelText("All-timer");
    const link = within(row).getByRole("link", { name: "Aceetobee" });
    expect(flame.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  // The set label prints once per set-bucket transition; consecutive rows
  // in the same set leave the slot blank so the reader's eye groups the
  // rows under the single label. Matches how setlists are spoken aloud.
  test("displays the set label only on the first row of each set group", async () => {
    const setlist = makeSetlist([
      {
        label: "S1",
        tracks: [
          { allTimer: true, song: { id: "a", title: "Aceetobee", slug: "aceetobee" } as Track["song"] },
          { allTimer: true, song: { id: "b", title: "Basis for a Day", slug: "basis-for-a-day" } as Track["song"] },
          { note: "Slow ramp.", song: { id: "c", title: "Crickets", slug: "crickets" } as Track["song"] },
        ],
      },
      {
        label: "S2",
        tracks: [{ allTimer: true, song: { id: "d", title: "Dribble", slug: "dribble" } as Track["song"] }],
      },
    ]);
    await setupWithRouter(<SetlistHighlights setlist={setlist} />);
    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(4);
    // First row in S1 shows the label
    expect(within(rows[0]).queryByText("1")).toBeInTheDocument();
    // Subsequent S1 rows do not repeat the label
    expect(within(rows[1]).queryByText("1")).not.toBeInTheDocument();
    expect(within(rows[2]).queryByText("1")).not.toBeInTheDocument();
    // First S2 row prints "2" since it's a new set
    expect(within(rows[3]).queryByText("2")).toBeInTheDocument();
  });

  // Each row carries the corresponding flame icon. All-timer rows get the
  // orange flame; jam-chart rows (note only) get the off-white flame so
  // the two categories are visually distinct in the same list.
  test("orange flame on all-timer rows, off-white flame on jam-chart rows", async () => {
    const setlist = makeSetlist([
      {
        label: "S1",
        tracks: [
          { allTimer: true, song: { id: "a", title: "Aceetobee", slug: "aceetobee" } as Track["song"] },
          { note: "Slow burn.", song: { id: "b", title: "Basis for a Day", slug: "basis-for-a-day" } as Track["song"] },
        ],
      },
    ]);
    await setupWithRouter(<SetlistHighlights setlist={setlist} />);
    const aceeRow = screen.getByRole("link", { name: "Aceetobee" }).closest("li");
    const basisRow = screen.getByRole("link", { name: "Basis for a Day" }).closest("li");
    expect(aceeRow).not.toBeNull();
    expect(basisRow).not.toBeNull();
    const aceeFlame = within(aceeRow as HTMLElement).getByLabelText("All-timer");
    const basisFlame = within(basisRow as HTMLElement).getByLabelText("Jam chart");
    expect(aceeFlame.getAttribute("class") ?? "").toMatch(/text-orange-500/);
    expect(basisFlame.getAttribute("class") ?? "").toMatch(/text-content-text-primary/);
  });

  // Tracks render in canonical show order (set bucket → position within
  // set), not insertion order. Verifies the row sequence matches what a
  // user expects when reading the show top to bottom.
  test("orders rows by set then position", async () => {
    const setlist = makeSetlist([
      {
        label: "S2",
        tracks: [
          { allTimer: true, position: 2, song: { id: "c", title: "Crickets", slug: "crickets" } as Track["song"] },
        ],
      },
      {
        label: "S1",
        tracks: [
          { allTimer: true, position: 3, song: { id: "a", title: "Aceetobee", slug: "aceetobee" } as Track["song"] },
          {
            allTimer: true,
            position: 1,
            song: { id: "b", title: "Basis for a Day", slug: "basis-for-a-day" } as Track["song"],
          },
        ],
      },
      {
        label: "E1",
        tracks: [
          {
            allTimer: true,
            position: 1,
            song: { id: "d", title: "Story of the World", slug: "story-of-the-world" } as Track["song"],
          },
        ],
      },
    ]);
    await setupWithRouter(<SetlistHighlights setlist={setlist} />);
    const links = screen.getAllByRole("link").map((el) => el.textContent);
    expect(links).toEqual(["Basis for a Day", "Aceetobee", "Crickets", "Story of the World"]);
  });
});
