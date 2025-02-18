import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { shows } from "./shows";
import { users } from "./users";

export const attendances = pgTable("attendances", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id").notNull(),
  showId: uuid("show_id").notNull(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
});

export const attendancesRelations = relations(attendances, ({ one }) => ({
  user: one(users, {
    fields: [attendances.userId],
    references: [users.id],
  }),
  show: one(shows, {
    fields: [attendances.showId],
    references: [shows.id],
  }),
}));
