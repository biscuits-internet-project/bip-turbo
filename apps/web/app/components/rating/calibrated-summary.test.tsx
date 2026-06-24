import type { ShowRankComparison } from "@bip/core";
import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CalibratedSummary } from "./calibrated-summary";

// The overlay shows the calibrated score plus rank movement over two fields. The
// behavior worth pinning: a qualified show renders both an "all" and a "top" row;
// a thin show (top === null) renders "not ranked" instead of a top-list rank.
const qualified: ShowRankComparison = {
  calibrated: 4.51,
  all: { canonicalRank: 72, calibratedRank: 101, total: 300 },
  top: { canonicalRank: 60, calibratedRank: 98, total: 100 },
};

describe("CalibratedSummary", () => {
  test("renders both the all-field and top-list rank rows for a qualified show", async () => {
    await setup(<CalibratedSummary canonical={4.64} rank={qualified} />);
    expect(screen.getByText("all")).toBeInTheDocument();
    expect(screen.getByText("top")).toBeInTheDocument();
    // Calibrated ranks (the "now" column) for each field.
    expect(screen.getByText("#101")).toBeInTheDocument();
    expect(screen.getByText("#98")).toBeInTheDocument();
  });

  test("shows 'not ranked' on the top row when the show is below the rating floor", async () => {
    const thin: ShowRankComparison = {
      calibrated: 4.2,
      all: { canonicalRank: 1, calibratedRank: 784, total: 800 },
      top: null,
    };
    await setup(<CalibratedSummary canonical={5.0} rank={thin} />);
    expect(screen.getByText(/not ranked/)).toBeInTheDocument();
    // The all-field still shows its movement (raw #1 → calibrated #784).
    expect(screen.getByText("#784")).toBeInTheDocument();
  });
});
