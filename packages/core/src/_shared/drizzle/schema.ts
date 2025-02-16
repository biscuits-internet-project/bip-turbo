import { pgTable, index, uniqueIndex, uuid, varchar, timestamp, text, bigint, foreignKey, bigserial, integer, jsonb, date, doublePrecision, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const activeStorageAttachments = pgTable("active_storage_attachments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar().notNull(),
	recordType: varchar("record_type").notNull(),
	recordId: uuid("record_id").notNull(),
	blobId: uuid("blob_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("index_active_storage_attachments_on_blob_id").using("btree", table.blobId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("index_active_storage_attachments_uniqueness").using("btree", table.recordType.asc().nullsLast().op("uuid_ops"), table.recordId.asc().nullsLast().op("uuid_ops"), table.name.asc().nullsLast().op("text_ops"), table.blobId.asc().nullsLast().op("uuid_ops")),
]);

export const activeStorageBlobs = pgTable("active_storage_blobs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	key: varchar().notNull(),
	filename: varchar().notNull(),
	contentType: varchar("content_type"),
	metadata: text(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	byteSize: bigint("byte_size", { mode: "number" }).notNull(),
	checksum: varchar().notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("index_active_storage_blobs_on_key").using("btree", table.key.asc().nullsLast().op("text_ops")),
]);

export const attendances = pgTable("attendances", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	showId: uuid("show_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("index_attendances_on_show_id").using("btree", table.showId.asc().nullsLast().op("uuid_ops")),
	index("index_attendances_on_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("index_attendances_on_user_id_and_show_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.showId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.showId],
			foreignColumns: [shows.id],
			name: "fk_rails_2aac17a78c"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_rails_77ad02f5c5"
		}),
]);

export const arInternalMetadata = pgTable("ar_internal_metadata", {
	key: varchar().primaryKey().notNull(),
	value: varchar(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
});

export const audits = pgTable("audits", {
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
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }),
}, (table) => [
	index("associated_index").using("btree", table.associatedType.asc().nullsLast().op("int4_ops"), table.associatedId.asc().nullsLast().op("int4_ops")),
	index("auditable_index").using("btree", table.auditableType.asc().nullsLast().op("text_ops"), table.auditableId.asc().nullsLast().op("text_ops"), table.version.asc().nullsLast().op("int4_ops")),
	index("index_audits_on_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("index_audits_on_request_uuid").using("btree", table.requestUuid.asc().nullsLast().op("text_ops")),
	index("user_index").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.userType.asc().nullsLast().op("text_ops")),
]);

export const authors = pgTable("authors", {
	name: varchar(),
	slug: varchar().notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
}, (table) => [
	index("index_authors_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const comments = pgTable("comments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	commentableId: uuid("commentable_id").notNull(),
	commentableType: varchar("commentable_type").notNull(),
	content: text().notNull(),
	status: varchar().default('published').notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("index_comments_on_commentable_type_and_commentable_id").using("btree", table.commentableType.asc().nullsLast().op("text_ops"), table.commentableId.asc().nullsLast().op("text_ops")),
	index("index_comments_on_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_rails_03de2dc08c"
		}),
]);

export const bands = pgTable("bands", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar(),
	slug: varchar().notNull(),
	legacyId: integer("legacy_id"),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	uniqueIndex("index_bands_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const annotations = pgTable("annotations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	trackId: uuid("track_id").notNull(),
	desc: text(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.trackId],
			foreignColumns: [tracks.id],
			name: "fk_rails_31a9a82e68"
		}),
]);

export const blogPosts = pgTable("blog_posts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	blurb: text(),
	slug: text().notNull(),
	content: text(),
	state: varchar().default('draft').notNull(),
	publishedAt: timestamp("published_at", { precision: 6, mode: 'string' }),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
	postType: varchar("post_type").default('blog').notNull(),
}, (table) => [
	index("blog_posts_published_at_idx").using("btree", table.publishedAt.asc().nullsLast().op("timestamp_ops")),
	index("blog_posts_state_idx").using("btree", table.state.asc().nullsLast().op("text_ops")),
	index("blog_posts_title_idx").using("btree", table.title.asc().nullsLast().op("text_ops")),
	index("index_blog_posts_on_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_rails_829fc99162"
		}),
]);

