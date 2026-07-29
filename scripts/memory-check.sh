#!/usr/bin/env bash
#
# Fail when a change makes the heaviest routes hold more memory per request.
#
# Run before shipping anything that touches a loader, a cached payload, or a
# shared server helper. Production has been OOM-killed by exactly this class of
# regression: a route quietly starts returning more per request, nothing looks
# broken in review, and the container hits its 1536m ceiling days later under
# crawler traffic.
#
#   make mem-check          check the current build against scripts/memory-budgets.json
#   make mem-check-update   rewrite the budgets from this machine's measurements
#
# Requires a build (`make build`), the local Postgres/Redis, and doppler.
#
# Caveats worth knowing before trusting a number:
#   - Absolute values are machine-relative. Compare like for like, and
#     re-baseline on the machine that runs the gate.
#   - Local RSS never plateaus: with no cgroup cap, the GC has no pressure to
#     collect, so RSS is a function of requests served. That is exactly why the
#     request count is fixed — the comparison is only valid at equal load.
#   - This measures per-request retention, not the production working set. It
#     catches "this route gets heavier", which is the regression that has
#     actually bitten, not every possible leak.
set -uo pipefail

PORT="${MEM_CHECK_PORT:-8099}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUDGETS="$REPO_ROOT/scripts/memory-budgets.json"
MODE="${1:-check}"

command -v jq >/dev/null 2>&1 || { echo "memory-check needs jq (brew install jq)"; exit 2; }

# A server left over from an earlier run both competes for resources and gets
# picked up by the sampler below, which silently corrupts every number. Refuse
# rather than measure the wrong process. `react-router dev` does not match this
# pattern, so a running dev server is left alone.
if pgrep -f 'react-router-serve' >/dev/null 2>&1; then
  echo "ABORT: a react-router-serve process is already running:"
  pgrep -fl 'react-router-serve'
  exit 2
fi

[ -f "$REPO_ROOT/apps/web/build/server/index.js" ] || { echo "No build found. Run 'make build' first."; exit 2; }

REQUESTS=$(jq -r '.requestsPerRoute' "$BUDGETS")
TOLERANCE=$(jq -r '.toleranceRatio' "$BUDGETS")

# The doppler-wrapped parent shares its command line with the bun child, so take
# the largest matching process rather than the first: the first is the ~15MB
# wrapper, which would report every route as free.
server_rss() {
  for pid in $(pgrep -f 'react-router-serve'); do ps -o rss= -p "$pid" 2>/dev/null; done \
    | sort -rn | head -1 | awk '{print int($1/1024)}'
}

start_server() {
  cd "$REPO_ROOT/apps/web" || exit 2
  # Cloudflare credentials are deliberately dummied: the env schema requires
  # them, and a real purge token here would let a local check evict the
  # production edge cache.
  PORT="$PORT" \
  CLOUDFLARE_ACCOUNT_ID=local CLOUDFLARE_IMAGES_API_TOKEN=local \
  CLOUDFLARE_ZONE_ID=local CLOUDFLARE_CACHE_PURGE_TOKEN=local \
  BASE_URL="http://localhost:$PORT" \
    doppler run --preserve-env -- bun "$REPO_ROOT/node_modules/.bin/react-router-serve" ./build/server/index.js \
    >/tmp/memory-check-server.log 2>&1 &
  for _ in $(seq 1 60); do
    curl -sf -o /dev/null "http://localhost:$PORT/healthcheck" && return 0
    sleep 1
  done
  echo "server failed to start; see /tmp/memory-check-server.log"
  return 1
}

stop_server() { pkill -9 -f 'react-router-serve' 2>/dev/null; sleep 2; }
trap stop_server EXIT

measure() {
  local url="$1"
  stop_server
  # Redis is flushed so a warm cache from the previous route cannot let this one
  # skip work the baseline included.
  redis-cli -p 6381 FLUSHALL >/dev/null 2>&1
  start_server || return 1

  # Warm once: first-hit compilation and connection setup are startup cost, not
  # per-request cost, and charging them here would inflate short runs.
  curl -s -o /dev/null -m 60 "http://localhost:$PORT$url"
  sleep 2
  local before after codes
  before=$(server_rss)
  codes=$(for _ in $(seq 1 "$REQUESTS"); do curl -s -o /dev/null -m 60 -w '%{http_code}\n' "http://localhost:$PORT$url"; done)
  sleep 3
  after=$(server_rss)

  # A route that 404s is fast and free, and would otherwise pass as a dramatic
  # improvement. Treat a non-200 as a broken measurement, not a good result.
  local bad
  bad=$(echo "$codes" | grep -cv '^200$')
  if [ "$bad" -gt 0 ]; then
    echo "MEASUREMENT INVALID: $bad/$REQUESTS non-200 responses for $url" >&2
    return 1
  fi

  awk -v b="$before" -v a="$after" -v c="$REQUESTS" 'BEGIN {printf "%.2f", (a-b)/c}'
}

failures=0
results=""
route_count=$(jq '.routes | length' "$BUDGETS")

for index in $(seq 0 $((route_count - 1))); do
  name=$(jq -r ".routes[$index].name" "$BUDGETS")
  url=$(jq -r ".routes[$index].url" "$BUDGETS")
  budget=$(jq -r ".routes[$index].budgetMbPerRequest" "$BUDGETS")

  actual=$(measure "$url") || { failures=$((failures + 1)); continue; }
  results="$results$name $actual"$'\n'

  verdict=$(awk -v a="$actual" -v b="$budget" -v t="$TOLERANCE" \
    'BEGIN {printf "%s %.0f", (a > b*t ? "FAIL" : "ok"), (b>0 ? (a-b)/b*100 : 0)}')
  status=${verdict% *}
  delta=${verdict#* }
  printf "%-24s %6s MB/req  budget %6s  %+4s%%  %s\n" "$name" "$actual" "$budget" "$delta" "$status"
  [ "$status" = "FAIL" ] && failures=$((failures + 1))
done

if [ "$MODE" = "update" ]; then
  # Build the measurements with jq rather than by assembling JSON in awk: the
  # hand-rolled version emitted malformed JSON whenever a route failed to
  # measure, and rewrote nothing while still reporting success.
  measured=$(printf '%s' "$results" \
    | jq -R -s 'split("\n") | map(select(length > 0) | split(" ")) | map({(.[0]): (.[1] | tonumber)}) | add // {}')

  tmp=$(mktemp)
  # A route that failed to measure is absent from $measured and keeps its
  # existing budget, so a broken run can never silently relax the gate.
  jq --argjson m "$measured" \
    '.routes |= map(if $m[.name] then .budgetMbPerRequest = $m[.name] else . end)' \
    "$BUDGETS" > "$tmp" && mv "$tmp" "$BUDGETS"

  echo ""
  echo "Budgets rewritten from this run. Review the diff before committing."
  exit 0
fi

if [ "$failures" -gt 0 ]; then
  echo ""
  echo "$failures route(s) over budget (tolerance ${TOLERANCE}x)."
  echo "If the increase is intentional, update scripts/memory-budgets.json and say why in the PR."
  exit 1
fi

echo ""
echo "All routes within budget."
