-- Repair: restore the Bill Kreutzmann (drums) + Mickey Hart (percussion) whole-set
-- sit-ins that exist locally but never landed on prod.
--
-- Root cause: the original sit-in INSERTs live in 20260602130028_performer_track_deltas
-- (timestamp June 2), but those two musicians are first seeded in
-- 20260605000000_performer_paren_guest_sitins (June 5). On prod, migrations apply
-- once in strict timestamp order, so on June 2 `INSERT ... SELECT ... JOIN musicians
-- mu WHERE mu.slug='bill-kreutzmann'` matched zero rows (the musician did not exist
-- yet) and silently inserted nothing. Locally the data only landed because the
-- backfill re-ran 130028 (via the re-stamp workflow) after the June-5 seed applied.
--
-- This forward migration re-applies the sit-ins now that the musicians exist and
-- positions are settled, so it matches on prod and is a no-op on local.
-- Idempotent via ON CONFLICT. The free-text show notes already describe these
-- stints and are intentionally left untouched.
--
-- Scope (from the show notes + local data):
--   2015-04-17 Red Rocks — entire Set 2 (S2); the encore had only Tom Hamilton (already on prod).
--   2014-07-31 9:30 Club — entire Set 2 (S2) and the encore (E1).

INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2'
  AND mu."slug" IN ('bill-kreutzmann', 'mickey-hart')
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", mu."id", true, now()
FROM "tracks" t JOIN "shows" s ON s."id" = t."show_id", "musicians" mu
WHERE s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" IN ('S2', 'E1')
  AND mu."slug" IN ('bill-kreutzmann', 'mickey-hart')
ON CONFLICT ("track_id", "musician_id") DO NOTHING;

-- Instruments: Kreutzmann on drums, Hart on percussion.
INSERT INTO "track_musician_instruments" ("track_musician_id", "instrument_id", "updated_at")
SELECT tm."id", i."id", now()
FROM "track_musicians" tm
  JOIN "tracks" t ON t."id" = tm."track_id"
  JOIN "shows" s ON s."id" = t."show_id"
  JOIN "musicians" mu ON mu."id" = tm."musician_id"
  JOIN "instruments" i ON i."slug" = (CASE mu."slug" WHEN 'bill-kreutzmann' THEN 'drums' ELSE 'percussion' END)
WHERE mu."slug" IN ('bill-kreutzmann', 'mickey-hart')
  AND (
    (s."slug" = '2015-04-17-red-rocks-amphitheater-morrison-co' AND t."set" = 'S2')
    OR (s."slug" = '2014-07-31-9-30-club-washington-dc' AND t."set" IN ('S2', 'E1'))
  )
ON CONFLICT ("track_musician_id", "instrument_id") DO NOTHING;
