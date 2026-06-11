-- Remove venues that no show references. These are stale catalog rows: typo /
-- "The X" duplicates of a real venue that holds the shows, plus a long tail of
-- distinct venues no show points at. The /venues page already hides zero-show
-- venues; this drops them from the catalog entirely.
--
-- Matched by relationship (not by id/slug), so it self-corrects to each
-- environment's actual zero-show set and is idempotent — a re-run deletes
-- nothing. FK-safe by construction: shows.venue_id is the only reference to
-- venues, and the predicate only deletes venues with no such reference.
DELETE FROM venues v
WHERE NOT EXISTS (
  SELECT 1 FROM shows s WHERE s.venue_id = v.id
);
