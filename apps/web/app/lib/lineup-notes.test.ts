import type { Instrument, ShowLineupMember, TrackMusicianDelta } from "@bip/domain";
import { describe, expect, test } from "vitest";
import { deriveShowLineupNotes, groupWholeShowGuests } from "./lineup-notes";
import { drummerMilestonesForDate } from "./musicians-constants";

function instrument(name: string): Instrument {
  return { id: `i-${name}`, name, slug: name.toLowerCase(), createdAt: new Date(), updatedAt: new Date() };
}

function lineupMember(
  slug: string,
  name: string,
  instruments: Instrument[] = [],
  defaultInstrument: Instrument | null = null,
): ShowLineupMember {
  return {
    musician: { id: `m-${slug}`, name, slug, knownFrom: null, defaultInstrument },
    instruments,
  };
}

function absentDelta(trackId: string, slug: string, name: string, instr: string): TrackMusicianDelta {
  return { ...delta(trackId, slug, name, instr), present: false };
}

function delta(trackId: string, slug: string, name: string, instr: string): TrackMusicianDelta {
  return {
    trackId,
    present: true,
    musician: { id: `m-${slug}`, name, slug, knownFrom: null, defaultInstrument: null },
    instruments: [instrument(instr)],
  };
}

const marlonLineup = [
  lineupMember("marc-brownstein", "Marc Brownstein"),
  lineupMember("aron-magner", "Aron Magner"),
  lineupMember("marlon-lewis", "Marlon Lewis"),
];

describe("deriveShowLineupNotes — missing members", () => {
  test("reports an absent core member", () => {
    const notes = deriveShowLineupNotes("2026-01-01", marlonLineup, [], ["t1"]);
    expect(notes.missing.map((m) => m.slug)).toEqual(["jon-gutwillig"]);
  });

  test("reports nothing missing when the full expected lineup is present", () => {
    const notes = deriveShowLineupNotes(
      "2026-01-01",
      [lineupMember("jon-gutwillig", "Jon Gutwillig"), ...marlonLineup],
      [],
      ["t1"],
    );
    expect(notes.missing).toHaveLength(0);
  });
});

