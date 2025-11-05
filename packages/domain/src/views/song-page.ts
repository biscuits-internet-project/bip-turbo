import type { Annotation } from "../models/annotation";
import type { ShowMinimal } from "../models/show";
import type { Song } from "../models/song";
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
  ratingsCount?: number;
  notes?: string;
  allTimer?: boolean;
  segue?: string | null;
  annotations?: Annotation[];
  set?: string;
  position?: number;
  tags?: {
    setOpener?: boolean;
    setCloser?: boolean;
    encore?: boolean;
    inverted?: boolean;
    dyslexic?: boolean;
    standalone?: boolean;
    segueIn?: boolean;
    segueOut?: boolean;
  };
};
