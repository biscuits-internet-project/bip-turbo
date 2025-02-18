import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { tracks } from "./tracks";

export const annotations = pgTable("annotations", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  trackId: uuid("track_id").notNull(),
  desc: text().notNull(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
});

export const annotationsRelations = relations(annotations, ({ one }) => ({
  track: one(tracks, {
    fields: [annotations.trackId],
    references: [tracks.id],
  }),
}));
