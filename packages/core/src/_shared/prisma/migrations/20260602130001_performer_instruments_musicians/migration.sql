-- Phase 3 performer backfill (generated from performer-backfill.json by
-- build-performer-migration.ts). Idempotent: shows resolved by slug, tracks by
-- (slug,set,position); every insert is ON CONFLICT DO NOTHING so re-applying
-- after a data resync is safe. Split across several migrations so each file is
-- editable; they apply in timestamp order.

-- New instruments (seeded vocab already exists from add_musicians_performers).
INSERT INTO "instruments" ("name", "slug", "updated_at") VALUES
  ('saxophone', 'saxophone', now()),
  ('congas', 'congas', now()),
  ('trumpet', 'trumpet', now()),
  ('banjo', 'banjo', now()),
  ('roland mc 505', 'roland-mc-505', now()),
  ('beatbox', 'beatbox', now()),
  ('turntables', 'turntables', now()),
  ('horns', 'horns', now()),
  ('violin', 'violin', now()),
  ('piano', 'piano', now()),
  ('flute', 'flute', now()),
  ('mouth fluegel', 'mouth-fluegel', now()),
  ('vibraphone', 'vibraphone', now()),
  ('harmonica', 'harmonica', now()),
  ('trombone', 'trombone', now())
ON CONFLICT ("slug") DO NOTHING;

