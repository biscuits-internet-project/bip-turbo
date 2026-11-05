import { beforeEach, describe, expect, test, vi } from "vitest";

const { create, revoke, findByEmail } = vi.hoisted(() => ({ create: vi.fn(), revoke: vi.fn(), findByEmail: vi.fn() }));
class ApiKeyLimitError extends Error {}
vi.mock("@bip/core", () => ({ ApiKeyLimitError }));
vi.mock("~/lib/base-loaders", () => ({ protectedAction: (fn: unknown) => fn }));
vi.mock("~/server/services", () => ({ services: { apiKeys: { create, revoke }, users: { findByEmail } } }));

const { action } = await import("./api-keys");

type DataResult = { data: unknown; init?: { status?: number } | null };

async function call(
  method: string,
  body: unknown,
  user: Record<string, unknown> = { id: "auth-1", email: "fan@example.com" },
) {
  const request = new Request("https://discobiscuits.net/api/api-keys", { method, body: JSON.stringify(body) });
  const result: unknown = await action({ request, context: { currentUser: user } } as never);
  // `data()` wraps errors with a status; plain objects are 200s.
  if (result && typeof result === "object" && "init" in result && "data" in result) {
    const wrapped = result as DataResult;
    return { status: wrapped.init?.status ?? 200, body: wrapped.data };
  }
  return { status: 200, body: result };
}

beforeEach(() => {
  vi.clearAllMocks();
  // The local users row has its own id, distinct from the Supabase auth id.
  findByEmail.mockResolvedValue({ id: "u1", email: "fan@example.com" });
});

describe("/api/api-keys", () => {
  test("creates the key on the local users row, found by email, and returns its secret", async () => {
    create.mockResolvedValue({ apiKey: { id: "k1" }, secret: "bip_x" });
    const res = await call("POST", { name: "  importer  " });

    expect(res).toEqual({ status: 200, body: { apiKey: { id: "k1" }, secret: "bip_x" } });
    expect(create).toHaveBeenCalledWith("u1", "importer");
  });

  test("rejects a blank name", async () => {
    expect((await call("POST", { name: "   " })).status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });

  test("reports the per-user cap", async () => {
    create.mockRejectedValue(new ApiKeyLimitError("too many"));
    expect(await call("POST", { name: "one more" })).toEqual({ status: 400, body: { error: "too many" } });
  });

  test("revokes only a key the user owns", async () => {
    revoke.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    expect((await call("DELETE", { id: "k1" })).status).toBe(200);
    expect((await call("DELETE", { id: "not-mine" })).status).toBe(404);
    expect(revoke).toHaveBeenCalledWith("u1", "k1");
  });

  test("refuses requests made with an API key, so a key can't mint or revoke keys", async () => {
    const res = await call("POST", { name: "x" }, { id: "u1", email: "fan@example.com", apiKey: { keyId: "k1" } });

    expect(res.status).toBe(403);
    expect(create).not.toHaveBeenCalled();
  });
});
