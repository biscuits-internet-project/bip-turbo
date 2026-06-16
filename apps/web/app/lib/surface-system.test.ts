import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import fg from "fast-glob";
import ts from "typescript";
import { describe, expect, test } from "vitest";

/**
 * Guardrail for the surface design system. A surface's background is chosen by
 * `Card` variant (`elevated` / `panel` / `plain`) — see card.tsx — not by
 * pasting the raw `card-premium` / `glass-content` CSS classes into a
 * `<Card className>`. This test fails if a `<Card>` reintroduces a raw surface
 * class, which is how the surfaces drifted in the first place.
 */

const WEB_ROOT = resolve(__dirname, "../..");
const APP_ROOT = resolve(WEB_ROOT, "app");
const STYLES_CSS = resolve(APP_ROOT, "styles.css");

// Surface classes that were defined but never used — deleted so the menu of
// surfaces stays small. A redefinition is the bloat this guard prevents.
const DEAD_SURFACE_CLASSES = ["glass-heavy", "glass-accent", "card-premium-accent"];

const FORBIDDEN_SURFACES = ["card-premium", "glass-content"];

// Surfaces are chosen by Card variant; form controls get the dedicated input
// surface (formInputClass). A raw surface class on any of these is the drift
// this guard prevents.
const GUARDED_TAGS = new Set(["Card", "Input", "Textarea", "SelectTrigger"]);

function parse(filePath: string): ts.SourceFile {
  return ts.createSourceFile(filePath, readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true);
}

/** The literal string value of a className attribute, if it's a plain string literal. */
function classNameLiteral(attr: ts.JsxAttribute): string | null {
  if (!ts.isJsxAttribute(attr) || attr.name.getText() !== "className") return null;
  const init = attr.initializer;
  if (!init) return null;
  if (ts.isStringLiteral(init)) return init.text;
  if (ts.isJsxExpression(init) && init.expression && ts.isStringLiteral(init.expression)) {
    return init.expression.text;
  }
  return null;
}

function surfaceViolations(sourceFile: ts.SourceFile, file: string): string[] {
  const violations: string[] = [];
  const visit = (node: ts.Node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText();
      if (GUARDED_TAGS.has(tag)) {
        for (const attr of node.attributes.properties) {
          if (!ts.isJsxAttribute(attr)) continue;
          const value = classNameLiteral(attr);
          if (!value) continue;
          for (const token of FORBIDDEN_SURFACES) {
            if (new RegExp(`(^|\\s)${token}(\\s|$)`).test(value)) {
              const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
              const fix = tag === "Card" ? "use a variant instead" : "use formInputClass instead";
              violations.push(`${file}:${line + 1} <${tag} className> still uses "${token}" — ${fix}`);
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return violations;
}

describe("surface design system", () => {
  // A raw card-premium / glass-content class must not reappear on a Card
  // (use a variant) or on a form control (use formInputClass) — that's the
  // drift this consolidation removes.
  test("no Card or form control carries a raw card-premium / glass-content class", async () => {
    const files = await fg("**/*.tsx", { cwd: APP_ROOT, absolute: true, ignore: ["**/*.test.tsx"] });
    const violations: string[] = [];
    for (const file of files) {
      violations.push(...surfaceViolations(parse(file), relative(WEB_ROOT, file)));
    }
    expect(violations).toEqual([]);
  });

  // The unused surface classes must not be redefined in the stylesheet.
  test("dead surface classes are not defined in styles.css", () => {
    const css = readFileSync(STYLES_CSS, "utf8");
    const redefined = DEAD_SURFACE_CLASSES.filter((name) => css.includes(`.${name}`));
    expect(redefined).toEqual([]);
  });
});
