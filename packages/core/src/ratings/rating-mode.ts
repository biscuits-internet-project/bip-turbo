export type RatingMode = "simple" | "calibrated";

/**
 * The one place display mode is decided, used by every rating surface
 * (show-user-data, Top Rated, cards) so the rule is never inlined twice. Order:
 * the master gate wins (off means nobody sees the calibrated rating); then the
 * user's explicit opt-in pref (a DB tri-state, where null means "no choice");
 * then the app default. Eligibility to SET the pref is gated separately by
 * `ratings.toggle-visible`, so an ineligible user keeps a null pref and falls to
 * the default here.
 */
export function resolveRatingMode(
  showCalibratedRatings: boolean | null | undefined,
  flags: { calibratedEnabled: boolean; defaultCalibrated: boolean },
): RatingMode {
  if (!flags.calibratedEnabled) return "simple";
  if (showCalibratedRatings != null) return showCalibratedRatings ? "calibrated" : "simple";
  return flags.defaultCalibrated ? "calibrated" : "simple";
}
