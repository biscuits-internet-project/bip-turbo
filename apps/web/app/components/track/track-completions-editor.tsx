import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CompactSelect } from "~/components/ui/compact-select";
import { formLabelClass } from "~/lib/form-styles";
import { formatDateMedium } from "~/lib/utils";
import type { EarlierPerformance } from "./use-track-api";

interface TrackCompletionsEditorProps {
  /** Earlier same-song performances this track could complete (parent-fetched). */
  options: EarlierPerformance[];
  /** The earlier-track ids currently linked as completed by this track. */
  value: string[];
  onChange: (earlierTrackIds: string[]) => void;
}

/**
 * The "Completes" section of the track edit form: links this (later) track to
 * the earlier unfinished same-song versions it finishes, shown as removable
 * dated chips. Controlled: the parent (`TrackManager`) owns the selection and
 * saves it through the completions endpoint when the track is saved. Same-song
 * only; the parent supplies the earlier-performance options.
 */
export function TrackCompletionsEditor({ options, value, onChange }: TrackCompletionsEditorProps) {
  const byId = new Map(options.map((option) => [option.trackId, option]));
  const available = options.filter((option) => !value.includes(option.trackId));

  const add = (trackId: string) => {
    if (trackId && !value.includes(trackId)) onChange([...value, trackId]);
  };
  const remove = (trackId: string) => onChange(value.filter((id) => id !== trackId));

  return (
    <div>
      <span className={formLabelClass}>Completes</span>
      {options.length === 0 ? (
        <p className="mt-1 text-sm text-content-text-tertiary">No earlier versions of this song to complete.</p>
      ) : (
        <div className="mt-2 space-y-2">
          {value.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {value.map((trackId) => {
                const option = byId.get(trackId);
                return (
                  <li
                    key={trackId}
                    className="flex items-center gap-1 rounded-full border py-0.5 pl-2.5 pr-1 text-sm text-content-text-secondary"
                  >
                    {option ? formatDateMedium(option.showDate) : trackId}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Remove completion"
                      onClick={() => remove(trackId)}
                      className="h-5 w-5"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
          {available.length > 0 && (
            <CompactSelect
              value=""
              onValueChange={add}
              options={available.map((option) => ({ value: option.trackId, label: formatDateMedium(option.showDate) }))}
              ariaLabel="Add completed version"
              placeholder="Add a version this completes..."
              className="h-8 w-full sm:w-64"
            />
          )}
        </div>
      )}
    </div>
  );
}
