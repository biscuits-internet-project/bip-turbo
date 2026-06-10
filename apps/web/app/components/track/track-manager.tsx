import type { Setlist, Track, TrackFlag, TrackMusicianDelta } from "@bip/domain";
import { formatDuration, parseDuration } from "@bip/domain";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { buildShowFootnotes, footnotesByTrack } from "~/components/setlist/footnotes";
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
import { TrackCompletionsEditor } from "./track-completions-editor";
import { compareSets, SET_OPTIONS } from "./track-constants";
import { TrackEditForm } from "./track-edit-form";
import { TrackFlagEditor } from "./track-flag-editor";
import { deltasToRows, type PerformerRow, rowsToDeltas, TrackPerformerEditor } from "./track-performer-editor";
import { type EarlierPerformance, type TrackFlagFootnoteData, type TrackFormData, useTrackApi } from "./use-track-api";

/** Per-track footnote fields overlaid on the loader's setlist after a save, so a
 *  flag / completion change refreshes the read-only footnotes without a reload. */
type TrackFootnoteOverride = {
  flags?: TrackFlagFootnoteData["flags"];
  flagRecurrences?: TrackFlagFootnoteData["flagRecurrences"];
  segueRecurrences?: TrackFlagFootnoteData["segueRecurrences"];
  completes?: Track["completes"];
};

interface TrackManagerProps {
  showId: string;
  initialTracks?: Track[];
  /** The show's setlist, used only to derive each track's read-only footnotes
   *  (flags, performers, completions, recurrence) through the same engine as
   *  the public setlist. Absent when the parent has no setlist to pass. */
  footnoteSetlist?: Setlist;
}

const INITIAL_FORM: TrackFormData = {
  songId: "none",
  set: "S1",
  position: 1,
  segue: "none",
  note: null,
  annotationDesc: null,
  allTimer: false,
  duration: "",
  durationSource: null,
};

/**
 * The Track List section on the show edit page. Owns the local tracks
 * state + the form-open / editing-row UI lifecycle, and delegates network
 * calls to `useTrackApi` and form rendering to `TrackEditForm`. Drag-and-
 * drop reorder is handled inline because it needs access to the live
 * tracks list to compute optimistic position updates.
 */
