-- DJ Mauricio (musician) and Mauricio Zuniga (author) are the same person, but
-- their slugs differ so the slug-match auto-link missed them. Link explicitly.
UPDATE "musicians"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'mauricio-zuniga' LIMIT 1),
    "updated_at" = now()
WHERE "slug" = 'dj-mauricio' AND "author_id" IS NULL;
