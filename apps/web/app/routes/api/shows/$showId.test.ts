import type { ActionFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// adminAction normally wraps the inner function with auth. For action-level
// unit tests we bypass auth and run the inner function directly.
vi.mock("~/lib/base-loaders", () => ({
  adminAction: <T>(fn: (args: ActionFunctionArgs) => Promise<T>) => fn,
}));

const deleteShow = vi.fn();
vi.mock("~/server/services", () => ({
  services: { shows: { delete: deleteShow } },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

const { action } = await import("./$showId");

function makeRequest(method = "DELETE", showId = "show-1"): ActionFunctionArgs {
  return {
    request: new Request(`http://localhost/api/shows/${showId}`, { method }),
    params: { showId },
    context: {},
  } as unknown as ActionFunctionArgs;
}

describe("DELETE /api/shows/:showId", () => {
  beforeEach(() => {
    deleteShow.mockReset().mockResolvedValue(true);
  });

  // Happy path: the route param drives the delete and we report ok.
  test("deletes the show identified by the route param", async () => {
    const result = await action(makeRequest("DELETE", "show-42"));

    expect(deleteShow).toHaveBeenCalledWith("show-42");
    expect(result).toEqual({ ok: true });
  });

  // Method guard: only DELETE removes a show.
  test("rejects non-DELETE methods with 405", async () => {
    await expect(action(makeRequest("POST"))).rejects.toMatchObject({ status: 405 });
    expect(deleteShow).not.toHaveBeenCalled();
  });

  // Service failure surfaces as 400 with the service message.
  test("translates service errors into 400 responses", async () => {
    deleteShow.mockRejectedValueOnce(new Error("boom"));
    await expect(action(makeRequest("DELETE"))).rejects.toMatchObject({ status: 400 });
  });
});
