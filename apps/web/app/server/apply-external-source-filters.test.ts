import { describe, expect, test } from "vitest";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { applyExternalSourceFilters } from "./apply-external-source-filters";

// Minimal setlist-like shape accepted by the helper — it only needs `show.id`.
// Using `as never` casts in tests so we don't build out a full Setlist.
function setlist(id: string) {
  return { show: { id } } as never;
}

function sources(partial: Partial<ShowExternalSources>): ShowExternalSources {
  return partial as ShowExternalSources;
}

describe("applyExternalSourceFilters", () => {
  // No filter flags active → input passes through untouched. The year loader
  // uses this helper unconditionally, so the no-op path has to be cheap and
  // return-by-reference (preserves React Query reference equality downstream).
  test("returns setlists unchanged when no filters are active", () => {
    const setlists = [setlist("astronaut"), setlist("basis")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({}),
      basis: sources({}),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, {});

    expect(result).toBe(setlists);
  });

  // "empty" tri-state is equivalent to the flag being absent — the helper
  // must treat an explicit `"empty"` the same as not passing the key.
  test("treats empty tri-state as no filter", () => {
    const setlists = [setlist("astronaut"), setlist("basis")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({}),
      basis: sources({}),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, {
      nugs: "empty",
      archive: "empty",
    });

    expect(result).toBe(setlists);
  });

  // Positive nugs keeps only shows that DO have a nugs url.
  test("nugs=positive keeps only shows with a nugs url", () => {
    const setlists = [setlist("astronaut"), setlist("basis")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({ nugsUrls: ["https://play.nugs.net/release/1"] }),
      basis: sources({}),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, { nugs: "positive" });

    expect(result.map((s: { show: { id: string } }) => s.show.id)).toEqual(["astronaut"]);
  });

  // Negative nugs is the opposite — keep only shows without a nugs url.
  // Without this branch, "shows that have archive but NOT nugs" can't be expressed.
  test("nugs=negative keeps only shows without a nugs url", () => {
    const setlists = [setlist("astronaut"), setlist("basis")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({ nugsUrls: ["https://play.nugs.net/release/1"] }),
      basis: sources({}),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, { nugs: "negative" });

    expect(result.map((s: { show: { id: string } }) => s.show.id)).toEqual(["basis"]);
  });

  // Positive archive — same shape as positive nugs but for archive.org links.
  test("archive=positive keeps only shows with an archive url", () => {
    const setlists = [setlist("astronaut"), setlist("basis")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({ archiveUrl: "https://archive.org/details/db" }),
      basis: sources({}),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, { archive: "positive" });

    expect(result.map((s: { show: { id: string } }) => s.show.id)).toEqual(["astronaut"]);
  });

  // Negative archive — keep only shows without an archive url.
  test("archive=negative keeps only shows without an archive url", () => {
    const setlists = [setlist("astronaut"), setlist("basis")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({ archiveUrl: "https://archive.org/details/db" }),
      basis: sources({}),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, { archive: "negative" });

    expect(result.map((s: { show: { id: string } }) => s.show.id)).toEqual(["basis"]);
  });

  // The headline use case from the user request: "shows that have archive but
  // NOT nugs". Mixed positive + negative across the two flags must AND together.
  test("archive=positive + nugs=negative keeps only shows with archive and no nugs", () => {
    const setlists = [
      setlist("crystal-ball"),
      setlist("basis-for-a-day"),
      setlist("munchkin-invasion"),
      setlist("plan-b"),
    ];
    const externalSources: Record<string, ShowExternalSources> = {
      "crystal-ball": sources({ archiveUrl: "a1" }), // archive yes, nugs no → keep
      "basis-for-a-day": sources({ archiveUrl: "a2", nugsUrls: ["n2"] }), // both → drop (has nugs)
      "munchkin-invasion": sources({ nugsUrls: ["n3"] }), // nugs only → drop (no archive)
      "plan-b": sources({}), // neither → drop (no archive)
    };

    const result = applyExternalSourceFilters(setlists, externalSources, {
      archive: "positive",
      nugs: "negative",
    });

    expect(result.map((s: { show: { id: string } }) => s.show.id)).toEqual(["crystal-ball"]);
  });

  // Two positives combine with AND — a show must have both links to survive
  // the filter (mirrors the per-show predicate's short-circuit semantics).
  test("positive + positive combine with AND", () => {
    const setlists = [setlist("astronaut"), setlist("basis"), setlist("crystal-ball")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({ nugsUrls: ["n1"], archiveUrl: "a1" }),
      basis: sources({ nugsUrls: ["n2"] }),
      "crystal-ball": sources({ archiveUrl: "a3" }),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, {
      nugs: "positive",
      archive: "positive",
    });

    expect(result.map((s: { show: { id: string } }) => s.show.id)).toEqual(["astronaut"]);
  });

  // A show missing from the externalSources map has no links → fails any
  // positive filter, satisfies any negative filter.
  test("missing entry in externalSources counts as no link", () => {
    const setlists = [setlist("astronaut"), setlist("orphan")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({ nugsUrls: ["n1"] }),
    };

    expect(
      applyExternalSourceFilters(setlists, externalSources, { nugs: "positive" }).map(
        (s: { show: { id: string } }) => s.show.id,
      ),
    ).toEqual(["astronaut"]);

    expect(
      applyExternalSourceFilters(setlists, externalSources, { nugs: "negative" }).map(
        (s: { show: { id: string } }) => s.show.id,
      ),
    ).toEqual(["orphan"]);
  });
});
