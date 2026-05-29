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
          nugsUrls: ["https://play.nugs.net/release/1"],
          relistenUrl: "https://relisten.net/disco-biscuits/2004/12/31",
          archiveUrl: "https://archive.org/details/db2004",
          youtubeUrl: "https://youtube.com/watch?v=aaa",
        }}
      />,
    );

    expect(screen.getByRole("link", { name: "Available on nugs.net" })).toHaveAttribute(
      "href",
      "https://play.nugs.net/release/1",
    );
    expect(screen.getByRole("link", { name: "Available on Relisten" })).toHaveAttribute(
      "href",
      "https://relisten.net/disco-biscuits/2004/12/31",
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

  // Dual-billed nights (Disco Biscuits + Tractorbeam) surface two nugs
  // releases for the same date. We render one favicon per release so users
  // can tell at a glance there's more than one — disambiguating labels keep
  // the link names unique for assistive tech.
  test("renders one nugs favicon per release URL with disambiguated labels", async () => {
    await setupWithRouter(
      <ShowExternalBadges
        sources={{
          nugsUrls: ["https://play.nugs.net/release/biscuits", "https://play.nugs.net/release/tractorbeam"],
        }}
      />,
    );

    const first = screen.getByRole("link", { name: "Available on nugs.net (release 1)" });
    const second = screen.getByRole("link", { name: "Available on nugs.net (release 2)" });
    expect(first).toHaveAttribute("href", "https://play.nugs.net/release/biscuits");
    expect(second).toHaveAttribute("href", "https://play.nugs.net/release/tractorbeam");
  });

  // Badge icons must carry shrink-0 so they don't get horizontally squeezed
  // when the surrounding row has long sibling text (the "nugs icon looks
  // squished" bug observed on /shows/top-rated mobile rows).
  test("favicon icon and photos camera icon both carry shrink-0", async () => {
    const { container } = await setupWithRouter(
      <ShowExternalBadges
        sources={{ nugsUrls: ["https://play.nugs.net/release/1"] }}
        photosHref="/shows/x#photos"
        photosCount={5}
      />,
    );

    const favicon = container.querySelector("img");
    expect(favicon?.className).toContain("shrink-0");

    const cameraIcon = container.querySelector("svg");
    expect(cameraIcon?.getAttribute("class") ?? "").toContain("shrink-0");
  });

  // External-source links open in a new tab because they leave the site;
  // rel=noopener guards against tab-nabbing.
  test("external-source links open in a new tab with noopener rel", async () => {
    await setupWithRouter(<ShowExternalBadges sources={{ nugsUrls: ["https://play.nugs.net/release/1"] }} />);

    const link = screen.getByRole("link", { name: "Available on nugs.net" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  // Undefined URLs collapse silently — the parent passes raw optional URLs
  // without per-field `&&` gates, so missing services just disappear.
  test("omits favicon links whose URL is undefined", async () => {
    await setupWithRouter(<ShowExternalBadges sources={{ nugsUrls: ["https://play.nugs.net/release/1"] }} />);

    expect(screen.getByRole("link", { name: "Available on nugs.net" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Available on Relisten" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Available on archive.org" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Video on YouTube" })).not.toBeInTheDocument();
  });

  // Photos badge shows count + camera icon and links to the show's
  // #photos anchor, alongside the external-source favicons.
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
});
