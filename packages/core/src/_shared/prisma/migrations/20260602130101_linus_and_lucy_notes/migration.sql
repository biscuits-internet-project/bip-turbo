-- Add origin note: this piece is the theme to "Peanuts".
UPDATE "songs"
SET "notes" = 'Theme to ‘Peanuts’', "updated_at" = now()
WHERE "slug" = 'linus-and-lucy';