export const faq = pgTable("faq", {
	id: integer().primaryKey().notNull(),
	question: text(),
	answer: text(),
	section: integer(),
});

export const friendlyIdSlugs = pgTable("friendly_id_slugs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: varchar().notNull(),
	sluggableType: varchar("sluggable_type").notNull(),
	sluggableId: uuid("sluggable_id").notNull(),
	scope: varchar(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }),
}, (table) => [
	index("index_friendly_id_slugs_on_slug_and_sluggable_type").using("btree", table.slug.asc().nullsLast().op("text_ops"), table.sluggableType.asc().nullsLast().op("text_ops")),
	uniqueIndex("index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope").using("btree", table.slug.asc().nullsLast().op("text_ops"), table.sluggableType.asc().nullsLast().op("text_ops"), table.scope.asc().nullsLast().op("text_ops")),
	index("index_friendly_id_slugs_on_sluggable_type_and_sluggable_id").using("btree", table.sluggableType.asc().nullsLast().op("uuid_ops"), table.sluggableId.asc().nullsLast().op("uuid_ops")),
]);

export const mediaContents = pgTable("media_contents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	year: integer(),
	url: varchar(),
	mediaType: varchar("media_type").notNull(),
	description: text(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	date: date(),
});

export const favorites = pgTable("favorites", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	showId: uuid("show_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("index_favorites_on_show_id").using("btree", table.showId.asc().nullsLast().op("uuid_ops")),
	index("index_favorites_on_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.showId],
			foreignColumns: [shows.id],
			name: "fk_rails_664ddb4807"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_rails_d15744e438"
		}),
]);

export const pgSearchDocuments = pgTable("pg_search_documents", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	content: text(),
	searchableType: varchar("searchable_type"),
	searchableId: uuid("searchable_id"),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("index_pg_search_documents_on_searchable_type_and_searchable_id").using("btree", table.searchableType.asc().nullsLast().op("text_ops"), table.searchableId.asc().nullsLast().op("text_ops")),
]);

export const ratings = pgTable("ratings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	value: doublePrecision().default(0).notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
	rateableType: varchar("rateable_type"),
	rateableId: uuid("rateable_id"),
}, (table) => [
	index("index_ratings_on_rateable_type_and_rateable_id").using("btree", table.rateableType.asc().nullsLast().op("text_ops"), table.rateableId.asc().nullsLast().op("text_ops")),
	index("index_ratings_on_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_rails_a7dfeb9f5f"
		}),
]);

export const showPhotos = pgTable("show_photos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	label: varchar(),
	source: varchar(),
	userId: uuid("user_id").notNull(),
	showId: uuid("show_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("index_show_photos_on_show_id").using("btree", table.showId.asc().nullsLast().op("uuid_ops")),
	index("index_show_photos_on_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.showId],
			foreignColumns: [shows.id],
			name: "fk_rails_191cbe34d9"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_rails_5aafeab212"
		}),
]);

export const roles = pgTable("roles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar(),
	resourceId: uuid("resource_id"),
	resourceType: varchar("resource_type"),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("index_roles_on_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("index_roles_on_name_and_resource_type_and_resource_id").using("btree", table.name.asc().nullsLast().op("uuid_ops"), table.resourceType.asc().nullsLast().op("uuid_ops"), table.resourceId.asc().nullsLast().op("uuid_ops")),
]);

export const showYoutubes = pgTable("show_youtubes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	showId: uuid("show_id").notNull(),
	videoId: varchar("video_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("index_show_youtubes_on_show_id").using("btree", table.showId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.showId],
			foreignColumns: [shows.id],
			name: "fk_rails_ea4d9ca50c"
		}),
]);

