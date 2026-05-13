import type { User } from "@supabase/supabase-js";
import { beforeEach, describe, expect, test, vi } from "vitest";

const supabaseGetUser = vi.fn();

vi.mock("~/server/supabase", () => ({
  getServerClient: () => ({
    supabase: { auth: { getUser: supabaseGetUser } },
    headers: new Headers(),
  }),
}));

import { getRequestUser } from "./request-user";

function makeRequest(cookie = "sb-auth=fake-token"): Request {
  return new Request("http://localhost/anything", { headers: { Cookie: cookie } });
}

describe("getRequestUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Sibling loaders within one HTTP request receive separate Request
  // objects (RR v7 dev behavior), but share the same Cookie header. They
  // must dedupe to one upstream auth call so we don't pay the Supabase
  // round-trip twice per page.
  test("dedupes concurrent calls that share a cookie header", async () => {
    const user = { id: "u1", email: "evan@foo.net" } as User;
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
    const user = { id: "u1", email: "evan@foo.net" } as User;
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
});
