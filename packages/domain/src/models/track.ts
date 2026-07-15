import { z } from "zod";
import { annotationSchema } from "./annotation";
import { songSchema } from "./song";

const previousPerformanceShowSchema = z
  .object({
    date: z.string(),
    slug: z.string(),
  })
  .nullable();

export const trackFlagSchema = z.enum([
  "DYSLEXIC",
  "INVERTED",
  "UNFINISHED",
  "ENDING_ONLY",
  "MIDDLE_ONLY",
  "BEGINNING_ONLY",
]);

export type TrackFlag = z.infer<typeof trackFlagSchema>;

/**
 * The three segue-shape recurrence series a track can belong to, derived from
 * `Track.segue` and the prior track's segue:
 *   * STANDALONE      — neither segued into nor out of.
 *   * NOT_SEGUED_IN   — not segued into (the prior track did not segue out).
 *   * NOT_SEGUED_OUT  — does not segue out (own segue is empty).
 */
export const segueRecurrenceKindSchema = z.enum(["STANDALONE", "NOT_SEGUED_IN", "NOT_SEGUED_OUT"]);

export type SegueRecurrenceKind = z.infer<typeof segueRecurrenceKindSchema>;

// The prior performance in a recurrence series, or null on a first-ever one.
const recurrenceLastPlayedSchema = z.object({ date: z.string(), slug: z.string() }).nullable();

/** A flag's recurrence since the song last carried this flag (null gaps ⇒ first
 *  time): `versionGap` = the song's own performances between, `gap` = shows
 *  between. Both displayed. Pre-gated by the mapper to displayable entries only. */
export const flagRecurrenceSchema = z.object({
  flag: trackFlagSchema,
  versionGap: z.number().nullable(),
  gap: z.number().nullable(),
  lastPlayed: recurrenceLastPlayedSchema,
});

export type FlagRecurrence = z.infer<typeof flagRecurrenceSchema>;

/** A segue-shape recurrence (standalone / not-segued-in / not-segued-out) since
 *  the prior same-shape version: `versionGap` = the song's own performances
 *  between, `gap` = shows between. Both displayed. */
export const segueRecurrenceSchema = z.object({
  kind: segueRecurrenceKindSchema,
  versionGap: z.number().nullable(),
  gap: z.number().nullable(),
  lastPlayed: recurrenceLastPlayedSchema,
});

export type SegueRecurrence = z.infer<typeof segueRecurrenceSchema>;

// The shows on the other end of cross-show completions, carried for the
// "completes <date(s)>" / "completed by <date(s)>" footnotes. An array because
// one ending can finish several earlier versions. `otherSongTitle` is set only
// when the linked version is a differently-named song ("… version of <name>").
const completionShowsSchema = z
  .array(
    z.object({
      date: z.string(),
      slug: z.string(),
      otherSongTitle: z.string().optional(),
      // The completed track's set + position, carried so the prod→local sync
      // can match it by natural key (show slug, set, position). Footnote
      // rendering ignores these; only `completes` populates them.
      set: z.string().optional(),
      position: z.number().optional(),
    }),
  )
  .default([]);

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
  // Live rating values, populated only by fresh single-track reads
  // (track-service → /api/tracks/:id). The structural setlist payloads
  // deliberately omit them so a rating write never staleness-busts the
  // (long-lived) setlist cache; setlist views read averages live via the
  // track tier-2 path instead. See cache-keys "tier split".
  averageRating: z.number().nullable().optional(),
  ratingsCount: z.number().optional(),
  gap: z.number().nullable(),
  previousPerformanceShowId: z.string().uuid().nullable(),
  duration: z.number().nullable(),
  durationSource: z.string().nullable(),
  previousPerformanceShow: previousPerformanceShowSchema,
  flags: z.array(trackFlagSchema).default([]),
  flagRecurrences: z.array(flagRecurrenceSchema).default([]),
  segueRecurrences: z.array(segueRecurrenceSchema).default([]),
  completes: completionShowsSchema,
  completedBy: completionShowsSchema,
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
  // Carried for the auto debut footnote: kind decides the text, authorName
  // names the origin for covers/mashups.
  kind: z.enum(["original", "cover", "mashup", "improvisation"]).nullable().optional(),
  authorName: z.string().nullable().optional(),
  // Carried for the show page's debut-year chart, which derives each song's
  // debut year from its first-played date.
  dateFirstPlayed: z.date().nullable().optional(),
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
  gap: z.number().nullable(),
  previousPerformanceShowId: z.string().uuid().nullable(),
  duration: z.number().nullable(),
  durationSource: z.string().nullable(),
  previousPerformanceShow: previousPerformanceShowSchema,
  flags: z.array(trackFlagSchema).default([]),
  flagRecurrences: z.array(flagRecurrenceSchema).default([]),
  segueRecurrences: z.array(segueRecurrenceSchema).default([]),
  completes: completionShowsSchema,
  completedBy: completionShowsSchema,
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
    duration: true,
  })
  .extend({
    annotationDesc: z.string().nullable().optional(),
  })
  .partial();

export type TrackUpdate = z.infer<typeof trackUpdateSchema>;
