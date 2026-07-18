import { setup } from "@test/test-utils";
import { describe, expect, test } from "vitest";

import { Button } from "./button";

describe("Button variants", () => {
  // The project adds "brand" (primary CTA) and "cancel" (secondary
  // back/dismiss) on top of the shadcn variants. data-variant exposes the
  // selected variant so tests assert it's applied; the per-variant Tailwind
  // styling is a browser concern.
  test.each([
    "brand",
    "cancel",
    "destructiveOutline",
  ] as const)("variant='%s' is exposed via data-variant", async (variant) => {
    const { container } = await setup(<Button variant={variant}>Go</Button>);
    expect(container.querySelector("button")).toHaveAttribute("data-variant", variant);
  });

  // A bare <Button> resolves to the shadcn default variant.
  test("no variant resolves to data-variant='default'", async () => {
    const { container } = await setup(<Button>Go</Button>);
    expect(container.querySelector("button")).toHaveAttribute("data-variant", "default");
  });
});
