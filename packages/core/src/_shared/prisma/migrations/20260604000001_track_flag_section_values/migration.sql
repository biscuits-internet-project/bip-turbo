-- Section-of-the-song track flags: ENDING_ONLY / MIDDLE_ONLY / BEGINNING_ONLY.
-- "ending only" is the complement of "unfinished" (the tail was played, the
-- start wasn't); the others mark which section a partial version covered.
-- Backfilled from free-text annotations in a later migration.
ALTER TYPE "track_flag" ADD VALUE IF NOT EXISTS 'ENDING_ONLY';
ALTER TYPE "track_flag" ADD VALUE IF NOT EXISTS 'MIDDLE_ONLY';
ALTER TYPE "track_flag" ADD VALUE IF NOT EXISTS 'BEGINNING_ONLY';
