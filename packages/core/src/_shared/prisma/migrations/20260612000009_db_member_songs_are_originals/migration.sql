-- A song co-written by a Disco Biscuits member is an original, not a cover.
-- These are the band's side-project tunes (JM2, Conspirator, The Join) that
-- were mis-filed as covers. Matched by slug (stable natural key).
UPDATE "songs"
SET "kind" = 'original', "updated_at" = now()
WHERE "kind" = 'cover'
  AND "slug" IN (
    'cyclone', 'tempest', 'orch-theme', 'boom-shanker',
    'liquid-handcuffs', 'commercial-amen', 'denmark-massive'
  );
