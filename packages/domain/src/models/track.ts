import { z } from "zod";
import { annotationSchema } from "./annotation";
import { songSchema } from "./song";

export const trackSchema = z.object({
  id: z.string().uuid(),
  showId: z.string().uuid(),
  songId: z.string().uuid(),
  set: z.string(),
  position: z.number(),
  segue: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  likesCount: z.number().default(0),
  slug: z.string(),
  note: z.string().nullable(),
  allTimer: z.boolean().nullable().default(false),
  previousTrackId: z.string().uuid().nullable(),
  nextTrackId: z.string().uuid().nullable(),
  averageRating: z.number().default(0.0).nullable(),
  ratingsCount: z.number().default(0),
  song: songSchema.optional(),
  annotations: z.array(annotationSchema).optional(),
});

export type Track = z.infer<typeof trackSchema>;

export const trackMinimalSchema = z.object({
  id: z.string().uuid(),
  songId: z.string().uuid(),
  songSlug: z.string(),
  songTitle: z.string(),
  segue: z.string().nullable(),
});

export type TrackMinimal = z.infer<typeof trackMinimalSchema>;

export const songLightSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
});

export type SongLight = z.infer<typeof songLightSchema>;

export const trackLightSchema = z.object({
  id: z.string().uuid(),
  showId: z.string().uuid(),
  songId: z.string().uuid(),
  set: z.string(),
  position: z.number(),
  segue: z.string().nullable(),
  likesCount: z.number().default(0),
  note: z.string().nullable(),
  allTimer: z.boolean().nullable().default(false),
  averageRating: z.number().default(0.0).nullable(),
  ratingsCount: z.number().default(0),
  song: songLightSchema.optional(),
});

export type TrackLight = z.infer<typeof trackLightSchema>;

export const trackUpdateSchema = trackSchema
  .pick({
    songId: true,
    set: true,
    position: true,
    segue: true,
    note: true,
    allTimer: true,
  })
  .extend({
    annotationDesc: z.string().nullable().optional(),
  })
  .partial();

export type TrackUpdate = z.infer<typeof trackUpdateSchema>;
