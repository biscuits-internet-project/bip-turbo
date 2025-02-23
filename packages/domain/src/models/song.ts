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
  legacyAbbr: z.string().nullable(),
  legacyId: z.number().nullable(),
  cover: z.boolean().nullable().default(false),
  authorId: z.string().uuid().nullable(),
  legacyAuthor: z.string().nullable(),
  history: z.string().nullable(),
  featuredLyric: z.string().nullable(),
  timesPlayed: z.number().default(0),
  dateLastPlayed: z.date().nullable(),
  yearlyPlayData: z.record(z.unknown()).default({}),
  longestGapsData: z.record(z.unknown()).default({}),
  mostCommonYear: z.number().nullable(),
  leastCommonYear: z.number().nullable(),
  guitarTabsUrl: z.string().nullable(),
});

export const songMinimalSchema = songSchema.pick({
  id: true,
  title: true,
  slug: true,
});

export type Song = z.infer<typeof songSchema>;
export type SongMinimal = z.infer<typeof songMinimalSchema>;
