import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { BackLink } from "./back-link";

describe("BackLink", () => {
  test("renders a subtle text link to `to` with the label and a leading icon", async () => {
    await setupWithRouter(<BackLink to="/musicians">All Musicians</BackLink>);

    const link = screen.getByRole("link", { name: "All Musicians" });
    expect(link).toHaveAttribute("href", "/musicians");
    expect(link.querySelector("svg")).toBeInTheDocument();
  });
});
