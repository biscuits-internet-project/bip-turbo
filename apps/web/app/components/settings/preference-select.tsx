import { useState } from "react";
import { toast } from "sonner";
import { Dropdown, type DropdownOption } from "~/components/ui/dropdown";
import type { PreferenceField } from "./preference-toggle";

/**
 * A labelled single-select preference that persists itself, the dropdown sibling
 * of {@link PreferenceToggle}: same optimistic-save-then-revert behavior, same
 * `POST /api/users` wire, same row layout — for a finite-choice pref (e.g. rating
 * decimal places) rather than an on/off one. The value is a string to match the
 * form-encoded payload the action parses; the caller maps to/from its own type.
 */
export function PreferenceSelect({
  field,
  label,
  ariaLabel,
  description,
  initial,
  options,
}: {
  field: PreferenceField;
  label: string;
  /** Accessible name, when the visible label reads as a noun rather than an action. */
  ariaLabel?: string;
  description: React.ReactNode;
  initial: string;
  options: DropdownOption[];
}) {
  const [value, setValue] = useState(initial);
  const [isSaving, setIsSaving] = useState(false);

  async function save(next: string) {
    const previous = value;
    setValue(next); // optimistic
    setIsSaving(true);
    try {
      const body = new FormData();
      body.set(field, next);
      const response = await fetch("/api/users", { method: "POST", body });
      if (!response.ok) throw new Error("save failed");
      toast.success("Settings saved");
    } catch {
      setValue(previous); // revert
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
      <Dropdown
        size="compact"
        value={value}
        onValueChange={save}
        options={options}
        ariaLabel={ariaLabel ?? label}
        disabled={isSaving}
        className="w-20 shrink-0"
      />
    </div>
  );
}
