-- "Moshi Moshi Jam" is an Aron Magner + Sam Altman keys/drums jam: on every
-- performance, the rest of the band sits out. Marc Brownstein and Jon Gutwillig
-- are the standard lineup members to remove; insert a present=false delta for
-- each on every Moshi Moshi Jam track. Joined through show_musicians so a delta
-- is only written when the member is actually in that show's lineup (no spurious
-- "absent" rows for a show they never played). Set-based and idempotent; leaves
-- any guest sit-in deltas untouched.
INSERT INTO "track_musicians" ("track_id", "musician_id", "present", "updated_at")
SELECT t."id", sm."musician_id", false, now()
FROM "tracks" t
JOIN "songs" so ON so."id" = t."song_id"
JOIN "show_musicians" sm ON sm."show_id" = t."show_id"
JOIN "musicians" mu ON mu."id" = sm."musician_id"
WHERE so."slug" = 'moshi-moshi-jam'
  AND mu."slug" IN ('marc-brownstein', 'jon-gutwillig')
ON CONFLICT ("track_id", "musician_id") DO NOTHING;
