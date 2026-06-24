import { describe, expect, test, vi } from "vitest";
import { runRatingsRecompute } from "./recompute-ratings";

// The dirty-gated recompute routine shared by the hourly cron and the deploy
// entrypoint. The interesting behavior is the no-op-when-clean gate and the
// orchestration order (recompute calibrated → rebuild deduped canonical averages
// → stamp the anchor/timestamp and clear the flag).
function makeServices(dirty: boolean) {
  const raterWeights = {
    isDirty: vi.fn().mockResolvedValue(dirty),
    recomputeAll: vi.fn().mockResolvedValue({ users: 12, rateables: 7 }),
    allRatedPairs: vi.fn().mockResolvedValue([
      { rateableId: "show-1", rateableType: "Show" },
      { rateableId: "track-1", rateableType: "Track" },
    ]),
    computeShrinkAnchor: vi.fn().mockResolvedValue(4.11),
    markRecomputed: vi.fn().mockResolvedValue(undefined),
  };
  const ratings = { rebuildAggregatesFor: vi.fn().mockResolvedValue(undefined) };
  return { raterWeights, ratings };
}

describe("runRatingsRecompute", () => {
  test("no-ops when ratings are clean (nothing changed since the last run)", async () => {
    const { raterWeights, ratings } = makeServices(false);
    const result = await runRatingsRecompute({ raterWeights: raterWeights as never, ratings: ratings as never });

    expect(result.ran).toBe(false);
    expect(raterWeights.recomputeAll).not.toHaveBeenCalled();
    expect(ratings.rebuildAggregatesFor).not.toHaveBeenCalled();
    expect(raterWeights.markRecomputed).not.toHaveBeenCalled();
  });

  test("when dirty: recomputes calibrated scores, rebuilds deduped canonical averages, then stamps the anchor", async () => {
    const { raterWeights, ratings } = makeServices(true);
    const result = await runRatingsRecompute({ raterWeights: raterWeights as never, ratings: ratings as never });

    expect(raterWeights.recomputeAll).toHaveBeenCalledTimes(1);
    expect(ratings.rebuildAggregatesFor).toHaveBeenCalledWith([
      { rateableId: "show-1", rateableType: "Show" },
      { rateableId: "track-1", rateableType: "Track" },
    ]);
    // The anchor is recomputed from the freshly-written weighted ratings, then stamped.
    expect(raterWeights.computeShrinkAnchor).toHaveBeenCalledTimes(1);
    expect(raterWeights.markRecomputed).toHaveBeenCalledWith(4.11);
    expect(result).toMatchObject({ ran: true, users: 12, shows: 7, rateables: 2, anchor: 4.11 });
  });

  test("rebuilds canonical averages before stamping (so the run is atomic in effect)", async () => {
    const { raterWeights, ratings } = makeServices(true);
    await runRatingsRecompute({ raterWeights: raterWeights as never, ratings: ratings as never });

    const rebuildOrder = ratings.rebuildAggregatesFor.mock.invocationCallOrder[0];
    const stampOrder = raterWeights.markRecomputed.mock.invocationCallOrder[0];
    expect(rebuildOrder).toBeLessThan(stampOrder);
  });
});
