import { beforeEach, describe, expect, test, vi } from "vitest";

const { setLimits } = vi.hoisted(() => ({ setLimits: vi.fn() }));
vi.mock("~/lib/base-loaders", () => ({ adminAction: (fn: unknown) => fn, adminLoader: (fn: unknown) => fn }));
vi.mock("~/server/services", () => ({ services: { apiKeys: { setLimits } } }));

const { action } = await import("./api-keys");

async function save(fields: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  const request = new Request("https://discobiscuits.net/admin/api-keys", { method: "POST", body: form });
  const result: unknown = await action({ request, context: {} } as never);
  if (result && typeof result === "object" && "init" in result && "data" in result) {
    const wrapped = result as { data: unknown; init?: { status?: number } | null };
    return { status: wrapped.init?.status ?? 200, body: wrapped.data };
  }
  return { status: 200, body: result };
}

beforeEach(() => {
  vi.clearAllMocks();
  setLimits.mockResolvedValue(true);
});

describe("admin API key limits", () => {
  test("saves a raised limit, and a blank box as the default", async () => {
    const res = await save({ id: "k1", mcpLimitPerMinute: "600", apiLimitPerMinute: "" });

    expect(res.status).toBe(200);
    expect(setLimits).toHaveBeenCalledWith("k1", { mcpLimitPerMinute: 600, apiLimitPerMinute: null });
  });

  test("rejects a limit that isn't a positive whole number", async () => {
    for (const bad of ["0", "-5", "1.5", "lots"]) {
      expect((await save({ id: "k1", mcpLimitPerMinute: bad, apiLimitPerMinute: "" })).status).toBe(400);
    }
    expect(setLimits).not.toHaveBeenCalled();
  });

  test("reports a key that's gone", async () => {
    setLimits.mockResolvedValue(false);
    expect((await save({ id: "gone", mcpLimitPerMinute: "600", apiLimitPerMinute: "" })).status).toBe(404);
  });
});
