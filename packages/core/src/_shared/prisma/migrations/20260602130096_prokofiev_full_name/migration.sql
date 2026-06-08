-- Use the composer's full name. Only "Peter's Theme" uses this author, so renaming
-- the existing row (rather than creating a duplicate) is safe.
UPDATE "authors"
SET "name" = 'Sergei Prokofiev', "slug" = 'sergei-prokofiev', "updated_at" = now()
WHERE "slug" = 'prokofiev';
