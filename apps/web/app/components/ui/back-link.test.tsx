import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { BackLink } from "./back-link";

describe("BackLink", () => {
  test("renders a subtle text link to `to` with the label and a leading icon", async () => {
    await setupWithRouter(<BackLink to="/musicians">All Musicians</BackLink>);

    const link = screen.getByRole("link", { name: "All Musicians" });
    expect(link).toHaveAttribute("href", "/musicians");
    // The low-emphasis content-page treatment (vs. the prominent LinkButton).
    expect(link.className).toContain("text-content-text-tertiary");
    expect(link.querySelector("svg")).toBeInTheDocument();
  });
});
