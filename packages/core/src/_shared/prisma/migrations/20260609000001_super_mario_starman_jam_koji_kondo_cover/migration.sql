-- "Super Mario Starman Jam" is a cover of Koji Kondo's Super Mario Bros. Star
-- (invincibility) theme, not an improvisation or a Nintendo-credited original.
-- An earlier pass set the author by the wrong song slug
-- (super-mario-bros-overworld-theme) and 20260608000000 swept this slug into the
-- improvisation list, so on its own it would render no debut footnote. Set the
-- author to Koji Kondo and the kind to 'cover' so the debut footnote reads
-- "(Koji Kondo)".

-- Koji Kondo already exists (created by 20260602130065_super_mario_author, which
-- sorts earlier); insert defensively in case that path is absent. authors.slug is
-- NOT unique, so guard with WHERE NOT EXISTS rather than ON CONFLICT.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT 'Koji Kondo', 'koji-kondo', now(), now()
WHERE NOT EXISTS (SELECT 1 FROM "authors" WHERE "slug" = 'koji-kondo');

UPDATE "songs"
SET "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'koji-kondo'),
    "kind" = 'cover',
    "updated_at" = now()
WHERE "slug" = 'super-mario-starman-jam'
  AND ("kind" IS DISTINCT FROM 'cover'
       OR "author_id" IS DISTINCT FROM (SELECT "id" FROM "authors" WHERE "slug" = 'koji-kondo'));

-- 2007-02-15 Starland Ballroom (the debut) carried hand-written debut footnotes
-- that the auto debut-footnote engine now composes from Song.kind/author. Remove
-- the manual "FTP (Koji Kondo)" (super-mario-starman-jam, now auto-derived from
-- the cover attribution) and the stale "FTP (tDB original)" (moshi-fameus-jam, an
-- improvisation, which emits no debut footnote). Scoped per-show by exact desc.
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2007-02-15-starland-ballroom-sayreville-nj'
  AND a."desc" IN (
    'FTP (Koji Kondo)',
    'FTP (tDB original)'
  );

-- Refresh the caches that bake the debut footnote: changing kind/author from
-- improvisation to a Koji Kondo cover makes 2007-02-15 gain a "(Koji Kondo)"
-- debut footnote. Queue a recompute from the debut date so the deploy's
-- recompute-pending run busts the affected show/setlist/song caches immediately
-- rather than waiting out the 24h TTL. Constant date (no aggregate), so the
-- WHERE NOT EXISTS dedup is safe.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), '2007-02-15'
WHERE NOT EXISTS (SELECT 1 FROM "stats_recompute_requests" WHERE "since_date" = '2007-02-15');
