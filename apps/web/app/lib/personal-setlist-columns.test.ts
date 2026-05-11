import { average, median } from "@bip/domain";
import { describe, expect, test } from "vitest";
import { computePersonalRow, eligiblePersonalGaps, type PersonalSetlistRow } from "./personal-setlist-columns";

/** Compact builder for a TrackContext entry in setlistTracks. */
function track(id: string, songId: string, set: string, position: number) {
  return { id, songId, set, position };
}

/** Compact builder for a PersonalAttendance — defaults the slug from the date. */
function attendance(date: string, slug?: string) {
  return { date, slug: slug ?? `${date}-show` };
}

describe("computePersonalRow", () => {
  // Personal debut: user has never seen this song in any attended show.
  // yourGap = debut (★); lastSeen is null; totalTimesSeen = 0.
  test("personal debut: never-seen song renders as debut", () => {
    const row = computePersonalRow({
      track: track("t1", "song-tractorbeam", "S1", 1),
      showDate: "2024-07-19",
      setlistTracks: [track("t1", "song-tractorbeam", "S1", 1)],
      songAttendances: [],
      attendedShows: [attendance("2024-07-19")],
    });
    expect(row).toEqual({
      totalTimesSeen: 0,
      lastSeen: null,
      yourGap: { kind: "debut" },
    });
  });

  // Within-show repeat: when a song appears twice in the same show, the
  // second occurrence renders ↺ regardless of whether the user attended.
  test("within-show repeat: second occurrence renders 'this-show' (user attended)", () => {
    const setlistTracks = [track("t1", "song-mrdon", "S1", 3), track("t2", "song-mrdon", "S2", 8)];
    const row = computePersonalRow({
      track: setlistTracks[1],
      showDate: "2024-07-19",
      setlistTracks,
      songAttendances: [attendance("2020-06-10"), attendance("2024-07-19"), attendance("2024-07-19")],
      attendedShows: [attendance("2020-06-10"), attendance("2024-07-19")],
    });
    expect(row.yourGap).toEqual({ kind: "this-show" });
    // lastSeen = most recent attended performance strictly before the show date
    expect(row.lastSeen?.date).toBe("2020-06-10");
  });

  // ↺ is purely a setlist property — applies even when the user did NOT
  // attend this show. The second occurrence still renders 'this-show'.
  test("within-show repeat: second occurrence renders 'this-show' (user did not attend)", () => {
    const setlistTracks = [track("t1", "song-aceofspades", "S1", 2), track("t2", "song-aceofspades", "S2", 5)];
    const row = computePersonalRow({
      track: setlistTracks[1],
      showDate: "2024-07-19",
      setlistTracks,
      songAttendances: [attendance("2018-04-15")],
      attendedShows: [attendance("2018-04-15"), attendance("2020-01-01")],
    });
    expect(row.yourGap).toEqual({ kind: "this-show" });
  });

  // Normal gap: user has seen this song before; show is in the future or
  // user did not attend. yourGap counts the number of attended shows
  // strictly between lastSeen and the show's date.
  test("normal gap: counts user-attended shows strictly between lastSeen and showDate", () => {
    const row = computePersonalRow({
      track: track("t1", "song-bombbasis", "S1", 1),
      showDate: "2024-07-19",
      setlistTracks: [track("t1", "song-bombbasis", "S1", 1)],
      songAttendances: [attendance("2018-04-15")],
      // User attended 5 shows total — 3 are strictly between 2018-04-15 and 2024-07-19
      attendedShows: [
        attendance("2018-04-15"),
        attendance("2019-06-10"),
        attendance("2020-08-20"),
        attendance("2021-12-05"),
        attendance("2024-07-19"),
      ],
    });
    expect(row.totalTimesSeen).toBe(1);
    expect(row.lastSeen?.date).toBe("2018-04-15");
    expect(row.yourGap).toEqual({ kind: "count", value: 3 });
  });

  // Un-attended show: user wasn't at this show but has seen the song
  // before. Gap is computed off prior attended performances; this show
  // itself is not counted (user wasn't there).
  test("un-attended show: gap computed off prior attended performances; this show not counted", () => {
    const row = computePersonalRow({
      track: track("t1", "song-spaga", "S1", 1),
      showDate: "2024-07-19",
      setlistTracks: [track("t1", "song-spaga", "S1", 1)],
      songAttendances: [attendance("2018-04-15")],
      attendedShows: [attendance("2018-04-15"), attendance("2019-06-10"), attendance("2020-08-20")],
    });
    expect(row.lastSeen?.date).toBe("2018-04-15");
    expect(row.yourGap).toEqual({ kind: "count", value: 2 });
  });

  // Edge: user attended this show AND saw the song at this show. The
  // attendance array contains showDate, but lastSeen must skip it
  // (strictly less than) and return the prior attended performance.
  test("user attended this show: lastSeen skips the current show's date", () => {
    const row = computePersonalRow({
      track: track("t1", "song-confrontation", "S1", 1),
      showDate: "2024-07-19",
      setlistTracks: [track("t1", "song-confrontation", "S1", 1)],
      songAttendances: [attendance("2018-04-15"), attendance("2020-06-10"), attendance("2024-07-19")],
      attendedShows: [
        attendance("2018-04-15"),
        attendance("2019-12-31"),
        attendance("2020-06-10"),
        attendance("2024-07-19"),
      ],
    });
    // Strictly before the current show: 2018-04-15 + 2020-06-10 = 2.
    // The 2024-07-19 attendance at this very show doesn't count.
    expect(row.totalTimesSeen).toBe(2);
    expect(row.lastSeen?.date).toBe("2020-06-10");
    // No attended shows strictly between 2020-06-10 and 2024-07-19.
    expect(row.yourGap).toEqual({ kind: "count", value: 0 });
  });

  // Back-to-back attended performances of the same song: lastSeen is
  // the prior attended show; yourGap = 0 (no shows in between).
  test("back-to-back attended performances: gap=0", () => {
    const row = computePersonalRow({
      track: track("t1", "song-pillow", "S1", 1),
      showDate: "2024-07-20",
      setlistTracks: [track("t1", "song-pillow", "S1", 1)],
      songAttendances: [attendance("2024-07-19"), attendance("2024-07-20")],
      attendedShows: [attendance("2024-07-19"), attendance("2024-07-20")],
    });
    expect(row.lastSeen?.date).toBe("2024-07-19");
    expect(row.yourGap).toEqual({ kind: "count", value: 0 });
  });

  // First occurrence of a song that repeats later in the same show: the
  // first instance is NOT a repeat and gets its normal gap value.
  test("first occurrence of a repeated song: NOT marked as 'this-show'", () => {
    const setlistTracks = [track("t1", "song-helicopters", "S1", 2), track("t2", "song-helicopters", "S2", 7)];
    const row = computePersonalRow({
      track: setlistTracks[0],
      showDate: "2024-07-19",
      setlistTracks,
      songAttendances: [attendance("2020-06-10")],
      attendedShows: [attendance("2020-06-10"), attendance("2024-07-19")],
    });
    expect(row.yourGap).toEqual({ kind: "count", value: 0 });
  });
});

