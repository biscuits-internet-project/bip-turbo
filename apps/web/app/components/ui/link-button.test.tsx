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

  // intent maps to the underlying Button variant (default = filled primary,
  // outline = secondary), exposed via data-variant on the rendered link.
  test("uses the primary variant by default and the outline variant on request", async () => {
    const { unmount } = await setupWithRouter(<LinkButton to="/x">Primary</LinkButton>);
    expect(screen.getByRole("link", { name: "Primary" })).toHaveAttribute("data-variant", "default");
    unmount();

    await setupWithRouter(
      <LinkButton to="/x" intent="secondary">
        Secondary
      </LinkButton>,
    );
    expect(screen.getByRole("link", { name: "Secondary" })).toHaveAttribute("data-variant", "outline");
  });

  // iconOnlyOnMobile hides the label visually on small screens (icon only) but
  // must keep it in the accessibility tree so the link still has a name. The
  // visual hide itself (sr-only) is a browser concern.
  test("with iconOnlyOnMobile, the label stays in the link's accessible name", async () => {
    await setupWithRouter(
      <LinkButton to="/x" icon={Plus} iconOnlyOnMobile>
        Create Song
      </LinkButton>,
    );

    expect(screen.getByRole("link", { name: "Create Song" })).toBeInTheDocument();
  });
});
