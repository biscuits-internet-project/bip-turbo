-- Add origin note: this piece is the theme to "Alfred Hitchcock Presents".
UPDATE "songs"
SET "notes" = 'Theme to ‘Alfred Hitchcock Presents’', "updated_at" = now()
WHERE "slug" = 'funeral-march-of-a-marionette';
