import { pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { users } from "./users";

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    title: varchar().notNull(),
    content: text().notNull(),
    slug: varchar().notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [uniqueIndex("index_blog_posts_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops"))],
);

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  user: one(users, {
    fields: [blogPosts.userId],
    references: [users.id],
  }),
}));
