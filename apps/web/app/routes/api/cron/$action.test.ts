import { describe, expect, test, vi } from "vitest";

const ADMIN_API_KEY = "test-admin-key";

vi.mock("~/server/services", () => ({ services: {} }));
vi.mock("~/server/env", () => ({ env: { ADMIN_API_KEY } }));

const { action } = await import("./$action");

function cronRequest(actionName: string, apiKey: string | null = ADMIN_API_KEY) {
  return {
    request: new Request(`http://localhost/api/cron/${actionName}`, {
      method: "POST",
      headers: apiKey === null ? {} : { authorization: `Bearer ${apiKey}` },
    }),
    params: { action: actionName },
    context: {} as never,
  };
}

describe("cron action route", () => {
  // The community page now builds its own cache on demand; the hourly cron
  // job is gone and hitting the old action must say so instead of silently
  // doing nothing.
  test("community-refresh is no longer a known action", async () => {
    const response = (await action(cronRequest("community-refresh") as never)) as Response;
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toContain("Unknown cron action: community-refresh");
    expect(body.error).toContain("recompute-ratings");
    expect(body.error).toContain("detect-duplicate-accounts");
  });

  // These jobs recompute every rating and rewrite the account-merge table, so they are
  // gated on the shared admin secret rather than on anything the caller can choose.
  test("rejects a request with no credential", async () => {
    const response = (await action(cronRequest("recompute-ratings", null) as never)) as Response;

    expect(response.status).toBe(401);
  });

  test("rejects a request with the wrong key", async () => {
    const response = (await action(cronRequest("recompute-ratings", "not-the-key") as never)) as Response;

    expect(response.status).toBe(401);
  });

  // A curl User-Agent used to be the entire access control. Anyone can send it, so it
  // must no longer grant anything on its own.
  test("rejects a curl user agent carrying no key", async () => {
    const request = {
      request: new Request("http://localhost/api/cron/recompute-ratings", {
        method: "POST",
        headers: { "user-agent": "curl/8.0 GitHub-Actions" },
      }),
      params: { action: "recompute-ratings" },
      context: {} as never,
    };

    const response = (await action(request as never)) as Response;

    expect(response.status).toBe(401);
  });

  // A valid key gets past auth — proven by reaching the unknown-action branch, which
  // only runs after the credential check.
  test("accepts a valid key", async () => {
    const response = (await action(cronRequest("community-refresh") as never)) as Response;

    expect(response.status).toBe(404);
  });
});
