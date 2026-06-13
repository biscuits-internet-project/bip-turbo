-- Set Jake Brownstein's default instrument to guitar and his "known from" to Eggy.
-- Match by stable slugs; resolve the instrument FK via a slug subquery.
UPDATE "musicians"
SET "known_from" = 'Eggy',
    "default_instrument_id" = (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'),
    "updated_at" = now()
WHERE "slug" = 'jake-brownstein';

-- Bust the musician profile cache at deploy time. The recompute drain calls
-- invalidateSongCaches, which delPatterns CacheKeys.musicians.allPages
-- (musician:*:data:*) -- the only cache-clear lever a prod migration has. The
-- since_date is after the latest show, so the gaps/song-stats rebuild is a no-op
-- and only the cache bust runs.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), '2026-06-13'
WHERE NOT EXISTS (SELECT 1 FROM "stats_recompute_requests" WHERE "since_date" = '2026-06-13');
