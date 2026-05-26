import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { computeDebutYearStats, DebutYearChart, type DebutYearTrack } from "./debut-year-chart";

// Recharts ResponsiveContainer measures parent layout via ResizeObserver,
// which jsdom doesn't implement. Stub it to a fixed-size div so the inner
// BarChart actually renders during tests.
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 600, height: 240 }}>{children}</div>
    ),
  };
});

function track(songId: string, year: number | null): DebutYearTrack {
  // Titles humanize the slug so table assertions can target real-looking
  // song names ("Mindless Dribble" from "mindless-dribble") without each
  // call site having to spell them out.
  const title = songId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return {
    songId,
    song: year === null ? null : { title, slug: songId, dateFirstPlayed: new Date(Date.UTC(year, 0, 1)) },
  };
}

describe("computeDebutYearStats", () => {
  // A song played twice in a show contributes a single data point — the
  // chart should reflect the show's *song selection*, not its bar count.
  // Distribution spans the band's catalog window (1995 → show year), so
  // every show's chart is on the same axis.
  test("dedupes repeated songs by songId; X-axis spans 1995 through the show year", () => {
    const result = computeDebutYearStats(
      [track("spaga", 1998), track("spaga", 1998), track("vassillios", 2001)],
      "2001-12-31",
    );

    expect(result.distribution.map(({ year, count }) => ({ year, count }))).toEqual([
      { year: 1995, count: 0 },
      { year: 1996, count: 0 },
      { year: 1997, count: 0 },
      { year: 1998, count: 1 },
      { year: 1999, count: 0 },
      { year: 2000, count: 0 },
      { year: 2001, count: 1 },
    ]);
    expect(result.distribution[3].songs).toEqual([{ title: "Spaga", slug: "spaga" }]);
    expect(result.distribution[6].songs).toEqual([{ title: "Vassillios", slug: "vassillios" }]);
    expect(result.average).toBe(2000);
    expect(result.median).toBe(2000);
  });

  // The histogram zero-fills every year from the band's start through the
  // show year so visual gaps read as gaps (not as a compressed continuous
  // run) and so a 1996 show and a 2024 show are visually comparable.
  test("fills zero-count years from START_YEAR through the show year", () => {
    const result = computeDebutYearStats(
      [track("mindless-dribble", 1995), track("crickets", 1998), track("munchkin-invasion", 2001)],
      "2001-12-31",
    );

    expect(result.distribution.map(({ year, count }) => ({ year, count }))).toEqual([
      { year: 1995, count: 1 },
      { year: 1996, count: 0 },
      { year: 1997, count: 0 },
      { year: 1998, count: 1 },
      { year: 1999, count: 0 },
      { year: 2000, count: 0 },
      { year: 2001, count: 1 },
    ]);
  });

  // X-axis extends to the show year even when no song debuted that recently
  // — a modern show drawing entirely from the 1990s should reveal the era
  // gap as a long tail of zero-count years.
  test("X-axis extends to the show year even when no song debuted that recently", () => {
    const result = computeDebutYearStats([track("crickets", 1996), track("spaga", 1998)], "2024-08-15");

    expect(result.distribution[0]).toMatchObject({ year: 1995, count: 0 });
    expect(result.distribution[result.distribution.length - 1]).toMatchObject({ year: 2024, count: 0 });
    expect(result.distribution.length).toBe(2024 - 1995 + 1);
  });

  // A song dated after the show is a data-integrity edge case (stats not
  // rebuilt) — skip it so the chart stays bounded by the show year.
  test("ignores songs whose dateFirstPlayed is after the show", () => {
    const result = computeDebutYearStats([track("crickets", 1996), track("future-song", 2005)], "2001-12-31");

    expect(result.distribution[result.distribution.length - 1]).toMatchObject({ year: 2001, count: 0 });
    expect(result.average).toBe(1996);
  });

  // A song dated before START_YEAR (1995) is a data anomaly — skip it so
  // the X-axis floor stays consistent across all shows.
  test("ignores songs whose dateFirstPlayed is before START_YEAR", () => {
    const result = computeDebutYearStats([track("ancient-song", 1990), track("crickets", 1998)], "2001-12-31");

    expect(result.distribution[0]).toMatchObject({ year: 1995, count: 0 });
    expect(result.average).toBe(1998);
  });

  // Odd-count median is the middle value; average is the rounded mean so
  // a hand calculation matches the displayed integer year.
  test("odd-count median equals the middle year, average rounded to integer", () => {
    const result = computeDebutYearStats(
      [track("aceetobee", 1996), track("konkrete", 1999), track("plan-b", 2002)],
      "2002-12-31",
    );

    expect(result.median).toBe(1999);
    expect(result.average).toBe(1999);
  });

  // Even-count median rounds the mean of the two middle values up to an
  // integer year — half-year results would read as noise for a stat that
  // means "year the songs came from."
  test("even-count median rounds to an integer year", () => {
    const result = computeDebutYearStats(
      [track("crickets", 1996), track("spaga", 1998), track("vassillios", 1999), track("konkrete", 2001)],
      "2001-12-31",
    );

    expect(result.median).toBe(1999);
    expect(result.average).toBe(1999);
  });

  // Songs missing dateFirstPlayed are defensively skipped — they don't
  // belong in any year's bar and would corrupt avg/median if included.
  test("skips songs with no dateFirstPlayed", () => {
    const result = computeDebutYearStats(
      [track("spaga", 1998), track("uncatalogued", null), track("vassillios", 2001)],
      "2001-12-31",
    );

    expect(result.distribution.map(({ year, count }) => ({ year, count }))).toEqual([
      { year: 1995, count: 0 },
      { year: 1996, count: 0 },
      { year: 1997, count: 0 },
      { year: 1998, count: 1 },
      { year: 1999, count: 0 },
      { year: 2000, count: 0 },
      { year: 2001, count: 1 },
    ]);
    expect(result.average).toBe(2000);
  });

  // No qualifying songs → all-null result, signaling the chart to render
  // nothing rather than an axis with no bars.
  test("empty input returns null average/median and empty distribution", () => {
    expect(computeDebutYearStats([], "2001-12-31")).toEqual({
      distribution: [],
      average: null,
      median: null,
    });
  });

  // The table view lists song titles per year; sort alphabetically so a
  // reader can scan the names predictably (not in setlist position order).
  test("sorts songs within each year alphabetically by title", () => {
    const result = computeDebutYearStats(
      [track("svenghali", 1996), track("aceetobee", 1996), track("munchkin-invasion", 1996)],
      "2001-12-31",
    );

    // 1996 is index 1 in the distribution (1995 sits at index 0 as the
    // catalog-window floor) — assert against that row's `songs` field.
    expect(result.distribution[1]).toMatchObject({
      year: 1996,
      songs: [
        { title: "Aceetobee", slug: "aceetobee" },
        { title: "Munchkin Invasion", slug: "munchkin-invasion" },
        { title: "Svenghali", slug: "svenghali" },
      ],
    });
  });
});

