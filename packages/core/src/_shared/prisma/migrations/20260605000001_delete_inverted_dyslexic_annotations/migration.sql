-- Delete annotations whose entire text is "inverted", "dyslexic", "unfinished",
-- "ending only", "beginning only", or "middle only" (marked TODELETE in a prior
-- backfill). Every such track already carries the matching INVERTED / DYSLEXIC /
-- UNFINISHED / ENDING_ONLY / BEGINNING_ONLY / MIDDLE_ONLY track flag, so the
-- prose is fully redundant. Normalizing
-- with lower(btrim(...)) catches the capitalization ("Inverted") and the
-- trailing/double-space whitespace variants. Annotations with extra detail
-- (parentheticals, "completion of...", "1st time", etc.) are left untouched.
-- Idempotent; replay after any prod sync resurrects the rows.
DELETE FROM "annotations" a
WHERE lower(btrim(a."desc")) IN ('todelete: inverted', 'todelete: dyslexic', 'todelete: unfinished', 'todelete: ending only', 'todelete: beginning only', 'todelete: middle only');

-- "middle section only" annotations: the track is now flagged MIDDLE_ONLY in the
-- track_flags backfill, so the prose is redundant. These were never TODELETE-marked
-- (they were untagged), so match the bare text directly.
DELETE FROM "annotations" a
WHERE lower(btrim(a."desc")) = 'middle section only';
