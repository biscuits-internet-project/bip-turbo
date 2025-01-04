CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
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
    "average_rating" DOUBLE PRECISION DEFAULT 0.0,
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
    "average_rating" DOUBLE PRECISION DEFAULT 0.0,

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
CREATE INDEX "index_active_storage_attachments_on_blob_id" ON "active_storage_attachments"("blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_attachments_uniqueness" ON "active_storage_attachments"("record_type", "record_id", "name", "blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_blobs_on_key" ON "active_storage_blobs"("key");

-- CreateIndex
CREATE INDEX "index_attendances_on_show_id" ON "attendances"("show_id");

-- CreateIndex
CREATE INDEX "index_attendances_on_user_id" ON "attendances"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_attendances_on_user_id_and_show_id" ON "attendances"("user_id", "show_id");

-- CreateIndex
CREATE INDEX "associated_index" ON "audits"("associated_type", "associated_id");

-- CreateIndex
CREATE INDEX "auditable_index" ON "audits"("auditable_type", "auditable_id", "version");

-- CreateIndex
CREATE INDEX "index_audits_on_created_at" ON "audits"("created_at");

-- CreateIndex
CREATE INDEX "index_audits_on_request_uuid" ON "audits"("request_uuid");

-- CreateIndex
CREATE INDEX "user_index" ON "audits"("user_id", "user_type");

-- CreateIndex
CREATE INDEX "index_authors_on_slug" ON "authors"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "index_bands_on_slug" ON "bands"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_published_at_idx" ON "blog_posts"("published_at");

-- CreateIndex
CREATE INDEX "blog_posts_state_idx" ON "blog_posts"("state");

-- CreateIndex
CREATE INDEX "blog_posts_title_idx" ON "blog_posts"("title");

-- CreateIndex
CREATE INDEX "index_blog_posts_on_user_id" ON "blog_posts"("user_id");

-- CreateIndex
CREATE INDEX "index_comments_on_commentable_type_and_commentable_id" ON "comments"("commentable_type", "commentable_id");

-- CreateIndex
CREATE INDEX "index_comments_on_user_id" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "index_favorites_on_show_id" ON "favorites"("show_id");

-- CreateIndex
CREATE INDEX "index_favorites_on_user_id" ON "favorites"("user_id");

-- CreateIndex
CREATE INDEX "index_friendly_id_slugs_on_slug_and_sluggable_type" ON "friendly_id_slugs"("slug", "sluggable_type");

-- CreateIndex
CREATE INDEX "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id" ON "friendly_id_slugs"("sluggable_type", "sluggable_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope" ON "friendly_id_slugs"("slug", "sluggable_type", "scope");

-- CreateIndex
CREATE INDEX "index_likes_on_likeable_type_and_likeable_id" ON "likes"("likeable_type", "likeable_id");

-- CreateIndex
CREATE INDEX "index_likes_on_user_id" ON "likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_likes_on_user_id_and_likeable_type_and_likeable_id" ON "likes"("user_id", "likeable_type", "likeable_id");

-- CreateIndex
CREATE INDEX "index_pg_search_documents_on_searchable_type_and_searchable_id" ON "pg_search_documents"("searchable_type", "searchable_id");

-- CreateIndex
CREATE INDEX "index_ratings_on_rateable_type_and_rateable_id" ON "ratings"("rateable_type", "rateable_id");

-- CreateIndex
CREATE INDEX "index_ratings_on_user_id" ON "ratings"("user_id");

-- CreateIndex
CREATE INDEX "index_reviews_on_likes_count" ON "reviews"("likes_count");

-- CreateIndex
CREATE INDEX "index_reviews_on_show_id" ON "reviews"("show_id");

-- CreateIndex
CREATE INDEX "index_reviews_on_user_id" ON "reviews"("user_id");

-- CreateIndex
CREATE INDEX "index_roles_on_name" ON "roles"("name");

-- CreateIndex
CREATE INDEX "index_roles_on_name_and_resource_type_and_resource_id" ON "roles"("name", "resource_type", "resource_id");

-- CreateIndex
CREATE INDEX "index_show_photos_on_show_id" ON "show_photos"("show_id");

-- CreateIndex
CREATE INDEX "index_show_photos_on_user_id" ON "show_photos"("user_id");

-- CreateIndex
CREATE INDEX "index_show_youtubes_on_show_id" ON "show_youtubes"("show_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_shows_on_slug" ON "shows"("slug");

-- CreateIndex
CREATE INDEX "index_shows_on_likes_count" ON "shows"("likes_count");

-- CreateIndex
CREATE UNIQUE INDEX "index_songs_on_slug" ON "songs"("slug");

-- CreateIndex
CREATE INDEX "index_songs_on_longest_gaps_data" ON "songs" USING GIN ("longest_gaps_data");

-- CreateIndex
CREATE INDEX "index_songs_on_yearly_play_data" ON "songs" USING GIN ("yearly_play_data");

-- CreateIndex
CREATE INDEX "index_taggings_on_context" ON "taggings"("context");

-- CreateIndex
CREATE INDEX "index_taggings_on_tag_id" ON "taggings"("tag_id");

-- CreateIndex
CREATE INDEX "index_taggings_on_taggable_id" ON "taggings"("taggable_id");

-- CreateIndex
CREATE INDEX "index_taggings_on_taggable_type" ON "taggings"("taggable_type");

-- CreateIndex
CREATE INDEX "index_taggings_on_taggable_type_and_taggable_id" ON "taggings"("taggable_type", "taggable_id");

-- CreateIndex
CREATE INDEX "index_taggings_on_tagger_id" ON "taggings"("tagger_id");

-- CreateIndex
CREATE INDEX "index_taggings_on_tagger_id_and_tagger_type" ON "taggings"("tagger_id", "tagger_type");

-- CreateIndex
CREATE INDEX "index_taggings_on_tagger_type_and_tagger_id" ON "taggings"("tagger_type", "tagger_id");

-- CreateIndex
CREATE INDEX "taggings_idy" ON "taggings"("taggable_id", "taggable_type", "tagger_id", "context");

-- CreateIndex
CREATE INDEX "taggings_taggable_context_idx" ON "taggings"("taggable_id", "taggable_type", "context");

-- CreateIndex
CREATE UNIQUE INDEX "taggings_idx" ON "taggings"("tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type");

-- CreateIndex
CREATE UNIQUE INDEX "index_tags_on_name" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "index_tracks_on_slug" ON "tracks"("slug");

-- CreateIndex
CREATE INDEX "index_tracks_on_likes_count" ON "tracks"("likes_count");

-- CreateIndex
CREATE INDEX "index_tracks_on_next_track_id" ON "tracks"("next_track_id");

-- CreateIndex
CREATE INDEX "index_tracks_on_previous_track_id" ON "tracks"("previous_track_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_email" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_reset_password_token" ON "users"("reset_password_token");

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_confirmation_token" ON "users"("confirmation_token");

-- CreateIndex
CREATE UNIQUE INDEX "index_users_on_username" ON "users"("username");

-- CreateIndex
CREATE INDEX "index_users_roles_on_user_id_and_role_id" ON "users_roles"("user_id", "role_id");

-- CreateIndex
CREATE INDEX "index_venues_on_slug" ON "venues"("slug");

-- AddForeignKey
ALTER TABLE "annotations" ADD CONSTRAINT "fk_rails_31a9a82e68" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "fk_rails_2aac17a78c" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "fk_rails_77ad02f5c5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "fk_rails_829fc99162" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "fk_rails_03de2dc08c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "fk_rails_664ddb4807" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "fk_rails_d15744e438" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "fk_rails_1e09b5dabf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "fk_rails_a7dfeb9f5f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "fk_rails_74a66bd6c5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_photos" ADD CONSTRAINT "fk_rails_191cbe34d9" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_photos" ADD CONSTRAINT "fk_rails_5aafeab212" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "show_youtubes" ADD CONSTRAINT "fk_rails_ea4d9ca50c" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "fk_rails_62c0e1304d" FOREIGN KEY ("band_id") REFERENCES "bands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "fk_rails_ae9094c3e4" FOREIGN KEY ("venue_id") REFERENCES "venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "fk_rails_028deefde5" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "taggings" ADD CONSTRAINT "fk_rails_9fcd2e236b" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "fk_rails_9d5431146f" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "fk_rails_a41ea81c98" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
