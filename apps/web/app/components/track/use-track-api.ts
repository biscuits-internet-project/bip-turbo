import type { Track, TrackMusicianDelta } from "@bip/domain";
import { parseDuration } from "@bip/domain";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { compareSets } from "./track-constants";

export interface TrackFormData {
  id?: string;
  songId: string;
  set: string;
  position: number;
  segue: string;
  note: string | null;
  song?: Track["song"];
  annotationDesc?: string | null;
  allTimer: boolean;
  /** Raw admin input ("8:42" / "1:04:18" / "522"); parsed to seconds on save. */
  duration: string;
  /** Where the current duration came from (nugs/archive/manual); display only. */
  durationSource: string | null;
}

type SetTracks = (updater: (prev: Track[]) => Track[]) => void;

/** One per-track performer change as the performers endpoint expects it:
 *  `present: true` is a sit-in (also played), `false` a sat-out. */
export interface TrackPerformerDelta {
  musicianId: string;
  present: boolean;
  instrumentIds: string[];
}

function sortTracks(tracks: Track[]): Track[] {
  return [...tracks].sort((a, b) => {
    if (a.set !== b.set) return compareSets(a.set, b.set);
    return a.position - b.position;
  });
}

// Translates the form's "none" sentinels to the shape the API expects.
// "none" songId → undefined (omitted), "none" segue → null (explicitly cleared).
function buildSavePayload(data: TrackFormData) {
  // durationSource is display-only — the server stamps "manual" on save.
  const { duration, durationSource: _durationSource, ...rest } = data;
  return {
    ...rest,
    songId: data.songId === "none" ? undefined : data.songId,
    segue: data.segue === "none" ? null : data.segue,
    annotationDesc: data.annotationDesc,
    // Empty clears the duration; a non-empty value is pre-validated by the
    // caller, so parseDuration is guaranteed to succeed here.
    duration: duration.trim() === "" ? null : parseDuration(duration),
  };
}

/**
 * Owns the four track-mutation network calls (create / update / delete /
 * reorder) plus the initial load. Each call updates the parent's tracks
 * state via the supplied `setTracks` updater and fires a toast on
 * success/failure. UI state transitions (closing the form, resetting
 * fields, etc.) stay with the caller.
 */
export function useTrackApi(showId: string, setTracks: SetTracks) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingPerformers, setIsSavingPerformers] = useState(false);

  const loadTracks = useCallback(async () => {
    try {
      const response = await fetch(`/api/tracks?showId=${showId}`);
      if (response.ok) {
        const data = (await response.json()) as Track[];
        setTracks(() => data);
      }
    } catch {
      toast.error("Failed to load tracks");
    }
  }, [showId, setTracks]);

  const createTrack = useCallback(
    async (data: TrackFormData): Promise<Track | null> => {
      setIsCreating(true);
      try {
        const response = await fetch("/api/tracks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...buildSavePayload(data), showId }),
        });
        if (!response.ok) throw new Error("Failed to create track");
        const newTrack = (await response.json()) as Track;

        // Hydrate the song relation if the server didn't include it — keeps
        // the row label correct without forcing a full reload.
        let trackWithSong = newTrack;
        if (newTrack.songId && !newTrack.song) {
          try {
            const songResponse = await fetch(`/api/songs/${newTrack.songId}`);
            if (songResponse.ok) {
              const song = await songResponse.json();
              trackWithSong = { ...newTrack, song };
            }
          } catch {
            // Non-fatal — the row still renders, just with whatever the
            // create endpoint returned.
          }
        }

        setTracks((prev) => sortTracks([...prev, trackWithSong]));
        toast.success("Track added successfully");
        return trackWithSong;
      } catch {
        toast.error("Failed to add track");
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    [showId, setTracks],
  );

  const updateTrack = useCallback(
    async ({ id, ...data }: TrackFormData & { id: string }): Promise<Track | null> => {
      setIsUpdating(true);
      try {
        const response = await fetch(`/api/tracks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildSavePayload(data)),
        });
        if (!response.ok) throw new Error("Failed to update track");
        const updatedTrack = (await response.json()) as Track;

        setTracks((prev) => sortTracks(prev.map((track) => (track.id === updatedTrack.id ? updatedTrack : track))));
        toast.success("Track updated successfully");
        return updatedTrack;
      } catch {
        toast.error("Failed to update track");
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [setTracks],
  );

  const deleteTrack = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/tracks/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Failed to delete track");
        setTracks((prev) => prev.filter((track) => track.id !== id));
        toast.success("Track deleted successfully");
        return true;
      } catch {
        toast.error("Failed to delete track");
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [setTracks],
  );

  // Returns the saved deltas (resolved with names) so the caller can refresh
  // its read-only footnotes, or null when the save failed.
  const setPerformers = useCallback(
    async (trackId: string, deltas: TrackPerformerDelta[]): Promise<TrackMusicianDelta[] | null> => {
      setIsSavingPerformers(true);
      try {
        const response = await fetch(`/api/tracks/${trackId}/performers`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deltas }),
        });
        // The endpoint returns a 400 with a human-readable message (e.g. a
        // sit-in for a musician already in the lineup); surface it verbatim.
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const data = (await response.json()) as { deltas: TrackMusicianDelta[] };
        return data.deltas;
      } catch (error) {
        toast.error(error instanceof Error && error.message ? error.message : "Failed to save performers");
        return null;
      } finally {
        setIsSavingPerformers(false);
      }
    },
    [],
  );

  const reorderTracks = useCallback(
    async (updates: { id: string; position: number; set: string }[]): Promise<void> => {
      try {
        const response = await fetch("/api/tracks/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updates }),
        });
        if (!response.ok) throw new Error("Failed to reorder tracks");
        const updatedTracks = (await response.json()) as Partial<Track>[];

        // Merge server-confirmed positions back into local state while
        // preserving any client-only relation data the server didn't echo.
        setTracks((prev) =>
          prev.map((track) => {
            const updated = updatedTracks.find((t) => t.id === track.id);
            return updated ? { ...track, ...updated } : track;
          }),
        );
        toast.success("Track order updated");
      } catch {
        toast.error("Failed to reorder tracks");
      }
    },
    [setTracks],
  );

  return {
    loadTracks,
    createTrack,
    updateTrack,
    deleteTrack,
    reorderTracks,
    setPerformers,
    isCreating,
    isUpdating,
    isDeleting,
    isSavingPerformers,
  };
}
