import { describe, expect, test, vi } from "vitest";
import { SongService } from "./song-service";

// Minimal logger stub — song-service only calls these methods on logger
const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

type MockTrack = {
  id: string;
  songId: string;
  showId: string;
  position: number;
  show: { id: string; date: string; dayOrder: number | null; countForStats: boolean };
};

type MockShow = { date: string };

function makeMockDb(opts: { tracks: MockTrack[]; statsShows: MockShow[] }) {
  return {
    track: {
      findMany: vi.fn().mockResolvedValue(opts.tracks),
      update: vi.fn().mockResolvedValue({}),
    },
    song: {
      update: vi.fn().mockResolvedValue({}),
    },
    show: {
      // Service queries with `where: { countForStats: true }` to compute the
      // "shows between" denominator. Tests mock this to return only the
      // count_for_stats=true shows.
      findMany: vi.fn().mockResolvedValue(opts.statsShows),
    },
  };
}

/**
 * Capture every gap+previousPerformanceShowId write produced by
 * updateSongStatistics into a `{trackId: {gap, previousPerformanceShowId}}` map
 * so individual test assertions stay readable.
 */
function capturedTrackUpdates(db: ReturnType<typeof makeMockDb>) {
  const out: Record<string, { gap: number | null; previousPerformanceShowId: string | null }> = {};
  for (const call of db.track.update.mock.calls) {
    const [{ where, data }] = call;
    out[where.id] = {
      gap: data.gap ?? null,
      previousPerformanceShowId: data.previousPerformanceShowId ?? null,
    };
  }
  return out;
}

/** Convenience builder for the show object on a mock track. */
function show(id: string, date: string, opts: { dayOrder?: number | null; countForStats?: boolean } = {}) {
  return {
    id,
    date,
    dayOrder: opts.dayOrder ?? null,
    countForStats: opts.countForStats ?? true,
  };
}

// A raw song row as Prisma returns it with the songAuthors include.
function songRow(
  songAuthors: Array<{
    position: number;
    author: { id: string; name: string; slug: string; musicians: { slug: string }[] };
  }>,
) {
  return {
    id: "song-1",
    title: "Tourists",
    slug: "tourists",
    kind: "original",
    lyrics: null,
    tabs: null,
    notes: null,
    history: null,
    featuredLyric: null,
    timesPlayed: 0,
    guitarTabsUrl: null,
    dateLastPlayed: null,
    dateFirstPlayed: null,
    mostCommonYear: null,
    createdAt: new Date("2020-01-01"),
    updatedAt: new Date("2020-01-01"),
    yearlyPlayData: {},
    longestGapsData: {},
    songAuthors,
  };
}

describe("SongService — multiple authors", () => {
  // findBySlug must return authors ordered by position, derive the comma-joined
  // authorName, and surface each author's linked-musician slug (null when none).
  test("findBySlug maps ordered authors, joined authorName, and musician slugs", async () => {
    const db = {
      song: {
        findUnique: vi.fn().mockResolvedValue(
          // Deliberately out of position order to prove the mapper sorts.
          songRow([
            { position: 1, author: { id: "a-2", name: "Marc Brownstein", slug: "marc-brownstein", musicians: [] } },
            {
              position: 0,
              author: {
                id: "a-1",
                name: "Jon Gutwillig",
                slug: "jon-gutwillig",
                musicians: [{ slug: "jon-gutwillig" }],
              },
            },
          ]),
        ),
      },
    };
    const service = new SongService(db as never, logger);

    const song = await service.findBySlug("tourists");

    expect(song?.authors.map((a) => a.name)).toEqual(["Jon Gutwillig", "Marc Brownstein"]);
    expect(song?.authors.map((a) => a.musicianSlug)).toEqual(["jon-gutwillig", null]);
    expect(song?.authorName).toBe("Jon Gutwillig, Marc Brownstein");
  });

  // create writes one song_authors row per id, position = array index.
  test("create writes ordered song_authors join rows", async () => {
    let captured: { songAuthors?: { create: Array<{ authorId: string; position: number }> } } | undefined;
    const db = {
      song: {
        create: vi.fn().mockImplementation(async ({ data }) => {
          captured = data;
          return songRow([]);
        }),
      },
    };
    const service = new SongService(db as never, logger);

    await service.create({ title: "Tourists", authorIds: ["a-1", "a-2"] });

    expect(captured?.songAuthors?.create).toEqual([
      { authorId: "a-1", position: 0 },
      { authorId: "a-2", position: 1 },
    ]);
  });

  // update replaces the whole author set when authorIds is provided.
  test("update replaces the author set (deleteMany + ordered create)", async () => {
    let captured:
      | { songAuthors?: { deleteMany: object; create: Array<{ authorId: string; position: number }> } }
      | undefined;
    const db = {
      song: {
        update: vi.fn().mockImplementation(async ({ data }) => {
          captured = data;
          return songRow([]);
        }),
      },
    };
    const service = new SongService(db as never, logger);

    await service.update("tourists", { authorIds: ["a-3"] });

    expect(captured?.songAuthors?.deleteMany).toEqual({});
    expect(captured?.songAuthors?.create).toEqual([{ authorId: "a-3", position: 0 }]);
  });

  // Omitting authorIds leaves the existing authors untouched (no songAuthors write).
  test("update without authorIds does not touch the author set", async () => {
    let captured: { songAuthors?: unknown } | undefined;
    const db = {
      song: {
        update: vi.fn().mockImplementation(async ({ data }) => {
          captured = data;
          return songRow([]);
        }),
      },
    };
    const service = new SongService(db as never, logger);

    await service.update("tourists", { notes: "updated" });

    expect(captured?.songAuthors).toBeUndefined();
  });
});

