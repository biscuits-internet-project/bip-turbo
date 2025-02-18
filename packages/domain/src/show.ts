import { z } from "zod";
import { trackSchema } from "./track";
import { venueSchema } from "./venue";

export const showSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().nullable(),
  date: z.date(),
  venueId: z.string().uuid().nullable(),
  bandId: z.string().uuid().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  likesCount: z.number().default(0),
  relistenUrl: z.string().nullable(),
  averageRating: z.number().default(0.0).nullable(),
  showPhotosCount: z.number().default(0),
  showYoutubesCount: z.number().default(0),
  reviewsCount: z.number().default(0),
  tracks: z.array(trackSchema).nullable().optional(),
  venue: venueSchema.nullable().optional(),
});

export type Show = z.infer<typeof showSchema>;
