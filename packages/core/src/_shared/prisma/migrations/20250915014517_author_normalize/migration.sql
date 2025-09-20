-- Scenario 1: Change "Disco Biscuits" author to the "The Disco Biscuits" author (only 1 record)
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

-- Scenario 2: Normalize "Disco Biscuits" to "The Disco Biscuits" (only 1 record)
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

-- Scenario 3: Replace slashes with commas in author names
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

-- Scenario 4: Normalize comma + space delimeter if comma exists without the space after it
SELECT count(*)
FROM authors
WHERE name LIKE '%,%'
AND name NOT LIKE '%, %';

UPDATE authors
SET name = REPLACE(name, ',', ', ')
WHERE name LIKE '%,%'
AND name NOT LIKE '%, %';

SELECT count(*)
FROM authors
WHERE name LIKE '%,%'
AND name NOT LIKE '%, %';

-- Scenario 5: Normalize "Gutwillig" to "Jon Gutwillig"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Gutwillig%'
AND name NOT ILIKE '%Jon Gutwillig%';

UPDATE authors
SET name = 'Jon Gutwillig'
WHERE name ILIKE '%Gutwillig%'
AND name NOT ILIKE '%Jon Gutwillig%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Gutwillig%'
AND name NOT ILIKE '%Jon Gutwillig%';

-- Scenario 6: Normalize "Magner" to "Aron Magner"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Magner%'
AND name NOT ILIKE '%Aron Magner%';

UPDATE authors
SET name = 'Aron Magner'
WHERE name ILIKE '%Magner%'
AND name NOT ILIKE '%Aron Magner%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Magner%'
AND name NOT ILIKE '%Aron Magner%';

-- Scenario 7: Normalize "Brownstein" to "Marc Brownstein"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Brownstein%'
AND name NOT ILIKE '%Marc Brownstein%';

UPDATE authors
SET name = 'Aron Magner'
WHERE name ILIKE '%Brownstein%'
AND name NOT ILIKE '%Marc Brownstein%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Brownstein%'
AND name NOT ILIKE '%Marc Brownstein%';

-- Scenario 8: Fix "Kool & the Gang" typo to "Kool & The Gang"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE 'Kool & the Gang';

UPDATE authors
SET name = 'Kool & The Gang'
WHERE name = 'Kool & the Gang';

SELECT COUNT(*)
FROM authors
WHERE name = 'Kool & the Gang';

-- Scenario 7: Normalize "Schmidle" to "Nicholas Schmidle"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Schmidle%'
AND name NOT ILIKE '%Nicholas Schmidle%';

UPDATE authors
SET name = 'Nicholas Schmidle'
WHERE name ILIKE '%Schmidle%'
AND name NOT ILIKE '%Nicholas Schmidle%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Schmidle%'
AND name NOT ILIKE '%Nicholas Schmidle%';

-- Scenario 7: Normalize "Mazer" to "Alex Mazer"
SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Mazer%'
AND name NOT ILIKE '%Alex Mazer%';

UPDATE authors
SET name = 'Alex Mazer'
WHERE name ILIKE '%Mazer%'
AND name NOT ILIKE '%Alex Mazer%';

SELECT COUNT(*)
FROM authors
WHERE name ILIKE '%Mazer%'
AND name NOT ILIKE '%Alex Mazer%';

-- Scenario xxx: Last but not least, alphabetically sort the names in any comma delimited list
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

-- select * from authors where UPPER(name) like '%DISCO%'
-- select * from authors WHERE name ILIKE '%disco%biscuits%';
-- select * from authors where upper(name) like '%,%' and upper(name) not like  '%, %'

