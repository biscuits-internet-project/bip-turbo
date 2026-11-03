-- Exact row count for every base table in public, one "table|count" line each,
-- sorted by name. Run the same file against two databases and diff the output:
-- the dry run, the restore drill and the cutover all gate on an empty diff.
SELECT table_name || '|' || (xpath('/row/c/text()',
         query_to_xml(format('SELECT count(*) AS c FROM public.%I', table_name), false, true, '')))[1]::text
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;
