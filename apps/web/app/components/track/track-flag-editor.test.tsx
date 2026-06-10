import type { TrackFlag } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, test } from "vitest";

import { TrackFlagEditor } from "./track-flag-editor";

// Controlled component — drive it through a stateful harness and read the
// current flags back out of the DOM.
function Harness({ initialFlags }: { initialFlags: TrackFlag[] }) {
  const [flags, setFlags] = useState(initialFlags);
  return (
    <>
      <TrackFlagEditor flags={flags} onChange={setFlags} />
      <output data-testid="flags">{JSON.stringify(flags)}</output>
    </>
  );
}
function currentFlags(): TrackFlag[] {
  return JSON.parse(screen.getByTestId("flags").textContent as string);
}

describe("TrackFlagEditor", () => {
  // Seeded flags render checked; the others render unchecked.
  test("reflects the seeded flags as checked", async () => {
    await setupWithRouter(<Harness initialFlags={["DYSLEXIC"]} />);

    expect(screen.getByRole("checkbox", { name: /dyslexic/i })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /inverted/i })).not.toBeChecked();
  });

  // Checking a box adds the flag; unchecking removes it.
  test("toggling a checkbox adds and removes the flag", async () => {
    const { user } = await setupWithRouter(<Harness initialFlags={[]} />);

    await user.click(screen.getByRole("checkbox", { name: /inverted/i }));
    expect(currentFlags()).toEqual(["INVERTED"]);

    await user.click(screen.getByRole("checkbox", { name: /inverted/i }));
    expect(currentFlags()).toEqual([]);
  });
});
