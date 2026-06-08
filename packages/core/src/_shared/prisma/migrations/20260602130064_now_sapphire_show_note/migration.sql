-- Tom Hamilton's whole-set guest spot is structured performer data, so trim the
-- show note down to just the Holidaze festival label.
UPDATE "shows"
SET "notes" = 'Holidaze', "updated_at" = now()
WHERE "slug" = '2018-12-13-now-sapphire-resort-puerto-morelos'
  AND "notes" = 'Holidaze  -  Tom Hamilton on Guitar for the whole set';
