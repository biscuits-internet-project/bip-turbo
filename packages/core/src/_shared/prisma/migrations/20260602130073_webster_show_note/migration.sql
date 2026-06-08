-- The Tom Hamilton / Chris Michetti guitar + Jon-on-MIDI lineup caveat is now
-- structured performer data, so trim the show note to the opener.
UPDATE "shows"
SET "notes" = 'The Indobox opened.', "updated_at" = now()
WHERE "slug" = '2010-04-25-webster-theater-hartford-ct'
  AND "notes" = 'The Indobox opened, entire show with Tom Hamilton and Chris Michetti on guitar and Jon on MIDI.';
