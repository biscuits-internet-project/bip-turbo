import { setup } from "@test/test-utils";
import { describe, expect, test } from "vitest";

import { Card } from "./card";

describe("Card surface variants", () => {
  // "elevated" is the dominant content-block surface (the old `card-premium`
  // raw class): gradient bg, brand border, drop shadow. It's the no-arg
  // default so a plain <Card> reads as the elevated content block.
  test("variant='elevated' applies the elevated card surface", async () => {
    const { container } = await setup(<Card variant="elevated">content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("card-premium");
  });

  // A no-arg <Card> defaults to the elevated surface — the most common
  // content block — so callers don't have to remember to pick it.
  test("default (no variant) is the elevated surface", async () => {
    const { container } = await setup(<Card>content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("card-premium");
  });

  // "panel" is the flat frosted surface (the old `glass-content` tile look)
  // for things nested inside an elevated card — stat tiles, chart containers.
  test("variant='panel' applies the flat panel surface", async () => {
    const { container } = await setup(<Card variant="panel">content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("glass-content");
  });

  // "plain" is the opaque shadcn escape hatch: the bare bg-card defaults and
  // no project surface class.
  test("variant='plain' applies the bare shadcn card defaults", async () => {
    const { container } = await setup(<Card variant="plain">content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("bg-card");
    expect(card.className).toContain("shadow-sm");
    expect(card.className).not.toContain("card-premium");
    expect(card.className).not.toContain("glass-content");
  });

  // The panel surface is flat by design — the shadcn `shadow-sm` default must
  // not leak onto it (only `elevated` carries elevation).
  test("variant='panel' is flat (no shadcn shadow-sm)", async () => {
    const { container } = await setup(<Card variant="panel">content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).not.toContain("shadow-sm");
  });

  // Caller-supplied className must stack on top of the variant so layout
  // utilities (padding, overflow) compose with the surface.
  test("caller className stacks with the variant classes", async () => {
    const { container } = await setup(
      <Card variant="elevated" className="p-4 overflow-hidden">
        content
      </Card>,
    );
    const card = container.firstElementChild as HTMLElement;
    expect(card.className).toContain("card-premium");
    expect(card.className).toContain("p-4");
    expect(card.className).toContain("overflow-hidden");
  });
});
