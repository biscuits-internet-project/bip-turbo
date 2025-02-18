import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { users } from "./users";

export const likes = pgTable("likes", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  likeableType: text("likeable_type").notNull(),
  likeableId: uuid("likeable_id").notNull(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
});

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
}));
