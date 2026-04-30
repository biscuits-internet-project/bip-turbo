import { describe, expect, test } from "vitest";
import type { ShowExternalSources } from "~/components/setlist/show-external-badges";
import { applyExternalSourceFilters } from "./apply-external-source-filters";

// Minimal setlist-like shape accepted by the helper — it only needs `show.id`.
// Using `as never` casts in tests so we don't build out a full SetlistLight.
function setlist(id: string) {
  return { show: { id } } as never;
}

function sources(partial: Partial<ShowExternalSources>): ShowExternalSources {
  return partial as ShowExternalSources;
}

describe("applyExternalSourceFilters", () => {
  // No filter flags active → input passes through untouched. The year loader
  // uses this helper unconditionally, so the no-op path has to be cheap.
  test("returns setlists unchanged when no filters are active", () => {
    const setlists = [setlist("astronaut"), setlist("moshi")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({}),
      moshi: sources({}),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, {});

    expect(result).toBe(setlists);
  });

  // nugs flag drops any setlist whose externalSources has no nugsUrl.
  test("filters out setlists missing a nugs url when nugs flag is on", () => {
    const setlists = [setlist("astronaut"), setlist("moshi")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({ nugsUrl: "https://play.nugs.net/release/1" }),
      moshi: sources({}),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, { nugs: true });

    expect(result.map((s: { show: { id: string } }) => s.show.id)).toEqual(["astronaut"]);
  });

  // archive flag drops setlists lacking archiveUrl — mirrors nugs behavior.
  test("filters out setlists missing an archive url when archive flag is on", () => {
    const setlists = [setlist("astronaut"), setlist("moshi")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({ archiveUrl: "https://archive.org/details/db" }),
      moshi: sources({}),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, { archive: true });

    expect(result.map((s: { show: { id: string } }) => s.show.id)).toEqual(["astronaut"]);
  });

  // nugs + archive combine with AND — a show must have both links to survive.
  test("requires all active flags (AND) when multiple are set", () => {
    const setlists = [setlist("astronaut"), setlist("moshi"), setlist("basis")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({ nugsUrl: "n1", archiveUrl: "a1" }),
      moshi: sources({ nugsUrl: "n2" }),
      basis: sources({ archiveUrl: "a3" }),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, { nugs: true, archive: true });

    expect(result.map((s: { show: { id: string } }) => s.show.id)).toEqual(["astronaut"]);
  });

  // A show missing from the externalSources map fails every external-source
  // filter — treat missing as "no link found".
  test("drops setlists that have no entry in externalSources when a flag is on", () => {
    const setlists = [setlist("astronaut"), setlist("orphan")];
    const externalSources: Record<string, ShowExternalSources> = {
      astronaut: sources({ nugsUrl: "n1" }),
    };

    const result = applyExternalSourceFilters(setlists, externalSources, { nugs: true });

    expect(result.map((s: { show: { id: string } }) => s.show.id)).toEqual(["astronaut"]);
  });
});
