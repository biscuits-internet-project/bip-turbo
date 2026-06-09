-- Correct song.kind for the improvisation jams. The original backfill
-- (20260604000000_song_kind) set 'improvisation' by hardcoded row id
-- (WHERE "id" IN (...)). Row ids are not stable across environments — the audit
-- list was built against a local prod-restore whose ids differ from prod for
-- several songs — so on prod the id-keyed UPDATE matched nothing for those jams
-- and they fell through to the 'original' fallback (e.g. "Mishawaka Improv Jam"
-- rendered a "debut (original - The Disco Biscuits)" footnote that should not
-- exist — improvisations emit no debut footnote). id-matching fails SILENTLY
-- (0 rows updated, no error), which is why it deployed "successfully" but wrong.
--
-- Re-apply by SLUG, which is stable across environments. Explicit auditable list
-- (mirrors the original intent of an explicit set, not a regex). Idempotent:
-- only touches rows whose kind is not already 'improvisation'. The mashup/cover/
-- author migrations already match by slug and are unaffected; cover/original were
-- set by the cover boolean / fallback and are environment-stable.
UPDATE "songs"
SET "kind" = 'improvisation', "updated_at" = now()
WHERE "kind" IS DISTINCT FROM 'improvisation'
  AND "slug" IN (
    '1-30-97-jam', '2001-a-space-odyssey-jam', '5th-element-jam', 'akira-jam',
    'alice-in-wonderland-jam', 'biscuits-fathead-jam', 'biscuits-new-deal-jam',
    'camp-home-again-jam', 'camp-home-again-jam-2', 'costume-contest-jam', 'drumz',
    'jam', 'jam-on-the-river-song', 'jazz-improv-jam', 'koyaanisqatsi-jam',
    'matisyahu-jam', 'mishawaka-improv-jam', 'moshi-drum-jam', 'moshi-moshi-jam',
    'new-deal-biscuits-jam', 'nowhere-jam', 'pi-jam', 'radiator-jam',
    'run-lola-run-jam', 'set-break-jam', 'soundcheck-jam', 'super-mario-starman-jam',
    'tractorbeam-jam', 'tron-jam', 'vocal-jam', 'willie-the-pimp-jam',
    'worcester-jam', 'young-lust-jam'
  );

-- Refresh the caches that derive from song.kind. The debut footnote ("debut
-- (original - …)") is computed in the setlist mapper from song.kind and is baked
-- into the per-show show.data payloads, which have a 24h TTL. Queue a full-catalog
-- recompute: the deploy's recompute-pending run busts show:*:data:* / shows:list /
-- home / attended-setlists / rock-opera / songs caches (invalidateShowListings +
-- invalidateSongCaches), so the corrected kinds appear immediately instead of
-- waiting out the TTL. HAVING (not WHERE ... NOT EXISTS) so it inserts zero rows,
-- not a NULL row, when a request for the earliest date already exists.
INSERT INTO "stats_recompute_requests" ("id", "since_date")
SELECT gen_random_uuid(), MIN("date")::date
FROM "shows"
WHERE "date" IS NOT NULL
HAVING MIN("date") IS NOT NULL
   AND MIN("date")::date NOT IN (SELECT "since_date" FROM "stats_recompute_requests" WHERE "since_date" IS NOT NULL);
