import type { Annotation } from "./annotation";
import type { Show } from "./show";
import type { Track } from "./track";
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
