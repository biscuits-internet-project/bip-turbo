import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PREFERENCES_DEFAULT, PreferencesProvider, usePreferences } from "./use-preferences";

function Harness() {
  const { colorCodeRatings, showSetlistTimes } = usePreferences();
  return (
    <>
      <div data-testid="color">{String(colorCodeRatings)}</div>
      <div data-testid="times">{String(showSetlistTimes)}</div>
    </>
  );
}

describe("usePreferences", () => {
  // Rating values render from nearly every page, including inside the error
  // boundary and in component tests that mount no provider. The no-provider
  // case has to resolve the same way "never chose" does, rather than diverging
  // from what the app actually ships.
  test("falls back to the app default with no provider mounted", async () => {
    await setup(<Harness />);
    expect(screen.getByTestId("color").textContent).toBe(String(PREFERENCES_DEFAULT.colorCodeRatings));
  });

  // `null` is the stored tri-state for "never chose", which must resolve to the
  // app default rather than read as an explicit choice either way. Asserted
  // against the constant so flipping the default doesn't need a test edit.
  test("resolves an unset preference to the app default", async () => {
    await setup(
      <PreferencesProvider showSetlistTimes={null} colorCodeRatings={null}>
        <Harness />
      </PreferencesProvider>,
    );
    expect(screen.getByTestId("color").textContent).toBe(String(PREFERENCES_DEFAULT.colorCodeRatings));
  });

  // Both explicit choices must survive a change to the default, which is the
  // whole reason the stored value is tri-state.
  test("honors an explicit opt-out", async () => {
    await setup(
      <PreferencesProvider showSetlistTimes={null} colorCodeRatings={false}>
        <Harness />
      </PreferencesProvider>,
    );
    expect(screen.getByTestId("color").textContent).toBe("false");
  });

  test("honors an explicit opt-in", async () => {
    await setup(
      <PreferencesProvider showSetlistTimes={null} colorCodeRatings={true}>
        <Harness />
      </PreferencesProvider>,
    );
    expect(screen.getByTestId("color").textContent).toBe("true");
  });

  // Pins the shipped default itself. Color coding stays opt-in until the rating
  // work it belongs to is opened up, so a stray flip should fail loudly here.
  test("ships with color coding off", () => {
    expect(PREFERENCES_DEFAULT.colorCodeRatings).toBe(false);
  });

  // Setlist times are what the setlist has always shown, so the default has to
  // stay on: only a viewer who asks for a cleaner setlist loses them.
  test("ships with setlist times on", () => {
    expect(PREFERENCES_DEFAULT.showSetlistTimes).toBe(true);
  });

  test("resolves an unset setlist-times preference to the app default", async () => {
    await setup(
      <PreferencesProvider colorCodeRatings={null} showSetlistTimes={null}>
        <Harness />
      </PreferencesProvider>,
    );
    expect(screen.getByTestId("times").textContent).toBe(String(PREFERENCES_DEFAULT.showSetlistTimes));
  });

  test("honors an explicit setlist-times opt-out", async () => {
    await setup(
      <PreferencesProvider colorCodeRatings={null} showSetlistTimes={false}>
        <Harness />
      </PreferencesProvider>,
    );
    expect(screen.getByTestId("times").textContent).toBe("false");
  });
});
