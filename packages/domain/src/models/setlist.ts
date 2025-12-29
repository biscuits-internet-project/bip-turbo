import type { Annotation } from "./annotation";
import type { Show } from "./show";
import type { Track, TrackLight } from "./track";
import type { Venue } from "./venue";

export type Set = {
  label: string;
  sort: number;
  tracks: Track[];
};

export type Setlist = {
  show: Show;
  venue: Venue;
  sets: Set[];
  annotations: Annotation[];
};

export type SetLight = {
  label: string;
  sort: number;
  tracks: TrackLight[];
};

export type SetlistLight = {
  show: Show;
  venue: Venue;
  sets: SetLight[];
  annotations: Annotation[];
};
