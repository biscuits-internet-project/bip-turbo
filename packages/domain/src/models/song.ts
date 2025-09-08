import { z } from "zod";

export const songSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lyrics: z.string().nullable(),
  tabs: z.string().nullable(),
  notes: z.string().nullable(),
  cover: z.boolean().nullable().default(false),
  authorId: z.string().uuid().nullable(),
  history: z.string().nullable(),
  featuredLyric: z.string().nullable(),
  timesPlayed: z.number().default(0),
  dateLastPlayed: z.date().nullable(),
  dateFirstPlayed: z.date().nullable(),
  actualLastPlayedDate: z.date().nullable(),
  showsSinceLastPlayed: z.number().nullable(),
  lastVenue: z
    .object({
      name: z.string(),
      city: z.string().optional(),
      state: z.string().optional(),
    })
    .nullable(),
  firstVenue: z
    .object({
      name: z.string(),
      city: z.string().optional(),
      state: z.string().optional(),
    })
    .nullable(),
  firstShowSlug: z.string().nullable(),
  lastShowSlug: z.string().nullable(),
  yearlyPlayData: z.record(z.string(), z.unknown()).default({}),
  longestGapsData: z.record(z.string(), z.unknown()).default({}),
  mostCommonYear: z.number().nullable(),
  leastCommonYear: z.number().nullable(),
  guitarTabsUrl: z.string().nullable(),

  // Relations
  authorName: z.string().nullable().optional(),
});

export const songMinimalSchema = songSchema.pick({
  id: true,
  title: true,
  slug: true,
});

export type Song = z.infer<typeof songSchema>;
export type SongMinimal = z.infer<typeof songMinimalSchema>;
export interface TrendingSong extends Song {
  count: number;
}
