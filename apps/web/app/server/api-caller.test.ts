import { beforeEach, describe, expect, test, vi } from "vitest";

const authenticate = vi.fn();
const getClaims = vi.fn();
const isAuthorizedAdminRequest = vi.fn().mockReturnValue(false);
const env: Record<string, string | undefined> = { SUPABASE_URL: "https://x.supabase.co", SUPABASE_ANON_KEY: "anon" };

vi.mock("~/server/services", () => ({ services: { apiKeys: { authenticate } } }));
vi.mock("~/server/admin-api-key", () => ({ isAuthorizedAdminRequest }));
vi.mock("~/server/env", () => ({ env }));
vi.mock("~/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth: { getClaims } }) }));
const hasTooManyFailedSignIns = vi.fn().mockResolvedValue(false);
const recordFailedSignIn = vi.fn();
vi.mock("~/server/rate-limit", () => ({ hasTooManyFailedSignIns, recordFailedSignIn }));

const { apiCallerIdentity, authenticateApiCaller, raisedLimit } = await import("~/server/api-caller");

function request(token?: string) {
  return new Request("https://discobiscuits.net/mcp", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  isAuthorizedAdminRequest.mockReturnValue(false);
  hasTooManyFailedSignIns.mockResolvedValue(false);
});

describe("authenticateApiCaller", () => {
  test("recognizes the ops admin key first", async () => {
    isAuthorizedAdminRequest.mockReturnValue(true);
    expect(await authenticateApiCaller(request("whatever"))).toEqual({ kind: "admin" });
  });

  test("returns null with no bearer token", async () => {
    expect(await authenticateApiCaller(request())).toBeNull();
  });

  test("resolves a personal API key to its owner", async () => {
    const owner = { keyId: "k1", userId: "u1", mcpLimitPerMinute: null, apiLimitPerMinute: null };
    authenticate.mockResolvedValue(owner);

    expect(await authenticateApiCaller(request("bip_abc"))).toEqual({ kind: "apiKey", ...owner });
    expect(getClaims).not.toHaveBeenCalled();
  });

  test("rejects an unknown or revoked API key, and counts the failure against the IP", async () => {
    authenticate.mockResolvedValue(null);
    expect(await authenticateApiCaller(request("bip_revoked"))).toBeNull();
    expect(recordFailedSignIn).toHaveBeenCalledTimes(1);
  });

  test("stops looking up credentials from an IP that keeps sending bad ones", async () => {
    hasTooManyFailedSignIns.mockResolvedValue(true);

    expect(await authenticateApiCaller(request("bip_guess"))).toBeNull();
    expect(authenticate).not.toHaveBeenCalled();
    expect(getClaims).not.toHaveBeenCalled();
  });

  test("accepts a verified OAuth access token and keeps its client id", async () => {
    getClaims.mockResolvedValue({
      data: { claims: { sub: "u1", role: "authenticated", client_id: "client-9" } },
      error: null,
    });

    expect(await authenticateApiCaller(request("eyJ.token.sig"))).toEqual({
      kind: "oauth",
      userId: "u1",
      clientId: "client-9",
    });
  });

  test("rejects a token that fails verification or isn't a signed-in user's", async () => {
    getClaims.mockResolvedValueOnce({ data: null, error: new Error("invalid signature") });
    expect(await authenticateApiCaller(request("eyJ.bad.sig"))).toBeNull();

    getClaims.mockResolvedValueOnce({ data: { claims: { sub: "x", role: "anon" } }, error: null });
    expect(await authenticateApiCaller(request("eyJ.anon.sig"))).toBeNull();
  });
});

describe("rate limit identity and raised limits", () => {
  const keyCaller = {
    kind: "apiKey" as const,
    keyId: "k1",
    userId: "u1",
    mcpLimitPerMinute: null,
    apiLimitPerMinute: null,
  };
  const oauthCaller = { kind: "oauth" as const, userId: "u1", clientId: "client-9" };

  test("budgets per user, so a user's keys share one budget", () => {
    expect(apiCallerIdentity(keyCaller)).toBe("user:u1");
    expect(apiCallerIdentity({ ...keyCaller, keyId: "k2" })).toBe("user:u1");
    expect(apiCallerIdentity(oauthCaller)).toBe("user:u1");
  });

  test("uses the limit an admin set on the key, per bucket", () => {
    const raised = { ...keyCaller, mcpLimitPerMinute: 600 };

    expect(raisedLimit(raised, "mcp")).toBe(600);
    expect(raisedLimit(raised, "api")).toBeUndefined();
  });

  test("gives OAuth apps the default", () => {
    expect(raisedLimit(oauthCaller, "mcp")).toBeUndefined();
  });
});
