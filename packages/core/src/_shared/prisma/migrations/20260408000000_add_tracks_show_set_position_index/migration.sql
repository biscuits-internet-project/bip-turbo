-- Composite index for set opener/closer filter queries.
-- The setOpener and setCloser filters use correlated subqueries that compute
-- MIN/MAX(position) per (show_id, set). Without this index, each subquery
-- does a sequential scan of the full tracks table (~20k+ rows per invocation).
CREATE INDEX CONCURRENTLY IF NOT EXISTS tracks_show_set_position_idx
  ON tracks (show_id, set, position);
