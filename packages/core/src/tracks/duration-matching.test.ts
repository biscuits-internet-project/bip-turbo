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

  // archive.org appends a track-number / segue annotation in parens or brackets
  // ("Spaga (1) ->", "7-11(1)", "The Overture [2]") and an unfinished marker
  // ("Pygmy Twylyte (unf)"). Those drop out so the bare song title remains.
  test("strips parenthetical and bracketed annotations", () => {
    expect(normalizeTrackTitle("Spaga (1) ->")).toBe(normalizeTrackTitle("Spaga"));
    expect(normalizeTrackTitle("7-11(1)")).toBe(normalizeTrackTitle("7-11"));
    expect(normalizeTrackTitle("The Overture [2]")).toBe(normalizeTrackTitle("The Overture"));
    expect(normalizeTrackTitle("Pygmy Twylyte (unf) >")).toBe(normalizeTrackTitle("Pygmy Twylyte"));
  });

  // archive.org prefixes encore tracks with "E:", "E)", or "(e)".
  test("strips a leading encore/set marker", () => {
    expect(normalizeTrackTitle("E: The Very Moon")).toBe(normalizeTrackTitle("The Very Moon"));
    expect(normalizeTrackTitle("E)Nughuffer")).toBe(normalizeTrackTitle("Nughuffer"));
    expect(normalizeTrackTitle("(e)Astronaut")).toBe(normalizeTrackTitle("Astronaut"));
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
    // Two substitutions apart in a short title (Crickets vs Crackers).
    expect(matchTrackDurations([{ key: "b", title: "Crickets" }], [{ title: "Crackers", seconds: 100 }]).has("b")).toBe(
      false,
    );
  });

  // A leading article drifts between sources — nugs opens a show with bare
  // "Overture" where our setlist has "The Overture" — and that single mismatch
  // used to send the matcher hunting forward and binding to the wrong copy.
  test("matches across a leading article difference", () => {
    const result = matchTrackDurations([{ key: "a", title: "The Overture" }], [{ title: "Overture", seconds: 568 }]);
    expect(result.get("a")).toBe(568);
  });

  // nugs spells the extended set-opener "Pilin' It Higher" where our setlist
  // has "Pilin' It High" (two trailing characters) — a long title two edits
  // apart that should still align.
  test("tolerates a two-character difference in a long title", () => {
    const result = matchTrackDurations(
      [{ key: "a", title: "Pilin' It High" }],
      [{ title: "Pilin' It Higher", seconds: 679 }],
    );
    expect(result.get("a")).toBe(679);
  });

  // Sources disagree on digits vs spelled-out numbers: nugs "5th Of Beethoven"
  // / "3 Wishes" / archive "Sound 1" for our "A Fifth of Beethoven" / "Three
  // Wishes" / "Sound One".
  test("matches digits against spelled-out numbers", () => {
    expect(
      matchTrackDurations(
        [{ key: "a", title: "A Fifth of Beethoven" }],
        [{ title: "5th Of Beethoven", seconds: 300 }],
      ).get("a"),
    ).toBe(300);
    expect(
      matchTrackDurations([{ key: "a", title: "Three Wishes" }], [{ title: "3 Wishes", seconds: 400 }]).get("a"),
    ).toBe(400);
    expect(matchTrackDurations([{ key: "a", title: "Sound One" }], [{ title: "Sound 1", seconds: 500 }]).get("a")).toBe(
      500,
    );
  });

  // nugs titles the recurring "Dance of the Sugar Plum Fairies" with the
  // singular "Fairy" — one differing word that shares a long prefix.
  test("matches a one-word plural/singular variant", () => {
    const result = matchTrackDurations(
      [{ key: "a", title: "Dance of the Sugar Plum Fairies" }],
      [{ title: "Dance Of The Sugar Plum Fairy", seconds: 540 }],
    );
    expect(result.get("a")).toBe(540);
  });

  // Modern setlists fuse two songs into one " x " track ("The Great Abyss x
  // D.M.T") that nugs splits into separate files. We match on the lead song and
  // sum the trailing segment when the source lists it next.
  test("matches an 'x' medley on its lead song and sums the rest", () => {
    const summed = matchTrackDurations(
      [{ key: "a", title: "The Great Abyss x D.M.T" }],
      [
        { title: "The Great Abyss", seconds: 600 },
        { title: "D.M.T", seconds: 240 },
      ],
    );
    expect(summed.get("a")).toBe(840);

    // When the source only carries the lead song, the medley still gets its
    // duration.
    const leadOnly = matchTrackDurations(
      [
        { key: "a", title: "Lake Shore Drive x Meditation to the Groove" },
        { key: "b", title: "Anthem" },
      ],
      [
        { title: "Lake Shore Drive", seconds: 900 },
        { title: "Anthem", seconds: 300 },
      ],
    );
    expect(leadOnly.get("a")).toBe(900);
    expect(leadOnly.get("b")).toBe(300);
  });
});

