import { describe, expect, test } from "vitest";
import { setSortKeySql, showOrderBySql } from "./show-ordering";

function renderSql(fragment: { strings: readonly string[]; values: unknown[] }): string {
  const parts: string[] = [];
  for (let i = 0; i < fragment.strings.length; i++) {
    parts.push(fragment.strings[i]);
    if (i < fragment.values.length) {
      const v = fragment.values[i];
      if (v && typeof v === "object" && Array.isArray((v as { strings?: unknown[] }).strings)) {
        parts.push(renderSql(v as { strings: readonly string[]; values: unknown[] }));
      } else {
        parts.push(String(v));
      }
    }
  }
  return parts.join("");
}

describe("showOrderBySql", () => {
  // Smoke test — the existing helper. Confirms the rendering harness works
  // for the nested Prisma.Sql case the rest of the suite depends on.
  test("emits date + day_order COALESCE + id triplet for DESC", () => {
    const sql = renderSql(showOrderBySql("s", "DESC") as never);
    expect(sql).toMatch(/s\.date\s+DESC/);
    expect(sql).toMatch(/COALESCE\(s\.day_order,\s*2147483647\)\s+DESC/);
    expect(sql).toMatch(/s\.id::text\s+DESC/);
  });
});

describe("setSortKeySql", () => {
  // Mirrors apps/web/app/components/setlist/set-label.ts:setSortKey so
  // SQL ORDER BY and the in-memory comparator agree on canonical order:
  // Soundcheck → S1..S4 → E1..E3 → unknown. The numeric arms have to
  // line up with the TS function — drift means table rows sort one way
  // server-side and another client-side on a re-sort.
  test("renders a CASE expression keyed by the alias's set column", () => {
    const sql = renderSql(setSortKeySql("t") as never);
    expect(sql).toMatch(/CASE/);
    expect(sql).toMatch(/t\.set/);
    expect(sql).toMatch(/END/);
  });

  test("ordinals match the TS setSortKey (Soundcheck=0, S1=10, S2=20, S3=30, S4=40, E1=50, E2=60, E3=70)", () => {
    const sql = renderSql(setSortKeySql("t") as never);
    // SQL inlines LOWER(set) so the CASE arms are lowercase literals.
    expect(sql).toMatch(/'soundcheck'.*0/i);
    expect(sql).toMatch(/'s1'.*10/i);
    expect(sql).toMatch(/'s2'.*20/i);
    expect(sql).toMatch(/'s3'.*30/i);
    expect(sql).toMatch(/'s4'.*40/i);
    expect(sql).toMatch(/'e1'.*50/i);
    expect(sql).toMatch(/'e2'.*60/i);
    expect(sql).toMatch(/'e3'.*70/i);
  });

  test("unknown labels collapse to 999 (the fallback in the TS implementation)", () => {
    const sql = renderSql(setSortKeySql("t") as never);
    expect(sql).toMatch(/ELSE\s+999/);
  });
});
