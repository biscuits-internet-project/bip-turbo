-- Use the composer's full name. Only "In the Hall of the Mountain King" uses this
-- author, so renaming the existing row (rather than creating a duplicate) is safe.
UPDATE "authors"
SET "name" = 'Edvard Grieg', "slug" = 'edvard-grieg', "updated_at" = now()
WHERE "slug" = 'grieg';
