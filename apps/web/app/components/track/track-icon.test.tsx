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

  // All-timer (with or without a note) is the all-timer variant — the stronger
  // of the two signals. The variant is exposed via the flame's aria-label; its
  // orange-vs-gold color is a browser concern.
  test("renders the all-timer variant when allTimer is true", () => {
    render(<TrackIcon track={{ allTimer: true, note: null }} />);
    expect(screen.getByLabelText("All-timer")).toBeInTheDocument();
  });

  // Jam-chart (note only) is the jam-chart variant, not all-timer.
  test("renders the jam-chart variant when only note is set", () => {
    render(<TrackIcon track={{ allTimer: false, note: "Big Type II Spaga." }} />);
    expect(screen.getByLabelText("Jam chart")).toBeInTheDocument();
    expect(screen.queryByLabelText("All-timer")).not.toBeInTheDocument();
  });

  // When both flags are set, all-timer wins — it's the stronger signal.
  test("all-timer variant wins when both allTimer and note are set", () => {
    render(<TrackIcon track={{ allTimer: true, note: "Story of the World > Crickets." }} />);
    expect(screen.getByLabelText("All-timer")).toBeInTheDocument();
    expect(screen.queryByLabelText("Jam chart")).not.toBeInTheDocument();
  });

  // Allow callers to pin a custom size — the same component is used in dense
  // table cells (smaller) and standalone sections (larger). Verifies the
  // iconClassName passthrough reaches the flame.
  test("forwards iconClassName onto the flame", () => {
    render(<TrackIcon track={{ allTimer: true, note: null }} iconClassName="custom-size-marker" />);
    expect(screen.getByLabelText("All-timer").getAttribute("class") ?? "").toContain("custom-size-marker");
  });
});
