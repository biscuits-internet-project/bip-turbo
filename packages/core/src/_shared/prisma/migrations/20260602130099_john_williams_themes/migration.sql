-- Star Wars / Indiana Jones / Superman themes are covers by John Williams.
UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'john-williams'),
    "updated_at" = now()
WHERE "slug" IN ('star-wars-theme', 'indiana-jones-theme', 'superman-theme');
