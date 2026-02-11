import { z } from 'zod';

// Database row from search queries
export const SearchRowResultSchema = z.object({
  entity_id: z.string(),
  entity_type: z.enum(["show", "track"]),
  entity_slug: z.string(),
  score: z.number(),
  show_slug: z.string(),
  date_str: z.string(),
  venue_name: z.string().nullable(),
  venue_location: z.string().nullable(),
  song_title: z.string().optional(),
  track_annotation: z.string().optional(),
  set_info: z.string().optional(),
  track_position: z.number().nullable(),
  prev_song_title: z.string().optional(),
  next_song_title: z.string().optional(),
  track_segue: z.string().optional(),
});

export type SearchRowResult = z.infer<typeof SearchRowResultSchema>;

// Track match details schema
export const TrackMatchSchema = z.object({
  song: z.string(),
  position: z.number(),
  set: z.string(),
  note: z.string().nullable(),
  prevSong: z.string().nullable(),
  nextSong: z.string().nullable(),
  prevSegue: z.string().nullable(),
  nextSegue: z.string().nullable(),
  isExactMatch: z.boolean(),
  isOpener: z.boolean(),
  isCloser: z.boolean(),
});

export const TrackMatchDetailsSchema = z.object({
  type: z.literal('trackMatches'),
  tracks: z.array(TrackMatchSchema),
});

// Segue match details schema
export const SegueMatchDetailsSchema = z.object({
  type: z.literal('segue'),
  song1: z.string(),
  song2: z.string(),
  segueSymbol: z.string(),
  set: z.string(),
  positions: z.array(z.number()),
  note1: z.string().nullable(),
  note2: z.string().nullable(),
  exactMatches: z.array(z.boolean()),
});

// SegueRun match details schema
export const SegueRunMatchDetailsSchema = z.object({
  type: z.literal('segueMatch'),
  segueRun: z.object({
    set: z.string(),
    sequence: z.string(),
    length: z.number(),
  }),
});

// Union of all match detail types
export const MatchDetailsSchema = z.discriminatedUnion('type', [
  TrackMatchDetailsSchema,
  SegueMatchDetailsSchema,
  SegueRunMatchDetailsSchema,
]);

// Type exports
export type TrackMatch = z.infer<typeof TrackMatchSchema>;
export type TrackMatchDetails = z.infer<typeof TrackMatchDetailsSchema>;
export type SegueMatchDetails = z.infer<typeof SegueMatchDetailsSchema>;
export type SegueRunMatchDetails = z.infer<typeof SegueRunMatchDetailsSchema>;
export type MatchDetails = z.infer<typeof MatchDetailsSchema>;

// Search result schema
export const SearchResultSchema = z.object({
  id: z.string(),
  entityType: z.enum(['show', 'track', 'song', 'venue']),
  entityId: z.string(),
  entitySlug: z.string(),
  displayText: z.string(),
  score: z.number(),
  url: z.string(),
  metadata: z.object({
    matchDetails: z.string().optional(), // JSON string that can be parsed to MatchDetails
  }).optional(),
  // Additional fields for rich display
  date: z.string().optional(),
  venueName: z.string().optional(),
  venueLocation: z.string().optional(),
  songTitle: z.string().optional(),
  setInfo: z.string().optional(),
  trackPosition: z.string().optional(),
  prevSong: z.string().optional(),
  nextSong: z.string().optional(),
  segueType: z.string().optional(),
  annotation: z.string().optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;