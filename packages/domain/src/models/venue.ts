import { z } from "zod";

export const venueSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  city: z.string(),
  state: z.string().nullable(),
  country: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  timesPlayed: z.number().default(0),
  // Curated contact + geocode columns mirrored from prod via sync-missing-shows.
  // Optional because callers that select a narrower set (search hits, venue
  // pickers) don't carry these.
  street: z.string().nullable().optional(),
  postalCode: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export const venueMinimalSchema = venueSchema.pick({
  id: true,
  name: true,
  slug: true,
  city: true,
  state: true,
  country: true,
});

export type Venue = z.infer<typeof venueSchema>;
export type VenueMinimal = z.infer<typeof venueMinimalSchema>;
