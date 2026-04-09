import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { MonthDayPicker } from "./month-day-picker";

const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return { ...actual, useNavigate: () => mockNavigate };
});

describe("MonthDayPicker", () => {
  // The trigger button shows the formatted display label so users know
  // what date they're viewing before opening the picker.
  test("renders the display label as the trigger button", async () => {
    await setupWithRouter(<MonthDayPicker monthDay="04-08" displayLabel="April 8" />);

    expect(screen.getByRole("button", { name: /April 8/ })).toBeInTheDocument();
  });

  // The calendar icon next to the label hints that the date is clickable.
  test("renders a calendar icon in the trigger", async () => {
    const { container } = await setupWithRouter(<MonthDayPicker monthDay="12-30" displayLabel="December 30" />);

    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  // Clicking the trigger opens the popover with a calendar showing the
  // correct month for the current monthDay.
  test("opens calendar popover on click showing the correct month", async () => {
    const { user } = await setupWithRouter(<MonthDayPicker monthDay="04-08" displayLabel="April 8" />);

    await user.click(screen.getByRole("button", { name: /April 8/ }));

    expect(screen.getByText("April")).toBeInTheDocument();
  });

  // Selecting a date in the calendar navigates to the corresponding
  // on-this-day URL with zero-padded MM-DD format.
  test("navigates to selected date on click", async () => {
    const { user } = await setupWithRouter(<MonthDayPicker monthDay="04-08" displayLabel="April 8" />);

    await user.click(screen.getByRole("button", { name: /April 8/ }));
    // Click day 15 in the opened calendar
    await user.click(screen.getByText("15"));

    expect(mockNavigate).toHaveBeenCalledWith("/on-this-day/04-15");
  });

  // Selecting a date dismisses the popover so it doesn't obscure the
  // page content after navigation.
  test("closes popover after selecting a date", async () => {
    const { user } = await setupWithRouter(<MonthDayPicker monthDay="04-08" displayLabel="April 8" />);

    await user.click(screen.getByRole("button", { name: /April 8/ }));
    expect(screen.getByText("April")).toBeInTheDocument();

    await user.click(screen.getByText("15"));
    expect(screen.queryByText("April")).not.toBeInTheDocument();
  });

  // The calendar hides weekday headers since this picker is year-agnostic
  // and weekdays are meaningless without a specific year.
  test("does not render weekday headers", async () => {
    const { user } = await setupWithRouter(<MonthDayPicker monthDay="04-08" displayLabel="April 8" />);

    await user.click(screen.getByRole("button", { name: /April 8/ }));

    expect(screen.queryByText("Su")).not.toBeInTheDocument();
    expect(screen.queryByText("Mo")).not.toBeInTheDocument();
  });

  // The caption shows only the month name without a year, since year 2000
  // is used internally just for date math (leap year support).
  test("caption shows month name without year", async () => {
    const { user } = await setupWithRouter(<MonthDayPicker monthDay="02-29" displayLabel="February 29" />);

    await user.click(screen.getByRole("button", { name: /February 29/ }));

    expect(screen.getByText("February")).toBeInTheDocument();
    expect(screen.queryByText("2000")).not.toBeInTheDocument();
  });
});
