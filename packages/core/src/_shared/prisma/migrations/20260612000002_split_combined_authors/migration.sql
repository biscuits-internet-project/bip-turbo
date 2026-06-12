-- Split combined "A, B" author rows into individual authors linked via song_authors.
-- Matches by slug throughout; idempotent (re-runnable).

-- 1. Ensure every individual author target exists (existing rows skipped via NOT EXISTS; authors.slug is non-unique).
INSERT INTO "authors" ("name", "slug", "created_at", "updated_at")
SELECT v.name, v.slug, now(), now()
FROM (VALUES
    ('Aron Magner', 'aron-magner'),
    ('Jon Gutwillig', 'jon-gutwillig'),
    ('Marc Brownstein', 'marc-brownstein'),
    ('Allen Aucoin', 'allen-aucoin'),
    ('Joey Friedman', 'joey-friedman'),
    ('The Disco Biscuits', 'the-disco-biscuits'),
    ('Ben Hayflick', 'ben-hayflick'),
    ('Jon Lesser', 'jon-lesser'),
    ('O''Brien', 'obrien'),
    ('Benjy Eisen', 'benjy-eisen'),
    ('Mauricio Zuniga', 'mauricio-zuniga'),
    ('Fathead', 'fathead'),
    ('The New Deal', 'the-new-deal'),
    ('Dom Dolla', 'dom-dolla'),
    ('Eliza Rose', 'eliza-rose'),
    ('Interplanetary Criminal', 'interplanetary-criminal'),
    ('Kaskade', 'kaskade'),
    ('Madonna', 'madonna'),
    ('Nostalgix', 'nostalgix'),
    ('Scruffizer', 'scruffizer'),
    ('Shpongle', 'shpongle'),
    ('Kid Cudi', 'kid-cudi'),
    ('Jerry Garcia', 'jerry-garcia'),
    ('Robert Hunter', 'robert-hunter'),
    ('Marvin Hamlisch', 'marvin-hamlisch'),
    ('Edward Kleban', 'edward-kleban'),
    ('Pete Bellotte', 'pete-bellotte'),
    ('Matt Stone', 'matt-stone'),
    ('Trey Parker', 'trey-parker'),
    ('David Porter', 'david-porter'),
    ('Isaac Hayes', 'isaac-hayes'),
    ('Glen Larson', 'glen-larson'),
    ('Stu Phillips', 'stu-phillips'),
    ('Bert Berns', 'bert-berns'),
    ('Jerry Wexler', 'jerry-wexler'),
    ('Solomon Burke', 'solomon-burke'),
    ('Chris Lake', 'chris-lake'),
    ('Skrillex', 'skrillex'),
    ('Anita B. Queen', 'anita-b-queen'),
    ('Max Dean', 'max-dean'),
    ('Luke Dean', 'luke-dean'),
    ('Locky', 'locky'),
    ('Fred again..', 'fred-again'),
    ('Baby Keem', 'baby-keem'),
    ('Sammy Virji', 'sammy-virji'),
    ('Tiësto', 'tiesto'),
    ('Sevenn', 'sevenn'),
    ('Mau P', 'mau-p'),
    ('Sub Focus', 'sub-focus'),
    ('bbyclose', 'bbyclose'),
    ('Marvin Gaye', 'marvin-gaye'),
    ('William Stevenson', 'william-stevenson'),
    ('Ivy Jo Hunter', 'ivy-jo-hunter'),
    ('Alex Chig', 'alex-chig'),
    ('Harry Zelnick', 'harry-zelnick'),
    ('Alex Mazer', 'alex-mazer'),
    ('Nicholas Schmidle', 'nicholas-schmidle')
) AS v(name, slug)
WHERE NOT EXISTS (SELECT 1 FROM "authors" a WHERE a."slug" = v.slug);

-- 2. Preserve the remix credit as a song note before the combined author link is removed.
UPDATE "songs"
SET "notes" = COALESCE(NULLIF("notes", ''), 'DJ Brownie Remix'), "updated_at" = now()
WHERE "id" IN (
    SELECT sa."song_id" FROM "song_authors" sa
    JOIN "authors" a ON a."id" = sa."author_id"
    WHERE a."slug" = 'mau-p-dj-brownie-remix'
);

