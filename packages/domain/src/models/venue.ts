import { z } from "zod";

export const venueSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  slug: z.string(),
  street: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  postalCode: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  legacyId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  timesPlayed: z.number().default(0),
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
