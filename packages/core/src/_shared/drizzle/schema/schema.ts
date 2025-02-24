import { sql } from "drizzle-orm";
import {
  bigint,
  bigserial,
  boolean,
  date,
  doublePrecision,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const activeStorageAttachments = pgTable(
  "active_storage_attachments",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar().notNull(),
    recordType: varchar("record_type").notNull(),
    recordId: uuid("record_id").notNull(),
    blobId: uuid("blob_id").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    index("active_storage_attachments_blob_id_idx").using("btree", table.blobId.asc().nullsLast()),
    uniqueIndex("active_storage_attachments_record_name_blob_unique").using(
      "btree",
      table.recordType.asc().nullsLast(),
      table.recordId.asc().nullsLast(),
      table.name.asc().nullsLast(),
      table.blobId.asc().nullsLast(),
    ),
  ],
);

export const activeStorageBlobs = pgTable(
  "active_storage_blobs",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    key: varchar().notNull(),
    filename: varchar().notNull(),
    contentType: varchar("content_type"),
    metadata: text(),
    byteSize: bigint("byte_size", { mode: "number" }).notNull(),
    checksum: varchar().notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [uniqueIndex("active_storage_blobs_key_unique").using("btree", table.key.asc().nullsLast())],
);

export const attendances = pgTable(
  "attendances",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    showId: uuid("show_id").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    index("attendances_show_id_idx").using("btree", table.showId.asc().nullsLast()),
    index("attendances_user_id_idx").using("btree", table.userId.asc().nullsLast()),
    uniqueIndex("attendances_user_id_show_id_unique").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.showId.asc().nullsLast(),
    ),
    foreignKey({
      columns: [table.showId],
      foreignColumns: [shows.id],
      name: "fk_attendances_shows_show_id",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_attendances_users_user_id",
    }),
  ],
);

export const arInternalMetadata = pgTable("ar_internal_metadata", {
  key: varchar().primaryKey().notNull(),
  value: varchar(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
});

export const audits = pgTable(
  "audits",
  {
    id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
    auditableId: integer("auditable_id"),
    auditableType: varchar("auditable_type"),
    associatedId: integer("associated_id"),
    associatedType: varchar("associated_type"),
    userId: uuid("user_id"),
    userType: varchar("user_type"),
    username: varchar(),
    action: varchar(),
    auditedChanges: jsonb("audited_changes"),
    version: integer().default(0),
    comment: varchar(),
    remoteAddress: varchar("remote_address"),
    requestUuid: varchar("request_uuid"),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
  },
  (table) => [
    index("audits_associated_type_id_idx").using(
      "btree",
      table.associatedType.asc().nullsLast(),
      table.associatedId.asc().nullsLast(),
    ),
    index("audits_auditable_type_id_version_idx").using(
      "btree",
      table.auditableType.asc().nullsLast(),
      table.auditableId.asc().nullsLast(),
      table.version.asc().nullsLast(),
    ),
    index("audits_created_at_idx").using("btree", table.createdAt.asc().nullsLast()),
    index("audits_request_uuid_idx").using("btree", table.requestUuid.asc().nullsLast()),
    index("audits_user_id_type_idx").using("btree", table.userId.asc().nullsLast(), table.userType.asc().nullsLast()),
  ],
);

export const authors = pgTable(
  "authors",
  {
    name: varchar(),
    slug: varchar().notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    id: uuid().defaultRandom().primaryKey().notNull(),
  },
  (table) => [index("authors_slug_idx").using("btree", table.slug.asc().nullsLast())],
);

export const comments = pgTable(
  "comments",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    commentableId: uuid("commentable_id").notNull(),
    commentableType: varchar("commentable_type").notNull(),
    content: text().notNull(),
    status: varchar().default("published").notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    index("comments_commentable_type_id_idx").using(
      "btree",
      table.commentableType.asc().nullsLast(),
      table.commentableId.asc().nullsLast(),
    ),
    index("comments_user_id_idx").using("btree", table.userId.asc().nullsLast()),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_comments_users_user_id",
    }),
  ],
);

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
  (table) => [uniqueIndex("bands_slug_unique").using("btree", table.slug.asc().nullsLast())],
);

export const annotations = pgTable(
  "annotations",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    trackId: uuid("track_id").notNull(),
    desc: text(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.trackId],
      foreignColumns: [tracks.id],
      name: "fk_annotations_tracks_track_id",
    }),
  ],
);

