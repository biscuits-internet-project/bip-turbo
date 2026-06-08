import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";

// The route module imports the loader factory, which pulls in server-only env.
vi.mock("~/lib/base-loaders", () => ({ publicLoader: vi.fn() }));

import Music from "./music";

describe("Music terminology page", () => {
  // Setlist footnotes link the "dyslexic" / "inverted" flag labels at
  // #dyslexic / #inverted, so those anchors must exist on this page.
  test("exposes the anchors the setlist footnotes link to", () => {
    const { container } = render(
      <MemoryRouter>
        <Music />
      </MemoryRouter>,
    );
    expect(container.querySelector("#inverted")).not.toBeNull();
    expect(container.querySelector("#dyslexic")).not.toBeNull();
  });
});
