import { Check, X } from "lucide-react";
import { SongSearch } from "~/components/song/song-search";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { GlassSelect } from "~/components/ui/glass-select";
import { Textarea } from "~/components/ui/textarea";
import { formInputClass, formLabelClass } from "~/lib/form-styles";
import { SEGUE_OPTIONS, SET_OPTIONS } from "./track-constants";
import type { TrackFormData } from "./use-track-api";

interface TrackEditFormProps {
  formData: TrackFormData;
  onFormDataChange: (updater: (prev: TrackFormData) => TrackFormData) => void;
  isEditing: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

/**
 * The inline form admins use to add or edit a track on a show. Pure
 * presentational + controlled input — all state lives in the caller
 * (`TrackManager`), which decides what `formData` to seed it with, when
 * to flip between add/edit mode, and how to handle submission.
 */
export function TrackEditForm({
  formData,
  onFormDataChange,
  isEditing,
  isSubmitting,
  onSubmit,
  onCancel,
}: TrackEditFormProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-content-bg/50 rounded-lg border border-content-bg-secondary">
      <div>
        <label htmlFor="track-song" className={formLabelClass}>
          Song
        </label>
        <SongSearch
          value={formData.songId}
          onValueChange={(value) => onFormDataChange((prev) => ({ ...prev, songId: value }))}
          placeholder="Select a song..."
          className="w-full"
          initialSong={formData.song}
        />
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="w-28">
          <label htmlFor="track-set" className={formLabelClass}>
            Set
          </label>
          <GlassSelect
            id="track-set"
            value={formData.set}
            onValueChange={(value) => onFormDataChange((prev) => ({ ...prev, set: value }))}
            options={SET_OPTIONS}
            className="w-full"
          />
        </div>

        <div className="w-32">
          <label htmlFor="track-segue" className={formLabelClass}>
            Segue
          </label>
          <GlassSelect
            id="track-segue"
            value={formData.segue}
            onValueChange={(value) => onFormDataChange((prev) => ({ ...prev, segue: value }))}
            options={SEGUE_OPTIONS}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2 h-10">
          <Checkbox
            id="track-all-timer"
            checked={formData.allTimer}
            onCheckedChange={(checked) => onFormDataChange((prev) => ({ ...prev, allTimer: checked === true }))}
          />
          <label htmlFor="track-all-timer" className="text-sm font-medium text-content-text-secondary cursor-pointer">
            All-timer
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="track-note" className={formLabelClass}>
          Track Notes
        </label>
        <Textarea
          id="track-note"
          value={formData.note || ""}
          onChange={(e) => {
            const value = e.target.value;
            onFormDataChange((prev) => ({ ...prev, note: value || null }));
          }}
          placeholder="Add a note about this track..."
          className={formInputClass}
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="track-annotation" className={formLabelClass}>
          Annotations
          <span className="ml-2 text-xs text-content-text-tertiary">(one per line)</span>
        </label>
        <Textarea
          id="track-annotation"
          value={formData.annotationDesc || ""}
          onChange={(e) => {
            const value = e.target.value;
            onFormDataChange((prev) => ({ ...prev, annotationDesc: value || null }));
          }}
          placeholder="Add annotations (one per line)..."
          className={formInputClass}
          rows={3}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button onClick={onCancel} variant="cancel">
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting} variant="brand">
          <Check className="h-4 w-4 mr-1" />
          {isEditing ? "Update" : "Add"}
        </Button>
      </div>
    </div>
  );
}
