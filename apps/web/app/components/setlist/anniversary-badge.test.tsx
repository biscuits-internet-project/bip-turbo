import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AnniversaryBadge } from "./anniversary-badge";

describe("AnniversaryBadge", () => {
  // Displays 5th anniversary text for a show 5 years ago
  test("displays '5th Anniversary' for a 5-year-old show", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    await setupWithRouter(<AnniversaryBadge showDate="2021-04-14" />);
    expect(screen.getByText(/5th Anniversary/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  // Displays 10th anniversary text for a show 10 years ago
  test("displays '10th Anniversary' for a 10-year-old show", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    await setupWithRouter(<AnniversaryBadge showDate="2016-04-14" />);
    expect(screen.getByText(/10th Anniversary/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  // Displays 20th anniversary text for a show 20 years ago
  test("displays '20th Anniversary' for a 20-year-old show", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    await setupWithRouter(<AnniversaryBadge showDate="2006-04-14" />);
    expect(screen.getByText(/20th Anniversary/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  // Displays 25th anniversary text for a show 25 years ago
  test("displays '25th Anniversary' for a 25-year-old show", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    await setupWithRouter(<AnniversaryBadge showDate="2001-04-14" />);
    expect(screen.getByText(/25th Anniversary/)).toBeInTheDocument();
    vi.useRealTimers();
  });

  // Renders an icon for anniversary shows
  test("renders an icon", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    const { container } = await setupWithRouter(<AnniversaryBadge showDate="2016-04-14" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    vi.useRealTimers();
  });

  // Uses amber-400 text color
  test("applies amber-400 color", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    const { container } = await setupWithRouter(<AnniversaryBadge showDate="2021-04-14" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("text-amber-400");
    vi.useRealTimers();
  });

  // Renders nothing for a non-anniversary show
  test("renders nothing for a non-anniversary show", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    const { container } = await setupWithRouter(<AnniversaryBadge showDate="2023-04-14" />);
    expect(container.firstChild).toBeNull();
    vi.useRealTimers();
  });

  // Renders nothing for a show from the current year
  test("renders nothing for a show from the current year", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-14"));
    const { container } = await setupWithRouter(<AnniversaryBadge showDate="2026-04-14" />);
    expect(container.firstChild).toBeNull();
    vi.useRealTimers();
  });
});
