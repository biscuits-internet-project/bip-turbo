import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { shows } from "./shows";
import { users } from "./users";

export const showPhotos = pgTable("show_photos", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  showId: uuid("show_id").notNull(),
  caption: text(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
});

export const showPhotosRelations = relations(showPhotos, ({ one }) => ({
  user: one(users, {
    fields: [showPhotos.userId],
    references: [users.id],
  }),
  show: one(shows, {
    fields: [showPhotos.showId],
    references: [shows.id],
  }),
}));
