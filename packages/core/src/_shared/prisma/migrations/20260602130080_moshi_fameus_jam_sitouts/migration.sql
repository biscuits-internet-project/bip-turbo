-- "Moshi/Fameus Jam" is an Allen Aucoin + Aron Magner side-project jam: on every
-- performance, every OTHER lineup member sits out. Insert a present=false delta
-- for each show-lineup member (other than Allen/Aron) on each Moshi/Fameus Jam
-- track. Set-based so it adapts to each show's actual lineup; idempotent.
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", sm."musician_id", false, now()
FROM "tracks" t
JOIN "songs" so ON so."id" = t."song_id"
JOIN "show_musicians" sm ON sm."show_id" = t."show_id"
JOIN "musicians" mu ON mu."id" = sm."musician_id"
WHERE so."slug" = 'moshi-fameus-jam'
  AND mu."slug" NOT IN ('allen-aucoin', 'aron-magner')
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
