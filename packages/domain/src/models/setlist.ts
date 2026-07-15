import type { Annotation } from "./annotation";
import type { ShowLineupMember, TrackMusicianDelta } from "./musician";
import type { RockOperaPerformanceAnnotation } from "./rock-opera";
import type { Show } from "./show";
import type { TrackLight } from "./track";
import type { Venue } from "./venue";

export type Set = {
  label: string;
  sort: number;
  tracks: TrackLight[];
};

/**
 * One show's setlist as every consumer reads it: tracks carry the lean
 * SongLight (id/title/slug/kind/authorName/dateFirstPlayed), never the
 * text-heavy song columns (lyrics, history, notes, tabs). This shape is
 * what the redis-cached show page, list views, and MCP getters all serve.
 */
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
  /**
   * Rock opera annotations for this show. Populated only by single-show
   * fetches (services.setlists.findByShowSlug); list-page composers leave
   * this empty so list pages pay no lookup cost.
   */
  rockOperaPerformances: RockOperaPerformanceAnnotation[];
  /**
   * The show's default performer lineup. Populated only by single-show fetches
   * (services.setlists.findByShowSlug); list-page composers leave this empty.
   */
  lineup: ShowLineupMember[];
  /**
   * Per-track sit-in / sat-out deviations from the lineup, used to synthesize
   * performer footnotes. Populated only by single-show fetches.
   */
  trackMusicianDeltas: TrackMusicianDelta[];
};
