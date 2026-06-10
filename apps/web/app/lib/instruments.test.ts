import type { Instrument } from "@bip/domain";
import { describe, expect, test } from "vitest";
import { formatInstrumentNames, sortInstrumentNames } from "./instruments";

const instrument = (name: string): Instrument => ({
  id: name,
  name,
  slug: name,
  createdAt: new Date(0),
  updatedAt: new Date(0),
});

describe("formatInstrumentNames", () => {
  // The DB stores instruments in attach order, which floats "vocals" wherever it
  // was added (e.g. Jon Gutwillig saved as [vocals, guitar]). Display sorts so the
  // list reads the same regardless: "guitar, vocals".
  test("joins instrument names alphabetically, not in array order", () => {
    expect(formatInstrumentNames([instrument("vocals"), instrument("guitar")])).toBe("guitar, vocals");
  });

  test("sorts case-insensitively", () => {
    expect(formatInstrumentNames([instrument("Vocals"), instrument("guitar"), instrument("Bass")])).toBe(
      "Bass, guitar, Vocals",
    );
  });

  test("returns an empty string for no instruments", () => {
    expect(formatInstrumentNames([])).toBe("");
  });
});

describe("sortInstrumentNames", () => {
  test("sorts a name list alphabetically without mutating the input", () => {
    const input = ["vocals", "guitar", "keys"];
    expect(sortInstrumentNames(input)).toEqual(["guitar", "keys", "vocals"]);
    expect(input).toEqual(["vocals", "guitar", "keys"]);
  });
});
