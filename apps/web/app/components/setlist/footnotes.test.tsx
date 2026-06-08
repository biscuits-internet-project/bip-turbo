import type { Annotation, Instrument, TrackMusicianDelta } from "@bip/domain";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import {
  annotationFootnoteSources,
  buildDebutText,
  dataDrivenFootnoteSources,
  debutFootnoteSources,
  deriveFootnotes,
  type FootnoteSource,
  type FootnoteTrack,
  guestExclusionFootnotes,
  lastTimePlayedFootnoteSources,
  synthesizePerformerFootnotes,
} from "./footnotes";

function makeTrack(overrides: Partial<FootnoteTrack> & { id: string }): FootnoteTrack {
  return {
    songId: `song-${overrides.id}`,
    gap: null,
    previousPerformanceShow: null,
    song: { slug: "song", kind: "original", authorName: null },
    ...overrides,
  };
}

function makeAnnotation(trackId: string, desc: string | null): Annotation {
  return { id: `ann-${trackId}-${desc}`, trackId, desc, createdAt: new Date(), updatedAt: new Date() };
}

function makeInstrument(name: string): Instrument {
  return { id: `instr-${name}`, name, slug: name.toLowerCase(), createdAt: new Date(), updatedAt: new Date() };
}

function makeDelta(overrides: Partial<TrackMusicianDelta> & { trackId: string; present: boolean }): TrackMusicianDelta {
  return {
    musician: {
      id: "musician-1",
      name: "Mike Greenfield",
      slug: "mike-greenfield",
      knownFrom: "Lotus",
      defaultInstrument: null,
    },
    instruments: [makeInstrument("drums")],
    ...overrides,
  };
}

function renderContent(content: React.ReactNode) {
  return render(<MemoryRouter>{content}</MemoryRouter>);
}

describe("deriveFootnotes", () => {
  test("annotation-only input numbers in track order and dedupes identical descriptions", () => {
    const tracks = [{ id: "t1" }, { id: "t2" }, { id: "t3" }];
    const sources = annotationFootnoteSources([
      makeAnnotation("t1", "Dyslexic Munchkin Invasion"),
      makeAnnotation("t2", "Dyslexic Munchkin Invasion"),
      makeAnnotation("t3", "Tela tease"),
    ]);

    const { trackFootnoteIndices, orderedFootnotes } = deriveFootnotes(tracks, sources);

    expect(orderedFootnotes.map((f) => f.index)).toEqual([1, 2]);
    expect(trackFootnoteIndices.get("t1")).toEqual([1]);
    expect(trackFootnoteIndices.get("t2")).toEqual([1]);
    expect(trackFootnoteIndices.get("t3")).toEqual([2]);
  });

  test("a track's markers are sorted ascending even when a higher index is collected first", () => {
    // t1 gets a brand-new note (becomes #1). t2 gets that same note (#1) plus a
    // new one (#2). t1 is then revisited via a third source for note #2's text,
    // so t1 collects [1] then [2] — already ascending — but t3 collects #2 then
    // #1, which must render as [1, 2].
    const tracks = [{ id: "t1" }, { id: "t2" }, { id: "t3" }];
    const sources = annotationFootnoteSources([
      makeAnnotation("t1", "alpha"),
      makeAnnotation("t2", "beta"),
      makeAnnotation("t3", "beta"),
      makeAnnotation("t3", "alpha"),
    ]);

    const { trackFootnoteIndices } = deriveFootnotes(tracks, sources);

    // alpha=1 (first seen on t1), beta=2 (first seen on t2). t3 saw beta then
    // alpha, but renders ascending.
    expect(trackFootnoteIndices.get("t3")).toEqual([1, 2]);
  });

  test("annotations are numbered before performer footnotes on the same track", () => {
    const tracks = [{ id: "t1" }];
    const sources: FootnoteSource[] = [
      ...annotationFootnoteSources([makeAnnotation("t1", "Tela tease")]),
      ...synthesizePerformerFootnotes([makeDelta({ trackId: "t1", present: true })]),
    ];

    const { trackFootnoteIndices } = deriveFootnotes(tracks, sources);

    expect(trackFootnoteIndices.get("t1")).toEqual([1, 2]);
  });
});

