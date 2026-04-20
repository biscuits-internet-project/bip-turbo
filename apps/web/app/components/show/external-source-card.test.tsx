import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ExternalSourceCard } from "./external-source-card";

describe("ExternalSourceCard", () => {
  // The heading text is the visible label for the card, so users can
  // scan the right column and tell nugs/archive/YouTube apart at a glance.
  test("renders the service title", async () => {
    await setup(
      <ExternalSourceCard faviconDomain="nugs.net" title="Official release">
        <span>child</span>
      </ExternalSourceCard>,
    );

    expect(screen.getByRole("heading", { name: "Official release" })).toBeInTheDocument();
  });

  // The favicon domain flows through to a Google s2 favicon URL so each
  // card's icon matches its service without per-domain asset wrangling.
  test("renders a favicon img sourced from the given domain", async () => {
    const { container } = await setup(
      <ExternalSourceCard faviconDomain="archive.org" title="Archive.org">
        <span>child</span>
      </ExternalSourceCard>,
    );

    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute("src")).toContain("archive.org");
  });

  // The card is a pure shell — children render inside untouched so each
  // per-service card (nugs/archive/YouTube) can own its own body layout.
  test("renders children inside the card body", async () => {
    await setup(
      <ExternalSourceCard faviconDomain="nugs.net" title="Official release">
        <p>Basis for a Day</p>
      </ExternalSourceCard>,
    );

    expect(screen.getByText("Basis for a Day")).toBeInTheDocument();
  });
});
