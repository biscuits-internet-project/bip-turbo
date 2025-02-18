import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { shows } from "./shows";

export const showYoutubes = pgTable("show_youtubes", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  showId: uuid("show_id").notNull(),
  url: varchar().notNull(),
  description: text(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
});

export const showYoutubesRelations = relations(showYoutubes, ({ one }) => ({
  show: one(shows, {
    fields: [showYoutubes.showId],
    references: [shows.id],
  }),
}));
