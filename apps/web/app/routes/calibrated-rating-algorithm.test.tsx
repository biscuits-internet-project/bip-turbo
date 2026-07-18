import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import CalibratedRatingAlgorithm from "./calibrated-rating-algorithm";

vi.mock("~/hooks/use-feature-flags", () => ({ useFeatureFlags: vi.fn() }));
vi.mock("~/hooks/use-session", () => ({ useSession: vi.fn() }));

import { useFeatureFlags } from "~/hooks/use-feature-flags";
import { useSession } from "~/hooks/use-session";

// The explainer is static except for one branch: the "your profile settings"
// phrase becomes a link to the viewer's own profile (where the opt-in toggle
// lives) only when the toggle-visible flag is on AND we know their username.
// Otherwise it must stay plain text so nobody is pointed at a setting they
// can't reach.
function mockFlags(toggleVisible: boolean) {
  vi.mocked(useFeatureFlags).mockReturnValue({
    calibratedEnabled: true,
    toggleVisible,
    compareVisible: false,
    defaultCalibrated: false,
    explainerNavLink: false,
    recomputeEnabled: false,
  });
}

function mockUser(username: string | null) {
  vi.mocked(useSession).mockReturnValue({
    user:
      username === null
        ? null
        : { id: "u1", email: "e@x.co", username, avatarUrl: null, internalUserId: "iu1", isAdmin: false },
    supabase: null,
  });
}

describe("CalibratedRatingAlgorithm", () => {
  test("links 'your profile settings' to the viewer's profile when the toggle is available", async () => {
    mockFlags(true);
    mockUser("tractorbeam");
    await setupWithRouter(<CalibratedRatingAlgorithm />);
    expect(screen.getByRole("link", { name: "your profile settings" })).toHaveAttribute("href", "/users/tractorbeam");
  });

  test("leaves 'your profile settings' as plain text when the toggle flag is off", async () => {
    mockFlags(false);
    mockUser("tractorbeam");
    await setupWithRouter(<CalibratedRatingAlgorithm />);
    expect(screen.queryByRole("link", { name: "your profile settings" })).not.toBeInTheDocument();
    expect(screen.getByText(/your profile settings/)).toBeInTheDocument();
  });

  test("leaves 'your profile settings' as plain text for a signed-out visitor", async () => {
    mockFlags(true);
    mockUser(null);
    await setupWithRouter(<CalibratedRatingAlgorithm />);
    expect(screen.queryByRole("link", { name: "your profile settings" })).not.toBeInTheDocument();
  });
});
