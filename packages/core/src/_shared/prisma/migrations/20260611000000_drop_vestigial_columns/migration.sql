-- Drop vestigial columns surfaced by a full per-table audit. Each is either
-- dead (no code refs), superseded (cover -> kind, legacy_author -> author_id),
-- or consumed only by the MCP emission (least_common_year). Reviews.likes_count
-- was a denormalized count nothing maintained or read; dropping the column also
-- drops its index.
ALTER TABLE "songs"   DROP COLUMN IF EXISTS "cover";
ALTER TABLE "songs"   DROP COLUMN IF EXISTS "legacy_abbr";
ALTER TABLE "songs"   DROP COLUMN IF EXISTS "legacy_id";
ALTER TABLE "songs"   DROP COLUMN IF EXISTS "legacy_author";
ALTER TABLE "songs"   DROP COLUMN IF EXISTS "least_common_year";
ALTER TABLE "shows"   DROP COLUMN IF EXISTS "legacy_id";
ALTER TABLE "bands"   DROP COLUMN IF EXISTS "legacy_id";
ALTER TABLE "venues"  DROP COLUMN IF EXISTS "legacy_id";
ALTER TABLE "reviews" DROP COLUMN IF EXISTS "likes_count";
