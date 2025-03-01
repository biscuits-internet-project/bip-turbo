-- CreateTable
CREATE TABLE "active_storage_attachments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "record_type" VARCHAR NOT NULL,
    "record_id" UUID NOT NULL,
    "blob_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "active_storage_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_storage_blobs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" VARCHAR NOT NULL,
    "filename" VARCHAR NOT NULL,
    "content_type" VARCHAR,
    "metadata" TEXT,
    "byte_size" BIGINT NOT NULL,
    "checksum" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "active_storage_blobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annotations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "track_id" UUID NOT NULL,
    "desc" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "annotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ar_internal_metadata" (
    "key" VARCHAR NOT NULL,
    "value" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ar_internal_metadata_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "show_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audits" (
    "id" BIGSERIAL NOT NULL,
    "auditable_id" INTEGER,
    "auditable_type" VARCHAR,
    "associated_id" INTEGER,
    "associated_type" VARCHAR,
    "user_id" UUID,
    "user_type" VARCHAR,
    "username" VARCHAR,
    "action" VARCHAR,
    "audited_changes" JSONB,
    "version" INTEGER DEFAULT 0,
    "comment" VARCHAR,
    "remote_address" VARCHAR,
    "request_uuid" VARCHAR,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authors" (
    "name" VARCHAR,
    "slug" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bands" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "slug" VARCHAR NOT NULL,
    "legacy_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "bands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "blurb" TEXT,
    "slug" TEXT NOT NULL,
    "content" TEXT,
    "state" VARCHAR NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(6),
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "post_type" VARCHAR NOT NULL DEFAULT 'blog',

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "commentable_id" UUID NOT NULL,
    "commentable_type" VARCHAR NOT NULL,
    "content" TEXT NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'published',
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" INTEGER NOT NULL,
    "question" TEXT,
    "answer" TEXT,
    "section" INTEGER,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "show_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendly_id_slugs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR NOT NULL,
    "sluggable_type" VARCHAR NOT NULL,
    "sluggable_id" UUID NOT NULL,
    "scope" VARCHAR,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "friendly_id_slugs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "likeable_id" UUID NOT NULL,
    "likeable_type" VARCHAR NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_contents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "year" INTEGER,
    "url" VARCHAR,
    "media_type" VARCHAR NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATE,

    CONSTRAINT "media_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pg_search_documents" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT,
    "searchable_type" VARCHAR,
    "searchable_id" UUID,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "pg_search_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "rateable_type" VARCHAR,
    "rateable_id" UUID,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'draft',
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "show_id" UUID,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "resource_id" UUID,
    "resource_type" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_photos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" VARCHAR,
    "source" VARCHAR,
    "user_id" UUID NOT NULL,
    "show_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "show_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_youtubes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "show_id" UUID NOT NULL,
    "video_id" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "show_youtubes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shows" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR,
    "date" DATE NOT NULL,
    "venue_id" UUID,
    "band_id" UUID,
    "notes" TEXT,
    "legacy_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "relisten_url" VARCHAR,
    "average_rating" DOUBLE PRECISION DEFAULT 0,
    "show_photos_count" INTEGER NOT NULL DEFAULT 0,
    "show_youtubes_count" INTEGER NOT NULL DEFAULT 0,
    "reviews_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "side_projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "dates" VARCHAR,
    "notes" TEXT,
    "mem1" VARCHAR,
    "mem2" VARCHAR,
    "mem3" VARCHAR,
    "mem4" VARCHAR,
    "mem5" VARCHAR,
    "mem6" VARCHAR,
    "mem7" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "side_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "songs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "lyrics" TEXT,
    "tabs" TEXT,
    "notes" TEXT,
    "legacy_abbr" VARCHAR,
    "legacy_id" INTEGER,
    "cover" BOOLEAN DEFAULT false,
    "author_id" UUID,
    "legacy_author" TEXT,
    "history" TEXT,
    "featured_lyric" TEXT,
    "times_played" INTEGER NOT NULL DEFAULT 0,
    "date_last_played" DATE,
    "yearly_play_data" JSONB NOT NULL DEFAULT '{}',
    "longest_gaps_data" JSONB NOT NULL DEFAULT '{}',
    "most_common_year" INTEGER,
    "least_common_year" INTEGER,
    "guitar_tabs_url" TEXT,

    CONSTRAINT "songs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taggings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tag_id" UUID,
    "taggable_type" VARCHAR,
    "taggable_id" UUID,
    "tagger_type" VARCHAR,
    "tagger_id" UUID,
    "context" VARCHAR,
    "created_at" TIMESTAMP(6),

    CONSTRAINT "taggings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "taggings_count" INTEGER DEFAULT 0,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "show_id" UUID NOT NULL,
    "song_id" UUID NOT NULL,
    "set" VARCHAR NOT NULL,
    "position" INTEGER NOT NULL,
    "segue" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "slug" VARCHAR,
    "note" VARCHAR,
    "all_timer" BOOLEAN DEFAULT false,
    "previous_track_id" UUID,
    "next_track_id" UUID,
    "average_rating" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" VARCHAR,
    "last_name" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "email" VARCHAR NOT NULL,
    "reset_password_token" VARCHAR,
    "reset_password_sent_at" TIMESTAMP(6),
    "confirmation_token" VARCHAR,
    "confirmed_at" TIMESTAMP(6),
    "confirmation_sent_at" TIMESTAMP(6),
    "password_digest" VARCHAR NOT NULL,
    "username" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_roles" (
    "user_id" UUID,
    "role_id" UUID
);

-- CreateTable
CREATE TABLE "venues" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "slug" VARCHAR NOT NULL,
    "street" VARCHAR,
    "city" VARCHAR,
    "state" VARCHAR,
    "country" VARCHAR,
    "postal_code" VARCHAR,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" VARCHAR,
    "website" VARCHAR,
    "legacy_id" INTEGER,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "times_played" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "youtubes" (
    "date" DATE,
    "url" TEXT
);

-- CreateIndex
CREATE INDEX "active_storage_attachments_blob_id_idx" ON "active_storage_attachments"("blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "active_storage_attachments_record_name_blob_unique" ON "active_storage_attachments"("record_type", "record_id", "name", "blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "active_storage_blobs_key_unique" ON "active_storage_blobs"("key");

-- CreateIndex
CREATE INDEX "attendances_show_id_idx" ON "attendances"("show_id");

-- CreateIndex
CREATE INDEX "attendances_user_id_idx" ON "attendances"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_user_id_show_id_unique" ON "attendances"("user_id", "show_id");

-- CreateIndex
CREATE INDEX "audits_associated_type_id_idx" ON "audits"("associated_type", "associated_id");

-- CreateIndex
CREATE INDEX "audits_auditable_type_id_version_idx" ON "audits"("auditable_type", "auditable_id", "version");

-- CreateIndex
CREATE INDEX "audits_created_at_idx" ON "audits"("created_at");

-- CreateIndex
CREATE INDEX "audits_request_uuid_idx" ON "audits"("request_uuid");

-- CreateIndex
CREATE INDEX "audits_user_id_type_idx" ON "audits"("user_id", "user_type");

-- CreateIndex
CREATE INDEX "authors_slug_idx" ON "authors"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "bands_slug_unique" ON "bands"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_published_at_idx" ON "blog_posts"("published_at");

-- CreateIndex
CREATE INDEX "blog_posts_state_idx" ON "blog_posts"("state");

-- CreateIndex
CREATE INDEX "blog_posts_title_idx" ON "blog_posts"("title");

-- CreateIndex
CREATE INDEX "blog_posts_user_id_idx" ON "blog_posts"("user_id");

-- CreateIndex
CREATE INDEX "comments_commentable_type_id_idx" ON "comments"("commentable_type", "commentable_id");

-- CreateIndex
CREATE INDEX "comments_user_id_idx" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "favorites_show_id_idx" ON "favorites"("show_id");

-- CreateIndex
CREATE INDEX "favorites_user_id_idx" ON "favorites"("user_id");

-- CreateIndex
CREATE INDEX "friendly_id_slugs_slug_type_idx" ON "friendly_id_slugs"("slug", "sluggable_type");

-- CreateIndex
CREATE INDEX "friendly_id_slugs_type_id_idx" ON "friendly_id_slugs"("sluggable_type", "sluggable_id");

-- CreateIndex
CREATE UNIQUE INDEX "friendly_id_slugs_slug_type_scope_unique" ON "friendly_id_slugs"("slug", "sluggable_type", "scope");

-- CreateIndex
CREATE INDEX "likes_likeable_type_id_idx" ON "likes"("likeable_type", "likeable_id");

-- CreateIndex
CREATE INDEX "likes_user_id_idx" ON "likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_user_id_likeable_type_id_unique" ON "likes"("user_id", "likeable_type", "likeable_id");

-- CreateIndex
CREATE INDEX "pg_search_documents_type_id_idx" ON "pg_search_documents"("searchable_type", "searchable_id");

-- CreateIndex
CREATE INDEX "ratings_rateable_type_id_idx" ON "ratings"("rateable_type", "rateable_id");

-- CreateIndex
CREATE INDEX "ratings_user_id_idx" ON "ratings"("user_id");

-- CreateIndex
CREATE INDEX "reviews_likes_count_idx" ON "reviews"("likes_count");

-- CreateIndex
CREATE INDEX "reviews_show_id_idx" ON "reviews"("show_id");

-- CreateIndex
CREATE INDEX "reviews_user_id_idx" ON "reviews"("user_id");

-- CreateIndex
CREATE INDEX "roles_name_idx" ON "roles"("name");

-- CreateIndex
CREATE INDEX "roles_name_resource_type_id_idx" ON "roles"("name", "resource_type", "resource_id");

-- CreateIndex
CREATE INDEX "show_photos_show_id_idx" ON "show_photos"("show_id");

-- CreateIndex
CREATE INDEX "show_photos_user_id_idx" ON "show_photos"("user_id");

-- CreateIndex
CREATE INDEX "show_youtubes_show_id_idx" ON "show_youtubes"("show_id");

-- CreateIndex
CREATE UNIQUE INDEX "shows_slug_unique" ON "shows"("slug");

-- CreateIndex
CREATE INDEX "shows_likes_count_idx" ON "shows"("likes_count");

-- CreateIndex
CREATE UNIQUE INDEX "songs_slug_unique" ON "songs"("slug");

-- CreateIndex
CREATE INDEX "songs_longest_gaps_data_idx" ON "songs" USING GIN ("longest_gaps_data");

-- CreateIndex
CREATE INDEX "songs_yearly_play_data_idx" ON "songs" USING GIN ("yearly_play_data");

-- CreateIndex
CREATE INDEX "taggings_context_idx" ON "taggings"("context");

-- CreateIndex
CREATE INDEX "taggings_tag_id_idx" ON "taggings"("tag_id");

-- CreateIndex
CREATE INDEX "taggings_taggable_context_idx" ON "taggings"("taggable_id", "taggable_type", "context");

-- CreateIndex
CREATE INDEX "taggings_taggable_id_idx" ON "taggings"("taggable_id");

-- CreateIndex
CREATE INDEX "taggings_taggable_tagger_context_idx" ON "taggings"("taggable_id", "taggable_type", "tagger_id", "context");

-- CreateIndex
CREATE INDEX "taggings_taggable_type_id_idx" ON "taggings"("taggable_type", "taggable_id");

-- CreateIndex
CREATE INDEX "taggings_taggable_type_idx" ON "taggings"("taggable_type");

-- CreateIndex
CREATE INDEX "taggings_tagger_id_idx" ON "taggings"("tagger_id");

-- CreateIndex
CREATE INDEX "taggings_tagger_id_type_idx" ON "taggings"("tagger_id", "tagger_type");

-- CreateIndex
CREATE INDEX "taggings_tagger_type_id_idx" ON "taggings"("tagger_type", "tagger_id");

-- CreateIndex
CREATE UNIQUE INDEX "taggings_tag_taggable_context_unique" ON "taggings"("tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_unique" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_slug_unique" ON "tracks"("slug");

-- CreateIndex
CREATE INDEX "tracks_likes_count_idx" ON "tracks"("likes_count");

-- CreateIndex
CREATE INDEX "tracks_next_track_id_idx" ON "tracks"("next_track_id");

-- CreateIndex
CREATE INDEX "tracks_previous_track_id_idx" ON "tracks"("previous_track_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_reset_password_token_unique" ON "users"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_confirmation_token_unique" ON "users"("confirmation_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_unique" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_roles_user_id_role_id_idx" ON "users_roles"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "venues_slug_idx" ON "venues"("slug");

-- AddForeignKey
ALTER TABLE "annotations" ADD CONSTRAINT "fk_annotations_tracks_track_id" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "fk_attendances_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "fk_attendances_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "fk_blog_posts_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "fk_comments_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "fk_favorites_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "fk_favorites_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fk_likes_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "fk_ratings_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "fk_reviews_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_photos" ADD CONSTRAINT "fk_show_photos_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_photos" ADD CONSTRAINT "fk_show_photos_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_youtubes" ADD CONSTRAINT "fk_show_youtubes_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "fk_shows_bands_band_id" FOREIGN KEY ("band_id") REFERENCES "bands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "fk_shows_venues_venue_id" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "fk_songs_authors_author_id" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "taggings" ADD CONSTRAINT "fk_taggings_tags_tag_id" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "fk_tracks_shows_show_id" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "fk_tracks_songs_song_id" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
