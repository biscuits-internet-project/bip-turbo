import type { User } from "@supabase/supabase-js";
import { beforeEach, describe, expect, test, vi } from "vitest";

const supabaseGetUser = vi.fn();

vi.mock("~/server/supabase", () => ({
  getServerClient: (request: Request) => ({
    supabase: { auth: { getUser: () => supabaseGetUser(request) } },
    headers: new Headers(),
  }),
}));

const { hasTooManyFailedSignIns, recordFailedSignIn } = vi.hoisted(() => ({
  hasTooManyFailedSignIns: vi.fn().mockResolvedValue(false),
  recordFailedSignIn: vi.fn(),
}));
vi.mock("~/server/rate-limit", () => ({ hasTooManyFailedSignIns, recordFailedSignIn }));

import { getRequestUser } from "./request-user";

function makeRequest(cookie = "sb-auth=fake-token"): Request {
  return new Request("http://localhost/anything", { headers: { Cookie: cookie } });
}

describe("getRequestUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hasTooManyFailedSignIns.mockResolvedValue(false);
  });

  // Sibling loaders within one HTTP request receive separate Request
  // objects (RR v7 dev behavior), but share the same Cookie header. They
  // must dedupe to one upstream auth call so we don't pay the Supabase
  // round-trip twice per page.
  test("dedupes concurrent calls that share a cookie header", async () => {
    const user = { id: "u1", email: "test-user@example.com" } as User;
    supabaseGetUser.mockResolvedValue({ data: { user }, error: null });

    const reqA = makeRequest();
    const reqB = makeRequest();
    const [a, b] = await Promise.all([getRequestUser(reqA), getRequestUser(reqB)]);

    expect(a).toBe(user);
    expect(b).toBe(user);
    expect(supabaseGetUser).toHaveBeenCalledTimes(1);
  });

  // A subsequent HTTP request after the first resolves must not reuse
  // the old in-flight entry — entries evict on settle so the next
  // request's auth state is fetched fresh.
  test("re-fetches after the first call has resolved", async () => {
    const user = { id: "u1", email: "test-user@example.com" } as User;
    supabaseGetUser.mockResolvedValue({ data: { user }, error: null });

    await getRequestUser(makeRequest());
    await getRequestUser(makeRequest());

    expect(supabaseGetUser).toHaveBeenCalledTimes(2);
  });

  // Different cookies (different users) must NOT collide on the dedupe
  // key; otherwise user A's request could return user B's session.
  test("does not dedupe across different cookie headers", async () => {
    supabaseGetUser
      .mockResolvedValueOnce({ data: { user: { id: "u1" } as User }, error: null })
      .mockResolvedValueOnce({ data: { user: { id: "u2" } as User }, error: null });

    const [a, b] = await Promise.all([
      getRequestUser(makeRequest("sb-auth=token-1")),
      getRequestUser(makeRequest("sb-auth=token-2")),
    ]);

    expect(a?.id).toBe("u1");
    expect(b?.id).toBe("u2");
    expect(supabaseGetUser).toHaveBeenCalledTimes(2);
  });

  // Bearer callers (OAuth/MCP clients) carry no cookie, so keying on Cookie alone put
  // every one of them in the same "_anon" slot — where a concurrent request would be
  // handed whichever user's auth call happened to be in flight.
  test("does not dedupe across different bearer tokens", async () => {
    supabaseGetUser
      .mockResolvedValueOnce({ data: { user: { id: "u1" } as User }, error: null })
      .mockResolvedValueOnce({ data: { user: { id: "u2" } as User }, error: null });

    const bearer = (token: string) =>
      new Request("http://localhost/anything", { headers: { Authorization: `Bearer ${token}` } });

    const [a, b] = await Promise.all([getRequestUser(bearer("token-1")), getRequestUser(bearer("token-2"))]);

    expect(a?.id).toBe("u1");
    expect(b?.id).toBe("u2");
    expect(supabaseGetUser).toHaveBeenCalledTimes(2);
  });

  // A bearer request and a cookie-less anonymous request must not share a slot either.
  test("does not dedupe a bearer request with an anonymous one", async () => {
    supabaseGetUser.mockImplementation(async (request: Request) => ({
      data: { user: request.headers.get("Authorization") ? ({ id: "u1" } as User) : null },
      error: null,
    }));

    const withBearer = new Request("http://localhost/", { headers: { Authorization: "Bearer token-1" } });
    const anonymous = new Request("http://localhost/", { headers: {} });

    const [a, b] = await Promise.all([getRequestUser(withBearer), getRequestUser(anonymous)]);

    expect(a?.id).toBe("u1");
    expect(b).toBeNull();
    expect(supabaseGetUser).toHaveBeenCalledTimes(2);
  });

  // Anonymous requests (no cookie) still dedupe within one HTTP request
  // — both loaders see Cookie: undefined which normalizes to a single
  // shared key.
  test("dedupes concurrent anonymous requests", async () => {
    supabaseGetUser.mockResolvedValue({ data: { user: null }, error: null });

    const reqA = new Request("http://localhost/", { headers: {} });
    const reqB = new Request("http://localhost/", { headers: {} });
    await Promise.all([getRequestUser(reqA), getRequestUser(reqB)]);

    expect(supabaseGetUser).toHaveBeenCalledTimes(1);
  });

  describe("credentials that don't check out", () => {
    const SESSION = "sb-lgczyfvrisdlknvfuemk-auth-token=junk";

    test("are counted against the caller's IP", async () => {
      supabaseGetUser.mockResolvedValue({ data: { user: null } });
      await getRequestUser(makeRequest(SESSION));

      expect(recordFailedSignIn).toHaveBeenCalledTimes(1);
    });

    test("once an IP has sent too many, its requests are treated as signed out without a lookup", async () => {
      hasTooManyFailedSignIns.mockResolvedValue(true);

      expect(await getRequestUser(makeRequest(SESSION))).toBeNull();
      expect(supabaseGetUser).not.toHaveBeenCalled();
    });

    test("an ordinary cookie with no session isn't counted as a failed sign-in", async () => {
      supabaseGetUser.mockResolvedValue({ data: { user: null } });
      await getRequestUser(makeRequest("theme=dark"));

      expect(recordFailedSignIn).not.toHaveBeenCalled();
      expect(hasTooManyFailedSignIns).not.toHaveBeenCalled();
    });
  });
});
