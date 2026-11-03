-- Recreate an empty bip database ready for a pg_dump -n public restore.
-- Run connected to the "postgres" database, as the bip superuser:
--   docker exec -i bip-web-postgres psql -U bip -d postgres -v ON_ERROR_STOP=1 < ops/postgres/prepare-database.sql
-- DESTRUCTIVE: drops bip. Only before the dry run and right before cutover.
--
-- A public-only dump carries no CREATE EXTENSION, and on Supabase these three
-- live in public (checked 2026-11-03), so create them there before restoring.
DROP DATABASE IF EXISTS bip WITH (FORCE);
CREATE DATABASE bip OWNER bip;
\connect bip
CREATE EXTENSION vector SCHEMA public;
CREATE EXTENSION pg_trgm SCHEMA public;
CREATE EXTENSION unaccent SCHEMA public;
