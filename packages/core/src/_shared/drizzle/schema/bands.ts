import { integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { shows } from "./shows";

export const bands = pgTable(
  "bands",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar(),
    slug: varchar().notNull(),
    legacyId: integer("legacy_id"),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [uniqueIndex("index_bands_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops"))],
);

export const bandsRelations = relations(bands, ({ many }) => ({
  shows: many(shows),
}));