export const songs = pgTable("songs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: varchar().notNull(),
	slug: varchar().notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
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
}, (table) => [
	index("index_songs_on_longest_gaps_data").using("gin", table.longestGapsData.asc().nullsLast().op("jsonb_ops")),
	uniqueIndex("index_songs_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	index("index_songs_on_yearly_play_data").using("gin", table.yearlyPlayData.asc().nullsLast().op("jsonb_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [authors.id],
			name: "fk_rails_028deefde5"
		}),
]);

export const reviews = pgTable("reviews", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	content: text().notNull(),
	status: varchar().default('draft').notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
	likesCount: integer("likes_count").default(0).notNull(),
	showId: uuid("show_id"),
}, (table) => [
	index("index_reviews_on_likes_count").using("btree", table.likesCount.asc().nullsLast().op("int4_ops")),
	index("index_reviews_on_show_id").using("btree", table.showId.asc().nullsLast().op("uuid_ops")),
	index("index_reviews_on_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_rails_74a66bd6c5"
		}),
]);

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
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }),
});

export const taggings = pgTable("taggings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	tagId: uuid("tag_id"),
	taggableType: varchar("taggable_type"),
	taggableId: uuid("taggable_id"),
	taggerType: varchar("tagger_type"),
	taggerId: uuid("tagger_id"),
	context: varchar(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }),
}, (table) => [
	index("index_taggings_on_context").using("btree", table.context.asc().nullsLast().op("text_ops")),
	index("index_taggings_on_tag_id").using("btree", table.tagId.asc().nullsLast().op("uuid_ops")),
	index("index_taggings_on_taggable_id").using("btree", table.taggableId.asc().nullsLast().op("uuid_ops")),
	index("index_taggings_on_taggable_type").using("btree", table.taggableType.asc().nullsLast().op("text_ops")),
	index("index_taggings_on_taggable_type_and_taggable_id").using("btree", table.taggableType.asc().nullsLast().op("uuid_ops"), table.taggableId.asc().nullsLast().op("uuid_ops")),
	index("index_taggings_on_tagger_id").using("btree", table.taggerId.asc().nullsLast().op("uuid_ops")),
	index("index_taggings_on_tagger_id_and_tagger_type").using("btree", table.taggerId.asc().nullsLast().op("uuid_ops"), table.taggerType.asc().nullsLast().op("text_ops")),
	index("index_taggings_on_tagger_type_and_tagger_id").using("btree", table.taggerType.asc().nullsLast().op("uuid_ops"), table.taggerId.asc().nullsLast().op("text_ops")),
	uniqueIndex("taggings_idx").using("btree", table.tagId.asc().nullsLast().op("uuid_ops"), table.taggableId.asc().nullsLast().op("text_ops"), table.taggableType.asc().nullsLast().op("uuid_ops"), table.context.asc().nullsLast().op("text_ops"), table.taggerId.asc().nullsLast().op("uuid_ops"), table.taggerType.asc().nullsLast().op("text_ops")),
	index("taggings_idy").using("btree", table.taggableId.asc().nullsLast().op("uuid_ops"), table.taggableType.asc().nullsLast().op("uuid_ops"), table.taggerId.asc().nullsLast().op("text_ops"), table.context.asc().nullsLast().op("uuid_ops")),
	index("taggings_taggable_context_idx").using("btree", table.taggableId.asc().nullsLast().op("uuid_ops"), table.taggableType.asc().nullsLast().op("text_ops"), table.context.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.tagId],
			foreignColumns: [tags.id],
			name: "fk_rails_9fcd2e236b"
		}),
]);

