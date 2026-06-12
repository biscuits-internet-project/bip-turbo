-- Cover-author audit: set ordered authors [performing act, then writers] for the >2-play covers.
-- Generated from cover-author-audit.md. Matches authors by name; creates missing authors by slug.

-- 1. Ensure every author exists (existing rows skipped by name).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT v.name, v.slug, now(), now()
FROM (VALUES
    ('JM2', 'jm2'),
    ('Marc Brownstein', 'marc-brownstein'),
    ('Jon Gutwillig', 'jon-gutwillig'),
    ('Jamie Shields', 'jamie-shields'),
    ('Mike Greenfield', 'mike-greenfield'),
    ('Conspirator', 'conspirator'),
    ('Aron Magner', 'aron-magner'),
    ('The Join', 'the-join'),
    ('Darren Shearer', 'darren-shearer'),
    ('Hallucinogen', 'hallucinogen'),
    ('Simon Posford', 'simon-posford'),
    ('Sausage', 'sausage'),
    ('Les Claypool', 'les-claypool'),
    ('Jay Lane', 'jay-lane'),
    ('Todd Huth', 'todd-huth'),
    ('Grateful Dead', 'grateful-dead'),
    ('Martha and The Vandellas', 'martha-and-the-vandellas'),
    ('Solomon Burke', 'solomon-burke'),
    ('Sam & Dave', 'sam-dave'),
    ('Donna Summer', 'donna-summer'),
    ('Survivor', 'survivor')
) AS v(name, slug)
WHERE NOT EXISTS (SELECT 1 FROM "authors" a WHERE a."name" = v.name);

-- 2. Replace the author set for each audited song.
DELETE FROM "song_authors" WHERE "song_id" IN (SELECT "id" FROM "songs" WHERE "slug" IN ('cyclone', 'tempest', 'orch-theme', 'boom-shanker', 'liquid-handcuffs', 'commercial-amen', 'denmark-massive', 'gamma-goblins', 'solstice', 'riddles-are-abound-tonight', 'eyes-of-the-world', 'shakedown-street', 'west-l-a-fadeaway', 'and-we-bid-you-goodnight', 'going-down-the-road-feeling-bad', 'dancing-in-the-street', 'everybody-needs-somebody-to-love', 'soul-man', 'i-feel-love', 'eye-of-the-tiger'));

INSERT INTO "song_authors" ("song_id", "author_id", "position", "created_at", "updated_at")
SELECT s."id", a."id", m.pos, now(), now()
FROM (VALUES
    ('cyclone', 'JM2', 0),
    ('cyclone', 'Marc Brownstein', 1),
    ('cyclone', 'Jon Gutwillig', 2),
    ('cyclone', 'Jamie Shields', 3),
    ('cyclone', 'Mike Greenfield', 4),
    ('tempest', 'JM2', 0),
    ('tempest', 'Marc Brownstein', 1),
    ('tempest', 'Jon Gutwillig', 2),
    ('tempest', 'Jamie Shields', 3),
    ('tempest', 'Mike Greenfield', 4),
    ('orch-theme', 'Conspirator', 0),
    ('orch-theme', 'Aron Magner', 1),
    ('orch-theme', 'Marc Brownstein', 2),
    ('boom-shanker', 'Conspirator', 0),
    ('boom-shanker', 'Aron Magner', 1),
    ('boom-shanker', 'Marc Brownstein', 2),
    ('liquid-handcuffs', 'Conspirator', 0),
    ('liquid-handcuffs', 'Aron Magner', 1),
    ('liquid-handcuffs', 'Marc Brownstein', 2),
    ('commercial-amen', 'Conspirator', 0),
    ('commercial-amen', 'Aron Magner', 1),
    ('commercial-amen', 'Marc Brownstein', 2),
    ('denmark-massive', 'The Join', 0),
    ('denmark-massive', 'Marc Brownstein', 1),
    ('denmark-massive', 'Aron Magner', 2),
    ('denmark-massive', 'Jamie Shields', 3),
    ('denmark-massive', 'Darren Shearer', 4),
    ('gamma-goblins', 'Hallucinogen', 0),
    ('gamma-goblins', 'Simon Posford', 1),
    ('solstice', 'Hallucinogen', 0),
    ('solstice', 'Simon Posford', 1),
    ('riddles-are-abound-tonight', 'Sausage', 0),
    ('riddles-are-abound-tonight', 'Les Claypool', 1),
    ('riddles-are-abound-tonight', 'Jay Lane', 2),
    ('riddles-are-abound-tonight', 'Todd Huth', 3),
    ('eyes-of-the-world', 'Grateful Dead', 0),
    ('shakedown-street', 'Grateful Dead', 0),
    ('west-l-a-fadeaway', 'Grateful Dead', 0),
    ('and-we-bid-you-goodnight', 'Grateful Dead', 0),
    ('going-down-the-road-feeling-bad', 'Grateful Dead', 0),
    ('dancing-in-the-street', 'Martha and The Vandellas', 0),
    ('everybody-needs-somebody-to-love', 'Solomon Burke', 0),
    ('soul-man', 'Sam & Dave', 0),
    ('i-feel-love', 'Donna Summer', 0),
    ('eye-of-the-tiger', 'Survivor', 0)
) AS m(song_slug, author_name, pos)
JOIN "songs" s ON s."slug" = m.song_slug
JOIN LATERAL (SELECT "id" FROM "authors" WHERE "name" = m.author_name ORDER BY "created_at" LIMIT 1) a ON true;

-- 3. Link musicians to their person-author (created above) so their pages list these songs.
UPDATE "musicians" SET "author_id" = (SELECT "id" FROM "authors" WHERE "name" = 'Simon Posford' ORDER BY "created_at" LIMIT 1), "updated_at" = now() WHERE "slug" = 'simon-posford' AND "author_id" IS NULL;
UPDATE "musicians" SET "author_id" = (SELECT "id" FROM "authors" WHERE "name" = 'Les Claypool' ORDER BY "created_at" LIMIT 1), "updated_at" = now() WHERE "slug" = 'les-claypool' AND "author_id" IS NULL;

