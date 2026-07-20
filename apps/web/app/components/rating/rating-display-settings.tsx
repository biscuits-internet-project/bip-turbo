import { RATING_DISPLAY_DECIMALS_MAX, RATING_DISPLAY_DECIMALS_MIN } from "@bip/domain";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { RatingComponent } from "~/components/rating/rating";
import { ratingBadgeLayoutClass, ratingBadgeStateClass } from "~/components/rating/rating-badge-button";
import { PreferenceSelect } from "~/components/settings/preference-select";
import { PreferenceToggle } from "~/components/settings/preference-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useFeatureFlags } from "~/hooks/use-feature-flags";
import { PREFERENCES_DEFAULT } from "~/hooks/use-preferences";
import { CALIBRATED_RATING_ALGORITHM_PATH } from "~/lib/route-paths";
import { cn } from "~/lib/utils";

/** Decimal-place choices for the rating precision dropdown (1-4). */
const RATING_DECIMAL_OPTIONS = Array.from(
  { length: RATING_DISPLAY_DECIMALS_MAX - RATING_DISPLAY_DECIMALS_MIN + 1 },
  (_, index) => {
    const value = String(RATING_DISPLAY_DECIMALS_MIN + index);
    return { value, label: value };
  },
);

/**
 * Live before/after for the color-code toggle: the same three ratings rendered
 * in the real rating badge with the scale off and on, so the effect is shown
 * rather than described. Each row pairs a crowd average with a personal score,
 * and the pairs are picked to land in different parts of the purple-to-green
 * ramp: agreement up high, a small gap near the middle, and a wide gap where the
 * crowd panned a show the viewer loved. `colorCode` is forced per column so the
 * preview ignores the viewer's own setting.
 */
const COLOR_CODE_PREVIEW_ROWS = [
  { caption: "You agree", crowd: 4.7, you: 5 },
  { caption: "Small gap", crowd: 3.1, you: 2.5 },
  { caption: "Big gap", crowd: 1.8, you: 4.5 },
];

function PreviewBadge({ crowd, you, colorCode }: { crowd: number; you: number; colorCode: boolean }) {
  return (
    <div
      className={cn(
        ratingBadgeLayoutClass("regular", true),
        ratingBadgeStateClass(colorCode, true),
        "justify-self-center",
      )}
    >
      <RatingComponent rating={crowd} userRating={you} colorCode={colorCode} />
    </div>
  );
}

function ColorCodeExample() {
  return (
    <div className="flex justify-center">
      <Card variant="panel" className="w-fit p-4">
        <div className="grid grid-cols-[auto_auto_auto] items-center gap-x-4 gap-y-2.5">
          <span />
          <span className="justify-self-center text-content-text-tertiary text-[11px]">Example off</span>
          <span className="justify-self-center text-content-text-tertiary text-[11px]">Example on</span>
          {COLOR_CODE_PREVIEW_ROWS.map((row) => (
            <Fragment key={row.caption}>
              <span className="text-content-text-secondary text-xs">{row.caption}</span>
              <PreviewBadge crowd={row.crowd} you={row.you} colorCode={false} />
              <PreviewBadge crowd={row.crowd} you={row.you} colorCode={true} />
            </Fragment>
          ))}
        </div>
      </Card>
    </div>
  );
}

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
  ratingDecimalPlaces,
}: {
  showCalibratedRatings: boolean | null;
  showRatingComparisonDebug: boolean | null;
  trackCalibratedRatings: boolean | null;
  trackRatingComparisonDebug: boolean | null;
  colorCodeRatings: boolean | null;
  ratingDecimalPlaces: number | null;
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
        {toggleVisible && (
          <PreferenceToggle
            field="showCalibratedRatings"
            label="Calibrated show rating"
            ariaLabel="Use the calibrated show rating"
            description={
              <>
                Weights raters by how much of the 0.5 to 5 star scale they use, corrects for generous and harsh graders,
                and counts each person once.{" "}
                <Link to={CALIBRATED_RATING_ALGORITHM_PATH} className="text-brand-primary hover:underline">
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
                Weights raters by how much of the 0.5 to 5 star scale they use, so tracks spread out instead of all
                sitting near 5.{" "}
                <Link to={CALIBRATED_RATING_ALGORITHM_PATH} className="text-brand-primary hover:underline">
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

        {/* Available to everyone (ungated), like color coding below. */}
        <PreferenceSelect
          field="ratingDecimalPlaces"
          label="Rating precision"
          ariaLabel="Rating decimal places"
          description="How many decimal places rating scores show, from 1 to 4."
          initial={String(ratingDecimalPlaces ?? PREFERENCES_DEFAULT.ratingDecimalPlaces)}
          options={RATING_DECIMAL_OPTIONS}
        />

        {/* Available to everyone, so it sits last, after the opt-in calibrated
            settings. Carries a live before/after preview since the tint is
            easier to show than to describe. */}
        <div className="space-y-3">
          <PreferenceToggle
            field="colorCodeRatings"
            label="Color-code rating values"
            description="Tint rating numbers from purple to green so you can spot strong and weak scores, and see where you differ from the crowd, without reading them."
            initial={colorCodeRatings ?? PREFERENCES_DEFAULT.colorCodeRatings}
          />
          <ColorCodeExample />
        </div>
      </CardContent>
    </Card>
  );
}
