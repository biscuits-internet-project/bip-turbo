import { describe, expect, test } from "vitest";
import { resolveRatingMode } from "./rating-mode";

// The single place that decides whether a viewer sees the simple or calibrated
// score. Master gate wins; then the user's explicit pref; then the app default.
describe("resolveRatingMode", () => {
  test("master gate off means everyone sees simple, regardless of pref or default", () => {
    expect(resolveRatingMode(true, { calibratedEnabled: false, defaultCalibrated: true })).toBe("simple");
    expect(resolveRatingMode(null, { calibratedEnabled: false, defaultCalibrated: true })).toBe("simple");
  });

  test("explicit user pref wins over the default when the gate is on", () => {
    expect(resolveRatingMode(true, { calibratedEnabled: true, defaultCalibrated: false })).toBe("calibrated");
    expect(resolveRatingMode(false, { calibratedEnabled: true, defaultCalibrated: true })).toBe("simple");
  });

  test("no explicit pref falls to the app default", () => {
    expect(resolveRatingMode(null, { calibratedEnabled: true, defaultCalibrated: true })).toBe("calibrated");
    expect(resolveRatingMode(null, { calibratedEnabled: true, defaultCalibrated: false })).toBe("simple");
    expect(resolveRatingMode(undefined, { calibratedEnabled: true, defaultCalibrated: false })).toBe("simple");
  });
});
