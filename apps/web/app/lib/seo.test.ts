import type { Setlist, Venue } from "@bip/domain";
import { describe, expect, it } from "vitest";
import { getShowMeta, getVenueMeta } from "./seo";

/**
 * Page titles/descriptions are built from the venue location. International
 * venues store a null state, which used to render as the literal "null" in the
 * tab title ("Reykjavik, null"). These pin that the country fills in instead.
 */
function titleContent(meta: Array<Record<string, unknown>>): string {
  const tag = meta.find((m) => m.title !== undefined);
  return String(tag?.title ?? "");
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
