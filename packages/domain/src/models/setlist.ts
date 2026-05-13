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
  averageSongGap: number | null;
  medianSongGap: number | null;
  /**
   * Number of distinct catalog debuts in this show (tracks with `gap === null`,
   * counting each song once even if played twice). Shown alongside the avg/median
   * because debuts are excluded from those numbers but still signal rarity.
   */
  debutCount: number;
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
  averageSongGap: number | null;
  medianSongGap: number | null;
  /**
   * Number of distinct catalog debuts in this show (tracks with `gap === null`,
   * counting each song once even if played twice). Shown alongside the avg/median
   * because debuts are excluded from those numbers but still signal rarity.
   */
  debutCount: number;
};
