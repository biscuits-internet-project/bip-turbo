import type { Track } from "@bip/domain";
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
}

type SetTracks = (updater: (prev: Track[]) => Track[]) => void;

function sortTracks(tracks: Track[]): Track[] {
  return [...tracks].sort((a, b) => {
    if (a.set !== b.set) return compareSets(a.set, b.set);
    return a.position - b.position;
  });
}

// Translates the form's "none" sentinels to the shape the API expects.
// "none" songId → undefined (omitted), "none" segue → null (explicitly cleared).
function buildSavePayload(data: TrackFormData) {
  return {
    ...data,
    songId: data.songId === "none" ? undefined : data.songId,
    segue: data.segue === "none" ? null : data.segue,
    annotationDesc: data.annotationDesc,
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
    isCreating,
    isUpdating,
    isDeleting,
  };
}