-- New musicians (default instrument resolved by slug; known_from is free text).
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Elliot Levin', 'elliot-levin', 'Sun Ra Arkestra', (SELECT "id" FROM "instruments" WHERE "slug" = 'saxophone'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Tony', 'tony', 'Fathead', (SELECT "id" FROM "instruments" WHERE "slug" = 'congas'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Mike Greenfield', 'mike-greenfield', 'The Ally', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Vernon Reid', 'vernon-reid', 'Living Colour', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Joe Russo', 'joe-russo', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jack', 'jack', 'Planet 22', (SELECT "id" FROM "instruments" WHERE "slug" = 'saxophone'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Dan Brown', 'dan-brown', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'saxophone'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jeff Light', 'jeff-light', 'Foxtrot Zulu', (SELECT "id" FROM "instruments" WHERE "slug" = 'trumpet'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Tony Furtado', 'tony-furtado', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'banjo'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Clayton Belknap', 'clayton-belknap', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'DJ Mauricio', 'dj-mauricio', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'roland-mc-505'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Carol Wade', 'carol-wade', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Bill Stites', 'bill-stites', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Meredith Motley', 'meredith-motley', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Anthony Rogers-Wright', 'anthony-rogers-wright', 'the Arthur Dent Foundation', (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jordan Crisman', 'jordan-crisman', 'Cantus', (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Dan Brantigan', 'dan-brantigan', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'trumpet'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Eric Bernstein', 'eric-bernstein', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'beatbox'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Erica Lynn Gruenberg', 'erica-lynn-gruenberg', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'David Northrup', 'david-northrup', 'Travis Tritt Band', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Cloudchord', 'cloudchord', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Rob Derhak', 'rob-derhak', 'moe.', (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'DJ Paul Norman', 'paul-norman', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'turntables'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Al Schnier', 'al-schnier', 'moe.', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Travis Tritt', 'travis-tritt', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jamie Shields', 'jamie-shields', 'The New Deal, the New Deal', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'John Whooley', 'john-whooley', 'Estradasphere', (SELECT "id" FROM "instruments" WHERE "slug" = 'saxophone'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Mike Dillon', 'mike-dillon', 'Les Claypool''s Flying Frog Brigade', (SELECT "id" FROM "instruments" WHERE "slug" = 'percussion'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Stanton Moore', 'stanton-moore', 'Galactic', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Joe Stapleton', 'joe-stapleton', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jay Lane', 'jay-lane', 'Les Claypool''s Flying Frog Brigade', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Darren Pujalet', 'darren-pujalet', 'Particle', (SELECT "id" FROM "instruments" WHERE "slug" = 'percussion'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Tom Hamilton', 'tom-hamilton', 'Joe Russo''s Almost Dead, Brothers Past, Ghost Light', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jim Riordan', 'jim-riordan', 'Cosmos Sunshine Band', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jeremy Salken', 'jeremy-salken', 'Big Gigantic', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Matisyahu', 'matisyahu', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'John Lee', 'john-lee', 'Caveman', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Aaron Goldberg', 'aaron-goldberg', 'Skydog', (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Snacktime', 'snacktime', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'horns'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jake Cinninger', 'jake-cinninger', 'Umphrey''s McGee', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'KJ Sawka', 'kj-sawka', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Les Claypool', 'les-claypool', 'Primus', (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Dominic Lalli', 'dominic-lalli', 'Big Gigantic', (SELECT "id" FROM "instruments" WHERE "slug" = 'saxophone'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Bill McKay', 'bill-mckay', 'Leftover Salmon', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Eric Wortham', 'eric-wortham', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Eli Winderman', 'eli-winderman', 'Dopapod, Octave Cat', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Ned Scott', 'ned-scott', 'The Egg', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jim Loughlin', 'jim-loughlin', 'moe.', (SELECT "id" FROM "instruments" WHERE "slug" = 'percussion'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Ruu Campbell', 'ruu-campbell', 'Younger Brother', (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Chris Michetti', 'chris-michetti', 'RAQ', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'David Murphy', 'david-murphy', 'STS9', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Shira Elias', 'shira-elias', 'Turkuaz', (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Gabriel Polomo', 'gabriel-polomo', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'turntables'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jeff Waful', 'jeff-waful', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Ann Marie Calhoun', 'ann-marie-calhoun', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'violin'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Tuphace', 'tuphace', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Mutlu Onaral', 'mutlu-onaral', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Scott Metzger', 'scott-metzger', 'RANA, Particle', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'John Kim', 'john-kim', 'the Ally', (SELECT "id" FROM "instruments" WHERE "slug" = 'violin'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Robbie Gennett', 'robbie-gennett', 'Rudy', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Brendan Bayliss', 'brendan-bayliss', 'Umphrey''s McGee', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Holly Bowling', 'holly-bowling', 'as Leora', (SELECT "id" FROM "instruments" WHERE "slug" = 'piano'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Simon Green', 'simon-green', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Dan Lebowitz', 'dan-lebowitz', 'ALO', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Chris Barron', 'chris-barron', 'The Spin Doctors', (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Dirty Harry', 'dirty-harry', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Don Cheegro', 'don-cheegro', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Adam Deitch', 'adam-deitch', 'Pretty Lights', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Johnny Rabb', 'johnny-rabb', 'BioDiesel', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Simon Posford', 'simon-posford', 'Hallucinogen', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Brock Butler', 'brock-butler', 'Perpetual Groove', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Joel Cummins', 'joel-cummins', 'Umphrey''s McGee', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Keller Williams', 'keller-williams', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Dean Tovey', 'dean-tovey', 'Skydog Gypsy', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Danny Riser', 'danny-riser', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Shawn Hennessey', 'shawn-hennessey', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Brian Griffin', 'brian-griffin', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Adam William Davis', 'adam-william-davis', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Matt Pierce', 'matt-pierce', 'Lake Trout', (SELECT "id" FROM "instruments" WHERE "slug" = 'flute'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Reid Genauer', 'reid-genauer', 'Strangefolk', (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Brett Joseph', 'brett-joseph', 'Fat Mama', (SELECT "id" FROM "instruments" WHERE "slug" = 'saxophone'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Steve Molitz', 'steve-molitz', 'Particle', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Marco Benevento', 'marco-benevento', 'The Duo', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'John Medeski', 'john-medeski', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Scotty Zwang', 'scotty-zwang', 'Dopapod', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Ed Mann', 'ed-mann', 'Frank Zappa', (SELECT "id" FROM "instruments" WHERE "slug" = 'vibraphone'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Darren Shearer', 'darren-shearer', 'The New Deal', (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Joe Zarick', 'joe-zarick', 'Indobox', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Mike Carter', 'mike-carter', 'Indobox', (SELECT "id" FROM "instruments" WHERE "slug" = 'guitar'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Pauly Herron', 'pauly-herron', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'percussion'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Govinda Meyer', 'govinda-meyer', 'aka Flute Girl', (SELECT "id" FROM "instruments" WHERE "slug" = 'flute'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Vic Vucheck', 'vic-vucheck', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'flute'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Oteil Burbridge', 'oteil-burbridge', 'Allman Brothers Band', (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Benny Bloom', 'benny-bloom', 'Lettuce', (SELECT "id" FROM "instruments" WHERE "slug" = 'trumpet'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Greg Sherrod', 'greg-sherrod', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'vocals'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Zach Brownstein', 'zach-brownstein', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'drums'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Karina Rykman', 'karina-rykman', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Johnny Zula', 'johnny-zula', NULL, (SELECT "id" FROM "instruments" WHERE "slug" = 'percussion'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'John Popper', 'john-popper', 'Blues Traveler', (SELECT "id" FROM "instruments" WHERE "slug" = 'harmonica'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Antibalas Horns', 'antibalas-horns', 'Antibalas Afrobeat Orchestra', (SELECT "id" FROM "instruments" WHERE "slug" = 'horns'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Gabe Mervine', 'gabe-mervine', 'The Motet', (SELECT "id" FROM "instruments" WHERE "slug" = 'horns'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Drew Sayers', 'drew-sayers', 'The Motet', (SELECT "id" FROM "instruments" WHERE "slug" = 'horns'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Trevor Garrod', 'trevor-garrod', 'Tea Leaf Green', (SELECT "id" FROM "instruments" WHERE "slug" = 'keys'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Natalie Cressman', 'natalie-cressman', 'Trey Anastasio Band', (SELECT "id" FROM "instruments" WHERE "slug" = 'trombone'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Jen Hartswick', 'jen-hartswick', 'Trey Anastasio Band', (SELECT "id" FROM "instruments" WHERE "slug" = 'trumpet'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'Ryan Stasik', 'ryan-stasik', 'Umphrey''s McGee', (SELECT "id" FROM "instruments" WHERE "slug" = 'bass'), now()
ON CONFLICT ("slug") DO NOTHING;
INSERT INTO "musicians" ("name", "slug", "known_from", "default_instrument_id", "updated_at")
SELECT 'T.K. Kyan', 'tk-kyan', 'Foxtrot Zulu', (SELECT "id" FROM "instruments" WHERE "slug" = 'saxophone'), now()
ON CONFLICT ("slug") DO NOTHING;