// ---------------------------------------------------------------------------
// matchTrackDurations — real nugs.net releases (regression fixtures)
// ---------------------------------------------------------------------------

describe("matchTrackDurations against real nugs track lists", () => {
  // These fixtures are the exact ordered track lists nugs.net returns for two
  // 2024/2023 releases (catalog.container 38978 and 33063), paired with our
  // setlist titles in play order. Both shows have every track on nugs, yet the
  // matcher dropped most of them: one title mismatch near the top of a set
  // (leading "The", "High" vs "Higher") made the forward resync leap to a
  // later duplicate ("The Overture" reprise, the encore "Pilin' It High"),
  // orphaning every track in between. Each track must get its CORRECT duration.

  test("2024-11-06 Rams Head Live — all tracks, correct copies", () => {
    const ours = [
      { key: "s1-overture", title: "The Overture" },
      { key: "s1-in-the-end", title: "In the End We Have Forever" },
      { key: "s1-m1", title: "M1" },
      { key: "s1-falling", title: "Falling" },
      { key: "s1-munchkin", title: "Munchkin Invasion" },
      { key: "s1-overture-reprise", title: "The Overture" },
      { key: "s2-vassillios", title: "Vassillios" },
      { key: "s2-ring", title: "Ring the Doorbell Twice" },
      { key: "s2-leavemealone", title: "Leavemealone" },
      { key: "s2-one-chance", title: "One Chance to Save the World" },
      { key: "s2-munchkin", title: "Munchkin Invasion" },
      { key: "s2-country-royale", title: "Country Royale" },
      { key: "e1-little-lai", title: "Little Lai" },
    ];
    const nugs = [
      { title: "Crowd", seconds: 73 },
      { title: "Overture", seconds: 568 },
      { title: "In The End We Have Forever", seconds: 927 },
      { title: "M1", seconds: 967 },
      { title: "Falling", seconds: 1378 },
      { title: "Munchkin Invasion", seconds: 595 },
      { title: "The Overture", seconds: 160 },
      { title: "Crowd", seconds: 84 },
      { title: "Vassillios", seconds: 732 },
      { title: "Ring The Doorbell Twice", seconds: 1528 },
      { title: "Leavemealone", seconds: 992 },
      { title: "One Chance To Save The World", seconds: 1113 },
      { title: "Munchkin Invasion", seconds: 557 },
      { title: "Country Royale", seconds: 966 },
      { title: "Little Lai", seconds: 671 },
    ];
    const result = matchTrackDurations(ours, nugs);

    expect(result.get("s1-overture")).toBe(568);
    expect(result.get("s1-in-the-end")).toBe(927);
    expect(result.get("s1-m1")).toBe(967);
    expect(result.get("s1-falling")).toBe(1378);
    expect(result.get("s1-munchkin")).toBe(595);
    expect(result.get("s1-overture-reprise")).toBe(160);
    expect(result.get("s2-vassillios")).toBe(732);
    expect(result.get("s2-ring")).toBe(1528);
    expect(result.get("s2-leavemealone")).toBe(992);
    expect(result.get("s2-one-chance")).toBe(1113);
    expect(result.get("s2-munchkin")).toBe(557);
    expect(result.get("s2-country-royale")).toBe(966);
    expect(result.get("e1-little-lai")).toBe(671);
  });

  // The greedy two-pointer used to strand every track before the first one it
  // matched whenever our setlist order and nugs' disc order disagreed. Here our
  // set 1 opens [Jigsaw Earth, Down to the Bottom, Helicopters] but nugs ordered
  // it [Down to the Bottom, Helicopters, Jigsaw Earth] — matching our opening
  // Jigsaw jumped past nugs' first two tracks for good, orphaning 13 tracks
  // whose exact titles were right there. Real catalog.container 2002-08-10.
  test("2002-08-10 NorVa — recovers a set-opening transposition", () => {
    const ours = [
      { key: "jigsaw-a", title: "Jigsaw Earth" },
      { key: "down", title: "Down to the Bottom" },
      { key: "helicopters-a", title: "Helicopters" },
      { key: "jigsaw-b", title: "Jigsaw Earth" },
      { key: "voices", title: "Voices Insane" },
      { key: "shemrah", title: "Shem-Rah Boo" },
      { key: "rock-candy", title: "Rock Candy" },
      { key: "kitchen-mitts", title: "Kitchen Mitts" },
      { key: "svenghali-a", title: "Svenghali" },
      { key: "pygmy", title: "Pygmy Twylyte" },
      { key: "basis", title: "Basis for a Day" },
      { key: "sister-judy-a", title: "Sister Judy's Soul Shack" },
      { key: "helicopters-b", title: "Helicopters" },
      { key: "little-lai", title: "Little Lai" },
      { key: "svenghali-b", title: "Svenghali" },
      { key: "home-again", title: "Home Again" },
      { key: "sister-judy-b", title: "Sister Judy's Soul Shack" },
    ];
    const nugs = [
      { title: "Down To The Bottom", seconds: 808 },
      { title: "Helicopters", seconds: 826 },
      { title: "Jigsaw Earth", seconds: 216 },
      { title: "Voices Insane", seconds: 669 },
      { title: "Shem-Rah Boo", seconds: 973 },
      { title: "Rock Candy", seconds: 583 },
      { title: "Kitchen Mitts", seconds: 547 },
      { title: "Svenghali", seconds: 562 },
      { title: "Pygmy Twylyte", seconds: 488 },
      { title: "Basis For A Day", seconds: 908 },
      { title: "Sister Judy's Soul Shack", seconds: 652 },
      { title: "Helicopters", seconds: 325 },
      { title: "Little Lai", seconds: 482 },
      { title: "Svenghali", seconds: 478 },
      { title: "Home Again", seconds: 343 },
      { title: "Sister Judy's Soul Shack", seconds: 279 },
    ];
    const result = matchTrackDurations(ours, nugs);

    // nugs has one Jigsaw Earth for our two, so one of ours stays unmatched —
    // but every other track resolves to its correct, in-order copy.
    expect(result.get("down")).toBe(808);
    expect(result.get("helicopters-a")).toBe(826);
    expect(result.get("voices")).toBe(669);
    expect(result.get("shemrah")).toBe(973);
    expect(result.get("rock-candy")).toBe(583);
    expect(result.get("kitchen-mitts")).toBe(547);
    expect(result.get("svenghali-a")).toBe(562);
    expect(result.get("pygmy")).toBe(488);
    expect(result.get("basis")).toBe(908);
    expect(result.get("sister-judy-a")).toBe(652);
    expect(result.get("helicopters-b")).toBe(325);
    expect(result.get("little-lai")).toBe(482);
    expect(result.get("svenghali-b")).toBe(478);
    expect(result.get("home-again")).toBe(343);
    expect(result.get("sister-judy-b")).toBe(279);
    // The one Jigsaw nugs has is assigned to exactly one of our two.
    expect(result.get("jigsaw-a") ?? result.get("jigsaw-b")).toBe(216);
    expect(result.size).toBe(16);
  });

  test("2023-06-08 Lincoln Theater — all tracks, correct copies", () => {
    const ours = [
      { key: "s1-memphis", title: "M.E.M.P.H.I.S." },
      { key: "s1-astronaut", title: "Astronaut" },
      { key: "s1-very-moon-1", title: "The Very Moon" },
      { key: "s1-crickets-1", title: "Crickets" },
      { key: "s1-very-moon-2", title: "The Very Moon" },
      { key: "s1-crickets-2", title: "Crickets" },
      { key: "s1-another-plan", title: "Another Plan of Attack" },
      { key: "s1-munchkin", title: "Munchkin Invasion" },
      { key: "s2-pilin", title: "Pilin' It High" },
      { key: "s2-buy-the-time", title: "Buy the Time" },
      { key: "s2-lake-shore", title: "Lake Shore Drive" },
      { key: "s2-anthem", title: "Anthem" },
      { key: "s2-reactor", title: "Reactor" },
      { key: "s2-rock-candy", title: "Rock Candy" },
      { key: "s2-you-spin", title: "You Spin Me Round (Like a Record)" },
      { key: "e1-space-train", title: "Space Train" },
      { key: "e1-pilin", title: "Pilin' It High" },
    ];
    const nugs = [
      { title: "Crowd", seconds: 41 },
      { title: "M.E.M.P.H.I.S.", seconds: 1182 },
      { title: "Astronaut", seconds: 896 },
      { title: "The Very Moon", seconds: 701 },
      { title: "Crickets", seconds: 153 },
      { title: "The Very Moon", seconds: 306 },
      { title: "Crickets", seconds: 555 },
      { title: "Another Plan Of Attack", seconds: 562 },
      { title: "Munchkin Invasion", seconds: 666 },
      { title: "Crowd", seconds: 26 },
      { title: "Pilin' It Higher", seconds: 679 },
      { title: "Buy The Time", seconds: 542 },
      { title: "Lake Shore Drive", seconds: 932 },
      { title: "Anthem", seconds: 595 },
      { title: "Reactor", seconds: 620 },
      { title: "Rock Candy", seconds: 1018 },
      { title: "You Spin Me Round (Like a Record)", seconds: 587 },
      { title: "Space Train", seconds: 606 },
      { title: "Pilin' It High", seconds: 108 },
    ];
    const result = matchTrackDurations(ours, nugs);

    expect(result.get("s1-memphis")).toBe(1182);
    expect(result.get("s1-astronaut")).toBe(896);
    expect(result.get("s1-very-moon-1")).toBe(701);
    expect(result.get("s1-crickets-1")).toBe(153);
    expect(result.get("s1-very-moon-2")).toBe(306);
    expect(result.get("s1-crickets-2")).toBe(555);
    expect(result.get("s1-another-plan")).toBe(562);
    expect(result.get("s1-munchkin")).toBe(666);
    expect(result.get("s2-pilin")).toBe(679);
    expect(result.get("s2-buy-the-time")).toBe(542);
    expect(result.get("s2-lake-shore")).toBe(932);
    expect(result.get("s2-anthem")).toBe(595);
    expect(result.get("s2-reactor")).toBe(620);
    expect(result.get("s2-rock-candy")).toBe(1018);
    expect(result.get("s2-you-spin")).toBe(587);
    expect(result.get("e1-space-train")).toBe(606);
    expect(result.get("e1-pilin")).toBe(108);
  });
});
