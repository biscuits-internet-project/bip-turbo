import { z } from "zod";

// One author of a song. `musicianSlug` is set when the author is linked to a
// musician, so the UI can link the name to that musician's page.
export const songAuthorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  musicianSlug: z.string().nullable().optional(),
});

export type SongAuthor = z.infer<typeof songAuthorSchema>;

export const songSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lyrics: z.string().nullable(),
  tabs: z.string().nullable(),
  notes: z.string().nullable(),
  // The song's origin/form in one axis. null = unclassified (treated as original
  // for debut text). A mashup is neither a pure original nor a single cover.
  kind: z.enum(["original", "cover", "mashup", "improvisation"]).nullable().optional(),
  history: z.string().nullable(),
  featuredLyric: z.string().nullable(),
  timesPlayed: z.number().default(0),
  // Count of plays within the currently-applied filter scope (time range, toggles, etc.).
  // Absent when no filter is active; the UI uses its presence to decide whether to render
  // the "Filtered Plays" column alongside the all-time Plays column.
  filteredTimesPlayed: z.number().optional(),
  // Filtered analogs of the rarity fields below — populated only when a narrowing
  // filter is active. Drive the Filtered Gap to End / Filtered Since Debut /
  // Filtered Avg Gap columns on /songs.
  filteredShowsSinceLastPlayed: z.number().nullable().optional(),
  filteredPercentSinceDebut: z.number().nullable().optional(),
  filteredAverageGapShows: z.number().nullable().optional(),
  dateFirstFilteredPlayed: z.date().nullable().optional(),
  dateLastFilteredPlayed: z.date().nullable().optional(),
  dateLastPlayed: z.date().nullable(),
  dateFirstPlayed: z.date().nullable(),
  actualLastPlayedDate: z.date().nullable(),
  showsSinceLastPlayed: z.number().nullable(),
  lastVenue: z
    .object({
      name: z.string(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    })
    .nullable(),
  firstVenue: z
    .object({
      name: z.string(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    })
    .nullable(),
  firstShowSlug: z.string().nullable(),
  lastShowSlug: z.string().nullable(),
  showsBeforeDebut: z.number().nullable(),
  showsSinceDebut: z.number().nullable(),
  totalShows: z.number(),
  percentOfAllShows: z.number().nullable(),
  percentSinceDebut: z.number().nullable(),
  averageGapShows: z.number().nullable(),
  medianGapShows: z.number().nullable(),
  longestGapShows: z.number().nullable(),
  yearlyPlayData: z.record(z.string(), z.unknown()).default({}),
  longestGapsData: z.record(z.string(), z.unknown()).default({}),
  mostCommonYear: z.number().nullable(),
  guitarTabsUrl: z.string().nullable(),

  // Relations
  // Ordered list of the song's authors, with each author's musician slug when linked.
  authors: z.array(songAuthorSchema).default([]),
  // Comma-joined author names, derived from `authors`. Convenience for footnote /
  // SEO / MCP text that just needs a single string.
  authorName: z.string().nullable().optional(),
});

export type SongKind = "original" | "cover" | "mashup" | "improvisation";

const SONG_KINDS: readonly SongKind[] = ["original", "cover", "mashup", "improvisation"];

/**
 * Narrow a raw kind string from the DB (a plain text column) to the known
 * union, mapping any unexpected value to null. Lets mappers feed the DB value
 * straight into the typed Song without an unchecked cast.
 */
export function narrowSongKind(value: string | null | undefined): SongKind | null {
  return SONG_KINDS.includes(value as SongKind) ? (value as SongKind) : null;
}

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
