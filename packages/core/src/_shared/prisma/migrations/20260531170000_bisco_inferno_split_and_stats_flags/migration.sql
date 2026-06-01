-- Mark VIP / side-project / streaming performances as not counting toward stats,
-- and split two shows whose first set was a separate VIP performance into their
-- own pre-show: Bisco Inferno (Red Rocks 2021-05-30) and Trance Atlantic (Harpa
-- 2023-05-22).
--
-- Written to be idempotent: every step is a no-op when the DB is already in the
-- post-state, so re-applying (e.g. after a data resync that rewinds the rows but
-- not the migration history) is safe. Shows are addressed by slug rather than by
-- hardcoded id so a resync that regenerates ids doesn't break the migration.

-- 1. Shows that should not count toward stats. Setting false-on-false is a no-op.
UPDATE "shows"
SET "count_for_stats" = false, "updated_at" = now()
WHERE "count_for_stats" = true
  AND "slug" IN (
    '2017-07-12-montage-mountain-scranton-pa',
    '2018-07-11-the-pavilion-at-montage-mountain-scranton-pa',
    '2019-12-28-sony-hall-new-york-ny',
    '2019-10-04-10-mile-music-hall-frisco-colorado',
    '2019-10-03-10-mile-music-hall-frisco-colorado',
    '2021-04-20-ardmore-music-hall-ardmore-pa'
  );

-- 2. Split Bisco Inferno (Red Rocks 2021-05-30). The VIP afternoon show holds the
-- original Set 1; the evening show keeps the original Sets 2 and 3 (relabeled to 1
-- and 2) plus the encore. Track ids are unchanged, so within-set previous/next
-- links and segues stay valid (no link crosses a set boundary). Gated on the VIP
-- show not existing, so the whole block runs exactly once.
DO $$
DECLARE
  v_orig uuid;
  v_new  uuid;
BEGIN
  SELECT "id" INTO v_orig FROM "shows"
  WHERE "slug" = '2021-05-30-red-rocks-amphitheater-morrison-co';

  IF v_orig IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM "shows" WHERE "slug" = '2021-05-30-red-rocks-amphitheater-morrison-co-vip-afternoon')
  THEN
    INSERT INTO "shows" (
      "slug", "date", "venue_id", "band_id", "notes",
      "count_for_stats", "day_order",
      "likes_count", "show_photos_count", "show_youtubes_count", "reviews_count", "ratings_count",
      "created_at", "updated_at"
    )
    SELECT
      '2021-05-30-red-rocks-amphitheater-morrison-co-vip-afternoon',
      s."date", s."venue_id", s."band_id",
      'Bisco Inferno VIP Afternoon set',
      false, 1,
      0, 0, 0, 0, 0,
      now(), now()
    FROM "shows" s
    WHERE s."id" = v_orig
    RETURNING "id" INTO v_new;

    -- Move the original Set 1 onto the afternoon show (stays Set 1 there).
    UPDATE "tracks" SET "show_id" = v_new, "updated_at" = now()
    WHERE "show_id" = v_orig AND "set" = 'S1';

    -- Relabel the evening show: Set 2 -> Set 1, then Set 3 -> Set 2 (encore as-is).
    UPDATE "tracks" SET "set" = 'S1', "updated_at" = now()
    WHERE "show_id" = v_orig AND "set" = 'S2';
    UPDATE "tracks" SET "set" = 'S2', "updated_at" = now()
    WHERE "show_id" = v_orig AND "set" = 'S3';

    -- Order the evening show after the afternoon show and clean up its note.
    UPDATE "shows" SET "day_order" = 2, "notes" = 'Bisco Inferno', "updated_at" = now()
    WHERE "id" = v_orig;
  END IF;
END $$;

-- 3. Split Trance Atlantic (Harpa 2023-05-22), same shape: original Set 1 becomes a
-- VIP show ordered first; the main show keeps Sets 2 and 3 (relabeled to 1 and 2)
-- plus the encore. Gated identically on the VIP show not existing.
DO $$
DECLARE
  v_orig uuid;
  v_new  uuid;
BEGIN
  SELECT "id" INTO v_orig FROM "shows"
  WHERE "slug" = '2023-05-22-harpa-concert-hall-reykjavik';

  IF v_orig IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM "shows" WHERE "slug" = '2023-05-22-harpa-concert-hall-reykjavik-vip-set')
  THEN
    INSERT INTO "shows" (
      "slug", "date", "venue_id", "band_id", "notes",
      "count_for_stats", "day_order",
      "likes_count", "show_photos_count", "show_youtubes_count", "reviews_count", "ratings_count",
      "created_at", "updated_at"
    )
    SELECT
      '2023-05-22-harpa-concert-hall-reykjavik-vip-set',
      s."date", s."venue_id", s."band_id",
      E'Trance Atlantic — \r\nVIP set',
      false, 1,
      0, 0, 0, 0, 0,
      now(), now()
    FROM "shows" s
    WHERE s."id" = v_orig
    RETURNING "id" INTO v_new;

    UPDATE "tracks" SET "show_id" = v_new, "updated_at" = now()
    WHERE "show_id" = v_orig AND "set" = 'S1';

    UPDATE "tracks" SET "set" = 'S1', "updated_at" = now()
    WHERE "show_id" = v_orig AND "set" = 'S2';
    UPDATE "tracks" SET "set" = 'S2', "updated_at" = now()
    WHERE "show_id" = v_orig AND "set" = 'S3';

    UPDATE "shows"
    SET "day_order" = 2, "notes" = E'Trance Atlantic — \r\n\r\nKarina Rykman opened <br>', "updated_at" = now()
    WHERE "id" = v_orig;
  END IF;
END $$;

-- 4. Order the 2019-07-18 Montage Mountain pair: the VIP Soundcheck (afternoon,
-- not-for-stats) sorts before the main Camp Bisco 17 show. Both rows have a NULL
-- day_order, so they fall back to the id tiebreaker and order arbitrarily.
-- Setting the same values on re-run is a no-op, so this is idempotent.
UPDATE "shows" SET "day_order" = 1, "updated_at" = now()
WHERE "slug" = '2019-07-18-montage-mountain-scranton-pa-2';
UPDATE "shows" SET "day_order" = 2, "updated_at" = now()
WHERE "slug" = '2019-07-18-montage-mountain-scranton-pa';

-- 5. Queue a stats recompute from the earliest affected date so Track.gap and the
-- Song.* aggregates rebuild on deploy (scripts/recompute-pending.ts drains it).
-- Guarded so re-applying doesn't stack duplicate rows for the same date.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), '2017-07-12'
WHERE NOT EXISTS (
  SELECT 1 FROM "stats_recompute_requests" WHERE "since_date" = '2017-07-12'
);
