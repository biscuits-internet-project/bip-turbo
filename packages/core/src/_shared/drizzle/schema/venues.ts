import { doublePrecision, integer, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { shows } from "./shows";

export const venues = pgTable(
  "venues",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar().notNull(),
    city: varchar(),
    state: varchar(),
    country: varchar(),
    slug: varchar().notNull(),
    street: varchar(),
    postalCode: varchar("postal_code"),
    latitude: doublePrecision(),
    longitude: doublePrecision(),
    phone: varchar(),
    website: varchar(),
    legacyId: integer("legacy_id"),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    timesPlayed: integer("times_played").default(0).notNull(),
  },
  (table) => [uniqueIndex("index_venues_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops"))],
);

export const venuesRelations = relations(venues, ({ many }) => ({
  shows: many(shows),
}));
