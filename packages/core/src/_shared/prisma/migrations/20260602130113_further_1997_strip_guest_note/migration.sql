-- Johnny Zula's whole-show percussion sit-in is now structured; drop the guest
-- sentence from the show note, keep the Juggling Suns billing.
UPDATE "shows"
SET "notes" = 'Opening for Juggling Suns.', "updated_at" = now()
WHERE "slug" = '1997-06-28-e-stage-further-festival-sony-entertainment-center-camden-nj'
  AND "notes" = 'Opening for Juggling Suns . Whole show with Johnny Zula on percussion';
