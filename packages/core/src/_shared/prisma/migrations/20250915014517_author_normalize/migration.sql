-- Scenario: Change all songs "Disco Biscuits" author to the "The Disco Biscuits" author
SELECT count(*)
FROM songs
WHERE author_id = 'e29db38d-5b63-4e2c-b5bc-8f4ed3fe1c64'; -- The Disco Biscuits

SELECT count(*)
FROM songs
WHERE author_id = 'e3b85783-5df5-436a-a497-8bb3e40e8a99'; -- Disco Biscuits

UPDATE songs
SET author_id = 'e29db38d-5b63-4e2c-b5bc-8f4ed3fe1c64' -- The Disco Biscuits
WHERE author_id = 'e3b85783-5df5-436a-a497-8bb3e40e8a99'; -- Disco Biscuits

SELECT count(*)
FROM songs
WHERE author_id = 'e29db38d-5b63-4e2c-b5bc-8f4ed3fe1c64'; -- The Disco Biscuits

SELECT count(*)
FROM songs
WHERE author_id = 'e3b85783-5df5-436a-a497-8bb3e40e8a99'; -- Disco Biscuits

DELETE
FROM authors
WHERE id = 'e3b85783-5df5-436a-a497-8bb3e40e8a99'; -- Disco Biscuits

