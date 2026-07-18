import { join } from "node:path";
import { beforeAll, describe, expect, test } from "vitest";
import { controlVisibleUnderGate, getFeatureFlags } from "./index";

/**
 * Validates the committed `quonfig/` workspace parses and resolves to the
 * intended launch flag posture, guarding against a malformed flag/segment file.
 */
beforeAll(() => {
  // Point the singleton at the repo-root workspace (tests run with cwd=packages/core).
  process.env.QUONFIG_DATADIR = join(import.meta.dirname, "..", "..", "..", "..", "..", "quonfig");
  process.env.QUONFIG_ENVIRONMENT = "development";
});

describe("committed quonfig workspace", () => {
  test("flag posture: feature on, default simple, toggle open to everyone, compare author-only", async () => {
    const anon = await getFeatureFlags();
    expect(anon.calibratedEnabled).toBe(true); // feature runs in prod
    expect(anon.recomputeEnabled).toBe(true); // cron runs from day one
    expect(anon.defaultCalibrated).toBe(false); // default stays simple (opt-in)
    expect(anon.toggleVisible).toBe(true); // opt-in toggle open to everyone
    expect(anon.compareVisible).toBe(false); // debug overlay stays author-only
    expect(anon.explainerNavLink).toBe(false); // page reachable by URL; nav link off
  });

  test("the compare/debug overlay is limited to the author", async () => {
    const author = await getFeatureFlags({ user: { username: "evan" } });
    expect(author.toggleVisible).toBe(true);
    expect(author.compareVisible).toBe(true);

    const other = await getFeatureFlags({ user: { username: "someone-else" } });
    expect(other.toggleVisible).toBe(true); // everyone gets the opt-in toggle
    expect(other.compareVisible).toBe(false); // but not the debug overlay
  });
});

describe("controlVisibleUnderGate (master kill switch)", () => {
  // The kill switch must HIDE the controls, not leave them inert: even an
  // author whose segment flag is on sees no toggle/overlay when calibrated is off.
  test("master gate off hides a control whose own flag is on", () => {
    expect(controlVisibleUnderGate(false, true)).toBe(false);
  });

  test("master gate on passes the control's own flag through", () => {
    expect(controlVisibleUnderGate(true, true)).toBe(true);
    expect(controlVisibleUnderGate(true, false)).toBe(false);
  });
});
