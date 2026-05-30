import type { RatingYearBucket } from "@bip/core";
import { describe, expect, it } from "vitest";
import {
  ALL_YEARS_SERIES,
  availableYears,
  buildAverageMedianByYear,
  buildHistogramData,
  countAxisTicks,
  histogramYAxisConfig,
  percentAxisTicks,
} from "./rating-charts";

describe("buildHistogramData", () => {
  it("sums every year into one 'all' series when no years are selected", () => {
    const buckets: RatingYearBucket[] = [
      { year: 2017, value: 5, count: 3 },
      { year: 2018, value: 5, count: 2 },
      { year: 2018, value: 4, count: 1 },
    ];
    const { series, data } = buildHistogramData(buckets, []);

    expect(series).toEqual([ALL_YEARS_SERIES]);
    expect(data.find((row) => row.value === 5)?.[ALL_YEARS_SERIES]).toBe(5);
    expect(data.find((row) => row.value === 4)?.[ALL_YEARS_SERIES]).toBe(1);
    expect(data.find((row) => row.value === 0.5)?.[ALL_YEARS_SERIES]).toBe(0);
  });

  it("splits into one ascending series per selected year for side-by-side compare", () => {
    const buckets: RatingYearBucket[] = [
      { year: 2017, value: 5, count: 3 },
      { year: 2018, value: 5, count: 2 },
      { year: 2019, value: 5, count: 9 },
    ];
    const { series, data } = buildHistogramData(buckets, [2018, 2017]);

    expect(series).toEqual(["2017", "2018"]);
    const fiveStar = data.find((row) => row.value === 5);
    expect(fiveStar?.["2017"]).toBe(3);
    expect(fiveStar?.["2018"]).toBe(2);
    expect(fiveStar).not.toHaveProperty("2019"); // unselected year is excluded
  });

  it("renders all ten 0.5-step buckets even when most are empty", () => {
    const { data } = buildHistogramData([{ year: 2020, value: 3, count: 1 }], []);
    expect(data.map((row) => row.value)).toEqual([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
  });

  it("expresses each series as a fraction of its own total in percent mode", () => {
    // 2017 rated more often than 2018, but both are all-5s, so each should
    // read 100% at the 5 bucket — percent normalizes away the volume gap.
    const buckets: RatingYearBucket[] = [
      { year: 2017, value: 5, count: 8 },
      { year: 2017, value: 4, count: 2 },
      { year: 2018, value: 5, count: 1 },
    ];
    const { data } = buildHistogramData(buckets, [2017, 2018], "percent");
    const fiveStar = data.find((row) => row.value === 5);
    const fourStar = data.find((row) => row.value === 4);
    expect(fiveStar?.["2017"]).toBeCloseTo(0.8);
    expect(fourStar?.["2017"]).toBeCloseTo(0.2);
    expect(fiveStar?.["2018"]).toBeCloseTo(1);
  });
});

describe("buildAverageMedianByYear", () => {
  it("computes weighted average and median per year, ascending", () => {
    const buckets: RatingYearBucket[] = [
      { year: 2018, value: 4, count: 1 },
      { year: 2017, value: 5, count: 1 },
      { year: 2017, value: 3, count: 1 },
      { year: 2017, value: 4, count: 1 },
    ];
    const points = buildAverageMedianByYear(buckets);

    expect(points.map((point) => point.year)).toEqual([2017, 2018]);
    // 2017: values 3,4,5 → mean 4, odd count → median is the middle value 4.
    expect(points[0]).toMatchObject({ year: 2017, average: 4, median: 4 });
    expect(points[1]).toMatchObject({ year: 2018, average: 4, median: 4 });
  });

  it("averages the two middle buckets when an even total straddles them", () => {
    // Four ratings split evenly across 3 and 4 → median midpoint 3.5.
    const points = buildAverageMedianByYear([
      { year: 2021, value: 3, count: 2 },
      { year: 2021, value: 4, count: 2 },
    ]);
    expect(points[0]).toMatchObject({ average: 3.5, median: 3.5 });
  });

  it("returns the single bucket's value for a year with one distinct rating", () => {
    const points = buildAverageMedianByYear([{ year: 2022, value: 5, count: 7 }]);
    expect(points[0]).toMatchObject({ average: 5, median: 5 });
  });

  it("fills the full requested year range, with nulls for years that have no ratings", () => {
    const points = buildAverageMedianByYear([{ year: 2018, value: 4, count: 1 }], { start: 2016, end: 2019 });
    expect(points.map((point) => point.year)).toEqual([2016, 2017, 2018, 2019]);
    expect(points.find((point) => point.year === 2018)).toMatchObject({ average: 4, median: 4 });
    expect(points.find((point) => point.year === 2017)).toMatchObject({ average: null, median: null });
  });

  it("widens the range to cover data years outside it so no rating is dropped", () => {
    const points = buildAverageMedianByYear(
      [
        { year: 2010, value: 5, count: 1 },
        { year: 2026, value: 4, count: 1 },
      ],
      { start: 2020, end: 2022 },
    );
    expect(points[0].year).toBe(2010);
    expect(points[points.length - 1].year).toBe(2026);
  });
});

describe("availableYears", () => {
  it("returns distinct years earliest-first so chips read left-to-right", () => {
    const buckets: RatingYearBucket[] = [
      { year: 2017, value: 5, count: 1 },
      { year: 2019, value: 4, count: 1 },
      { year: 2017, value: 3, count: 1 },
    ];
    expect(availableYears(buckets)).toEqual([2017, 2019]);
  });
});

describe("percentAxisTicks", () => {
  it("sizes the scale to the tallest bar so columns nearly fill the panel", () => {
    // 41% bar → 10% step, 50% ceiling: the bar fills ~82% of the height.
    expect(percentAxisTicks(0.41)).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5]);
    // 13% bar → 5% step, 15% ceiling: a low max still gets a tight scale.
    expect(percentAxisTicks(0.13)).toEqual([0, 0.05, 0.1, 0.15]);
  });

  it("keeps a sparse-year spike on the same 10% grid as the all-years view", () => {
    // A year with 16 ratings peaking at 9 → 56%: 10% steps to 60%, not a
    // coarse 20% jump, so it doesn't read as a different kind of axis.
    expect(percentAxisTicks(0.5625)).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
  });

  it("leaves headroom when the tallest bar lands exactly on a tick", () => {
    // Two ratings split 50/50 → 50% bars. Ceiling goes to 60%, not 50%, so
    // the bars don't clip the top edge.
    expect(percentAxisTicks(0.5)).toEqual([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
  });

  it("widens the step for tall bars so labels don't crowd", () => {
    expect(percentAxisTicks(0.9)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
  });

  it("never exceeds 100%", () => {
    expect(percentAxisTicks(1)).toEqual([0, 0.2, 0.4, 0.6, 0.8, 1]);
  });

  it("keeps a sane floor when the chart is empty or flat", () => {
    expect(percentAxisTicks(0)).toEqual([0, 0.05]);
  });
});

describe("countAxisTicks", () => {
  it("draws a tight integer axis for a 1-rating year instead of inflating to fit 5 ticks", () => {
    expect(countAxisTicks(1)).toEqual([0, 1]);
  });

  it("steps by 1 while the count is small", () => {
    expect(countAxisTicks(4)).toEqual([0, 1, 2, 3, 4]);
  });

  it("widens to a 1-2-5 step so a big count stays under ~7 gridlines", () => {
    expect(countAxisTicks(9)).toEqual([0, 2, 4, 6, 8, 10]);
    expect(countAxisTicks(150)).toEqual([0, 50, 100, 150]);
  });

  it("never returns a degenerate axis for an empty chart", () => {
    expect(countAxisTicks(0)).toEqual([0, 1]);
  });
});

describe("histogramYAxisConfig", () => {
  it("pins count mode to a tight integer axis (no fractional ticks, no inflated headroom)", () => {
    expect(histogramYAxisConfig(false, 1)).toEqual({
      allowDecimals: false,
      domain: [0, 1],
      ticks: [0, 1],
    });
  });

  it("pins the percent axis to the nice-tick scale", () => {
    expect(histogramYAxisConfig(true, 0.5)).toEqual({
      allowDecimals: true,
      domain: [0, 0.6],
      ticks: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
    });
  });
});
