// Memory monitoring utility to help track down leaks
// Add this to your entry.server.tsx or a middleware to track memory usage
import { logger } from "./logger";

export function logMemoryUsage(label: string) {
  if (process.env.NODE_ENV === "production") {
    const usage = process.memoryUsage();
    logger.info(`[MEMORY] ${label}:`, {
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(usage.external / 1024 / 1024)}MB`,
      rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    });
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
