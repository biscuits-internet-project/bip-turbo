import { describe, expect, test } from "vitest";
import { noteworthyTrackSql } from "./noteworthy-track";

describe("noteworthyTrackSql", () => {
  // "Noteworthy" is all-timer OR a curated note. Both halves have to survive:
  // dropping either silently changes which performances the Jam Charts listing,
  // the jamChart filter, and the shows table's count agree on.
  test("matches an all-timer or a non-empty note", () => {
    const { sql } = noteworthyTrackSql();

    expect(sql).toContain("all_timer = true");
    expect(sql).toContain("note IS NOT NULL");
    expect(sql).toContain("note <> ''");
  });

  // It carries a top-level OR and gets AND-joined into a surrounding WHERE, so
  // losing the wrapping parens would silently widen every query using it.
  test("parenthesizes the whole predicate", () => {
    const { sql } = noteworthyTrackSql();

    expect(sql.trim().startsWith("(")).toBe(true);
    expect(sql.trim().endsWith(")")).toBe(true);
  });

  test("qualifies its columns with the caller's alias", () => {
    expect(noteworthyTrackSql("t").sql).toContain("t.all_timer");
    expect(noteworthyTrackSql("show_tracks").sql).toContain("show_tracks.all_timer");
  });

  test("defaults to the bare tracks table", () => {
    expect(noteworthyTrackSql().sql).toContain("tracks.all_timer");
  });
});
