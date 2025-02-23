import type { Show, ShowMinimal } from "../models/show";
import type { Song, SongMinimal } from "../models/song";
import type { TrackMinimal } from "../models/track";
import type { VenueMinimal } from "../models/venue";

export type SongPageView = {
  song: Song;
  performances: SongPagePerformance[];
};

export type SongPagePerformance = {
  trackId: string;
  show: ShowMinimal;
  venue?: VenueMinimal;
  songBefore?: TrackMinimal;
  songAfter?: TrackMinimal;
  rating?: number;
  notes?: string;
  allTimer?: boolean;
};
