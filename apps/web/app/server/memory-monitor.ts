// Memory monitoring utility to help track down leaks
// Writes memory metrics to the database for analysis
import { dbClient } from "@bip/core";
import { logger } from "./logger";

type RequestMeasurement = {
  heapUsed: number;
  timestamp: number;
};

// Track previous measurement per normalized request endpoint so we can
// calculate true before/after deltas without keeping references forever.
const inflightMeasurements = new Map<string, RequestMeasurement>();
const MEASUREMENT_TTL_MS = 5 * 60 * 1000; // Clean up entries older than 5 minutes

function normalizeRequestKey(options?: LogMemoryUsageOptions): string | null {
  if (!options?.requestUrl) return null;
  try {
    const { pathname } = new URL(options.requestUrl);
    return `${options.requestMethod ?? "UNKNOWN"} ${pathname}`;
  } catch {
    // Fallback to raw URL if parsing fails
    return options.requestUrl;
  }
}

function cleanupStaleMeasurements() {
  const now = Date.now();
  for (const [key, measurement] of inflightMeasurements.entries()) {
    if (now - measurement.timestamp > MEASUREMENT_TTL_MS) {
      inflightMeasurements.delete(key);
    }
  }
}

export function getMemoryUsage() {
  const usage = process.memoryUsage();
  return {
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    external: Math.round(usage.external / 1024 / 1024),
    rss: Math.round(usage.rss / 1024 / 1024),
  };
}

interface LogMemoryUsageOptions {
  label?: string;
  requestMethod?: string;
  requestUrl?: string;
}

/**
 * Logs memory usage and optionally writes to database
 * Database writes are async and non-blocking - failures are logged but don't throw
 */
export async function logMemoryUsage(label: string, options?: LogMemoryUsageOptions): Promise<void> {
  const usage = getMemoryUsage();

  cleanupStaleMeasurements();

  // Calculate delta for the same route/path per request
  const requestKey = normalizeRequestKey(options);
  const isBeforeMeasurement = label.toLowerCase().startsWith("before-");
  const isAfterMeasurement = label.toLowerCase().startsWith("after-");

  let memoryDelta: number | null = null;
  if (requestKey && isAfterMeasurement) {
    const previous = inflightMeasurements.get(requestKey);
    if (previous) {
      memoryDelta = usage.heapUsed - previous.heapUsed;
      // Remove the entry so we don't accumulate per-request data indefinitely
      inflightMeasurements.delete(requestKey);
    }
  }

  // Store the "before" measurement so we can compare once the request finishes
  if (requestKey && isBeforeMeasurement) {
    inflightMeasurements.set(requestKey, {
      heapUsed: usage.heapUsed,
      timestamp: Date.now(),
    });
  }

  const deltaDisplay = memoryDelta !== null ? (memoryDelta >= 0 ? `+${memoryDelta}` : `${memoryDelta}`) : "";

  // Always log to console/logger
  logger.info(`[MEMORY] ${label}:`, {
    heapUsed: `${usage.heapUsed}MB`,
    rss: `${usage.rss}MB`,
    ...(deltaDisplay && { delta: `${deltaDisplay}MB` }),
    ...(options?.requestUrl && { url: options.requestUrl }),
  });

  // Write to database if enabled (non-blocking)
  if (process.env.ENABLE_MEMORY_DB_LOGGING === "true") {
    // Fire and forget - don't block the request
    dbClient
      .$executeRawUnsafe(
        `INSERT INTO memory_metrics (label, heap_used, heap_total, external, rss, request_method, request_url, memory_delta, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        options?.label || label,
        usage.heapUsed,
        usage.heapTotal,
        usage.external,
        usage.rss,
        options?.requestMethod || null,
        options?.requestUrl || null,
        memoryDelta,
      )
      .catch((error: unknown) => {
        // Log but don't throw - memory logging shouldn't break the app
        logger.error("Failed to write memory metric to database", { error });
      });
  }
}
