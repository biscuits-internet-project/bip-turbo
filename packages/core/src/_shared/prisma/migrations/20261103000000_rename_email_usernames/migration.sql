-- Usernames render publicly (/community, profile URLs, reviews), and some older accounts
-- had an email address as their username. Rename each to the part before the "@", reduced to the alphabet signup produces
-- (UserService.sanitizeUsername: lowercase a-z, 0-9, ".", "_", "-"). A name that is
-- taken (case-insensitively) or shorter than the 3-character minimum gets the lowest
-- numeric suffix that frees it.
--
-- Matched on the username itself (the natural key), never on row id. Idempotent: once
-- renamed, no username contains "@", so a re-run touches nothing.
DO $$
DECLARE
  r record;
  base text;
  candidate text;
  n int;
BEGIN
  FOR r IN SELECT id, username FROM "users" WHERE "username" LIKE '%@%' ORDER BY "created_at", "username" LOOP
    base := lower(regexp_replace(split_part(r.username, '@', 1), '[^a-zA-Z0-9._-]', '', 'g'));
    IF base = '' THEN base := 'user'; END IF;
    candidate := left(base, 50);
    n := 1;
    WHILE length(candidate) < 3
      OR EXISTS (SELECT 1 FROM "users" WHERE lower("username") = candidate AND "id" <> r.id) LOOP
      candidate := left(base, 50 - length(n::text)) || n::text;
      n := n + 1;
    END LOOP;
    UPDATE "users" SET "username" = candidate, "updated_at" = now() WHERE "id" = r.id;
  END LOOP;
END $$;

-- And keep it that way: no write path (signup, rename, admin, sync) may store an "@" in a
-- username again. Added after the rename above, so every existing row already satisfies it.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_username_no_at') THEN
    ALTER TABLE "users" ADD CONSTRAINT "users_username_no_at" CHECK ("username" NOT LIKE '%@%');
  END IF;
END $$;
