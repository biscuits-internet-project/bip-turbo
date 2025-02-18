import { boolean, doublePrecision, integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { annotations } from "./annotations";
import { shows } from "./shows";
import { songs } from "./songs";

export const tracks = pgTable(
  "tracks",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    showId: uuid("show_id").notNull(),
    songId: uuid("song_id"),
    set: varchar().notNull(),
    position: integer().notNull(),
    segue: varchar(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    likesCount: integer("likes_count").default(0).notNull(),
    slug: varchar(),
    note: varchar(),
    allTimer: boolean("all_timer").default(false),
    previousTrackId: uuid("previous_track_id"),
    nextTrackId: uuid("next_track_id"),
    averageRating: doublePrecision("average_rating").default(0),
  },
  (table) => [uniqueIndex("index_tracks_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops"))],
);

export const tracksRelations = relations(tracks, ({ one, many }) => ({
  show: one(shows, {
    fields: [tracks.showId],
    references: [shows.id],
  }),
  song: one(songs, {
    fields: [tracks.songId],
    references: [songs.id],
  }),
  previousTrack: one(tracks, {
    fields: [tracks.previousTrackId],
    references: [tracks.id],
  }),
  nextTrack: one(tracks, {
    fields: [tracks.nextTrackId],
    references: [tracks.id],
  }),
  annotations: many(annotations),
}));
