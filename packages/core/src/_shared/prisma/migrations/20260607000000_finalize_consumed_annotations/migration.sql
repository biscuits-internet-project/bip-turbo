-- Finalize the annotations consumed by the flag / completion / performer
-- backfill. The marking pass (20260604000004_mark_annotations_for_deletion)
-- only tagged rows: fully-consumed ones as "TODELETE: <original>" and
-- partly-consumed ones as "TOEDIT: <original> BECOMES <residual>". This brings
-- them to their final state:
--   * delete every TODELETE row (its content is now structured data)
--   * rewrite every TOEDIT row to just its residual prose
--
-- Runs after the marker and the inverted/dyslexic/ordering finalizers
-- (20260605000001, 20260606000001/2/3), so any row still carrying a marker here
-- is swept to its final form. Idempotent: a prod sync restores the original text
-- and the earlier migrations re-mark it, then this re-applies cleanly. The
-- residual split is unambiguous (no TOEDIT row contains a second " BECOMES ",
-- and no original annotation text contains " BECOMES ").

DELETE FROM "annotations" WHERE "desc" LIKE 'TODELETE:%';

UPDATE "annotations"
SET "desc" = regexp_replace("desc", '^TOEDIT: .*? BECOMES ', ''),
    "updated_at" = now()
WHERE "desc" LIKE 'TOEDIT:%';
