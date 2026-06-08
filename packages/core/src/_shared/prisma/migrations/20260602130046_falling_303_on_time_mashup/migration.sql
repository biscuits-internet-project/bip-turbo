-- "Falling 303 x On Time" mashes up two Disco Biscuits originals, so it is a
-- mashup authored by The Disco Biscuits.
UPDATE "songs"
SET "kind" = 'mashup',
    "author_id" = (SELECT "id" FROM "authors" WHERE "slug" = 'the-disco-biscuits'),
    "updated_at" = now()
WHERE "slug" = 'falling-303-x-on-time';
