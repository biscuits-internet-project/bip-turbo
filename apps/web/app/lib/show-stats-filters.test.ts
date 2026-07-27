import type { ShowStatsRow } from "@bip/domain";
import { describe, expect, test } from "vitest";
import {
  filterShowStatsRows,
  readShowStatsFilters,
  UNFILTERED_SHOW_STATS,
  writeShowStatsFilters,
} from "./show-stats-filters";

function makeRow(overrides: Partial<ShowStatsRow> = {}): ShowStatsRow {
  return {
    id: "show-1",
    slug: "2001-09-01-wetlands-preserve-new-york-ny",
    date: "2001-09-01",
    countForStats: true,
    venueName: "Wetlands Preserve",
    venueCity: "New York",
    venueState: "NY",
    averageRating: 4.88,
    ratingsCount: 33,
    duration: 13218,
    untimedTracks: 0,
    medianGap: 8,
    longestGap: 25,
    vintage: 1998,
    jamCharts: 8,
    photosCount: 43,
    youtubeCount: 0,
    ...overrides,
  };
}

/** Newest first, matching the order the loader hands the table. */
const rows: ShowStatsRow[] = [
  makeRow({ id: "a", date: "2024-07-26", venueName: "Red Rocks", venueCity: "Morrison", venueState: "CO" }),
  makeRow({
    id: "b",
    date: "2011-08-27",
    countForStats: false,
    venueName: "Cynthia Woods",
    venueCity: "The Woodlands",
  }),
  makeRow({ id: "c", date: "2001-09-01" }),
  makeRow({ id: "d", date: "1999-04-09", venueName: "Trocadero", venueCity: "Philadelphia", venueState: "PA" }),
];

const ids = (result: ShowStatsRow[]) => result.map((row) => row.id);

const noContext = { externalSources: {}, attendedShowIds: new Set<string>() };

describe("filterShowStatsRows", () => {
  test("returns every row when nothing is filtered", () => {
    expect(ids(filterShowStatsRows(rows, UNFILTERED_SHOW_STATS, noContext))).toEqual(["a", "b", "c", "d"]);
  });

  test("narrows to a single year", () => {
    const result = filterShowStatsRows(rows, { ...UNFILTERED_SHOW_STATS, timeRange: "2001" }, noContext);

    expect(ids(result)).toEqual(["c"]);
  });

  test("resolves last-10-shows against the newest rows, not a calendar window", () => {
    // The list arrives newest-first, so the boundary is the 10th row's date —
    // here the list is shorter than 10, so every row qualifies.
    const result = filterShowStatsRows(
      rows.slice(0, 2),
      { ...UNFILTERED_SHOW_STATS, timeRange: "last10shows" },
      noContext,
    );

    expect(ids(result)).toEqual(["a", "b"]);
  });

  test("searches venue, city, and date together", () => {
    const byVenue = filterShowStatsRows(rows, { ...UNFILTERED_SHOW_STATS, search: "trocadero" }, noContext);
    const byCity = filterShowStatsRows(rows, { ...UNFILTERED_SHOW_STATS, search: "morrison" }, noContext);
    const byDate = filterShowStatsRows(rows, { ...UNFILTERED_SHOW_STATS, search: "1999-04" }, noContext);

    expect(ids(byVenue)).toEqual(["d"]);
    expect(ids(byCity)).toEqual(["a"]);
    expect(ids(byDate)).toEqual(["d"]);
  });

  test("drops non-stats shows only when the viewer asks for it", () => {
    const all = filterShowStatsRows(rows, UNFILTERED_SHOW_STATS, noContext);
    const statsOnly = filterShowStatsRows(rows, { ...UNFILTERED_SHOW_STATS, statsOnly: true }, noContext);

    expect(ids(all)).toContain("b");
    expect(ids(statsOnly)).not.toContain("b");
  });

  test("narrows to shows the viewer attended", () => {
    const result = filterShowStatsRows(
      rows,
      { ...UNFILTERED_SHOW_STATS, attendedOnly: true },
      { externalSources: {}, attendedShowIds: new Set(["c"]) },
    );

    expect(ids(result)).toEqual(["c"]);
  });

  test("applies media count filters in both directions", () => {
    const withPhotos = filterShowStatsRows(
      [makeRow({ id: "has", photosCount: 43 }), makeRow({ id: "none", photosCount: 0 })],
      { ...UNFILTERED_SHOW_STATS, media: { photos: "positive" } },
      noContext,
    );
    const withoutPhotos = filterShowStatsRows(
      [makeRow({ id: "has", photosCount: 43 }), makeRow({ id: "none", photosCount: 0 })],
      { ...UNFILTERED_SHOW_STATS, media: { photos: "negative" } },
      noContext,
    );

    expect(ids(withPhotos)).toEqual(["has"]);
    expect(ids(withoutPhotos)).toEqual(["none"]);
  });

  test("applies external source filters in both directions", () => {
    const externalSources = { c: { relistenUrl: "https://relisten.net/dbiscuits/2001/09/01" } };

    const onRelisten = filterShowStatsRows(
      rows,
      { ...UNFILTERED_SHOW_STATS, external: { relisten: "positive" } },
      { externalSources, attendedShowIds: new Set<string>() },
    );
    const offRelisten = filterShowStatsRows(
      rows,
      { ...UNFILTERED_SHOW_STATS, external: { relisten: "negative" } },
      { externalSources, attendedShowIds: new Set<string>() },
    );

    expect(ids(onRelisten)).toEqual(["c"]);
    expect(ids(offRelisten)).toEqual(["a", "b", "d"]);
  });

  test("combines filters rather than letting the last one win", () => {
    const result = filterShowStatsRows(
      rows,
      { ...UNFILTERED_SHOW_STATS, statsOnly: true, search: "new york" },
      noContext,
    );

    expect(ids(result)).toEqual(["c"]);
  });
});

