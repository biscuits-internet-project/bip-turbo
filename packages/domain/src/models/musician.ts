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