describe("deriveShowLineupNotes — whole-show guests", () => {
  const tracks = ["t1", "t2", "t3", "t4", "t5"];
  // These tests use 2010 dates, where Allen Aucoin is the era drummer; the
  // base lineup must be era-correct so its members aren't read as guests.
  const fullLineup = [
    lineupMember("jon-gutwillig", "Jon Gutwillig"),
    lineupMember("marc-brownstein", "Marc Brownstein"),
    lineupMember("aron-magner", "Aron Magner"),
    lineupMember("allen-aucoin", "Allen Aucoin"),
  ];

  test("a guest on every track is elevated with no exclusions", () => {
    const deltas = tracks.map((t) => delta(t, "tom-hamilton", "Tom Hamilton", "Guitar"));
    const notes = deriveShowLineupNotes("2010-03-16", fullLineup, deltas, tracks);

    expect(notes.guests).toHaveLength(1);
    expect(notes.guests[0]).toMatchObject({ slug: "tom-hamilton", instruments: ["guitar"], absentTrackIds: [] });
  });

  test("a guest on most (but not all) tracks is elevated, listing the tracks they sat out", () => {
    // 4 of 5 tracks = 80%, meets the threshold; t5 is the exclusion.
    const deltas = ["t1", "t2", "t3", "t4"].map((t) => delta(t, "tom-hamilton", "Tom Hamilton", "Guitar"));
    const notes = deriveShowLineupNotes("2010-03-16", fullLineup, deltas, tracks);

    expect(notes.guests).toHaveLength(1);
    expect(notes.guests[0].absentTrackIds).toEqual(["t5"]);
  });

  test("a guest below the threshold is NOT elevated (stays a footnote)", () => {
    const deltas = ["t1", "t2"].map((t) => delta(t, "tom-hamilton", "Tom Hamilton", "Guitar"));
    const notes = deriveShowLineupNotes("2010-03-16", fullLineup, deltas, tracks);

    expect(notes.guests).toHaveLength(0);
  });

  test("a non-era drummer covering the whole show is elevated as a guest", () => {
    // Marlon Lewis sitting in on a 2010 (Allen-era) show: the era drummer is
    // Allen, so Marlon is not an expected member that night. A full-show
    // appearance (recorded as deltas, not lineup membership) reads as a guest.
    const lineup = [
      lineupMember("jon-gutwillig", "Jon Gutwillig"),
      lineupMember("marc-brownstein", "Marc Brownstein"),
      lineupMember("aron-magner", "Aron Magner"),
      lineupMember("allen-aucoin", "Allen Aucoin"),
    ];
    const deltas = tracks.map((t) => delta(t, "marlon-lewis", "Marlon Lewis", "Drums"));
    const notes = deriveShowLineupNotes("2010-03-16", lineup, deltas, tracks);

    expect(notes.guests.map((g) => g.slug)).toContain("marlon-lewis");
  });

  test("a base-lineup guest with no track deltas is elevated as a whole-show guest", () => {
    // Tom Hamilton recorded only in the show's base lineup (no per-track deltas),
    // as when a guest sits in for the entire show.
    const lineup = [...fullLineup, lineupMember("tom-hamilton", "Tom Hamilton", [instrument("Guitar")])];
    const notes = deriveShowLineupNotes("2010-03-16", lineup, [], tracks);

    expect(notes.guests).toHaveLength(1);
    expect(notes.guests[0]).toMatchObject({ slug: "tom-hamilton", instruments: ["guitar"], absentTrackIds: [] });
  });

  test("a base-lineup guest who sat out some tracks lists those tracks as exclusions", () => {
    const lineup = [...fullLineup, lineupMember("tom-hamilton", "Tom Hamilton", [instrument("Guitar")])];
    const deltas = [absentDelta("t5", "tom-hamilton", "Tom Hamilton", "Guitar")];
    const notes = deriveShowLineupNotes("2010-03-16", lineup, deltas, tracks);

    expect(notes.guests).toHaveLength(1);
    expect(notes.guests[0].absentTrackIds).toEqual(["t5"]);
  });

  test("a delta-elevated guest is not duplicated by the base lineup", () => {
    const lineup = [...fullLineup, lineupMember("tom-hamilton", "Tom Hamilton", [instrument("Guitar")])];
    const deltas = tracks.map((t) => delta(t, "tom-hamilton", "Tom Hamilton", "Guitar"));
    const notes = deriveShowLineupNotes("2010-03-16", lineup, deltas, tracks);

    expect(notes.guests).toHaveLength(1);
  });

  test("the show on a drummer's era start date carries their 1st-show milestone", () => {
    const notes = deriveShowLineupNotes("2025-10-31", [], [], ["t1"]);
    expect(notes.milestones).toEqual([{ slug: "marlon-lewis", name: "Marlon Lewis", ordinal: "1st" }]);
  });
});

describe("deriveShowLineupNotes — off-instrument core members", () => {
  const guitar = instrument("guitar");
  const keyboards = instrument("keyboards");
  const drums = instrument("drums");
  const vocals = instrument("vocals");

  test("reports a core member playing a non-default instrument", () => {
    // Jon, normally on guitar, plays midi this show.
    const lineup = [
      lineupMember("jon-gutwillig", "Jon Gutwillig", [instrument("midi")], guitar),
      lineupMember("marc-brownstein", "Marc Brownstein", [instrument("bass")], instrument("bass")),
      lineupMember("aron-magner", "Aron Magner", [keyboards], keyboards),
      lineupMember("allen-aucoin", "Allen Aucoin", [drums], drums),
    ];
    const notes = deriveShowLineupNotes("2010-04-25", lineup, [], ["t1"]);

    expect(notes.offInstrument).toEqual([
      { slug: "jon-gutwillig", name: "Jon Gutwillig", instruments: ["midi"], defaultInstrument: "guitar" },
    ]);
  });

  test("does not report a member playing their default instrument plus vocals", () => {
    const lineup = [
      lineupMember("jon-gutwillig", "Jon Gutwillig", [guitar, vocals], guitar),
      lineupMember("aron-magner", "Aron Magner", [keyboards, vocals], keyboards),
    ];
    const notes = deriveShowLineupNotes("2010-04-25", lineup, [], ["t1"]);

    expect(notes.offInstrument).toEqual([]);
  });

  test("omits vocals from the listed off-instruments", () => {
    const lineup = [lineupMember("jon-gutwillig", "Jon Gutwillig", [instrument("midi"), vocals], guitar)];
    const notes = deriveShowLineupNotes("2010-04-25", lineup, [], ["t1"]);

    expect(notes.offInstrument[0].instruments).toEqual(["midi"]);
  });

  test("reports the era drummer playing a non-default instrument", () => {
    const lineup = [lineupMember("allen-aucoin", "Allen Aucoin", [instrument("percussion")], drums)];
    const notes = deriveShowLineupNotes("2010-04-25", lineup, [], ["t1"]);

    expect(notes.offInstrument.map((m) => m.slug)).toEqual(["allen-aucoin"]);
  });

  test("ignores guests (non-expected members) on any instrument", () => {
    const lineup = [
      lineupMember("jon-gutwillig", "Jon Gutwillig", [guitar], guitar),
      lineupMember("tom-hamilton", "Tom Hamilton", [instrument("midi")], guitar),
    ];
    const notes = deriveShowLineupNotes("2010-04-25", lineup, [], ["t1"]);

    expect(notes.offInstrument).toEqual([]);
  });

  test("a member missing entirely is reported as missing, never off-instrument", () => {
    const notes = deriveShowLineupNotes("2026-01-01", marlonLineup, [], ["t1"]);

    expect(notes.missing.map((m) => m.slug)).toEqual(["jon-gutwillig"]);
    expect(notes.offInstrument).toEqual([]);
  });
});