export const blogPosts = pgTable(
  "blog_posts",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    title: text().notNull(),
    blurb: text(),
    slug: text().notNull(),
    content: text(),
    state: varchar().default("draft").notNull(),
    publishedAt: timestamp("published_at", { precision: 6, mode: "string" }),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    postType: varchar("post_type").default("blog").notNull(),
  },
  (table) => [
    index("blog_posts_published_at_idx").using("btree", table.publishedAt.asc().nullsLast()),
    index("blog_posts_state_idx").using("btree", table.state.asc().nullsLast()),
    index("blog_posts_title_idx").using("btree", table.title.asc().nullsLast()),
    index("blog_posts_user_id_idx").using("btree", table.userId.asc().nullsLast()),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_blog_posts_users_user_id",
    }),
  ],
);

export const faq = pgTable("faq", {
  id: integer().primaryKey().notNull(),
  question: text(),
  answer: text(),
  section: integer(),
});

export const friendlyIdSlugs = pgTable(
  "friendly_id_slugs",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    slug: varchar().notNull(),
    sluggableType: varchar("sluggable_type").notNull(),
    sluggableId: uuid("sluggable_id").notNull(),
    scope: varchar(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
  },
  (table) => [
    index("friendly_id_slugs_slug_type_idx").using(
      "btree",
      table.slug.asc().nullsLast(),
      table.sluggableType.asc().nullsLast(),
    ),
    uniqueIndex("friendly_id_slugs_slug_type_scope_unique").using(
      "btree",
      table.slug.asc().nullsLast(),
      table.sluggableType.asc().nullsLast(),
      table.scope.asc().nullsLast(),
    ),
    index("friendly_id_slugs_type_id_idx").using(
      "btree",
      table.sluggableType.asc().nullsLast(),
      table.sluggableId.asc().nullsLast(),
    ),
  ],
);

export const mediaContents = pgTable("media_contents", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  year: integer(),
  url: varchar(),
  mediaType: varchar("media_type").notNull(),
  description: text(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  date: date(),
});

export const favorites = pgTable(
  "favorites",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").notNull(),
    showId: uuid("show_id").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    index("favorites_show_id_idx").using("btree", table.showId.asc().nullsLast()),
    index("favorites_user_id_idx").using("btree", table.userId.asc().nullsLast()),
    foreignKey({
      columns: [table.showId],
      foreignColumns: [shows.id],
      name: "fk_favorites_shows_show_id",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_favorites_users_user_id",
    }),
  ],
);

export const pgSearchDocuments = pgTable(
  "pg_search_documents",
  {
    id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
    content: text(),
    searchableType: varchar("searchable_type"),
    searchableId: uuid("searchable_id"),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    index("pg_search_documents_type_id_idx").using(
      "btree",
      table.searchableType.asc().nullsLast(),
      table.searchableId.asc().nullsLast(),
    ),
  ],
);

export const ratings = pgTable(
  "ratings",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    value: doublePrecision().default(0).notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    rateableType: varchar("rateable_type"),
    rateableId: uuid("rateable_id"),
  },
  (table) => [
    index("ratings_rateable_type_id_idx").using(
      "btree",
      table.rateableType.asc().nullsLast(),
      table.rateableId.asc().nullsLast(),
    ),
    index("ratings_user_id_idx").using("btree", table.userId.asc().nullsLast()),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_ratings_users_user_id",
    }),
  ],
);

export const showPhotos = pgTable(
  "show_photos",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    label: varchar(),
    source: varchar(),
    userId: uuid("user_id").notNull(),
    showId: uuid("show_id").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    index("show_photos_show_id_idx").using("btree", table.showId.asc().nullsLast()),
    index("show_photos_user_id_idx").using("btree", table.userId.asc().nullsLast()),
    foreignKey({
      columns: [table.showId],
      foreignColumns: [shows.id],
      name: "fk_show_photos_shows_show_id",
    }),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_show_photos_users_user_id",
    }),
  ],
);

export const roles = pgTable(
  "roles",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar(),
    resourceId: uuid("resource_id"),
    resourceType: varchar("resource_type"),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    index("roles_name_idx").using("btree", table.name.asc().nullsLast()),
    index("roles_name_resource_type_id_idx").using(
      "btree",
      table.name.asc().nullsLast(),
      table.resourceType.asc().nullsLast(),
      table.resourceId.asc().nullsLast(),
    ),
  ],
);

