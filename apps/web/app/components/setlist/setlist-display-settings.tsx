import { PreferenceToggle } from "~/components/settings/preference-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { PREFERENCES_DEFAULT } from "~/hooks/use-preferences";

/**
 * Setlist-display preferences for the viewer's own profile. Times are on for
 * everyone who hasn't said otherwise, so this card exists for the people who
 * want the setlist to read as a plain list of songs.
 */
export function SetlistDisplaySettings({ showSetlistTimes }: { showSetlistTimes: boolean | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-content-text-primary">Setlist display</CardTitle>
      </CardHeader>
      <CardContent>
        <PreferenceToggle
          field="showSetlistTimes"
          label="Show set times"
          description="Show how long each set and the full show ran, plus the per-track Time column in the gap chart."
          initial={showSetlistTimes ?? PREFERENCES_DEFAULT.showSetlistTimes}
        />
      </CardContent>
    </Card>
  );
}
