import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { logMemoryUsage, MEMORY_LOG_INTERVAL_MS, startMemoryLogging } from "./memory-log";
import { drainRequestCounts, recordRequest } from "./request-counts";

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

  // The RSS number alone can't say what caused a jump. Carrying the interval's
  // route counts on the same line is what makes the timeline attributable —
  // the 2026-07 investigation had to infer traffic from cache TTLs instead.
  test("carries the interval's per-route request counts", () => {
    drainRequestCounts();
    recordRequest("/shows/year/2001", "?photos=yes", true);
    const logger = makeLoggerMock();

    logMemoryUsage(logger);

    expect(logger.info.mock.calls[0][1].requests).toEqual({ "shows/year?": 1, bot: 1 });
  });

  // Draining on emit is what scopes each line to its own interval; without it
  // every line would report cumulative traffic since boot and no line could be
  // compared against its own RSS delta.
  test("resets the counts so the next line covers only new traffic", () => {
    drainRequestCounts();
    recordRequest("/songs", "");
    const logger = makeLoggerMock();

    logMemoryUsage(logger);
    logMemoryUsage(logger);

    expect(logger.info.mock.calls[1][1].requests).toEqual({});
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
