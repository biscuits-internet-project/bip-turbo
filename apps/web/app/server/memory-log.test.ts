import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { logMemoryUsage, MEMORY_LOG_INTERVAL_MS, startMemoryLogging } from "./memory-log";

function makeLoggerMock() {
  return { info: vi.fn() };
}

describe("logMemoryUsage", () => {
  // The line exists to graph heap growth from container logs, so the payload
  // must be flat integers in MB: greppable and small, not raw byte counts.
  test("emits one line with rss/heap fields rounded to whole MB", () => {
    const logger = makeLoggerMock();

    logMemoryUsage(logger);

    expect(logger.info).toHaveBeenCalledTimes(1);
    const [message, fields] = logger.info.mock.calls[0];
    expect(message).toBe("process memory");
    for (const key of ["rssMb", "heapTotalMb", "heapUsedMb", "externalMb"]) {
      expect(fields[key]).toBeTypeOf("number");
      expect(Number.isInteger(fields[key])).toBe(true);
    }
    expect(fields.rssMb).toBeGreaterThan(0);
  });
});

describe("startMemoryLogging", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // One line per interval, forever, from a single registration.
  test("logs once per interval", () => {
    const logger = makeLoggerMock();
    const stop = startMemoryLogging(logger);

    vi.advanceTimersByTime(MEMORY_LOG_INTERVAL_MS * 3);
    stop();

    expect(logger.info).toHaveBeenCalledTimes(3);
  });

  // entry.server can be re-evaluated (dev-server module invalidation); a
  // second start must not stack a second interval and double the log volume.
  test("second start while active is a no-op", () => {
    const logger = makeLoggerMock();
    const stop = startMemoryLogging(logger);
    const stopAgain = startMemoryLogging(logger);

    vi.advanceTimersByTime(MEMORY_LOG_INTERVAL_MS);
    stop();
    stopAgain();

    expect(logger.info).toHaveBeenCalledTimes(1);
  });
});
