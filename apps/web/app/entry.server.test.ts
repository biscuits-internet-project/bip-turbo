import { createRequestHandler } from "react-router";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { handleError } from "~/entry.server";
import { logger } from "~/server/logger";

vi.mock("~/server/logger", () => {
  const logger = { error: vi.fn(), warn: vi.fn(), info: vi.fn() };
  return { logger, createLogger: () => logger };
});
vi.mock("~/server/memory-log", () => ({ startMemoryLogging: vi.fn() }));

const loaderFailure = new TypeError("loader blew up");

// A one-route app, run through React Router's real request handling, so this
// covers what the framework passes to the exported handleError.
const handler = createRequestHandler({
  routes: {
    root: {
      id: "root",
      path: "",
      module: { default: () => null, ErrorBoundary: () => null },
    },
    broken: {
      id: "broken",
      parentId: "root",
      path: "broken",
      module: {
        default: () => null,
        loader: () => {
          throw loaderFailure;
        },
      },
    },
  },
  entry: {
    module: {
      default: () => new Response("rendered"),
      handleError,
    },
  },
  assets: { entry: { imports: [], module: "" }, routes: {}, url: "", version: "test" },
  future: {},
  ssr: true,
  isSpaMode: false,
  publicPath: "/",
  basename: "/",
  assetsBuildDirectory: "",
  prerender: [],
  routeDiscovery: { mode: "lazy", manifestPath: "/__manifest" },
} as unknown as Parameters<typeof createRequestHandler>[0]);

describe("handleError", () => {
  beforeEach(() => vi.mocked(logger.error).mockClear());

  test("logs an error thrown by a page loader", async () => {
    await handler(new Request("https://discobiscuits.net/broken?token=secret"));

    expect(logger.error).toHaveBeenCalledWith("Uncaught server error: TypeError: loader blew up", {
      error: loaderFailure,
      method: "GET",
      path: "/broken",
    });
  });

  test("logs an error thrown during a client-side navigation", async () => {
    await handler(new Request("https://discobiscuits.net/broken.data"));

    expect(logger.error).toHaveBeenCalledWith(
      "Uncaught server error: TypeError: loader blew up",
      expect.objectContaining({ error: loaderFailure }),
    );
  });

  test("stays quiet when a bot requests a URL that doesn't exist", async () => {
    await handler(new Request("https://discobiscuits.net/wp-admin.php"));

    expect(logger.error).not.toHaveBeenCalled();
  });
});
