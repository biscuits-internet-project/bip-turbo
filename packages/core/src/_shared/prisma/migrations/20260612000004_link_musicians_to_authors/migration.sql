-- Auto-link musicians to authors by matching slug (covers the core members).
UPDATE "musicians" m
SET "author_id" = a."id", "updated_at" = now()
FROM "authors" a
WHERE a."slug" = m."slug" AND m."author_id" IS NULL;
