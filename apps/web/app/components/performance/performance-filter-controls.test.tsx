import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { PerformanceFilterControls } from "./performance-filter-controls";

const defaultProps = {
  selectedYear: "all",
  selectedEra: "all",
  activeToggleSet: new Set<string>(),
  updateFilter: vi.fn(),
  toggleFilter: vi.fn(),
  clearFilters: vi.fn(),
};

describe("PerformanceFilterControls", () => {
  // The search input is opt-in — it only renders when the parent provides
  // searchValue + onSearchChange. Pages that don't need search omit these props.
  test("renders search input when searchValue is provided", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} searchValue="" onSearchChange={() => {}} />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  test("does not render search input when searchValue is not provided", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} />);

    expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
  });

  // The search input is controlled — the parent owns the value and receives
  // change events via onSearchChange. This lets the parent pre-filter data
  // before passing it to the table.
  test("typing in search input calls onSearchChange", async () => {
    const handleSearchChange = vi.fn();
    const { user } = await setup(
      <PerformanceFilterControls {...defaultProps} searchValue="" onSearchChange={handleSearchChange} />,
    );

    await user.type(screen.getByPlaceholderText("Search..."), "hello");
    expect(handleSearchChange).toHaveBeenCalled();
  });

  // Clear All appears in the select filter row (top row) when any filter is
  // active — search text, select dropdowns, or toggle chips. It's a single
  // entry point to reset everything.
  test("renders Clear All button when hasActiveFilters is true", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} hasActiveFilters />);

    expect(screen.getByRole("button", { name: "Clear All" })).toBeInTheDocument();
  });

  test("does not render Clear All button when hasActiveFilters is false", async () => {
    await setup(<PerformanceFilterControls {...defaultProps} hasActiveFilters={false} />);

    expect(screen.queryByRole("button", { name: "Clear All" })).not.toBeInTheDocument();
  });

  // Clicking Clear All delegates to the parent's clearFilters callback, which
  // resets all URL params and search text in the hook.
  test("clicking Clear All calls clearFilters", async () => {
    const handleClearFilters = vi.fn();
    const { user } = await setup(
      <PerformanceFilterControls {...defaultProps} clearFilters={handleClearFilters} hasActiveFilters />,
    );

    await user.click(screen.getByRole("button", { name: "Clear All" }));
    expect(handleClearFilters).toHaveBeenCalledTimes(1);
  });
});
