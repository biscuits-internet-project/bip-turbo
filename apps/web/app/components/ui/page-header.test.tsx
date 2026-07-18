import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { PageHeader } from "./page-header";

describe("PageHeader", () => {
  test("renders the title as a heading", async () => {
    await setupWithRouter(<PageHeader title="MUSICIANS" />);

    expect(screen.getByRole("heading", { name: "MUSICIANS" })).toBeInTheDocument();
  });

  test("renders actions and a back link in the control row", async () => {
    await setupWithRouter(
      <PageHeader
        title="MUSICIANS"
        backLink={{ to: "/musicians", label: "All Musicians" }}
        actions={<button type="button">Create Musician</button>}
      />,
    );

    expect(screen.getByRole("link", { name: "All Musicians" })).toHaveAttribute("href", "/musicians");
    expect(screen.getByRole("button", { name: "Create Musician" })).toBeInTheDocument();
  });

  test("renders no back link or control affordances when none are given", async () => {
    await setupWithRouter(<PageHeader title="BLOG" />);

    expect(screen.getByRole("heading", { name: "BLOG" })).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
