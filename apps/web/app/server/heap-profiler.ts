import { writeHeapSnapshot } from "node:v8";
import { logger } from "./logger";

let snapshotCount = 0;

export function takeHeapSnapshot(label?: string): string {
  snapshotCount++;
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `heap-${snapshotCount}-${timestamp}${label ? `-${label}` : ""}.heapsnapshot`;
  const path = `/tmp/${filename}`;

  try {
    const snapshotPath = writeHeapSnapshot(path);
    logger.info(`Heap snapshot taken: ${snapshotPath}`, {
      snapshotCount,
      label,
      memoryUsage: process.memoryUsage(),
    });
    return snapshotPath;
  } catch (error) {
    logger.error("Failed to take heap snapshot", { error });
    throw error;
  }
}

// Auto-take snapshots at intervals if enabled
if (process.env.ENABLE_HEAP_SNAPSHOTS === "true") {
  const interval = parseInt(process.env.HEAP_SNAPSHOT_INTERVAL || "60000", 10); // Default 60 seconds

  setInterval(() => {
    takeHeapSnapshot("auto");
  }, interval);

  logger.info(`Auto heap snapshots enabled: every ${interval}ms`);
}
