import type { SortingState } from "@tanstack/react-table";
import { describe, expect, test } from "vitest";
import { readSortingParams, writeSortingParams } from "./table-sort-params";

const DEFAULT: SortingState = [{ id: "date", desc: true }];

describe("readSortingParams", () => {
  test("falls back to the table's own default on a bare URL", () => {
    expect(readSortingParams(new URLSearchParams(), DEFAULT)).toEqual(DEFAULT);
  });

  test("reads a shared descending sort", () => {
    expect(readSortingParams(new URLSearchParams("sort=rating"), DEFAULT)).toEqual([{ id: "rating", desc: true }]);
  });

  test("reads a shared ascending sort", () => {
    expect(readSortingParams(new URLSearchParams("sort=duration&dir=asc"), DEFAULT)).toEqual([
      { id: "duration", desc: false },
    ]);
  });

  test("treats a column with no direction as descending, matching every column's first click", () => {
    expect(readSortingParams(new URLSearchParams("sort=medianGap&dir=whatever"), DEFAULT)[0].desc).toBe(true);
  });
});

describe("writeSortingParams", () => {
  test("leaves a bare URL bare when the sort is the default", () => {
    expect(writeSortingParams(new URLSearchParams(), DEFAULT, DEFAULT).toString()).toBe("");
  });

  test("clears a stale sort when the viewer returns to the default", () => {
    const next = writeSortingParams(new URLSearchParams("sort=rating&dir=asc"), DEFAULT, DEFAULT);

    expect(next.toString()).toBe("");
  });

  test("writes only the column for a descending sort", () => {
    const next = writeSortingParams(new URLSearchParams(), [{ id: "rating", desc: true }], DEFAULT);

    expect(next.toString()).toBe("sort=rating");
  });

  test("writes the direction for an ascending sort", () => {
    const next = writeSortingParams(new URLSearchParams(), [{ id: "duration", desc: false }], DEFAULT);

    expect(next.get("sort")).toBe("duration");
    expect(next.get("dir")).toBe("asc");
  });

  test("drops the direction when flipping an ascending sort back to descending", () => {
    const next = writeSortingParams(
      new URLSearchParams("sort=rating&dir=asc"),
      [{ id: "rating", desc: true }],
      DEFAULT,
    );

    expect(next.get("dir")).toBeNull();
    expect(next.get("sort")).toBe("rating");
  });

  test("clears both keys when sorting is removed entirely", () => {
    expect(writeSortingParams(new URLSearchParams("sort=rating"), [], DEFAULT).toString()).toBe("");
  });

  test("preserves the filters sharing the URL", () => {
    const next = writeSortingParams(
      new URLSearchParams("timeRange=2001&nugs=yes"),
      [{ id: "rating", desc: true }],
      DEFAULT,
    );

    expect(next.get("timeRange")).toBe("2001");
    expect(next.get("nugs")).toBe("yes");
  });
});
