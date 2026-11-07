import type { ActionFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/lib/base-loaders", () => ({
  publicAction: <T>(fn: (args: ActionFunctionArgs) => Promise<T>) => fn,
}));

const warn = vi.fn();
vi.mock("~/lib/logger", () => ({ logger: { warn: (...args: unknown[]) => warn(...args) } }));

const { action } = await import("./client-errors");

function post(body: string, method = "POST") {
  const request = new Request("https://discobiscuits.net/api/client-errors", {
    method,
    headers: { "User-Agent": "test-browser" },
    body,
  });
  return action({ request, params: {}, context: {} } as unknown as ActionFunctionArgs) as Promise<Response>;
}

const validReport = { kind: "missing-file", detail: "/assets/root-old.js", path: "/shows", count: 3, hydrated: false };

describe("client-errors action", () => {
  beforeEach(() => warn.mockClear());

  test("logs a valid report as a warning named after its kind", async () => {
    const response = await post(JSON.stringify(validReport));

    expect(response.status).toBe(204);
    expect(warn).toHaveBeenCalledWith(
      "Browser error: missing-file",
      expect.objectContaining({ ...validReport, userAgent: "test-browser" }),
    );
  });

  test.each([
    ["isn't JSON", "not json"],
    ["has an unknown kind", JSON.stringify({ ...validReport, kind: "made-up" })],
    ["is missing fields", JSON.stringify({ kind: "script-error" })],
    ["is too large", JSON.stringify({ ...validReport, stack: "x".repeat(9000) })],
  ])("rejects a report that %s without logging it", async (_name, body) => {
    const response = await post(body);

    expect(response.status).toBe(400);
    expect(warn).not.toHaveBeenCalled();
  });

  test("drops fields it doesn't know about", async () => {
    await post(JSON.stringify({ ...validReport, password: "secret" }));

    expect(warn.mock.calls[0][1]).not.toHaveProperty("password");
  });

  test("refuses anything but POST", async () => {
    const response = await post("{}", "PUT");

    expect(response.status).toBe(405);
  });
});
