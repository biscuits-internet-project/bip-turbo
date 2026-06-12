-- Delete combined "A, B" author rows now superseded by individual authors.
-- Runs after songs.author_id is dropped (20260612000005) so nothing references them.
-- Guarded by NOT EXISTS so an author that somehow still has songs is kept.
DELETE FROM "authors" a
WHERE a."slug" IN (
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
    'tiesto-sevenn', 'mau-p-dj-brownie-remix', 'sub-focus-featuring-bbyclose', 'martha-and-the-vandellas',
    'abrams-jon-gutwillig', 'braff-jon-gutwillig', 'calarco-marc-brownstein',
    'alex-mazer-joey-friedman-jon-gutwillig', 'alex-mazer-jon-gutwillig-nicholas-schmidle',
    'garcia-kreutzmann-weir', 'simon-posford-the-disco-biscuits', 'jon-gutwillig-tom-mckee'
)
AND NOT EXISTS (SELECT 1 FROM "song_authors" sa WHERE sa."author_id" = a."id");