-- 3. Add individual author links to every song currently attributed to a combined author.
INSERT INTO "song_authors" ("song_id", "author_id", "position", "created_at", "updated_at")
SELECT sa."song_id", ind."id", m.position, now(), now()
FROM (VALUES
    ('jon-gutwillig-marc-brownstein', 'jon-gutwillig', 0),
    ('jon-gutwillig-marc-brownstein', 'marc-brownstein', 1),
    ('aron-magner-jon-gutwillig', 'aron-magner', 0),
    ('aron-magner-jon-gutwillig', 'jon-gutwillig', 1),
    ('aron-magner-marc-brownstein', 'aron-magner', 0),
    ('aron-magner-marc-brownstein', 'marc-brownstein', 1),
    ('allen-aucoin-aron-magner', 'allen-aucoin', 0),
    ('allen-aucoin-aron-magner', 'aron-magner', 1),
    ('joey-friedman-jon-gutwillig', 'joey-friedman', 0),
    ('joey-friedman-jon-gutwillig', 'jon-gutwillig', 1),
    ('aron-magner-joey-friedman-jon-gutwillig', 'aron-magner', 0),
    ('aron-magner-joey-friedman-jon-gutwillig', 'joey-friedman', 1),
    ('aron-magner-joey-friedman-jon-gutwillig', 'jon-gutwillig', 2),
    ('aron-magner-joey-friedman-jon-gutwillig-marc-brownstein', 'aron-magner', 0),
    ('aron-magner-joey-friedman-jon-gutwillig-marc-brownstein', 'joey-friedman', 1),
    ('aron-magner-joey-friedman-jon-gutwillig-marc-brownstein', 'jon-gutwillig', 2),
    ('aron-magner-joey-friedman-jon-gutwillig-marc-brownstein', 'marc-brownstein', 3),
    ('alex-chig-harry-zelnick-jon-gutwillig', 'alex-chig', 0),
    ('alex-chig-harry-zelnick-jon-gutwillig', 'harry-zelnick', 1),
    ('alex-chig-harry-zelnick-jon-gutwillig', 'jon-gutwillig', 2),
    ('alex-mazer-aron-magner-jon-gutwillig-nicholas-schmidle', 'alex-mazer', 0),
    ('alex-mazer-aron-magner-jon-gutwillig-nicholas-schmidle', 'aron-magner', 1),
    ('alex-mazer-aron-magner-jon-gutwillig-nicholas-schmidle', 'jon-gutwillig', 2),
    ('alex-mazer-aron-magner-jon-gutwillig-nicholas-schmidle', 'nicholas-schmidle', 3),
    ('hayflick-jon-gutwillig-marc-brownstein', 'ben-hayflick', 0),
    ('hayflick-jon-gutwillig-marc-brownstein', 'jon-gutwillig', 1),
    ('hayflick-jon-gutwillig-marc-brownstein', 'marc-brownstein', 2),
    ('benjy-eisen-marc-brownstein', 'benjy-eisen', 0),
    ('benjy-eisen-marc-brownstein', 'marc-brownstein', 1),
    ('aron-magner-lesser', 'aron-magner', 0),
    ('aron-magner-lesser', 'jon-lesser', 1),
    ('jon-gutwillig-obrien', 'jon-gutwillig', 0),
    ('jon-gutwillig-obrien', 'obrien', 1),
    ('joey-friedman-the-disco-biscuits', 'joey-friedman', 0),
    ('joey-friedman-the-disco-biscuits', 'the-disco-biscuits', 1),
    ('mauricio-zuniga-the-disco-biscuits', 'mauricio-zuniga', 0),
    ('mauricio-zuniga-the-disco-biscuits', 'the-disco-biscuits', 1),
    ('fathead-the-disco-biscuits', 'fathead', 0),
    ('fathead-the-disco-biscuits', 'the-disco-biscuits', 1),
    ('the-disco-biscuits-the-new-deal', 'the-disco-biscuits', 0),
    ('the-disco-biscuits-the-new-deal', 'the-new-deal', 1),
    ('the-disco-biscuits-and-dom-dolla', 'dom-dolla', 0),
    ('the-disco-biscuits-and-dom-dolla', 'joey-friedman', 1),
    ('the-disco-biscuits-and-dom-dolla', 'the-disco-biscuits', 2),
    ('the-disco-biscuits-and-eliza-rose-interplanetary-criminal', 'joey-friedman', 0),
    ('the-disco-biscuits-and-eliza-rose-interplanetary-criminal', 'the-disco-biscuits', 1),
    ('the-disco-biscuits-and-eliza-rose-interplanetary-criminal', 'eliza-rose', 2),
    ('the-disco-biscuits-and-eliza-rose-interplanetary-criminal', 'interplanetary-criminal', 3),
    ('the-disco-biscuits-and-kaskade', 'the-disco-biscuits', 0),
    ('the-disco-biscuits-and-kaskade', 'kaskade', 1),
    ('the-disco-biscuits-and-madonna', 'the-disco-biscuits', 0),
    ('the-disco-biscuits-and-madonna', 'madonna', 1),
    ('the-disco-biscuits-and-nostalgix-scruffizer', 'jon-gutwillig', 0),
    ('the-disco-biscuits-and-nostalgix-scruffizer', 'nostalgix', 1),
    ('the-disco-biscuits-and-nostalgix-scruffizer', 'scruffizer', 2),
    ('the-disco-biscuits-and-shpongle', 'the-disco-biscuits', 0),
    ('the-disco-biscuits-and-shpongle', 'shpongle', 1),
    ('tractorbeam-kid-cudi', 'joey-friedman', 0),
    ('tractorbeam-kid-cudi', 'the-disco-biscuits', 1),
    ('tractorbeam-kid-cudi', 'kid-cudi', 2),
    ('garcia-hunter', 'jerry-garcia', 0),
    ('garcia-hunter', 'robert-hunter', 1),
    ('hamlisch-kleban', 'marvin-hamlisch', 0),
    ('hamlisch-kleban', 'edward-kleban', 1),
    ('donna-summer-giorgio-moroder-pete-bello', 'donna-summer', 0),
    ('donna-summer-giorgio-moroder-pete-bello', 'giorgio-moroder', 1),
    ('donna-summer-giorgio-moroder-pete-bello', 'pete-bellotte', 2),
    ('matt-stone-trey-parker', 'matt-stone', 0),
    ('matt-stone-trey-parker', 'trey-parker', 1),
    ('david-porter-isaac-hayes', 'david-porter', 0),
    ('david-porter-isaac-hayes', 'isaac-hayes', 1),
    ('glen-larson-stu-phillips', 'glen-larson', 0),
    ('glen-larson-stu-phillips', 'stu-phillips', 1),
    ('bert-berns-jerry-wexler-solomon-burke', 'bert-berns', 0),
    ('bert-berns-jerry-wexler-solomon-burke', 'jerry-wexler', 1),
    ('bert-berns-jerry-wexler-solomon-burke', 'solomon-burke', 2),
    ('chris-lake-skrillex-anita-b-queen', 'chris-lake', 0),
    ('chris-lake-skrillex-anita-b-queen', 'skrillex', 1),
    ('chris-lake-skrillex-anita-b-queen', 'anita-b-queen', 2),
    ('max-dean-luke-dean-locky', 'max-dean', 0),
    ('max-dean-luke-dean-locky', 'luke-dean', 1),
    ('max-dean-luke-dean-locky', 'locky', 2),
    ('fred-again-baby-keem', 'fred-again', 0),
    ('fred-again-baby-keem', 'baby-keem', 1),
    ('sammy-virji-interplanetary-criminal', 'sammy-virji', 0),
    ('sammy-virji-interplanetary-criminal', 'interplanetary-criminal', 1),
    ('tiesto-sevenn', 'tiesto', 0),
    ('tiesto-sevenn', 'sevenn', 1),
    ('mau-p-dj-brownie-remix', 'mau-p', 0),
    ('sub-focus-featuring-bbyclose', 'sub-focus', 0),
    ('sub-focus-featuring-bbyclose', 'bbyclose', 1),
    ('martha-and-the-vandellas', 'marvin-gaye', 0),
    ('martha-and-the-vandellas', 'william-stevenson', 1),
    ('martha-and-the-vandellas', 'ivy-jo-hunter', 2)
) AS m(combined_slug, individual_slug, position)
JOIN "authors" combined ON combined."slug" = m.combined_slug
JOIN "song_authors" sa ON sa."author_id" = combined."id"
JOIN "authors" ind ON ind."slug" = m.individual_slug
ON CONFLICT ("song_id", "author_id") DO NOTHING;

