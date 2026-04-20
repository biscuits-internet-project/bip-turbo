import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ShowExternalBadges } from "./show-external-badges";

describe("ShowExternalBadges", () => {
  // With no external URLs and no photos the strip renders nothing — listing
  // pages shouldn't waste vertical space on an empty badge row.
  test("renders nothing when no sources or photos are present", async () => {
    const { container } = await setupWithRouter(<ShowExternalBadges sources={{}} />);

    expect(container.firstChild).toBeNull();
  });

  // Each present URL produces a linked favicon so users can jump straight to
  // the external service from the setlist row.
  test("renders favicon links for every present external source", async () => {
    await setupWithRouter(
      <ShowExternalBadges
        sources={{
          nugsUrl: "https://play.nugs.net/release/1",
          archiveUrl: "https://archive.org/details/db2004",
          youtubeUrl: "https://youtube.com/watch?v=aaa",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "Available on nugs.net" })).toHaveAttribute(
      "href",
      "https://play.nugs.net/release/1",
    );
    expect(screen.getByRole("link", { name: "Available on archive.org" })).toHaveAttribute(
      "href",
      "https://archive.org/details/db2004",
    );
    expect(screen.getByRole("link", { name: "Video on YouTube" })).toHaveAttribute(
      "href",
      "https://youtube.com/watch?v=aaa",
    );
  });

  // External-source links open in a new tab because they leave the site;
  // rel=noopener guards against tab-nabbing.
  test("external-source links open in a new tab with noopener rel", async () => {
    await setupWithRouter(<ShowExternalBadges sources={{ nugsUrl: "https://play.nugs.net/release/1" }} />);

    const link = screen.getByRole("link", { name: "Available on nugs.net" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  // Undefined URLs collapse silently — the parent passes raw optional URLs
  // without per-field `&&` gates, so missing services just disappear.
  test("omits favicon links whose URL is undefined", async () => {
    await setupWithRouter(<ShowExternalBadges sources={{ nugsUrl: "https://play.nugs.net/release/1" }} />);

    expect(screen.getByRole("link", { name: "Available on nugs.net" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Available on archive.org" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Video on YouTube" })).not.toBeInTheDocument();
  });

  // Photos badge shows count + camera icon and links to the show's #photos
  // anchor; it used to live in the card footer but was hoisted here so the
  // visual grouping matches the external-source badges.
  test("renders photos badge with count when href + positive count provided", async () => {
    await setupWithRouter(<ShowExternalBadges sources={{}} photosHref="/shows/2004-12-31#photos" photosCount={12} />);

    const link = screen.getByRole("link", { name: "12" });
    expect(link).toHaveAttribute("href", "/shows/2004-12-31#photos");
    expect(link).toHaveAttribute("title", "12 photos");
  });

  // A zero or missing photo count collapses the badge — we don't want an
  // empty "0 photos" link cluttering rows for shows that haven't been
  // photographed.
  test("omits photos badge when count is zero", async () => {
    await setupWithRouter(<ShowExternalBadges sources={{}} photosHref="/shows/2004-12-31#photos" photosCount={0} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  // photosHref without a count (or count without href) is treated the same
  // as no photos — both fields are required to render the badge.
  test("omits photos badge when href is missing even with a positive count", async () => {
    await setupWithRouter(<ShowExternalBadges sources={{}} photosCount={5} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  // Custom className is applied to the container so callers can tweak
  // spacing/alignment per route without touching the component.
  test("applies custom className to the container", async () => {
    const { container } = await setupWithRouter(
      <ShowExternalBadges sources={{ nugsUrl: "https://play.nugs.net/release/1" }} className="my-strip" />,
    );

    expect(container.firstChild).toHaveClass("my-strip");
  });
});
