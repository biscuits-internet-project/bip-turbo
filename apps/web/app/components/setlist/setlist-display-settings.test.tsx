import { setupWithRouter } from "@test/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { PREFERENCES_DEFAULT } from "~/hooks/use-preferences";
import { SetlistDisplaySettings } from "./setlist-display-settings";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("SetlistDisplaySettings", () => {
  // The switch has to show the app default for a viewer who never chose, or it
  // claims a state the setlist isn't actually in. Asserted against the constant
  // so flipping the default doesn't need a test edit.
  test("shows the app default when the viewer has never chosen", async () => {
    await setupWithRouter(<SetlistDisplaySettings showSetlistTimes={null} />);
    expect(screen.getByLabelText("Show set times")).toHaveAttribute(
      "aria-checked",
      String(PREFERENCES_DEFAULT.showSetlistTimes),
    );
  });

  test("reflects an explicit opt-out", async () => {
    await setupWithRouter(<SetlistDisplaySettings showSetlistTimes={false} />);
    expect(screen.getByLabelText("Show set times")).toHaveAttribute("aria-checked", "false");
  });

  test("auto-saves the opt-out to /api/users immediately on toggle (no save button)", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    const { user } = await setupWithRouter(<SetlistDisplaySettings showSetlistTimes={null} />);
    await user.click(screen.getByLabelText("Show set times"));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/users");
    expect(init.method).toBe("POST");
    expect((init.body as FormData).get("showSetlistTimes")).toBe("false");
  });

  // Holds the response open so the optimistic flip is observable on its own.
  // Asserting only the end state can't tell a revert apart from a toggle that
  // never moved, since both land back where they started.
  test("flips optimistically, then reverts when the save fails", async () => {
    let settle: () => void = () => {};
    const pending = new Promise<{ ok: boolean }>((resolve) => {
      settle = () => resolve({ ok: false });
    });
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(pending));

    const { user } = await setupWithRouter(<SetlistDisplaySettings showSetlistTimes={true} />);
    const toggle = screen.getByLabelText("Show set times");
    expect(toggle).toHaveAttribute("aria-checked", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");

    settle();
    await waitFor(() => expect(toggle).toHaveAttribute("aria-checked", "true"));
  });
});
