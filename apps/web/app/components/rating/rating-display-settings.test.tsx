import { setup, setupWithRouter } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { RatingDisplaySettings } from "./rating-display-settings";

vi.mock("~/hooks/use-feature-flags", () => ({ useFeatureFlags: vi.fn() }));

import { useFeatureFlags } from "~/hooks/use-feature-flags";

// The card's whole point is conditional visibility plus auto-save: each toggle
// appears only when its feature flag is on, the card hides when neither is, and
// flipping a toggle persists immediately (no save button). v1 launches with only
// the author flagged in, so a typical user must see nothing here.
const base = { showCalibratedRatings: null, showRatingComparisonDebug: null };

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
  test("renders nothing when neither flag is enabled", async () => {
    mockFlags({});
    const { container } = await setup(<RatingDisplaySettings {...base} />);
    expect(container).toBeEmptyDOMElement();
  });

  test("shows only the opt-in toggle when just toggle-visible is on", async () => {
    mockFlags({ toggleVisible: true });
    await setupWithRouter(<RatingDisplaySettings {...base} />);
    expect(screen.getByText("Calibrated show rating")).toBeInTheDocument();
    expect(screen.queryByText("Show Rating Comparison Overlay (debug)")).not.toBeInTheDocument();
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

  test("reverts the toggle when the save fails", async () => {
    mockFlags({ toggleVisible: true });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    const { user } = await setupWithRouter(<RatingDisplaySettings {...base} />);
    const toggle = screen.getByLabelText("Use the calibrated show rating");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);
    // Optimistic flip reverts once the failed response resolves (async, so wait).
    await waitFor(() => expect(toggle).toHaveAttribute("aria-checked", "false"));
  });
});
