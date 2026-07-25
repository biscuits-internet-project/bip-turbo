-- Move the same-person rater merge rules out of code and into the database.
--
-- These rules used to be the hardcoded ALIAS_MERGE_GROUPS / NO_AUTO_MERGE constants in
-- packages/core/src/ratings/rater-aliases.ts, so acting on a newly-found duplicate account
-- meant a deploy, and the local environment could not see prod's decisions at all. As rows
-- they sync to local like any other table, and the prod-only duplicate-account job can add
-- an inbox it proved without shipping code.
--
-- The seed reproduces the constants exactly, INCLUDING each group's chosen representative
-- (hankscorpio, invisblebuddha), so aliasKey returns byte-identical keys and no rating
-- score moves when this migration applies.

CREATE TABLE "rater_alias_groups" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid(),
    "normalized_username" varchar NOT NULL,
    "group_key" varchar NOT NULL,
    "merged" boolean NOT NULL DEFAULT true,
    "source" varchar NOT NULL DEFAULT 'curated',
    "reason_codes" text[] NOT NULL DEFAULT '{}',
    "namespace_signal" varchar,
    "namespace_fingerprint" varchar,
    "note" text,
    "created_at" timestamp(6) NOT NULL DEFAULT now(),
    "updated_at" timestamp(6) NOT NULL DEFAULT now(),

    CONSTRAINT "rater_alias_groups_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "rater_alias_groups_normalized_username_unique" ON "rater_alias_groups" ("normalized_username");
CREATE INDEX "rater_alias_groups_group_key_idx" ON "rater_alias_groups" ("group_key");
CREATE INDEX "rater_alias_groups_updated_at_idx" ON "rater_alias_groups" ("updated_at");

-- Keyed by normalized username (a stable natural key), never by row id: ids differ
-- between the local prod-restore and prod, and an id-matched data migration fails
-- silently on prod rather than erroring.
INSERT INTO "rater_alias_groups"
    ("normalized_username", "group_key", "merged", "source", "reason_codes", "namespace_signal", "note")
VALUES
    ('invisblebuddha', 'invisblebuddha', true, 'curated', '{}', NULL,
     'One-letter username variants, two of them created 8 minutes apart. One person.'),
    ('invisiblebuddha', 'invisblebuddha', true, 'curated', '{}', NULL,
     'One-letter username variants, two of them created 8 minutes apart. One person.'),
    ('hankscorpio', 'hankscorpio', true, 'curated', '{shared-alias-namespace}', 'shared-33mail-subdomain',
     'All three accounts authenticate under one personal alias namespace and are each email-confirmed, so every verification link landed in one inbox.'),
    ('deepdive', 'hankscorpio', true, 'curated', '{shared-alias-namespace}', 'shared-33mail-subdomain',
     'All three accounts authenticate under one personal alias namespace and are each email-confirmed, so every verification link landed in one inbox.'),
    ('mojobisco', 'hankscorpio', true, 'curated', '{shared-alias-namespace}', 'shared-33mail-subdomain',
     'All three accounts authenticate under one personal alias namespace and are each email-confirmed, so every verification link landed in one inbox.'),
    ('digitalbuddha', 'digitalbuddha', false, 'curated', '{}', NULL,
     'Held out of auto-merge: both accounts rated, with no email or name link and only a weak activity handoff, so they may be different people.')
ON CONFLICT ("normalized_username") DO NOTHING;
