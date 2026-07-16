import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TrackIcon } from "./track-icon";

describe("TrackIcon", () => {
  // A track with neither flag set is not noteworthy, so the component
  // renders nothing rather than leave an invisible marker.
  test("renders nothing when neither allTimer nor note is set", () => {
    const { container } = render(<TrackIcon track={{ allTimer: false, note: null }} />);
    expect(container).toBeEmptyDOMElement();
  });

  // Empty-string / whitespace-only notes carry no information; they
  // should not flip the icon into the jam-chart variant.
  test("treats blank-string notes as absent", () => {
    const { container } = render(<TrackIcon track={{ allTimer: false, note: "   " }} />);
    expect(container).toBeEmptyDOMElement();
  });

  // All-timer (with or without a note) takes the orange flame — it's the
  // stronger of the two signals and the user-facing color contract.
  test("renders an orange flame when allTimer is true", () => {
    render(<TrackIcon track={{ allTimer: true, note: null }} />);
    const flame = screen.getByLabelText("All-timer");
    expect(flame.getAttribute("class") ?? "").toMatch(/text-flame-all-timer/);
  });

  // Jam-chart (note only) gets the gold flame. Color is the only thing telling
  // the two markers apart, so each carries its own token rather than inheriting
  // from the caller — the two are close in hue and easy to conflate otherwise.
  test("renders a gold flame when only note is set", () => {
    render(<TrackIcon track={{ allTimer: false, note: "Big Type II Spaga." }} />);
    const flame = screen.getByLabelText("Jam chart");
    expect(flame.getAttribute("class") ?? "").toMatch(/text-flame-jam/);
    expect(flame.getAttribute("class") ?? "").not.toMatch(/text-flame-all-timer/);
  });

  // When both flags are set, orange (all-timer) wins — it's the stronger
  // signal. Callers that want to surface the note do so via the
  // surrounding hover overlay, not via this icon's color.
  test("orange flame wins when both allTimer and note are set", () => {
    render(<TrackIcon track={{ allTimer: true, note: "Story of the World > Crickets." }} />);
    const flame = screen.getByLabelText("All-timer");
    expect(flame.getAttribute("class") ?? "").toMatch(/text-flame-all-timer/);
  });

  // Allow callers to pin a custom size — the same component is used in
  // dense table cells (smaller) and standalone sections (larger).
  test("iconClassName overrides the default size classes on the flame", () => {
    render(<TrackIcon track={{ allTimer: true, note: null }} iconClassName="h-3 w-3" />);
    const flame = screen.getByLabelText("All-timer");
    expect(flame.getAttribute("class") ?? "").toMatch(/h-3/);
    expect(flame.getAttribute("class") ?? "").toMatch(/w-3/);
  });
});
