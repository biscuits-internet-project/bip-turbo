-- The Tom Hamilton / Chris Michetti whole-show-guitar caveat is now structured
-- performer data (lineup + per-track sat-outs), so trim the show note to the openers.
UPDATE "shows"
SET "notes" = 'Dj Wyllys and Eclectic Method opened.', "updated_at" = now()
WHERE "slug" = '2010-05-08-wellmont-theater-montclair-nj'
  AND "notes" = 'Dj Wyllys and Eclectic Method opened, with Tom Hamilton and Chris Michetti on guitar for whole show (except Spacebird>Spraypaint and Basis)';