describe("eligiblePersonalGaps", () => {
  function row(kind: "count" | "debut" | "this-show", value = 0): PersonalSetlistRow {
    return {
      totalTimesSeen: 0,
      lastSeen: null,
      yourGap: kind === "count" ? { kind, value } : { kind },
    };
  }

  // The filter mirrors the gap-chart's `eligibleGapsForAggregation`:
  // debuts and within-show repeats are excluded so callers can feed the
  // remaining numbers straight into `average` / `median`.
  test("excludes debuts and within-show repeats", () => {
    const rows = [row("count", 0), row("count", 4), row("count", 8), row("debut"), row("this-show")];
    expect(eligiblePersonalGaps(rows)).toEqual([0, 4, 8]);
  });

  // No eligible numeric gaps → empty array. The `average` / `median`
  // helpers from `@bip/domain` turn that into a clean `null` at call sites.
  test("returns an empty array when no row is eligible", () => {
    expect(eligiblePersonalGaps([row("debut"), row("this-show")])).toEqual([]);
    expect(average(eligiblePersonalGaps([row("debut")]))).toBeNull();
    expect(median(eligiblePersonalGaps([row("debut")]))).toBeNull();
  });

  // End-to-end sanity check that the filter + math pipeline produces the
  // expected summary numbers — same scenario as before, just composed
  // explicitly instead of through a wrapper.
  test("feeds into average + median for a typical setlist", () => {
    const rows = [row("count", 2), row("count", 4), row("count", 6), row("count", 10)];
    expect(average(eligiblePersonalGaps(rows))).toBe(5.5);
    expect(median(eligiblePersonalGaps(rows))).toBe(5);
  });
});
