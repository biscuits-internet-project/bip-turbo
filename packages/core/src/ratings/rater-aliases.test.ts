import { describe, expect, test } from "vitest";
import { aliasKey, mostRecentPerKey, normalize } from "./rater-aliases";

// normalize folds the cosmetic differences one login produces (case, spaces,
// underscores) so "RyKnow" and "ryknow " resolve to the same identity.
describe("normalize", () => {
  test("lowercases and strips spaces and underscores", () => {
    expect(normalize("RyKnow ")).toBe("ryknow");
    expect(normalize("Digital_Buddha")).toBe("digitalbuddha");
    expect(normalize("Digital Buddha")).toBe("digitalbuddha");
  });
});

describe("aliasKey", () => {
  test("login variants of one name share a key", () => {
    expect(aliasKey("RyKnow")).toBe(aliasKey("ryknow "));
  });

  test("curated spelling variants merge to one representative", () => {
    // "Invisble" (misspelled) and "Invisible" are the same person.
    expect(aliasKey("InvisbleBuddha")).toBe(aliasKey("Invisible Buddha"));
  });

  test("a deny-listed name stays solo, keyed by its own account id", () => {
    // digitalbuddha is held out of auto-merge: each account keeps a distinct key.
    expect(aliasKey("DigitalBuddha", "user-1")).toBe("solo:user-1");
    expect(aliasKey("DigitalBuddha", "user-1")).not.toBe(aliasKey("DigitalBuddha", "user-2"));
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
