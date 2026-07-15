-- Correct the metadata on the mashups that credit the generic band author
-- ("The Disco Biscuits") instead of the member who wrote the Biscuits-side
-- component. A mashup's authors are the concatenation of its component songs'
-- author lists, in the order the components appear in the title, deduped; each
-- component contributes its credit verbatim, so a component crediting a member
-- yields that member and a component crediting the band yields the band.
--
-- Everything matches by slug and author name. Row ids are assigned per
-- environment and differ between the local prod-restore and prod, and an
-- id-keyed WHERE that misses fails SILENTLY (0 rows, no error) — the bug that
-- made 20260604000000_song_kind deploy "successfully" but wrong.

-- 1. Ensure every author exists so a from-scratch replay can't miss a join.
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT v.name, v.slug, now(), now()
FROM (VALUES
    ('Marc Brownstein', 'marc-brownstein'),
    ('Aron Magner', 'aron-magner'),
    ('Jon Gutwillig', 'jon-gutwillig'),
    ('Joey Friedman', 'joey-friedman'),
    ('Dean Turnley', 'dean-turnley'),
    ('Daft Punk', 'daft-punk'),
    ('The Disco Biscuits', 'the-disco-biscuits')
) AS v(name, slug)
WHERE NOT EXISTS (SELECT 1 FROM "authors" a WHERE a."name" = v.name);

-- 2. "Caves of the East x Something About Us" was filed as a cover and entered
-- with minor words capitalized. Title-case matches its component song ("Caves of
-- the East") and the rules in 20260413225404_fix_song_title_casing. The slug is
-- already correct and stays untouched so existing links keep working.
-- 20260715000001 refreshes this song's search_text, which the trigger cannot do
-- on a rename.
UPDATE "songs"
SET "kind" = 'mashup',
    "title" = 'Caves of the East x Something About Us',
    "updated_at" = now()
WHERE "slug" = 'caves-of-the-east-x-something-about-us';

-- 3. "Falling 303" sits at a slug that misspells an unrelated mashup, so
-- /songs/falling-303 404s while /songs/dino-bany-x-b-o-t-a serves the song. The
-- title guard prevents renaming the wrong row; the NOT EXISTS guard keeps a
-- replay off the unique slug index.
UPDATE "songs"
SET "slug" = 'falling-303',
    "updated_at" = now()
WHERE "slug" = 'dino-bany-x-b-o-t-a'
  AND "title" = 'Falling 303'
  AND NOT EXISTS (SELECT 1 FROM "songs" other WHERE other."slug" = 'falling-303');

-- 4. Replace the author set for each mashup that credited the band in place of
-- the component's writer.
DELETE FROM "song_authors"
WHERE "song_id" IN (
    SELECT "id" FROM "songs" WHERE "slug" IN (
        'caves-of-the-east-x-something-about-us',
        'konkrete-x-floodlights',
        'actin-tough-x-neck-romancer',
        'tourists-rocket-ship-x-on-time'
    )
);

INSERT INTO "song_authors" ("song_id", "author_id", "position", "created_at", "updated_at")
SELECT s."id", a."id", m.pos, now(), now()
FROM (VALUES
    -- Caves of the East (Marc Brownstein) x Something About Us (Daft Punk)
    ('caves-of-the-east-x-something-about-us', 'Marc Brownstein', 0),
    ('caves-of-the-east-x-something-about-us', 'Daft Punk', 1),
    -- Konkrete (Jon Gutwillig) x Floodlights (Marc Brownstein)
    ('konkrete-x-floodlights', 'Jon Gutwillig', 0),
    ('konkrete-x-floodlights', 'Marc Brownstein', 1),
    -- Actin' Tough (Dean Turnley) x Neck Romancer (Aron Magner)
    ('actin-tough-x-neck-romancer', 'Dean Turnley', 0),
    ('actin-tough-x-neck-romancer', 'Aron Magner', 1),
    -- Tourists (Rocket Ship) (Aron Magner, Joey Friedman, Jon Gutwillig) x On Time (The Disco Biscuits)
    ('tourists-rocket-ship-x-on-time', 'Aron Magner', 0),
    ('tourists-rocket-ship-x-on-time', 'Joey Friedman', 1),
    ('tourists-rocket-ship-x-on-time', 'Jon Gutwillig', 2),
    ('tourists-rocket-ship-x-on-time', 'The Disco Biscuits', 3)
) AS m(song_slug, author_name, pos)
JOIN "songs" s ON s."slug" = m.song_slug
JOIN LATERAL (SELECT "id" FROM "authors" WHERE "name" = m.author_name ORDER BY "created_at" LIMIT 1) a ON true;

-- 5. Refresh the caches that bake in song kind, title, and authors. The deploy's
-- recompute-pending run calls invalidateSongCaches() + invalidateShowListings(),
-- busting songs:index:full, songs:filtered:*, and the per-show show:*:data:*
-- payloads (24h TTL) that carry the kind-derived debut footnote. HAVING (not
-- WHERE ... NOT EXISTS) so this inserts zero rows, not a NULL row, when a request
-- for the earliest date already exists.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN("date")::date
FROM "shows"
WHERE "date" IS NOT NULL
HAVING MIN("date") IS NOT NULL
   AND MIN("date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests" WHERE "since_date" IS NOT NULL);
