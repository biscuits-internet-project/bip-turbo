import { describe, expect, test, vi } from "vitest";
import { PersonalSongHistoryService } from "./personal-song-history-service";

/**
 * Build a mock Prisma client wired to return the given attended shows and
 * tracks. Mirrors the shape the service queries — attendance.findMany
 * returns `{show: {id, date}}` rows and track.findMany returns
 * `{showId, songId}` rows.
 */
function makeMockDb(opts: {
  attendances: Array<{ show: { id: string; date: string; slug: string | null } }>;
  tracks: Array<{ showId: string; songId: string }>;
}) {
  return {
    attendance: {
      findMany: vi.fn().mockResolvedValue(opts.attendances),
    },
    track: {
      findMany: vi.fn().mockResolvedValue(opts.tracks),
    },
  };
}

describe("PersonalSongHistoryService.getSongHistory", () => {
  // Brand-new user with no attendances at all — returns empty maps without
  // crashing or making spurious downstream queries.
  test("empty user: returns empty arrays and skips track query", async () => {
    const db = makeMockDb({ attendances: [], tracks: [] });
    const service = new PersonalSongHistoryService(db as never);

    const result = await service.getSongHistory("user-1");

    expect(result).toEqual({ attendedShows: [], songAttendances: {} });
    // No shows to look up tracks for — skip the track query entirely.
    expect(db.track.findMany).not.toHaveBeenCalled();
  });

  // Populated user: attended two shows, each with some Disco Biscuits
  // tracks. Service should return chronologically sorted attended dates
  // and, per song, a sorted list of dates the user saw that song.
  test("populated user: returns sorted attended dates and per-song attendance dates", async () => {
    const db = makeMockDb({
      attendances: [
        { show: { id: "show-A", date: "2020-06-10", slug: "2020-06-10-radio-city" } },
        { show: { id: "show-B", date: "2024-07-19", slug: "2024-07-19-port-chester" } },
      ],
      tracks: [
        { showId: "show-A", songId: "song-tractorbeam" },
        { showId: "show-A", songId: "song-spaga" },
        { showId: "show-B", songId: "song-tractorbeam" },
      ],
    });
    const service = new PersonalSongHistoryService(db as never);

    const result = await service.getSongHistory("user-1");

    expect(result.attendedShows).toEqual([
      { date: "2020-06-10", slug: "2020-06-10-radio-city" },
      { date: "2024-07-19", slug: "2024-07-19-port-chester" },
    ]);
    expect(result.songAttendances["song-tractorbeam"]).toEqual([
      { date: "2020-06-10", slug: "2020-06-10-radio-city" },
      { date: "2024-07-19", slug: "2024-07-19-port-chester" },
    ]);
    expect(result.songAttendances["song-spaga"]).toEqual([{ date: "2020-06-10", slug: "2020-06-10-radio-city" }]);
  });

  // Same song played twice in one show: the user's attendance list for
  // that song should contain the show's date once per track (so totalTimesSeen
  // counts each performance, matching how Total Times Seen is rendered).
  test("within-show repeat: each occurrence contributes a separate entry", async () => {
    const db = makeMockDb({
      attendances: [{ show: { id: "show-A", date: "2024-07-19", slug: "2024-07-19-port-chester" } }],
      tracks: [
        { showId: "show-A", songId: "song-mrdon" },
        { showId: "show-A", songId: "song-mrdon" },
      ],
    });
    const service = new PersonalSongHistoryService(db as never);

    const result = await service.getSongHistory("user-1");

    expect(result.songAttendances["song-mrdon"]).toEqual([
      { date: "2024-07-19", slug: "2024-07-19-port-chester" },
      { date: "2024-07-19", slug: "2024-07-19-port-chester" },
    ]);
  });
});
