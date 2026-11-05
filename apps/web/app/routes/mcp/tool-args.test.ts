import { beforeEach, describe, expect, test, vi } from "vitest";

const findBySlug = vi.fn();
const searchSongs = vi.fn().mockResolvedValue([]);
const logError = vi.fn();

class InvalidSearchQueryError extends Error {}
vi.mock("@bip/core", () => ({ InvalidSearchQueryError }));
vi.mock("~/lib/logger", () => ({ logger: { error: logError, info: vi.fn(), warn: vi.fn() } }));
vi.mock("~/server/rate-limit", () => ({ enforceCallerRateLimit: vi.fn(), enforceRateLimit: vi.fn() }));
const KEY_CALLER = { kind: "apiKey", keyId: "k1", userId: "u1" };
vi.mock("~/server/api-caller", () => ({
  authenticateApiCaller: vi.fn(async () => KEY_CALLER),
  apiCallerIdentity: () => "key:k1",
  raisedLimit: () => undefined,
}));
const mcpEnv = vi.hoisted(() => ({
  BASE_URL: "https://discobiscuits.net",
  SUPABASE_URL: "https://ref.supabase.co",
  MCP_ALLOW_ANONYMOUS: undefined as string | undefined,
}));
vi.mock("~/server/env", () => ({ env: mcpEnv }));
vi.mock("~/server/services", () => ({
  services: { songs: { findBySlug }, venues: { findBySlug }, shows: { findBySlug }, postgresSearch: { searchSongs } },
}));

const { action } = await import("./index");

function postTool(name: string, args: unknown, path = "/mcp") {
  const request = new Request(`https://discobiscuits.net${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }),
  });
  return action({ request } as never) as Promise<Response>;
}

async function callTool(name: string, args: unknown) {
  const res = await postTool(name, args);
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

describe("MCP sign-in and rate limit", () => {
  test("turns away a caller with no credential, pointing it at the sign-in metadata", async () => {
    const { authenticateApiCaller } = await import("~/server/api-caller");
    vi.clearAllMocks();
    vi.mocked(authenticateApiCaller).mockResolvedValueOnce(null);

    const res = await postTool("get_song", { slug: "basis-for-a-day" });

    expect(res.status).toBe(401);
    expect(res.headers.get("WWW-Authenticate")).toBe(
      'Bearer resource_metadata="https://discobiscuits.net/.well-known/oauth-protected-resource/mcp"',
    );
    expect(findBySlug).not.toHaveBeenCalled();
  });

  test("counts a signed-in caller against its own budget", async () => {
    const { enforceCallerRateLimit } = await import("~/server/rate-limit");
    vi.clearAllMocks();

    await callTool("get_song", { slug: "basis-for-a-day" });

    expect(enforceCallerRateLimit).toHaveBeenCalledWith(expect.any(Request), "mcp", "key:k1", undefined);
  });

  test("rejects an over-limit caller before running the tool", async () => {
    const { enforceCallerRateLimit } = await import("~/server/rate-limit");
    vi.clearAllMocks();
    vi.mocked(enforceCallerRateLimit).mockImplementationOnce(() => {
      throw new Response(null, { status: 429 });
    });

    await expect(callTool("get_song", { slug: "basis-for-a-day" })).rejects.toMatchObject({ status: 429 });
    expect(findBySlug).not.toHaveBeenCalled();
  });

  test("exempts the admin key, so the setlist sync is never limited", async () => {
    const { enforceCallerRateLimit } = await import("~/server/rate-limit");
    const { authenticateApiCaller } = await import("~/server/api-caller");
    vi.clearAllMocks();
    vi.mocked(authenticateApiCaller).mockResolvedValueOnce({ kind: "admin" });

    await callTool("get_song", { slug: "basis-for-a-day" });

    expect(enforceCallerRateLimit).not.toHaveBeenCalled();
  });
});

describe("anonymous MCP access while sign-in rolls out", () => {
  test("is served at /mcp when switched on, limited by IP", async () => {
    const { authenticateApiCaller } = await import("~/server/api-caller");
    const { enforceRateLimit } = await import("~/server/rate-limit");
    vi.clearAllMocks();
    mcpEnv.MCP_ALLOW_ANONYMOUS = "true";
    vi.mocked(authenticateApiCaller).mockResolvedValueOnce(null);

    const res = await postTool("get_song", { slug: "basis-for-a-day" });

    expect(res.status).toBe(200);
    expect(enforceRateLimit).toHaveBeenCalledWith(expect.any(Request), "mcp");
    mcpEnv.MCP_ALLOW_ANONYMOUS = undefined;
  });

  test("still asks for sign-in at /mcp/signin, pointing at that path's metadata", async () => {
    const { authenticateApiCaller } = await import("~/server/api-caller");
    vi.clearAllMocks();
    mcpEnv.MCP_ALLOW_ANONYMOUS = "true";
    vi.mocked(authenticateApiCaller).mockResolvedValueOnce(null);

    const res = await postTool("get_song", { slug: "basis-for-a-day" }, "/mcp/signin");

    expect(res.status).toBe(401);
    expect(res.headers.get("WWW-Authenticate")).toContain("/.well-known/oauth-protected-resource/mcp/signin");
    mcpEnv.MCP_ALLOW_ANONYMOUS = undefined;
  });

  // Falling back to anonymous here would hide a mistyped or revoked key: the call still
  // succeeds, just without the key's identity or raised limit.
  test("a credential that doesn't check out gets a 401 instead of anonymous access", async () => {
    const { authenticateApiCaller } = await import("~/server/api-caller");
    vi.clearAllMocks();
    mcpEnv.MCP_ALLOW_ANONYMOUS = "true";
    vi.mocked(authenticateApiCaller).mockResolvedValueOnce(null);
    const request = new Request("https://discobiscuits.net/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer bip_revoked" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list" }),
    });

    const res = (await action({ request } as never)) as Response;

    expect(res.status).toBe(401);
    expect(res.headers.get("WWW-Authenticate")).toContain("oauth-protected-resource/mcp");
    expect((await res.json()).error).toContain("Invalid or expired");
    mcpEnv.MCP_ALLOW_ANONYMOUS = undefined;
  });
});
