import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

export interface ShowDayOrderRow {
  id: string;
  slug: string;
  date: string;
  dayOrder: number | null | undefined;
  venueName: string | null;
}

interface ShowDayOrderManagerProps {
  currentShowId: string;
  date: string;
  initialShows: ShowDayOrderRow[];
}

interface SortableRowProps {
  show: ShowDayOrderRow;
  position: number;
  isCurrent: boolean;
}

function SortableShowRow({ show, position, isCurrent }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: show.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-content-bg-secondary/50 border-content-bg-secondary transition-all",
        isCurrent && "border-brand-primary/60 bg-brand-primary/10",
        isDragging && "opacity-50 shadow-lg z-50",
      )}
    >
      <button
        type="button"
        className="text-content-text-secondary hover:text-gray-300 cursor-grab active:cursor-grabbing p-1"
        aria-label={`Drag ${show.venueName ?? show.slug}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <span className="text-content-text-secondary font-mono text-sm w-6">{position}</span>
      <div className="flex-1 text-content-text-primary">
        <span className="font-medium">{show.venueName ?? show.slug}</span>
        {isCurrent && <span className="ml-2 text-xs text-brand-primary uppercase tracking-wide">this show</span>}
      </div>
    </li>
  );
}

/**
 * Admin widget shown on the show edit page when 2+ shows share a date.
 * Drag-and-drop reorders the group; on drop, the new sequence is persisted
 * via /api/shows/reorder so dayOrder becomes 1..N matching the visual order.
 */
export function ShowDayOrderManager({ currentShowId, date, initialShows }: ShowDayOrderManagerProps) {
  const [rows, setRows] = useState<ShowDayOrderRow[]>(initialShows);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  if (initialShows.length < 2) return null;

  const persist = async (orderedIds: string[], previous: ShowDayOrderRow[]) => {
    try {
      const response = await fetch("/api/shows/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, orderedIds }),
      });
      if (!response.ok) throw new Error("Reorder failed");
      toast.success("Show order updated");
    } catch {
      setRows(previous);
      toast.error("Failed to update show order");
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rows.findIndex((r) => r.id === active.id);
    const newIndex = rows.findIndex((r) => r.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previous = rows;
    const next = arrayMove(rows, oldIndex, newIndex);
    setRows(next);
    void persist(
      next.map((r) => r.id),
      previous,
    );
  };

  return (
    <Card className="border-content-bg-secondary bg-content-bg/50">
      <CardHeader>
        <CardTitle className="text-content-text-primary">Same-date show order</CardTitle>
        <p className="text-sm text-content-text-secondary">
          Drag to set the order shown across listings, adjacency, and on-this-day for {date}.
        </p>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={rows.map((r) => r.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {rows.map((row, index) => (
                <SortableShowRow key={row.id} show={row} position={index + 1} isCurrent={row.id === currentShowId} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
