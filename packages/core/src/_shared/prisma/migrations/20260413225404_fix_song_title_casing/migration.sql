-- Fix song title casing: apply standard English title case rules
-- and trim trailing whitespace.
-- The trigger_update_song_search_fields trigger automatically
-- updates search_text and search_vector when title changes.

CREATE OR REPLACE FUNCTION pg_temp.title_case(input TEXT) RETURNS TEXT AS $$
DECLARE
  words TEXT[];
  result TEXT[];
  word TEXT;
  i INTEGER;
  len INTEGER;
  minor_words TEXT[] := ARRAY[
    'a','an','the',
    'and','but','or','nor','for','yet','so',
    'as','at','by','from','in','into','of','on','to','till','up',
    'x'
  ];
BEGIN
  input := TRIM(input);

  -- Don't touch all-caps titles (e.g., "BOOM")
  IF input = upper(input) THEN
    RETURN input;
  END IF;

  words := string_to_array(input, ' ');
  result := ARRAY[]::TEXT[];
  len := array_length(words, 1);

  FOR i IN 1..len LOOP
    word := words[i];

    -- Skip empty strings (from multiple consecutive spaces)
    IF word = '' THEN
      result := array_append(result, word);
      CONTINUE;
    END IF;

    IF i = 1 THEN
      -- First word: keep as-is
      result := array_append(result, word);
    ELSIF i > 1 AND (right(words[i-1], 1) = ':' OR left(word, 1) = '(' OR lower(words[i-1]) = 'x') THEN
      -- After colon, opening paren, or mashup "x" separator: treat as first word, keep as-is
      result := array_append(result, word);
    ELSIF lower(word) = ANY(minor_words) AND i < len THEN
      -- Minor word in middle (not last): lowercase
      result := array_append(result, lower(word));
    ELSIF word ~ '^[a-z]+$' THEN
      -- All-lowercase major word: capitalize first letter
      result := array_append(result, upper(left(word, 1)) || substring(word from 2));
    ELSE
      -- Everything else: keep as-is (preserves AC/DC, M.E.M.P.H.I.S., girl$, etc.)
      result := array_append(result, word);
    END IF;
  END LOOP;

  RETURN array_to_string(result, ' ');
END;
$$ LANGUAGE plpgsql;

-- Apply title casing and trim whitespace on all songs where the result differs
UPDATE songs
SET title = pg_temp.title_case(TRIM(title))
WHERE title != pg_temp.title_case(TRIM(title));
