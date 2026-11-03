import { beforeEach, describe, expect, test, vi } from "vitest";

const findBySlug = vi.fn();
const searchSongs = vi.fn().mockResolvedValue([]);
const logError = vi.fn();

class InvalidSearchQueryError extends Error {}
vi.mock("@bip/core", () => ({ InvalidSearchQueryError }));
vi.mock("~/lib/logger", () => ({ logger: { error: logError, info: vi.fn(), warn: vi.fn() } }));
vi.mock("~/server/services", () => ({
  services: { songs: { findBySlug }, venues: { findBySlug }, shows: { findBySlug }, postgresSearch: { searchSongs } },
}));

const { action } = await import("./index");

async function callTool(name: string, args: unknown) {
  const request = new Request("http://localhost/mcp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
  });
  const res = (await action({ request } as never)) as Response;
  const body = await res.json();
  return body.result as { isError?: boolean; content: Array<{ text: string }> };
}

describe("MCP tool arguments are checked against the declared schema", () => {
  beforeEach(() => vi.clearAllMocks());

  // Handlers cast `args.slug as string` and hand it to Prisma, so an object ran as a
  // Prisma filter and a number came back as Prisma's full invocation dump.
  test.each([
    ["an object where a string is declared", { slug: { contains: "a" } }],
    ["a number where a string is declared", { slug: 123 }],
    ["a missing required argument", {}],
  ])("rejects %s before any query runs", async (_label, args) => {
    const result = await callTool("get_song", args);

    expect(result.isError).toBe(true);
    expect(findBySlug).not.toHaveBeenCalled();
  });

  test("rejects a value outside the declared enum", async () => {
    const result = await callTool("get_song_performances", { songSlug: "basis-for-a-day", sortBy: "1; drop" });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("sortBy");
  });

  test("valid arguments reach the handler", async () => {
    findBySlug.mockResolvedValueOnce(null);
    await callTool("get_song", { slug: "basis-for-a-day" });
    expect(findBySlug).toHaveBeenCalledWith("basis-for-a-day");
  });

  // Clients often stringify numbers; the handlers used to coerce them, so keep that working.
  test("a numeric string is accepted for a number argument", async () => {
    const result = await callTool("search_songs", { query: "basis", limit: "20" });
    expect(result.isError).toBeUndefined();
    expect(searchSongs).toHaveBeenCalledWith("basis", 20);
  });

  test("a non-numeric string is still rejected for a number argument", async () => {
    const result = await callTool("search_songs", { query: "basis", limit: "twenty" });
    expect(result.isError).toBe(true);
    expect(searchSongs).not.toHaveBeenCalled();
  });

  // Internals stay in the log; the caller gets a fixed message.
  test("an unexpected failure returns a generic message", async () => {
    findBySlug.mockRejectedValueOnce(new Error("Invalid `prisma.song.findUnique()` invocation: {...}"));

    const result = await callTool("get_song", { slug: "basis-for-a-day" });

    expect(result.content[0].text).toBe("Error: Internal error");
    expect(logError).toHaveBeenCalled();
  });
});
