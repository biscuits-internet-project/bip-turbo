import { z } from "zod";
import { trackSchema } from "./track";
import { venueSchema } from "./venue";

export const showSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  date: z.date(),
  venueId: z.string().uuid(),
  bandId: z.string().uuid(),
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
  venue: venueSchema.optional(),
});

export const showMinimalSchema = showSchema.pick({
  id: true,
  slug: true,
  date: true,
  venueId: true,
});

export interface TourDate {
  venueName: string;
  formattedStartDate: string;
  formattedEndDate: string;
  date: string;
  details: string;
  address: string;
}

export type Show = z.infer<typeof showSchema>;
export type ShowMinimal = z.infer<typeof showMinimalSchema>;
