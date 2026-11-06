import { UNSAFE_ErrorResponseImpl as ErrorResponse } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { logger } from "~/server/logger";
import { reportServerError } from "./report-server-error";

vi.mock("~/server/logger", () => ({ logger: { error: vi.fn() } }));

const request = () => new Request("https://discobiscuits.net/shows/some-show?token=secret");

describe("reportServerError", () => {
  beforeEach(() => vi.mocked(logger.error).mockClear());

  test("logs an uncaught error under a message naming it, without the query string", () => {
    const error = new TypeError("Cannot read properties of undefined");

    reportServerError(error, request());

    expect(logger.error).toHaveBeenCalledWith("Uncaught server error: TypeError: Cannot read properties of undefined", {
      error,
      method: "GET",
      path: "/shows/some-show",
    });
  });

  test("uses only the first line of a multi-line message, so Prisma errors still group", () => {
    reportServerError(new Error("\nInvalid `prisma.show.findMany()` invocation:\n\nquery details"), request());

    expect(vi.mocked(logger.error).mock.calls[0][0]).toBe(
      "Uncaught server error: Error: Invalid `prisma.show.findMany()` invocation:",
    );
  });

  test("caps the message so a very long error can't blow up the grouping label", () => {
    reportServerError(new Error("x".repeat(500)), request());

    expect(vi.mocked(logger.error).mock.calls[0][0].length).toBeLessThanOrEqual("Uncaught server error: ".length + 120);
  });

  test("logs a thrown value that isn't an Error", () => {
    reportServerError("boom", request());

    expect(vi.mocked(logger.error).mock.calls[0][0]).toBe("Uncaught server error: boom");
  });

  test("ignores requests the visitor abandoned", () => {
    const controller = new AbortController();
    controller.abort();

    reportServerError(new Error("aborted"), new Request("https://discobiscuits.net/", { signal: controller.signal }));

    expect(logger.error).not.toHaveBeenCalled();
  });

  test("ignores 4xx route errors such as a bot hitting an unknown URL", () => {
    reportServerError(new ErrorResponse(404, "Not Found", null), request());

    expect(logger.error).not.toHaveBeenCalled();
  });

  test("logs the Error wrapped inside a 5xx route error", () => {
    const inner = new Error("loader failed");

    reportServerError(new ErrorResponse(500, "Internal Server Error", inner), request());

    expect(logger.error).toHaveBeenCalledWith(
      "Uncaught server error: Error: loader failed",
      expect.objectContaining({ error: inner }),
    );
  });
});
