import { date, doublePrecision, integer, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { bands } from "./bands";
import { tracks } from "./tracks";
import { venues } from "./venues";

export const shows = pgTable(
  "shows",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    date: date().notNull(),
    bandId: uuid("band_id").notNull(),
    venueId: uuid("venue_id").notNull(),
    notes: text(),
    slug: varchar(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    likesCount: integer("likes_count").default(0).notNull(),
    relistenUrl: varchar("relisten_url"),
    averageRating: doublePrecision("average_rating").default(0),
    showPhotosCount: integer("show_photos_count").default(0).notNull(),
    showYoutubesCount: integer("show_youtubes_count").default(0).notNull(),
    reviewsCount: integer("reviews_count").default(0).notNull(),
  },
  (table) => [uniqueIndex("index_shows_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops"))],
);

export const showsRelations = relations(shows, ({ one, many }) => ({
  band: one(bands, {
    fields: [shows.bandId],
    references: [bands.id],
  }),
  venue: one(venues, {
    fields: [shows.venueId],
    references: [venues.id],
  }),
  tracks: many(tracks),
}));
