-- Memory Leak Analysis Queries
-- These queries help identify WHICH requests/routes are causing memory leaks

-- 1. Find requests that consistently leak memory (positive deltas)
SELECT 
  request_url,
  request_method,
  COUNT(*) as request_count,
  AVG(memory_delta) as avg_memory_growth_mb,
  MAX(memory_delta) as max_memory_growth_mb,
  SUM(memory_delta) as total_memory_growth_mb
FROM memory_metrics
WHERE memory_delta > 0
  AND request_url IS NOT NULL
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY request_url, request_method
ORDER BY avg_memory_growth_mb DESC
LIMIT 20;

-- 2. Compare before/after for specific routes
WITH route_stats AS (
  SELECT 
    request_url,
    label,
    AVG(heap_used) as avg_heap_mb,
    COUNT(*) as count
  FROM memory_metrics
  WHERE request_url IS NOT NULL
    AND created_at > NOW() - INTERVAL '1 hour'
  GROUP BY request_url, label
)
SELECT 
  rs1.request_url,
  rs1.avg_heap_mb as before_avg_mb,
  rs2.avg_heap_mb as after_avg_mb,
  rs2.avg_heap_mb - rs1.avg_heap_mb as memory_growth_mb,
  rs1.count as before_count,
  rs2.count as after_count
FROM route_stats rs1
JOIN route_stats rs2 ON rs1.request_url = rs2.request_url
WHERE rs1.label LIKE 'before-%'
  AND rs2.label LIKE 'after-%'
ORDER BY memory_growth_mb DESC;

-- 3. Memory growth trend over time (identify when it starts growing)
SELECT 
  DATE_TRUNC('minute', created_at) as minute,
  AVG(heap_used) as avg_heap_mb,
  AVG(rss) as avg_rss_mb,
  COUNT(*) as request_count,
  AVG(memory_delta) as avg_delta_mb
FROM memory_metrics
WHERE created_at > NOW() - INTERVAL '2 hours'
GROUP BY minute
ORDER BY minute DESC;

-- 4. Routes with highest memory usage (not just growth)
SELECT 
  request_url,
  request_method,
  AVG(heap_used) as avg_heap_mb,
  MAX(heap_used) as max_heap_mb,
  AVG(rss) as avg_rss_mb,
  COUNT(*) as sample_count
FROM memory_metrics
WHERE request_url IS NOT NULL
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY request_url, request_method
ORDER BY avg_heap_mb DESC
LIMIT 20;

-- 5. Find routes that never free memory (always positive deltas)
SELECT 
  request_url,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN memory_delta > 0 THEN 1 END) as leaking_requests,
  COUNT(CASE WHEN memory_delta <= 0 THEN 1 END) as clean_requests,
  ROUND(100.0 * COUNT(CASE WHEN memory_delta > 0 THEN 1 END) / COUNT(*), 2) as leak_percentage
FROM memory_metrics
WHERE request_url IS NOT NULL
  AND memory_delta IS NOT NULL
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY request_url
HAVING COUNT(CASE WHEN memory_delta > 0 THEN 1 END) > 5
ORDER BY leak_percentage DESC, leaking_requests DESC;

