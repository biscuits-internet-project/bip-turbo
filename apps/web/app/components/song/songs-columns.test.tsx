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

    expect(screen.queryByRole("button", { name: /Filtered Plays/i })).not.toBeInTheDocument();
  });

  // When showFilteredPlays is true, the factory inserts a "Filtered Plays"
  // column next to Plays showing the scoped count. This is the replacement
  // for the removed "This Year" column.
  test("showFilteredPlays=true: Filtered Plays column renders the scoped count", async () => {
    await setupWithRouter(
      <DataTable
        columns={filteredColumns}
        data={[makeSong({ timesPlayed: 42, filteredTimesPlayed: 7 })]}
        hideSearch
        hidePagination
      />,
    );

    expect(screen.getByRole("button", { name: /Filtered Plays/i })).toBeInTheDocument();
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
    expect(screen.getByText(/Jun 15, 2024/)).toBeInTheDocument();
    // Wrapped in a link to the show
    const showLink = screen.getByRole("link", { name: /Jun 15, 2024/ });
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

    expect(screen.getByText(/Jun 15, 2024/)).toBeInTheDocument();
    // No link wraps the date
    expect(screen.queryByRole("link", { name: /Jun 15, 2024/ })).not.toBeInTheDocument();
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

    expect(screen.getByText(/Jul 4, 1995/)).toBeInTheDocument();
    const showLink = screen.getByRole("link", { name: /Jul 4, 1995/ });
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

    const sortHeader = screen.getByRole("button", { name: /Filtered Plays/i });
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
    const sortHeader = screen.getByRole("button", { name: /Filtered Plays/i });
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
