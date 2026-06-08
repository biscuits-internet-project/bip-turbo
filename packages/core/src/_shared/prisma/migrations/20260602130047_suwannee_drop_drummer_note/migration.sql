-- The "1st show with drummer Marlon B. Lewis" lineup note is now structured
-- performer data, so strip that trailing line (and its leading <br>) from the
-- show notes. Scoped to the one show; idempotent (re-running matches nothing).
UPDATE "shows"
SET "notes" = regexp_replace("notes", '\s*<br>\s*1st show with drummer Marlon B\. Lewis\s*$', ''),
    "updated_at" = now()
WHERE "slug" = '2025-10-31-suwannee-music-park-live-oak-fl';
