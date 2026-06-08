-- Mike Greenfield's Set-2 percussion is structured performer data now, so strip
-- the "(Set II with Mike Greenfield on drums)" line from the show note, leaving
-- the soundcheck line.
UPDATE "shows"
SET "notes" = regexp_replace("notes", '\s*\(Set II with Mike Greenfield on drums\)\s*$', ''),
    "updated_at" = now()
WHERE "slug" = '2004-05-09-starland-ballroom-sayreville-nj'
  AND "notes" LIKE '%(Set II with Mike Greenfield on drums)%';
