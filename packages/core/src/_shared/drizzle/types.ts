import type { annotations, bands, likes, ratings, shows, songs, tracks, users, venues } from "./schema";

export type UserRow = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type ShowRow = typeof shows.$inferSelect;
export type NewShow = typeof shows.$inferInsert;

export type TrackRow = typeof tracks.$inferSelect & {
  annotations?: AnnotationRow[];
  song?: SongRow | null;
};
export type NewTrack = typeof tracks.$inferInsert;

export type LikeRow = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;

export type RatingRow = typeof ratings.$inferSelect;
export type NewRating = typeof ratings.$inferInsert;

export type BandRow = typeof bands.$inferSelect;
export type NewBand = typeof bands.$inferInsert;

export type VenueRow = typeof venues.$inferSelect;
export type NewVenue = typeof venues.$inferInsert;

export type SongRow = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;

export type AnnotationRow = typeof annotations.$inferSelect;
export type NewAnnotation = typeof annotations.$inferInsert;
