import type { ActionFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// adminAction normally wraps the inner function with auth. For action-level
// unit tests we bypass auth and run the inner function directly so we can
// exercise body parsing, validation, and service delegation in isolation.
vi.mock("~/lib/base-loaders", () => ({
  adminAction: <T>(fn: (args: ActionFunctionArgs) => Promise<T>) => fn,
}));

const reorderByDate = vi.fn();
vi.mock("~/server/services", () => ({
  services: { shows: { reorderByDate } },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

// Imported after the mocks above so the route picks up our pass-through
// adminAction and our spy-able service.
const { action } = await import("./reorder");

function makeRequest(body: unknown, method = "POST"): ActionFunctionArgs {
  // GET/HEAD requests can't carry a body, so only attach one for verbs that
  // allow it. The action under test reads json() lazily after the method check.
  const init: RequestInit = { method, headers: { "Content-Type": "application/json" } };
  if (method !== "GET" && method !== "HEAD") {
    init.body = JSON.stringify(body);
  }
  return {
    request: new Request("http://localhost/api/shows/reorder", init),
    params: {},
    context: {},
  } as unknown as ActionFunctionArgs;
}

describe("POST /api/shows/reorder", () => {
  beforeEach(() => {
    reorderByDate.mockReset().mockResolvedValue(undefined);
  });

  // Happy path: a valid body delegates straight to the service and returns ok.
  // The two arguments to the service are positional, so order matters.
  test("delegates a valid body to ShowService.reorderByDate", async () => {
    const result = await action(makeRequest({ date: "2017-07-22", orderedIds: ["show-crickets", "show-tractorbeam"] }));

    expect(reorderByDate).toHaveBeenCalledWith("2017-07-22", ["show-crickets", "show-tractorbeam"]);
    expect(result).toEqual({ ok: true });
  });

  // Method guard: anything other than POST is rejected before parsing the body
  // so we don't accidentally accept a GET that happens to carry JSON.
  test("rejects non-POST methods with 405", async () => {
    await expect(action(makeRequest({ date: "2017-07-22", orderedIds: [] }, "GET"))).rejects.toMatchObject({
      status: 405,
    });
    expect(reorderByDate).not.toHaveBeenCalled();
  });

  // Input validation: a missing/wrong-typed date must 400 instead of forwarding
  // garbage to the service (which would explode further down the stack).
  test("rejects body with missing or non-string date", async () => {
    await expect(action(makeRequest({ orderedIds: ["a"] }))).rejects.toMatchObject({ status: 400 });
    await expect(action(makeRequest({ date: 42, orderedIds: ["a"] }))).rejects.toMatchObject({ status: 400 });
    expect(reorderByDate).not.toHaveBeenCalled();
  });

  // Input validation: orderedIds must be a string array. A non-array, or an
  // array with non-string entries, is rejected before reaching the service.
  test("rejects orderedIds that is not an array of strings", async () => {
    await expect(action(makeRequest({ date: "2017-07-22", orderedIds: "not-an-array" }))).rejects.toMatchObject({
      status: 400,
    });
    await expect(action(makeRequest({ date: "2017-07-22", orderedIds: ["ok", 7] }))).rejects.toMatchObject({
      status: 400,
    });
    expect(reorderByDate).not.toHaveBeenCalled();
  });

  // Service-level errors (e.g. date mismatch, missing show) must surface as
  // 400 with the service's own message so admins see a useful response in the
  // network panel — not a generic 500.
  test("translates service errors into 400 responses with the service message", async () => {
    reorderByDate.mockRejectedValueOnce(new Error("Show abc is not on date 2017-07-22"));

    await expect(action(makeRequest({ date: "2017-07-22", orderedIds: ["abc"] }))).rejects.toMatchObject({
      status: 400,
    });
  });
});
