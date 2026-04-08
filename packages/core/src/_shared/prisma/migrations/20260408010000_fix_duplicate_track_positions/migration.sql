-- Fix duplicate track positions across 5 shows.
-- Some shows have two different songs sharing a position (need renumbering),
-- others have fully duplicated rows for the same song (need deduplication).

BEGIN;

--------------------------------------------------------------------------------
-- 2024-09-07 Mishawaka Amphitheater — S2 position 5 (Minions / Leavemealone)
-- Keep Minions at 5, shift Leavemealone to 6, closing 7-11 bookend to 7.
--------------------------------------------------------------------------------
UPDATE tracks SET position = 7 WHERE id = 'ae27f3c4-31de-4346-85b4-d8399c8acb10';
UPDATE tracks SET position = 6 WHERE id = '17cf701d-ebcf-4dbc-8a60-c90cde23cc8b';

--------------------------------------------------------------------------------
-- 2024-07-12 Bourbon Room — S2 position 4 (Photograph / Strobelights)
-- Photograph stays at 4, shift Strobelights to 5, closing Morph Dusseldorf to 6.
--------------------------------------------------------------------------------
UPDATE tracks SET position = 6 WHERE id = 'b0ea999c-a6e4-49a1-8a3c-a7cd653e6569';
UPDATE tracks SET position = 5 WHERE id = '7d4ed251-7780-4e2c-9647-86f4a64b62cb';

--------------------------------------------------------------------------------
-- 2024-02-10 Boulder Theater — S2 position 4 (The Deal / Gamma Goblins)
-- The Deal stays at 4, shift Gamma Goblins to 5, closing Reactor to 6.
--------------------------------------------------------------------------------
UPDATE tracks SET position = 6 WHERE id = '9a357965-ee91-4f41-9b1f-0cc265328c97';
UPDATE tracks SET position = 5 WHERE id = 'c59d2377-6661-4553-9b70-6e1618c4bdb5';

--------------------------------------------------------------------------------
-- 2023-05-25 Three Sisters Park — S1 position 4 (two "To Be Continued" rows)
-- Keep 74bcd4a8 (has 2 ratings). Delete 5ec55d18 (0 ratings, duplicate annotation).
-- Fix Cyclone's previous_track_id to point to the survivor.
--------------------------------------------------------------------------------
DELETE FROM annotations WHERE id = 'ecb18d4a-b703-47f7-82ef-749adb012614';
UPDATE tracks SET previous_track_id = '74bcd4a8-78e4-4256-8f55-47df86a1e8fa'
  WHERE id = 'eaa6b105-8a16-4572-8f75-3151ef8a88b6';
DELETE FROM tracks WHERE id = '5ec55d18-e83c-4e03-9552-201fc2e6b541';

--------------------------------------------------------------------------------
-- 2002-04-05 9:30 Club — E1 position 2 (two "Mary Had A Little Lamb" rows)
-- Keep bdaadeec (Pat And Dex's next_track_id points to it). Delete aac77b6a.
-- Both have 0 ratings; annotations are identical duplicates.
--------------------------------------------------------------------------------
DELETE FROM annotations WHERE id = '5c3f3509-15e0-4798-8fff-913439736f6d';
DELETE FROM tracks WHERE id = 'aac77b6a-c4e2-4cd3-8b81-89377e4c056d';

COMMIT;
