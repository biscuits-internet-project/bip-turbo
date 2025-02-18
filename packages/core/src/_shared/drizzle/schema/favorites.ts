import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { shows } from "./shows";
import { users } from "./users";

export const favorites = pgTable("favorites", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  favorableType: text("favorable_type").notNull(),
  favorableId: uuid("favorable_id").notNull(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
});

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  show: one(shows, {
    fields: [favorites.favorableId],
    references: [shows.id],
  }),
}));
