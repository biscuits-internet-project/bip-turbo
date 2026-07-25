import { describe, expect, test } from "vitest";
import { type AliasRuleset, aliasKey, EMPTY_ALIAS_RULESET, mostRecentPerKey, normalize } from "./rater-aliases";

function ruleset(overrides: Partial<AliasRuleset> = {}): AliasRuleset {
  return { ...EMPTY_ALIAS_RULESET, ...overrides };
}

// normalize folds the cosmetic differences one login produces (case, spaces,
// underscores) so "RockCandy" and "rockcandy " resolve to the same identity.
describe("normalize", () => {
  test("lowercases and strips spaces and underscores", () => {
    expect(normalize("RockCandy ")).toBe("rockcandy");
    expect(normalize("Rock_Candy")).toBe("rockcandy");
    expect(normalize("Rock Candy")).toBe("rockcandy");
  });
});

describe("aliasKey", () => {
  test("login variants of one name share a key with no curated rules at all", () => {
    expect(aliasKey("RockCandy", undefined, EMPTY_ALIAS_RULESET)).toBe(
      aliasKey("rockcandy ", undefined, EMPTY_ALIAS_RULESET),
    );
  });

  test("a merge rule folds a spelling variant onto the group's representative", () => {
    // "Invisble" (misspelled) and "Invisible" are the same person.
    const rules = ruleset({
      mergeRemap: new Map([
        ["higwire", "higwire"],
        ["highwire", "higwire"],
      ]),
    });

    expect(aliasKey("Higwire", undefined, rules)).toBe("higwire");
    expect(aliasKey("High wire", undefined, rules)).toBe("higwire");
  });

  test("a held-out name stays solo, keyed by its own account id", () => {
    const rules = ruleset({ heldOut: new Set(["mindlessdribble"]) });

    expect(aliasKey("MindlessDribble", "user-1", rules)).toBe("solo:user-1");
    expect(aliasKey("MindlessDribble", "user-1", rules)).not.toBe(aliasKey("MindlessDribble", "user-2", rules));
  });

  // Without the account id there is nothing to key a solo identity on, so the
  // held-out name falls back to its normalized form rather than colliding on a
  // shared "solo" bucket.
  test("a held-out name without an account id falls back to its normalized form", () => {
    expect(aliasKey("MindlessDribble", undefined, ruleset({ heldOut: new Set(["mindlessdribble"]) }))).toBe(
      "mindlessdribble",
    );
  });
});

// mostRecentPerKey is the "one human, one vote" reducer: within each key group it
// keeps only the latest-dated rating.
describe("mostRecentPerKey", () => {
  test("keeps the most recent rating within a key group", () => {
    const ratings = [
      { key: "a", value: 3, createdAt: new Date("2024-01-01") },
      { key: "a", value: 5, createdAt: new Date("2024-06-01") },
      { key: "a", value: 1, createdAt: new Date("2024-03-01") },
    ];
    const result = mostRecentPerKey(ratings, (rating) => rating.key);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(5);
  });

  test("keeps one entry per distinct key", () => {
    const ratings = [
      { key: "a", value: 3, createdAt: new Date("2024-01-01") },
      { key: "b", value: 4, createdAt: new Date("2024-01-01") },
    ];
    const result = mostRecentPerKey(ratings, (rating) => rating.key);
    expect(result.map((rating) => rating.value).sort()).toEqual([3, 4]);
  });
});
