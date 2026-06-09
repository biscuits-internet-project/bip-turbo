import type { Track } from "@bip/domain";
import { formatDuration } from "@bip/domain";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, GripVertical, Trash } from "lucide-react";
import type { ReactNode } from "react";
import { TrackIcon } from "~/components/track/track-icon";
import { Button } from "~/components/ui/button";
import { listRowClass } from "~/lib/form-styles";
import { cn } from "~/lib/utils";

interface SortableTrackItemProps {
  track: Track;
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  /** This track's read-only footnotes (annotations, flags, performers,
   *  completions), pre-derived by the show-level footnote engine so the wording
   *  matches the public setlist exactly. */
  footnotes?: ReactNode[];
}

export function SortableTrackItem({ track, onEdit, onDelete, isDeleting, footnotes }: SortableTrackItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(listRowClass, "p-3 transition-all", isDragging && "opacity-50 shadow-lg z-50")}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            {/* Drag Handle */}
            <button
              className="text-content-text-secondary hover:text-gray-300 cursor-grab active:cursor-grabbing p-1 shrink-0"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>

            {/* Position Number - now just for display */}
            <span className="text-content-text-secondary font-mono text-sm w-6 md:w-8 shrink-0">{track.position}</span>

            {/* Title + inline markers */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap flex-1 min-w-0">
              <span className="text-white font-medium">{track.song?.title || "Unknown Song"}</span>
              <TrackIcon track={track} iconClassName="h-4 w-4" />
              {track.segue && <span className="text-content-text-secondary text-sm">{track.segue}</span>}
              {track.duration != null && (
                <span className="text-content-text-secondary text-sm tabular-nums">
                  {formatDuration(track.duration)}
                  {track.durationSource && (
                    <span className="ml-1 text-xs text-content-text-tertiary">({track.durationSource})</span>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(track)}
              className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="destructiveOutline"
              onClick={() => onDelete(track.id)}
              disabled={isDeleting}
              className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Note (full-width, below title) */}
        {track.note && <p className="text-content-text-secondary text-sm italic pl-8 md:pl-12">{track.note}</p>}

        {/* Read-only footnotes (full-width, below note) — one row each, mirroring
            the public setlist wording. */}
        {footnotes && footnotes.length > 0 && (
          <div className="space-y-1 pl-8 md:pl-12">
            {footnotes.map((footnote, index) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: footnotes are positional and stable per render
                key={index}
                className="text-content-text-accent text-sm pl-2 border-l-2 border-content-bg-secondary"
              >
                {footnote}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
