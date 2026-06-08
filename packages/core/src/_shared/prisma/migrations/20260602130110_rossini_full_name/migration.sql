-- Display the composer's full name.
UPDATE "authors"
SET "name" = 'Gioachino Rossini', "updated_at" = now()
WHERE "slug" = 'rossini';
