import { z } from "zod";

export const instrumentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Instrument = z.infer<typeof instrumentSchema>;

export const musicianSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  knownFrom: z.string().nullable(),
  defaultInstrumentId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Musician = z.infer<typeof musicianSchema>;

export const showMusicianSchema = z.object({
  id: z.string().uuid(),
  showId: z.string().uuid(),
  musicianId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ShowMusician = z.infer<typeof showMusicianSchema>;

export const trackMusicianSchema = z.object({
  id: z.string().uuid(),
  trackId: z.string().uuid(),
  musicianId: z.string().uuid(),
  present: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TrackMusician = z.infer<typeof trackMusicianSchema>;

export const showMusicianInstrumentSchema = z.object({
  id: z.string().uuid(),
  showMusicianId: z.string().uuid(),
  instrumentId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ShowMusicianInstrument = z.infer<typeof showMusicianInstrumentSchema>;

export const trackMusicianInstrumentSchema = z.object({
  id: z.string().uuid(),
  trackMusicianId: z.string().uuid(),
  instrumentId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TrackMusicianInstrument = z.infer<typeof trackMusicianInstrumentSchema>;

/**
 * A musician plus their appearance aggregates, for the /musicians index table.
 * Dates are ISO `YYYY-MM-DD` strings (null when the musician has no recorded
 * appearances yet).
 */
export type MusicianWithStats = {
  id: string;
  name: string;
  slug: string;
  knownFrom: string | null;
  defaultInstrumentName: string | null;
  trackCount: number;
  showCount: number;
  firstShowDate: string | null;
  lastShowDate: string | null;
};

/**
 * A single appearance show (earliest or latest) with enough to render a linked
 * first/last performance card: date, show slug, and venue.
 */
export type MusicianAppearanceShow = {
  date: string;
  slug: string | null;
  venue: { name: string | null; city: string | null; state: string | null } | null;
};

/** A musician's appearance summary for their profile header and tables. */
export type MusicianAppearances = {
  showIds: string[];
  trackCount: number;
  firstShow: MusicianAppearanceShow | null;
  lastShow: MusicianAppearanceShow | null;
};

/**
 * One song a musician has played, with their play count and date span, for the
 * songs table on a musician profile. Dates are ISO `YYYY-MM-DD` strings.
 */
export type MusicianSongPlay = {
  songId: string;
  title: string;
  slug: string;
  playCount: number;
  firstShow: MusicianAppearanceShow | null;
  lastShow: MusicianAppearanceShow | null;
};

/**
 * One performance (a single show) of a song by a musician, for the
 * per-performance ("All Performances") list view on a profile. `date` is an
 * ISO `YYYY-MM-DD` string.
 */
export type MusicianPerformance = {
  trackId: string;
  date: string;
  showSlug: string | null;
  songTitle: string;
  songSlug: string;
  venue: { name: string | null; city: string | null; state: string | null } | null;
};

/**
 * A musician as referenced from a lineup or footnote: identity plus the
 * resolved default instrument, enough to render a linked name and "known from"
 * blurb without a second lookup.
 */
export type MusicianRef = {
  id: string;
  name: string;
  slug: string;
  knownFrom: string | null;
  defaultInstrument: Instrument | null;
};

/** One member of a show's default lineup, with the instruments they played. */
export type ShowLineupMember = {
  musician: MusicianRef;
  instruments: Instrument[];
};

/**
 * A per-track deviation from the show lineup. `present === true` is a sit-in
 * (someone who also played this track); `present === false` is a sat-out.
 */
export type TrackMusicianDelta = {
  trackId: string;
  musician: MusicianRef;
  present: boolean;
  instruments: Instrument[];
};
