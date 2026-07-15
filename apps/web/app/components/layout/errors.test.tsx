import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { NotFound } from "./errors";

describe("NotFound", () => {
  // "let us know" is the report-a-problem affordance; it must open the same
  // contact dialog as the footer's Contact link, not deep-link to the
  // community leaderboards (which also gave crawlers a path to that page
  // from every dead URL).
  test("'let us know' opens the contact dialog instead of linking to /community", async () => {
    const { user } = await setupWithRouter(<NotFound />);

    const links = screen.queryAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).not.toContain("/community");

    await user.click(screen.getByRole("button", { name: /let us know/i }));

    expect(await screen.findByText("Get in Touch")).toBeInTheDocument();
  });
});
