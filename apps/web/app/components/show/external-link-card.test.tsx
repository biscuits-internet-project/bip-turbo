import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ExternalLinkCard } from "./external-link-card";

describe("ExternalLinkCard", () => {
  // Empty list collapses the card — callers pass the raw pre-labeled list
  // so shows with no links for a service shouldn't render an empty shell.
  test("renders nothing for empty items", async () => {
    const { container } = await setup(
      <ExternalLinkCard faviconDomain="nugs.net" title="Official release" items={[]} />,
    );

    expect(container.firstChild).toBeNull();
  });

  // Each item renders as an outbound link whose visible text is the
  // pre-built label; the card itself does no label manipulation.
  test("renders each item as an outbound link using the supplied label", async () => {
    await setup(
      <ExternalLinkCard
        faviconDomain="youtube.com"
        title="Video"
        items={[
          { url: "https://youtube.com/watch?v=aaa", label: "Watch on YouTube (1)" },
          { url: "https://youtube.com/watch?v=bbb", label: "Watch on YouTube (2)" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Watch on YouTube (1)" })).toHaveAttribute(
      "href",
      "https://youtube.com/watch?v=aaa",
    );
    expect(screen.getByRole("link", { name: "Watch on YouTube (2)" })).toHaveAttribute(
      "href",
      "https://youtube.com/watch?v=bbb",
    );
  });

  // Links open in a new tab because they leave the site; rel=noopener
  // guards against tab-nabbing on the external target.
  test("links open in a new tab with noopener rel", async () => {
    await setup(
      <ExternalLinkCard
        faviconDomain="nugs.net"
        title="Official release"
        items={[{ url: "https://play.nugs.net/release/1", label: "Listen on nugs.net" }]}
      />,
    );

    const link = screen.getByRole("link", { name: "Listen on nugs.net" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  // The card title is the visible heading from the shell, so users can
  // tell different services apart when multiple link cards stack.
  test("passes the title through to the card shell heading", async () => {
    await setup(
      <ExternalLinkCard
        faviconDomain="nugs.net"
        title="Official release"
        items={[{ url: "https://play.nugs.net/release/1", label: "Listen on nugs.net" }]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Official release" })).toBeInTheDocument();
  });
});
