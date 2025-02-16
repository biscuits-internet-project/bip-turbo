-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "active_storage_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"record_type" varchar NOT NULL,
	"record_id" uuid NOT NULL,
	"blob_id" uuid NOT NULL,
	"created_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "active_storage_blobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar NOT NULL,
	"filename" varchar NOT NULL,
	"content_type" varchar,
	"metadata" text,
	"byte_size" bigint NOT NULL,
	"checksum" varchar NOT NULL,
	"created_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"show_id" uuid NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ar_internal_metadata" (
	"key" varchar PRIMARY KEY NOT NULL,
	"value" varchar,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audits" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"auditable_id" integer,
	"auditable_type" varchar,
	"associated_id" integer,
	"associated_type" varchar,
	"user_id" uuid,
	"user_type" varchar,
	"username" varchar,
	"action" varchar,
	"audited_changes" jsonb,
	"version" integer DEFAULT 0,
	"comment" varchar,
	"remote_address" varchar,
	"request_uuid" varchar,
	"created_at" timestamp(6)
);
--> statement-breakpoint
CREATE TABLE "authors" (
	"name" varchar,
	"slug" varchar NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"commentable_id" uuid NOT NULL,
	"commentable_type" varchar NOT NULL,
	"content" text NOT NULL,
	"status" varchar DEFAULT 'published' NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"slug" varchar NOT NULL,
	"legacy_id" integer,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "annotations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"track_id" uuid NOT NULL,
	"desc" text,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"blurb" text,
	"slug" text NOT NULL,
	"content" text,
	"state" varchar DEFAULT 'draft' NOT NULL,
	"published_at" timestamp(6),
	"user_id" uuid NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"post_type" varchar DEFAULT 'blog' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faq" (
	"id" integer PRIMARY KEY NOT NULL,
	"question" text,
	"answer" text,
	"section" integer
);
--> statement-breakpoint
CREATE TABLE "friendly_id_slugs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"sluggable_type" varchar NOT NULL,
	"sluggable_id" uuid NOT NULL,
	"scope" varchar,
	"created_at" timestamp(6)
);
--> statement-breakpoint
CREATE TABLE "media_contents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer,
	"url" varchar,
	"media_type" varchar NOT NULL,
	"description" text,
	"created_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"date" date
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"show_id" uuid NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pg_search_documents" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"content" text,
	"searchable_type" varchar,
	"searchable_id" uuid,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"value" double precision DEFAULT 0 NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"rateable_type" varchar,
	"rateable_id" uuid
);
--> statement-breakpoint
CREATE TABLE "show_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar,
	"source" varchar,
	"user_id" uuid NOT NULL,
	"show_id" uuid NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"resource_id" uuid,
	"resource_type" varchar,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "show_youtubes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"show_id" uuid NOT NULL,
	"video_id" varchar NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar NOT NULL,
	"slug" varchar NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"lyrics" text,
	"tabs" text,
	"notes" text,
	"legacy_abbr" varchar,
	"legacy_id" integer,
	"cover" boolean DEFAULT false,
	"author_id" uuid,
	"legacy_author" text,
	"history" text,
	"featured_lyric" text,
	"times_played" integer DEFAULT 0 NOT NULL,
	"date_last_played" date,
	"yearly_play_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"longest_gaps_data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"most_common_year" integer,
	"least_common_year" integer,
	"guitar_tabs_url" text
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"status" varchar DEFAULT 'draft' NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"show_id" uuid
);
--> statement-breakpoint
CREATE TABLE "side_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"dates" varchar,
	"notes" text,
	"mem1" varchar,
	"mem2" varchar,
	"mem3" varchar,
	"mem4" varchar,
	"mem5" varchar,
	"mem6" varchar,
	"mem7" varchar,
	"created_at" timestamp(6),
	"updated_at" timestamp(6)
);
--> statement-breakpoint
CREATE TABLE "taggings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tag_id" uuid,
	"taggable_type" varchar,
	"taggable_id" uuid,
	"tagger_type" varchar,
	"tagger_id" uuid,
	"context" varchar,
	"created_at" timestamp(6)
);
--> statement-breakpoint
CREATE TABLE "shows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar,
	"date" date NOT NULL,
	"venue_id" uuid,
	"band_id" uuid,
	"notes" text,
	"legacy_id" integer,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"relisten_url" varchar,
	"average_rating" double precision DEFAULT 0,
	"show_photos_count" integer DEFAULT 0 NOT NULL,
	"show_youtubes_count" integer DEFAULT 0 NOT NULL,
	"reviews_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"email" varchar NOT NULL,
	"reset_password_token" varchar,
	"reset_password_sent_at" timestamp(6),
	"confirmation_token" varchar,
	"confirmed_at" timestamp(6),
	"confirmation_sent_at" timestamp(6),
	"password_digest" varchar NOT NULL,
	"username" varchar
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"slug" varchar NOT NULL,
	"street" varchar,
	"city" varchar,
	"state" varchar,
	"country" varchar,
	"postal_code" varchar,
	"latitude" double precision,
	"longitude" double precision,
	"phone" varchar,
	"website" varchar,
	"legacy_id" integer,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"times_played" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users_roles" (
	"user_id" uuid,
	"role_id" uuid
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"taggings_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "youtubes" (
	"date" date,
	"url" text
);
--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"show_id" uuid NOT NULL,
	"song_id" uuid NOT NULL,
	"set" varchar NOT NULL,
	"position" integer NOT NULL,
	"segue" varchar,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL,
	"likes_count" integer DEFAULT 0 NOT NULL,
	"slug" varchar,
	"note" varchar,
	"all_timer" boolean DEFAULT false,
	"previous_track_id" uuid,
	"next_track_id" uuid,
	"average_rating" double precision DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"likeable_id" uuid NOT NULL,
	"likeable_type" varchar NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp(6) NOT NULL,
	"updated_at" timestamp(6) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "fk_rails_2aac17a78c" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "fk_rails_77ad02f5c5" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "fk_rails_03de2dc08c" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "annotations" ADD CONSTRAINT "fk_rails_31a9a82e68" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "fk_rails_829fc99162" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "fk_rails_664ddb4807" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "fk_rails_d15744e438" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "fk_rails_a7dfeb9f5f" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "show_photos" ADD CONSTRAINT "fk_rails_191cbe34d9" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "show_photos" ADD CONSTRAINT "fk_rails_5aafeab212" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "show_youtubes" ADD CONSTRAINT "fk_rails_ea4d9ca50c" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "fk_rails_028deefde5" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "fk_rails_74a66bd6c5" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taggings" ADD CONSTRAINT "fk_rails_9fcd2e236b" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "fk_rails_62c0e1304d" FOREIGN KEY ("band_id") REFERENCES "public"."bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "fk_rails_ae9094c3e4" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "fk_rails_9d5431146f" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "fk_rails_a41ea81c98" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "fk_rails_1e09b5dabf" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "index_active_storage_attachments_on_blob_id" ON "active_storage_attachments" USING btree ("blob_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_active_storage_attachments_uniqueness" ON "active_storage_attachments" USING btree ("record_type" uuid_ops,"record_id" uuid_ops,"name" text_ops,"blob_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_active_storage_blobs_on_key" ON "active_storage_blobs" USING btree ("key" text_ops);--> statement-breakpoint
CREATE INDEX "index_attendances_on_show_id" ON "attendances" USING btree ("show_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_attendances_on_user_id" ON "attendances" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_attendances_on_user_id_and_show_id" ON "attendances" USING btree ("user_id" uuid_ops,"show_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "associated_index" ON "audits" USING btree ("associated_type" int4_ops,"associated_id" int4_ops);--> statement-breakpoint
CREATE INDEX "auditable_index" ON "audits" USING btree ("auditable_type" text_ops,"auditable_id" text_ops,"version" int4_ops);--> statement-breakpoint
CREATE INDEX "index_audits_on_created_at" ON "audits" USING btree ("created_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "index_audits_on_request_uuid" ON "audits" USING btree ("request_uuid" text_ops);--> statement-breakpoint
CREATE INDEX "user_index" ON "audits" USING btree ("user_id" text_ops,"user_type" text_ops);--> statement-breakpoint
CREATE INDEX "index_authors_on_slug" ON "authors" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "index_comments_on_commentable_type_and_commentable_id" ON "comments" USING btree ("commentable_type" text_ops,"commentable_id" text_ops);--> statement-breakpoint
CREATE INDEX "index_comments_on_user_id" ON "comments" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_bands_on_slug" ON "bands" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "blog_posts_published_at_idx" ON "blog_posts" USING btree ("published_at" timestamp_ops);--> statement-breakpoint
CREATE INDEX "blog_posts_state_idx" ON "blog_posts" USING btree ("state" text_ops);--> statement-breakpoint
CREATE INDEX "blog_posts_title_idx" ON "blog_posts" USING btree ("title" text_ops);--> statement-breakpoint
CREATE INDEX "index_blog_posts_on_user_id" ON "blog_posts" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_friendly_id_slugs_on_slug_and_sluggable_type" ON "friendly_id_slugs" USING btree ("slug" text_ops,"sluggable_type" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope" ON "friendly_id_slugs" USING btree ("slug" text_ops,"sluggable_type" text_ops,"scope" text_ops);--> statement-breakpoint
CREATE INDEX "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id" ON "friendly_id_slugs" USING btree ("sluggable_type" uuid_ops,"sluggable_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_favorites_on_show_id" ON "favorites" USING btree ("show_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_favorites_on_user_id" ON "favorites" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_pg_search_documents_on_searchable_type_and_searchable_id" ON "pg_search_documents" USING btree ("searchable_type" text_ops,"searchable_id" text_ops);--> statement-breakpoint
CREATE INDEX "index_ratings_on_rateable_type_and_rateable_id" ON "ratings" USING btree ("rateable_type" text_ops,"rateable_id" text_ops);--> statement-breakpoint
CREATE INDEX "index_ratings_on_user_id" ON "ratings" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_show_photos_on_show_id" ON "show_photos" USING btree ("show_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_show_photos_on_user_id" ON "show_photos" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_roles_on_name" ON "roles" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "index_roles_on_name_and_resource_type_and_resource_id" ON "roles" USING btree ("name" uuid_ops,"resource_type" uuid_ops,"resource_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_show_youtubes_on_show_id" ON "show_youtubes" USING btree ("show_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_songs_on_longest_gaps_data" ON "songs" USING gin ("longest_gaps_data" jsonb_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_songs_on_slug" ON "songs" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "index_songs_on_yearly_play_data" ON "songs" USING gin ("yearly_play_data" jsonb_ops);--> statement-breakpoint
CREATE INDEX "index_reviews_on_likes_count" ON "reviews" USING btree ("likes_count" int4_ops);--> statement-breakpoint
CREATE INDEX "index_reviews_on_show_id" ON "reviews" USING btree ("show_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_reviews_on_user_id" ON "reviews" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_taggings_on_context" ON "taggings" USING btree ("context" text_ops);--> statement-breakpoint
CREATE INDEX "index_taggings_on_tag_id" ON "taggings" USING btree ("tag_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_taggings_on_taggable_id" ON "taggings" USING btree ("taggable_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_taggings_on_taggable_type" ON "taggings" USING btree ("taggable_type" text_ops);--> statement-breakpoint
CREATE INDEX "index_taggings_on_taggable_type_and_taggable_id" ON "taggings" USING btree ("taggable_type" uuid_ops,"taggable_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_taggings_on_tagger_id" ON "taggings" USING btree ("tagger_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_taggings_on_tagger_id_and_tagger_type" ON "taggings" USING btree ("tagger_id" uuid_ops,"tagger_type" text_ops);--> statement-breakpoint
CREATE INDEX "index_taggings_on_tagger_type_and_tagger_id" ON "taggings" USING btree ("tagger_type" uuid_ops,"tagger_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "taggings_idx" ON "taggings" USING btree ("tag_id" uuid_ops,"taggable_id" text_ops,"taggable_type" uuid_ops,"context" text_ops,"tagger_id" uuid_ops,"tagger_type" text_ops);--> statement-breakpoint
CREATE INDEX "taggings_idy" ON "taggings" USING btree ("taggable_id" uuid_ops,"taggable_type" uuid_ops,"tagger_id" text_ops,"context" uuid_ops);--> statement-breakpoint
CREATE INDEX "taggings_taggable_context_idx" ON "taggings" USING btree ("taggable_id" uuid_ops,"taggable_type" text_ops,"context" text_ops);--> statement-breakpoint
CREATE INDEX "index_shows_on_likes_count" ON "shows" USING btree ("likes_count" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_shows_on_slug" ON "shows" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_users_on_confirmation_token" ON "users" USING btree ("confirmation_token" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_users_on_email" ON "users" USING btree ("email" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_users_on_reset_password_token" ON "users" USING btree ("reset_password_token" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_users_on_username" ON "users" USING btree ("username" text_ops);--> statement-breakpoint
CREATE INDEX "index_venues_on_slug" ON "venues" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "index_users_roles_on_user_id_and_role_id" ON "users_roles" USING btree ("user_id" uuid_ops,"role_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_tags_on_name" ON "tags" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "index_tracks_on_likes_count" ON "tracks" USING btree ("likes_count" int4_ops);--> statement-breakpoint
CREATE INDEX "index_tracks_on_next_track_id" ON "tracks" USING btree ("next_track_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_tracks_on_previous_track_id" ON "tracks" USING btree ("previous_track_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_tracks_on_slug" ON "tracks" USING btree ("slug" text_ops);--> statement-breakpoint
CREATE INDEX "index_likes_on_likeable_type_and_likeable_id" ON "likes" USING btree ("likeable_type" text_ops,"likeable_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "index_likes_on_user_id" ON "likes" USING btree ("user_id" uuid_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "index_likes_on_user_id_and_likeable_type_and_likeable_id" ON "likes" USING btree ("user_id" uuid_ops,"likeable_type" text_ops,"likeable_id" uuid_ops);
*/