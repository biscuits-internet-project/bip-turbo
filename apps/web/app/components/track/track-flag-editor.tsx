import type { TrackFlag } from "@bip/domain";
import { FLAG_DISPLAY_ORDER, FLAG_LABELS } from "~/components/setlist/footnotes";
import { Checkbox } from "~/components/ui/checkbox";
import { formLabelClass } from "~/lib/form-styles";

interface TrackFlagEditorProps {
  flags: TrackFlag[];
  onChange: (flags: TrackFlag[]) => void;
}

/**
 * The "Flags" section of the track edit form: a checkbox per structured flag
 * (dyslexic / inverted / unfinished / partial-performance). Controlled: the
 * parent (`TrackManager`) owns the flags and saves them through the flags
 * endpoint when the track is saved, which recomputes the song's recurrence.
 * Labels and order come from the footnote engine so the editor and the rendered
 * footnote stay in lockstep.
 */
export function TrackFlagEditor({ flags, onChange }: TrackFlagEditorProps) {
  const toggle = (flag: TrackFlag, checked: boolean) => {
    if (checked) {
      if (!flags.includes(flag)) onChange([...flags, flag]);
    } else {
      onChange(flags.filter((existing) => existing !== flag));
    }
  };

  return (
    <div>
      <span className={formLabelClass}>Flags</span>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {FLAG_DISPLAY_ORDER.map((flag) => (
          <div key={flag} className="flex items-center gap-2">
            <Checkbox
              id={`track-flag-${flag}`}
              checked={flags.includes(flag)}
              onCheckedChange={(checked) => toggle(flag, checked === true)}
            />
            <label
              htmlFor={`track-flag-${flag}`}
              className="cursor-pointer text-sm font-medium capitalize text-content-text-secondary"
            >
              {FLAG_LABELS[flag]}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
