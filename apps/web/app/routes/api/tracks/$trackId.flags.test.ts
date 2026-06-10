import type { ActionFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// adminAction normally wraps the inner function with auth. For action-level
// unit tests we bypass auth and run the inner function directly so we can
// exercise body parsing, validation, and service delegation in isolation.
vi.mock("~/lib/base-loaders", () => ({
  adminAction: <T>(fn: (args: ActionFunctionArgs) => Promise<T>) => fn,
}));

const setTrackFlags = vi.fn();
const getTrackFlagData = vi.fn();
vi.mock("~/server/services", () => ({
  services: { tracks: { setTrackFlags, getTrackFlagData } },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

const { action } = await import("./$trackId.flags");

function makeRequest(body: unknown, method = "PUT", trackId = "track-1"): ActionFunctionArgs {
  const init: RequestInit = { method, headers: { "Content-Type": "application/json" } };
  if (method !== "GET" && method !== "HEAD") {
    init.body = JSON.stringify(body);
  }
  return {
    request: new Request(`http://localhost/api/tracks/${trackId}/flags`, init),
    params: { trackId },
    context: {},
  } as unknown as ActionFunctionArgs;
}

describe("PUT /api/tracks/:trackId/flags", () => {
  beforeEach(() => {
    setTrackFlags.mockReset().mockResolvedValue(undefined);
    getTrackFlagData.mockReset().mockResolvedValue({ flags: [], flagRecurrences: [], segueRecurrences: [] });
  });

  // Happy path: valid flags delegate to setTrackFlags keyed by the route param,
  // and the recomputed footnote slice comes back for live refresh.
  test("delegates parsed flags to TrackService.setTrackFlags and returns the fresh footnote slice", async () => {
    const fresh = { flags: ["DYSLEXIC"], flagRecurrences: [{ flag: "DYSLEXIC" }], segueRecurrences: [] };
    getTrackFlagData.mockResolvedValue(fresh);

    const result = await action(makeRequest({ flags: ["DYSLEXIC", "INVERTED"] }));

    expect(setTrackFlags).toHaveBeenCalledWith("track-1", ["DYSLEXIC", "INVERTED"]);
    expect(getTrackFlagData).toHaveBeenCalledWith("track-1");
    expect(result).toEqual({ ok: true, ...fresh });
  });

  // Clearing every flag is a valid edit (delete all rows).
  test("accepts an empty flags array", async () => {
    await action(makeRequest({ flags: [] }));
    expect(setTrackFlags).toHaveBeenCalledWith("track-1", []);
  });

  // Method guard: only PUT writes the flags.
  test("rejects non-PUT methods with 405", async () => {
    await expect(action(makeRequest({ flags: [] }, "GET"))).rejects.toMatchObject({ status: 405 });
    expect(setTrackFlags).not.toHaveBeenCalled();
  });

  // Validation: flags must be an array of known enum values.
  test("rejects malformed or unknown flags with 400", async () => {
    await expect(action(makeRequest({ flags: "nope" }))).rejects.toMatchObject({ status: 400 });
    await expect(action(makeRequest({ flags: ["NOT_A_FLAG"] }))).rejects.toMatchObject({ status: 400 });
    expect(setTrackFlags).not.toHaveBeenCalled();
  });

  // A service rejection (e.g. missing track) surfaces as a 400 with its message.
  test("translates service errors into 400 responses", async () => {
    setTrackFlags.mockRejectedValueOnce(new Error("not found"));
    await expect(action(makeRequest({ flags: ["DYSLEXIC"] }))).rejects.toMatchObject({ status: 400 });
  });
});
