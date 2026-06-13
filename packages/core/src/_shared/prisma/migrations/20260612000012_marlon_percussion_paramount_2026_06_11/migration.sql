-- 2026-06-11 The Paramount (Huntington, NY): Marlon Lewis sat in on percussion
-- alongside Sam Altman's drum sit-in for the Basis -> I-Man -> Basis run. Add a
-- per-track Marlon-on-percussion delta to every track where Sam plays drums
-- (resolved by slug, so it tracks the actual data rather than hardcoded
-- positions), and drop the now-redundant free-text note describing the sit-in.

-- Marlon Lewis on percussion for every track where Sam Altman is on drums
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT DISTINCT t."id", mar."id", true, now()
FROM "tracks" t
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "track_musicians" tm_sam ON tm_sam."track_id" = t."id"
  JOIN "musicians" sam ON sam."id" = tm_sam."musician_id" AND sam."slug" = 'sam-altman'
  JOIN "track_musician_instruments" tmi ON tmi."track_musician_id" = tm_sam."id"
  JOIN "instruments" drums ON drums."id" = tmi."instrument_id" AND drums."slug" = 'drums'
  CROSS JOIN "musicians" mar
WHERE s."slug" = '2026-06-11-the-paramount-huntington-ny' AND mar."slug" = 'marlon-lewis'
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", perc."id", now()
FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mar ON mar."id" = tm."musician_id" AND mar."slug" = 'marlon-lewis'
  JOIN "instruments" perc ON perc."slug" = 'percussion'
WHERE s."slug" = '2026-06-11-the-paramount-huntington-ny'
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;

-- Drop the redundant Sam-on-drums sit-in note now that it is structured data
UPDATE "shows"
SET "notes" = 'Summer Tour Opener', "updated_at" = now()
WHERE "slug" = '2026-06-11-the-paramount-huntington-ny'
  AND "notes" LIKE '%Sam Altman on drums for Basis%';

-- Recompute stats from this show's date forward at deploy time. The recompute
-- drains the queue and busts the show/listing/song caches (invalidateShowListings
-- clears CacheKeys.show.allData), which is the only cache-clear lever prod has.
-- since_date is the most recent show date, so the rebuild scope is just this show.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), '2026-06-11'
WHERE NOT EXISTS (SELECT 1 FROM "stats_recompute_requests" WHERE "since_date" = '2026-06-11');
