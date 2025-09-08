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
import { useMutation } from "@tanstack/react-query";
import { Check, Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { SongSearch } from "~/components/song/song-search";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { SortableTrackItem } from "./sortable-track-item";

interface TrackManagerProps {
  showId: string;
  initialTracks?: Track[];
}

interface TrackFormData {
  id?: string;
  songId: string;
  set: string;
  position: number;
  segue: string;
  note: string | null;
  song?: Track["song"];
  annotationDesc?: string | null;
}

const SET_OPTIONS = [
  { value: "S1", label: "Set 1" },
  { value: "S2", label: "Set 2" },
  { value: "S3", label: "Set 3" },
  { value: "E1", label: "Encore 1" },
  { value: "E2", label: "Encore 2" },
  { value: "E3", label: "Encore 3" },
];

const SEGUE_OPTIONS = [
  { value: "none", label: "No segue" },
  { value: ">", label: ">" },
];

export function TrackManager({ showId, initialTracks = [] }: TrackManagerProps) {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteTrackId, setDeleteTrackId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TrackFormData>({
    songId: "none",
    set: "S1",
    position: 1,
    segue: "none",
    note: null,
    annotationDesc: null,
  });

  // Set up drag and drop sensors
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const loadTracks = useCallback(async () => {
    try {
      const response = await fetch(`/api/tracks?showId=${showId}`);
      if (response.ok) {
        const data = await response.json();
        setTracks(data);
      }
    } catch (error) {
      console.error("Failed to load tracks:", error);
      toast.error("Failed to load tracks");
    }
  }, [showId]);

  // Load tracks when component mounts
  useEffect(() => {
    if (initialTracks.length === 0) {
      loadTracks();
    }
  }, [initialTracks.length, loadTracks]);

  // Create track mutation
  const createTrackMutation = useMutation({
    mutationFn: async (data: TrackFormData) => {
      const response = await fetch("/api/tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          showId,
          songId: data.songId === "none" ? undefined : data.songId,
          segue: data.segue === "none" ? null : data.segue,
          annotationDesc: data.annotationDesc,
        }),
      });
      if (!response.ok) throw new Error("Failed to create track");
      return response.json();
    },
    onSuccess: async (newTrack) => {
      // Fetch song information for the newly created track
      let trackWithSong = newTrack;
      if (newTrack.songId && !newTrack.song) {
        try {
          const response = await fetch(`/api/songs/${newTrack.songId}`);
          if (response.ok) {
            const song = await response.json();
            trackWithSong = { ...newTrack, song };
          }
        } catch (error) {
          console.error("Failed to fetch song:", error);
        }
      }

      setTracks((prev) =>
        [...prev, trackWithSong].sort((a, b) => {
          if (a.set !== b.set) return sortSets(a.set, b.set);
          return a.position - b.position;
        }),
      );
      setIsAddingNew(false);
      resetForm();
      toast.success("Track added successfully");
    },
    onError: () => toast.error("Failed to add track"),
  });

  // Update track mutation
  const updateTrackMutation = useMutation({
    mutationFn: async ({ id, ...data }: TrackFormData & { id: string }) => {
      const response = await fetch(`/api/tracks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          songId: data.songId === "none" ? undefined : data.songId,
          segue: data.segue === "none" ? null : data.segue,
          annotationDesc: data.annotationDesc,
        }),
      });
      if (!response.ok) throw new Error("Failed to update track");
      return response.json();
    },
    onSuccess: (updatedTrack) => {
      setTracks((prev) =>
        prev
          .map((track) => (track.id === updatedTrack.id ? updatedTrack : track))
          .sort((a, b) => {
            if (a.set !== b.set) return sortSets(a.set, b.set);
            return a.position - b.position;
          }),
      );
      setEditingId(null);
      resetForm();
      toast.success("Track updated successfully");
    },
    onError: () => toast.error("Failed to update track"),
  });

  // Delete track mutation
  const deleteTrackMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tracks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete track");
    },
    onSuccess: (_, deletedId) => {
      setTracks((prev) => prev.filter((track) => track.id !== deletedId));
      toast.success("Track deleted successfully");
    },
    onError: () => toast.error("Failed to delete track"),
  });

  // Reorder tracks mutation
  const reorderTracksMutation = useMutation({
    mutationFn: async (updates: { id: string; position: number; set: string }[]) => {
      const response = await fetch("/api/tracks/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!response.ok) throw new Error("Failed to reorder tracks");
      return response.json();
    },
    onSuccess: (updatedTracks) => {
      // Update local state with new positions, preserving song data
      setTracks((prev) =>
        prev.map((track) => {
          const updated = updatedTracks.find((t: Track) => t.id === track.id);
          if (updated) {
            // Merge updated track data with original track's song data
            return { ...track, ...updated };
          }
          return track;
        }),
      );
      toast.success("Track order updated");
    },
    onError: () => toast.error("Failed to reorder tracks"),
  });

  // Helper function to sort sets properly (S1, S2, S3, E1, E2, E3)
  const sortSets = (a: string, b: string) => {
    const setOrder = { S: 0, E: 1 };
    const aType = a.charAt(0) as "S" | "E";
    const bType = b.charAt(0) as "S" | "E";
    const aNum = parseInt(a.slice(1));
    const bNum = parseInt(b.slice(1));

    if (aType !== bType) {
      return setOrder[aType] - setOrder[bType];
    }
    return aNum - bNum;
  };

  const resetForm = () => {
    setFormData({
      songId: "none",
      set: "S1",
      position: 1,
      segue: "none",
      note: null,
      annotationDesc: null,
    });
  };

  const startEditing = (track: Track) => {
    setEditingId(track.id);
    // Join all annotations with line breaks for editing
    const annotationsText =
      track.annotations
        ?.map((annotation) => annotation.desc)
        .filter((desc) => desc)
        .join("\n") || null;

    setFormData({
      id: track.id,
      songId: track.songId,
      set: track.set,
      position: track.position,
      segue: track.segue || "none",
      note: track.note,
      song: track.song,
      annotationDesc: annotationsText,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setIsAddingNew(false);
    resetForm();
  };

  const handleSubmit = (position?: number) => {
    if (formData.songId === "none") {
      toast.error("Please select a song");
      return;
    }

    const submitData = {
      ...formData,
      position: position || formData.position,
    };

    if (editingId) {
      updateTrackMutation.mutate({ ...submitData, id: editingId });
    } else {
      createTrackMutation.mutate(submitData);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteTrackId(id);
  };

  const confirmDelete = () => {
    if (deleteTrackId) {
      deleteTrackMutation.mutate(deleteTrackId);
      setDeleteTrackId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeTrack = tracks.find((track) => track.id === active.id);
    const overTrack = tracks.find((track) => track.id === over.id);

    if (!activeTrack || !overTrack) {
      return;
    }

    // Only allow reordering within the same set for now
    if (activeTrack.set !== overTrack.set) {
      toast.error("Cannot move tracks between different sets yet");
      return;
    }

    const currentSetTracks = tracks.filter((track) => track.set === activeTrack.set);
    const oldIndex = currentSetTracks.findIndex((track) => track.id === active.id);
    const newIndex = currentSetTracks.findIndex((track) => track.id === over.id);

    if (oldIndex !== newIndex) {
      // Reorder tracks within the set
      const reorderedSetTracks = arrayMove(currentSetTracks, oldIndex, newIndex);

      // Update positions
      const updates = reorderedSetTracks.map((track, index) => ({
        id: track.id,
        position: index + 1,
        set: track.set,
      }));

      // Optimistically update local state
      const updatedTracks = tracks.map((track) => {
        const update = updates.find((u) => u.id === track.id);
        return update ? { ...track, position: update.position } : track;
      });

      setTracks(updatedTracks);

      // Send updates to server
      reorderTracksMutation.mutate(updates);
    }
  };

  // Group tracks by set
  const tracksBySet = tracks.reduce(
    (acc, track) => {
      if (!acc[track.set]) acc[track.set] = [];
      acc[track.set].push(track);
      return acc;
    },
    {} as Record<string, Track[]>,
  );

  const renderTrackForm = () => {
    // Auto-calculate position for new tracks
    const nextPosition = editingId
      ? formData.position
      : Math.max(0, ...tracks.filter((t) => t.set === formData.set).map((t) => t.position)) + 1;

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 p-4 bg-content-bg/50 rounded-lg border border-content-bg-secondary">
        <div className="md:col-span-2">
          <label htmlFor="track-song" className="block text-sm font-medium text-content-text-secondary mb-1">
            Song
          </label>
          <SongSearch
            value={formData.songId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, songId: value }))}
            placeholder="Select a song..."
            className="w-full"
            initialSong={formData.song}
          />
        </div>

        <div>
          <label htmlFor="track-set" className="block text-sm font-medium text-content-text-secondary mb-1">
            Set
          </label>
          <Select value={formData.set} onValueChange={(value) => setFormData((prev) => ({ ...prev, set: value }))}>
            <SelectTrigger
              id="track-set"
              className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-content-bg-secondary border-content-bg-secondary">
              {SET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-content-text-primary">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="track-segue" className="block text-sm font-medium text-content-text-secondary mb-1">
            Segue
          </label>
          <Select value={formData.segue} onValueChange={(value) => setFormData((prev) => ({ ...prev, segue: value }))}>
            <SelectTrigger
              id="track-segue"
              className="bg-content-bg-secondary border-content-bg-secondary text-content-text-primary"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-content-bg-secondary border-content-bg-secondary">
              {SEGUE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="text-content-text-primary">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="track-annotation" className="block text-sm font-medium text-content-text-secondary mb-1">
            Annotations
            <span className="ml-2 text-xs text-content-text-tertiary">(one per line)</span>
          </label>
          <textarea
            id="track-annotation"
            value={formData.annotationDesc || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, annotationDesc: e.target.value || null }))}
            placeholder="Add annotations (one per line)..."
            className="w-full px-3 py-2 bg-content-bg-secondary border border-content-bg-secondary text-content-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary"
            rows={3}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            onClick={() => handleSubmit(nextPosition)}
            disabled={createTrackMutation.isPending || updateTrackMutation.isPending}
            className="bg-brand-primary hover:bg-hover-accent"
          >
            <Check className="h-4 w-4 mr-1" />
            {editingId ? "Update" : "Add"}
          </Button>
          <Button
            onClick={cancelEditing}
            variant="outline"
            className="border-content-bg-secondary text-content-text-secondary"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-content-bg-secondary bg-content-bg/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-content-text-primary">Track List</CardTitle>
          <Button
            onClick={() => setIsAddingNew(true)}
            disabled={isAddingNew || editingId !== null}
            className="bg-brand-primary hover:bg-hover-accent"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Track
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAddingNew && renderTrackForm()}

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
              .sort(([a], [b]) => sortSets(a, b))
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
                        {sortedTracks.map((track) => (
                          <div key={track.id}>
                            {editingId === track.id ? (
                              renderTrackForm()
                            ) : (
                              <SortableTrackItem
                                track={track}
                                onEdit={startEditing}
                                onDelete={handleDelete}
                                isDeleting={deleteTrackMutation.isPending}
                              />
                            )}
                          </div>
                        ))}
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
