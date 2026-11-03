-- Per-query timing stats for the Grafana Postgres dashboard. Prod loads the
-- library via shared_preload_libraries (config/deploy.yml); creating the
-- extension succeeds without it, and only querying the view needs the preload.
-- Local Supabase already has it, so this is a no-op there.
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
