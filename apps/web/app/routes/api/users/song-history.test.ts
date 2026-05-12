import type { LoaderFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

// publicLoader normally wraps the inner function with optional auth; bypass
// it in unit tests so we can drive the loader with whatever context we want.
vi.mock("~/lib/base-loaders", () => ({
  publicLoader: <T>(fn: (args: LoaderFunctionArgs & { context: unknown }) => Promise<T>) => fn,
}));

const findByEmail = vi.fn();
const getSongHistory = vi.fn();
vi.mock("~/server/services", () => ({
  services: {
    users: { findByEmail },
    personalSongHistory: { getSongHistory },
  },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const { loader } = await import("./song-history");

function makeArgs(context: unknown): LoaderFunctionArgs & { context: unknown } {
  return {
    request: new Request("http://localhost/api/users/song-history"),
    params: {},
    context,
  } as unknown as LoaderFunctionArgs & { context: unknown };
}

describe("GET /api/users/song-history", () => {
  beforeEach(() => {
    findByEmail.mockReset();
    getSongHistory.mockReset();
  });

  // Anonymous caller: return an empty payload (200) so the React Query hook
  // can run without special-casing. The UI gate prevents the toggle from
  // ever showing for logged-out users, so this path is defensive.
  test("anonymous: returns empty payload without hitting services", async () => {
    const response = (await loader(makeArgs({}))) as Response;
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ attendedShows: [], songAttendances: {} });
    expect(findByEmail).not.toHaveBeenCalled();
    expect(getSongHistory).not.toHaveBeenCalled();
  });

  // Authed: maps Supabase user → local user via email, then delegates to
  // PersonalSongHistoryService. Returns whatever the service returns.
  test("authed: delegates to PersonalSongHistoryService and returns its payload", async () => {
    findByEmail.mockResolvedValue({ id: "user-local-1" });
    const payload = {
      attendedShows: [{ date: "2020-06-10", slug: "2020-06-10-radio-city" }],
      songAttendances: {
        "song-tractorbeam": [{ date: "2020-06-10", slug: "2020-06-10-radio-city" }],
      },
    };
    getSongHistory.mockResolvedValue(payload);

    const response = (await loader(makeArgs({ currentUser: { email: "fan@biscuits.net", id: "sb-1" } }))) as Response;
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(payload);
    expect(findByEmail).toHaveBeenCalledWith("fan@biscuits.net");
    expect(getSongHistory).toHaveBeenCalledWith("user-local-1");
  });

  // Edge: Supabase user exists but local user record is missing — return
  // an empty payload rather than 500, so the UI degrades to "show all
  // debuts" instead of breaking.
  test("authed but missing local user: returns empty payload", async () => {
    findByEmail.mockResolvedValue(null);

    const response = (await loader(makeArgs({ currentUser: { email: "ghost@biscuits.net" } }))) as Response;
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ attendedShows: [], songAttendances: {} });
    expect(getSongHistory).not.toHaveBeenCalled();
  });
});