export const showYoutubes = pgTable(
  "show_youtubes",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    showId: uuid("show_id").notNull(),
    videoId: varchar("video_id").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    index("show_youtubes_show_id_idx").using("btree", table.showId.asc().nullsLast()),
    foreignKey({
      columns: [table.showId],
      foreignColumns: [shows.id],
      name: "fk_show_youtubes_shows_show_id",
    }),
  ],
);

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
  (table) => [
    index("songs_longest_gaps_data_idx").using("gin", table.longestGapsData.asc().nullsLast()),
    uniqueIndex("songs_slug_unique").using("btree", table.slug.asc().nullsLast()),
    index("songs_yearly_play_data_idx").using("gin", table.yearlyPlayData.asc().nullsLast()),
    foreignKey({
      columns: [table.authorId],
      foreignColumns: [authors.id],
      name: "fk_songs_authors_author_id",
    }),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    content: text().notNull(),
    status: varchar().default("draft").notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    likesCount: integer("likes_count").default(0).notNull(),
    showId: uuid("show_id"),
  },
  (table) => [
    index("reviews_likes_count_idx").using("btree", table.likesCount.asc().nullsLast()),
    index("reviews_show_id_idx").using("btree", table.showId.asc().nullsLast()),
    index("reviews_user_id_idx").using("btree", table.userId.asc().nullsLast()),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_reviews_users_user_id",
    }),
  ],
);

export const sideProjects = pgTable("side_projects", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: varchar(),
  dates: varchar(),
  notes: text(),
  mem1: varchar(),
  mem2: varchar(),
  mem3: varchar(),
  mem4: varchar(),
  mem5: varchar(),
  mem6: varchar(),
  mem7: varchar(),
  createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
  updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }),
});

export const taggings = pgTable(
  "taggings",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    tagId: uuid("tag_id"),
    taggableType: varchar("taggable_type"),
    taggableId: uuid("taggable_id"),
    taggerType: varchar("tagger_type"),
    taggerId: uuid("tagger_id"),
    context: varchar(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }),
  },
  (table) => [
    index("taggings_context_idx").using("btree", table.context.asc().nullsLast()),
    index("taggings_tag_id_idx").using("btree", table.tagId.asc().nullsLast()),
    index("taggings_taggable_id_idx").using("btree", table.taggableId.asc().nullsLast()),
    index("taggings_taggable_type_idx").using("btree", table.taggableType.asc().nullsLast()),
    index("taggings_taggable_type_id_idx").using(
      "btree",
      table.taggableType.asc().nullsLast(),
      table.taggableId.asc().nullsLast(),
    ),
    index("taggings_tagger_id_idx").using("btree", table.taggerId.asc().nullsLast()),
    index("taggings_tagger_id_type_idx").using(
      "btree",
      table.taggerId.asc().nullsLast(),
      table.taggerType.asc().nullsLast(),
    ),
    index("taggings_tagger_type_id_idx").using(
      "btree",
      table.taggerType.asc().nullsLast(),
      table.taggerId.asc().nullsLast(),
    ),
    uniqueIndex("taggings_tag_taggable_context_unique").using(
      "btree",
      table.tagId.asc().nullsLast(),
      table.taggableId.asc().nullsLast(),
      table.taggableType.asc().nullsLast(),
      table.context.asc().nullsLast(),
      table.taggerId.asc().nullsLast(),
      table.taggerType.asc().nullsLast(),
    ),
    index("taggings_taggable_tagger_context_idx").using(
      "btree",
      table.taggableId.asc().nullsLast(),
      table.taggableType.asc().nullsLast(),
      table.taggerId.asc().nullsLast(),
      table.context.asc().nullsLast(),
    ),
    index("taggings_taggable_context_idx").using(
      "btree",
      table.taggableId.asc().nullsLast(),
      table.taggableType.asc().nullsLast(),
      table.context.asc().nullsLast(),
    ),
    foreignKey({
      columns: [table.tagId],
      foreignColumns: [tags.id],
      name: "fk_taggings_tags_tag_id",
    }),
  ],
);

