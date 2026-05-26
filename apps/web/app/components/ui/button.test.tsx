import { setup } from "@test/test-utils";
import { describe, expect, test } from "vitest";

import { Button } from "./button";

describe("Button variants", () => {
  // The "brand" variant is the project's primary CTA — the purple
  // bg-brand-primary + bg-hover-accent on hover. Centralizing the styling
  // in the Button's variant system lets every primary submit/Add button
  // declare `variant="brand"` instead of repeating the className string.
  test("variant='brand' applies the brand primary styling", async () => {
    const { container } = await setup(<Button variant="brand">Submit</Button>);
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.className).toContain("bg-brand-primary");
    expect(btn.className).toContain("hover:bg-hover-accent");
  });

  // Picking variant="brand" should NOT pick up the shadcn default variant
  // classes — variants are mutually exclusive.
  test("variant='brand' does not include the default variant's bg-primary", async () => {
    const { container } = await setup(<Button variant="brand">Submit</Button>);
    const btn = container.querySelector("button") as HTMLButtonElement;
    // The default variant uses `bg-primary` (semantic shadcn token); brand
    // uses `bg-brand-primary`. Match-by-word to avoid `bg-brand-primary`
    // false-positive matching `bg-primary`.
    expect(btn.className).not.toMatch(/(^|\s)bg-primary(\s|$)/);
  });

  // The "cancel" variant is the project's secondary "back / dismiss"
  // button — outlined with the dark-theme border, secondary text color,
  // and a fill-on-hover transition that signals the affordance.
  test("variant='cancel' applies the outlined cancel styling with hover state", async () => {
    const { container } = await setup(<Button variant="cancel">Cancel</Button>);
    const btn = container.querySelector("button") as HTMLButtonElement;
    expect(btn.className).toContain("border-content-bg-secondary");
    expect(btn.className).toContain("text-content-text-secondary");
    expect(btn.className).toContain("hover:bg-content-bg-secondary");
    expect(btn.className).toContain("hover:text-content-text-primary");
  });
});
