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
  slug: z.string().nullable(),
  note: z.string().nullable(),
  allTimer: z.boolean().nullable().default(false),
  previousTrackId: z.string().uuid().nullable(),
  nextTrackId: z.string().uuid().nullable(),
  averageRating: z.number().default(0.0).nullable(),
  song: songSchema.nullable().optional(),
  annotations: z.array(annotationSchema).optional(),
});

export type Track = z.infer<typeof trackSchema>;

export const trackMinimalSchema = z.object({
  id: z.string().uuid(),
  songId: z.string().uuid(),
  songSlug: z.string().nullable(),
  songTitle: z.string(),
  segue: z.string().nullable(),
});

export type TrackMinimal = z.infer<typeof trackMinimalSchema>;
