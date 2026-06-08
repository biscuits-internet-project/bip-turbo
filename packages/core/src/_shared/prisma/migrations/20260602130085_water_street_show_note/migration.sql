-- Clear the show note (Shawn Hennessey lineup caveat).
UPDATE "shows"
SET "notes" = '', "updated_at" = now()
WHERE "slug" = '2006-11-02-water-street-music-hall-rochester-ny'
  AND "notes" = 'With Shawn Hennessey on percussion';
