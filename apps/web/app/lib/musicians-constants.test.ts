import type { ShowLineupMember } from "@bip/domain";
import { describe, expect, test } from "vitest";
import { classifyMusician, DRUMMER_ERAS, isOutsideEra, sortLineup } from "./musicians-constants";

function member(name: string, slug: string): ShowLineupMember {
  return {
    musician: { id: `m-${slug}`, name, slug, knownFrom: null, defaultInstrument: null },
    instruments: [],
  };
}

describe("classifyMusician", () => {
  test("a drummer slug classifies as drummer, even though Marlon Lewis is also in the lineup", () => {
    expect(classifyMusician("marlon-lewis")).toBe("drummer");
    expect(classifyMusician("sam-altman")).toBe("drummer");
  });

  test("a permanent guitar/bass/keys member classifies as core", () => {
    expect(classifyMusician("jon-gutwillig")).toBe("core");
    expect(classifyMusician("marc-brownstein")).toBe("core");
    expect(classifyMusician("aron-magner")).toBe("core");
  });

  test("anyone else classifies as guest", () => {
    expect(classifyMusician("mike-greenfield")).toBe("guest");
  });
});

describe("sortLineup", () => {
  test("orders core members Jon, Aron, Marc then the drummer, then alphabetized guests, regardless of input order", () => {
    const lineup = [
      member("Mike Greenfield", "mike-greenfield"),
      member("Allen Aucoin", "allen-aucoin"),
      member("Marc Brownstein", "marc-brownstein"),
      member("Aron Magner", "aron-magner"),
      member("Borahm Lee", "borahm-lee"),
      member("Jon Gutwillig", "jon-gutwillig"),
    ];

    expect(sortLineup(lineup).map((m) => m.musician.slug)).toEqual([
      "jon-gutwillig",
      "aron-magner",
      "marc-brownstein",
      "allen-aucoin",
      "borahm-lee",
      "mike-greenfield",
    ]);
  });

  test("does not mutate the input array", () => {
    const lineup = [member("Marc Brownstein", "marc-brownstein"), member("Jon Gutwillig", "jon-gutwillig")];
    sortLineup(lineup);
    expect(lineup.map((m) => m.musician.slug)).toEqual(["marc-brownstein", "jon-gutwillig"]);
  });
});

describe("isOutsideEra", () => {
  test("a date before the era start is outside", () => {
    expect(isOutsideEra(new Date("2024-01-01"), DRUMMER_ERAS["marlon-lewis"])).toBe(true);
  });

  test("a date inside the era is not outside", () => {
    expect(isOutsideEra(new Date("2026-01-01"), DRUMMER_ERAS["marlon-lewis"])).toBe(false);
  });

  test("a date after a closed era end is outside", () => {
    expect(isOutsideEra(new Date("2026-01-01"), DRUMMER_ERAS["allen-aucoin"])).toBe(true);
  });
});
