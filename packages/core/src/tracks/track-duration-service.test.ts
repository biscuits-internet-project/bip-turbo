import { describe, expect, test, vi } from "vitest";
import { TrackDurationService } from "./track-duration-service";

const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } as never;

/**
 * A dual-billed night ships two nugs releases (Disco Biscuits + Tractorbeam),
 * each holding only its own sets. Resolution must merge both so every track
 * gets a duration — returning the first release alone would leave the other
 * billing's set untimed.
 */
describe("TrackDurationService — nugs releases combine", () => {
  test("merges matches across both nugs releases for a dual-billed show", async () => {
    const trackUpdate = vi.fn().mockResolvedValue({});
    const db = {
      show: {
        findMany: vi.fn().mockResolvedValue([{ id: "show1", slug: "2026-04-12-stratton", date: "2026-04-12" }]),
        update: vi.fn().mockResolvedValue({}),
      },
      track: {
        findMany: vi.fn().mockResolvedValue([
          { id: "ta", set: "S1", position: 1, durationSource: null, song: { title: "Helicopters" } },
          { id: "tb", set: "S2", position: 1, durationSource: null, song: { title: "Tractorbeam" } },
        ]),
        update: trackUpdate,
        aggregate: vi.fn().mockResolvedValue({ _sum: { duration: 1700 } }),
      },
    };
    const nugs = {
      findReleasesForDate: vi.fn().mockResolvedValue([
        { artistName: "The Disco Biscuits", url: "", containerId: 1 },
        { artistName: "Tractorbeam", url: "", containerId: 2 },
      ]),
      // Each container holds only its own billing's set.
      fetchContainerTracks: vi.fn(async (containerId: number) =>
        containerId === 1 ? [{ title: "Helicopters", seconds: 500 }] : [{ title: "Tractorbeam", seconds: 1200 }],
      ),
    };
    const archive = { findRecordingsForDate: vi.fn().mockResolvedValue([]) };
    const cacheInvalidation = { invalidateShowComprehensive: vi.fn().mockResolvedValue(undefined) };

    const service = new TrackDurationService(
      db as never,
      nugs as never,
      archive as never,
      cacheInvalidation as never,
      logger,
    );

    await service.resolvePending(["show1"]);

    // Both tracks get a nugs duration — one from each release.
    const updates = new Map(trackUpdate.mock.calls.map((c) => [c[0].where.id, c[0].data]));
    expect(updates.get("ta")).toMatchObject({ duration: 500, durationSource: "nugs" });
    expect(updates.get("tb")).toMatchObject({ duration: 1200, durationSource: "nugs" });
    // Archive is the fallback; nugs covered everything, so it's never consulted.
    expect(archive.findRecordingsForDate).not.toHaveBeenCalled();
  });
});
