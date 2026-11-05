-- CreateTable
CREATE TABLE "api_keys" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "prefix" VARCHAR(16) NOT NULL,
    "key_hash" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(6),
    "revoked_at" TIMESTAMP(6),

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_key_hash_unique" ON "api_keys"("key_hash");

-- CreateIndex
CREATE INDEX "idx_api_keys_user_id" ON "api_keys"("user_id");

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "fk_api_keys_users_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
