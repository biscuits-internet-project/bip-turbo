-- "1st time inverted" is not yet handled by footnote logic, so it stays a real
-- annotation. Strip the TODELETE marker so it renders cleanly. Scoped to the one
-- show + exact desc; idempotent (re-running finds nothing to rename).
UPDATE "annotations" a
SET "desc" = '1st time inverted', "updated_at" = now()
FROM "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-12-31-roadrunner-boston-ma'
  AND a."desc" = 'TODELETE: 1st time inverted';
