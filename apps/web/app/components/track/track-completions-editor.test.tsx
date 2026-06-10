import { setupWithRouter } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, test } from "vitest";

import { TrackCompletionsEditor } from "./track-completions-editor";
import type { EarlierPerformance } from "./use-track-api";

const OPTIONS: EarlierPerformance[] = [
  { trackId: "t1", showDate: "2010-01-01", showSlug: "2010-01-01-shimmy" },
  { trackId: "t2", showDate: "2012-05-05", showSlug: "2012-05-05-shimmy" },
];

// Controlled component — drive it through a stateful harness and read the
// current selection back out of the DOM.
function Harness({ initialValue, options = OPTIONS }: { initialValue: string[]; options?: EarlierPerformance[] }) {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <TrackCompletionsEditor options={options} value={value} onChange={setValue} />
      <output data-testid="value">{JSON.stringify(value)}</output>
    </>
  );
}
function currentValue(): string[] {
  return JSON.parse(screen.getByTestId("value").textContent as string);
}

describe("TrackCompletionsEditor", () => {
  // Selected links render as dated chips; removing one drops it from the value.
  test("renders selected completions as dated chips and removes on click", async () => {
    const { user } = await setupWithRouter(<Harness initialValue={["t1"]} />);

    expect(screen.getByText("Jan 1, 2010")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /remove completion/i }));
    expect(currentValue()).toEqual([]);
  });

  // A song with no earlier performances shows the empty state, not a picker.
  test("shows an empty state when there are no earlier versions", async () => {
    await setupWithRouter(<Harness initialValue={[]} options={[]} />);

    expect(screen.getByText(/no earlier versions/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/add completed version/i)).not.toBeInTheDocument();
  });

  // The add picker disappears once every earlier version is already selected.
  test("hides the add picker when all options are selected", async () => {
    await setupWithRouter(<Harness initialValue={["t1", "t2"]} />);

    expect(screen.queryByLabelText(/add completed version/i)).not.toBeInTheDocument();
    expect(screen.getByText("Jan 1, 2010")).toBeInTheDocument();
    expect(screen.getByText("May 5, 2012")).toBeInTheDocument();
  });
});