-- 4. Remove the superseded combined-author links.
DELETE FROM "song_authors"
WHERE "author_id" IN (
    SELECT "id" FROM "authors" WHERE "slug" IN (
        'jon-gutwillig-marc-brownstein', 'aron-magner-jon-gutwillig', 'aron-magner-marc-brownstein',
        'allen-aucoin-aron-magner', 'joey-friedman-jon-gutwillig', 'aron-magner-joey-friedman-jon-gutwillig',
        'aron-magner-joey-friedman-jon-gutwillig-marc-brownstein', 'alex-chig-harry-zelnick-jon-gutwillig',
        'alex-mazer-aron-magner-jon-gutwillig-nicholas-schmidle', 'hayflick-jon-gutwillig-marc-brownstein',
        'benjy-eisen-marc-brownstein', 'aron-magner-lesser', 'jon-gutwillig-obrien',
        'joey-friedman-the-disco-biscuits', 'mauricio-zuniga-the-disco-biscuits', 'fathead-the-disco-biscuits',
        'the-disco-biscuits-the-new-deal', 'the-disco-biscuits-and-dom-dolla',
        'the-disco-biscuits-and-eliza-rose-interplanetary-criminal', 'the-disco-biscuits-and-kaskade',
        'the-disco-biscuits-and-madonna', 'the-disco-biscuits-and-nostalgix-scruffizer',
        'the-disco-biscuits-and-shpongle', 'tractorbeam-kid-cudi', 'garcia-hunter', 'hamlisch-kleban',
        'donna-summer-giorgio-moroder-pete-bello', 'matt-stone-trey-parker', 'david-porter-isaac-hayes',
        'glen-larson-stu-phillips', 'bert-berns-jerry-wexler-solomon-burke', 'chris-lake-skrillex-anita-b-queen',
        'max-dean-luke-dean-locky', 'fred-again-baby-keem', 'sammy-virji-interplanetary-criminal',
        'tiesto-sevenn', 'mau-p-dj-brownie-remix', 'sub-focus-featuring-bbyclose', 'martha-and-the-vandellas'
    )
);

-- The now-orphaned combined author rows are deleted in a later migration, after
-- songs.author_id (which still references them) is dropped.
