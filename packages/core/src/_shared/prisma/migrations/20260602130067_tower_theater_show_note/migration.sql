-- The "Sam Altman on drums unless noted otherwise" lineup caveat is structured
-- performer data, so trim it from the show note, leaving the Marty Party detail.
UPDATE "shows"
SET "notes" = 'Marty party opened and played both setbreaks.', "updated_at" = now()
WHERE "slug" = '2010-12-31-tower-theater-upper-darby-pa'
  AND "notes" = 'Marty party opened and played both setbreaks. Sam Altman on drums unless noted otherwise.';
