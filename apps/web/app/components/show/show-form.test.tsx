import { setup } from "@test/test-utils";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ShowForm, type ShowFormValues } from "./show-form";

// Minimal default values mirroring what shows/$slug.edit.tsx supplies.
const baseValues: ShowFormValues = {
  date: "2017-07-22",
  venueId: "none",
  bandId: "db7f2c5d-2727-41fd-bd6f-e91c74164f09",
  notes: "",
  relistenUrl: "",
  countForStats: true,
  rockOperaIds: [],
};

describe("ShowForm countForStats", () => {
  // Admin needs to mark a soundcheck/radio session as non-stats. The switch
  // is the form's only control for this — toggling it must flow through to
  // the onSubmit payload so the action passes it to ShowService.update.
  test("toggling the count-for-stats switch flips the submitted value", async () => {
    const onSubmit = vi.fn();
    const { user } = await setup(<ShowForm defaultValues={baseValues} onSubmit={onSubmit} submitLabel="Update Show" />);

    const toggle = screen.getByRole("switch", { name: /count for stats/i });
    expect(toggle).toBeChecked();

    await user.click(toggle);
    await user.click(screen.getByRole("button", { name: /update show/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ countForStats: false });
  });

  // Default (new show, no defaults supplied): countForStats should default to
  // true so we don't accidentally exclude every newly-created show from stats.
  test("defaults countForStats to true when no defaults supplied", async () => {
    const onSubmit = vi.fn();
    await setup(<ShowForm onSubmit={onSubmit} />);

    expect(screen.getByRole("switch", { name: /count for stats/i })).toBeChecked();
  });
});
