import type { Track } from "@bip/domain";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit2, GripVertical, Trash } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface SortableTrackItemProps {
  track: Track;
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function SortableTrackItem({ track, onEdit, onDelete, isDeleting }: SortableTrackItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-3 bg-content-bg-secondary/50 rounded-lg border border-content-bg-secondary transition-all",
        isDragging && "opacity-50 shadow-lg z-50",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-4 flex-1">
          {/* Drag Handle */}
          <button
            className="text-content-text-secondary hover:text-gray-300 cursor-grab active:cursor-grabbing p-1 mt-1"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {/* Position Number - now just for display */}
          <span className="text-content-text-secondary font-mono text-sm w-8 mt-1">{track.position}</span>

          {/* Track Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Song Title */}
              <span className="text-white font-medium">{track.song?.title || "Unknown Song"}</span>

              {/* Segue */}
              {track.segue && <span className="text-content-text-secondary text-sm">{track.segue}</span>}

              {/* Notes */}
              {track.note && <span className="text-content-text-secondary text-sm italic">({track.note})</span>}
            </div>

            {/* Annotations */}
            {track.annotations && track.annotations.length > 0 && (
              <div className="mt-2 space-y-1">
                {track.annotations.map(
                  (annotation, index) =>
                    annotation.desc && (
                      <div
                        key={annotation.id || index}
                        className="text-content-text-accent text-sm pl-2 border-l-2 border-content-bg-secondary"
                      >
                        {annotation.desc}
                      </div>
                    ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(track)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(track.id)}
            disabled={isDeleting}
            className="border-red-600 text-red-400 hover:bg-red-900/20"
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
