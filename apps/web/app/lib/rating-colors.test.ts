import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import {
  RATING_COLOR_GREEN,
  RATING_COLOR_NEUTRAL,
  RATING_COLOR_PURPLE,
  RATING_COLOR_TOKENS,
  ratingColor,
} from "./rating-colors";

describe("ratingColor", () => {
  test("renders the pivot in the neutral text color", () => {
    expect(ratingColor(3.5)).toBe(RATING_COLOR_NEUTRAL);
  });

  test("renders a perfect rating in full brand green", () => {
    expect(ratingColor(5)).toBe(RATING_COLOR_GREEN);
  });

  test("renders the bottom of the scale in full brand purple", () => {
    expect(ratingColor(0.5)).toBe(RATING_COLOR_PURPLE);
  });

  test("clamps beyond the ramp ends rather than overshooting", () => {
    expect(ratingColor(5.4)).toBe(RATING_COLOR_GREEN);
    expect(ratingColor(0.2)).toBe(RATING_COLOR_PURPLE);
  });

  // The two sides reach their end at different distances (0.5 and 5.0 are not
  // equidistant from the 3.5 pivot), so each midpoint is checked against its
  // own span rather than a shared one.
  test("blends halfway between neutral and each end at that side's midpoint", () => {
    expect(ratingColor(4.25)).toBe(mixHex(RATING_COLOR_NEUTRAL, RATING_COLOR_GREEN, 0.5));
    expect(ratingColor(2)).toBe(mixHex(RATING_COLOR_NEUTRAL, RATING_COLOR_PURPLE, 0.5));
  });

  // The reason the ramp reaches all the way to 0.5: a symmetric span clamped
  // everything at or below 2.0 to one flat purple, which erased the difference
  // between a ½ and a 2 wherever a low rating actually appears.
  test("gives every half-step on the scale a distinct color", () => {
    const buckets = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const colors = buckets.map(ratingColor);
    expect(new Set(colors).size).toBe(buckets.length);
  });

  test("moves monotonically away from neutral as the rating climbs", () => {
    const greens = [3.5, 4, 4.5, 5].map((v) => channels(ratingColor(v)));
    for (let i = 1; i < greens.length; i++) {
      // Brand green is the only endpoint with less red than neutral, so red
      // falling on every step proves the blend advances rather than plateaus.
      expect(greens[i][0]).toBeLessThan(greens[i - 1][0]);
    }
  });
});

// The ramp can't read its endpoints from CSS (it interpolates between them, so
// it needs numeric channels), so the hex literals restate three design tokens.
// This is the guard on that duplication: retuning a token without updating the
// ramp fails here instead of silently leaving rating values on the old color —
// the same drift that left the badge chrome on amber-500 after the rating-gold
// token replaced it.
describe("ramp endpoints vs. the design tokens they mirror", () => {
  // Read off disk rather than imported: vitest stubs CSS imports, so both
  // `../styles.css` and `?raw` resolve to an empty string here and every
  // assertion below would pass against nothing.
  const stylesheet = readFileSync(resolve(process.cwd(), "app/styles.css"), "utf-8");

  test("reads the real stylesheet", () => {
    expect(stylesheet).toContain("@theme");
  });

  for (const [token, expected] of Object.entries(RATING_COLOR_TOKENS)) {
    test(`${token} still equals ${expected}`, () => {
      const match = stylesheet.match(new RegExp(`${token}:\\s*hsl\\(([\\d.]+)\\s+([\\d.]+)%\\s+([\\d.]+)%\\)`));
      expect(match, `${token} not found as an hsl() value in styles.css`).not.toBeNull();
      const [, hue, saturation, lightness] = match as RegExpMatchArray;
      expect(hslToHex(Number(hue), Number(saturation), Number(lightness))).toBe(expected);
    });
  }
});

function hslToHex(hue: number, saturationPercent: number, lightnessPercent: number): string {
  const saturation = saturationPercent / 100;
  const lightness = lightnessPercent / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const second = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const lightest = lightness - chroma / 2;
  const [red, green, blue] =
    hue < 60
      ? [chroma, second, 0]
      : hue < 120
        ? [second, chroma, 0]
        : hue < 180
          ? [0, chroma, second]
          : hue < 240
            ? [0, second, chroma]
            : hue < 300
              ? [second, 0, chroma]
              : [chroma, 0, second];
  return `#${[red, green, blue]
    .map((channel) =>
      Math.round((channel + lightest) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

function channels(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function mixHex(from: string, to: string, t: number): string {
  const a = channels(from);
  const b = channels(to);
  const mixed = a.map((channel, i) => Math.round(channel + (b[i] - channel) * t));
  return `#${mixed.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}