describe("SongService.updateSongStatistics — gap denormalization", () => {
  // A song's first-ever performance has no prior occurrence, so gap is NULL
  // (renders as "Debut") and previousPerformanceShowId is NULL.
  test("debut: single track gets gap=null and previousPerformanceShowId=null", async () => {
    const db = makeMockDb({
      tracks: [
        { id: "track-1", songId: "song-basis", showId: "show-A", position: 1, show: show("show-A", "1998-04-15") },
      ],
      statsShows: [{ date: "1998-04-15" }],
    });
    const service = new SongService(db as never, logger);

    await service.updateSongStatistics("song-basis");

    expect(capturedTrackUpdates(db)).toEqual({
      "track-1": { gap: null, previousPerformanceShowId: null },
    });
  });

  // Two consecutive shows with no other shows in between → gap=0 on the
  // second performance. previousPerformanceShowId points at the first show.
  test("back-to-back: gap=0 when song was played at the immediately previous show", async () => {
    const db = makeMockDb({
      tracks: [
        { id: "track-1", songId: "song-munchkin", showId: "show-A", position: 1, show: show("show-A", "2001-06-01") },
        { id: "track-2", songId: "song-munchkin", showId: "show-B", position: 1, show: show("show-B", "2001-06-02") },
      ],
      statsShows: [{ date: "2001-06-01" }, { date: "2001-06-02" }],
    });
    const service = new SongService(db as never, logger);

    await service.updateSongStatistics("song-munchkin");

    expect(capturedTrackUpdates(db)).toEqual({
      "track-1": { gap: null, previousPerformanceShowId: null },
      "track-2": { gap: 0, previousPerformanceShowId: "show-A" },
    });
  });

  // Three unrelated shows sit between the two performances of Spaga.
  // gap should equal the count of shows strictly between (exclusive bounds).
  test("N shows between: gap counts shows strictly between performances", async () => {
    const db = makeMockDb({
      tracks: [
        { id: "track-1", songId: "song-spaga", showId: "show-A", position: 2, show: show("show-A", "2003-10-10") },
        { id: "track-2", songId: "song-spaga", showId: "show-E", position: 5, show: show("show-E", "2003-10-20") },
      ],
      statsShows: [
        { date: "2003-10-10" }, // show A — bound, excluded
        { date: "2003-10-12" }, // unrelated
        { date: "2003-10-15" }, // unrelated
        { date: "2003-10-18" }, // unrelated
        { date: "2003-10-20" }, // show E — bound, excluded
      ],
    });
    const service = new SongService(db as never, logger);

    await service.updateSongStatistics("song-spaga");

    expect(capturedTrackUpdates(db)).toEqual({
      "track-1": { gap: null, previousPerformanceShowId: null },
      "track-2": { gap: 3, previousPerformanceShowId: "show-A" },
    });
  });

  // When a song is played twice in the same show, both tracks share the
  // gap+prevShowId computed against the song's prior *show*, not against
  // the earlier track in this show. The "this show" repeat marker is a
  // render-time concern (computed from the loaded setlist).
  test("within-show repeat: both tracks share gap and previousPerformanceShowId from the prior show", async () => {
    const db = makeMockDb({
      tracks: [
        { id: "track-1", songId: "song-mrdon", showId: "show-A", position: 1, show: show("show-A", "2005-02-01") },
        // Two tracks of Mr. Don in show B — both are "new show" relative to A
        { id: "track-2a", songId: "song-mrdon", showId: "show-B", position: 3, show: show("show-B", "2005-02-05") },
        { id: "track-2b", songId: "song-mrdon", showId: "show-B", position: 8, show: show("show-B", "2005-02-05") },
      ],
      statsShows: [
        { date: "2005-02-01" },
        { date: "2005-02-03" }, // unrelated → between A and B
        { date: "2005-02-05" },
      ],
    });
    const service = new SongService(db as never, logger);

    await service.updateSongStatistics("song-mrdon");

    expect(capturedTrackUpdates(db)).toEqual({
      "track-1": { gap: null, previousPerformanceShowId: null },
      "track-2a": { gap: 1, previousPerformanceShowId: "show-A" },
      "track-2b": { gap: 1, previousPerformanceShowId: "show-A" },
    });
  });

  // A song with no tracks at all (e.g., after all its tracks were deleted)
  // should reset song stats and not attempt any track.update calls.
  test("no tracks: resets song stats and writes no track gap rows", async () => {
    const db = makeMockDb({ tracks: [], statsShows: [] });
    const service = new SongService(db as never, logger);

    await service.updateSongStatistics("song-crystalball");

    expect(db.track.update).not.toHaveBeenCalled();
    expect(db.song.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "song-crystalball" },
        data: expect.objectContaining({
          timesPlayed: 0,
          dateFirstPlayed: null,
          dateLastPlayed: null,
        }),
      }),
    );
  });

  // Tracks on a count_for_stats=false show (soundcheck, radio session,
  // cancelled stub, late-night Tractorbeam set) DO get a gap value — it
  // points back at the most recent count_for_stats=true performance, so a
  // user viewing the soundcheck setlist sees "this song was last really
  // played N stats-shows ago at show X". But the soundcheck itself is
  // never POINTED AT by a later stats-show — the next stats-performance
  // walks back past it to the prior stats-show. timesPlayed and the other
  // song-level stats still exclude these shows.
  test("count_for_stats=false: track points at prior stats-show; never pointed at", async () => {
    const db = makeMockDb({
      tracks: [
        { id: "track-A", songId: "song-shem", showId: "show-A", position: 1, show: show("show-A", "2010-06-01") },
        // Soundcheck at show-SC. Should point at show-A (the prior real
        // performance), but not advance the lastShow tracker.
        {
          id: "track-SC",
          songId: "song-shem",
          showId: "show-SC",
          position: 1,
          show: show("show-SC", "2010-06-10", { countForStats: false }),
        },
        // show-B is the next real performance. Its prev should still be
        // show-A (not show-SC), and gap is the count of stats-shows
        // strictly between A and B (zero — SC doesn't count).
        { id: "track-B", songId: "song-shem", showId: "show-B", position: 1, show: show("show-B", "2010-06-15") },
      ],
      // Only count_for_stats=true shows in the denominator.
      statsShows: [{ date: "2010-06-01" }, { date: "2010-06-15" }],
    });
    const service = new SongService(db as never, logger);

    await service.updateSongStatistics("song-shem");

    expect(capturedTrackUpdates(db)).toEqual({
      "track-A": { gap: null, previousPerformanceShowId: null },
      // SC points at A; no stats-shows between 2010-06-01 and 2010-06-10.
      "track-SC": { gap: 0, previousPerformanceShowId: "show-A" },
      // B walks back to A (skipping SC); no stats-shows between A and B.
      "track-B": { gap: 0, previousPerformanceShowId: "show-A" },
    });
    // timesPlayed = 2 (A + B). The soundcheck doesn't count.
    expect(db.song.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ timesPlayed: 2 }),
      }),
    );
  });

  // When two shows share a date, dayOrder determines which is "first" for
  // gap purposes. The mock service receives tracks pre-sorted by Prisma's
  // (date, dayOrder, position, id) ORDER BY, so the test mimics that.
  test("same-date pair: dayOrder=1 is treated as the earlier show", async () => {
    const db = makeMockDb({
      tracks: [
        // Earlier show on 2010-03-26 (Bicentennial Park, day_order=1)
        {
          id: "track-1",
          songId: "song-helicopters",
          showId: "show-fest",
          position: 1,
          show: show("show-fest", "2010-03-26", { dayOrder: 1 }),
        },
        // Later show on 2010-03-26 (Tractorbeam after-party, day_order=2)
        {
          id: "track-2",
          songId: "song-helicopters",
          showId: "show-after",
          position: 1,
          show: show("show-after", "2010-03-26", { dayOrder: 2 }),
        },
      ],
      // Both shows count toward the denominator (the user only opted-out
      // some Tractorbeam sets, not all).
      statsShows: [{ date: "2010-03-26" }, { date: "2010-03-26" }],
    });
    const service = new SongService(db as never, logger);

    await service.updateSongStatistics("song-helicopters");

    // Earlier show is the debut, after-party gap=0 with prev pointing at it.
    expect(capturedTrackUpdates(db)).toEqual({
      "track-1": { gap: null, previousPerformanceShowId: null },
      "track-2": { gap: 0, previousPerformanceShowId: "show-fest" },
    });
  });
});
