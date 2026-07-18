import type { User } from "@supabase/supabase-js";
import { describe, expect, test } from "vitest";
import { toSessionUser } from "./session-user";

function makeSupabaseUser(overrides: Partial<User> = {}): User {
  return {
    id: "auth-1",
    email: "test-user@example.com",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "2024-01-01T00:00:00Z",
    ...overrides,
  } as User;
}

describe("toSessionUser", () => {
  // Happy path: an authenticated user with full metadata. Asserts the
  // projection picks exactly the fields useSession consumers read and
  // nothing else (no tokens, no app_metadata.provider, etc.).
  test("projects the supabase user to the client-safe shape", () => {
    const result = toSessionUser(
      makeSupabaseUser({
        user_metadata: { username: "test-user", internal_user_id: "local-1" },
        app_metadata: { isAdmin: true, provider: "email" },
      }),
    );

    expect(result).toEqual({
      id: "auth-1",
      email: "test-user@example.com",
      username: "test-user",
      avatarUrl: null,
      internalUserId: "local-1",
      isAdmin: true,
    });
  });

  // Avatar URL is shipped when present so the header / user-dropdown
  // can render the user's profile image on first paint.
  test("includes avatarUrl from user_metadata.avatar_url", () => {
    const result = toSessionUser(
      makeSupabaseUser({ user_metadata: { avatar_url: "https://cdn.example.com/avatar.png" } }),
    );
    expect(result.avatarUrl).toBe("https://cdn.example.com/avatar.png");
  });

  // Sensitive fields must not leak into the seed. The full Supabase user
  // includes access tokens and provider details — none of those should
  // appear in the projected SessionUser.
  test("does not include tokens or extraneous fields", () => {
    const result = toSessionUser(
      makeSupabaseUser({
        // @ts-expect-error: simulating an arbitrary field we don't want shipped
        access_token: "secret",
      }),
    );
    expect(Object.keys(result)).toEqual(["id", "email", "username", "avatarUrl", "internalUserId", "isAdmin"]);
    expect(JSON.stringify(result)).not.toContain("secret");
  });

  // Whitespace-only usernames normalize to null so the SSR seed matches
  // a client-side re-derive; otherwise an empty username string would
  // replace null once onAuthStateChange fires, triggering a needless
  // re-render.
  test("normalizes whitespace-only usernames to null", () => {
    const result = toSessionUser(makeSupabaseUser({ user_metadata: { username: "   " } }));
    expect(result.username).toBeNull();
  });

  // A user without an internal_user_id yet (newly-signed-in, before
  // ensureUserSynced fires) still gets a well-formed shape; the
  // client-side sync fills the id in later.
  test("returns null internalUserId when metadata lacks it", () => {
    const result = toSessionUser(makeSupabaseUser({ user_metadata: { username: "test-user" } }));
    expect(result.internalUserId).toBeNull();
    expect(result.username).toBe("test-user");
  });

  // Supabase types `email` as optional. The helper coerces missing
  // emails to "" so downstream code that reads user.email doesn't need
  // to null-check every access.
  test("coerces missing email to empty string", () => {
    const result = toSessionUser(makeSupabaseUser({ email: undefined }));
    expect(result.email).toBe("");
  });

  // isAdmin must be a strict boolean, not "truthy". Some metadata stores
  // store "true" as a string; only the literal boolean `true` grants
  // admin.
  test("isAdmin is true only when app_metadata.isAdmin === true", () => {
    expect(toSessionUser(makeSupabaseUser({ app_metadata: { isAdmin: true } })).isAdmin).toBe(true);
    expect(toSessionUser(makeSupabaseUser({ app_metadata: { isAdmin: "true" } })).isAdmin).toBe(false);
    expect(toSessionUser(makeSupabaseUser({ app_metadata: {} })).isAdmin).toBe(false);
  });
});
