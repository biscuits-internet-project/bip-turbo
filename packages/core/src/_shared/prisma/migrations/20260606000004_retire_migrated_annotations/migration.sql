-- Retire free-text annotations that are now represented as structured performer
-- data (show lineup + track musician deltas). Scoped per-show by exact desc, so
-- only validated shows have their redundant annotations removed; the same text
-- on un-validated shows is left untouched. Deletes are idempotent.

-- 2010-03-16 Theater of the Living Arts, Philadelphia, PA
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2010-03-16-theater-of-the-living-arts-philadelphia-pa'
  AND a."desc" IN (
    'with Tom Hamilton (Brothers Past)',
    'with Rocco on backup vocals',
    'with Mackenzie Eddy',
    'with Chris Barron on backup vocals',
    'with Dirty Harry and Don Cheegro on backup vocals',
    'with Tuphace on backup vocals'
  );

-- 2025-11-01 Suwannee Music Park, Live Oak, FL — cover attributions now on Song.author
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-11-01-suwannee-music-park-live-oak-fl'
  AND a."desc" IN (
    'FTP (Chris Lake, Skrillex & Anita B. Queen)',
    'FTP (Herman Cattaneo & Audio Junkies remix of the original by Monkey Safari)',
    'FTP (Alice Deejay)',
    'FTP (Max Dean, Luke Dean & Locky)',
    'FTP (ABBA)'
  );

-- 2026-05-24 Mishawaka Amphitheater, Bellvue, CO — LTP gap notes
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-05-24-mishawaka-amphitheater-bellvue-co'
  AND a."desc" IN (
    'LTP 1/25/25 (100 shows)',
    'LTP 9/8/24 (135 shows)',
    'LTP 3/31/22 (303 shows)',
    'LTP 6/2/17 (463 shows)'
  );

-- 2026-05-23 Mishawaka Amphitheater, Bellvue, CO — LTP gap note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-05-23-mishawaka-amphitheater-bellvue-co'
  AND a."desc" IN (
    'LTP 7/14/24 (145 shows)'
  );

-- 2026-05-22 Mishawaka Amphitheater, Bellvue, CO — Cloudchord sit-in now structured
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-05-22-mishawaka-amphitheater-bellvue-co'
  AND a."desc" IN (
    'with Cloudchord on guitar'
  );

-- 2026-05-07 Viva El Gonzo — Goose sit-ins now structured
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-05-07-viva-el-gonzo-san-jose-del-cabo-baja-california-sur'
  AND a."desc" IN (
    'with Rick Mitarotonda (guitar), Peter Anspach (keys), and Cotter Ellis (drums/percussion) of Goose'
  );

-- 2026-04-18 The UC Theatre, Berkeley, CA — LTP gap note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-04-18-the-uc-theatre-berkeley-ca'
  AND a."desc" IN (
    'LTP 6/26/25 (61 shows)'
  );

-- 2026-04-17 1015 Folsom, San Francisco, CA — mashup attribution now on Song.kind/author
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-04-17-1015-folsom-san-francisco-ca'
  AND a."desc" IN (
    'FTP (Tractorbeam & Kid Cudi mashup)'
  );

-- 2026-03-20 Okeechobee Music & Arts Festival, Okeechobee, FL — attributions now on Song
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-03-20-okeechobee-music-arts-festival-okeechobee-fl'
  AND a."desc" IN (
    'FTP (Chris Lorenzo)',
    'FTP (Tractorbeam Original)'
  );

-- 2026-02-06 Miami Beach Bandshell, Miami Beach, FL — Matisyahu sit-in + LTP note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-02-06-miami-beach-bandshell-miami-beach-fl'
  AND a."desc" IN (
    'FTP (Matisyahu, on vocals)',
    'LTP 1/19/25 (87 shows)'
  );

