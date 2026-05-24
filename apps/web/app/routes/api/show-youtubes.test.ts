import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// adminAction / publicLoader normally wrap with auth and base loader chrome.
// For route-level unit tests we bypass them and exercise the inner function
// directly so we can isolate body parsing, validation, and service delegation.
vi.mock("~/lib/base-loaders", () => ({
  adminAction: <T>(fn: (args: ActionFunctionArgs) => Promise<T>) => fn,
  publicLoader: <T>(fn: (args: LoaderFunctionArgs) => Promise<T>) => fn,
}));

const listEntriesForShow = vi.fn();
const createForShow = vi.fn();
const deleteEntry = vi.fn();

vi.mock("~/server/services", () => ({
  services: {
    youtube: {
      listEntriesForShow: (...args: unknown[]) => listEntriesForShow(...args),
      createForShow: (...args: unknown[]) => createForShow(...args),
      deleteEntry: (...args: unknown[]) => deleteEntry(...args),
    },
  },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

// Imported after mocks so the route picks up our pass-through wrappers.
const { loader, action } = await import("./show-youtubes");

function makeLoaderRequest(url: string): LoaderFunctionArgs {
  return {
    request: new Request(url),
    params: {},
    context: {},
  } as unknown as LoaderFunctionArgs;
}

function makeActionRequest(body: unknown, method = "POST"): ActionFunctionArgs {
  const init: RequestInit = { method, headers: { "Content-Type": "application/json" } };
  if (method !== "GET" && method !== "HEAD") {
    init.body = JSON.stringify(body);
  }
  return {
    request: new Request("http://localhost/api/show-youtubes", init),
    params: {},
    context: {},
  } as unknown as ActionFunctionArgs;
}

async function readJson(response: unknown): Promise<{ status: number; body: unknown }> {
  const res = response as Response;
  return { status: res.status, body: await res.json() };
}

describe("GET /api/show-youtubes", () => {
  beforeEach(() => {
    listEntriesForShow.mockReset();
  });

  // Happy path: the loader passes showId through to YoutubeService and
  // returns whatever the service hands back. Keeps the route a thin shell.
  test("returns the entry list for a showId", async () => {
    const entries = [{ id: "row-1", videoId: "abc12345678", url: "https://www.youtube.com/watch?v=abc12345678" }];
    listEntriesForShow.mockResolvedValue(entries);

    const result = await loader(makeLoaderRequest("http://localhost/api/show-youtubes?showId=show-1"));

    expect(listEntriesForShow).toHaveBeenCalledWith("show-1");
    expect(result).toEqual(entries);
  });

  // Without showId, the loader returns a 400 Response — never reaches the
  // service. (badRequest() returns rather than throws, so we inspect the
  // returned Response.)
  test("returns 400 when showId is missing", async () => {
    const result = await loader(makeLoaderRequest("http://localhost/api/show-youtubes"));

    expect(listEntriesForShow).not.toHaveBeenCalled();
    expect((result as Response).status).toBe(400);
  });
});

describe("POST /api/show-youtubes", () => {
  beforeEach(() => {
    createForShow.mockReset();
  });

  // Happy path: a full youtube.com URL has its video id extracted by the
  // route and passed to the service. Returning the created row lets the
  // client append optimistically without a follow-up GET.
  test("extracts the video id from a full youtube.com URL and creates the row", async () => {
    createForShow.mockResolvedValue({
      id: "row-new",
      videoId: "dQw4w9WgXcQ",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });

    const result = await action(
      makeActionRequest({ showId: "show-1", input: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
    );

    expect(createForShow).toHaveBeenCalledWith("show-1", "dQw4w9WgXcQ");
    expect(result).toEqual({
      id: "row-new",
      videoId: "dQw4w9WgXcQ",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
  });

  // youtu.be short-links carry the id in the pathname. They're the format
  // YouTube's share UI defaults to, so they're a common paste target.
  test("extracts the video id from a youtu.be short link", async () => {
    createForShow.mockResolvedValue({ id: "row-x", videoId: "abc12345678", url: "" });

    await action(makeActionRequest({ showId: "show-1", input: "https://youtu.be/abc12345678" }));

    expect(createForShow).toHaveBeenCalledWith("show-1", "abc12345678");
  });

  // /embed/<id> URLs come from share dialogs and from copying iframe srcs.
  test("extracts the video id from an /embed/ URL", async () => {
    createForShow.mockResolvedValue({ id: "row-x", videoId: "embed123456", url: "" });

    await action(makeActionRequest({ showId: "show-1", input: "https://www.youtube.com/embed/embed123456" }));

    expect(createForShow).toHaveBeenCalledWith("show-1", "embed123456");
  });

  // Power users sometimes paste just the 11-character id rather than a URL.
  // We accept that directly without re-parsing.
  test("accepts a raw 11-character video id", async () => {
    createForShow.mockResolvedValue({ id: "row-x", videoId: "AbCdEfGhIjK", url: "" });

    await action(makeActionRequest({ showId: "show-1", input: "AbCdEfGhIjK" }));

    expect(createForShow).toHaveBeenCalledWith("show-1", "AbCdEfGhIjK");
  });

  // Input that doesn't look like a video id or a recognizable URL is
  // rejected with 400 + a human-readable error — the UI surfaces this
  // straight to the admin.
  test("rejects garbage input with 400 and an error message", async () => {
    const result = await action(makeActionRequest({ showId: "show-1", input: "not a url" }));

    expect(createForShow).not.toHaveBeenCalled();
    const { status, body } = await readJson(result);
    expect(status).toBe(400);
    expect(body).toEqual({ error: "Could not extract a YouTube video id from that input." });
  });

  // A non-youtube URL is also rejected — same path as garbage input. The
  // route shouldn't try to "make it work" for arbitrary URLs.
  test("rejects URLs from non-youtube hosts with 400", async () => {
    const result = await action(makeActionRequest({ showId: "show-1", input: "https://vimeo.com/123" }));

    expect(createForShow).not.toHaveBeenCalled();
    expect((result as Response).status).toBe(400);
  });

  // Missing showId or input is rejected before we ever try to extract or
  // create anything. Catches malformed client calls early.
  test("returns 400 when showId or input is missing", async () => {
    const noShowId = await action(makeActionRequest({ input: "AbCdEfGhIjK" }));
    expect((noShowId as Response).status).toBe(400);

    const noInput = await action(makeActionRequest({ showId: "show-1" }));
    expect((noInput as Response).status).toBe(400);

    expect(createForShow).not.toHaveBeenCalled();
  });

  // If the service blows up (db error, etc.), the route returns 500 with a
  // generic message — the underlying error is logged but not surfaced to
  // the client (could leak internals).
  test("returns 500 with a generic message when the service throws", async () => {
    createForShow.mockRejectedValue(new Error("db is down"));

    const result = await action(makeActionRequest({ showId: "show-1", input: "AbCdEfGhIjK" }));

    const { status, body } = await readJson(result);
    expect(status).toBe(500);
    expect(body).toEqual({ error: "Failed to add video." });
  });
});

describe("DELETE /api/show-youtubes", () => {
  beforeEach(() => {
    deleteEntry.mockReset();
  });

  // Happy path: pass through the row id and return success. The UI uses
  // this to remove the row from local state.
  test("delegates a valid body to YoutubeService.deleteEntry", async () => {
    deleteEntry.mockResolvedValue(undefined);

    const result = await action(makeActionRequest({ id: "row-1" }, "DELETE"));

    expect(deleteEntry).toHaveBeenCalledWith("row-1");
    expect(result).toEqual({ success: true });
  });

  // Missing id is rejected before reaching the service.
  test("returns 400 when id is missing", async () => {
    const result = await action(makeActionRequest({}, "DELETE"));

    expect(deleteEntry).not.toHaveBeenCalled();
    expect((result as Response).status).toBe(400);
  });

  // Service-level errors become a generic 500 with a logged underlying
  // error, same shape as POST.
  test("returns 500 when the service throws", async () => {
    deleteEntry.mockRejectedValue(new Error("db is down"));

    const result = await action(makeActionRequest({ id: "row-1" }, "DELETE"));

    const { status, body } = await readJson(result);
    expect(status).toBe(500);
    expect(body).toEqual({ error: "Failed to delete video." });
  });
});

describe("/api/show-youtubes method guards", () => {
  beforeEach(() => {
    createForShow.mockReset();
    deleteEntry.mockReset();
  });

  // Anything other than POST or DELETE returns 405 without touching the
  // services.
  test("rejects unsupported methods with 405", async () => {
    const result = await action(makeActionRequest({}, "PUT"));

    expect(createForShow).not.toHaveBeenCalled();
    expect(deleteEntry).not.toHaveBeenCalled();
    expect((result as Response).status).toBe(405);
  });
});
