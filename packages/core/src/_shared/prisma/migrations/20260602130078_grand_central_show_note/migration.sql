-- 2010-03-26 Grand Central: the "without Jon Gutwillig / Chris Michetti + Tom
-- Hamilton on guitar" line is structured performer data, so strip that line (and
-- its trailing <br> + blank-line separator) from the show note, leaving the rest.
UPDATE "shows"
SET "notes" = regexp_replace(
      "notes",
      'Whole show without Jon Gutwillig\. Chris Michetti of RAQ and Tom Hamilton of Brothers Past on guitar <br>\s*',
      ''
    ),
    "updated_at" = now()
WHERE "slug" = '2010-03-26-grand-central-miami-fl'
  AND "notes" LIKE '%Whole show without Jon Gutwillig. Chris Michetti of RAQ and Tom Hamilton of Brothers Past on guitar%';
