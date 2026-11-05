import { beforeEach, describe, expect, test, vi } from "vitest";

const update = vi.fn();
const isUsernameTaken = vi.fn();
const localUser = { id: "u-1", username: "Legacy Name", email: "a@example.com" };

vi.mock("@bip/core", () => ({ getFeatureFlags: vi.fn().mockResolvedValue({}) }));
vi.mock("~/lib/honeybadger", () => ({ default: { notify: vi.fn() } }));
vi.mock("~/server/rate-limit", () => ({ enforceRateLimit: vi.fn() }));
vi.mock("~/lib/logger", () => ({ logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() } }));
vi.mock("~/server/supabase", () => ({
  getServerClient: () => ({
    supabase: {
      auth: {
        getUser: async () => ({
          data: { user: { email: "a@example.com", user_metadata: { username: "Legacy Name" } } },
        }),
        updateUser: vi.fn(),
      },
    },
  }),
}));
vi.mock("~/server/services", () => ({
  services: { users: { findByEmail: async () => localUser, update, isUsernameTaken } },
}));

const { action } = await import("./users");

function submit(fields: Record<string, string>) {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.append(k, v);
  return action({ request: new Request("http://localhost/api/users", { method: "POST", body }) } as never);
}

describe("POST /api/users username changes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    update.mockImplementation(async (_id, data) => ({ ...localUser, ...data }));
    isUsernameTaken.mockResolvedValue(false);
  });

  // Names render publicly; spaces, lookalike Unicode and email addresses all slipped in
  // through renames because only length was checked.
  test.each(["new name", "aron@example.com", "еvan"])("rejects %j", async (username) => {
    const res = await submit({ username });
    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  test("rejects a name another account holds in a different case", async () => {
    isUsernameTaken.mockResolvedValueOnce(true);
    const res = await submit({ username: "Evan" });
    expect(res.status).toBe(409);
    expect(isUsernameTaken).toHaveBeenCalledWith("Evan", "u-1");
    expect(update).not.toHaveBeenCalled();
  });

  test("accepts a conforming new name", async () => {
    const res = await submit({ username: "new.name_2" });
    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledWith("u-1", expect.objectContaining({ username: "new.name_2" }));
  });

  test("an @ is refused even when it is the current name", async () => {
    const res = await submit({ username: "aron@example.com", showSetlistTimes: "true" });
    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  // The profile form resubmits the current name on every save; a legacy name that
  // predates the rule must not lock the user out of saving.
  test("resubmitting an unchanged legacy name still saves", async () => {
    const res = await submit({ username: "Legacy Name", showSetlistTimes: "true" });
    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledWith("u-1", { showSetlistTimes: true });
  });
});

describe("POST /api/users rate limit", () => {
  test("applies the shared /api budget, since this route isn't wrapped in base-loaders", async () => {
    const { enforceRateLimit } = await import("~/server/rate-limit");
    vi.mocked(enforceRateLimit).mockRejectedValueOnce(new Response(null, { status: 429 }));

    await expect(
      action({ request: new Request("http://localhost/api/users", { method: "POST" }) } as never),
    ).rejects.toMatchObject({ status: 429 });
    expect(enforceRateLimit).toHaveBeenCalledWith(expect.any(Request), "api");
  });
});
