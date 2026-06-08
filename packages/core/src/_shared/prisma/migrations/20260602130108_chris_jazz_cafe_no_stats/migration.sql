-- Exclude the 1999-12-07 Chris' Jazz Cafe show from statistics.
UPDATE "shows"
SET "count_for_stats" = false, "updated_at" = now()
WHERE "slug" = '1999-12-07-chris-jazz-cafe-philadelphia-pa';
