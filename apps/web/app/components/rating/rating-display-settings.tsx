import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { useFeatureFlags } from "~/hooks/use-feature-flags";
import { PREFERENCES_DEFAULT } from "~/hooks/use-preferences";

/**
 * Rating-display preferences for the viewer's own profile. Color coding is
 * available to everyone, so it always renders; the calibrated-rating opt-in
 * renders only when `ratings.toggle-visible` makes it available to this user,
 * and the author comparison overlay only when `ratings.compare-visible` does.
 * Each toggle auto-saves on change (optimistic, reverting on failure) to
 * /api/users, which re-checks the flags before persisting, with no separate
 * save step.
 *
 * Takes only the viewer's saved preferences as props; the gating feature flags are
 * read from `useFeatureFlags()` so it's clear at this use site that flags drive
 * what renders.
 */
export function RatingDisplaySettings({
  showCalibratedRatings,
  showRatingComparisonDebug,
  colorCodeRatings,
}: {
  showCalibratedRatings: boolean | null;
  showRatingComparisonDebug: boolean | null;
  colorCodeRatings: boolean | null;
}) {
  const { toggleVisible, compareVisible, defaultCalibrated } = useFeatureFlags();
  // Each switch reflects the user's explicit choice, falling back to the app
  // default when they've never set one (a null pref resolves to the default).
  const [calibrated, setCalibrated] = useState(showCalibratedRatings ?? defaultCalibrated);
  const [compare, setCompare] = useState(showRatingComparisonDebug ?? false);
  const [colorCoded, setColorCoded] = useState(colorCodeRatings ?? PREFERENCES_DEFAULT.colorCodeRatings);
  const [savingField, setSavingField] = useState<string | null>(null);

  async function save(
    field: "showCalibratedRatings" | "showRatingComparisonDebug" | "colorCodeRatings",
    value: boolean,
    apply: (v: boolean) => void,
  ) {
    apply(value); // optimistic
    setSavingField(field);
    try {
      const body = new FormData();
      body.set(field, String(value));
      const response = await fetch("/api/users", { method: "POST", body });
      if (!response.ok) throw new Error("save failed");
      toast.success("Rating settings saved");
    } catch {
      apply(!value); // revert
      toast.error("Couldn't save rating settings");
    } finally {
      setSavingField(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-content-text-primary">Rating display</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="text-content-text-primary font-medium">Color-code rating values</div>
            <p className="text-sm text-content-text-tertiary">
              Tint rating numbers from purple to green so you can spot strong and weak scores, and see where you differ
              from the crowd, without reading them.
            </p>
          </div>
          <Switch
            checked={colorCoded}
            disabled={savingField === "colorCodeRatings"}
            onCheckedChange={(v) => save("colorCodeRatings", v, setColorCoded)}
            aria-label="Color-code rating values"
          />
        </div>

        {toggleVisible && (
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-content-text-primary font-medium">Calibrated show rating</div>
              <p className="text-sm text-content-text-tertiary">
                Weights raters by how much of the 0.5 to 5 star scale they use, corrects for generous and harsh graders,
                and counts each person once.{" "}
                <Link to="/show-rating-algorithm" className="text-brand-primary hover:underline">
                  How it works →
                </Link>
              </p>
            </div>
            <Switch
              checked={calibrated}
              disabled={savingField === "showCalibratedRatings"}
              onCheckedChange={(v) => save("showCalibratedRatings", v, setCalibrated)}
              aria-label="Use the calibrated show rating"
            />
          </div>
        )}

        {compareVisible && (
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-content-text-primary font-medium">Show Rating Comparison Overlay (debug)</div>
              <p className="text-sm text-content-text-tertiary">
                Show the community→calibrated score and rank delta on show cards and pages.
              </p>
            </div>
            <Switch
              checked={compare}
              disabled={savingField === "showRatingComparisonDebug"}
              onCheckedChange={(v) => save("showRatingComparisonDebug", v, setCompare)}
              aria-label="Show rating comparison overlay"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