export function TrackManager({ showId, initialTracks = [], footnoteSetlist }: TrackManagerProps) {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  // The show's performer deltas, kept in local state so saving a track's
  // performers refreshes its footnotes immediately. Seeded from the loader's
  // setlist; replaced per-track from the save response.
  const [liveDeltas, setLiveDeltas] = useState<TrackMusicianDelta[]>(footnoteSetlist?.trackMusicianDeltas ?? []);
  // Per-track flag / completion overrides applied after a save so the read-only
  // footnotes refresh without a reload (the performer equivalent is liveDeltas).
  const [liveTrackOverrides, setLiveTrackOverrides] = useState<Map<string, TrackFootnoteOverride>>(new Map());
  // Derive the show's footnotes, then slice per track id. Keyed by id so
  // reordering or editing a row keeps each track's footnotes attached. The live
  // performer deltas and per-track overrides are overlaid before deriving.
  const footnotesByTrackId = useMemo(() => {
    if (!footnoteSetlist) return new Map<string, React.ReactNode[]>();
    const overlaid = {
      ...footnoteSetlist,
      trackMusicianDeltas: liveDeltas,
      sets: footnoteSetlist.sets.map((set) => ({
        ...set,
        tracks: set.tracks.map((track) => {
          const override = liveTrackOverrides.get(track.id);
          return override ? { ...track, ...override } : track;
        }),
      })),
    };
    return footnotesByTrack(buildShowFootnotes(overlaid));
  }, [footnoteSetlist, liveDeltas, liveTrackOverrides]);
  // The current flags per track, read from the setlist (the lighter edit-form
  // tracks don't carry them) so editing a row can seed its flag checkboxes.
  const flagsByTrackId = useMemo(() => {
    const map = new Map<string, TrackFlag[]>();
    for (const set of footnoteSetlist?.sets ?? []) {
      for (const track of set.tracks) map.set(track.id, track.flags ?? []);
    }
    return map;
  }, [footnoteSetlist]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteTrackId, setDeleteTrackId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TrackFormData>(INITIAL_FORM);
  // Performer deltas save through their own endpoint, so they live outside
  // formData (which feeds the track PUT). `performersWereSeeded` records
  // whether the open track started with deltas, so clearing them all still
  // fires the save (to delete them) while a never-touched track skips it.
  const [performerRows, setPerformerRows] = useState<PerformerRow[]>([]);
  const [performersWereSeeded, setPerformersWereSeeded] = useState(false);
  // Flags and completion links save through their own endpoints, so like
  // performers they live outside formData. The *WereSeeded flags record whether
  // the open track started with any, so clearing them all still fires the save.
  const [flagRows, setFlagRows] = useState<TrackFlag[]>([]);
  const [flagsWereSeeded, setFlagsWereSeeded] = useState(false);
  const [completionIds, setCompletionIds] = useState<string[]>([]);
  const [completionsWereSeeded, setCompletionsWereSeeded] = useState(false);
  const [earlierPerformances, setEarlierPerformances] = useState<EarlierPerformance[]>([]);
  // Seeds the completion selection once per opened track (a later songId change
  // on a new track must not re-seed and clobber the admin's edits).
  const completionsSeedKeyRef = useRef<string | null>(null);

  const isFormOpen = isAddingNew || editingId !== null;

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

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setPerformerRows([]);
    setPerformersWereSeeded(false);
    setFlagRows([]);
    setFlagsWereSeeded(false);
    setCompletionIds([]);
    setCompletionsWereSeeded(false);
    setEarlierPerformances([]);
    completionsSeedKeyRef.current = null;
  };

  // Load the completions picker options for the open form's song + show date,
  // and seed the current selection once per opened track. The completions shape
  // carries only show date/slug, so the selected earlier-track ids come from the
  // server, not the loader's tracks.
  useEffect(() => {
    const showDate = footnoteSetlist?.show.date;
    if (!isFormOpen || formData.songId === "none" || !showDate) {
      setEarlierPerformances([]);
      return;
    }
    let cancelled = false;
    api.loadEarlierPerformances(formData.songId, showDate, editingId ?? undefined).then((result) => {
      if (cancelled) return;
      setEarlierPerformances(result.performances ?? []);
      const seedKey = editingId ?? "new";
      if (completionsSeedKeyRef.current !== seedKey) {
        completionsSeedKeyRef.current = seedKey;
        setCompletionIds(result.selected ?? []);
        setCompletionsWereSeeded((result.selected ?? []).length > 0);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [isFormOpen, formData.songId, editingId, footnoteSetlist?.show.date, api.loadEarlierPerformances]);

  const startAdding = () => {
    resetForm();
    setIsAddingNew(true);
  };

  const startEditing = (track: Track) => {
    setEditingId(track.id);
    const deltas = liveDeltas.filter((delta) => delta.trackId === track.id);
    setPerformerRows(deltasToRows(deltas));
    setPerformersWereSeeded(deltas.length > 0);
    // Flags come from the setlist (or a prior save's override), not the lighter
    // edit-form track; completions are seeded by the picker-load effect.
    const seedFlags = liveTrackOverrides.get(track.id)?.flags ?? flagsByTrackId.get(track.id) ?? [];
    setFlagRows(seedFlags);
    setFlagsWereSeeded(seedFlags.length > 0);
    completionsSeedKeyRef.current = null;
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
      duration: track.duration != null ? formatDuration(track.duration) : "",
      durationSource: track.durationSource,
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

    if (formData.duration.trim() !== "" && parseDuration(formData.duration) === null) {
      toast.error("Duration must look like 8:42, 1:04:18, or a number of seconds");
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

    if (!result) return;

    // Save performer deltas under the same button, keyed by the resulting
    // track id (the newly created id for an add). Skip the write entirely when
    // the track had no deltas and none were added, so a plain note edit pays
    // nothing for performers.
    const deltas = rowsToDeltas(performerRows);
    if (deltas.length > 0 || performersWereSeeded) {
      const fresh = await api.setPerformers(result.id, deltas);
      // Swap this track's deltas in local state so its read-only footnotes
      // re-derive immediately, without reloading the page.
      if (fresh) {
        setLiveDeltas((prev) => [...prev.filter((delta) => delta.trackId !== result.id), ...fresh]);
      }
    }

    // Flags save under the same button and recompute the song's recurrence;
    // skip when the track had none and none were added so a plain note edit
    // pays nothing.
    if (flagRows.length > 0 || flagsWereSeeded) {
      const fresh = await api.setFlags(result.id, flagRows);
      if (fresh) {
        setLiveTrackOverrides((prev) =>
          new Map(prev).set(result.id, {
            ...prev.get(result.id),
            flags: fresh.flags,
            flagRecurrences: fresh.flagRecurrences,
            segueRecurrences: fresh.segueRecurrences,
          }),
        );
      }
    }

    // Completion links likewise (display-only, no recompute).
    if (completionIds.length > 0 || completionsWereSeeded) {
      const fresh = await api.setCompletions(result.id, completionIds);
      if (fresh) {
        setLiveTrackOverrides((prev) => new Map(prev).set(result.id, { ...prev.get(result.id), completes: fresh }));
      }
    }

    setEditingId(null);
    setIsAddingNew(false);
    resetForm();
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

  return (
    <Card className="card-premium">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-content-text-primary">Track List</CardTitle>
          <Button onClick={startAdding} disabled={isFormOpen} variant="brand">
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
            isSubmitting={api.isCreating || api.isSavingPerformers || api.isSavingFlags || api.isSavingCompletions}
            onSubmit={handleSubmit}
            onCancel={cancelEditing}
          >
            <TrackFlagEditor flags={flagRows} onChange={setFlagRows} />
            <TrackCompletionsEditor options={earlierPerformances} value={completionIds} onChange={setCompletionIds} />
            <TrackPerformerEditor rows={performerRows} onChange={setPerformerRows} />
          </TrackEditForm>
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
                              isSubmitting={
                                api.isUpdating || api.isSavingPerformers || api.isSavingFlags || api.isSavingCompletions
                              }
                              onSubmit={handleSubmit}
                              onCancel={cancelEditing}
                            >
                              <TrackFlagEditor flags={flagRows} onChange={setFlagRows} />
                              <TrackCompletionsEditor
                                options={earlierPerformances}
                                value={completionIds}
                                onChange={setCompletionIds}
                              />
                              <TrackPerformerEditor rows={performerRows} onChange={setPerformerRows} />
                            </TrackEditForm>
                          ) : (
                            <SortableTrackItem
                              key={track.id}
                              track={track}
                              footnotes={footnotesByTrackId.get(track.id)}
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