-- Scenario: Change all songs "The New Deal/The Disco Biscuits" author to "The Disco Biscuits/The New Deal" author (so it's sorted alphabetically and will then be normalized to "The Disco Biscuits, The New Deal" in a later scenario)
SELECT count(*)
FROM songs
WHERE author_id = '26b6eb4b-2b9e-44cf-a34a-ed61639e27ab'; -- The Disco Biscuits/The New Deal

SELECT count(*)
FROM songs
WHERE author_id = '6a561edc-ee55-4638-b407-2cc092bffab8'; -- The New Deal/The Disco Biscuits

UPDATE songs
SET author_id = '26b6eb4b-2b9e-44cf-a34a-ed61639e27ab' -- The Disco Biscuits/The New Deal
WHERE author_id = '6a561edc-ee55-4638-b407-2cc092bffab8'; -- The New Deal/The Disco Biscuits

SELECT count(*)
FROM songs
WHERE author_id = '26b6eb4b-2b9e-44cf-a34a-ed61639e27ab'; -- The Disco Biscuits/The New Deal

SELECT count(*)
FROM songs
WHERE author_id = '6a561edc-ee55-4638-b407-2cc092bffab8'; -- The New Deal/The Disco Biscuits

DELETE
FROM authors
WHERE id = '6a561edc-ee55-4638-b407-2cc092bffab8'; -- The New Deal/The Disco Biscuits

-- Scenario: Change all songs "The Grateful Dead" author to "Grateful Dead" author
SELECT count(*)
FROM songs
WHERE author_id = 'cb77be37-5de3-492b-830d-c1f111913758'; -- Grateful Dead

SELECT count(*)
FROM songs
WHERE author_id = '079d7757-bd68-46ac-990a-6a254e0a9285'; -- The Grateful Dead

UPDATE songs
SET author_id = 'cb77be37-5de3-492b-830d-c1f111913758' -- Grateful Dead
WHERE author_id = '079d7757-bd68-46ac-990a-6a254e0a9285'; -- The Grateful Dead

SELECT count(*)
FROM songs
WHERE author_id = 'cb77be37-5de3-492b-830d-c1f111913758'; -- Grateful Dead

SELECT count(*)
FROM songs
WHERE author_id = '079d7757-bd68-46ac-990a-6a254e0a9285'; -- The Grateful Dead

DELETE
FROM authors
WHERE id = '079d7757-bd68-46ac-990a-6a254e0a9285'; -- The Grateful Dead

UPDATE authors
SET name = 'Grateful Dead'
WHERE name = 'The Grateful Dead'
AND id = 'cb77be37-5de3-492b-830d-c1f111913758';

-- Scenario: Change all songs "The Beastie Boys" author to "Beastie Boys" author
SELECT count(*)
FROM songs
WHERE author_id = '2808b6a7-afe1-4ccb-bef6-ee4005dde2c0'; -- Beastie Boys

SELECT count(*)
FROM songs
WHERE author_id = '7c77e463-6bab-42ea-be3e-19cebc2e62d7'; -- The Beastie Boys

UPDATE songs
SET author_id = '2808b6a7-afe1-4ccb-bef6-ee4005dde2c0' -- Beastie Boys
WHERE author_id = '7c77e463-6bab-42ea-be3e-19cebc2e62d7'; -- The Beastie Boys

SELECT count(*)
FROM songs
WHERE author_id = '2808b6a7-afe1-4ccb-bef6-ee4005dde2c0'; -- Beastie Boys

SELECT count(*)
FROM songs
WHERE author_id = '7c77e463-6bab-42ea-be3e-19cebc2e62d7'; -- The Beastie Boys

DELETE
FROM authors
WHERE id = '7c77e463-6bab-42ea-be3e-19cebc2e62d7'; -- The Beastie Boys

-- Scenario: Change all songs "Guns n' Roses" author to "Guns N' Roses" author
SELECT count(*)
FROM songs
WHERE author_id = '2e4cd710-18f3-4c9f-86b4-391b10ef259b'; -- Guns N' Roses

SELECT count(*)
FROM songs
WHERE author_id = '4ec1da4c-8890-4203-b787-97668ce0ac0b'; -- Guns n' Roses

UPDATE songs
SET author_id = '2e4cd710-18f3-4c9f-86b4-391b10ef259b' -- Guns N' Roses
WHERE author_id = '4ec1da4c-8890-4203-b787-97668ce0ac0b'; -- Guns n' Roses

SELECT count(*)
FROM songs
WHERE author_id = '2e4cd710-18f3-4c9f-86b4-391b10ef259b'; -- Guns N' Roses

SELECT count(*)
FROM songs
WHERE author_id = '4ec1da4c-8890-4203-b787-97668ce0ac0b'; -- Guns n' Roses

DELETE
FROM authors
WHERE id = '4ec1da4c-8890-4203-b787-97668ce0ac0b'; -- Guns n' Roses

-- Scenario: Change all songs "Gutwillig, Magner" author to "Aron Magner, Jon Gutwillig" author
SELECT count(*)
FROM songs
WHERE author_id = '16dea9b0-03b7-43eb-bcda-5162b37b7088'; -- Aron Magner, Jon Gutwillig

SELECT count(*)
FROM songs
WHERE author_id = '7a01161d-ab82-40e5-99a1-49945cf0be96'; -- Gutwillig, Magner

UPDATE songs
SET author_id = '16dea9b0-03b7-43eb-bcda-5162b37b7088' -- Aron Magner, Jon Gutwillig
WHERE author_id = '7a01161d-ab82-40e5-99a1-49945cf0be96'; -- Gutwillig, Magner

SELECT count(*)
FROM songs
WHERE author_id = '16dea9b0-03b7-43eb-bcda-5162b37b7088'; -- Aron Magner, Jon Gutwillig

SELECT count(*)
FROM songs
WHERE author_id = '7a01161d-ab82-40e5-99a1-49945cf0be96'; -- Gutwillig, Magner

DELETE
FROM authors
WHERE id = '7a01161d-ab82-40e5-99a1-49945cf0be96'; -- Gutwillig, Magner

-- Scenario: Change all songs "Led Zepllin" author to "Led Zeppelin" author
SELECT count(*)
FROM songs
WHERE author_id = 'f59c90a1-64c6-4910-916e-81bd2a26052d'; -- Led Zeppelin

SELECT count(*)
FROM songs
WHERE author_id = '9e044c10-50fa-4892-8684-0c00115534c1'; -- Led Zepllin

UPDATE songs
SET author_id = 'f59c90a1-64c6-4910-916e-81bd2a26052d' -- Led Zeppelin
WHERE author_id = '9e044c10-50fa-4892-8684-0c00115534c1'; -- Led Zepllin

SELECT count(*)
FROM songs
WHERE author_id = 'f59c90a1-64c6-4910-916e-81bd2a26052d'; -- Led Zeppelin

SELECT count(*)
FROM songs
WHERE author_id = '9e044c10-50fa-4892-8684-0c00115534c1'; -- Led Zepllin

DELETE
FROM authors
WHERE id = '9e044c10-50fa-4892-8684-0c00115534c1'; -- Led Zepllin

-- Scenario: Change all songs "Tschaikovsky" author to "Tchaikovsky" author
SELECT count(*)
FROM songs
WHERE author_id = 'a7b67347-168e-45ff-9b19-e9b399e831ac'; -- Tchaikovsky

SELECT count(*)
FROM songs
WHERE author_id = 'c2e2ea22-fb95-4596-be0e-a3d2fd04e01c'; -- Tschaikovsky

UPDATE songs
SET author_id = 'a7b67347-168e-45ff-9b19-e9b399e831ac' -- Tchaikovsky
WHERE author_id = 'c2e2ea22-fb95-4596-be0e-a3d2fd04e01c'; -- Tschaikovsky

SELECT count(*)
FROM songs
WHERE author_id = 'a7b67347-168e-45ff-9b19-e9b399e831ac'; -- Tchaikovsky

SELECT count(*)
FROM songs
WHERE author_id = 'c2e2ea22-fb95-4596-be0e-a3d2fd04e01c'; -- Tschaikovsky

DELETE
FROM authors
WHERE id = 'c2e2ea22-fb95-4596-be0e-a3d2fd04e01c'; -- Tschaikovsky

-- Scenario: Change all songs "Brownstein, Friedman, Gutwillig, Magner" author to "Gutwillig, Brownstein, Magner, and Friedman" author
SELECT count(*)
FROM songs
WHERE author_id = 'e8fab4d7-bf21-4dac-b57e-fb2548411589'; -- Gutwillig, Brownstein, Magner, and Friedman

SELECT count(*)
FROM songs
WHERE author_id = '622a1d4c-5823-4a76-add9-977a6c32ddc7'; -- Brownstein, Friedman, Gutwillig, Magner

UPDATE songs
SET author_id = 'e8fab4d7-bf21-4dac-b57e-fb2548411589' -- Gutwillig, Brownstein, Magner, and Friedman
WHERE author_id = '622a1d4c-5823-4a76-add9-977a6c32ddc7'; -- Brownstein, Friedman, Gutwillig, Magner

SELECT count(*)
FROM songs
WHERE author_id = 'e8fab4d7-bf21-4dac-b57e-fb2548411589'; -- Gutwillig, Brownstein, Magner, and Friedman

SELECT count(*)
FROM songs
WHERE author_id = '622a1d4c-5823-4a76-add9-977a6c32ddc7'; -- Brownstein, Friedman, Gutwillig, Magner

DELETE
FROM authors
WHERE id = '622a1d4c-5823-4a76-add9-977a6c32ddc7'; -- Brownstein, Friedman, Gutwillig, Magner

-- Scenario: Normalize "Disco Biscuits" to "The Disco Biscuits" (only 1 record)
SELECT count(*)
FROM authors
WHERE name ILIKE '%Disco Biscuits%'
AND name NOT ILIKE '%The Disco Biscuits%';

UPDATE authors
SET name = REGEXP_REPLACE(name, 'Disco Biscuits', 'The Disco Biscuits', 'gi')
WHERE name ILIKE '%Disco Biscuits%'
AND name NOT ILIKE '%The Disco Biscuits%';

SELECT count(*)
FROM authors
WHERE name ILIKE '%Disco Biscuits%'
AND name NOT ILIKE '%The Disco Biscuits%';

-- Scenario: Replace slashes with commas in author names
-- NOTE: Currently no comma delimited equivalent exists in slash form so will not result in duplicate names
SELECT count(*)
FROM authors
WHERE name LIKE '%/%';

UPDATE authors
SET name = REPLACE(name, '/', ',')
WHERE name LIKE '%/%';

SELECT count(*)
FROM authors
WHERE name LIKE '%/%';

-- Scenario: Replace text "and" and '&' in author names
SELECT COUNT(*)
FROM authors
WHERE (name ILIKE '% and %' OR name LIKE '% & %')
AND name != 'Kool & the Gang'
AND name != 'Kool & The Gang'
AND name != 'Hall and Oates'
AND name != 'Hall & Oates'
AND name != 'Martha and The Vandellas';

UPDATE authors
SET name = REGEXP_REPLACE(REGEXP_REPLACE(name, ' and ', ', ', 'gi'), ' & ', ', ', 'g')
WHERE (name ILIKE '% and %' OR name LIKE '% & %')
AND name != 'Kool & the Gang'
AND name != 'Kool & The Gang'
AND name != 'Hall and Oates'
AND name != 'Hall & Oates'
AND name != 'Martha and The Vandellas';

SELECT COUNT(*)
FROM authors
WHERE (name ILIKE '% and %' OR name LIKE '% & %')
AND name != 'Kool & the Gang'
AND name != 'Kool & The Gang'
AND name != 'Hall and Oates'
AND name != 'Hall & Oates'
AND name != 'Martha and The Vandellas';

UPDATE authors
SET name = REGEXP_REPLACE(name, ',,', ',', 'gi')
WHERE name LIKE '%,,%';

-- Scenario: Normalize comma + space delimeter if comma exists without the space after it
SELECT COUNT(*)
FROM authors
WHERE name LIKE '%,%'
AND name ~ ',\w';

UPDATE authors
SET name = REGEXP_REPLACE(name, ',([^ ])', ', \1', 'g')
WHERE name LIKE '%,%'
AND name ~ ',\w';

SELECT COUNT(*)
FROM authors
WHERE name LIKE '%,%'
AND name ~ ',\w';

-- Scenario: Normalize "Gutwillig" to "Jon Gutwillig"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Gutwillig%'
AND name NOT ILIKE '%Jon Gutwillig%';

UPDATE authors
SET name = REGEXP_REPLACE(name, 'Gutwillig', 'Jon Gutwillig', 'gi')
WHERE name ILIKE '%Gutwillig%'
AND name NOT ILIKE '%Jon Gutwillig%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Gutwillig%'
AND name NOT ILIKE '%Jon Gutwillig%';

-- Scenario: Normalize "Magner" to "Aron Magner"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Magner%'
AND name NOT ILIKE '%Aron Magner%';

UPDATE authors
SET name = REGEXP_REPLACE(name, 'Magner', 'Aron Magner', 'gi')
WHERE name ILIKE '%Magner%'
AND name NOT ILIKE '%Aron Magner%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Magner%'
AND name NOT ILIKE '%Aron Magner%';

-- Scenario: Normalize "Brownstein" to "Marc Brownstein"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Brownstein%'
AND name NOT ILIKE '%Marc Brownstein%';

UPDATE authors
SET name = REGEXP_REPLACE(name, 'Brownstein', 'Marc Brownstein', 'gi')
WHERE name ILIKE '%Brownstein%'
AND name NOT ILIKE '%Marc Brownstein%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Brownstein%'
AND name NOT ILIKE '%Marc Brownstein%';

-- Scenario: Fix "Kool & the Gang" typo to "Kool & The Gang"
SELECT COUNT(*)
FROM authors
WHERE name = 'Kool & the Gang';

UPDATE authors
SET name = 'Hall & Oates'
WHERE name = 'Kool & The Gang';

SELECT COUNT(*)
FROM authors
WHERE name = 'Kool & the Gang';

-- Scenario: Fix "Hall and Oates" typo to "Hall & Oates"
SELECT COUNT(*)
FROM authors
WHERE name = 'Hall and Oates';

UPDATE authors
SET name = 'Hall & Oates'
WHERE name = 'Hall and Oates';

SELECT COUNT(*)
FROM authors
WHERE name = 'Hall and Oates';

-- Scenario: Normalize "Schmidle" to "Nicholas Schmidle"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Schmidle%'
AND name NOT ILIKE '%Nicholas Schmidle%';

UPDATE authors
SET name = REGEXP_REPLACE(name, 'Schmidle', 'Nicholas Schmidle', 'gi')
WHERE name ILIKE '%Schmidle%'
AND name NOT ILIKE '%Nicholas Schmidle%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Schmidle%'
AND name NOT ILIKE '%Nicholas Schmidle%';

-- Scenario: Normalize "Mazer" to "Alex Mazer"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Mazer%'
AND name NOT ILIKE '%Alex Mazer%';

UPDATE authors
SET name = REGEXP_REPLACE(name, 'Mazer', 'Alex Mazer', 'gi')
WHERE name ILIKE '%Mazer%'
AND name NOT ILIKE '%Alex Mazer%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Mazer%'
AND name NOT ILIKE '%Alex Mazer%';

-- Scenario: Normalize "Friedman" to "Joey Friedman"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Friedman%'
AND name NOT ILIKE '%Joey Friedman%';

UPDATE authors
SET name = REGEXP_REPLACE(name, 'Friedman', 'Joey Friedman', 'gi')
WHERE name ILIKE '%Friedman%'
AND name NOT ILIKE '%Joey Friedman%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Friedman%'
AND name NOT ILIKE '%Joey Friedman%';

 -- Scenario: Normalize "Schubert" to "Franz Schubert"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Schubert%'
AND name NOT ILIKE '%Franz Schubert%';

UPDATE authors
SET name = REGEXP_REPLACE(name, 'Schubert', 'Franz Schubert', 'gi')
WHERE name ILIKE '%Schubert%'
AND name NOT ILIKE '%Franz Schubert%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Schubert%'
AND name NOT ILIKE '%Franz Schubert%';

-- Scenario: Normalize "Zuniga" to "Mauricio Zuniga"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Zuniga%'
AND name NOT ILIKE '%Mauricio Zuniga%';

UPDATE authors
SET name = REGEXP_REPLACE(name, 'Zuniga', 'Mauricio Zuniga', 'gi')
WHERE name ILIKE '%Zuniga%'
AND name NOT ILIKE '%Mauricio Zuniga%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Zuniga%'
AND name NOT ILIKE '%Mauricio Zuniga%';

-- Scenario: Fix Issac Hayes/Isaac Hayes (Isaac Hayes is correct spelling)
SELECT COUNT(*)
FROM authors
WHERE name = 'Issac Hayes';

UPDATE authors
SET name = 'Isaac Hayes'
WHERE name = 'Issac Hayes';

SELECT COUNT(*)
FROM authors
WHERE name = 'Issac Hayes';

-- Scenario: Alphabetically sort the names in any comma delimited list
SELECT COUNT(*)
FROM authors
WHERE name LIKE '%,%'
AND name != array_to_string(
    array(
        SELECT unnest(string_to_array(name, ', '))
        ORDER BY 1
    ),
    ', '
);

UPDATE authors
SET name = array_to_string(
    array(
        SELECT unnest(string_to_array(name, ', '))
        ORDER BY 1
    ),
    ', '
)
WHERE name != array_to_string(
    array(
        SELECT unnest(string_to_array(name, ', '))
        ORDER BY 1
    ),
    ', '
);

SELECT COUNT(*)
FROM authors
WHERE name LIKE '%,%'
AND name != array_to_string(
    array(
        SELECT unnest(string_to_array(name, ', '))
        ORDER BY 1
    ),
    ', '
);

-- Scenario: Update slug for all records where slug doesn't match normalized name
SELECT COUNT(*)
FROM authors
WHERE slug != REPLACE(
    REPLACE(
        LOWER(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(name, '&', ''),
                        '.', ''
                    ),
                    '''', ''
                ),
                ',', ''
            )
        ),
        ' ', '-'
    ),
    '--', '-'
);

UPDATE authors
SET slug = REPLACE(
    REPLACE(
        LOWER(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(name, '&', ''),
                        '.', ''
                    ),
                    '''', ''
                ),
                ',', ''
            )
        ),
        ' ', '-'
    ),
    '--', '-'
)
WHERE slug != REPLACE(
    REPLACE(
        LOWER(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(name, '&', ''),
                        '.', ''
                    ),
                    '''', ''
                ),
                ',', ''
            )
        ),
        ' ', '-'
    ),
    '--', '-'
);

SELECT COUNT(*)
FROM authors
WHERE slug != REPLACE(
    REPLACE(
        LOWER(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(name, '&', ''),
                        '.', ''
                    ),
                    '''', ''
                ),
                ',', ''
            )
        ),
        ' ', '-'
    ),
    '--', '-'
);
