import { describe, expect, test, vi } from "vitest";

const { createServerClient } = vi.hoisted(() => ({
  createServerClient: vi.fn((_url: string, _key: string, _options: unknown) => ({})),
}));
vi.mock("@supabase/ssr", () => ({ createServerClient }));
vi.mock("~/server/env", () => ({ env: { SUPABASE_URL: "https://ref.supabase.co", SUPABASE_ANON_KEY: "anon" } }));

const { getServerClient } = await import("~/server/supabase");

function forwardedAuthorization(token: string) {
  createServerClient.mockClear();
  getServerClient(new Request("https://discobiscuits.net/", { headers: { Authorization: `Bearer ${token}` } }));
  const options = createServerClient.mock.calls[0]?.[2] as
    | { global?: { headers?: Record<string, string> } }
    | undefined;
  return options?.global?.headers?.Authorization;
}

describe("getServerClient", () => {
  test("hands a Supabase access token to Supabase", () => {
    expect(forwardedAuthorization("eyJ.access.token")).toBe("Bearer eyJ.access.token");
  });

  test("never sends a personal API key to Supabase", () => {
    expect(forwardedAuthorization("bip_secret")).toBeUndefined();
  });
});
