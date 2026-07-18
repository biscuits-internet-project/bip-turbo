import { Link } from "react-router-dom";
import { PreferenceToggle } from "~/components/settings/preference-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useFeatureFlags } from "~/hooks/use-feature-flags";
import { PREFERENCES_DEFAULT } from "~/hooks/use-preferences";

/**
 * Rating-display preferences for the viewer's own profile. Color coding is
 * available to everyone, so it always renders; the calibrated-rating opt-in
 * renders only when `ratings.toggle-visible` makes it available to this user,
 * and the author comparison overlay only when `ratings.compare-visible` does.
 * Each toggle auto-saves on change to /api/users, which re-checks the flags
 * before persisting.
 *
 * Takes only the viewer's saved preferences as props; the gating feature flags are
 * read from `useFeatureFlags()` so it's clear at this use site that flags drive
 * what renders.
 */
export function RatingDisplaySettings({
  showCalibratedRatings,
  showRatingComparisonDebug,
  trackCalibratedRatings,
  trackRatingComparisonDebug,
  colorCodeRatings,
}: {
  showCalibratedRatings: boolean | null;
  showRatingComparisonDebug: boolean | null;
  trackCalibratedRatings: boolean | null;
  trackRatingComparisonDebug: boolean | null;
  colorCodeRatings: boolean | null;
}) {
  const { toggleVisible, compareVisible, defaultCalibrated } = useFeatureFlags();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-content-text-primary">Rating display</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Each switch reflects the user's explicit choice, falling back to the
            app default when they've never set one (a null pref resolves to the
            default). The calibrated toggle's default is flag-driven. */}
        <PreferenceToggle
          field="colorCodeRatings"
          label="Color-code rating values"
          description="Tint rating numbers from purple to green so you can spot strong and weak scores, and see where you differ from the crowd, without reading them."
          initial={colorCodeRatings ?? PREFERENCES_DEFAULT.colorCodeRatings}
        />

        {toggleVisible && (
          <PreferenceToggle
            field="showCalibratedRatings"
            label="Calibrated show rating"
            ariaLabel="Use the calibrated show rating"
            description={
              <>
                Weights raters by how much of the 0.5 to 5 star scale they use, corrects for generous and harsh graders,
                and counts each person once.{" "}
                <Link to="/show-rating-algorithm" className="text-brand-primary hover:underline">
                  How it works →
                </Link>
              </>
            }
            initial={showCalibratedRatings ?? defaultCalibrated}
          />
        )}

        {compareVisible && (
          <PreferenceToggle
            field="showRatingComparisonDebug"
            label="Show Rating Comparison Overlay (debug)"
            ariaLabel="Show rating comparison overlay"
            description="Show the community→calibrated score and rank delta on show cards and pages."
            initial={showRatingComparisonDebug ?? false}
          />
        )}

        {toggleVisible && (
          <PreferenceToggle
            field="trackCalibratedRatings"
            label="Calibrated track rating"
            ariaLabel="Use the calibrated track rating"
            description={
              <>
                Leans on raters who use the whole 0.5 to 5 star scale and discounts one-note fluffers, so tracks spread
                out instead of all sitting near 5.{" "}
                <Link to="/show-rating-algorithm" className="text-brand-primary hover:underline">
                  How it works →
                </Link>
              </>
            }
            initial={trackCalibratedRatings ?? defaultCalibrated}
          />
        )}

        {compareVisible && (
          <PreferenceToggle
            field="trackRatingComparisonDebug"
            label="Track Rating Comparison Overlay (debug)"
            ariaLabel="Track rating comparison overlay"
            description="Show the community→calibrated track score and delta on setlist and performance rows."
            initial={trackRatingComparisonDebug ?? false}
          />
        )}
      </CardContent>
    </Card>
  );
}