describe("readShowStatsFilters", () => {
  test("scopes a bare URL to stats shows, leaving everything else open", () => {
    // Every number in this table is a generated statistic, and the rest of the
    // site computes those over count_for_stats shows — so the bare URL has to
    // agree with them, and the chip has to read as already-pressed.
    const filters = readShowStatsFilters(new URLSearchParams());

    expect(filters.statsOnly).toBe(true);
    expect(filters.timeRange).toBe("all");
    expect(filters.search).toBe("");
    expect(filters.attendedOnly).toBe(false);
  });

  test("reads the opt-out that widens the table to every show", () => {
    expect(readShowStatsFilters(new URLSearchParams("statsOnly=0")).statsOnly).toBe(false);
  });

  test("reads a bookmarked ?year= as the time range", () => {
    // The year page links carry `year`; a URL toggled over from there must not
    // silently lose its scope.
    expect(readShowStatsFilters(new URLSearchParams("year=2001")).timeRange).toBe("2001");
  });

  test("reads the media and source tri-states in both directions", () => {
    const filters = readShowStatsFilters(new URLSearchParams("photos=yes&nugs=no"));

    expect(filters.media.photos).toBe("positive");
    expect(filters.external.nugs).toBe("negative");
    expect(filters.external.archive).toBe("empty");
  });
});

describe("writeShowStatsFilters", () => {
  test("drops a key rather than writing its default", () => {
    const next = writeShowStatsFilters(new URLSearchParams("timeRange=2001&q=troc&statsOnly=0"), {
      timeRange: "all",
      search: "",
      statsOnly: true,
    });

    expect(next.toString()).toBe("");
  });

  test("records turning stats-only off, since that's the deviation", () => {
    // Inverted against the other flags: this one is on unless the URL says so.
    expect(writeShowStatsFilters(new URLSearchParams(), { statsOnly: false }).get("statsOnly")).toBe("0");
  });

  test("clears the legacy year alias when a new range is picked", () => {
    // Otherwise `getTimeRangeParam` would keep preferring the stale `year`.
    const next = writeShowStatsFilters(new URLSearchParams("year=2001"), { timeRange: "2004" });

    expect(next.get("year")).toBeNull();
    expect(next.get("timeRange")).toBe("2004");
  });

  test("leaves the tri-state params alone", () => {
    const next = writeShowStatsFilters(new URLSearchParams("nugs=yes"), { search: "wetlands" });

    expect(next.get("nugs")).toBe("yes");
    expect(next.get("q")).toBe("wetlands");
  });
});
