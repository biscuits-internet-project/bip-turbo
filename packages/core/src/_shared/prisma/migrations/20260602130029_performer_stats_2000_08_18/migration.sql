-- Phase 3 performer backfill (generated from performer-backfill.json by
-- build-performer-migration.ts). Idempotent: shows resolved by slug, tracks by
-- (slug,set,position); every insert is ON CONFLICT DO NOTHING so re-applying
-- after a data resync is safe. Split across several migrations so each file is
-- editable; they apply in timestamp order.

-- 2000-08-18 (Electron billing): exclude from stats + recompute from that date.
UPDATE "shows" SET "count_for_stats" = false, "updated_at" = now()
WHERE "slug" = '2000-08-18-trocadero-philadelphia-pa' AND "count_for_stats" = true;

INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), '2000-08-18'
WHERE NOT EXISTS (SELECT 1 FROM "stats_recompute_requests" WHERE "since_date" = '2000-08-18');
