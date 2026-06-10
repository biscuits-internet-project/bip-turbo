import type { ActionFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/lib/base-loaders", () => ({
  adminAction: <T>(fn: (args: ActionFunctionArgs) => Promise<T>) => fn,
}));

const setTrackCompletions = vi.fn();
const getTrackCompletes = vi.fn();
vi.mock("~/server/services", () => ({
  services: { tracks: { setTrackCompletions, getTrackCompletes } },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

const { action } = await import("./$trackId.completions");

function makeRequest(body: unknown, method = "PUT", trackId = "later-track"): ActionFunctionArgs {
  const init: RequestInit = { method, headers: { "Content-Type": "application/json" } };
  if (method !== "GET" && method !== "HEAD") {
    init.body = JSON.stringify(body);
  }
  return {
    request: new Request(`http://localhost/api/tracks/${trackId}/completions`, init),
    params: { trackId },
    context: {},
  } as unknown as ActionFunctionArgs;
}

describe("PUT /api/tracks/:trackId/completions", () => {
  beforeEach(() => {
    setTrackCompletions.mockReset().mockResolvedValue(undefined);
    getTrackCompletes.mockReset().mockResolvedValue([]);
  });

  // Happy path: parsed earlier-track ids delegate to setTrackCompletions keyed
  // by the route param, and the resolved links come back for live refresh.
  test("delegates earlierTrackIds to TrackService.setTrackCompletions and returns the links", async () => {
    const completes = [{ date: "2010-01-01", slug: "2010-01-01-shimmy" }];
    getTrackCompletes.mockResolvedValue(completes);

    const result = await action(makeRequest({ earlierTrackIds: ["earlier-a", "earlier-b"] }));

    expect(setTrackCompletions).toHaveBeenCalledWith("later-track", ["earlier-a", "earlier-b"]);
    expect(getTrackCompletes).toHaveBeenCalledWith("later-track");
    expect(result).toEqual({ ok: true, completes });
  });

  // Clearing every link is valid (delete all rows).
  test("accepts an empty earlierTrackIds array", async () => {
    await action(makeRequest({ earlierTrackIds: [] }));
    expect(setTrackCompletions).toHaveBeenCalledWith("later-track", []);
  });

  // Method guard: only PUT writes the links.
  test("rejects non-PUT methods with 405", async () => {
    await expect(action(makeRequest({ earlierTrackIds: [] }, "GET"))).rejects.toMatchObject({ status: 405 });
    expect(setTrackCompletions).not.toHaveBeenCalled();
  });

  // Validation: earlierTrackIds must be an array of non-empty strings.
  test("rejects malformed earlierTrackIds with 400", async () => {
    await expect(action(makeRequest({ earlierTrackIds: "nope" }))).rejects.toMatchObject({ status: 400 });
    await expect(action(makeRequest({ earlierTrackIds: [7] }))).rejects.toMatchObject({ status: 400 });
    expect(setTrackCompletions).not.toHaveBeenCalled();
  });

  // The UNIQUE-constraint rejection (earlier track already completed elsewhere)
  // surfaces as a 400 with the service message.
  test("translates service errors into 400 responses", async () => {
    setTrackCompletions.mockRejectedValueOnce(new Error("already completed"));
    await expect(action(makeRequest({ earlierTrackIds: ["earlier-a"] }))).rejects.toMatchObject({ status: 400 });
  });
});
