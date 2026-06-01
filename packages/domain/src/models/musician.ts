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
  defaultInstrumentId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Musician = z.infer<typeof musicianSchema>;

export const showMusicianSchema = z.object({
  id: z.string().uuid(),
  showId: z.string().uuid(),
  musicianId: z.string().uuid(),
  instrumentId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ShowMusician = z.infer<typeof showMusicianSchema>;

export const trackMusicianSchema = z.object({
  id: z.string().uuid(),
  trackId: z.string().uuid(),
  musicianId: z.string().uuid(),
  present: z.boolean(),
  instrumentId: z.string().uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TrackMusician = z.infer<typeof trackMusicianSchema>;
