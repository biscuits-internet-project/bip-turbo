import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "~/components/ui/switch";

/**
 * The display preferences a viewer can set on their own profile. Mirrors the
 * fields `/api/users` accepts, so a typo can't reach the wire.
 */
export type PreferenceField =
  | "showCalibratedRatings"
  | "showRatingComparisonDebug"
  | "trackCalibratedRatings"
  | "trackRatingComparisonDebug"
  | "colorCodeRatings"
  | "showSetlistTimes";

/**
 * One labelled preference switch that persists itself. Every settings card is
 * built from these, so the whole app shares one auto-save behavior (optimistic
 * flip, revert plus a toast on failure, disabled while in flight) and one row
 * layout, with no separate save step anywhere.
 *
 * Takes the resolved boolean rather than the stored tri-state: resolving `null`
 * to the app default belongs to the caller, which is the only place that knows
 * which default applies.
 */
export function PreferenceToggle({
  field,
  label,
  ariaLabel,
  description,
  initial,
}: {
  field: PreferenceField;
  label: string;
  /** Accessible name, when the visible label reads as a noun rather than an action. */
  ariaLabel?: string;
  description: React.ReactNode;
  initial: boolean;
}) {
  const [checked, setChecked] = useState(initial);
  const [isSaving, setIsSaving] = useState(false);

  async function save(value: boolean) {
    setChecked(value); // optimistic
    setIsSaving(true);
    try {
      const body = new FormData();
      body.set(field, String(value));
      const response = await fetch("/api/users", { method: "POST", body });
      if (!response.ok) throw new Error("save failed");
      toast.success("Settings saved");
    } catch {
      setChecked(!value); // revert
      toast.error("Couldn't save settings");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <div className="text-content-text-primary font-medium">{label}</div>
        <p className="text-sm text-content-text-tertiary">{description}</p>
      </div>
      <Switch checked={checked} disabled={isSaving} onCheckedChange={save} aria-label={ariaLabel ?? label} />
    </div>
  );
}
