import { setupWithRouter } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { PREFERENCES_DEFAULT } from "~/hooks/use-preferences";
import { RatingDisplaySettings } from "./rating-display-settings";

vi.mock("~/hooks/use-feature-flags", () => ({ useFeatureFlags: vi.fn() }));

import { useFeatureFlags } from "~/hooks/use-feature-flags";

// The card's whole point is conditional visibility plus auto-save: the two
// flagged toggles appear only when their feature flag is on, and flipping any
// toggle persists immediately (no save button). Color coding ships to everyone,
// so it renders unflagged and keeps the card alive for a typical user.
const base = {
  showCalibratedRatings: null,
  showRatingComparisonDebug: null,
  trackCalibratedRatings: null,
  trackRatingComparisonDebug: null,
  colorCodeRatings: null,
};

function mockFlags(overrides: Partial<ReturnType<typeof useFeatureFlags>>) {
  vi.mocked(useFeatureFlags).mockReturnValue({
    calibratedEnabled: true,
    toggleVisible: false,
    compareVisible: false,
    defaultCalibrated: false,
    explainerNavLink: false,
    recomputeEnabled: false,
    ...overrides,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RatingDisplaySettings", () => {
  // Color coding is ungated, so the card has to survive a user with every flag
  // off — the state nearly everyone is in.
  test("still shows the color-coding toggle when no flag is enabled", async () => {
    mockFlags({});
    await setupWithRouter(<RatingDisplaySettings {...base} />);
    expect(screen.getByText("Color-code rating values")).toBeInTheDocument();
    expect(screen.queryByText("Calibrated show rating")).not.toBeInTheDocument();
    expect(screen.queryByText("Show Rating Comparison Overlay (debug)")).not.toBeInTheDocument();
  });

  // The switch has to show the app default for a viewer who never chose, or it
  // claims a state the badges aren't actually in. Asserted against the constant
  // so flipping the default doesn't need a test edit.
  test("shows the app default when the viewer has never chosen", async () => {
    mockFlags({});
    await setupWithRouter(<RatingDisplaySettings {...base} />);
    expect(screen.getByLabelText("Color-code rating values")).toHaveAttribute(
      "aria-checked",
      String(PREFERENCES_DEFAULT.colorCodeRatings),
    );
  });

  test("reflects an explicit color-coding opt-in", async () => {
    mockFlags({});
    await setupWithRouter(<RatingDisplaySettings {...base} colorCodeRatings={true} />);
    expect(screen.getByLabelText("Color-code rating values")).toHaveAttribute("aria-checked", "true");
  });

  test("reflects an explicit color-coding opt-out", async () => {
    mockFlags({});
    await setupWithRouter(<RatingDisplaySettings {...base} colorCodeRatings={false} />);
    expect(screen.getByLabelText("Color-code rating values")).toHaveAttribute("aria-checked", "false");
  });

  test("auto-saves the color-coding opt-in with no flag enabled", async () => {
    mockFlags({});
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const { user } = await setupWithRouter(<RatingDisplaySettings {...base} />);
    await user.click(screen.getByLabelText("Color-code rating values"));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/users");
    expect(init.method).toBe("POST");
    expect((init.body as FormData).get("colorCodeRatings")).toBe("true");
  });

  test("shows only the opt-in toggles when just toggle-visible is on", async () => {
    mockFlags({ toggleVisible: true });
    await setupWithRouter(<RatingDisplaySettings {...base} />);
    expect(screen.getByText("Calibrated show rating")).toBeInTheDocument();
    expect(screen.getByText("Calibrated track rating")).toBeInTheDocument();
    expect(screen.queryByText("Show Rating Comparison Overlay (debug)")).not.toBeInTheDocument();
    expect(screen.queryByText("Track Rating Comparison Overlay (debug)")).not.toBeInTheDocument();
  });

  test("shows the track comparison overlay toggle only when compare-visible is on", async () => {
    mockFlags({ toggleVisible: true, compareVisible: true });
    await setupWithRouter(<RatingDisplaySettings {...base} />);
    expect(screen.getByText("Track Rating Comparison Overlay (debug)")).toBeInTheDocument();
  });

  test("auto-saves the calibrated-track opt-in to /api/users on toggle", async () => {
    mockFlags({ toggleVisible: true });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const { user } = await setupWithRouter(<RatingDisplaySettings {...base} />);
    await user.click(screen.getByLabelText("Use the calibrated track rating"));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/users");
    expect((init.body as FormData).get("trackCalibratedRatings")).toBe("true");
  });

  test("shows the comparison overlay toggle when compare-visible is on", async () => {
    mockFlags({ toggleVisible: true, compareVisible: true });
    await setupWithRouter(<RatingDisplaySettings {...base} />);
    expect(screen.getByText("Calibrated show rating")).toBeInTheDocument();
    expect(screen.getByText("Show Rating Comparison Overlay (debug)")).toBeInTheDocument();
  });

  test("auto-saves the opt-in to /api/users immediately on toggle (no save button)", async () => {
    mockFlags({ toggleVisible: true });
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const { user } = await setupWithRouter(<RatingDisplaySettings {...base} />);
    await user.click(screen.getByLabelText("Use the calibrated show rating"));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/users");
    expect(init.method).toBe("POST");
    expect((init.body as FormData).get("showCalibratedRatings")).toBe("true");
  });

  // Holds the response open so the optimistic flip is observable on its own.
  // Asserting only the end state can't tell a revert apart from a toggle that
  // never moved, since both land back where they started.
  test("flips optimistically, then reverts when the save fails", async () => {
    mockFlags({ toggleVisible: true });
    let settle: () => void = () => {};
    const pending = new Promise<{ ok: boolean }>((resolve) => {
      settle = () => resolve({ ok: false });
    });
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(pending));

    const { user } = await setupWithRouter(<RatingDisplaySettings {...base} showCalibratedRatings={true} />);
    const toggle = screen.getByLabelText("Use the calibrated show rating");
    expect(toggle).toHaveAttribute("aria-checked", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");

    settle();
    await waitFor(() => expect(toggle).toHaveAttribute("aria-checked", "true"));
  });
});
