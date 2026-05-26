import type { Track } from "@bip/domain";
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
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { SortableTrackItem } from "./sortable-track-item";
import { compareSets, SET_OPTIONS } from "./track-constants";
import { TrackEditForm } from "./track-edit-form";
import { type TrackFormData, useTrackApi } from "./use-track-api";

interface TrackManagerProps {
  showId: string;
  initialTracks?: Track[];
}

const INITIAL_FORM: TrackFormData = {
  songId: "none",
  set: "S1",
  position: 1,
  segue: "none",
  note: null,
  annotationDesc: null,
  allTimer: false,
};

/**
 * The Track List section on the show edit page. Owns the local tracks
 * state + the form-open / editing-row UI lifecycle, and delegates network
 * calls to `useTrackApi` and form rendering to `TrackEditForm`. Drag-and-
 * drop reorder is handled inline because it needs access to the live
 * tracks list to compute optimistic position updates.
 */
export function TrackManager({ showId, initialTracks = [] }: TrackManagerProps) {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteTrackId, setDeleteTrackId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TrackFormData>(INITIAL_FORM);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));
  const api = useTrackApi(showId, setTracks);

  // Fetch when the parent didn't seed us — keeps the component usable
  // standalone (e.g. on routes that haven't been migrated to loader
  // prefetching yet).
  useEffect(() => {
    if (initialTracks.length === 0) {
      api.loadTracks();
    }
    // We only want to load once on mount when initialTracks is empty.
  }, [initialTracks.length, api.loadTracks]);

  const resetForm = () => setFormData(INITIAL_FORM);

  const startEditing = (track: Track) => {
    setEditingId(track.id);
    setFormData({
      id: track.id,
      songId: track.songId,
      set: track.set,
      position: track.position,
      segue: track.segue || "none",
      note: track.note,
      song: track.song,
      // Editor displays annotations as a multi-line textarea — one
      // annotation per line.
      annotationDesc:
        track.annotations
          ?.map((annotation) => annotation.desc)
          .filter((desc) => desc)
          .join("\n") || null,
      allTimer: track.allTimer ?? false,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setIsAddingNew(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (formData.songId === "none") {
      toast.error("Please select a song");
      return;
    }

    // For a new track, drop it at the end of its target set; for an
    // edit, keep whatever position the track already has.
    const nextPosition = editingId
      ? formData.position
      : Math.max(0, ...tracks.filter((t) => t.set === formData.set).map((t) => t.position)) + 1;
    const submitData = { ...formData, position: nextPosition };

    const result = editingId
      ? await api.updateTrack({ ...submitData, id: editingId })
      : await api.createTrack(submitData);

    if (result) {
      setEditingId(null);
      setIsAddingNew(false);
      resetForm();
    }
  };

  const handleDelete = (id: string) => setDeleteTrackId(id);

  const confirmDelete = async () => {
    if (deleteTrackId) {
      await api.deleteTrack(deleteTrackId);
      setDeleteTrackId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTrack = tracks.find((track) => track.id === active.id);
    const overTrack = tracks.find((track) => track.id === over.id);
    if (!activeTrack || !overTrack) return;

    // Cross-set drag is intentionally rejected — the server reorder
    // endpoint expects a single set at a time. A toast tells the admin
    // why nothing happened.
    if (activeTrack.set !== overTrack.set) {
      toast.error("Cannot move tracks between different sets yet");
      return;
    }

    const currentSetTracks = tracks.filter((track) => track.set === activeTrack.set);
    const oldIndex = currentSetTracks.findIndex((track) => track.id === active.id);
    const newIndex = currentSetTracks.findIndex((track) => track.id === over.id);
    if (oldIndex === newIndex) return;

    const reorderedSetTracks = arrayMove(currentSetTracks, oldIndex, newIndex);
    const updates = reorderedSetTracks.map((track, index) => ({
      id: track.id,
      position: index + 1,
      set: track.set,
    }));

    // Apply the new positions locally before the server confirms so the
    // row visibly snaps to its new spot — the server PUT just validates.
    setTracks((prev) =>
      prev.map((track) => {
        const update = updates.find((u) => u.id === track.id);
        return update ? { ...track, position: update.position } : track;
      }),
    );
    api.reorderTracks(updates);
  };

  const tracksBySet = tracks.reduce(
    (acc, track) => {
      if (!acc[track.set]) acc[track.set] = [];
      acc[track.set].push(track);
      return acc;
    },
    {} as Record<string, Track[]>,
  );

  const isFormOpen = isAddingNew || editingId !== null;

  return (
    <Card className="card-premium">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-content-text-primary">Track List</CardTitle>
          <Button onClick={() => setIsAddingNew(true)} disabled={isFormOpen} variant="brand">
            <Plus className="h-4 w-4 mr-1" />
            Add Track
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAddingNew && (
          <TrackEditForm
            formData={formData}
            onFormDataChange={setFormData}
            isEditing={false}
            isSubmitting={api.isCreating}
            onSubmit={handleSubmit}
            onCancel={cancelEditing}
          />
        )}

        {Object.keys(tracksBySet).length === 0 ? (
          <div className="text-center py-8 text-content-text-tertiary">
            No tracks added yet. Click "Add Track" to get started.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            {Object.entries(tracksBySet)
              .sort(([a], [b]) => compareSets(a, b))
              .map(([setName, setTracks]) => {
                const sortedTracks = setTracks.sort((a, b) => a.position - b.position);
                const trackIds = sortedTracks.map((track) => track.id);

                return (
                  <div key={setName} className="space-y-2">
                    <h3 className="text-lg font-medium text-brand-secondary border-b border-content-bg-secondary pb-1">
                      {SET_OPTIONS.find((opt) => opt.value === setName)?.label || setName}
                    </h3>

                    <SortableContext items={trackIds} strategy={verticalListSortingStrategy}>
                      <div className="space-y-2">
                        {sortedTracks.map((track) =>
                          editingId === track.id ? (
                            <TrackEditForm
                              key={track.id}
                              formData={formData}
                              onFormDataChange={setFormData}
                              isEditing
                              isSubmitting={api.isUpdating}
                              onSubmit={handleSubmit}
                              onCancel={cancelEditing}
                            />
                          ) : (
                            <SortableTrackItem
                              key={track.id}
                              track={track}
                              onEdit={startEditing}
                              onDelete={handleDelete}
                              isDeleting={api.isDeleting}
                            />
                          ),
                        )}
                      </div>
                    </SortableContext>
                  </div>
                );
              })}
          </DndContext>
        )}
      </CardContent>

      <AlertDialog open={deleteTrackId !== null} onOpenChange={(open) => !open && setDeleteTrackId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Track</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this track? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 border-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
