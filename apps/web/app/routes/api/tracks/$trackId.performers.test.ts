import type { ActionFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// adminAction normally wraps the inner function with auth. For action-level
// unit tests we bypass auth and run the inner function directly so we can
// exercise body parsing, validation, and service delegation in isolation.
vi.mock("~/lib/base-loaders", () => ({
  adminAction: <T>(fn: (args: ActionFunctionArgs) => Promise<T>) => fn,
}));

const setTrackMusicianDeltas = vi.fn();
const getTrackMusicianDeltas = vi.fn();
vi.mock("~/server/services", () => ({
  services: { tracks: { setTrackMusicianDeltas, getTrackMusicianDeltas } },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

const { action } = await import("./$trackId.performers");

function makeRequest(body: unknown, method = "PUT", trackId = "track-1"): ActionFunctionArgs {
  const init: RequestInit = { method, headers: { "Content-Type": "application/json" } };
  if (method !== "GET" && method !== "HEAD") {
    init.body = JSON.stringify(body);
  }
  return {
    request: new Request(`http://localhost/api/tracks/${trackId}/performers`, init),
    params: { trackId },
    context: {},
  } as unknown as ActionFunctionArgs;
}

describe("PUT /api/tracks/:trackId/performers", () => {
  beforeEach(() => {
    setTrackMusicianDeltas.mockReset().mockResolvedValue(undefined);
    getTrackMusicianDeltas.mockReset().mockResolvedValue([]);
  });

  // Happy path: parsed deltas delegate straight to setTrackMusicianDeltas,
  // keyed by the trackId route param, and the resolved deltas come back so the
  // editor can refresh its footnotes without a reload.
  test("delegates parsed deltas to TrackService.setTrackMusicianDeltas and returns the fresh deltas", async () => {
    const deltas = [
      { musicianId: "m-mike", present: true, instrumentIds: ["i-guitar", "i-vocals"] },
      { musicianId: "m-marc", present: false },
    ];
    const fresh = [
      { trackId: "track-1", musician: { id: "m-mike" }, present: true, instruments: [{ id: "i-guitar" }] },
    ];
    getTrackMusicianDeltas.mockResolvedValue(fresh);

    const result = await action(makeRequest({ deltas }));

    expect(setTrackMusicianDeltas).toHaveBeenCalledWith("track-1", deltas);
    expect(getTrackMusicianDeltas).toHaveBeenCalledWith("track-1");
    expect(result).toEqual({ ok: true, deltas: fresh });
  });

  // A sat-out delta legitimately carries no instruments.
  test("accepts a delta with no instrumentIds", async () => {
    await action(makeRequest({ deltas: [{ musicianId: "m-marc", present: false }] }));
    expect(setTrackMusicianDeltas).toHaveBeenCalledWith("track-1", [{ musicianId: "m-marc", present: false }]);
  });

  // Method guard: only PUT writes the deltas.
  test("rejects non-PUT methods with 405", async () => {
    await expect(action(makeRequest({ deltas: [] }, "GET"))).rejects.toMatchObject({ status: 405 });
    expect(setTrackMusicianDeltas).not.toHaveBeenCalled();
  });

  // Validation: deltas must be an array of objects with a string musicianId, a
  // boolean present, and (if present) a string-array instrumentIds.
  test("rejects malformed deltas with 400", async () => {
    await expect(action(makeRequest({ deltas: "nope" }))).rejects.toMatchObject({ status: 400 });
    await expect(action(makeRequest({ deltas: [{ present: true }] }))).rejects.toMatchObject({ status: 400 });
    await expect(action(makeRequest({ deltas: [{ musicianId: "m-1" }] }))).rejects.toMatchObject({ status: 400 });
    await expect(action(makeRequest({ deltas: [{ musicianId: 7, present: true }] }))).rejects.toMatchObject({
      status: 400,
    });
    await expect(
      action(makeRequest({ deltas: [{ musicianId: "m-1", present: true, instrumentIds: [9] }] })),
    ).rejects.toMatchObject({ status: 400 });
    expect(setTrackMusicianDeltas).not.toHaveBeenCalled();
  });

  // The service rejects a sit-in for a musician already in the show lineup; that
  // surfaces as a 400 with the service message rather than a generic 500.
  test("translates service errors into 400 responses", async () => {
    setTrackMusicianDeltas.mockRejectedValueOnce(new Error("already in lineup"));
    await expect(action(makeRequest({ deltas: [{ musicianId: "m-1", present: true }] }))).rejects.toMatchObject({
      status: 400,
    });
  });
});
