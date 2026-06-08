-- 1999-12-07 Chris' Jazz Cafe was a Jon/Aron duo; Marc and Sam did not play.
-- Remove them from the recorded lineup (cascade clears their instruments) so
-- they surface as "without Marc Brownstein and Sam Altman".
DELETE FROM "show_musicians" sm
USING "shows" s, "musicians" mu
WHERE sm."show_id" = s."id" AND sm."musician_id" = mu."id"
  AND s."slug" = '1999-12-07-chris-jazz-cafe-philadelphia-pa'
  AND mu."slug" IN ('marc-brownstein', 'sam-altman');
