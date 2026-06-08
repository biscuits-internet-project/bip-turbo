-- Display the Roland MC-505 groovebox with its proper product name.
UPDATE "instruments"
SET "name" = 'Roland MC-505', "updated_at" = now()
WHERE "slug" = 'roland-mc-505';
