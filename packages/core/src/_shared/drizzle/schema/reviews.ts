import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { users } from "./users";

export const reviews = pgTable("reviews", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  reviewableType: text("reviewable_type").notNull(),
  reviewableId: uuid("reviewable_id").notNull(),
  content: text().notNull(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));