export const shows = pgTable(
  "shows",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    slug: varchar(),
    date: date().notNull(),
    venueId: uuid("venue_id"),
    bandId: uuid("band_id"),
    notes: text(),
    legacyId: integer("legacy_id"),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    likesCount: integer("likes_count").default(0).notNull(),
    relistenUrl: varchar("relisten_url"),
    averageRating: doublePrecision("average_rating").default(0),
    showPhotosCount: integer("show_photos_count").default(0).notNull(),
    showYoutubesCount: integer("show_youtubes_count").default(0).notNull(),
    reviewsCount: integer("reviews_count").default(0).notNull(),
  },
  (table) => [
    index("shows_likes_count_idx").using("btree", table.likesCount.asc().nullsLast()),
    uniqueIndex("shows_slug_unique").using("btree", table.slug.asc().nullsLast()),
    foreignKey({
      columns: [table.bandId],
      foreignColumns: [bands.id],
      name: "fk_shows_bands_band_id",
    }),
    foreignKey({
      columns: [table.venueId],
      foreignColumns: [venues.id],
      name: "fk_shows_venues_venue_id",
    }),
  ],
);

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
    uniqueIndex("users_confirmation_token_unique").using("btree", table.confirmationToken.asc().nullsLast()),
    uniqueIndex("users_email_unique").using("btree", table.email.asc().nullsLast()),
    uniqueIndex("users_reset_password_token_unique").using("btree", table.resetPasswordToken.asc().nullsLast()),
    uniqueIndex("users_username_unique").using("btree", table.username.asc().nullsLast()),
  ],
);

export const venues = pgTable(
  "venues",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar(),
    slug: varchar().notNull(),
    street: varchar(),
    city: varchar(),
    state: varchar(),
    country: varchar(),
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
  (table) => [index("venues_slug_idx").using("btree", table.slug.asc().nullsLast())],
);

export const usersRoles = pgTable(
  "users_roles",
  {
    userId: uuid("user_id"),
    roleId: uuid("role_id"),
  },
  (table) => [
    index("users_roles_user_id_role_id_idx").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.roleId.asc().nullsLast(),
    ),
  ],
);

export const tags = pgTable(
  "tags",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: varchar(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    taggingsCount: integer("taggings_count").default(0),
  },
  (table) => [uniqueIndex("tags_name_unique").using("btree", table.name.asc().nullsLast())],
);

export const youtubes = pgTable("youtubes", {
  date: date(),
  url: text(),
});

export const tracks = pgTable(
  "tracks",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    showId: uuid("show_id").notNull(),
    songId: uuid("song_id").notNull(),
    set: varchar().notNull(),
    position: integer().notNull(),
    segue: varchar(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
    likesCount: integer("likes_count").default(0).notNull(),
    slug: varchar(),
    note: varchar(),
    allTimer: boolean("all_timer").default(false),
    previousTrackId: uuid("previous_track_id"),
    nextTrackId: uuid("next_track_id"),
    averageRating: doublePrecision("average_rating").default(0),
  },
  (table) => [
    index("tracks_likes_count_idx").using("btree", table.likesCount.asc().nullsLast()),
    index("tracks_next_track_id_idx").using("btree", table.nextTrackId.asc().nullsLast()),
    index("tracks_previous_track_id_idx").using("btree", table.previousTrackId.asc().nullsLast()),
    uniqueIndex("tracks_slug_unique").using("btree", table.slug.asc().nullsLast()),
    foreignKey({
      columns: [table.showId],
      foreignColumns: [shows.id],
      name: "fk_tracks_shows_show_id",
    }),
    foreignKey({
      columns: [table.songId],
      foreignColumns: [songs.id],
      name: "fk_tracks_songs_song_id",
    }),
  ],
);

export const likes = pgTable(
  "likes",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    likeableId: uuid("likeable_id").notNull(),
    likeableType: varchar("likeable_type").notNull(),
    userId: uuid("user_id").notNull(),
    createdAt: timestamp("created_at", { precision: 6, mode: "string" }).notNull(),
    updatedAt: timestamp("updated_at", { precision: 6, mode: "string" }).notNull(),
  },
  (table) => [
    index("likes_likeable_type_id_idx").using(
      "btree",
      table.likeableType.asc().nullsLast(),
      table.likeableId.asc().nullsLast(),
    ),
    index("likes_user_id_idx").using("btree", table.userId.asc().nullsLast()),
    uniqueIndex("likes_user_id_likeable_type_id_unique").using(
      "btree",
      table.userId.asc().nullsLast(),
      table.likeableType.asc().nullsLast(),
      table.likeableId.asc().nullsLast(),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_likes_users_user_id",
    }),
  ],
);

export const drizzleMigrations = pgTable("__drizzle_migrations", {
  id: serial().primaryKey().notNull(),
  hash: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
});