describe("groupWholeShowGuests", () => {
  test("combines guests on the same instrument into one group", () => {
    const groups = groupWholeShowGuests([
      { musicianId: "m1", name: "Tom Hamilton", slug: "tom-hamilton", instruments: ["guitar"], absentTrackIds: [] },
      { musicianId: "m2", name: "Chris Michetti", slug: "chris-michetti", instruments: ["guitar"], absentTrackIds: [] },
    ]);

    expect(groups).toEqual([
      {
        members: [
          { name: "Tom Hamilton", slug: "tom-hamilton" },
          { name: "Chris Michetti", slug: "chris-michetti" },
        ],
        instruments: ["guitar"],
        exceptWhereNoted: false,
      },
    ]);
  });

  test("keeps guests on different instruments in separate groups", () => {
    const groups = groupWholeShowGuests([
      { musicianId: "m1", name: "Tom Hamilton", slug: "tom-hamilton", instruments: ["guitar"], absentTrackIds: [] },
      { musicianId: "m2", name: "Jen Hartswick", slug: "jen-hartswick", instruments: ["trumpet"], absentTrackIds: [] },
    ]);

    expect(groups.map((g) => g.instruments)).toEqual([["guitar"], ["trumpet"]]);
  });

  test("does not merge a whole-show guest with an except-where-noted guest on the same instrument", () => {
    const groups = groupWholeShowGuests([
      { musicianId: "m1", name: "Tom Hamilton", slug: "tom-hamilton", instruments: ["guitar"], absentTrackIds: [] },
      {
        musicianId: "m2",
        name: "Chris Michetti",
        slug: "chris-michetti",
        instruments: ["guitar"],
        absentTrackIds: ["t5"],
      },
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0].exceptWhereNoted).toBe(false);
    expect(groups[1].exceptWhereNoted).toBe(true);
  });
});

describe("drummerMilestonesForDate", () => {
  test("Marlon's era-start show is his 1st show", () => {
    expect(drummerMilestonesForDate("2025-10-31")).toEqual([
      { slug: "marlon-lewis", name: "Marlon Lewis", ordinal: "1st" },
    ]);
  });

  test("Allen's era-end show is his last show", () => {
    expect(drummerMilestonesForDate("2025-09-07")).toEqual([
      { slug: "allen-aucoin", name: "Allen Aucoin", ordinal: "last" },
    ]);
  });

  test("Sam Altman's first show is never reported (his era has no start date)", () => {
    // Sam's era is open-started; only his last show (era end) is a milestone.
    expect(drummerMilestonesForDate("2005-08-27")).toEqual([
      { slug: "sam-altman", name: "Sam Altman", ordinal: "last" },
    ]);
  });

  test("an ordinary date has no milestones", () => {
    expect(drummerMilestonesForDate("2015-04-17")).toEqual([]);
  });
});
