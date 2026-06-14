import type { Annotation } from "../models/annotation";
import type { ShowMinimal } from "../models/show";
import type { Song, SongKind } from "../models/song";
import type { TrackFlag, TrackMinimal } from "../models/track";
import type { VenueMinimal } from "../models/venue";

export type SongPageView = {
  song: Song;
  performances: SongPagePerformance[];
  showsByYear: Record<number, number>;
};

export type SongPagePerformance = {
  trackId: string;
  show: ShowMinimal;
  venue?: VenueMinimal;
  songBefore?: TrackMinimal;
  songAfter?: TrackMinimal;
  rating?: number;
  ratingsCount?: number;
  notes?: string;
  allTimer?: boolean;
  segue?: string | null;
  annotations?: Annotation[];
  // Structured performance markers backing the inverted/dyslexic/unfinished tags.
  flags?: TrackFlag[];
  set?: string;
  position?: number;
  songTitle?: string;
  songSlug?: string;
  kind?: SongKind | null;
  duration?: number | null;
  durationSource?: string | null;
  gap?: number | null;
  // Distinct encore count for this performance's show. Required so any code
  // building a performance row must supply it, which keeps the Set column's
  // "E1" → "E" collapse (single-encore shows) working on every cross-show
  // table without a silent fallback. Mirrors the single-show setlist views.
  encoresInSet: number;
  // Gap measured against the previous performance of this song within the
  // currently-applied filter scope. Populated server-side only when a
  // narrowing filter is active.
  filteredGap?: number | null;
  previousPerformanceShowId?: string | null;
  previousShow?: { slug: string; date: string };
  tags?: {
    setOpener?: boolean;
    setCloser?: boolean;
    encore?: boolean;
    inverted?: boolean;
    dyslexic?: boolean;
    unfinished?: boolean;
    standalone?: boolean;
    segueIn?: boolean;
    segueOut?: boolean;
  };
};

export type AllTimersPageView = {
  performances: SongPagePerformance[];
};
