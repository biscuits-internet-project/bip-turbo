import type { Annotation, Track, TrackMinimal } from "@bip/domain";
import type { AnnotationRow, SongRow, TrackRow } from "../_shared/drizzle/types";
import { transformSong } from "../songs/song-transformer";

export function transformAnnotation(annotation: AnnotationRow): Annotation {
  return {
    ...annotation,
    createdAt: new Date(annotation.createdAt),
    updatedAt: new Date(annotation.updatedAt),
  };
}

export function transformTrack(track: TrackRow): Track {
  return {
    ...track,
    createdAt: new Date(track.createdAt),
    updatedAt: new Date(track.updatedAt),
    songId: track.songId as string,
    annotations: track.annotations?.map((a) => transformAnnotation(a)) ?? [],
    song: track.song ? transformSong(track.song) : null,
  };
}

export function transformTrackMinimal(track: TrackRow, song: SongRow): TrackMinimal {
  return {
    id: track.id,
    songId: track.songId as string,
    songSlug: track.song?.slug ?? null,
    songTitle: track.song?.title ?? "",
    segue: track.segue ?? null,
  };
}
