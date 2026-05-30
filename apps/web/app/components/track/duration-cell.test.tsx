import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { DurationValue } from "./duration-cell";

describe("DurationValue", () => {
  // The branch the typechecker can't see: a known duration formats to m:ss /
  // h:mm:ss, an unknown one collapses to an em-dash.

  test("formats a known duration", async () => {
    await setup(<DurationValue seconds={3858} />);
    expect(screen.getByText("1:04:18")).toBeInTheDocument();
  });

  test("formats a sub-hour duration as m:ss", async () => {
    await setup(<DurationValue seconds={522} />);
    expect(screen.getByText("8:42")).toBeInTheDocument();
  });

  test("renders an em-dash when the duration is unknown", async () => {
    await setup(<DurationValue seconds={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
