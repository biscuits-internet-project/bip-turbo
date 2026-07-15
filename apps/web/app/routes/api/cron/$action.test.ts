import { describe, expect, test, vi } from "vitest";

vi.mock("~/server/services", () => ({ services: {} }));

const { action } = await import("./$action");

function cronRequest(actionName: string, userAgent = "curl/8.0 GitHub-Actions") {
  return {
    request: new Request(`http://localhost/api/cron/${actionName}`, {
      method: "POST",
      headers: { "user-agent": userAgent },
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
  });

  // Cron endpoints are only reachable by the GitHub Actions curl; anything
  // else is rejected before any job runs.
  test("rejects requests without the GitHub Actions user agent", async () => {
    const response = (await action(cronRequest("recompute-ratings", "Mozilla/5.0") as never)) as Response;

    expect(response.status).toBe(401);
  });
});
