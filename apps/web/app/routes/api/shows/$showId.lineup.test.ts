import type { ActionFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// adminAction normally wraps the inner function with auth. For action-level
// unit tests we bypass auth and run the inner function directly so we can
// exercise body parsing, validation, and service delegation in isolation.
vi.mock("~/lib/base-loaders", () => ({
  adminAction: <T>(fn: (args: ActionFunctionArgs) => Promise<T>) => fn,
}));

const setLineup = vi.fn();
const getLineup = vi.fn();
vi.mock("~/server/services", () => ({
  services: { shows: { setLineup, getLineup } },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

const { action } = await import("./$showId.lineup");

function makeRequest(body: unknown, method = "POST", showId = "show-1"): ActionFunctionArgs {
  const init: RequestInit = { method, headers: { "Content-Type": "application/json" } };
  if (method !== "GET" && method !== "HEAD") {
    init.body = JSON.stringify(body);
  }
  return {
    request: new Request(`http://localhost/api/shows/${showId}/lineup`, init),
    params: { showId },
    context: {},
  } as unknown as ActionFunctionArgs;
}

describe("POST /api/shows/:showId/lineup", () => {
  beforeEach(() => {
    setLineup.mockReset().mockResolvedValue(undefined);
    getLineup.mockReset().mockResolvedValue([]);
  });

  // Happy path: parsed entries delegate straight to ShowService.setLineup,
  // keyed by the showId route param, and the resolved lineup comes back so the
  // widget can re-render its read-only view without a second fetch.
  test("delegates parsed entries to ShowService.setLineup and returns the fresh lineup", async () => {
    const entries = [
      { musicianId: "m-marc", instrumentIds: ["i-bass", "i-vocals"] },
      { musicianId: "m-aron", instrumentIds: ["i-keys"] },
    ];
    const fresh = [{ musician: { id: "m-marc" }, instruments: [{ id: "i-bass" }] }];
    getLineup.mockResolvedValue(fresh);

    const result = await action(makeRequest({ entries }));

    expect(setLineup).toHaveBeenCalledWith("show-1", entries);
    expect(getLineup).toHaveBeenCalledWith("show-1");
    expect(result).toEqual({ ok: true, lineup: fresh });
  });

  // An entry may legitimately have no instruments yet — the picker row exists
  // but the admin hasn't assigned one. Missing instrumentIds is allowed.
  test("accepts an entry with no instrumentIds", async () => {
    await action(makeRequest({ entries: [{ musicianId: "m-marc" }] }));
    expect(setLineup).toHaveBeenCalledWith("show-1", [{ musicianId: "m-marc" }]);
  });

  // Method guard: only POST writes the lineup.
  test("rejects non-POST methods with 405", async () => {
    await expect(action(makeRequest({ entries: [] }, "GET"))).rejects.toMatchObject({ status: 405 });
    expect(setLineup).not.toHaveBeenCalled();
  });

  // Validation: entries must be an array of objects with a string musicianId
  // and (if present) a string-array instrumentIds. Garbage is rejected before
  // it reaches the transactional write.
  test("rejects malformed entries with 400", async () => {
    await expect(action(makeRequest({ entries: "nope" }))).rejects.toMatchObject({ status: 400 });
    await expect(action(makeRequest({ entries: [{ instrumentIds: ["i-1"] }] }))).rejects.toMatchObject({ status: 400 });
    await expect(action(makeRequest({ entries: [{ musicianId: 7 }] }))).rejects.toMatchObject({ status: 400 });
    await expect(action(makeRequest({ entries: [{ musicianId: "m-1", instrumentIds: [9] }] }))).rejects.toMatchObject({
      status: 400,
    });
    expect(setLineup).not.toHaveBeenCalled();
  });

  // Service-level failures surface as 400 with the service message rather than
  // a generic 500, so admins get a useful response.
  test("translates service errors into 400 responses", async () => {
    setLineup.mockRejectedValueOnce(new Error("boom"));
    await expect(action(makeRequest({ entries: [{ musicianId: "m-1" }] }))).rejects.toMatchObject({ status: 400 });
  });
});
