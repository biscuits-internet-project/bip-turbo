import { type FeatureFlags, getFeatureFlags, type RatingMode, resolveRatingMode } from "@bip/core";
import type { PublicContext } from "~/lib/base-loaders";
import { services } from "~/server/services";

type Viewer = Awaited<ReturnType<typeof services.users.findByEmail>>;

/**
 * Resolve a viewer's rating display mode in one place: look up their local user
 * (needed for the saved calibrated pref and to target segment-gated flags by
 * username), read the feature flags for them, then decide simple vs calibrated.
 * Returns the user and flags too, since callers also need them (attendance/
 * ratings, the compare-overlay gate). Shared by show-user-data and Top Rated so
 * the segment-context and pref wiring can't drift between them.
 */
export async function resolveViewerRatingMode(
  context: Pick<PublicContext, "currentUser">,
): Promise<{ user: Viewer; flags: FeatureFlags; mode: RatingMode }> {
  const user = context.currentUser ? await services.users.findByEmail(context.currentUser.email) : null;
  const flags = await getFeatureFlags(user ? { user: { id: user.id, username: user.username } } : undefined);
  const mode = resolveRatingMode(user?.showCalibratedRatings, flags);
  return { user, flags, mode };
}
