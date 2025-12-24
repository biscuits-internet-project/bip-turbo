# Memory Leak Profiling Guide

## The Problem

We have a server-side memory leak that causes memory to slowly creep up until the server crashes. Previous fixes based on educated guesses haven't resolved it.

## Database-Backed Memory Profiling

Memory metrics are now written to the `memory_metrics` table in the database. This allows you to:

1. **Query trends over time** - See how memory grows
2. **Compare before/after requests** - Identify which requests cause leaks
3. **Visualize in SQL** - Use any SQL tool to analyze patterns

### Enable Database Logging

Set environment variable:

```bash
ENABLE_MEMORY_MONITORING=true ENABLE_MEMORY_DB_LOGGING=true npm run dev
```

### Query Memory Metrics

```sql
-- See memory growth over time
SELECT
  created_at,
  label,
  heap_used,
  rss,
  request_method,
  request_url
FROM memory_metrics
ORDER BY created_at DESC
LIMIT 100;

-- Compare before/after for specific requests
SELECT
  label,
  AVG(heap_used) as avg_heap_used,
  AVG(rss) as avg_rss,
  COUNT(*) as count
FROM memory_metrics
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY label
ORDER BY avg_heap_used DESC;

-- Find requests that cause memory growth
WITH before_after AS (
  SELECT
    request_url,
    MAX(CASE WHEN label LIKE 'before-%' THEN heap_used END) as before_heap,
    MAX(CASE WHEN label LIKE 'after-%' THEN heap_used END) as after_heap
  FROM memory_metrics
  WHERE created_at > NOW() - INTERVAL '1 hour'
    AND request_url IS NOT NULL
  GROUP BY request_url
)
SELECT
  request_url,
  before_heap,
  after_heap,
  after_heap - before_heap as memory_growth
FROM before_after
WHERE after_heap > before_heap
ORDER BY memory_growth DESC;

-- Memory trend over time (last hour)
SELECT
  DATE_TRUNC('minute', created_at) as minute,
  AVG(heap_used) as avg_heap_used,
  AVG(rss) as avg_rss,
  COUNT(*) as request_count
FROM memory_metrics
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY minute
ORDER BY minute DESC;
```

## Alternative: Chrome DevTools Profiling

### Step 1: Enable Node.js Inspector

Run the server with the `--inspect` flag to enable Chrome DevTools:

```bash
# Development
ENABLE_MEMORY_MONITORING=true node --inspect --expose-gc node_modules/.bin/react-router dev

# Production (after build)
ENABLE_MEMORY_MONITORING=true node --inspect --expose-gc ./node_modules/.bin/react-router-serve ./build/server/index.js --port 8080
```

Then:

1. Open Chrome and go to `chrome://inspect`
2. Click "inspect" under your Node.js process
3. Go to the "Memory" tab
4. Take heap snapshots before and after processing requests

### Step 2: Take Heap Snapshots Programmatically

The code includes `heap-profiler.ts` which can take snapshots automatically:

```bash
# Take snapshots before/after each request (expensive!)
TAKE_HEAP_SNAPSHOT=true ENABLE_MEMORY_MONITORING=true npm run dev

# Take snapshots every 60 seconds automatically
ENABLE_HEAP_SNAPSHOTS=true HEAP_SNAPSHOT_INTERVAL=60000 npm run dev
```

Snapshots are saved to `/tmp/heap-*.heapsnapshot`

### Step 3: Analyze Heap Snapshots

1. Open Chrome DevTools → Memory tab
2. Load a heap snapshot file
3. Compare snapshots:
   - Take snapshot #1: baseline (server just started)
   - Process 10-20 requests
   - Take snapshot #2: after requests
   - Compare the two snapshots

Look for:

- Objects that grew significantly
- Retained size (not just shallow size)
- Objects with many instances
- Common patterns: Maps, Sets, Arrays, Closures

### Step 4: Identify the Leak

Common culprits to check:

1. **React Query QueryClient** - Check if QueryClient instances accumulate
2. **React Context providers** - Check if contexts accumulate
3. **Event listeners** - Check for listeners that aren't removed
4. **Closures** - Check for closures holding references to request data
5. **Streams** - Check if streams aren't properly closed
6. **Database connections** - Check Prisma connection pool
7. **Redis connections** - Check Redis client connections
8. **Winston logger** - Check if logger accumulates logs

### Step 5: Use Allocation Timeline

In Chrome DevTools Memory tab:

1. Click "Allocation instrumentation on timeline"
2. Start recording
3. Process requests
4. Stop recording
5. Look for objects that are allocated but never freed

## What We've Already Tried (Guesses)

1. ✅ QueryClient per-request using `useState`
2. ✅ `gcTime: 0` for server-side QueryClient
3. ✅ `enabled: false` for server-side queries
4. ✅ Explicit `queryClient.clear()` after render
5. ✅ setTimeout closure cleanup in entry.server.tsx
6. ✅ Logger event listener deduplication
7. ✅ Winston exception/rejection handler disabling

**None of these fixed the leak**, which means we need actual profiling data to find the real cause.

## Next Steps

1. **Enable database logging** - `ENABLE_MEMORY_DB_LOGGING=true`
2. **Process requests** - Let the server run and handle traffic
3. **Query the database** - Use SQL queries above to find patterns
4. **Identify the leak** - Look for requests that cause memory growth
5. **Fix the actual leak** - Based on real data, not guesses

## Environment Variables

- `ENABLE_MEMORY_MONITORING=true` - Logs memory usage before/after requests (console)
- `ENABLE_MEMORY_DB_LOGGING=true` - Writes memory metrics to database
- `TAKE_HEAP_SNAPSHOT=true` - Takes heap snapshot before/after each request (expensive!)
- `ENABLE_HEAP_SNAPSHOTS=true` - Auto-takes snapshots at intervals
- `HEAP_SNAPSHOT_INTERVAL=60000` - Interval in ms for auto snapshots (default: 60s)

## Database Schema

The `memory_metrics` table stores:

- `heap_used` - Heap memory used (MB)
- `heap_total` - Total heap memory (MB)
- `external` - External memory (MB)
- `rss` - Resident Set Size (MB)
- `label` - Label (e.g., "before-GET", "after-POST")
- `request_method` - HTTP method
- `request_url` - Request URL
- `created_at` - Timestamp

Indexes on `created_at` and `label` for fast queries.