-- 2025-12-31 Roadrunner, Boston, MA — cover attribution now on Song.author
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-12-31-roadrunner-boston-ma'
  AND a."desc" IN (
    'FTP (Robin S.)'
  );

-- 2025-12-31 Roadrunner, Boston, MA — more cover attributions now on Song.author
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-12-31-roadrunner-boston-ma'
  AND a."desc" IN (
    'FTP (Charlotte de Witte)',
    'FTP (Jeff Mills)'
  );

-- 2025-12-30 Royale, Boston, MA — cover attribution now on Song.author
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-12-30-royale-boston-ma'
  AND a."desc" IN (
    '‘Cheers Theme’ (Gary Portnoy)'
  );

-- 2025-12-20 Thalia Hall, Chicago, IL — LTP gap note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-12-20-thalia-hall-chicago-il'
  AND a."desc" IN (
    'LTP 3/13/25 (62 shows)'
  );

-- 2025-11-22 Town Ballroom, Buffalo, NY — LTP gap note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-11-22-town-ballroom-buffalo-ny'
  AND a."desc" IN (
    'LTP 2/10/2024 (152 shows)'
  );

-- 2025-11-20 Higher Ground, South Burlington, VT — LTP note + mashup attribution
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-11-20-higher-ground-south-burlington-vt'
  AND a."desc" IN (
    'LTP 11/11/2022 (240 shows)',
    'FTP (mashup of ‘Falling 303’ & ‘On Time’)'
  );

-- 2025-11-14 Brooklyn Steel, Brooklyn, NY — LTP gap note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-11-14-brooklyn-steel-brooklyn-ny'
  AND a."desc" IN (
    'LTP 9/8/24 (103 shows) (way too many)'
  );

-- 2025-10-31 Suwannee Music Park, Live Oak, FL — LTP gap note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-10-31-suwannee-music-park-live-oak-fl'
  AND a."desc" IN (
    'LTP 11/14/24 (80 shows)'
  );

-- 2025-09-07 Mishawaka Amphitheater, Bellvue, CO — LTP note + original attribution
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-09-07-mishawaka-amphitheater-bellvue-co'
  AND a."desc" IN (
    'LTP 11/7/24 (82 shows)',
    'FTP (tDB Original)'
  );

-- 2026-04-12 Gather Outdoors, Stratton, VT — cover attribution now on Song.author
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-04-12-gather-outdoors-stratton-vt'
  AND a."desc" IN (
    'FTP (Mau P); DJ Brownie Remix'
  );

-- 2026-04-11 Gather Outdoors, Stratton, VT — LTP gap note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-04-11-gather-outdoors-stratton-vt'
  AND a."desc" IN (
    'LTP 4/11/24 (149 shows)'
  );

-- 2025-09-06 Mishawaka Amphitheater, Bellvue, CO — LTP gap note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-09-06-mishawaka-amphitheater-bellvue-co'
  AND a."desc" IN (
    'LTP 1/17/25 (63 shows)'
  );

-- 2025-09-05 Mishawaka Amphitheater, Bellvue, CO — LTP gap note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-09-05-mishawaka-amphitheater-bellvue-co'
  AND a."desc" IN (
    'LTP 11/7/24 (80 shows)'
  );

-- 2025-08-31 Pine Creek Lodge, Livingston, MT — LTP gap note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-31-pine-creek-lodge-livingston-mt'
  AND a."desc" IN (
    'LTP 6/4/10 (648 shows)'
  );

-- 2025-08-24 Ardmore Music Hall, Ardmore, PA — LTP gap notes + Tom Hamilton sit-in (now structured)
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa'
  AND a."desc" IN (
    'LTP 4/12/2024 (108 shows)',
    'LTP 11/13/2024 (71 shows)',
    'with Tom Hamilton on guitar'
  );

-- 2025-08-24 Ardmore Music Hall — S2.2: full delete (LTP gap auto-derived, unfinished is a structured flag)
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-24-ardmore-music-hall-ardmore-pa'
  AND t."set" = 'S2' AND t."position" = 2
  AND a."desc" = 'LTP 12/30/2024 (58 shows); unfinished';

