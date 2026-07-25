import { describe, expect, test, vi } from "vitest";
import { AliasRulesetService } from "../ratings/alias-ruleset-service";
import { createServices } from "./services";

function container() {
  return {
    db: { raterAliasGroup: { findMany: vi.fn().mockResolvedValue([]) } },
    env: {},
    redis: {},
    cache: {},
    cloudflareCache: {},
    cacheInvalidation: {},
    logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn(), child: vi.fn() },
  } as never;
}

/**
 * The same-person merge rules live in `rater_alias_groups`, and both rating services
 * take the loader as an OPTIONAL constructor dependency so the many unit tests with
 * mock db objects don't each need to stub the table. That convenience is also the
 * hazard: a service constructed without the loader folds login variants only, which
 * silently un-merges every curated duplicate account and inflates the affected shows'
 * ratings with no error anywhere. These tests are the guard.
 */
describe("createServices alias-rule wiring", () => {
  test("exposes one shared alias-ruleset loader", () => {
    const services = createServices(container());

    expect(services.aliasRules).toBeInstanceOf(AliasRulesetService);
  });

  test("hands that same loader to both rating services", () => {
    const services = createServices(container());

    // Reaching past `protected` deliberately: this asserts the dependency actually
    // arrived, which is the whole point of the guard.
    expect((services.ratings as unknown as { aliasRules?: unknown }).aliasRules).toBe(services.aliasRules);
    expect((services.raterWeights as unknown as { aliasRules?: unknown }).aliasRules).toBe(services.aliasRules);
  });
});