describe("synthesizePerformerFootnotes", () => {
  test("a sit-in reads 'with <linked name> on <instruments>', no known-from parenthetical", () => {
    const [source] = synthesizePerformerFootnotes([
      makeDelta({ trackId: "t1", present: true, instruments: [makeInstrument("guitar"), makeInstrument("keys")] }),
    ]);
    renderContent(source.content);

    expect(screen.getByText("Mike Greenfield").closest("a")).toHaveAttribute("href", "/musicians/mike-greenfield");
    expect(screen.getByText(/with/)).toHaveTextContent("with Mike Greenfield on guitar, keys");
  });

  test("no instruments omits the 'on ...' clause", () => {
    const [source] = synthesizePerformerFootnotes([makeDelta({ trackId: "t1", present: true, instruments: [] })]);
    renderContent(source.content);

    expect(screen.getByText(/with/)).toHaveTextContent("with Mike Greenfield");
  });

  test("multiple sit-ins on one track combine into a single footnote", () => {
    const sources = synthesizePerformerFootnotes([
      makeDelta({
        trackId: "t1",
        present: true,
        musician: {
          id: "m-cotter",
          name: "Cotter Ellis",
          slug: "cotter-ellis",
          knownFrom: null,
          defaultInstrument: null,
        },
        instruments: [makeInstrument("drums")],
      }),
      makeDelta({
        trackId: "t1",
        present: true,
        musician: {
          id: "m-peter",
          name: "Peter Anspach",
          slug: "peter-anspach",
          knownFrom: null,
          defaultInstrument: null,
        },
        instruments: [makeInstrument("keyboards")],
      }),
      makeDelta({
        trackId: "t1",
        present: true,
        musician: {
          id: "m-rick",
          name: "Rick Mitarotonda",
          slug: "rick-mitarotonda",
          knownFrom: null,
          defaultInstrument: null,
        },
        instruments: [makeInstrument("guitar")],
      }),
    ]);

    expect(sources).toHaveLength(1);
    renderContent(sources[0].content);
    expect(screen.getByText(/with/)).toHaveTextContent(
      "with Cotter Ellis on drums, Peter Anspach on keyboards, and Rick Mitarotonda on guitar",
    );
  });

  test("musicians who all play the same instrument share one trailing 'on <instrument>'", () => {
    const guitarists = ["Chris Michetti", "Tom Hamilton", "Mike Carter"].map((name, index) =>
      makeDelta({
        trackId: "t1",
        present: true,
        musician: {
          id: `m-${index}`,
          name,
          slug: name.toLowerCase().replace(/ /g, "-"),
          knownFrom: null,
          defaultInstrument: null,
        },
        instruments: [makeInstrument("guitar")],
      }),
    );

    const [source] = synthesizePerformerFootnotes(guitarists);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("with Chris Michetti, Tom Hamilton, and Mike Carter on guitar");
  });

  test("two musicians on the same instrument read 'A and B on <instrument>'", () => {
    const sources = synthesizePerformerFootnotes([
      makeDelta({
        trackId: "t1",
        present: true,
        musician: { id: "m-a", name: "Aron Magner", slug: "aron-magner", knownFrom: null, defaultInstrument: null },
        instruments: [makeInstrument("keyboards")],
      }),
      makeDelta({
        trackId: "t1",
        present: true,
        musician: {
          id: "m-b",
          name: "Marc Brownstein",
          slug: "marc-brownstein",
          knownFrom: null,
          defaultInstrument: null,
        },
        instruments: [makeInstrument("keyboards")],
      }),
    ]);
    const { container } = renderContent(sources[0].content);
    expect(container).toHaveTextContent("with Aron Magner and Marc Brownstein on keyboards");
  });

  test("musicians are grouped by instrument so a shared instrument reads once", () => {
    const beatboxers = ["Jon Gutwillig", "Aron Magner", "Eric Bernstein"].map((name, index) =>
      makeDelta({
        trackId: "t1",
        present: true,
        musician: {
          id: `m-${index}`,
          name,
          slug: name.toLowerCase().replace(/ /g, "-"),
          knownFrom: null,
          defaultInstrument: null,
        },
        instruments: [makeInstrument("beatbox")],
      }),
    );
    const rapper = makeDelta({
      trackId: "t1",
      present: true,
      musician: {
        id: "m-marc",
        name: "Marc Brownstein",
        slug: "marc-brownstein",
        knownFrom: null,
        defaultInstrument: null,
      },
      instruments: [makeInstrument("rap")],
    });

    const [source] = synthesizePerformerFootnotes([...beatboxers, rapper]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent(
      "with Jon Gutwillig, Aron Magner, and Eric Bernstein on beatbox, and Marc Brownstein on rap",
    );
  });

  test("a sit-in for an elevated guest is suppressed (it lives in the show note instead)", () => {
    const sources = synthesizePerformerFootnotes(
      [makeDelta({ trackId: "t1", present: true })],
      new Set(["musician-1"]),
    );
    expect(sources).toHaveLength(0);
  });

  test("a sat-out reads 'without <linked name> on <instruments>'", () => {
    const [source] = synthesizePerformerFootnotes([makeDelta({ trackId: "t1", present: false })]);
    renderContent(source.content);

    expect(screen.getByText(/without/)).toHaveTextContent("without Mike Greenfield on drums");
  });

  test("a sit-in and a sat-out on the same track combine into one footnote", () => {
    const sources = synthesizePerformerFootnotes([
      makeDelta({
        trackId: "t1",
        present: true,
        musician: { id: "m-ryan", name: "Ryan Stasik", slug: "ryan-stasik", knownFrom: null, defaultInstrument: null },
        instruments: [makeInstrument("bass")],
      }),
      makeDelta({
        trackId: "t1",
        present: false,
        musician: {
          id: "m-marc",
          name: "Marc Brownstein",
          slug: "marc-brownstein",
          knownFrom: null,
          defaultInstrument: null,
        },
        instruments: [],
      }),
    ]);

    expect(sources).toHaveLength(1);
    const { container } = renderContent(sources[0].content);
    expect(container).toHaveTextContent("with Ryan Stasik on bass, without Marc Brownstein");
  });

  test("the same sit-in across two tracks dedupes to one footnote both tracks reference", () => {
    const tracks = [{ id: "t1" }, { id: "t2" }];
    const sources = synthesizePerformerFootnotes([
      makeDelta({ trackId: "t1", present: true }),
      makeDelta({ trackId: "t2", present: true }),
    ]);

    const { trackFootnoteIndices, orderedFootnotes } = deriveFootnotes(tracks, sources);

    expect(orderedFootnotes).toHaveLength(1);
    expect(trackFootnoteIndices.get("t1")).toEqual([1]);
    expect(trackFootnoteIndices.get("t2")).toEqual([1]);
  });
});

describe("guestExclusionFootnotes", () => {
  const guest = { musicianId: "musician-1", name: "Sam Altman", slug: "sam-altman", absentTrackIds: ["t1", "t2"] };

  test("emits a 'without' footnote for each absent track when there are no sat-out deltas", () => {
    const sources = guestExclusionFootnotes([guest]);
    expect(sources.map((s) => s.trackId)).toEqual(["t1", "t2"]);
  });

  test("skips a track that already carries the guest's sat-out via a delta (no double 'without')", () => {
    // t1 has an explicit Sam sat-out delta — synthesizePerformerFootnotes
    // already footnotes "without Sam Altman" there, so the exclusion footnote
    // must not repeat it. t2 has no delta, so it still gets one.
    const deltas = [makeDelta({ trackId: "t1", present: false })];
    const sources = guestExclusionFootnotes([guest], deltas);
    expect(sources.map((s) => s.trackId)).toEqual(["t2"]);
  });
});

describe("buildDebutText", () => {
  test("an improvisation gets no debut text (jams aren't debuts)", () => {
    expect(buildDebutText({ slug: "jam", kind: "improvisation", authorName: null })).toBeNull();
  });

  test("an original with no known author reads 'debut (original - unknown author)'", () => {
    expect(buildDebutText({ slug: "story", kind: "original", authorName: null })).toBe("debut (original - unknown author)");
  });

  test("an original with a known author names it: 'debut (original - X)'", () => {
    expect(buildDebutText({ slug: "story", kind: "original", authorName: "Jon Gutwillig" })).toBe(
      "debut (original - Jon Gutwillig)",
    );
  });

  test("null kind is treated as an original", () => {
    expect(buildDebutText({ slug: "story", kind: null, authorName: null })).toBe("debut (original - unknown author)");
  });

  test("a cover with a known author names the origin", () => {
    expect(buildDebutText({ slug: "shimmy", kind: "cover", authorName: "System of a Down" })).toBe(
      "debut (System of a Down)",
    );
  });

  test("a cover with no author flags the missing attribution", () => {
    expect(buildDebutText({ slug: "shimmy", kind: "cover", authorName: null })).toBe(
      "debut (cover - unknown author)",
    );
  });

  test("a mashup with known artists names them", () => {
    expect(buildDebutText({ slug: "doorbell", kind: "mashup", authorName: "Tractorbeam & Kid Cudi" })).toBe(
      "debut (Tractorbeam & Kid Cudi mashup)",
    );
  });

  test("a mashup with no author reads 'debut (mashup)'", () => {
    expect(buildDebutText({ slug: "doorbell", kind: "mashup", authorName: null })).toBe("debut (mashup)");
  });
});

describe("debutFootnoteSources", () => {
  test("a debut composition emits a 'debut (original - unknown author)' source", () => {
    const sources = debutFootnoteSources([
      makeTrack({ id: "t1", gap: null, song: { slug: "story", kind: "original", authorName: null } }),
    ]);
    expect(sources).toHaveLength(1);
    expect(sources[0].content).toBe("debut (original - unknown author)");
    expect(sources[0].trackId).toBe("t1");
  });

  test("a debut improvisation emits nothing", () => {
    const sources = debutFootnoteSources([
      makeTrack({
        id: "t1",
        gap: null,
        song: { slug: "jam", kind: "improvisation", authorName: null },
      }),
    ]);
    expect(sources).toHaveLength(0);
  });

  test("a non-debut track (gap set) emits nothing", () => {
    const sources = debutFootnoteSources([makeTrack({ id: "t1", gap: 12 })]);
    expect(sources).toHaveLength(0);
  });

  test("multiple original debuts in one show share a single footnote (deduped by text)", () => {
    const tracks = [makeTrack({ id: "t1", songId: "s1", gap: null }), makeTrack({ id: "t2", songId: "s2", gap: null })];
    const { orderedFootnotes, trackFootnoteIndices } = deriveFootnotes(tracks, debutFootnoteSources(tracks));
    expect(orderedFootnotes).toHaveLength(1);
    expect(trackFootnoteIndices.get("t1")).toEqual([1]);
    expect(trackFootnoteIndices.get("t2")).toEqual([1]);
  });
});

describe("lastTimePlayedFootnoteSources", () => {
  const previousPerformanceShow = { date: "2007-02-15", slug: "2007-02-15-foo" };

  test("a gap below the threshold emits no source", () => {
    const sources = lastTimePlayedFootnoteSources([makeTrack({ id: "t1", gap: 39, previousPerformanceShow })], 40);
    expect(sources).toHaveLength(0);
  });

  test("a gap at the threshold emits a source (boundary is inclusive)", () => {
    const sources = lastTimePlayedFootnoteSources([makeTrack({ id: "t1", gap: 40, previousPerformanceShow })], 40);
    expect(sources).toHaveLength(1);
    expect(sources[0].trackId).toBe("t1");
  });

  test("a debut (null gap) emits no last-time-played source", () => {
    const sources = lastTimePlayedFootnoteSources([makeTrack({ id: "t1", gap: null, previousPerformanceShow })], 40);
    expect(sources).toHaveLength(0);
  });

  // An improvisation is a unique jam, so "last played N shows ago" is meaningless.
  test("an improvisation emits no last-time-played source even past the threshold", () => {
    const sources = lastTimePlayedFootnoteSources(
      [
        makeTrack({
          id: "t1",
          gap: 241,
          previousPerformanceShow,
          song: { slug: "jam", kind: "improvisation", authorName: null },
        }),
      ],
      40,
    );
    expect(sources).toHaveLength(0);
  });

  test("the content links to the previous show and states the gap", () => {
    const [source] = lastTimePlayedFootnoteSources([makeTrack({ id: "t1", gap: 241, previousPerformanceShow })], 40);
    renderContent(source.content);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/shows/2007-02-15-foo");
    expect(screen.getByText(/last played/)).toHaveTextContent("241 shows");
  });
});

describe("dataDrivenFootnoteSources", () => {
  const earlier = [{ date: "2025-11-14", slug: "2025-11-14-earlier" }];
  const later = [{ date: "2025-11-16", slug: "2025-11-16-later" }];

  // Every data-driven marker on a track collapses to ONE footnote line.
  test("a single flag renders one lowercase footnote", () => {
    const [source] = dataDrivenFootnoteSources([makeTrack({ id: "t1", flags: ["DYSLEXIC"] })]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("dyslexic");
    expect(source.trackId).toBe("t1");
  });

  // The dyslexic / inverted labels link to their explainers on the music
  // terminology page; other flags have no glossary entry and stay plain text.
  test("the dyslexic flag label links to its music-terminology explainer", () => {
    const [source] = dataDrivenFootnoteSources([makeTrack({ id: "t1", flags: ["DYSLEXIC"] })]);
    renderContent(source.content);
    expect(screen.getByRole("link", { name: "dyslexic" })).toHaveAttribute("href", "/resources/music#dyslexic");
  });

  test("the inverted flag label links to its music-terminology explainer", () => {
    const [source] = dataDrivenFootnoteSources([makeTrack({ id: "t1", flags: ["INVERTED"] })]);
    renderContent(source.content);
    expect(screen.getByRole("link", { name: "inverted" })).toHaveAttribute("href", "/resources/music#inverted");
  });

  test("a flag with no glossary entry (unfinished) stays plain text, not a link", () => {
    const [source] = dataDrivenFootnoteSources([makeTrack({ id: "t1", flags: ["UNFINISHED"] })]);
    renderContent(source.content);
    expect(screen.queryByRole("link")).toBeNull();
  });

  test("multiple flags merge onto one line in fixed order", () => {
    // Stored out of display order; rendered dyslexic, inverted, unfinished.
    const [source] = dataDrivenFootnoteSources([
      makeTrack({ id: "t1", flags: ["UNFINISHED", "INVERTED", "DYSLEXIC"] }),
    ]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("dyslexic, inverted, unfinished");
  });

  test("a track with no markers emits nothing", () => {
    expect(dataDrivenFootnoteSources([makeTrack({ id: "t1", flags: [] })])).toHaveLength(0);
  });

  test("two partial-only flags share a single 'only' (middle and ending only)", () => {
    const [source] = dataDrivenFootnoteSources([makeTrack({ id: "t1", flags: ["ENDING_ONLY", "MIDDLE_ONLY"] })]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("middle and ending only");
  });

  test("all three partial-only flags combine in display order", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({ id: "t1", flags: ["ENDING_ONLY", "BEGINNING_ONLY", "MIDDLE_ONLY"] }),
    ]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("beginning, middle and ending only");
  });

  test("a partial-only flag mixed with a regular flag keeps both segments", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({ id: "t1", flags: ["DYSLEXIC", "MIDDLE_ONLY", "ENDING_ONLY"] }),
    ]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("dyslexic, middle and ending only");
  });

  test("a single partial-only flag is unchanged", () => {
    const [source] = dataDrivenFootnoteSources([makeTrack({ id: "t1", flags: ["MIDDLE_ONLY"] })]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("middle only");
  });

  test("identical marker sets across tracks share one footnote number", () => {
    const sources = dataDrivenFootnoteSources([
      makeTrack({ id: "t1", flags: ["INVERTED"] }),
      makeTrack({ id: "t2", flags: ["INVERTED"] }),
    ]);
    expect(new Set(sources.map((s) => s.dedupeKey)).size).toBe(1);
  });

  test("the completes clause links the earlier show and lists it last", () => {
    const [source] = dataDrivenFootnoteSources([makeTrack({ id: "t1", completes: earlier })]);
    renderContent(source.content);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/shows/2025-11-14-earlier");
    expect(screen.getByText(/completes/)).toHaveTextContent("completes 11/14/2025 version");
  });

  test("the completed-by clause links the later show", () => {
    const [source] = dataDrivenFootnoteSources([makeTrack({ id: "t1", completedBy: later })]);
    renderContent(source.content);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/shows/2025-11-16-later");
    expect(screen.getByText(/completed by/)).toHaveTextContent("completed by 11/16/2025 version");
  });

  // Sometimes a track completes an earlier version of a DIFFERENTLY-NAMED song;
  // the mapper sets `otherSongTitle`, and the footnote names it with "of <name>".
  test("the completes clause names the other song when it differs", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({ id: "t1", completes: [{ date: "2025-11-14", slug: "2025-11-14-earlier", otherSongTitle: "Spaga" }] }),
    ]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("completes 11/14/2025 version of Spaga");
  });

  test("the completed-by clause names the other song when it differs", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({ id: "t1", completedBy: [{ date: "2025-11-16", slug: "2025-11-16-later", otherSongTitle: "Spaga" }] }),
    ]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("completed by 11/16/2025 version of Spaga");
  });

  // Two tracks completing different other-songs must not collapse to one footnote.
  test("the other song name is part of the dedupe key", () => {
    const sources = dataDrivenFootnoteSources([
      makeTrack({ id: "t1", completes: [{ date: "2025-11-14", slug: "2025-11-14-a", otherSongTitle: "Spaga" }] }),
      makeTrack({ id: "t2", completes: [{ date: "2025-11-14", slug: "2025-11-14-a", otherSongTitle: "Munchkin" }] }),
    ]);
    expect(new Set(sources.map((s) => s.dedupeKey)).size).toBe(2);
  });

  // One ending can finish several earlier versions — both link, noun pluralizes.
  test("lists every completed version and pluralizes", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({
        id: "t1",
        completes: [
          { date: "2014-02-20", slug: "2014-02-20" },
          { date: "2014-02-21", slug: "2014-02-21" },
        ],
      }),
    ]);
    renderContent(source.content);
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByText(/completes/)).toHaveTextContent("completes 2/20/2014, 2/21/2014 versions");
  });

  // Flags + completion combine on one line, flags first then the completion.
  test("an ending-only track reads 'ending only, completes …' on one line", () => {
    const [source] = dataDrivenFootnoteSources([makeTrack({ id: "t1", completes: earlier, flags: ["ENDING_ONLY"] })]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("ending only, completes 11/14/2025 version");
  });

  test("an unfinished track reads 'unfinished, completed by …' on one line", () => {
    const [source] = dataDrivenFootnoteSources([makeTrack({ id: "t1", completedBy: later, flags: ["UNFINISHED"] })]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("unfinished, completed by 11/16/2025 version");
  });

  // A flag carrying first-time recurrence reads "<label>, 1st time".
  test("a first-time flag recurrence reads '<label>, 1st time'", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({
        id: "t1",
        flags: ["DYSLEXIC"],
        flagRecurrences: [{ flag: "DYSLEXIC", versionGap: null, gap: null, lastPlayed: null }],
      }),
    ]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("dyslexic, 1st time");
  });

  // A first-ever flag that arrives late in the song's life (versionGap set by the
  // mapper because it cleared the threshold) appends "(played X versions)".
  test("a first-time flag recurrence after many versions reads '1st time (played X versions)'", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({
        id: "t1",
        flags: ["INVERTED"],
        flagRecurrences: [{ flag: "INVERTED", versionGap: 47, gap: null, lastPlayed: null }],
      }),
    ]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("inverted, 1st time (after 47 played versions)");
  });

  // A first-ever segue recurrence after many versions appends "(played X versions)".
  test("a first-time standalone after many versions reads '1st standalone version (played X versions)'", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({ id: "t1", segueRecurrences: [{ kind: "STANDALONE", versionGap: 200, gap: null, lastPlayed: null }] }),
    ]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("1st standalone version (after 200 played versions)");
  });

  // A repeat flag recurrence links the prior date and states both gaps.
  test("a repeat flag recurrence reads '<label>, last time <date> (N versions ago; M shows ago)'", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({
        id: "t1",
        flags: ["INVERTED"],
        flagRecurrences: [
          { flag: "INVERTED", versionGap: 22, gap: 140, lastPlayed: { date: "2024-05-02", slug: "2024-05-02-foo" } },
        ],
      }),
    ]);
    const { container } = renderContent(source.content);
    // The label links to the glossary; the date links to the prior show.
    expect(screen.getByRole("link", { name: "inverted" })).toHaveAttribute("href", "/resources/music#inverted");
    expect(screen.getByRole("link", { name: "5/2/2024" })).toHaveAttribute("href", "/shows/2024-05-02-foo");
    expect(container).toHaveTextContent("inverted, last time 5/2/2024 (22 versions ago; 140 shows ago)");
  });

  // A first-ever standalone segue recurrence reads "1st standalone version".
  test("a first-time standalone segue recurrence reads '1st standalone version'", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({
        id: "t1",
        segueRecurrences: [{ kind: "STANDALONE", versionGap: null, gap: null, lastPlayed: null }],
      }),
    ]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("1st standalone version");
  });

  // An improvisation is inherently a standalone jam, so the standalone /
  // segue-in / segue-out footnotes are noise and don't render for it.
  test("an improvisation song emits no segue-recurrence footnote", () => {
    const sources = dataDrivenFootnoteSources([
      makeTrack({
        id: "t1",
        song: { slug: "jam", kind: "improvisation", authorName: null },
        segueRecurrences: [{ kind: "STANDALONE", versionGap: null, gap: null, lastPlayed: null }],
      }),
    ]);
    expect(sources).toHaveLength(0);
  });

  // Each segue kind has its own wording; a repeat appends "since <date> (N versions ago; M shows ago)".
  test("a repeat not-segued-in recurrence reads '1st version not segued into since <date> (N versions ago; M shows ago)'", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({
        id: "t1",
        segueRecurrences: [
          {
            kind: "NOT_SEGUED_IN",
            versionGap: 30,
            gap: 88,
            lastPlayed: { date: "2023-01-15", slug: "2023-01-15-bar" },
          },
        ],
      }),
    ]);
    renderContent(source.content);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/shows/2023-01-15-bar");
    expect(screen.getByText(/not segued into/)).toHaveTextContent(
      "1st version not segued into since 1/15/2023 (30 versions ago; 88 shows ago)",
    );
  });

  test("a not-segued-out recurrence reads '1st version not segued out'", () => {
    const [source] = dataDrivenFootnoteSources([
      makeTrack({
        id: "t1",
        segueRecurrences: [{ kind: "NOT_SEGUED_OUT", versionGap: null, gap: null, lastPlayed: null }],
      }),
    ]);
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("1st version not segued out");
  });

  // A song played twice in one show: only the notable performance carries the
  // recurrence (the same-show repeat is gated out server-side), but BOTH markers
  // should read the same — the recurrence note is shared across the song's
  // tracks so they collapse to one footnote number.
  test("a song's recurrence is shared across its repeated performances in a show", () => {
    const tracks = [
      // First (notable) performance carries the recurrence.
      makeTrack({
        id: "early",
        songId: "home-again",
        flags: ["DYSLEXIC"],
        flagRecurrences: [
          { flag: "DYSLEXIC", versionGap: 84, gap: 865, lastPlayed: { date: "2007-07-22", slug: "2007-07-22-x" } },
        ],
      }),
      // Same-show repeat: flagged dyslexic but the recurrence was gated out.
      makeTrack({ id: "encore", songId: "home-again", flags: ["DYSLEXIC"], flagRecurrences: [] }),
    ];
    const { orderedFootnotes, trackFootnoteIndices } = deriveFootnotes(tracks, dataDrivenFootnoteSources(tracks));
    // Both tracks point at a single shared footnote.
    expect(orderedFootnotes).toHaveLength(1);
    expect(trackFootnoteIndices.get("early")).toEqual([1]);
    expect(trackFootnoteIndices.get("encore")).toEqual([1]);
    const { container } = renderContent(orderedFootnotes[0].content);
    expect(container).toHaveTextContent("dyslexic, last time 7/22/2007 (84 versions ago; 865 shows ago)");
  });

  // Flag recurrence, segue recurrence, and a completion all merge onto one line.
  test("flag + segue recurrence + completion all merge onto one footnote line", () => {
    const sources = dataDrivenFootnoteSources([
      makeTrack({
        id: "t1",
        flags: ["DYSLEXIC"],
        flagRecurrences: [{ flag: "DYSLEXIC", versionGap: null, gap: null, lastPlayed: null }],
        segueRecurrences: [{ kind: "STANDALONE", versionGap: null, gap: null, lastPlayed: null }],
        completes: earlier,
      }),
    ]);
    expect(sources).toHaveLength(1);
    const { container } = renderContent(sources[0].content);
    expect(container).toHaveTextContent("dyslexic, 1st time, 1st standalone version, completes 11/14/2025 version");
  });

  // suppressRecurrences drops the gap-derived recurrence clauses for the
  // scattered early era, but keeps the flag and completion themselves.
  test("suppressRecurrences drops the flag recurrence suffix but keeps the flag and completion", () => {
    const [source] = dataDrivenFootnoteSources(
      [
        makeTrack({
          id: "t1",
          flags: ["INVERTED"],
          flagRecurrences: [
            { flag: "INVERTED", versionGap: 22, gap: 140, lastPlayed: { date: "2024-05-02", slug: "2024-05-02-foo" } },
          ],
          completes: earlier,
        }),
      ],
      { suppressRecurrences: true },
    );
    const { container } = renderContent(source.content);
    expect(container).toHaveTextContent("inverted, completes 11/14/2025 version");
    expect(container).not.toHaveTextContent("last time");
  });

  test("suppressRecurrences drops a segue recurrence clause entirely", () => {
    const sources = dataDrivenFootnoteSources(
      [
        makeTrack({
          id: "t1",
          segueRecurrences: [{ kind: "STANDALONE", versionGap: 200, gap: null, lastPlayed: null }],
        }),
      ],
      { suppressRecurrences: true },
    );
    expect(sources).toHaveLength(0);
  });

  // Both directions plus extra flags all land on the same single line.
  test("flags and both completion directions all merge onto one footnote", () => {
    const sources = dataDrivenFootnoteSources([
      makeTrack({ id: "t1", flags: ["DYSLEXIC", "ENDING_ONLY"], completes: earlier, completedBy: later }),
    ]);
    expect(sources).toHaveLength(1);
    const { container } = renderContent(sources[0].content);
    expect(container).toHaveTextContent(
      "dyslexic, ending only, completes 11/14/2025 version, completed by 11/16/2025 version",
    );
  });
});
