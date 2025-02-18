import { boolean, date, doublePrecision, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { authors } from "./authors";
import { tracks } from "./tracks";

export const songs = pgTable(
  "songs",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    title: varchar().notNull(),
    slug: varchar().notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    lyrics: text(),
    tabs: text(),
    notes: text(),
    legacyAbbr: varchar("legacy_abbr"),
    legacyId: integer("legacy_id"),
    cover: boolean().default(false),
    authorId: uuid("author_id"),
    legacyAuthor: text("legacy_author"),
    history: text(),
    featuredLyric: text("featured_lyric"),
    timesPlayed: integer("times_played").default(0).notNull(),
    dateLastPlayed: date("date_last_played"),
    yearlyPlayData: jsonb("yearly_play_data").default({}).notNull(),
    longestGapsData: jsonb("longest_gaps_data").default({}).notNull(),
    mostCommonYear: integer("most_common_year"),
    leastCommonYear: integer("least_common_year"),
    guitarTabsUrl: text("guitar_tabs_url"),
  },
  (table) => [uniqueIndex("index_songs_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops"))],
);

export const songsRelations = relations(songs, ({ one, many }) => ({
  author: one(authors, {
    fields: [songs.authorId],
    references: [authors.id],
  }),
  tracks: many(tracks),
}));
