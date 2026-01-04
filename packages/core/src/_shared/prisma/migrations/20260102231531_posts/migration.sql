-- CreateTable
CREATE TABLE "posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "parent_id" UUID,
    "quoted_post_id" UUID,
    "quoted_content_snapshot" VARCHAR(1000),
    "media_url" VARCHAR,
    "media_type" VARCHAR,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "edited_at" TIMESTAMP(6),
    "reply_count" INTEGER NOT NULL DEFAULT 0,
    "reaction_count" INTEGER NOT NULL DEFAULT 0,
    "flag_count" INTEGER NOT NULL DEFAULT 0,
    "moderation_status" VARCHAR NOT NULL DEFAULT 'clean',
    "moderated_at" TIMESTAMP(6),
    "moderated_by" UUID,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "emoji_code" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "type" VARCHAR NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content_flags" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "reason" VARCHAR NOT NULL,
    "description" TEXT,
    "status" VARCHAR NOT NULL DEFAULT 'pending',
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "content_flags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posts_user_id_idx" ON "posts"("user_id");

-- CreateIndex
CREATE INDEX "posts_parent_id_idx" ON "posts"("parent_id");

-- CreateIndex
CREATE INDEX "posts_quoted_post_id_idx" ON "posts"("quoted_post_id");

-- CreateIndex
CREATE INDEX "posts_created_at_idx" ON "posts"("created_at");

-- CreateIndex
CREATE INDEX "posts_reaction_count_idx" ON "posts"("reaction_count");

-- CreateIndex
CREATE INDEX "posts_reply_count_idx" ON "posts"("reply_count");

-- CreateIndex
CREATE INDEX "posts_is_deleted_idx" ON "posts"("is_deleted");

-- CreateIndex
CREATE INDEX "posts_moderation_status_idx" ON "posts"("moderation_status");

-- CreateIndex
CREATE INDEX "posts_flag_count_idx" ON "posts"("flag_count");

-- CreateIndex
CREATE INDEX "reactions_post_id_idx" ON "reactions"("post_id");

-- CreateIndex
CREATE INDEX "reactions_user_id_idx" ON "reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_post_id_user_id_emoji_code_unique" ON "reactions"("post_id", "user_id", "emoji_code");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_idx" ON "notifications"("user_id", "read");

-- CreateIndex
CREATE INDEX "notifications_actor_id_idx" ON "notifications"("actor_id");

-- CreateIndex
CREATE INDEX "notifications_post_id_idx" ON "notifications"("post_id");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "notifications"("created_at");

-- CreateIndex
CREATE INDEX "content_flags_post_id_idx" ON "content_flags"("post_id");

-- CreateIndex
CREATE INDEX "content_flags_user_id_idx" ON "content_flags"("user_id");

-- CreateIndex
CREATE INDEX "content_flags_status_idx" ON "content_flags"("status");

-- CreateIndex
CREATE INDEX "content_flags_created_at_idx" ON "content_flags"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "content_flags_post_id_user_id_unique" ON "content_flags"("post_id", "user_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk_posts_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk_posts_users_moderated_by" FOREIGN KEY ("moderated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk_posts_posts_parent_id" FOREIGN KEY ("parent_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk_posts_posts_quoted_post_id" FOREIGN KEY ("quoted_post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "fk_reactions_posts_post_id" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "fk_reactions_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_users_actor_id" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_posts_post_id" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_flags" ADD CONSTRAINT "fk_content_flags_posts_post_id" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_flags" ADD CONSTRAINT "fk_content_flags_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "content_flags" ADD CONSTRAINT "fk_content_flags_users_reviewed_by" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
