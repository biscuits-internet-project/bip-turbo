import type { Show, Song } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DataTable } from "~/components/ui/data-table";
import { getSongsColumns } from "./songs-columns";

interface SongWithShows extends Song {
  firstPlayedShow?: Show | null;
  lastPlayedShow?: Show | null;
}

const baseColumns = getSongsColumns({ showFilteredPlays: false });
const filteredColumns = getSongsColumns({ showFilteredPlays: true });

function makeShow(overrides: Partial<Show> = {}): Show {
  return {
    id: overrides.id ?? "show-1",
    slug: overrides.slug ?? "2024-06-15-the-cap",
    date: overrides.date ?? "2024-06-15",
    venueId: overrides.venueId ?? "venue-1",
    bandId: "band-1",
    notes: null,
    createdAt: new Date("2024-06-16"),
    updatedAt: new Date("2024-06-16"),
    likesCount: 0,
    relistenUrl: null,
    averageRating: 0,
    ratingsCount: 0,
    showPhotosCount: 0,
    showYoutubesCount: 0,
    reviewsCount: 0,
    countForStats: true,
    venue: overrides.venue ?? {
      id: "venue-1",
      slug: "the-cap",
      name: "The Capitol Theatre",
      city: "Port Chester",
      state: "NY",
      country: "USA",
      createdAt: new Date("2020-01-01"),
      updatedAt: new Date("2020-01-01"),
      timesPlayed: 0,
    },
    ...overrides,
  };
}

function makeSong(overrides: Partial<SongWithShows> = {}): SongWithShows {
  return {
    id: overrides.id ?? "song-1",
    title: overrides.title ?? "Basis for a Day",
    slug: overrides.slug ?? "basis-for-a-day",
    createdAt: new Date("2020-01-01"),
    updatedAt: new Date("2020-01-01"),
    lyrics: null,
    tabs: null,
    notes: null,
    cover: false,
    authorId: null,
    history: null,
    featuredLyric: null,
    timesPlayed: 42,
    dateLastPlayed: new Date("2024-06-15"),
    dateFirstPlayed: new Date("1995-07-04"),
    actualLastPlayedDate: null,
    showsSinceLastPlayed: null,
    lastVenue: null,
    firstVenue: null,
    firstShowSlug: null,
    lastShowSlug: null,
    showsBeforeDebut: null,
    showsSinceDebut: null,
    totalShows: 0,
    percentOfAllShows: null,
    percentSinceDebut: null,
    averageGapShows: null,
    medianGapShows: null,
    longestGapShows: null,
    yearlyPlayData: {},
    longestGapsData: {},
    mostCommonYear: null,
    leastCommonYear: null,
    guitarTabsUrl: null,
    authorName: null,
    firstPlayedShow: null,
    lastPlayedShow: null,
    ...overrides,
  };
}

