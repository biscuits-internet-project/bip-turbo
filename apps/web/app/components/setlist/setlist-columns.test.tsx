import type { TrackLight } from "@bip/domain";
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { createSetlistColumns, type SetlistTableRow } from "./setlist-columns";

function makeTrack(overrides: Partial<TrackLight> & { songId: string; position: number }): SetlistTableRow {
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
    averageRating: null,
    ratingsCount: 0,
    gap: overrides.gap ?? null,
    previousPerformanceShowId: overrides.previousPerformanceShowId ?? null,
    previousPerformanceShow: overrides.previousPerformanceShow ?? null,
    song: overrides.song ?? { id: overrides.songId, title: "Tractorbeam", slug: "tractorbeam" },
  };
}

// Renders the column definitions through a real table so we exercise the cell
// callbacks against TanStack's row model — same render pattern the production
// SetlistTable will use.
async function renderTable(rows: SetlistTableRow[]) {
  function Harness() {
    const table = useReactTable({
      data: rows,
      columns: createSetlistColumns(),
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
  // Column order: Set, Track #, Song, Gap, Last Played. Track sits between
  // Set and Song; Gap sits next to Song so the rarity number reads as
  // "Song / Gap" before the user's eye jumps to the older Last Played
  // date. Locking the order so a future rearrangement is a deliberate edit.
  test("returns columns in order [Set, Track, Song, Gap, Last Played]", () => {
    const columns = createSetlistColumns();
    expect(columns.map((c) => c.id)).toEqual(["set", "track", "song", "gap", "lastPlayed"]);
  });

  // Sortable columns: Set, Track #, Gap, Last Played. Set and Track # share
  // the canonical "set order then position" comparator (sorting either way
  // produces the same render); Last Played sorts by previous-show date;
  // Gap sorts numerically with debuts/repeats kept at the extremes. Song
  // is intentionally not sortable (alphabetizing it would scramble the
  // setlist's narrative).
  test("Set, Track, Gap, and Last Played are sortable; Song is not", () => {
    const columns = createSetlistColumns();
    const sortable = new Map(columns.map((c) => [c.id, c.enableSorting]));
    expect(sortable.get("set")).toBe(true);
    expect(sortable.get("track")).toBe(true);
    expect(sortable.get("gap")).toBe(true);
    expect(sortable.get("lastPlayed")).toBe(true);
    expect(sortable.get("song")).toBe(false);
  });

  // When sorted by Set (the default), only the first row of each set group
  // shows the set label — subsequent rows in the same set leave the cell
  // blank to make the grouping visually obvious. Other sorts (Gap, Last
  // Played) interleave sets, so every row keeps its label.
  test("hides repeated set labels when sorted by Set", async () => {
    await renderTable([
      makeTrack({ songId: "a", position: 1, set: "S1", song: { id: "a", title: "Tractorbeam", slug: "x" } }),
      makeTrack({ songId: "b", position: 2, set: "S1", song: { id: "b", title: "Above the Waves", slug: "y" } }),
      makeTrack({ songId: "c", position: 3, set: "S2", song: { id: "c", title: "Confrontation", slug: "z" } }),
      makeTrack({ songId: "d", position: 4, set: "S2", song: { id: "d", title: "Crickets", slug: "w" } }),
    ]);
    // Default sort is on the harness's input order; explicitly clicking
    // the Set header puts the table into "sorted by set" mode.
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /^Set$/i }));
    const setCells = screen.getAllByRole("cell").filter((_, i) => i % 5 === 0);
    expect(setCells.map((c) => c.textContent)).toEqual(["1", "", "2", ""]);
  });

  // Other sorts mix set values together (an asc-by-gap may go S2, S1, E1, S1),
  // so blanking would lose the per-row context. Every row labels its set
  // when the active sort isn't the Set column.
  test("shows the set label on every row when sorted by Gap", async () => {
    const user = userEvent.setup();
    await renderTable([
      makeTrack({ songId: "a", position: 1, set: "S1", gap: 10, song: { id: "a", title: "Tractorbeam", slug: "x" } }),
      makeTrack({ songId: "b", position: 2, set: "S1", gap: 5, song: { id: "b", title: "Above the Waves", slug: "y" } }),
      makeTrack({ songId: "c", position: 3, set: "S2", gap: 20, song: { id: "c", title: "Confrontation", slug: "z" } }),
    ]);
    await user.click(screen.getByRole("button", { name: /Gap/i }));
    const setCells = screen.getAllByRole("cell").filter((_, i) => i % 5 === 0);
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
        song: { id: "a", title: "Tractorbeam", slug: "x" },
      }),
      makeTrack({
        songId: "b",
        position: 3,
        set: "S1",
        previousPerformanceShow: { date: "2024-05-10", slug: "middle" },
        song: { id: "b", title: "Above the Waves", slug: "y" },
      }),
    ]);
    await user.click(screen.getByRole("button", { name: /Last Played/i }));
    const songCells = screen.getAllByRole("cell").filter((_, i) => i % 5 === 2);
    expect(songCells.map((c) => c.textContent?.replace(">", "").trim())).toEqual([
      "Tractorbeam",
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
        song: { id: "a", title: "Tractorbeam", slug: "x" },
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
    const songCells = screen.getAllByRole("cell").filter((_, i) => i % 5 === 2);
    expect(songCells.map((c) => c.textContent?.replace(">", "").trim())).toEqual([
      "Tractorbeam",
      "Above the Waves",
      "Crickets",
    ]);
  });

  // Track number resets per set so each set/encore reads "1, 2, 3, …"
  // independent of the cumulative position in the show.
  test("renders Track # 1-indexed within each set/encore", async () => {
    await renderTable([
      makeTrack({ songId: "a", position: 1, set: "S1", song: { id: "a", title: "Tractorbeam", slug: "x" } }),
      makeTrack({ songId: "b", position: 2, set: "S1", song: { id: "b", title: "Above the Waves", slug: "y" } }),
      makeTrack({ songId: "c", position: 3, set: "S2", song: { id: "c", title: "Confrontation", slug: "z" } }),
      makeTrack({ songId: "d", position: 4, set: "E1", song: { id: "d", title: "Crickets", slug: "w" } }),
    ]);
    const cells = screen.getAllByRole("cell");
    // Each row produces 5 cells; cells[1], cells[6], cells[11], cells[16] are Track #.
    expect(cells[1].textContent).toBe("1");
    expect(cells[6].textContent).toBe("2");
    expect(cells[11].textContent).toBe("1");
    expect(cells[16].textContent).toBe("1");
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
    // 5 cells per row; cells[0] = Set of row 0, cells[5] = Set of row 1.
    expect(cells[0].textContent).toBe("1");
    expect(cells[5].textContent).toBe("2");
  });

  // Single encore collapses E1 → E because there's no second encore to
  // disambiguate against. Multi-encore shows keep E1/E2 so the rows tell
  // the user which encore came first.
  test("renders a single encore as 'E' but keeps E1/E2 when multiple encores exist", async () => {
    await renderTable([
      makeTrack({ songId: "a", position: 1, set: "S1", song: { id: "a", title: "Tractorbeam", slug: "t" } }),
      makeTrack({ songId: "b", position: 2, set: "E1", song: { id: "b", title: "Crickets", slug: "c" } }),
    ]);
    const singleCells = screen.getAllByRole("cell");
    // 5 cells per row; cells[0] = Set row 0, cells[5] = Set row 1.
    expect(singleCells[0].textContent).toBe("1");
    expect(singleCells[5].textContent).toBe("E");

    // Re-render with two encores to confirm we keep the numbering.
    document.body.innerHTML = "";
    await renderTable([
      makeTrack({ songId: "a", position: 1, set: "E1", song: { id: "a", title: "Munchkin Invasion", slug: "m" } }),
      makeTrack({ songId: "b", position: 2, set: "E2", song: { id: "b", title: "Spaga", slug: "s" } }),
    ]);
    const multiCells = screen.getAllByRole("cell");
    expect(multiCells[0].textContent).toBe("E1");
    expect(multiCells[5].textContent).toBe("E2");
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
  // information ("Tractorbeam > Above the Waves") readers already know.
  // Non-segue rows render the song title alone (no trailing punctuation —
  // the table row separator already does that job).
  test("renders > after segueing tracks and nothing after non-segueing tracks", async () => {
    await renderTable([
      makeTrack({
        songId: "song-segue",
        position: 1,
        gap: 5,
        segue: ">",
        song: { id: "song-segue", title: "Tractorbeam", slug: "tractorbeam" },
      }),
      makeTrack({
        songId: "song-end",
        position: 2,
        gap: 10,
        segue: null,
        song: { id: "song-end", title: "Crickets", slug: "crickets" },
      }),
    ]);
    const segueCell = screen.getByRole("link", { name: "Tractorbeam" }).parentElement;
    expect(segueCell?.textContent).toMatch(/Tractorbeam\s*>/);
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
});