-- 2025-08-23 Ardmore Music Hall, Ardmore, PA — LTP note + original attribution
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-23-ardmore-music-hall-ardmore-pa'
  AND a."desc" IN (
    'LTP 8/12/2023 (158 shows)',
    'FTP (tDB Original)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa'
  AND a."desc" = 'LTP 12/26/2011 (564 shows)';

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-20-ardmore-music-hall-ardmore-pa'
  AND a."desc" IN (
    'LTP 11/8/2024 (68 shows)',
    'LTP 3/10/2023 (198 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-19-ardmore-music-hall-ardmore-pa'
  AND a."desc" = 'LTP 3/31/2023 (189 shows)';

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-12-state-theater-portland-me'
  AND a."desc" = 'LTP 11/6/24 (68 shows)';

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-11-the-strand-theater-providence-ri'
  AND a."desc" = 'LTP 11/20/24 (59 shows)';

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-10-summer-stage-at-tree-house-charlton-ma'
  AND a."desc" = 'LTP 9/11/24 (75 shows)';

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-06-cape-cod-melody-tent-hyannis-ma'
  AND a."desc" IN (
    'LTP 9/11/24 (74 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-06-white-eagle-hall-jersey-city-nj'
  AND a."desc" IN (
    'LTP 7/12/24 (88 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-05-the-music-box-at-the-borgata-hotel-and-casino-atlantic-city-nj'
  AND a."desc" IN (
    'LTP 6/14/23 (167 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-02-xl-live-harrisburg-pa'
  AND a."desc" IN (
    'LTP 11/20/24 (51 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-28-levitt-pavillion-westport-ct'
  AND a."desc" IN (
    'LTP 11/1/24 (62 shows)'
  );

-- 2025-06-28 Levitt Pavilion, Westport, CT — 1st-time-inverted now auto-annotated
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-28-levitt-pavillion-westport-ct'
  AND a."desc" IN (
    '1st time inverted'
  );

-- 2026-04-11 Gather Outdoors, Stratton, VT — segue-recurrence note
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-04-11-gather-outdoors-stratton-vt'
  AND a."desc" IN (
    'Last time not -> into 5/25/2007 (932 shows)'
  );

-- 2026-02-08 MSC Divina (The Open Seas), Miami, FL — last-inverted now auto-annotated (structured flag recurrence)
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2026-02-08-msc-divina-the-open-seas-miami-fl'
  AND a."desc" IN (
    'Last time inverted 9/7/2010 (657 shows)'
  );

-- 2025-11-15 Brooklyn Steel, Brooklyn, NY — standalone/encore note now auto-annotated
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-11-15-brooklyn-steel-brooklyn-ny'
  AND a."desc" IN (
    'FTP standalone & as an encore'
  );

-- 2025-11-14 Brooklyn Steel, Brooklyn, NY — standalone recurrence note now auto-annotated
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-11-14-brooklyn-steel-brooklyn-ny'
  AND a."desc" IN (
    'LTP standalone 7/19/2019 (361 shows)'
  );

-- 2025-09-05 Mishawaka Amphitheater, Bellvue, CO — last-dyslexic recurrence now auto-annotated (both Home Again versions)
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-09-05-mishawaka-amphitheater-bellvue-co'
  AND a."desc" IN (
    'last time dyslexic 7/22/2007 (877 shows)'
  );

-- 2025-08-31 Pine Creek Lodge, Livingston, MT — Catalyst last-inverted now auto-annotated
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-31-pine-creek-lodge-livingston-mt'
  AND a."desc" IN (
    'Last Time Inverted 4/23/21 (305 shows)'
  );

-- 2025-08-30 Pine Creek Lodge, Livingston, MT — Reactor last-dyslexic now auto-annotated (both tracks)
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-30-pine-creek-lodge-livingston-mt'
  AND a."desc" IN (
    'last time dyslexic 2/4/2016 (465 shows)'
  );

-- 2025-08-29 Pine Creek Lodge, Livingston, MT — Another Plan of Attack last-inverted now auto-annotated
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-29-pine-creek-lodge-livingston-mt'
  AND a."desc" IN (
    'last time inverted 5/20/2023 (190 shows)'
  );

-- 2025-08-27 The Complex, Salt Lake City, UT — Jigsaw Earth last-dyslexic now auto-annotated (both tracks)
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-27-the-complex-salt-lake-city-ut'
  AND a."desc" IN (
    'last time dyslexic 7/17/2007 (874 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-21-ardmore-music-hall-ardmore-pa'
  AND a."desc" IN (
    '1st dyslexic version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-08-20-ardmore-music-hall-ardmore-pa'
  AND a."desc" IN (
    'Last time inverted 4/13/2003 (1110 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-12-state-theater-portland-me'
  AND a."desc" IN (
    '1st time inverted'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-11-the-strand-theater-providence-ri'
  AND a."desc" IN (
    'Last time inverted 12/29/02 (1117 shows)',
    'LTP as standalone encore 12/31/08 (772 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-10-summer-stage-at-tree-house-charlton-ma'
  AND a."desc" IN (
    'Last time inverted 12/30/17 (384 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-07-06-white-eagle-hall-jersey-city-nj'
  AND a."desc" IN (
    'Last time inverted 7/18/23 (155 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-27-stage-ae-pittsburgh-pa'
  AND a."desc" IN (
    'LTP 11/17/24 (50 shows)',
    'LTP 7/4/24 (86 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-26-the-bluestone-columbus-oh'
  AND a."desc" IN (
    'LTP 9/11/24 (66 shows)',
    'LTP 8/29/24 (72 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-25-hi-fi-annex-indianapolis-in'
  AND a."desc" IN (
    'LTP 2/3/24 (113 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-24-mercury-ballroom-louisville-ky'
  AND a."desc" IN (
    'dyslexic ending of 6/27 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-21-electric-forest-rothbury-mi'
  AND a."desc" IN (
    'FTP (mashup of ‘The Great Abyss’ + ‘Divine Moments Of Truth’ (D.M.T.)(Shpongle)',
    'FTP (mashup of ‘Tricycle’ + ‘Like A Prayer’ (Madonna)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-17-the-westcott-theater-syracuse-ny'
  AND a."desc" IN (
    'LTP (Original ‘Falling’)(11/6/24 50 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-12-bonnaroo-music-festival-manchester-tn'
  AND a."desc" IN (
    'LTP 9/13/24 (55 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-12-bonnaroo-music-festival-manchester-tn'
  AND a."desc" IN (
    'FTP (mashup of ‘Bombs’ + ‘Lockdown’ (Nostalgix & Scruffizer)',
    'FTP (Sub Focus featuring bbyclose; Tractorbeam Remix)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-10-lincoln-theater-raleigh-nc'
  AND a."desc" IN (
    'LTP 10/27/23 (118 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-07-french-broad-river-brewery-asheville-nc'
  AND a."desc" IN (
    'LTP 11/19/21 (240 shows)',
    'LTP 7/21/23 (134 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-06-04-terminal-west-atlanta-ga'
  AND a."desc" IN (
    'LTP 9/17/21 (247 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-03-15-starland-ballroom-sayreville-nj'
  AND a."desc" IN (
    'LTP 6/1/16 (414 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-03-13-the-queen-wilmington-de'
  AND a."desc" IN (
    'LTP 9/7/24 (50 shows)',
    'LTP 4/13/24 (71 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-02-26-bearsville-theatre-woodstock-ny'
  AND a."desc" IN (
    'LTP 8/29/24 (50 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-02-07-boulder-theater-boulder-co'
  AND a."desc" IN (
    'FTP (Sammy Virji & Interplanetary Criminal)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-02-07-boulder-theater-boulder-co'
  AND a."desc" IN (
    'FTP (Lalo Schifrin)(Tractorbeam Remix)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-02-05-meow-wolf-santa-fe-nm'
  AND a."desc" IN (
    'dyslexic ending of 2/8/25 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-02-04-marquee-theatre-tempe-az'
  AND a."desc" IN (
    'LTP 7/13/24 (54 shows)',
    'LTP 3/13/24 (78 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-02-02-orpheum-theater-flagstaff-az'
  AND a."desc" IN (
    'LTP 2/6/24 (86 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-01-31-the-mayan-los-angeles-ca'
  AND a."desc" IN (
    'dyslexic ending of 2/1/25 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-01-30-the-observatory-santa-ana-ca'
  AND a."desc" IN (
    'LTP 2/7/24 (82 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-01-29-fremont-theater-san-luis-obispo-ca'
  AND a."desc" IN (
    'LTP 4/12/24 (59 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-01-25-crystal-bay-club-casino-crystal-bay-nv'
  AND a."desc" IN (
    'LTP 2/9/24 (78 shows)',
    'dyslexic ending of 1/26/25 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-01-23-the-catalyst-santa-cruz-ca'
  AND a."desc" IN (
    'LTP 2/7/24 (77 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-01-21-senator-theatre-chico-ca'
  AND a."desc" IN (
    'dyslexic ending of 1/23/25 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-01-19-midtown-ballroom-bend-or'
  AND a."desc" IN (
    'LTP 4/5/24 (57 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-01-19-midtown-ballroom-bend-or'
  AND a."desc" IN (
    'last time dyslexic 12/28/2017 (340 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-01-18-revolution-hall-portland-oregon'
  AND a."desc" IN (
    'last time dyslexic 9/13/2014 (445 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2025-01-17-revolution-hall-portland-or'
  AND a."desc" IN (
    'dyslexic ending of 1/18/25 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-12-31-the-fillmore-philadelphia-pa'
  AND a."desc" IN (
    'LTP 3/15/24 (61 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-12-31-the-fillmore-philadelphia-pa'
  AND a."desc" IN (
    'FTP (Ramin Djawadi)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-12-30-the-fillmore-philadelphia-pa'
  AND a."desc" IN (
    'LTP 12/30/22 (152 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-12-27-the-fillmore-silver-spring-md'
  AND a."desc" IN (
    'LTP 12/29/22 (151 shows)',
    'LTP 9/15/23 (95 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-12-27-the-fillmore-silver-spring-md'
  AND a."desc" IN (
    'Last Time Inverted 7/17/15 (416 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-11-21-infinity-music-hall-hartford-ct'
  AND a."desc" IN (
    'LTP 5/8/22 (181 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-11-21-infinity-music-hall-hartford-ct'
  AND a."desc" IN (
    'Last Time Inverted 4/26/19 (286 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-11-20-infinity-music-hall-hartford-ct'
  AND a."desc" IN (
    'LTP 3/10/24 (56 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-11-20-infinity-music-hall-hartford-ct'
  AND a."desc" IN (
    'LTP 10/25/23 (80 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-11-16-state-theater-portland-me'
  AND a."desc" IN (
    'LTP 3/7/24 (57 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-11-13-bearsville-theatre-woodstock-ny'
  AND a."desc" IN (
    'LTP 3/15/24 (50 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-11-07-penns-peak-jim-thorpe-pa'
  AND a."desc" IN (
    'LTP 10/25/23 (72 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-11-06-rams-head-live-baltimore-md'
  AND a."desc" IN (
    'LTP 2/7/24 (54 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-11-03-terminal-west-atlanta-ga'
  AND a."desc" IN (
    'LTP 2/1/23 (129 shows)',
    'LTP 10/24/23 (71 shows)',
    'LTP 2/7/24 (53 shows)',
    'LTP 7/14/23 (91 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-11-02-the-caverns-pelham-tn'
  AND a."desc" IN (
    'LTP 2/2/24 (56 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-10-31-the-caverns-pelham-tn'
  AND a."desc" IN (
    'FTP (Richard Strauss)',
    'FTP (Johan Strauss II)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-10-31-the-caverns-pelham-tn'
  AND a."desc" IN (
    'FTP (Johan Strauss II) '
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-09-15-pine-creek-lodge-livingston-montana'
  AND a."desc" IN (
    'intro only'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-09-14-pine-creek-lodge-livingston-mt'
  AND a."desc" IN (
    'LTP 7/15/23 (84 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-09-13-pine-creek-lodge-livingston-mt'
  AND a."desc" IN (
    'LTP 3/21/10 (574 shows)',
    'LTP 11/16/19 (251 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-09-13-pine-creek-lodge-livingston-mt'
  AND a."desc" IN (
    'FTP (mashup of ‘Tourists (Rocket Ship)’ & ‘On Time’)',
    'FTP (mashup of ‘girl$’ (Dom Dolla) & ‘Times Square’)',
    'FTP (mashup of ‘Konkrete’ & ‘Floodlights’)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-09-11-the-depot-salt-lake-city-ut'
  AND a."desc" IN (
    'LTP 7/6/23 (90 shows)',
    'LTP 9/24/23 (66 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-09-08-mishawaka-amphitheater-bellvue-co'
  AND a."desc" IN (
    '1st Time inverted (230x+ played)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-09-07-mishawaka-amphitheater-bellvue-co'
  AND a."desc" IN (
    'LTP 12/1/23 (57 shows)',
    'LTP 6/16/23 (90 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-09-06-dillon-amphitheater-dillon-co'
  AND a."desc" IN (
    'Last Time Inverted 3/29/14 (426 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-09-05-washingtons-fort-collins-co'
  AND a."desc" IN (
    'LTP 8/11/23 (71 shows)',
    'LTP 10/25/23 (58 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-07-20-great-south-bay-music-festival-patchogue-ny'
  AND a."desc" IN (
    'with Erin Boyd (vocals)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-07-04-wonderland-forest-lafayette-ny'
  AND a."desc" IN (
    'FTP (Darude)',
    'FTP (mashup of ‘LakeShoreDrive’ + ‘Meditation to the Groove’ (Kaskade)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-07-04-wonderland-forest-lafayette-ny'
  AND a."desc" IN (
    'FTP (mashup of ‘LakeShoreDrive’ +  ‘Meditation to the Groove’ (Kaskade)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-07-04-wonderland-forest-lafayette-ny'
  AND a."desc" IN (
    'FTP (Porter Robinson)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-03-30-town-ballroom-buffalo-ny'
  AND a."desc" IN (
    'dyslexic completion of 4/2/24 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-03-29-webster-hall-new-york-ny'
  AND a."desc" IN (
    'with Cloudchord on Guitar'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-03-09-stage-ae-pittsburgh-pa'
  AND a."desc" IN (
    'with Eli Winderman (Dopapod, Octave Cat) on keys'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2024-03-09-stage-ae-pittsburgh-pa'
  AND a."desc" IN (
    'with Eli Winderman (Dopapod, Octave Cat) on keys '
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2023-12-02-miami-beach-bandshell-miami-beach-fl'
  AND a."desc" IN (
    'with Adam Deitch on drums'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2023-02-04-anthem-washington-d-c'
  AND a."desc" IN (
    'with Snacktime on horns'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2021-08-28-backwoods-at-mulberry-mountain-ozark-ar'
  AND a."desc" IN (
    'continues 8/21 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2017-12-31-playstation-theater-new-york-ny'
  AND a."desc" IN (
    'FTP (Koji Kondo)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2016-02-06-the-fillmore-philadelphia-pa'
  AND a."desc" IN (
    'with Swift Technique horns'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2017-02-03-the-fillmore-philadelphia-pa'
  AND a."desc" IN (
    'with Swift Technique horns'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2016-01-02-playstation-theater-new-york-ny'
  AND a."desc" IN (
    'with Philly Stray Horns'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2015-10-31-crouse-hinds-theater-at-the-oncenter-syracuse-new-york'
  AND a."desc" IN (
    'with Philly Stray Horns'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2015-04-18-ogden-theater-denver-co'
  AND a."desc" IN (
    'with Tom Hamilton (Guitar/Vocals)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2014-09-13-ogden-theater-denver-co'
  AND a."desc" IN (
    'dyslexic ending of 9/14/14 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2014-02-20-electric-factory-philadelphia-pa'
  AND a."desc" IN (
    'dyslexic ending of 2/22/14 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2013-12-29-best-buy-theater-new-york-ny'
  AND a."desc" IN (
    'middle section only'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2013-12-28-best-buy-theater-new-york-ny'
  AND a."desc" IN (
    'middle section only'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2013-12-27-sirius-satellite-studios-new-york-city-ny'
  AND a."desc" IN (
    'middle section only'
  );

-- 2013-09-28 Mann Center E1.2 Run Like Hell — completion of 8/30 & 8/31 now a track_completions chain
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2013-09-28-mann-center-for-the-performing-arts-philadelphia-pa'
  AND a."desc" IN (
    'TODELETE: ending only, completes 8/30 & 8/31 versions',
    'TOEDIT: ending only, completes 8/30 & 8/31 versions BECOMES completes 8/30 & 8/31 versions',
    'ending only, completes 8/30 & 8/31 versions'
  );

-- 2012-12-28 Best Buy Theater S1.3 Little Shimmy — dyslexic flag + completion link to 12/31/12 capture this
DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2012-12-28-best-buy-theater-new-york-ny'
  AND a."desc" IN (
    'TODELETE: dyslexic ending of 12/31/12 version',
    'dyslexic ending of 12/31/12 version'
  );

-- Dyslexic completion/ending-of cross-references whose completion is now a
-- track_completions link. Set-based: only deletes rows whose track already has a
-- link (so unlinked refs survive for manual review). TOEDIT rows are excluded —
-- their BECOMES residual preserves tease/sample content that must survive. The
-- DYSLEXIC flag + the completion link fully capture the deleted rows.
DELETE FROM "annotations" a
USING "tracks" t
WHERE a."track_id" = t."id"
  AND a."desc" ILIKE '%dyslexic%'
  AND a."desc" NOT LIKE 'TOEDIT:%'
  AND (a."desc" ILIKE '%completion%' OR a."desc" ILIKE '%ending of%' OR a."desc" ILIKE '%ending to%')
  AND EXISTS (
    SELECT 1 FROM "track_completions" tc
    WHERE tc."earlier_track_id" = t."id" OR tc."later_track_id" = t."id"
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2011-01-14-boulder-theater-boulder-co'
  AND a."desc" IN (
    '10/9/09 (95 shows)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2010-10-31-jefferson-theater-charlottesville-va'
  AND a."desc" IN (
    'with Bonobo replacing Marc on bass'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2010-03-21-brooklyn-bowl-brooklyn-ny'
  AND a."desc" IN (
    'with Mackenzie Eddy'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2009-12-27-nokia-theater-new-york-ny'
  AND a."desc" IN (
    'completed 12/26 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2009-11-27-electric-factory-philadelphia-pa'
  AND a."desc" IN (
    'with Curren$y'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2009-12-12-caribbean-holidaze-runaway-bay-jamaica'
  AND a."desc" IN (
    'with Curren$y'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2009-07-04-plumas-country-fairgrounds-quincy-ca'
  AND a."desc" IN (
    'middle section'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2008-05-24-electric-factory-philadelphia-pa'
  AND a."desc" IN (
    'dyslexic completion of 5/24/08 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2007-12-31-tweeter-center-at-the-waterfront-camden-nj'
  AND a."desc" IN (
    'with Antibalas horns'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2007-12-28-hammerstein-ballroom-new-york-ny'
  AND a."desc" IN (
    'with Tom Hamilton (Brothers Past)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2007-02-15-starland-ballroom-sayreville-nj'
  AND a."desc" IN (
    'Just Aron and Allen'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2006-12-30-electric-factory-philadelphia-pa'
  AND a."desc" IN (
    'with Simon Posford (Hallucinogen)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2006-12-29-theater-of-the-living-arts-philadelphia-pa'
  AND a."desc" IN (
    'FTP (Isaac Watts)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2006-11-10-bogart-s-cincinnati-oh'
  AND a."desc" IN (
    'middle section'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2006-11-04-sonar-lounge-baltimore-md'
  AND a."desc" IN (
    'Aaron, Allen and Shawn on stage'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2006-11-01-state-theater-ithaca-ny'
  AND a."desc" IN (
    'Aaron, Allen and Shawn on stage'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2006-10-31-orpheum-theater-boston-ma'
  AND a."desc" IN (
    'with the Boston Symphony Orchestra Choir'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2006-08-26-hunter-mountain-ski-lodge-hunter-ny'
  AND a."desc" IN (
    'with Simon Posford',
    'ending',
    'middle'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2005-03-22-melkweg-amsterdam-holland'
  AND a."desc" IN (
    'with Brendan Bayliss and Joel Cummins from Umphrey''s McGee.'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2004-10-01-mcdonough-gymnasium-at-georgetown-university-washington-dc'
  AND a."desc" IN (
    'FTP (Harold Faltermeyer)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2004-05-29-penn-s-landing-philadelphia-pa'
  AND a."desc" IN (
    'FTP (tDB Original)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2003-08-31-cervantes-masterpiece-ballroom-denver-co'
  AND a."desc" IN (
    'completes 8/12 ''Pat and Dex’ '
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2003-08-16-trade-music-festival-farm-trade-tn'
  AND a."desc" IN (
    'with DJ Mauricio '
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2002-04-06-norva-theater-norfolk-va'
  AND a."desc" IN (
    'FTP (tDB Original)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2001-12-31-electric-factory-philadelphia-pa'
  AND a."desc" IN (
    'FTP (John Williams)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2001-07-21-hartford-meadows-music-theater-hartford-ct'
  AND a."desc" IN (
    'New tDB Original; (FTP 6/27/01)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2001-04-09-lee-s-palace-toronto-ontario-canada'
  AND a."desc" IN (
    'Sam on drums; Barber, Aron, and Eric Bernstein beat-boxing while Marc raps'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2000-10-18-crystal-ballroom-portland-or'
  AND a."desc" IN (
    'dyslexic completion of 10/17 ''Liquid Lazer''',
    'completes 10/17 ''Stone'''
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '2000-08-19-wetlands-preserve-new-york-ny'
  AND a."desc" IN (
    'completes 8/19 (Early) version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '1999-10-09-legends-lounge-las-vegas-nv'
  AND a."desc" IN (
    'continues 10/8 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '1999-09-18-barrymore-theater-madison-wi'
  AND a."desc" IN (
    'completes 9/17 version'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '1999-01-22-tammany-hall-worcester-ma'
  AND a."desc" IN (
    'FTP (tDB Original)'
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '1999-01-22-tammany-hall-worcester-ma'
  AND a."desc" IN (
    'completes 1/21 ''Pat and Dex'''
  );

DELETE FROM "annotations" a
USING "tracks" t, "shows" s
WHERE a."track_id" = t."id"
  AND t."show_id" = s."id"
  AND s."slug" = '1998-02-19-wetlands-preserve-new-york-ny'
  AND a."desc" IN (
    'First time played.'
  );
