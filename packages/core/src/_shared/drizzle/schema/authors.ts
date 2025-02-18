import { pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { songs } from "./songs";

export const authors = pgTable(
  "authors",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar(),
    slug: varchar().notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [uniqueIndex("index_authors_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops"))],
);

export const authorsRelations = relations(authors, ({ many }) => ({
  songs: many(songs),
}));