export const shows = pgTable("shows", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	slug: varchar(),
	date: date().notNull(),
	venueId: uuid("venue_id"),
	bandId: uuid("band_id"),
	notes: text(),
	legacyId: integer("legacy_id"),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
	likesCount: integer("likes_count").default(0).notNull(),
	relistenUrl: varchar("relisten_url"),
	averageRating: doublePrecision("average_rating").default(0),
	showPhotosCount: integer("show_photos_count").default(0).notNull(),
	showYoutubesCount: integer("show_youtubes_count").default(0).notNull(),
	reviewsCount: integer("reviews_count").default(0).notNull(),
}, (table) => [
	index("index_shows_on_likes_count").using("btree", table.likesCount.asc().nullsLast().op("int4_ops")),
	uniqueIndex("index_shows_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.bandId],
			foreignColumns: [bands.id],
			name: "fk_rails_62c0e1304d"
		}),
	foreignKey({
			columns: [table.venueId],
			foreignColumns: [venues.id],
			name: "fk_rails_ae9094c3e4"
		}),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	firstName: varchar("first_name"),
	lastName: varchar("last_name"),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
	email: varchar().notNull(),
	resetPasswordToken: varchar("reset_password_token"),
	resetPasswordSentAt: timestamp("reset_password_sent_at", { precision: 6, mode: 'string' }),
	confirmationToken: varchar("confirmation_token"),
	confirmedAt: timestamp("confirmed_at", { precision: 6, mode: 'string' }),
	confirmationSentAt: timestamp("confirmation_sent_at", { precision: 6, mode: 'string' }),
	passwordDigest: varchar("password_digest").notNull(),
	username: varchar(),
}, (table) => [
	uniqueIndex("index_users_on_confirmation_token").using("btree", table.confirmationToken.asc().nullsLast().op("text_ops")),
	uniqueIndex("index_users_on_email").using("btree", table.email.asc().nullsLast().op("text_ops")),
	uniqueIndex("index_users_on_reset_password_token").using("btree", table.resetPasswordToken.asc().nullsLast().op("text_ops")),
	uniqueIndex("index_users_on_username").using("btree", table.username.asc().nullsLast().op("text_ops")),
]);

export const venues = pgTable("venues", {
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
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
	timesPlayed: integer("times_played").default(0).notNull(),
}, (table) => [
	index("index_venues_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
]);

export const usersRoles = pgTable("users_roles", {
	userId: uuid("user_id"),
	roleId: uuid("role_id"),
}, (table) => [
	index("index_users_roles_on_user_id_and_role_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.roleId.asc().nullsLast().op("uuid_ops")),
]);

export const tags = pgTable("tags", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
	taggingsCount: integer("taggings_count").default(0),
}, (table) => [
	uniqueIndex("index_tags_on_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
]);

export const youtubes = pgTable("youtubes", {
	date: date(),
	url: text(),
});

export const tracks = pgTable("tracks", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	showId: uuid("show_id").notNull(),
	songId: uuid("song_id").notNull(),
	set: varchar().notNull(),
	position: integer().notNull(),
	segue: varchar(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
	likesCount: integer("likes_count").default(0).notNull(),
	slug: varchar(),
	note: varchar(),
	allTimer: boolean("all_timer").default(false),
	previousTrackId: uuid("previous_track_id"),
	nextTrackId: uuid("next_track_id"),
	averageRating: doublePrecision("average_rating").default(0),
}, (table) => [
	index("index_tracks_on_likes_count").using("btree", table.likesCount.asc().nullsLast().op("int4_ops")),
	index("index_tracks_on_next_track_id").using("btree", table.nextTrackId.asc().nullsLast().op("uuid_ops")),
	index("index_tracks_on_previous_track_id").using("btree", table.previousTrackId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("index_tracks_on_slug").using("btree", table.slug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.showId],
			foreignColumns: [shows.id],
			name: "fk_rails_9d5431146f"
		}),
	foreignKey({
			columns: [table.songId],
			foreignColumns: [songs.id],
			name: "fk_rails_a41ea81c98"
		}),
]);

export const likes = pgTable("likes", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	likeableId: uuid("likeable_id").notNull(),
	likeableType: varchar("likeable_type").notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { precision: 6, mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { precision: 6, mode: 'string' }).notNull(),
}, (table) => [
	index("index_likes_on_likeable_type_and_likeable_id").using("btree", table.likeableType.asc().nullsLast().op("text_ops"), table.likeableId.asc().nullsLast().op("uuid_ops")),
	index("index_likes_on_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("index_likes_on_user_id_and_likeable_type_and_likeable_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops"), table.likeableType.asc().nullsLast().op("text_ops"), table.likeableId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "fk_rails_1e09b5dabf"
		}),
]);
