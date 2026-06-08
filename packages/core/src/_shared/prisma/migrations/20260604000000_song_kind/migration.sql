-- A single `kind` axis for songs, replacing the cover boolean + the (never
-- deployed) classification column with one value: 'original' | 'cover' |
-- 'mashup' | 'improvisation'. A mashup (e.g. "Tractorbeam & Kid Cudi mashup")
-- is neither a pure original nor a single cover. The cover column is left in
-- place (dormant) for now and dropped in a follow-up migration.

ALTER TABLE "songs" ADD COLUMN IF NOT EXISTS "kind" text;

-- Jams (improvisations) first — a hand-audited list of 33 song IDs, lifted from
-- the retired classify_jams_improvisation migration. An explicit id set (not a
-- title pattern) so nothing a future title can accidentally match is swept in.
UPDATE "songs"
SET "kind" = 'improvisation'
WHERE "kind" IS NULL
  AND "id" IN (
    'b5447608-ec07-4768-818e-d2d12afe89be', -- 1/30/97 Jam
    'd8e9b340-00a2-4879-859b-9a9a73d6a736', -- 2001: A Space Odyssey Jam
    '0dab4fde-2e40-478d-b360-fc36cc080c44', -- Akira Jam
    '1cd9a572-7281-4ee0-8a17-095e9edf202f', -- Alice in Wonderland Jam
    '342ca5d7-66a7-45ad-be60-00aa4d0109d8', -- Biscuits/Fathead Jam
    '210754d4-5305-4145-99b5-014787400693', -- Biscuits/New Deal Jam
    'c295e731-2b17-4d30-bffa-173092e6ca1f', -- Camp Home Again Jam
    'd1d1c3d3-c07a-456b-8999-e1db72fdd045', -- Camp Home Again Jam
    'e33b6a90-0dc3-45b5-93bb-5f89b428dc69', -- Costume Contest Jam
    'af72310f-f5ac-4c7f-8958-96064f4f1733', -- Jam
    '92e66db0-c88c-4450-8ad6-c41cb1d3328a', -- Jam on the River Song
    '64121fb4-eb55-4e97-a209-3a38d5c8dd62', -- Jazz Improv Jam
    'ed6175ef-2464-406d-b5be-25207287c5f8', -- Koyaanisqatsi Jam
    'b127628a-5cdb-4c2b-af07-2035b9981c0a', -- Matisyahu Jam
    '5eb71a84-8bc7-49de-9172-fbade4ab6935', -- Mishawaka Improv Jam
    '1314bdf7-42f7-412a-b7fa-6b54d6ba16d6', -- Moshi-Drum Jam
    '7a06774a-a203-4970-a93b-fa6ec11246fb', -- Moshi-Fameus Jam
    'fad86275-66a9-44de-8048-5221afcfac56', -- Moshi-Moshi Jam
    'c7cf2bc4-4a02-48ee-947b-d8680ad7fbe7', -- New Deal/Biscuits Jam
    '89127c36-1d74-4f7d-a325-13afda82c087', -- Nowhere Jam
    '2c8eda2c-72e9-4147-9988-122712b40d65', -- Pi Jam
    '5e23a8c2-c52b-4f15-b10f-3eb754a96a4b', -- Radiator Jam
    '429bdd95-515e-4fb7-bdb7-9da790426749', -- Run Lola Run Jam
    'ca77a73b-be28-47e3-ade5-930fbc40bcb0', -- Set Break Jam
    '47b8298c-c725-463e-90af-5878669eb270', -- Soundcheck Jam
    'f2415c54-7512-444c-8e89-cbaccf99133f', -- Super Mario Starman Jam
    '5e56c3be-1ef5-4f58-ab37-13471b799ae0', -- The Fifth Element Jam
    '57bd800a-75a6-4c67-90ce-c5af28525bb0', -- Tractorbeam Jam
    '54d1c688-7610-4308-b656-c77c077fe103', -- Tron Jam
    'a24defea-5ff2-49d9-8893-89bd723fea98', -- Vocal Jam
    '9db45b82-cf5d-49dc-8c6b-af320d02c11c', -- Willie the Pimp Jam
    'a3ec5e8f-825d-48b3-bf74-1320612f7498', -- Worcester Jam
    '49b0afc8-509e-41f8-9fff-82b5f2ca3ea6'  -- Young Lust Jam
  );

-- Covers next, then everything else is an original. Mashups are tagged by hand.
UPDATE "songs" SET "kind" = 'cover' WHERE "kind" IS NULL AND "cover" = true;
UPDATE "songs" SET "kind" = 'original' WHERE "kind" IS NULL;
