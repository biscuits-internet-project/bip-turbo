import type { TrackLight } from "@bip/domain";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { expectAllMockedShallowComponent, mockShallowComponent, setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

// Stub TrackRatingCell so the rating column's cell renders a deterministic
// node with the props the factory passed in — keeps these tests focused on
// the column wiring, not on the RatingBadgeButton internals (covered in
// rating-badge-button.test.tsx).
vi.mock("~/components/performance/track-rating-cell", () => ({
  TrackRatingCell: (props: object) => mockShallowComponent("TrackRatingCell", props),
}));

const { createSetlistColumns } = await import("./setlist-columns");
type SetlistTableRow = TrackLight & { priorPerformanceCount: number | null };

function makeTrack(
  overrides: Partial<TrackLight> & { songId: string; position: number; priorPerformanceCount?: number | null },
): SetlistTableRow {
  return {
    id: `t-${overrides.position}`,
    showId: "show-1",
    songId: overrides.songId,
    set: overrides.set ?? "S1",
    position: overrides.position,
    segue: overrides.segue ?? null,
    likesCount: 0,
    note: null,
    allTimer: false,
    averageRating: overrides.averageRating ?? null,
    ratingsCount: overrides.ratingsCount ?? 0,
    gap: overrides.gap ?? null,
    previousPerformanceShowId: overrides.previousPerformanceShowId ?? null,
    duration: overrides.duration ?? null,
    durationSource: overrides.durationSource ?? null,
    previousPerformanceShow: overrides.previousPerformanceShow ?? null,
    song: overrides.song ?? { id: overrides.songId, title: "Basis for a Day", slug: "basis-for-a-day" },
    priorPerformanceCount: overrides.priorPerformanceCount ?? 0,
  };
}

// Renders the column definitions through a real table so we exercise the cell
// callbacks against TanStack's row model — same render pattern the production
// SetlistTable will use. Factory args default to empty/anonymous so tests
// that don't care about rating wiring stay terse.
async function renderTable(rows: SetlistTableRow[], factoryArgs?: Parameters<typeof createSetlistColumns>[0]) {
  function Harness() {
    const table = useReactTable({
      data: rows,
      columns: createSetlistColumns(factoryArgs),
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    });
    return (
      <table>
        <thead>
          <tr>
            {table.getHeaderGroups()[0].headers.map((h) => (
              <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.getRowModel().rows.map((r) => (
            <tr key={r.id}>
              {r.getVisibleCells().map((c) => (
                <td key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return setupWithRouter(<Harness />);
}

describe("createSetlistColumns", () => {
  // Column order: Set, Track #, Song, Gap, Last Played, Played Before,
  // Rating. Track sits between Set and Song; Gap sits next to Song so the
  // rarity number reads as "Song / Gap" before the user's eye jumps to the
  // older Last Played date and prior-play count. Rating anchors the right
  // edge — it's the action column (click to rate) so it lives where the
  // eye lands at the end of the row scan.
  test("returns columns in order [Set, Track, All-timer, Song, Time, Gap, Last Played, Played Before, Rating]", () => {
    const columns = createSetlistColumns();
    expect(columns.map((c) => c.id)).toEqual([
      "set",
      "track",
      "allTimer",
      "song",
      "duration",
      "gap",
      "lastPlayed",
      "priorPerformanceCount",
      "rating",
    ]);
  });

  // Every column is sortable except Track #, which shares Set's set+position
  // order and so carries no sort affordance of its own.
  test("Set, Song, Gap, Last Played, Played Before, and Rating are sortable; Track is not", () => {
    const columns = createSetlistColumns();
    const sortable = new Map(columns.map((c) => [c.id, c.enableSorting]));
    expect(sortable.get("set")).toBe(true);
    expect(sortable.get("track")).toBe(false);
    expect(sortable.get("song")).toBe(true);
    expect(sortable.get("gap")).toBe(true);
    expect(sortable.get("lastPlayed")).toBe(true);
    expect(sortable.get("priorPerformanceCount")).toBe(true);
    expect(sortable.get("rating")).toBe(true);
  });

  // When sorted by Set (the default), only the first row of each set group
  // shows the set label — subsequent rows in the same set leave the cell
  // blank to make the grouping visually obvious. Other sorts (Gap, Last
  // Played) interleave sets, so every row keeps its label.
  test("hides repeated set labels when sorted by Set", async () => {
    await renderTable([
      makeTrack({ songId: "a", position: 1, set: "S1", song: { id: "a", title: "Basis for a Day", slug: "x" } }),
      makeTrack({ songId: "b", position: 2, set: "S1", song: { id: "b", title: "Above the Waves", slug: "y" } }),
      makeTrack({ songId: "c", position: 3, set: "S2", song: { id: "c", title: "Confrontation", slug: "z" } }),
      makeTrack({ songId: "d", position: 4, set: "S2", song: { id: "d", title: "Crickets", slug: "w" } }),
    ]);
    // Default sort is on the harness's input order; explicitly clicking
    // the Set header puts the table into "sorted by set" mode.
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^Set$/i }));
    const setCells = screen.getAllByRole("cell").filter((_, i) => i % 9 === 0);
    expect(setCells.map((c) => c.textContent)).toEqual(["1", "", "2", ""]);
  });

  // Other sorts mix set values together (an asc-by-gap may go S2, S1, E1, S1),
  // so blanking would lose the per-row context. Every row labels its set
  // when the active sort isn't the Set column.
  test("shows the set label on every row when sorted by Gap", async () => {
    const user = userEvent.setup();
    await renderTable([
      makeTrack({
        songId: "a",
        position: 1,
        set: "S1",
        gap: 10,
        song: { id: "a", title: "Basis for a Day", slug: "x" },
      }),
      makeTrack({
        songId: "b",
        position: 2,
        set: "S1",
        gap: 5,
        song: { id: "b", title: "Above the Waves", slug: "y" },
      }),
      makeTrack({ songId: "c", position: 3, set: "S2", gap: 20, song: { id: "c", title: "Confrontation", slug: "z" } }),
    ]);
    await user.click(screen.getByRole("button", { name: /Gap/i }));
    const setCells = screen.getAllByRole("cell").filter((_, i) => i % 9 === 0);
    // After asc-by-gap: gap=5 (S1), gap=10 (S1), gap=20 (S2). Every row
    // displays its set label.
    expect(setCells.map((c) => c.textContent)).toEqual(["1", "1", "2"]);
  });

  // Sort by Last Played (asc) reorders rows by the previous performance
  // date. Lexicographic compare on YYYY-MM-DD keeps it correct without a
  // Date parse. Debuts (no previous show) sort to one end consistently.
  test("sorting by Last Played reorders by previous-show date", async () => {
    const user = userEvent.setup();
    await renderTable([
      makeTrack({
        songId: "c",
        position: 1,
        set: "S1",
        previousPerformanceShow: { date: "2024-08-01", slug: "newer" },
        song: { id: "c", title: "Crickets", slug: "c" },
      }),
      makeTrack({
        songId: "a",
        position: 2,
        set: "S1",
        previousPerformanceShow: { date: "2024-01-15", slug: "older" },
        song: { id: "a", title: "Basis for a Day", slug: "x" },
      }),
      makeTrack({
        songId: "b",
        position: 3,
        set: "S1",
        previousPerformanceShow: { date: "2024-05-10", slug: "middle" },
        song: { id: "b", title: "Above the Waves", slug: "y" },
      }),
    ]);
    // Label is split into stacked spans; accessible name is "LastPlayed".
    await user.click(screen.getByRole("button", { name: /LastPlayed/i }));
    const songCells = screen.getAllByRole("cell").filter((_, i) => i % 9 === 3);
    expect(songCells.map((c) => c.textContent?.replace(">", "").trim())).toEqual([
      "Basis for a Day",
      "Above the Waves",
      "Crickets",
    ]);
  });

  // Sort by Gap (asc) puts the smallest non-null gap first; debuts (null)
  // sort consistently at one end so the user can also use desc to find
  // them. Numeric compare, not string.
  test("sorting by Gap reorders by gap value ascending", async () => {
    const user = userEvent.setup();
    await renderTable([
      makeTrack({ songId: "c", position: 1, set: "S1", gap: 50, song: { id: "c", title: "Crickets", slug: "c" } }),
      makeTrack({
        songId: "a",
        position: 2,
        set: "S1",
        gap: 5,
        song: { id: "a", title: "Basis for a Day", slug: "x" },
      }),
      makeTrack({
        songId: "b",
        position: 3,
        set: "S1",
        gap: 12,
        song: { id: "b", title: "Above the Waves", slug: "y" },
      }),
    ]);
    await user.click(screen.getByRole("button", { name: /Gap/i }));
    const songCells = screen.getAllByRole("cell").filter((_, i) => i % 9 === 3);
    expect(songCells.map((c) => c.textContent?.replace(">", "").trim())).toEqual([
      "Basis for a Day",
      "Above the Waves",
      "Crickets",
    ]);
  });

  // Sort by Rating (desc, the default click order) puts the highest community
  // average first. When two tracks share the same rating, the one with more
  // votes wins the tiebreak — more votes = more confidence the average is
  // real. Final fall-through is set+position so unrated rows still read in
  // canonical setlist order.
  test("sorting by Rating tiebreaks on vote count when averages match", async () => {
    const user = userEvent.setup();
    await renderTable([
      // Two tracks tied at 4.5; "Confrontation" has more votes so it should
      // sort ahead of "Crickets" when the table sorts rating descending.
      makeTrack({
        songId: "a",
        position: 1,
        set: "S1",
        averageRating: 4.5,
        ratingsCount: 3,
        song: { id: "a", title: "Crickets", slug: "c" },
      }),
      makeTrack({
        songId: "b",
        position: 2,
        set: "S1",
        averageRating: 4.5,
        ratingsCount: 50,
        song: { id: "b", title: "Confrontation", slug: "co" },
      }),
      makeTrack({
        songId: "c",
        position: 3,
        set: "S1",
        averageRating: 3.0,
        ratingsCount: 100,
        song: { id: "c", title: "Above the Waves", slug: "a" },
      }),
    ]);
    // First click on Rating sorts descending ("best first" via sortDescFirst).
    await user.click(screen.getByRole("button", { name: /Rating/i }));
    const songCells = screen.getAllByRole("cell").filter((_, i) => i % 9 === 3);
    // 4.5/50 (Confrontation) > 4.5/3 (Crickets) > 3.0 (Above the Waves).
    expect(songCells.map((c) => c.textContent?.replace(">", "").trim())).toEqual([
      "Confrontation",
      "Crickets",
      "Above the Waves",
    ]);
  });

  // Rating + vote count both equal → fall through to set+position. The
  // Rating column's first click sorts descending (sortDescFirst), and
  // TanStack inverts the whole comparator on desc — including the
  // set+position fallback — so the rows read in reverse setlist order when
  // every primary axis is tied. Same behavior as the Last Played and Song
  // columns: tiebreak direction follows primary direction.
  test("sorting by Rating with identical rating+votes falls back to set+position", async () => {
    const user = userEvent.setup();
    await renderTable([
      makeTrack({
        songId: "a",
        position: 3,
        set: "S1",
        averageRating: null,
        ratingsCount: 0,
        song: { id: "a", title: "Crickets", slug: "c" },
      }),
      makeTrack({
        songId: "b",
        position: 1,
        set: "S1",
        averageRating: null,
        ratingsCount: 0,
        song: { id: "b", title: "Above the Waves", slug: "a" },
      }),
      makeTrack({
        songId: "c",
        position: 2,
        set: "S1",
        averageRating: null,
        ratingsCount: 0,
        song: { id: "c", title: "Basis for a Day", slug: "b" },
      }),
    ]);
    await user.click(screen.getByRole("button", { name: /Rating/i }));
    const songCells = screen.getAllByRole("cell").filter((_, i) => i % 9 === 3);
    // All three tied → set+position takes over, inverted by desc → 3, 2, 1.
    expect(songCells.map((c) => c.textContent?.replace(">", "").trim())).toEqual([
      "Crickets",
      "Basis for a Day",
      "Above the Waves",
    ]);
  });

  // Track number resets per set so each set/encore reads "1, 2, 3, …"
  // independent of the cumulative position in the show.
  test("renders Track # 1-indexed within each set/encore", async () => {
    await renderTable([
      makeTrack({ songId: "a", position: 1, set: "S1", song: { id: "a", title: "Basis for a Day", slug: "x" } }),
      makeTrack({ songId: "b", position: 2, set: "S1", song: { id: "b", title: "Above the Waves", slug: "y" } }),
      makeTrack({ songId: "c", position: 3, set: "S2", song: { id: "c", title: "Confrontation", slug: "z" } }),
      makeTrack({ songId: "d", position: 4, set: "E1", song: { id: "d", title: "Crickets", slug: "w" } }),
    ]);
    const cells = screen.getAllByRole("cell");
    // Each row produces 9 cells; cells[1], cells[10], cells[19], cells[28] are Track #.
    expect(cells[1].textContent).toBe("1");
    expect(cells[10].textContent).toBe("2");
    expect(cells[19].textContent).toBe("1");
    expect(cells[28].textContent).toBe("1");
  });

  // Set column drops the "S" prefix (S1 → 1, S2 → 2, etc.) — the column
  // header already says "Set" so the redundant letter just adds visual
  // noise. Encores still need a marker, so E1/E2 keep theirs (or collapse
  // to a bare "E" when there's only one).
  test("renders S-set labels as bare numbers", async () => {
    await renderTable([
      makeTrack({ songId: "a", position: 1, set: "S1", song: { id: "a", title: "Above the Waves", slug: "x" } }),
      makeTrack({ songId: "b", position: 2, set: "S2", song: { id: "b", title: "Tempest", slug: "t" } }),
    ]);
    const cells = screen.getAllByRole("cell");
    // 9 cells per row; cells[0] = Set of row 0, cells[9] = Set of row 1.
    expect(cells[0].textContent).toBe("1");
    expect(cells[9].textContent).toBe("2");
  });

  // Single encore collapses E1 → E because there's no second encore to
  // disambiguate against. Multi-encore shows keep E1/E2 so the rows tell
  // the user which encore came first.
  test("renders a single encore as 'E' but keeps E1/E2 when multiple encores exist", async () => {
    await renderTable([
      makeTrack({ songId: "a", position: 1, set: "S1", song: { id: "a", title: "Basis for a Day", slug: "t" } }),
      makeTrack({ songId: "b", position: 2, set: "E1", song: { id: "b", title: "Crickets", slug: "c" } }),
    ]);
    const singleCells = screen.getAllByRole("cell");
    // 9 cells per row; cells[0] = Set row 0, cells[9] = Set row 1.
    expect(singleCells[0].textContent).toBe("1");
    expect(singleCells[9].textContent).toBe("E");

    // Re-render with two encores to confirm we keep the numbering.
    document.body.innerHTML = "";
    await renderTable([
      makeTrack({ songId: "a", position: 1, set: "E1", song: { id: "a", title: "Munchkin Invasion", slug: "m" } }),
      makeTrack({ songId: "b", position: 2, set: "E2", song: { id: "b", title: "Spaga", slug: "s" } }),
    ]);
    const multiCells = screen.getAllByRole("cell");
    expect(multiCells[0].textContent).toBe("E1");
    expect(multiCells[9].textContent).toBe("E2");
  });

  // Normal row: gap renders as the integer; Last Played renders the prior
  // show's date as a link to that show. This is the common case.
  test("renders gap value and Last Played link for a normal row", async () => {
    await renderTable([
      makeTrack({
        songId: "song-a",
        position: 2,
        gap: 12,
        previousPerformanceShowId: "prev-show",
        previousPerformanceShow: { date: "2024-06-15", slug: "2024-06-15-some-venue" },
        song: { id: "song-a", title: "Above the Waves", slug: "above-the-waves" },
      }),
    ]);
    expect(screen.getByText("12")).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    const lastPlayedLink = links.find((a) => a.getAttribute("href") === "/shows/2024-06-15-some-venue");
    expect(lastPlayedLink).toBeDefined();
  });

  // Debut row (gap=null): ★ icon with "Debut" tooltip in the Gap column,
  // em-dash placeholder in Last Played because there's no prior show to link
  // to. Mirrors the song-detail performances table treatment.
  test("renders ★ Debut for gap=null and em-dash in Last Played", async () => {
    await renderTable([
      makeTrack({
        songId: "song-debut",
        position: 1,
        gap: null,
        song: { id: "song-debut", title: "Munchkin Invasion", slug: "munchkin-invasion" },
      }),
    ]);
    expect(screen.getByLabelText("Debut")).toBeInTheDocument();
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  // Within-show repeat: same songId appears at an earlier position in the
  // table. Both occurrences share the same gap value, so the icon — not
  // the number — is what distinguishes the repeat from its first
  // occurrence.
  test("renders ↺ This Show for a within-show repeat", async () => {
    await renderTable([
      makeTrack({
        songId: "song-repeated",
        position: 2,
        gap: 5,
        previousPerformanceShowId: "prev",
        previousPerformanceShow: { date: "2024-05-01", slug: "2024-05-01-venue" },
        song: { id: "song-repeated", title: "Tempest", slug: "tempest" },
      }),
      makeTrack({
        songId: "song-repeated",
        position: 5,
        gap: 5,
        previousPerformanceShowId: "prev",
        previousPerformanceShow: { date: "2024-05-01", slug: "2024-05-01-venue" },
        song: { id: "song-repeated", title: "Tempest", slug: "tempest" },
      }),
    ]);
    expect(screen.getByLabelText("This Show")).toBeInTheDocument();
  });

  // Segue indicator carries over from the flow view: a track whose `segue`
  // is truthy gets a trailing ">" so the table preserves the same flow
  // information ("Basis for a Day > Above the Waves") readers already know.
  // Non-segue rows render the song title alone (no trailing punctuation —
  // the table row separator already does that job).
  test("renders > after segueing tracks and nothing after non-segueing tracks", async () => {
    await renderTable([
      makeTrack({
        songId: "song-segue",
        position: 1,
        gap: 5,
        segue: ">",
        song: { id: "song-segue", title: "Basis for a Day", slug: "basis-for-a-day" },
      }),
      makeTrack({
        songId: "song-end",
        position: 2,
        gap: 10,
        segue: null,
        song: { id: "song-end", title: "Crickets", slug: "crickets" },
      }),
    ]);
    const segueCell = screen.getByRole("link", { name: "Basis for a Day" }).parentElement;
    expect(segueCell?.textContent).toMatch(/Basis for a Day\s*>/);
    const endCell = screen.getByRole("link", { name: "Crickets" }).parentElement;
    expect(endCell?.textContent).toBe("Crickets");
  });

  // Song cell links to the song detail route so users can pivot from a
  // setlist row to that song's full history.
  test("Song cell links to /songs/<slug>", async () => {
    await renderTable([
      makeTrack({
        songId: "song-confrontation",
        position: 1,
        gap: 30,
        previousPerformanceShowId: "prev",
        previousPerformanceShow: { date: "2024-04-20", slug: "2024-04-20" },
        song: { id: "song-confrontation", title: "Confrontation", slug: "confrontation" },
      }),
    ]);
    const link = screen.getByRole("link", { name: "Confrontation" });
    expect(link).toHaveAttribute("href", "/songs/confrontation");
  });

  // Played Before renders the prior-count integer for normal rows and an
  // em-dash placeholder while the catalog play-dates blob is still loading
  // (null) — keeps the column from flashing "0" then settling to the real
  // count on first paint.
  test("renders priorPerformanceCount integer and em-dash for null", async () => {
    await renderTable([
      makeTrack({
        songId: "song-known",
        position: 1,
        priorPerformanceCount: 47,
        song: { id: "song-known", title: "Basis for a Day", slug: "basis-for-a-day" },
      }),
      makeTrack({
        songId: "song-loading",
        position: 2,
        priorPerformanceCount: null,
        song: { id: "song-loading", title: "Crickets", slug: "crickets" },
      }),
    ]);
    expect(screen.getByText("47")).toBeInTheDocument();
    // Loading row plus the Last Played em-dash on the same row both render
    // "—", so we assert presence rather than count.
    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  // Played Before is hidden on mobile to keep the dense gap-chart row
  // readable on narrow screens; the personal view's Seen Before stays
  // visible on its own table.
  test("Played Before column hides on mobile", () => {
    const columns = createSetlistColumns();
    const playedBefore = columns.find((c) => c.id === "priorPerformanceCount");
    const meta = playedBefore?.meta as { hideOnMobile?: boolean } | undefined;
    expect(meta?.hideOnMobile).toBe(true);
  });

  // Rating stays visible on phones too — the rating button is the
  // primary action on the setlist row and dropping it hides a core
  // affordance. The column shrinks to a fixed `mobileFixedWidth` so it
  // still fits alongside Song / Gap / Last Played.
  test("Rating column declares mobileFixedWidth and is NOT hidden on mobile", () => {
    const columns = createSetlistColumns();
    const rating = columns.find((c) => c.id === "rating");
    const meta = rating?.meta as { hideOnMobile?: boolean; mobileFixedWidth?: string } | undefined;
    expect(meta?.hideOnMobile).toBeFalsy();
    expect(meta?.mobileFixedWidth).toBeTruthy();
  });

  // Each row's Rating cell renders TrackRatingCell wired with the track's
  // community average + count, the viewer's own rating from the supplied
  // map (when present), and the auth + showSlug context. trackId is the
  // setlist Track.id, not the songId — ratings are per-performance.
  test("Rating cells receive per-row ratings, userRatings from map, and shared show/auth context", async () => {
    const userRatingMap = new Map<string, number>([["t-1", 4]]);
    await renderTable(
      [
        makeTrack({
          songId: "song-basis",
          position: 1,
          averageRating: 4.2,
          ratingsCount: 17,
          song: { id: "song-basis", title: "Basis for a Day", slug: "basis-for-a-day" },
        }),
        makeTrack({
          songId: "song-munchkin",
          position: 2,
          averageRating: null,
          ratingsCount: 0,
          song: { id: "song-munchkin", title: "Munchkin Invasion", slug: "munchkin-invasion" },
        }),
      ],
      { showSlug: "2024-07-19-camden", userRatingMap, isAuthenticated: true },
    );

    expectAllMockedShallowComponent("TrackRatingCell", [
      {
        trackId: "t-1",
        showSlug: "2024-07-19-camden",
        initialRating: 4.2,
        ratingsCount: 17,
        userRating: 4,
        isAuthenticated: true,
      },
      {
        trackId: "t-2",
        showSlug: "2024-07-19-camden",
        initialRating: null,
        ratingsCount: 0,
        userRating: null,
        isAuthenticated: true,
      },
    ]);
  });

  // Anonymous viewers still see ratings (display + login-prompt-on-click is
  // handled inside RatingBadgeButton). The factory must forward
  // isAuthenticated=false without crashing when no userRatingMap is given.
  test("Rating cells render with anonymous viewer (no userRatingMap)", async () => {
    await renderTable([
      makeTrack({
        songId: "song-crickets",
        position: 1,
        averageRating: 3.8,
        ratingsCount: 5,
        song: { id: "song-crickets", title: "Crickets", slug: "crickets" },
      }),
    ]);

    expectAllMockedShallowComponent("TrackRatingCell", [
      {
        trackId: "t-1",
        showSlug: "",
        initialRating: 3.8,
        ratingsCount: 5,
        userRating: null,
        isAuthenticated: false,
      },
    ]);
  });
});
