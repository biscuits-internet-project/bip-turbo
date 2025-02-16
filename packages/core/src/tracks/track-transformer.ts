import type { Track } from "@bip/domain";
import type { TrackRow } from "../_shared/drizzle/types";

export function transformTrack(track: TrackRow): Track {
  return {
    ...track,
    createdAt: new Date(track.createdAt),
    updatedAt: new Date(track.updatedAt),
  };
}
