import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { PaginationControls } from "./pagination-controls";

describe("PaginationControls", () => {
  // Desktop row-count copy shows the explicit "Showing X to Y of N results"
  // phrasing. Mobile uses a compact range; both render so CSS picks one.
  test("renders both desktop and mobile row-range copy", async () => {
    await setup(<PaginationControls page={2} totalPages={5} pageSize={10} total={47} onPageChange={vi.fn()} />);
    expect(screen.getByText("Showing 11 to 20 of 47 results")).toBeInTheDocument();
    expect(screen.getByText("11–20 of 47")).toBeInTheDocument();
  });

  // Zero results: the entire "Showing..." copy collapses to "0 results" so
  // callers don't have to special-case empty lists themselves.
  test("renders '0 results' when total is 0", async () => {
    await setup(<PaginationControls page={1} totalPages={1} pageSize={10} total={0} onPageChange={vi.fn()} />);
    expect(screen.getByText("0 results")).toBeInTheDocument();
  });

  // Single page: row-range copy still renders so users see context, but the
  // Previous/Next chrome is suppressed because clicking it would be a no-op.
  test("hides Previous/Next/page-input when totalPages is 1", async () => {
    await setup(<PaginationControls page={1} totalPages={1} pageSize={10} total={5} onPageChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /next/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
  });

  // On page 1 Previous is disabled but Next is active. The Next click resolves
  // to page 2 via onPageChange — that's the only way the parent learns about
  // navigation, so a regression here breaks every paginated surface.
  test("disables Previous on page 1, Next fires onPageChange(2)", async () => {
    const onPageChange = vi.fn();
    const { user } = await setup(
      <PaginationControls page={1} totalPages={5} pageSize={10} total={47} onPageChange={onPageChange} />,
    );

    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  // On the last page Next is disabled and Previous fires onPageChange(prev).
  test("disables Next on the last page, Previous fires onPageChange(page-1)", async () => {
    const onPageChange = vi.fn();
    const { user } = await setup(
      <PaginationControls page={5} totalPages={5} pageSize={10} total={47} onPageChange={onPageChange} />,
    );

    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  // The page-input field accepts a direct page number and applies it on Enter.
  // Out-of-range values clamp into [1, totalPages] so users can't navigate to
  // a non-existent page.
  test("Enter on page input applies the typed page, clamping to [1, totalPages]", async () => {
    const onPageChange = vi.fn();
    const { user } = await setup(
      <PaginationControls page={1} totalPages={5} pageSize={10} total={47} onPageChange={onPageChange} />,
    );

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "3{enter}");
    expect(onPageChange).toHaveBeenLastCalledWith(3);

    onPageChange.mockClear();
    await user.clear(input);
    await user.type(input, "99{enter}");
    expect(onPageChange).toHaveBeenLastCalledWith(5); // clamped to totalPages

    onPageChange.mockClear();
    await user.clear(input);
    await user.type(input, "0{enter}");
    expect(onPageChange).toHaveBeenLastCalledWith(1); // clamped to 1
  });

  // hidePaginationText hides the left-side row-range copy but keeps the
  // Previous/Next/input controls. Used by callers that surface the count
  // elsewhere on the page.
  test("hidePaginationText drops the row-range copy but keeps the controls", async () => {
    await setup(
      <PaginationControls page={2} totalPages={5} pageSize={10} total={47} onPageChange={vi.fn()} hidePaginationText />,
    );

    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    expect(screen.queryByText(/of 47/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
});
