-- 2014-08-01-9-30-club-washington-dc — S2.3 Spraypaint is an inverted version.
-- The other inverted tracks on this show (Abraxas, Bombs, The Great Abyss) were
-- already flagged INVERTED; Spraypaint was missed and still carries the manual
-- "Last Time Inverted 12/6/06 (420 shows)" annotation. Replace the prose with the
-- structured INVERTED flag — the recurrence engine regenerates the equivalent
-- "last time inverted" footnote from the flag.
--
-- Idempotent: the track is resolved by (show slug, set, position); the flag
-- insert is ON CONFLICT DO NOTHING; the annotation DELETE is scoped to that exact
-- track and text (btrim guards trailing/double whitespace). Replay after any prod
-- sync that resurrects the annotation.

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2014-08-01-9-30-club-washington-dc'
  AND t."set" = 'S2' AND t."position" = 3
  AND btrim(a."desc") = 'Last Time Inverted 12/6/06 (420 shows)';

INSERT INTO "track_flags" ("track_id", "flag", "updated_at")
SELECT t."id", 'INVERTED'::track_flag, now() FROM "tracks" t
JOIN "shows" s ON s."id" = t."show_id"
WHERE s."slug" = '2014-08-01-9-30-club-washington-dc' AND t."set" = 'S2' AND t."position" = 3
ON CONFLICT ("track_id", "flag") DO NOTHING;

-- Recompute recurrence for Spraypaint from its earliest performance so the
-- INVERTED flag's gap / previous-show columns populate. HAVING dedups against
-- already-queued dates (a NULL MIN would otherwise insert a NOT-NULL-violating row).
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN(s."date")::date
FROM "shows" s
JOIN "tracks" t ON t."show_id" = s."id"
JOIN "songs" so ON so."id" = t."song_id"
WHERE so."slug" = 'spraypaint' AND s."date" IS NOT NULL
HAVING MIN(s."date")::date IS NOT NULL
   AND MIN(s."date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests");
