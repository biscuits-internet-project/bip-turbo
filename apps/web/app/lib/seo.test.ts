import type { Setlist, Song, Venue } from "@bip/domain";
import { describe, expect, it } from "vitest";
import { getShowMeta, getSongMeta, getVenueMeta } from "./seo";

/**
 * Page titles/descriptions are built from the venue location. International
 * venues store a null state, which used to render as the literal "null" in the
 * tab title ("Reykjavik, null"). These pin that the country fills in instead.
 */
function titleContent(meta: Array<Record<string, unknown>>): string {
  const tag = meta.find((m) => m.title !== undefined);
  return String(tag?.title ?? "");
}

function descriptionContent(meta: Array<Record<string, unknown>>): string {
  const tag = meta.find((m) => m.name === "description");
  return String(tag?.content ?? "");
}

const harpa = {
  id: "v1",
  name: "Harpa Concert Hall",
  slug: "harpa-concert-hall",
  city: "Reykjavik",
  state: null,
  country: "Iceland",
  createdAt: new Date(),
  updatedAt: new Date(),
  timesPlayed: 1,
} as unknown as Venue;

describe("getVenueMeta", () => {
  it("uses the country when the venue has no state (no 'null' in the title)", () => {
    const title = titleContent(getVenueMeta(harpa));
    expect(title).toContain("Reykjavik, Iceland");
    expect(title).not.toContain("null");
  });
});

describe("getShowMeta", () => {
  it("uses the country when the show's venue has no state", () => {
    const setlist = {
      show: { slug: "2023-05-22-harpa", date: "2023-05-22", venue: harpa },
      sets: [],
    } as unknown as Setlist;
    const title = titleContent(getShowMeta(setlist));
    expect(title).toContain("Reykjavik, Iceland");
    expect(title).not.toContain("null");
  });
});

function song(overrides: Partial<Song>): Song {
  return {
    id: "s1",
    title: "Caves of the East x Something About Us",
    slug: "caves-of-the-east-x-something-about-us",
    timesPlayed: 1,
    ...overrides,
  } as unknown as Song;
}

/**
 * The by-line names whoever actually wrote the song. Attributing every song to
 * the band put "Dancing Queen by The Disco Biscuits" in the tab title and the
 * search snippet for covers and mashups alike.
 */
describe("getSongMeta", () => {
  it("credits the song's authors rather than the band", () => {
    const meta = getSongMeta(song({ authorName: "Marc Brownstein, Daft Punk" }));
    expect(titleContent(meta)).toContain("by Marc Brownstein, Daft Punk");
    expect(descriptionContent(meta)).toContain("by Marc Brownstein, Daft Punk");
  });

  it.each([
    ["null", null],
    ["undefined", undefined],
    ["empty", ""],
  ])("falls back to the band when a song's authorName is %s", (_label, authorName) => {
    const title = titleContent(getSongMeta(song({ title: "Simulations", authorName })));
    expect(title).toContain("Simulations by The Disco Biscuits");
  });
});
