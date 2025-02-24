-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations

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
ALTER TABLE "attendances" ADD CONSTRAINT "fk_attendances_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendances" ADD CONSTRAINT "fk_attendances_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "fk_comments_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "annotations" ADD CONSTRAINT "fk_annotations_tracks_track_id" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "fk_blog_posts_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "fk_favorites_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "fk_favorites_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "fk_ratings_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "show_photos" ADD CONSTRAINT "fk_show_photos_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "show_photos" ADD CONSTRAINT "fk_show_photos_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "show_youtubes" ADD CONSTRAINT "fk_show_youtubes_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "songs" ADD CONSTRAINT "fk_songs_authors_author_id" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "fk_reviews_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "taggings" ADD CONSTRAINT "fk_taggings_tags_tag_id" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "fk_shows_bands_band_id" FOREIGN KEY ("band_id") REFERENCES "public"."bands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shows" ADD CONSTRAINT "fk_shows_venues_venue_id" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "fk_tracks_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracks" ADD CONSTRAINT "fk_tracks_songs_song_id" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "fk_likes_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "active_storage_attachments_blob_id_idx" ON "active_storage_attachments" USING btree ("blob_id");--> statement-breakpoint
CREATE UNIQUE INDEX "active_storage_attachments_record_name_blob_unique" ON "active_storage_attachments" USING btree ("record_type","record_id","name","blob_id");--> statement-breakpoint
CREATE UNIQUE INDEX "active_storage_blobs_key_unique" ON "active_storage_blobs" USING btree ("key");--> statement-breakpoint
CREATE INDEX "attendances_show_id_idx" ON "attendances" USING btree ("show_id");--> statement-breakpoint
CREATE INDEX "attendances_user_id_idx" ON "attendances" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "attendances_user_id_show_id_unique" ON "attendances" USING btree ("user_id","show_id");--> statement-breakpoint
CREATE INDEX "audits_associated_type_id_idx" ON "audits" USING btree ("associated_type","associated_id");--> statement-breakpoint
CREATE INDEX "audits_auditable_type_id_version_idx" ON "audits" USING btree ("auditable_type","auditable_id","version");--> statement-breakpoint
CREATE INDEX "audits_created_at_idx" ON "audits" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audits_request_uuid_idx" ON "audits" USING btree ("request_uuid");--> statement-breakpoint
CREATE INDEX "audits_user_id_type_idx" ON "audits" USING btree ("user_id","user_type");--> statement-breakpoint
CREATE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "comments_commentable_type_id_idx" ON "comments" USING btree ("commentable_type","commentable_id");--> statement-breakpoint
CREATE INDEX "comments_user_id_idx" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bands_slug_unique" ON "bands" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_posts_published_at_idx" ON "blog_posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "blog_posts_state_idx" ON "blog_posts" USING btree ("state");--> statement-breakpoint
CREATE INDEX "blog_posts_title_idx" ON "blog_posts" USING btree ("title");--> statement-breakpoint
CREATE INDEX "blog_posts_user_id_idx" ON "blog_posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "friendly_id_slugs_slug_type_idx" ON "friendly_id_slugs" USING btree ("slug","sluggable_type");--> statement-breakpoint
CREATE UNIQUE INDEX "friendly_id_slugs_slug_type_scope_unique" ON "friendly_id_slugs" USING btree ("slug","sluggable_type","scope");--> statement-breakpoint
CREATE INDEX "friendly_id_slugs_type_id_idx" ON "friendly_id_slugs" USING btree ("sluggable_type","sluggable_id");--> statement-breakpoint
CREATE INDEX "favorites_show_id_idx" ON "favorites" USING btree ("show_id");--> statement-breakpoint
CREATE INDEX "favorites_user_id_idx" ON "favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "pg_search_documents_type_id_idx" ON "pg_search_documents" USING btree ("searchable_type","searchable_id");--> statement-breakpoint
CREATE INDEX "ratings_rateable_type_id_idx" ON "ratings" USING btree ("rateable_type","rateable_id");--> statement-breakpoint
CREATE INDEX "ratings_user_id_idx" ON "ratings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "show_photos_show_id_idx" ON "show_photos" USING btree ("show_id");--> statement-breakpoint
CREATE INDEX "show_photos_user_id_idx" ON "show_photos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "roles_name_idx" ON "roles" USING btree ("name");--> statement-breakpoint
CREATE INDEX "roles_name_resource_type_id_idx" ON "roles" USING btree ("name","resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "show_youtubes_show_id_idx" ON "show_youtubes" USING btree ("show_id");--> statement-breakpoint
CREATE INDEX "songs_longest_gaps_data_idx" ON "songs" USING gin ("longest_gaps_data");--> statement-breakpoint
CREATE UNIQUE INDEX "songs_slug_unique" ON "songs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "songs_yearly_play_data_idx" ON "songs" USING gin ("yearly_play_data");--> statement-breakpoint
CREATE INDEX "reviews_likes_count_idx" ON "reviews" USING btree ("likes_count");--> statement-breakpoint
CREATE INDEX "reviews_show_id_idx" ON "reviews" USING btree ("show_id");--> statement-breakpoint
CREATE INDEX "reviews_user_id_idx" ON "reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "taggings_context_idx" ON "taggings" USING btree ("context");--> statement-breakpoint
CREATE INDEX "taggings_tag_id_idx" ON "taggings" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "taggings_taggable_id_idx" ON "taggings" USING btree ("taggable_id");--> statement-breakpoint
CREATE INDEX "taggings_taggable_type_idx" ON "taggings" USING btree ("taggable_type");--> statement-breakpoint
CREATE INDEX "taggings_taggable_type_id_idx" ON "taggings" USING btree ("taggable_type","taggable_id");--> statement-breakpoint
CREATE INDEX "taggings_tagger_id_idx" ON "taggings" USING btree ("tagger_id");--> statement-breakpoint
CREATE INDEX "taggings_tagger_id_type_idx" ON "taggings" USING btree ("tagger_id","tagger_type");--> statement-breakpoint
CREATE INDEX "taggings_tagger_type_id_idx" ON "taggings" USING btree ("tagger_type","tagger_id");--> statement-breakpoint
CREATE UNIQUE INDEX "taggings_tag_taggable_context_unique" ON "taggings" USING btree ("tag_id","taggable_id","taggable_type","context","tagger_id","tagger_type");--> statement-breakpoint
CREATE INDEX "taggings_taggable_tagger_context_idx" ON "taggings" USING btree ("taggable_id","taggable_type","tagger_id","context");--> statement-breakpoint
CREATE INDEX "taggings_taggable_context_idx" ON "taggings" USING btree ("taggable_id","taggable_type","context");--> statement-breakpoint
CREATE INDEX "shows_likes_count_idx" ON "shows" USING btree ("likes_count");--> statement-breakpoint
CREATE UNIQUE INDEX "shows_slug_unique" ON "shows" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "users_confirmation_token_unique" ON "users" USING btree ("confirmation_token");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_reset_password_token_unique" ON "users" USING btree ("reset_password_token");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_unique" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "venues_slug_idx" ON "venues" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "users_roles_user_id_role_id_idx" ON "users_roles" USING btree ("user_id","role_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_name_unique" ON "tags" USING btree ("name");--> statement-breakpoint
CREATE INDEX "tracks_likes_count_idx" ON "tracks" USING btree ("likes_count");--> statement-breakpoint
CREATE INDEX "tracks_next_track_id_idx" ON "tracks" USING btree ("next_track_id");--> statement-breakpoint
CREATE INDEX "tracks_previous_track_id_idx" ON "tracks" USING btree ("previous_track_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tracks_slug_unique" ON "tracks" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "likes_likeable_type_id_idx" ON "likes" USING btree ("likeable_type","likeable_id");--> statement-breakpoint
CREATE INDEX "likes_user_id_idx" ON "likes" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "likes_user_id_likeable_type_id_unique" ON "likes" USING btree ("user_id","likeable_type","likeable_id");