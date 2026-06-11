import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { StatBox } from "./stat-box";

describe("StatBox", () => {
  test("renders the label and value", () => {
    render(<StatBox label="Total Shows" value={42} />);
    expect(screen.getByText("Total Shows")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  // The icon is optional so song/musician pages (no icon) render unchanged
  // while venue pages can pass one beside the label.
  test("renders an icon beside the label when provided", () => {
    render(<StatBox label="Total Shows" value={42} icon={<svg data-testid="stat-icon" />} />);
    expect(screen.getByTestId("stat-icon")).toBeInTheDocument();
  });

  test("renders no icon when none is provided", () => {
    render(<StatBox label="Total Shows" value={42} />);
    expect(screen.queryByTestId("stat-icon")).not.toBeInTheDocument();
  });
});
