import { pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { attendances } from "./attendances";
import { blogPosts } from "./blog-posts";
import { comments } from "./comments";
import { favorites } from "./favorites";
import { likes } from "./likes";
import { ratings } from "./ratings";
import { reviews } from "./reviews";
import { showPhotos } from "./show-photos";

export const users = pgTable(
  "users",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    firstName: varchar("first_name"),
    lastName: varchar("last_name"),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    email: varchar().notNull(),
    resetPasswordToken: varchar("reset_password_token"),
    resetPasswordSentAt: timestamp("reset_password_sent_at", { precision: 6, mode: "string" }),
    confirmationToken: varchar("confirmation_token"),
    confirmedAt: timestamp("confirmed_at", { precision: 6, mode: "string" }),
    confirmationSentAt: timestamp("confirmation_sent_at", { precision: 6, mode: "string" }),
    passwordDigest: varchar("password_digest").notNull(),
    username: varchar(),
  },
  (table) => [
    uniqueIndex("index_users_on_confirmation_token").using("btree", table.confirmationToken.asc().nullsLast().op("text_ops")),
    uniqueIndex("index_users_on_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
    uniqueIndex("index_users_on_reset_password_token").using("btree", table.resetPasswordToken.asc().nullsLast().op("text_ops")),
    uniqueIndex("index_users_on_username").using("btree", table.username.asc().nullsLast().op("text_ops")),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  attendances: many(attendances),
  comments: many(comments),
  blogPosts: many(blogPosts),
  favorites: many(favorites),
  ratings: many(ratings),
  showPhotos: many(showPhotos),
  reviews: many(reviews),
  likes: many(likes),
}));
