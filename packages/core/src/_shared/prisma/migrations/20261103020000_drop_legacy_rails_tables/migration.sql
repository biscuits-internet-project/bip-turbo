-- Drop tables left over from the Rails site that nothing reads or writes:
-- Rails framework bookkeeping (ar_internal_metadata, active_storage_*,
-- friendly_id_slugs, roles/users_roles), the audited-gem
-- edit history (audits), track tags since replaced by track_flags
-- (tags/taggings), youtubes (replaced by show_youtubes), a one-off profiling
-- table (memory_metrics), and two empty tables (likes, faq). None has been
-- written since the rewrite; no view, function, trigger or kept table refers
-- to them. Legacy content tables (favorites, comments, side_projects,
-- media_contents, show_photos) are deliberately kept, as is pg_search_documents,
-- which the shows-by-year search still reads.

-- DropForeignKey
ALTER TABLE "active_storage_attachments" DROP CONSTRAINT "fk_active_storage_attachments_active_storage_blobs_blob_id";

-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "fk_likes_users_user_id";

-- DropForeignKey
ALTER TABLE "taggings" DROP CONSTRAINT "fk_taggings_tags_tag_id";

-- DropForeignKey
ALTER TABLE "users_roles" DROP CONSTRAINT "users_roles_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users_roles" DROP CONSTRAINT "users_roles_user_id_fkey";

-- DropTable
DROP TABLE "active_storage_attachments";

-- DropTable
DROP TABLE "active_storage_blobs";

-- DropTable
DROP TABLE "ar_internal_metadata";

-- DropTable
DROP TABLE "audits";

-- DropTable
DROP TABLE "faq";

-- DropTable
DROP TABLE "friendly_id_slugs";

-- DropTable
DROP TABLE "likes";

-- DropTable
DROP TABLE "memory_metrics";

-- DropTable
DROP TABLE "roles";

-- DropTable
DROP TABLE "taggings";

-- DropTable
DROP TABLE "tags";

-- DropTable
DROP TABLE "users_roles";

-- DropTable
DROP TABLE "youtubes";

