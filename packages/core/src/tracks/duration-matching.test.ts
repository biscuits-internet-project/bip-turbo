import { describe, expect, test } from "vitest";
import { matchTrackDurations, normalizeTrackTitle } from "./duration-matching";

// ---------------------------------------------------------------------------
// normalizeTrackTitle
// ---------------------------------------------------------------------------

describe("normalizeTrackTitle", () => {
  // Aligns our setlist titles with the punctuation/segue-marker noise that
  // external sources (nugs, archive.org) put in their track titles.

  test("lowercases and collapses whitespace", () => {
    expect(normalizeTrackTitle("Basis For A Day")).toBe(normalizeTrackTitle("basis for a day"));
  });

  test("strips segue markers and surrounding punctuation", () => {
    expect(normalizeTrackTitle("Aceetobee >")).toBe(normalizeTrackTitle("Aceetobee"));
    expect(normalizeTrackTitle("Spaga ->")).toBe(normalizeTrackTitle("Spaga"));
    expect(normalizeTrackTitle("I-Man")).toBe(normalizeTrackTitle("I Man"));
  });

  test("treats & as and", () => {
    expect(normalizeTrackTitle("On & On")).toBe(normalizeTrackTitle("On and On"));
  });
});

// ---------------------------------------------------------------------------
// matchTrackDurations
// ---------------------------------------------------------------------------

describe("matchTrackDurations", () => {
  // Maps our ordered setlist tracks to external durations, skipping filler
  // tracks the external source inserts (crowd noise, tuning) and summing a
  // song the external source split across consecutive files.

  test("aligns a clean 1:1 setlist", () => {
    const result = matchTrackDurations(
      [
        { key: "a", title: "Helicopters" },
        { key: "b", title: "Basis for a Day" },
        { key: "c", title: "Spaga" },
      ],
      [
        { title: "Helicopters", seconds: 522 },
        { title: "Basis For A Day", seconds: 845 },
        { title: "Spaga", seconds: 410 },
      ],
    );
    expect(result.get("a")).toBe(522);
    expect(result.get("b")).toBe(845);
    expect(result.get("c")).toBe(410);
  });

  test("skips external filler tracks between songs", () => {
    const result = matchTrackDurations(
      [
        { key: "a", title: "Helicopters" },
        { key: "b", title: "Spaga" },
      ],
      [
        { title: "Crowd", seconds: 30 },
        { title: "Helicopters", seconds: 522 },
        { title: "Tuning", seconds: 12 },
        { title: "Spaga", seconds: 410 },
      ],
    );
    expect(result.get("a")).toBe(522);
    expect(result.get("b")).toBe(410);
  });

  test("resyncs past an unknown interloper that is not in our setlist", () => {
    const result = matchTrackDurations(
      [
        { key: "a", title: "Helicopters" },
        { key: "b", title: "Spaga" },
      ],
      [
        { title: "Helicopters", seconds: 500 },
        { title: "Banter", seconds: 20 },
        { title: "Spaga", seconds: 400 },
      ],
    );
    expect(result.get("a")).toBe(500);
    expect(result.get("b")).toBe(400);
  });

  test("sums a song the external source split across consecutive files", () => {
    const result = matchTrackDurations(
      [{ key: "a", title: "Munchkin Invasion" }],
      [
        { title: "Munchkin Invasion", seconds: 200 },
        { title: "Munchkin Invasion", seconds: 150 },
      ],
    );
    expect(result.get("a")).toBe(350);
  });

  test("leaves tracks the source lacks unassigned", () => {
    const result = matchTrackDurations(
      [
        { key: "a", title: "Konkrete" },
        { key: "b", title: "Astronaut" },
      ],
      [{ title: "Konkrete", seconds: 300 }],
    );
    expect(result.get("a")).toBe(300);
    expect(result.has("b")).toBe(false);
  });

  test("returns an empty map for empty inputs", () => {
    expect(matchTrackDurations([], [{ title: "Spaga", seconds: 1 }]).size).toBe(0);
    expect(matchTrackDurations([{ key: "a", title: "Spaga" }], []).size).toBe(0);
  });

  test("ignores zero/negative external lengths", () => {
    const result = matchTrackDurations([{ key: "a", title: "Crickets" }], [{ title: "Crickets", seconds: 0 }]);
    expect(result.has("a")).toBe(false);
  });

  // "jam"/"improv" naming drifts between sources (our "Mishawaka Improv Jam"
  // vs nugs' "Mishawaka Jam"), so those words are dropped before comparing
  // when either side carries one.
  test("matches jam/improv titles flexibly by their distinctive words", () => {
    const result = matchTrackDurations(
      [
        { key: "a", title: "Helicopters" },
        { key: "b", title: "Mishawaka Improv Jam" },
      ],
      [
        { title: "Helicopters", seconds: 500 },
        { title: "Mishawaka Jam", seconds: 3858 },
      ],
    );
    expect(result.get("a")).toBe(500);
    expect(result.get("b")).toBe(3858);
  });

  test("relaxes when the jam word is on our side", () => {
    const result = matchTrackDurations(
      [{ key: "a", title: "Crystal Ball Jam" }],
      [{ title: "Crystal Ball", seconds: 612 }],
    );
    expect(result.get("a")).toBe(612);
  });

  test("does not match a bare 'Jam' to an unrelated track", () => {
    const result = matchTrackDurations([{ key: "a", title: "Jam" }], [{ title: "Helicopters", seconds: 500 }]);
    expect(result.has("a")).toBe(false);
  });

  // Word spacing drifts between sources — our "Sugarplum" vs archive's
  // "Sugar Plum" — so comparison ignores spaces.
  test("matches across word-spacing differences", () => {
    const result = matchTrackDurations(
      [{ key: "a", title: "Dance of the Sugarplum Fairies" }],
      [{ title: "Dance Of The Sugar Plum Fairies >", seconds: 540 }],
    );
    expect(result.get("a")).toBe(540);
  });

  test("does not match unrelated titles just because spaces are removed", () => {
    const result = matchTrackDurations([{ key: "a", title: "Crickets" }], [{ title: "Helicopters", seconds: 500 }]);
    expect(result.has("a")).toBe(false);
  });

  // External sources have typos — nugs spelled the reprise "Munckin Invasion"
  // (missing the h) — so a single-character difference in a long title still
  // matches as a last resort.
  test("tolerates a single-character typo in a long title", () => {
    const result = matchTrackDurations(
      [{ key: "a", title: "Munchkin Invasion" }],
      [{ title: "Munckin Invasion", seconds: 472 }],
    );
    expect(result.get("a")).toBe(472);
  });

  test("does not fuzzy-match short titles or titles more than one edit apart", () => {
    // Too short to risk a fuzzy match.
    expect(matchTrackDurations([{ key: "a", title: "Spaga" }], [{ title: "Spago", seconds: 100 }]).has("a")).toBe(
      false,
    );
    // Two substitutions apart (Crickets vs Crackers).
    expect(matchTrackDurations([{ key: "b", title: "Crickets" }], [{ title: "Crackers", seconds: 100 }]).has("b")).toBe(
      false,
    );
  });
});