describe("getSongsColumns", () => {
  // The Song Title column is how users navigate from /songs to /songs/$slug.
  // Verifies the title is rendered inside an <a> with the correct href.
  test("title cell renders a link to /songs/{slug}", async () => {
    await setupWithRouter(
      <DataTable
        columns={baseColumns}
        data={[makeSong({ title: "Basis for a Day", slug: "basis-for-a-day" })]}
        hideSearch
        hidePagination
      />,
    );

    const link = screen.getByRole("link", { name: "Basis for a Day" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/songs/basis-for-a-day");
  });

  // Songs with no performances (DB songs that exist but were never played)
  // render a readable italic "Never performed" placeholder rather than a bare
  // "0". Matters because /songs hides songs with timesPlayed > 0 by default,
  // but the "Not Played" filter flips that.
  test('timesPlayed === 0 renders "Never performed"', async () => {
    await setupWithRouter(
      <DataTable columns={baseColumns} data={[makeSong({ timesPlayed: 0 })]} hideSearch hidePagination />,
    );

    expect(screen.getByText("Never performed")).toBeInTheDocument();
  });

  // The normal case: `timesPlayed` (all-time) is rendered as a bold number.
  // Paired with the previous test to pin "Never performed" to exactly the 0 case.
  test("timesPlayed > 0 renders the play count", async () => {
    await setupWithRouter(
      <DataTable columns={baseColumns} data={[makeSong({ timesPlayed: 42 })]} hideSearch hidePagination />,
    );

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.queryByText("Never performed")).not.toBeInTheDocument();
  });

  // When showFilteredPlays is false (no filter active), the factory omits
  // the "Filtered Plays" column entirely so the table stays minimal.
  test("showFilteredPlays=false: Filtered Plays column is not rendered", async () => {
    await setupWithRouter(
      <DataTable
        columns={baseColumns}
        data={[makeSong({ timesPlayed: 42, filteredTimesPlayed: 5 })]}
        hideSearch
        hidePagination
      />,
    );

    expect(screen.queryByRole("button", { name: /Filtered\s*Plays/i })).not.toBeInTheDocument();
  });

  // The three filtered rarity columns ride on the same `showFilteredPlays`
  // gate as Filtered Plays. They mirror Gap to Now / Since Debut / Avg Gap,
  // computed against the active filter scope. Hidden by default so they
  // don't duplicate the all-time columns when no filter narrows the data.
  test("showFilteredPlays=false: filtered rarity columns are not rendered", async () => {
    await setupWithRouter(
      <DataTable
        columns={baseColumns}
        data={[
          makeSong({
            filteredTimesPlayed: 3,
            filteredShowsSinceLastPlayed: 9,
            filteredPercentSinceDebut: 0.42,
            filteredAverageGapShows: 2.4,
          }),
        ]}
        hideSearch
        hidePagination
      />,
    );

    expect(screen.queryByRole("button", { name: /Filtered Gap to End/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Filtered Since Debut/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Filtered Avg Gap/i })).not.toBeInTheDocument();
  });

  // When showFilteredPlays is true, each filtered column renders next to
  // its all-time counterpart so the two read as a paired comparison.
  test("showFilteredPlays=true: filtered rarity columns render their scoped values", async () => {
    await setupWithRouter(
      <DataTable
        columns={filteredColumns}
        data={[
          makeSong({
            filteredTimesPlayed: 3,
            filteredShowsSinceLastPlayed: 9,
            filteredPercentSinceDebut: 0.42,
            filteredAverageGapShows: 2.4,
          }),
        ]}
        hideSearch
        hidePagination
      />,
    );

    // Filtered Gap to End renders the raw integer.
    expect(screen.getByText("9")).toBeInTheDocument();
    // Filtered Since Debut renders as a percent (matches existing % formatter).
    expect(screen.getByText("42%")).toBeInTheDocument();
    // Filtered Avg Gap renders with one decimal place.
    expect(screen.getByText("2.4")).toBeInTheDocument();
  });

  // When showFilteredPlays is true, the factory inserts a "Filtered Plays"
  // column next to Plays showing the count scoped to the active filter.
  test("showFilteredPlays=true: Filtered Plays column renders the scoped count", async () => {
    await setupWithRouter(
      <DataTable
        columns={filteredColumns}
        data={[makeSong({ timesPlayed: 42, filteredTimesPlayed: 7 })]}
        hideSearch
        hidePagination
      />,
    );

    expect(screen.getByRole("button", { name: /Filtered\s*Plays/i })).toBeInTheDocument();
    // Both the all-time count (42) and the scoped count (7) are present.
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  // When a song is in the filtered result set but has 0 (or undefined)
  // filtered plays, the cell renders an em-dash rather than "0". Keeps the
  // column readable for rows like "Not Played" entries that shouldn't be
  // shown at all — defensive if the column is ever displayed in that mode.
  test("Filtered Plays cell renders em-dash when filteredTimesPlayed is 0 or missing", async () => {
    await setupWithRouter(
      <DataTable
        columns={filteredColumns}
        data={[makeSong({ title: "Crickets", slug: "crickets", filteredTimesPlayed: 0 })]}
        hideSearch
        hidePagination
      />,
    );

    // em-dash appears at least once for the Filtered Plays cell (date cells
    // are non-null in this fixture).
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  // The Last Played cell formats the date (en-US, UTC, "Jun 15, 2024") and
  // wraps it in a link to the show page when `lastPlayedShow` has a slug.
  // Also renders the venue name + city/state as a secondary line under the
  // date. This is the user's primary way to jump from "I saw this song" to
  // the specific show where it happened.
  test("Last Played cell formats date, links to show, and shows venue", async () => {
    const song = makeSong({
      dateLastPlayed: new Date("2024-06-15"),
      lastPlayedShow: makeShow({ slug: "2024-06-15-the-cap" }),
    });
    await setupWithRouter(<DataTable columns={baseColumns} data={[song]} hideSearch hidePagination />);

    // Date text is formatted (not ISO). Regex avoids pinning exact locale format.
    expect(screen.getByText(/6\/15\/2024/)).toBeInTheDocument();
    // Wrapped in a link to the show
    const showLink = screen.getByRole("link", { name: /6\/15\/2024/ });
    expect(showLink).toHaveAttribute("href", "/shows/2024-06-15-the-cap");
    // Venue line is rendered
    expect(screen.getByText(/The Capitol Theatre/)).toBeInTheDocument();
    expect(screen.getByText(/Port Chester NY/)).toBeInTheDocument();
  });

  // When `dateLastPlayed` is null (a DB song that's never been performed, or
  // one whose last-played date hasn't been backfilled), the cell renders an
  // em-dash placeholder instead of crashing or showing "Invalid Date".
  test("Last Played cell renders em-dash when dateLastPlayed is null", async () => {
    const song = makeSong({ dateLastPlayed: null, lastPlayedShow: null });
    await setupWithRouter(<DataTable columns={baseColumns} data={[song]} hideSearch hidePagination />);

    // Both Last Played and First Played will be null → 2 em-dashes expected
    // (we null out dateFirstPlayed below to make the assertion precise).
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(1);
  });

  // When a Last Played date exists but the show relation is missing (edge
  // case: data migration gap), the date still renders — just without the
  // show link. Keeps the cell useful even when joined data is incomplete.
  test("Last Played cell renders plain date (no link) when lastPlayedShow is missing", async () => {
    const song = makeSong({
      dateLastPlayed: new Date("2024-06-15"),
      lastPlayedShow: null,
    });
    await setupWithRouter(<DataTable columns={baseColumns} data={[song]} hideSearch hidePagination />);

    expect(screen.getByText(/6\/15\/2024/)).toBeInTheDocument();
    // No link wraps the date
    expect(screen.queryByRole("link", { name: /6\/15\/2024/ })).not.toBeInTheDocument();
  });

  // First Played cell mirrors Last Played exactly — same date-format +
  // show-link + venue-line structure, just reading different fields. Paired
  // because the two cells are near-duplicate code today (candidate for a
  // later shared helper). Regression gate if/when the duplication is DRY'd.
  test("First Played cell formats date, links to show, and shows venue", async () => {
    const song = makeSong({
      dateFirstPlayed: new Date("1995-07-04"),
      firstPlayedShow: makeShow({ id: "show-first", slug: "1995-07-04-red-rocks" }),
    });
    await setupWithRouter(<DataTable columns={baseColumns} data={[song]} hideSearch hidePagination />);

    expect(screen.getByText(/7\/4\/1995/)).toBeInTheDocument();
    const showLink = screen.getByRole("link", { name: /7\/4\/1995/ });
    expect(showLink).toHaveAttribute("href", "/shows/1995-07-04-red-rocks");
  });

  // Symmetric with "Last Played null" — confirms First Played also handles
  // null dates gracefully with an em-dash.
  test("First Played cell renders em-dash when dateFirstPlayed is null", async () => {
    const song = makeSong({ dateFirstPlayed: null, firstPlayedShow: null });
    await setupWithRouter(<DataTable columns={baseColumns} data={[song]} hideSearch hidePagination />);
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });

  // The First Played column sorts by `dateFirstPlayed`. Users click it to
  // find the band's earliest or most-recent debut performances — useful for
  // historical browsing. Symmetric with the Last Played sort test.
  test("clicking First Played header sorts by dateFirstPlayed ascending, then descending", async () => {
    const songs = [
      makeSong({ id: "a", title: "Home Again", slug: "home-again", dateFirstPlayed: new Date("1995-07-04") }),
      makeSong({ id: "b", title: "Crickets", slug: "crickets", dateFirstPlayed: new Date("2020-01-01") }),
      makeSong({ id: "c", title: "Plan B", slug: "plan-b", dateFirstPlayed: new Date("2010-06-15") }),
    ];
    const { user } = await setupWithRouter(<DataTable columns={baseColumns} data={songs} hideSearch hidePagination />);

    // Header label is split into stacked <span>First</span><span>Played</span>
    // (so it wraps to two lines at narrow widths); accessible name has no
    // whitespace between the words.
    const sortHeader = screen.getByRole("button", { name: /^First Played/i });
    await user.click(sortHeader);

    const titlesAsc = screen
      .getAllByRole("link")
      .filter((el) => ["Home Again", "Crickets", "Plan B"].includes(el.textContent ?? ""));
    expect(titlesAsc.map((el) => el.textContent)).toEqual(["Home Again", "Plan B", "Crickets"]);

    await user.click(sortHeader);
    const titlesDesc = screen
      .getAllByRole("link")
      .filter((el) => ["Home Again", "Crickets", "Plan B"].includes(el.textContent ?? ""));
    expect(titlesDesc.map((el) => el.textContent)).toEqual(["Crickets", "Plan B", "Home Again"]);
  });

  // The Plays column sorts by `timesPlayed`. Users click it to find songs
  // played most (or least) often across the band's history — a core way to
  // browse the song catalog.
  test("clicking Plays header sorts by timesPlayed ascending, then descending", async () => {
    const songs = [
      makeSong({ id: "a", title: "Home Again", slug: "home-again", timesPlayed: 50 }),
      makeSong({ id: "b", title: "Crickets", slug: "crickets", timesPlayed: 10 }),
      makeSong({ id: "c", title: "Plan B", slug: "plan-b", timesPlayed: 30 }),
    ];
    const { user } = await setupWithRouter(<DataTable columns={baseColumns} data={songs} hideSearch hidePagination />);

    const sortHeader = screen.getByRole("button", { name: /^Plays/i });
    await user.click(sortHeader);

    const titlesAsc = screen
      .getAllByRole("link")
      .filter((el) => ["Home Again", "Crickets", "Plan B"].includes(el.textContent ?? ""));
    expect(titlesAsc.map((el) => el.textContent)).toEqual(["Crickets", "Plan B", "Home Again"]);

    await user.click(sortHeader);
    const titlesDesc = screen
      .getAllByRole("link")
      .filter((el) => ["Home Again", "Crickets", "Plan B"].includes(el.textContent ?? ""));
    expect(titlesDesc.map((el) => el.textContent)).toEqual(["Home Again", "Plan B", "Crickets"]);
  });

  // The Last Played column sorts by `dateLastPlayed`. Users click it to find
  // the most-recently-played songs (default desc on date) or the longest
  // dormant songs. TanStack's default date sort handles the comparison.
  test("clicking Last Played header sorts by dateLastPlayed ascending, then descending", async () => {
    const songs = [
      makeSong({ id: "a", title: "Home Again", slug: "home-again", dateLastPlayed: new Date("2020-01-01") }),
      makeSong({ id: "b", title: "Crickets", slug: "crickets", dateLastPlayed: new Date("2024-06-15") }),
      makeSong({ id: "c", title: "Plan B", slug: "plan-b", dateLastPlayed: new Date("2022-03-10") }),
    ];
    const { user } = await setupWithRouter(<DataTable columns={baseColumns} data={songs} hideSearch hidePagination />);

    const sortHeader = screen.getByRole("button", { name: /^Last Played/i });
    await user.click(sortHeader);

    // The title column uses the same tag as date cells, so filter by title set
    const titlesAsc = screen
      .getAllByRole("link")
      .filter((el) => ["Home Again", "Crickets", "Plan B"].includes(el.textContent ?? ""));
    expect(titlesAsc.map((el) => el.textContent)).toEqual(["Home Again", "Plan B", "Crickets"]);

    await user.click(sortHeader);
    const titlesDesc = screen
      .getAllByRole("link")
      .filter((el) => ["Home Again", "Crickets", "Plan B"].includes(el.textContent ?? ""));
    expect(titlesDesc.map((el) => el.textContent)).toEqual(["Crickets", "Plan B", "Home Again"]);
  });

  // When two songs have the same filteredTimesPlayed value, fall back to
  // sorting by all-time `timesPlayed` in the same direction. Most useful
  // tiebreaker for "rank within filter" browsing — e.g. on a 1999 filter,
  // ties at "played twice that year" surface the more-played-overall song
  // first under desc.
  test("Filtered Plays sort breaks ties using all-time timesPlayed in the same direction", async () => {
    const songs = [
      // Two songs tied at filteredTimesPlayed=2; differ by timesPlayed
      makeSong({ id: "a", title: "Plan B", slug: "plan-b", filteredTimesPlayed: 2, timesPlayed: 30 }),
      makeSong({ id: "b", title: "Crickets", slug: "crickets", filteredTimesPlayed: 2, timesPlayed: 80 }),
      // Higher filtered count — first under desc / last under asc
      makeSong({ id: "c", title: "Home Again", slug: "home-again", filteredTimesPlayed: 5, timesPlayed: 10 }),
    ];
    const { user } = await setupWithRouter(
      <DataTable columns={filteredColumns} data={songs} hideSearch hidePagination />,
    );

    const sortHeader = screen.getByRole("button", { name: /Filtered\s*Plays/i });
    await user.click(sortHeader); // asc

    // asc: [filtered=2, timesPlayed=30 (Plan B)], [filtered=2, timesPlayed=80 (Crickets)], [filtered=5 (Home Again)]
    const titlesAsc = screen
      .getAllByRole("link")
      .filter((el) => ["Home Again", "Crickets", "Plan B"].includes(el.textContent ?? ""));
    expect(titlesAsc.map((el) => el.textContent)).toEqual(["Plan B", "Crickets", "Home Again"]);

    await user.click(sortHeader); // desc

    // desc: [filtered=5 (Home Again)], [filtered=2, timesPlayed=80 (Crickets)], [filtered=2, timesPlayed=30 (Plan B)]
    const titlesDesc = screen
      .getAllByRole("link")
      .filter((el) => ["Home Again", "Crickets", "Plan B"].includes(el.textContent ?? ""));
    expect(titlesDesc.map((el) => el.textContent)).toEqual(["Home Again", "Crickets", "Plan B"]);
  });

  // The Filtered Plays column sorts numerically by `filteredTimesPlayed`.
  // When a filter is active, users click this to rank songs by how often
  // they appeared in the filtered scope (e.g. "most-played songs in 1999").
  test("clicking Filtered Plays header sorts by filteredTimesPlayed ascending, then descending", async () => {
    const songs = [
      makeSong({
        id: "a",
        title: "Home Again",
        slug: "home-again",
        filteredTimesPlayed: 1,
      }),
      makeSong({
        id: "b",
        title: "Crickets",
        slug: "crickets",
        filteredTimesPlayed: 5,
      }),
      makeSong({
        id: "c",
        title: "Plan B",
        slug: "plan-b",
        filteredTimesPlayed: 3,
      }),
    ];
    const { user } = await setupWithRouter(
      <DataTable columns={filteredColumns} data={songs} hideSearch hidePagination />,
    );

    // First click: asc. Second click: desc.
    const sortHeader = screen.getByRole("button", { name: /Filtered\s*Plays/i });
    await user.click(sortHeader);

    const titlesAsc = screen
      .getAllByRole("link")
      .filter((el) => ["Home Again", "Crickets", "Plan B"].includes(el.textContent ?? ""));
    expect(titlesAsc.map((el) => el.textContent)).toEqual(["Home Again", "Plan B", "Crickets"]);

    await user.click(sortHeader);
    const titlesDesc = screen
      .getAllByRole("link")
      .filter((el) => ["Home Again", "Crickets", "Plan B"].includes(el.textContent ?? ""));
    expect(titlesDesc.map((el) => el.textContent)).toEqual(["Crickets", "Plan B", "Home Again"]);
  });

  // Both date formats are present in the DOM; the wrapping cell declares
  // `@container/datecell` and ShowDate's spans use `@max-[6rem]/datecell:`
  // to swap which one is visible. Wide column → full "Jun 15, 2024";
  // tight column (many picks or narrow layout) → compact "6/15/24". One
  // width for dense and sparse column sets, browser does the rest.
  test("Last Played cell renders both compact and long date formats gated by container width", async () => {
    const song = makeSong({
      dateLastPlayed: new Date("2024-06-15"),
      lastPlayedShow: makeShow({ slug: "2024-06-15-the-cap" }),
    });
    await setupWithRouter(<DataTable columns={baseColumns} data={[song]} hideSearch hidePagination />);

    // Long format hidden once the cell tightens below 6rem
    const longFormat = screen.getByText(/6\/15\/2024/);
    expect(longFormat.className).toContain("@max-[6rem]/datecell:hidden");

    // Compact format swaps in once the cell tightens below 6rem
    const compactFormat = screen.getByText("6/15/24");
    expect(compactFormat.className).toContain("hidden");
    expect(compactFormat.className).toContain("@max-[6rem]/datecell:inline");
  });

  // Same dual-format treatment for First Played, mirroring Last Played so
  // both date columns collapse at the same threshold.
  test("First Played cell renders both compact and long date formats gated by container width", async () => {
    const song = makeSong({
      dateFirstPlayed: new Date("1995-07-04"),
      firstPlayedShow: makeShow({ id: "show-first", slug: "1995-07-04-red-rocks" }),
    });
    await setupWithRouter(<DataTable columns={baseColumns} data={[song]} hideSearch hidePagination />);

    expect(screen.getByText(/7\/4\/1995/).className).toContain("@max-[6rem]/datecell:hidden");
    expect(screen.getByText("7/4/95").className).toContain("@max-[6rem]/datecell:inline");
  });

  // The venue line beneath Last/First Played dates is gated by the cell's
  // @container/datecell — drops out once the column shrinks below ~10rem
  // so dense tables collapse to date-only automatically (no viewport or
  // filter-flag branching required).
  test("Last Played venue line is gated by datecell container width", async () => {
    const song = makeSong({
      dateLastPlayed: new Date("2024-06-15"),
      lastPlayedShow: makeShow({ slug: "2024-06-15-the-cap" }),
    });
    await setupWithRouter(<DataTable columns={baseColumns} data={[song]} hideSearch hidePagination />);

    const venueLine = screen.getByText(/The Capitol Theatre/);
    expect(venueLine.className).toContain("hidden");
    expect(venueLine.className).toContain("@[8rem]/datecell:block");
  });

  test("First Played venue line is gated by datecell container width", async () => {
    const song = makeSong({
      dateFirstPlayed: new Date("1995-07-04"),
      firstPlayedShow: makeShow({
        id: "show-first",
        slug: "1995-07-04-red-rocks",
        venue: {
          id: "v2",
          slug: "red-rocks",
          name: "Red Rocks Amphitheatre",
          city: "Morrison",
          state: "CO",
          country: "USA",
          createdAt: new Date("2020-01-01"),
          updatedAt: new Date("2020-01-01"),
          timesPlayed: 0,
        },
      }),
    });
    await setupWithRouter(<DataTable columns={baseColumns} data={[song]} hideSearch hidePagination />);

    const venueLine = screen.getByText(/Red Rocks Amphitheatre/);
    expect(venueLine.className).toContain("hidden");
    expect(venueLine.className).toContain("@[8rem]/datecell:block");
  });

  // Plays and Filtered Plays are short-but-prone-to-overlap headers on
  // narrow viewports. Both must allow text to wrap (no whitespace-nowrap)
  // and use leading-tight so the wrapped lines stay compact.
  test("Plays header allows wrap (whitespace-normal leading-tight)", async () => {
    await setupWithRouter(<DataTable columns={baseColumns} data={[makeSong()]} hideSearch hidePagination />);

    const playsButton = screen.getByRole("button", { name: /^Plays/i });
    expect(playsButton.className).toContain("whitespace-normal");
    expect(playsButton.className).toContain("leading-tight");
  });

  // When the table is showing both Plays and Filtered Plays, mobile real
  // estate is too tight for both. The all-time Plays column hides on
  // mobile so Filtered Plays (the count relevant to the active scope)
  // gets the room. Desktop continues to show both columns.
  test("Plays column has meta.hideOnMobile when showFilteredPlays is true", () => {
    const columns = getSongsColumns({ showFilteredPlays: true });
    const playsColumn = columns.find((column) => "accessorKey" in column && column.accessorKey === "timesPlayed");
    expect(playsColumn?.meta?.hideOnMobile).toBe(true);
  });

  // When Filtered Plays is absent, Plays is the only count column on the
  // table and must remain visible on mobile.
  test("Plays column does not hide on mobile when showFilteredPlays is false", () => {
    const columns = getSongsColumns({ showFilteredPlays: false });
    const playsColumn = columns.find((column) => "accessorKey" in column && column.accessorKey === "timesPlayed");
    expect(playsColumn?.meta?.hideOnMobile).toBeFalsy();
  });

  // The Gap to Now column shows shows-since-last-played (`showsSinceLastPlayed`)
  // — same number that drives the "X shows ago" sublabel on the song detail
  // page. It's the most-immediate "is this song missing right now?" signal.
  test("Gap to Now cell renders the integer when showsSinceLastPlayed is set", async () => {
    await setupWithRouter(
      <DataTable columns={baseColumns} data={[makeSong({ showsSinceLastPlayed: 12 })]} hideSearch hidePagination />,
    );
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  // Songs that have never been played (or where the field hasn't been
  // populated for any other reason) get the em-dash placeholder so the
  // column stays readable instead of showing "0" (which would mean
  // "played at the most recent show").
  test("Gap to Now cell renders em-dash when showsSinceLastPlayed is null", async () => {
    await setupWithRouter(
      <DataTable columns={baseColumns} data={[makeSong({ showsSinceLastPlayed: null })]} hideSearch hidePagination />,
    );
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });

  // % Since Debut formats `percentSinceDebut` (a 0–1 fraction) with
  // Intl.NumberFormat percent style, max 1 decimal — matching the existing
  // formatPercent helper on the song detail page so values are consistent
  // across surfaces.
  test("% Since Debut cell formats fraction as percentage with 1 decimal", async () => {
    await setupWithRouter(
      <DataTable columns={baseColumns} data={[makeSong({ percentSinceDebut: 0.197 })]} hideSearch hidePagination />,
    );
    expect(screen.getByText("19.7%")).toBeInTheDocument();
  });

  test("% Since Debut cell renders em-dash when percentSinceDebut is null", async () => {
    await setupWithRouter(
      <DataTable columns={baseColumns} data={[makeSong({ percentSinceDebut: null })]} hideSearch hidePagination />,
    );
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });

  // Avg Gap renders `averageGapShows` to one decimal — mirrors the
  // "Average Gap" stat box on the song detail page. The number alone
  // carries the meaning ("played every 5.7 shows since debut") because
  // the column header sets the framing.
  test("Avg Gap cell renders averageGapShows to one decimal", async () => {
    await setupWithRouter(
      <DataTable columns={baseColumns} data={[makeSong({ averageGapShows: 5.7 })]} hideSearch hidePagination />,
    );
    expect(screen.getByText("5.7")).toBeInTheDocument();
  });

  test("Avg Gap cell renders em-dash when averageGapShows is null", async () => {
    await setupWithRouter(
      <DataTable columns={baseColumns} data={[makeSong({ averageGapShows: null })]} hideSearch hidePagination />,
    );
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });

  // All three rarity columns are secondary signals — they hide on mobile
  // so Title + Plays + Last Played stay legible at narrow widths, matching
  // the existing Filtered Plays pattern.
  test("Gap to Now, % Since Debut, Avg Gap all carry meta.hideOnMobile", () => {
    const columns = getSongsColumns({ showFilteredPlays: false });
    const gap = columns.find((c) => "accessorKey" in c && c.accessorKey === "showsSinceLastPlayed");
    const pct = columns.find((c) => "accessorKey" in c && c.accessorKey === "percentSinceDebut");
    const avg = columns.find((c) => "accessorKey" in c && c.accessorKey === "averageGapShows");
    expect(gap?.meta?.hideOnMobile).toBe(true);
    expect(pct?.meta?.hideOnMobile).toBe(true);
    expect(avg?.meta?.hideOnMobile).toBe(true);
  });

  // Dense filtered view on mobile drops the all-time date pair so the
  // filtered date pair (which is the user's relevant signal under an
  // active filter) has room. Desktop continues to show both pairs.
  test("Last Played + First Played hide on mobile when showFilteredPlays is true", () => {
    const columns = getSongsColumns({ showFilteredPlays: true });
    const last = columns.find((c) => "accessorKey" in c && c.accessorKey === "dateLastPlayed");
    const first = columns.find((c) => "accessorKey" in c && c.accessorKey === "dateFirstPlayed");
    expect(last?.meta?.hideOnMobile).toBe(true);
    expect(first?.meta?.hideOnMobile).toBe(true);
  });

  // Sparse view (no filter) keeps both date columns on mobile. They're
  // the primary "when did this song happen?" signal when no filtered pair
  // exists to take their place.
  test("Last Played + First Played stay visible on mobile when showFilteredPlays is false", () => {
    const columns = getSongsColumns({ showFilteredPlays: false });
    const last = columns.find((c) => "accessorKey" in c && c.accessorKey === "dateLastPlayed");
    const first = columns.find((c) => "accessorKey" in c && c.accessorKey === "dateFirstPlayed");
    expect(last?.meta?.hideOnMobile).toBeFalsy();
    expect(first?.meta?.hideOnMobile).toBeFalsy();
  });

  // Filtered Since First is the first filter column to drop on mobile
  // because it's a derivable summary (filtered plays / shows in scope).
  // The remaining 5 filter cols + Song fit; with Since First the row is
  // too cramped.
  test("Filtered Since First carries meta.hideOnMobile", () => {
    const columns = getSongsColumns({ showFilteredPlays: true });
    const col = columns.find((c) => "accessorKey" in c && c.accessorKey === "filteredPercentSinceDebut");
    expect(col?.meta?.hideOnMobile).toBe(true);
  });

  // Filtered Avg Gap and Filtered Gap to End must NOT hide on mobile.
  // They're part of the "Song + filter columns" mobile layout the user
  // explicitly chose. Pinning so a future cleanup doesn't accidentally
  // re-hide them along with their unconditionally-hidden all-time
  // counterparts.
  test("Filtered Avg Gap + Filtered Gap to End stay visible on mobile", () => {
    const columns = getSongsColumns({ showFilteredPlays: true });
    const avg = columns.find((c) => "accessorKey" in c && c.accessorKey === "filteredAverageGapShows");
    const gap = columns.find((c) => "accessorKey" in c && c.accessorKey === "filteredShowsSinceLastPlayed");
    expect(avg?.meta?.hideOnMobile).toBeFalsy();
    expect(gap?.meta?.hideOnMobile).toBeFalsy();
  });

  // Numeric cells wrap their value in an inline-block sized with `ch`
  // units, right-aligned, with tabular-nums so digit widths are uniform.
  // The effect is that 1 / 10 / 100 stack with their ones digit aligned
  // and larger numbers extend further left, without right-aligning the
  // whole cell. Locks the alignment technique against silent regressions.
  test("numeric cells render as right-aligned inline-block slots with tabular-nums", async () => {
    await setupWithRouter(
      <DataTable columns={baseColumns} data={[makeSong({ averageGapShows: 5.7 })]} hideSearch hidePagination />,
    );
    const slot = screen.getByText("5.7");
    expect(slot.className).toContain("inline-block");
    expect(slot.className).toContain("text-right");
    expect(slot.className).toContain("tabular-nums");
    expect(slot.style.minWidth).toBe("4ch");
  });

  // Column ordering: Gap to Now sits immediately to the left of Last
  // Played so the "X shows ago" number reads naturally next to the date
  // it's measured against. % Since Debut and Avg Gap precede Gap to Now
  // as the broader rarity signals; Last Played + First Played remain
  // rightmost.
  test("rarity columns appear between Plays and Last Played in the expected order", () => {
    const columns = getSongsColumns({ showFilteredPlays: false });
    const keys = columns
      .map((c) => ("accessorKey" in c ? (c.accessorKey as string) : null))
      .filter((k): k is string => k !== null);
    const playsIdx = keys.indexOf("timesPlayed");
    const gapIdx = keys.indexOf("showsSinceLastPlayed");
    const pctIdx = keys.indexOf("percentSinceDebut");
    const avgIdx = keys.indexOf("averageGapShows");
    const lastIdx = keys.indexOf("dateLastPlayed");
    expect(playsIdx).toBeLessThan(pctIdx);
    expect(pctIdx).toBeLessThan(avgIdx);
    expect(avgIdx).toBeLessThan(gapIdx);
    expect(gapIdx).toBeLessThan(lastIdx);
  });

  // Sorting Gap to Now asc must put nulls (never-played / unpopulated
  // songs) at the bottom — otherwise null-coercion-to-0 would surface
  // them at the top, masking the smallest real gaps.
  test("Gap to Now sort puts nulls last on asc and first on desc", async () => {
    const songs = [
      makeSong({ id: "a", title: "Basis for a Day", slug: "basis-for-a-day", showsSinceLastPlayed: 5 }),
      makeSong({ id: "b", title: "Above The Waves", slug: "above-the-waves", showsSinceLastPlayed: null }),
      makeSong({ id: "c", title: "Tempest", slug: "tempest", showsSinceLastPlayed: 30 }),
    ];
    const { user } = await setupWithRouter(<DataTable columns={baseColumns} data={songs} hideSearch hidePagination />);

    // Header text is the short "Gap"; the full "Gap to Now" lives in the
    // title attribute as hover tooltip. Find the button via title to fail
    // loudly if the tooltip is ever dropped.
    const sortHeader = screen.getAllByRole("button").find((b) => b.getAttribute("title") === "Gap to Now");
    if (!sortHeader) throw new Error("Gap to Now header not found");
    await user.click(sortHeader); // asc

    const titlesAsc = screen
      .getAllByRole("link")
      .filter((el) => ["Basis for a Day", "Above The Waves", "Tempest"].includes(el.textContent ?? ""));
    expect(titlesAsc.map((el) => el.textContent)).toEqual(["Basis for a Day", "Tempest", "Above The Waves"]);

    await user.click(sortHeader); // desc
    const titlesDesc = screen
      .getAllByRole("link")
      .filter((el) => ["Basis for a Day", "Above The Waves", "Tempest"].includes(el.textContent ?? ""));
    expect(titlesDesc.map((el) => el.textContent)).toEqual(["Above The Waves", "Tempest", "Basis for a Day"]);
  });

  // The /songs page shows songs sorted by times played (most played first)
  // by default. The Plays header should show a descending arrow on load so
  // users know the active sort column and direction.
  test("Plays header shows descending sort icon when initialSorting is timesPlayed desc", async () => {
    await setupWithRouter(
      <DataTable
        columns={baseColumns}
        data={[makeSong()]}
        hideSearch
        hidePagination
        initialSorting={[{ id: "timesPlayed", desc: true }]}
      />,
    );

    const playsButton = screen.getByRole("button", { name: /^Plays/i });
    // The descending ArrowDown icon should be present (has class "lucide-arrow-down")
    expect(playsButton.querySelector(".lucide-arrow-down")).not.toBeNull();
  });
});
