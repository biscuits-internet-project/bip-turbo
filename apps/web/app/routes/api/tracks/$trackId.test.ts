import type { ActionFunctionArgs } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";

vi.mock("~/lib/base-loaders", () => ({
  adminAction: <T>(fn: (args: ActionFunctionArgs) => Promise<T>) => fn,
  publicLoader: <T>(fn: T) => fn,
}));

const findById = vi.fn();
const findFollowingTrackSongId = vi.fn();
const deleteTrack = vi.fn();
const updateSongStatistics = vi.fn();
vi.mock("~/server/services", () => ({
  services: {
    tracks: { findById, findFollowingTrackSongId, delete: deleteTrack },
    annotations: { deleteByTrackId: vi.fn().mockResolvedValue(undefined) },
    ratings: { deleteByRateableId: vi.fn().mockResolvedValue(undefined) },
    songs: { updateSongStatistics },
  },
}));

vi.mock("~/lib/logger", () => ({
  logger: { info: vi.fn(), error: vi.fn() },
}));

vi.mock("~/server/viewer-rating", () => ({ resolveViewerRatingMode: vi.fn() }));

const { action } = await import("./$trackId");

function makeDeleteRequest(): ActionFunctionArgs {
  return {
    request: new Request("http://localhost/api/tracks/track-1", { method: "DELETE" }),
    params: { trackId: "track-1" },
    context: {},
  } as unknown as ActionFunctionArgs;
}

describe("DELETE /api/tracks/:trackId", () => {
  beforeEach(() => {
    findById.mockReset().mockResolvedValue({ id: "track-1", songId: "fire-will-exchange" });
    findFollowingTrackSongId.mockReset().mockResolvedValue("hymn");
    deleteTrack.mockReset().mockResolvedValue(undefined);
    updateSongStatistics.mockReset().mockResolvedValue(undefined);
  });

  // The follower gets a new predecessor after renumbering, so its song's segue
  // recurrence must be recomputed along with the deleted track's song.
  test("recomputes the deleted track's song and the following track's song", async () => {
    await action(makeDeleteRequest());

    expect(updateSongStatistics).toHaveBeenCalledWith("fire-will-exchange");
    expect(updateSongStatistics).toHaveBeenCalledWith("hymn");
  });

  test("recomputes a song once when the following track plays the same song", async () => {
    findFollowingTrackSongId.mockResolvedValue("fire-will-exchange");

    await action(makeDeleteRequest());

    expect(updateSongStatistics).toHaveBeenCalledTimes(1);
  });

  test("skips the follower recompute when the deleted track was last in its set", async () => {
    findFollowingTrackSongId.mockResolvedValue(null);

    await action(makeDeleteRequest());

    expect(updateSongStatistics).toHaveBeenCalledTimes(1);
  });

  test("reads the following track before deleting", async () => {
    await action(makeDeleteRequest());

    expect(findFollowingTrackSongId.mock.invocationCallOrder[0]).toBeLessThan(deleteTrack.mock.invocationCallOrder[0]);
  });
});
