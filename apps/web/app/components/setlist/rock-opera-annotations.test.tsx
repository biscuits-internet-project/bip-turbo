import type { RockOperaPerformanceAnnotation } from "@bip/domain";
import { setupWithRouter } from "@test/test-utils";
import { screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { RockOperaAnnotations } from "./rock-opera-annotations";

function makeAnnotation(overrides: Partial<RockOperaPerformanceAnnotation> = {}): RockOperaPerformanceAnnotation {
  return {
    rockOpera: { slug: "hot-air-balloon", name: "The Hot Air Balloon", shortName: "HAB" },
    performanceNumber: 3,
    previousPerformance: { date: "1999-01-24", slug: "1999-01-24-natick", gap: 7 },
    nextPerformance: { date: "1999-05-11", slug: "1999-05-11-fourth", gap: 12 },
    ...overrides,
  };
}

describe("RockOperaAnnotations", () => {
  // Empty list short-circuits with no DOM — caller doesn't need a guard.
  test("renders nothing when performances is empty", async () => {
    const { container } = await setupWithRouter(<RockOperaAnnotations performances={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  // The lead sentence with ordinal suffix + linked rock opera name. The
  // star sits in its own non-shrinking flex column so wrapped text aligns
  // under "This was…" (visual concern verified by inspection; functional
  // assertion is just that the markup exists).
  test("renders the 'Nth full performance of <name>' sentence linking to the resource page", async () => {
    await setupWithRouter(<RockOperaAnnotations performances={[makeAnnotation({ performanceNumber: 3 })]} />);

    expect(screen.getByText(/3rd full performance of/i)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "The Hot Air Balloon" });
    expect(link).toHaveAttribute("href", "/resources/hot-air-balloon");
  });

  // Ordinal helper covers the 1st/2nd/3rd edge cases — spot-check each so
  // a regression in the helper or its usage surfaces here.
  test.each([
    [1, "1st"],
    [2, "2nd"],
    [3, "3rd"],
    [4, "4th"],
    [11, "11th"],
    [21, "21st"],
  ])("renders ordinal '%s' for performance number %i", async (num, ordinal) => {
    await setupWithRouter(<RockOperaAnnotations performances={[makeAnnotation({ performanceNumber: num })]} />);
    expect(screen.getByText(new RegExp(`${ordinal} full performance of`, "i"))).toBeInTheDocument();
  });

  // Previous/Next rows render with M/D/YYYY dates, "X shows earlier/later"
  // gap notes, and links to the prev/next show pages. The 3-column grid
  // ordering (label, date, gap-note) is checked indirectly via the
  // rendered text content.
  test("renders previous and next adjacent rows with linked dates + gap notes", async () => {
    await setupWithRouter(
      <RockOperaAnnotations
        performances={[
          makeAnnotation({
            previousPerformance: { date: "1999-01-24", slug: "1999-01-24-natick", gap: 7 },
            nextPerformance: { date: "1999-05-11", slug: "1999-05-11-fourth", gap: 12 },
          }),
        ]}
      />,
    );

    expect(screen.getByText("Previous:")).toBeInTheDocument();
    expect(screen.getByText("Next:")).toBeInTheDocument();
    expect(screen.getByText("(7 shows earlier)")).toBeInTheDocument();
    expect(screen.getByText("(12 shows later)")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /1\/24\/1999/ })).toHaveAttribute("href", "/shows/1999-01-24-natick");
    expect(screen.getByRole("link", { name: /5\/11\/1999/ })).toHaveAttribute("href", "/shows/1999-05-11-fourth");
  });

  // Singular form: "1 show earlier" — guards against the off-by-one
  // pluralization bug where "1 shows" leaks through.
  test("uses singular 'show' (no s) when gap is exactly 1", async () => {
    await setupWithRouter(
      <RockOperaAnnotations
        performances={[
          makeAnnotation({
            previousPerformance: { date: "1999-01-24", slug: "1999-01-24-natick", gap: 1 },
            nextPerformance: { date: "1999-05-11", slug: "1999-05-11-fourth", gap: 1 },
          }),
        ]}
      />,
    );
    expect(screen.getByText("(1 show earlier)")).toBeInTheDocument();
    expect(screen.getByText("(1 show later)")).toBeInTheDocument();
  });

  // 1st-ever performance: no "Previous:" row at all. Same for the most
  // recent performance and "Next:". Drives the empty-row branch in the
  // adjacent-performance grid.
  test("hides the Previous row when previousPerformance is null", async () => {
    await setupWithRouter(
      <RockOperaAnnotations
        performances={[
          makeAnnotation({
            previousPerformance: null,
            nextPerformance: { date: "1999-05-11", slug: "1999-05-11-fourth", gap: 12 },
          }),
        ]}
      />,
    );
    expect(screen.queryByText("Previous:")).toBeNull();
    expect(screen.getByText("Next:")).toBeInTheDocument();
  });

  test("hides the Next row when nextPerformance is null", async () => {
    await setupWithRouter(
      <RockOperaAnnotations
        performances={[
          makeAnnotation({
            previousPerformance: { date: "1999-01-24", slug: "1999-01-24-natick", gap: 7 },
            nextPerformance: null,
          }),
        ]}
      />,
    );
    expect(screen.getByText("Previous:")).toBeInTheDocument();
    expect(screen.queryByText("Next:")).toBeNull();
  });

  // Both nulls (a one-and-only performance, e.g. Revolution In Motion):
  // the entire prev/next grid is suppressed. The lead sentence still
  // renders.
  test("omits the adjacent grid entirely when both prev and next are null", async () => {
    await setupWithRouter(
      <RockOperaAnnotations performances={[makeAnnotation({ previousPerformance: null, nextPerformance: null })]} />,
    );
    expect(screen.queryByText("Previous:")).toBeNull();
    expect(screen.queryByText("Next:")).toBeNull();
    expect(screen.getByText(/3rd full performance of/i)).toBeInTheDocument();
  });

  // Defensive: when an adjacent performance has no slug (Show.slug is
  // nullable in Prisma), the date renders as plain text, not a broken
  // link to `/shows/null`.
  test("renders the date as plain text when an adjacent slug is null", async () => {
    await setupWithRouter(
      <RockOperaAnnotations
        performances={[
          makeAnnotation({
            previousPerformance: { date: "1999-01-24", slug: null, gap: 7 },
            nextPerformance: null,
          }),
        ]}
      />,
    );
    expect(screen.queryByRole("link", { name: /1\/24\/1999/ })).toBeNull();
    expect(screen.getByText("1/24/1999")).toBeInTheDocument();
  });

  // Multiple annotations on the same show (rare — a show tagged with two
  // rock operas) → one block per opera. Verifies the .map() over the
  // outer list and that each block carries its own data.
  test("renders one block per annotation when a show is tagged with multiple operas", async () => {
    const { container } = await setupWithRouter(
      <RockOperaAnnotations
        performances={[
          makeAnnotation({
            rockOpera: { slug: "hot-air-balloon", name: "The Hot Air Balloon", shortName: "HAB" },
            performanceNumber: 1,
            previousPerformance: null,
          }),
          makeAnnotation({
            rockOpera: { slug: "chemical-warfare-brigade", name: "Chemical Warfare Brigade", shortName: "CWB" },
            performanceNumber: 5,
            nextPerformance: null,
          }),
        ]}
      />,
    );
    const habLink = screen.getByRole("link", { name: "The Hot Air Balloon" });
    const cwbLink = screen.getByRole("link", { name: "Chemical Warfare Brigade" });
    expect(habLink).toHaveAttribute("href", "/resources/hot-air-balloon");
    expect(cwbLink).toHaveAttribute("href", "/resources/chemical-warfare-brigade");
    // Two outer rows under the wrapper — sanity check on the .map() length.
    const wrapper = container.firstElementChild;
    expect(wrapper?.children).toHaveLength(2);
    expect(within(wrapper as HTMLElement).getByText(/1st full performance of/i)).toBeInTheDocument();
    expect(within(wrapper as HTMLElement).getByText(/5th full performance of/i)).toBeInTheDocument();
  });
});
