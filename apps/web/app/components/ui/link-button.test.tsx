import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { Plus } from "lucide-react";
import { describe, expect, test } from "vitest";

import { LinkButton } from "./link-button";

describe("LinkButton", () => {
  test("renders a link to `to` with the label", async () => {
    await setupWithRouter(<LinkButton to="/admin/musicians/new">Create Musician</LinkButton>);

    expect(screen.getByRole("link", { name: "Create Musician" })).toHaveAttribute("href", "/admin/musicians/new");
  });

  test("renders an icon when one is provided", async () => {
    await setupWithRouter(
      <LinkButton to="/x" icon={Plus}>
        Create
      </LinkButton>,
    );

    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  test("omits the icon when none is given", async () => {
    await setupWithRouter(<LinkButton to="/x">Plain</LinkButton>);

    expect(document.querySelector("svg")).not.toBeInTheDocument();
  });

  test("applies the primary style by default and the secondary style on request", async () => {
    const { unmount } = await setupWithRouter(<LinkButton to="/x">Primary</LinkButton>);
    expect(screen.getByRole("link", { name: "Primary" }).className).toContain("btn-primary");
    unmount();

    await setupWithRouter(
      <LinkButton to="/x" intent="secondary">
        Secondary
      </LinkButton>,
    );
    expect(screen.getByRole("link", { name: "Secondary" }).className).toContain("btn-secondary");
  });

  // iconOnlyOnMobile hides the label visually on small screens (icon only) but
  // keeps it in the accessibility tree so the link still has a name.
  test("with iconOnlyOnMobile, the label is screen-reader-only until sm", async () => {
    await setupWithRouter(
      <LinkButton to="/x" icon={Plus} iconOnlyOnMobile>
        Create Song
      </LinkButton>,
    );

    const link = screen.getByRole("link", { name: "Create Song" });
    const label = link.querySelector("span");
    expect(label?.className).toContain("sr-only");
    expect(label?.className).toContain("sm:not-sr-only");
  });
});
