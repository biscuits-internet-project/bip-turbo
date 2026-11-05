import { describe, expect, test, vi } from "vitest";

vi.mock("~/server/env", () => ({
  env: { BASE_URL: "https://discobiscuits.net", SUPABASE_URL: "https://ref.supabase.co" },
}));

const { loader } = await import("./oauth-protected-resource");

describe("OAuth protected resource metadata", () => {
  test("names /mcp as the resource and Supabase Auth as its authorization server", async () => {
    const body = await loader().json();

    expect(body.resource).toBe("https://discobiscuits.net/mcp");
    expect(body.authorization_servers).toEqual(["https://ref.supabase.co/auth/v1"]);
    expect(body.bearer_methods_supported).toEqual(["header"]);
  });
});
