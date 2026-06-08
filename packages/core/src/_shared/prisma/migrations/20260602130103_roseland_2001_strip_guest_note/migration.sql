-- Guests (John Popper, Stanley Jordan, DJ Logic) are now structured track performers;
-- drop the redundant guest sentence from the show note, keep the Jammy Awards note.
UPDATE "shows"
SET "notes" = 'The 2nd annual Jammy Awards.', "updated_at" = now()
WHERE "slug" = '2001-06-28-roseland-ballroom-new-york-ny'
  AND "notes" = 'The 2nd annual Jammy Awards.  Entire set with John Popper of Blues Traveler on harmonica, Stanley Jordan on guitar, and DJ Logic on turntables.';
