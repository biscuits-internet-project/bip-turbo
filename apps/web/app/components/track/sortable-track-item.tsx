import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Edit2, Trash } from "lucide-react";
import type { Track } from "@bip/domain";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface SortableTrackItemProps {
  track: Track;
  onEdit: (track: Track) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function SortableTrackItem({ track, onEdit, onDelete, isDeleting }: SortableTrackItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700 transition-all",
        isDragging && "opacity-50 shadow-lg z-50"
      )}
    >
      <div className="flex items-center space-x-4">
        {/* Drag Handle */}
        <button
          className="text-gray-400 hover:text-gray-300 cursor-grab active:cursor-grabbing p-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        {/* Position Number - now just for display */}
        <span className="text-gray-400 font-mono text-sm w-8">
          {track.position}
        </span>

        {/* Song Title */}
        <span className="text-white font-medium">
          {track.song?.title || "Unknown Song"}
        </span>

        {/* Segue */}
        {track.segue && (
          <span className="text-gray-400 text-sm">
            {track.segue}
          </span>
        )}

        {/* Notes */}
        {track.note && (
          <span className="text-gray-400 text-sm italic">
            ({track.note})
          </span>
        )}
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
  );
}