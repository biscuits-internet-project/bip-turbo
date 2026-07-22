import { describe, expect, test } from "vitest";
import { musicianAppearanceShowsSql, musicianSongPlaysSql } from "./musician-appearances";

describe("musicianAppearanceShowsSql", () => {
  // Every musician statistic counts only stats shows. Both halves of the union
  // (lineup membership and sit-in deltas) need the filter — a soundcheck
  // sit-in slipping through one branch would inflate the counts on that page
  // alone, which is the class of drift this shared builder exists to prevent.
  test("filters both the lineup and sit-in branches to stats shows", () => {
    const { sql } = musicianAppearanceShowsSql();

    expect(sql.match(/count_for_stats = TRUE/g)).toHaveLength(2);
  });

  // Early shows have no setlist entered; a lineup row is still a real
  // appearance, so the show set must come off `show_musicians` directly rather
  // than being derived from tracks the way the play counts are.
  test("counts a lineup show even when it has no tracks", () => {
    const { sql } = musicianAppearanceShowsSql();

    expect(sql).not.toContain("JOIN tracks t ON t.show_id = sm.show_id");
  });

  // The profile page scopes to one musician while the index scans everyone;
  // an unscoped profile query would silently aggregate the whole band.
  test("scopes both branches to the musician when given an id", () => {
    expect(musicianAppearanceShowsSql("musician-1").values).toEqual(["musician-1", "musician-1"]);
    expect(musicianAppearanceShowsSql().values).toEqual([]);
  });
});

describe("musicianSongPlaysSql", () => {
  test("filters both the lineup and sit-in branches to stats shows", () => {
    const { sql } = musicianSongPlaysSql();

    expect(sql.match(/count_for_stats = TRUE/g)).toHaveLength(2);
  });

  test("scopes both branches to the musician when given an id", () => {
    expect(musicianSongPlaysSql("musician-1").values).toEqual(["musician-1", "musician-1"]);
    expect(musicianSongPlaysSql().values).toEqual([]);
  });
});
