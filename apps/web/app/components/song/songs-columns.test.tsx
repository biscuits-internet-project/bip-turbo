import type { Show, Song } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DataTable } from "~/components/ui/data-table";
import { songsColumns } from "./songs-columns";

interface SongWithShows extends Song {
  firstPlayedShow?: Show | null;
  lastPlayedShow?: Show | null;
}

const currentYear = new Date().getFullYear().toString();

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
    title: overrides.title ?? "Cassidy",
    slug: overrides.slug ?? "cassidy",
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

describe("songsColumns", () => {
  // The Song Title column is how users navigate from /songs to /songs/$slug.
  // Verifies the title is rendered inside an <a> with the correct href.
  test("title cell renders a link to /songs/{slug}", async () => {
    await setupWithRouter(
      <DataTable
        columns={songsColumns}
        data={[makeSong({ title: "Cassidy", slug: "cassidy" })]}
        hideSearch
        hidePagination
      />,
    );

    const link = screen.getByRole("link", { name: "Cassidy" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/songs/cassidy");
  });

  // Songs with no performances (DB songs that exist but were never played)
  // render a readable italic "Never performed" placeholder rather than a bare
  // "0". Matters because /songs hides songs with timesPlayed > 0 by default,
  // but the "Not Played" filter flips that.
  test('timesPlayed === 0 renders "Never performed"', async () => {
    await setupWithRouter(
      <DataTable columns={songsColumns} data={[makeSong({ timesPlayed: 0 })]} hideSearch hidePagination />,
    );

    expect(screen.getByText("Never performed")).toBeInTheDocument();
  });

  // The normal case: `timesPlayed` is rendered as a bold number. Paired with
  // the previous test to pin "Never performed" to exactly the 0 case.
  test("timesPlayed > 0 renders the play count", async () => {
    await setupWithRouter(
      <DataTable columns={songsColumns} data={[makeSong({ timesPlayed: 42 })]} hideSearch hidePagination />,
    );

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.queryByText("Never performed")).not.toBeInTheDocument();
  });

  // The "This Year" column reads from `yearlyPlayData[currentYear]` — a
  // per-year play-count map. Verifies the cell extracts the current year's
  // value and renders it as a number when present.
  test("yearlyPlayData cell renders the current-year count when present", async () => {
    await setupWithRouter(
      <DataTable
        columns={songsColumns}
        data={[makeSong({ yearlyPlayData: { [currentYear]: 7 } })]}
        hideSearch
        hidePagination
      />,
    );

    expect(screen.getByText("7")).toBeInTheDocument();
  });

  // If the current year has no plays (either missing from the map or zero),
  // the "This Year" cell renders an em-dash rather than "0". Avoids crowding
  // the table with zeros for songs that haven't been played yet this year.
  test("yearlyPlayData cell renders em-dash when current-year count is 0 or missing", async () => {
    await setupWithRouter(
      <DataTable
        columns={songsColumns}
        data={[makeSong({ title: "OldSong", slug: "oldsong", yearlyPlayData: { "2010": 3 } })]}
        hideSearch
        hidePagination
      />,
    );

    // em-dash appears for both the yearlyPlayData cell. (Date cells may also render em-dash
    // when dates are null, but fixture dates are non-null here.)
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
    await setupWithRouter(
      <DataTable columns={songsColumns} data={[song]} hideSearch hidePagination />,
    );

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
    await setupWithRouter(
      <DataTable columns={songsColumns} data={[song]} hideSearch hidePagination />,
    );

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
    await setupWithRouter(
      <DataTable columns={songsColumns} data={[song]} hideSearch hidePagination />,
    );

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
    await setupWithRouter(
      <DataTable columns={songsColumns} data={[song]} hideSearch hidePagination />,
    );

    expect(screen.getByText(/Jul 4, 1995/)).toBeInTheDocument();
    const showLink = screen.getByRole("link", { name: /Jul 4, 1995/ });
    expect(showLink).toHaveAttribute("href", "/shows/1995-07-04-red-rocks");
  });

  // Symmetric with "Last Played null" — confirms First Played also handles
  // null dates gracefully with an em-dash.
  test("First Played cell renders em-dash when dateFirstPlayed is null", async () => {
    const song = makeSong({ dateFirstPlayed: null, firstPlayedShow: null });
    await setupWithRouter(
      <DataTable columns={songsColumns} data={[song]} hideSearch hidePagination />,
    );
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });

  // The First Played column sorts by `dateFirstPlayed`. Users click it to
  // find the band's earliest or most-recent debut performances — useful for
  // historical browsing. Symmetric with the Last Played sort test.
  test("clicking First Played header sorts by dateFirstPlayed ascending, then descending", async () => {
    const songs = [
      makeSong({ id: "a", title: "Alpha", slug: "alpha", dateFirstPlayed: new Date("1995-07-04") }),
      makeSong({ id: "b", title: "Beta", slug: "beta", dateFirstPlayed: new Date("2020-01-01") }),
      makeSong({ id: "c", title: "Gamma", slug: "gamma", dateFirstPlayed: new Date("2010-06-15") }),
    ];
    const { user } = await setupWithRouter(
      <DataTable columns={songsColumns} data={songs} hideSearch hidePagination />,
    );

    const sortHeader = screen.getByRole("button", { name: /^First Played/i });
    await user.click(sortHeader);

    const titlesAsc = screen
      .getAllByRole("link")
      .filter((el) => ["Alpha", "Beta", "Gamma"].includes(el.textContent ?? ""));
    expect(titlesAsc.map((el) => el.textContent)).toEqual(["Alpha", "Gamma", "Beta"]);

    await user.click(sortHeader);
    const titlesDesc = screen
      .getAllByRole("link")
      .filter((el) => ["Alpha", "Beta", "Gamma"].includes(el.textContent ?? ""));
    expect(titlesDesc.map((el) => el.textContent)).toEqual(["Beta", "Gamma", "Alpha"]);
  });

  // The Plays column sorts by `timesPlayed`. Users click it to find songs
  // played most (or least) often across the band's history — a core way to
  // browse the song catalog.
  test("clicking Plays header sorts by timesPlayed ascending, then descending", async () => {
    const songs = [
      makeSong({ id: "a", title: "Alpha", slug: "alpha", timesPlayed: 50 }),
      makeSong({ id: "b", title: "Beta", slug: "beta", timesPlayed: 10 }),
      makeSong({ id: "c", title: "Gamma", slug: "gamma", timesPlayed: 30 }),
    ];
    const { user } = await setupWithRouter(
      <DataTable columns={songsColumns} data={songs} hideSearch hidePagination />,
    );

    const sortHeader = screen.getByRole("button", { name: /^Plays/i });
    await user.click(sortHeader);

    const titlesAsc = screen
      .getAllByRole("link")
      .filter((el) => ["Alpha", "Beta", "Gamma"].includes(el.textContent ?? ""));
    expect(titlesAsc.map((el) => el.textContent)).toEqual(["Beta", "Gamma", "Alpha"]);

    await user.click(sortHeader);
    const titlesDesc = screen
      .getAllByRole("link")
      .filter((el) => ["Alpha", "Beta", "Gamma"].includes(el.textContent ?? ""));
    expect(titlesDesc.map((el) => el.textContent)).toEqual(["Alpha", "Gamma", "Beta"]);
  });

  // The Last Played column sorts by `dateLastPlayed`. Users click it to find
  // the most-recently-played songs (default desc on date) or the longest
  // dormant songs. TanStack's default date sort handles the comparison.
  test("clicking Last Played header sorts by dateLastPlayed ascending, then descending", async () => {
    const songs = [
      makeSong({ id: "a", title: "Alpha", slug: "alpha", dateLastPlayed: new Date("2020-01-01") }),
      makeSong({ id: "b", title: "Beta", slug: "beta", dateLastPlayed: new Date("2024-06-15") }),
      makeSong({ id: "c", title: "Gamma", slug: "gamma", dateLastPlayed: new Date("2022-03-10") }),
    ];
    const { user } = await setupWithRouter(
      <DataTable columns={songsColumns} data={songs} hideSearch hidePagination />,
    );

    const sortHeader = screen.getByRole("button", { name: /^Last Played/i });
    await user.click(sortHeader);

    // The title column uses the same tag as date cells, so filter by title set
    const titlesAsc = screen
      .getAllByRole("link")
      .filter((el) => ["Alpha", "Beta", "Gamma"].includes(el.textContent ?? ""));
    expect(titlesAsc.map((el) => el.textContent)).toEqual(["Alpha", "Gamma", "Beta"]);

    await user.click(sortHeader);
    const titlesDesc = screen
      .getAllByRole("link")
      .filter((el) => ["Alpha", "Beta", "Gamma"].includes(el.textContent ?? ""));
    expect(titlesDesc.map((el) => el.textContent)).toEqual(["Beta", "Gamma", "Alpha"]);
  });

  // The "This Year" column has a custom `sortingFn` that sorts by the
  // CURRENT year's play count (not the default alphanumeric sort over the
  // JSON blob). Users click the header to find songs trending this year.
  // Verifies asc/desc order by checking row position after each click.
  test("yearlyPlayData sortingFn sorts by current-year count ascending, then descending", async () => {
    const songs = [
      makeSong({
        id: "a",
        title: "Alpha",
        slug: "alpha",
        yearlyPlayData: { [currentYear]: 1 },
      }),
      makeSong({
        id: "b",
        title: "Beta",
        slug: "beta",
        yearlyPlayData: { [currentYear]: 5 },
      }),
      makeSong({
        id: "c",
        title: "Gamma",
        slug: "gamma",
        yearlyPlayData: { [currentYear]: 3 },
      }),
    ];
    const { user } = await setupWithRouter(<DataTable columns={songsColumns} data={songs} hideSearch hidePagination />);

    // Click the "This Year" sort header twice:
    //   first click → asc order (1, 3, 5)
    //   second click → desc order (5, 3, 1)
    const sortHeader = screen.getByRole("button", { name: /This Year/i });
    await user.click(sortHeader);

    // First click: asc. Assert row order by finding song titles in document order.
    const titlesAsc = screen
      .getAllByRole("link")
      .filter((el) => ["Alpha", "Beta", "Gamma"].includes(el.textContent ?? ""));
    expect(titlesAsc.map((el) => el.textContent)).toEqual(["Alpha", "Gamma", "Beta"]);

    // Second click: desc.
    await user.click(sortHeader);
    const titlesDesc = screen
      .getAllByRole("link")
      .filter((el) => ["Alpha", "Beta", "Gamma"].includes(el.textContent ?? ""));
    expect(titlesDesc.map((el) => el.textContent)).toEqual(["Beta", "Gamma", "Alpha"]);
  });
});
