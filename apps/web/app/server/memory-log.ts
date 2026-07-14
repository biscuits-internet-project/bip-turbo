import type { Logger } from "@bip/domain";

export const MEMORY_LOG_INTERVAL_MS = 60_000;

const BYTES_PER_MB = 1024 * 1024;

/**
 * Emit one flat, greppable line of process memory stats. Exists so container
 * logs carry a minute-by-minute RSS/heap timeline: the evidence needed to
 * tell a slow leak from allocation churn ratcheting the heap high-water mark
 * (see the 2026-07 OOM incidents).
 */
export function logMemoryUsage(logger: Pick<Logger, "info">): void {
  const usage = process.memoryUsage();
  logger.info("process memory", {
    rssMb: Math.round(usage.rss / BYTES_PER_MB),
    heapTotalMb: Math.round(usage.heapTotal / BYTES_PER_MB),
    heapUsedMb: Math.round(usage.heapUsed / BYTES_PER_MB),
    externalMb: Math.round(usage.external / BYTES_PER_MB),
  });
}

// Keyed on globalThis (not module scope) because the dev server re-evaluates
// server modules on invalidation; a fresh module instance must still see that
// an interval is already running or every reload would stack another one.
const ACTIVE_INTERVAL_KEY = Symbol.for("bip.memoryLogInterval");
type GlobalWithMemoryLog = typeof globalThis & {
  [ACTIVE_INTERVAL_KEY]?: ReturnType<typeof setInterval>;
};

/**
 * Start the once-a-minute memory log line. Idempotent while active. Returns
 * a stop function (used by tests; production never stops).
 */
export function startMemoryLogging(
  logger: Pick<Logger, "info">,
  intervalMs: number = MEMORY_LOG_INTERVAL_MS,
): () => void {
  const globalState = globalThis as GlobalWithMemoryLog;
  if (globalState[ACTIVE_INTERVAL_KEY]) return () => {};

  const interval = setInterval(() => logMemoryUsage(logger), intervalMs);
  interval.unref?.();
  globalState[ACTIVE_INTERVAL_KEY] = interval;

  return () => {
    clearInterval(interval);
    if (globalState[ACTIVE_INTERVAL_KEY] === interval) {
      delete globalState[ACTIVE_INTERVAL_KEY];
    }
  };
}