describe("DebutYearChart", () => {
  const setlist = {
    show: { date: "2001-12-31" },
    sets: [
      {
        tracks: [track("spaga", 1998), track("vassillios", 2001), track("crickets", 2001)],
      },
    ],
  };

  // The card carries a title so readers see "Songs by debut year" without
  // having to interpret the chart from context.
  test("renders the section heading", async () => {
    await setupWithRouter(<DebutYearChart setlist={setlist} />);
    expect(screen.getByText(/songs by debut year/i)).toBeInTheDocument();
  });

  // Summary line mirrors the song-gap line on SetlistCard ("average /
  // median song gap: X / Y") so the chart reads as one of a family of
  // setlist-stat lines rather than a one-off format. The "debut year"
  // suffix is dropped because the title above already supplies that
  // context.
  test("renders the average / median summary line", async () => {
    await setupWithRouter(<DebutYearChart setlist={setlist} />);
    expect(screen.getByText("average / median: 2000 / 2001")).toBeInTheDocument();
  });

  // Empty distribution → render nothing. Avoids an empty-axis card on
  // shows whose songs all lack dateFirstPlayed (shouldn't happen in
  // practice; safety net).
  test("renders nothing when no songs have a debut year", async () => {
    const empty = { show: { date: "2001-12-31" }, sets: [{ tracks: [track("uncatalogued", null)] }] };
    const { container } = await setupWithRouter(<DebutYearChart setlist={empty} />);
    expect(container.firstChild).toBeNull();
  });

  // Chart is the default — toggling to table swaps the bar chart for a
  // tabular layout that lists the songs that debuted in each non-zero year.
  test("toggles between chart and table; chart is the default", async () => {
    const { user } = await setupWithRouter(<DebutYearChart setlist={setlist} />);
    const chartButton = screen.getByRole("button", { name: /^chart$/i });
    const tableButton = screen.getByRole("button", { name: /^table$/i });
    expect(chartButton).toHaveAttribute("aria-pressed", "true");
    expect(tableButton).toHaveAttribute("aria-pressed", "false");

    await user.click(tableButton);
    expect(tableButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("columnheader", { name: /year/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: /songs/i })).toBeInTheDocument();
    // Only non-zero years appear as rows — the histogram's zero-fill is
    // visual context, not tabular data. The Songs cell links to each
    // distinct song that debuted in that year.
    expect(screen.getByRole("cell", { name: "1998" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "2001" })).toBeInTheDocument();
    expect(screen.queryByRole("cell", { name: "1999" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Spaga" })).toHaveAttribute("href", "/songs/spaga");
    expect(screen.getByRole("link", { name: "Vassillios" })).toHaveAttribute("href", "/songs/vassillios");
    expect(screen.getByRole("link", { name: "Crickets" })).toHaveAttribute("href", "/songs/crickets");

    await user.click(chartButton);
    expect(chartButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("columnheader", { name: /year/i })).not.toBeInTheDocument();
  });
});
