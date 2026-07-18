import { type FeatureFlags, getFeatureFlags, type RatingMode, resolveRatingMode } from "@bip/core";
import type { PublicContext } from "~/lib/base-loaders";
import { services } from "~/server/services";

type Viewer = Awaited<ReturnType<typeof services.users.findByEmail>>;

/**
 * Resolve a viewer's rating display mode in one place: look up their local user
 * (needed for the saved calibrated pref and to target segment-gated flags by
 * username), read the feature flags for them, then decide simple vs calibrated.
 * Returns the user and flags too, since callers also need them (attendance/
 * ratings, the compare-overlay gate). `mode` is the show mode; `trackMode` is the
 * independent per-track opt-in (a separate pref, same flags). Shared by
 * show-user-data, track-user-ratings and Top Rated so the segment-context and
 * pref wiring can't drift between them.
 */
export async function resolveViewerRatingMode(
  context: Pick<PublicContext, "currentUser">,
): Promise<{ user: Viewer; flags: FeatureFlags; mode: RatingMode; trackMode: RatingMode }> {
  const user = context.currentUser ? await services.users.findByEmail(context.currentUser.email) : null;
  const flags = await getFeatureFlags(user ? { user: { id: user.id, username: user.username } } : undefined);
  const mode = resolveRatingMode(user?.showCalibratedRatings, flags);
  const trackMode = resolveRatingMode(user?.trackCalibratedRatings, flags);
  return { user, flags, mode, trackMode };
}
