import { readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
import fg from "fast-glob";
import ts from "typescript";
import { describe, expect, test } from "vitest";

/**
 * Guardrail: a loader-helper module (a `.ts` file under `app/routes/` that
 * imports from `~/server/*`, `@bip/core`, or `@prisma/*`) is **server-only**.
 * Route component files (`*.tsx` under `app/routes/`) may reference runtime
 * values from such helpers only inside server-only exports (`loader`,
 * `action`, `clientLoader`, `clientAction`, `headers`). If any identifier
 * imported from a server helper appears in the component body (or other
 * client-bundled code), Vite evaluates the helper in the client bundle and
 * drags server deps along, which silently breaks `<Link>` navigation.
 *
 * See PR #58 and apps/web/CLAUDE.md for the failure mode.
 */

const WEB_ROOT = resolve(__dirname, "../..");
const APP_ROOT = resolve(WEB_ROOT, "app");
const ROUTES_ROOT = resolve(APP_ROOT, "routes");

const SERVER_IMPORT_PATTERNS = [/^~\/server\//, /^@bip\/core(\/|$)/, /^@prisma\//];

// React Router v7 strips these exports from the client bundle, along with
// any imports referenced only by them. See the vite plugin docs.
const SERVER_ONLY_EXPORT_NAMES = new Set(["loader", "action", "clientLoader", "clientAction", "headers"]);

function resolvePath(fromFile: string, source: string): string | null {
  let candidate: string | null = null;
  if (source.startsWith("~/")) {
    candidate = resolve(APP_ROOT, source.slice(2));
  } else if (source.startsWith(".")) {
    candidate = resolve(fromFile, "..", source);
  } else {
    return null;
  }
  for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    try {
      const withExt = candidate + ext;
      readFileSync(withExt, "utf8");
      return withExt;
    } catch {
      // Try next extension.
    }
  }
  return null;
}

function parse(filePath: string): ts.SourceFile {
  return ts.createSourceFile(filePath, readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true);
}

function directlyImportsServerCode(sourceFile: ts.SourceFile): boolean {
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    if (statement.importClause?.isTypeOnly) continue;
    const spec = statement.moduleSpecifier;
    if (!ts.isStringLiteral(spec)) continue;
    if (SERVER_IMPORT_PATTERNS.some((p) => p.test(spec.text))) return true;
  }
  return false;
}

interface ValueImport {
  localName: string;
  source: string;
}

function valueImports(sourceFile: ts.SourceFile): ValueImport[] {
  const imports: ValueImport[] = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const clause = statement.importClause;
    if (!clause || clause.isTypeOnly) continue;
    const spec = statement.moduleSpecifier;
    if (!ts.isStringLiteral(spec)) continue;
    const source = spec.text;
    if (clause.name) imports.push({ localName: clause.name.text, source });
    const named = clause.namedBindings;
    if (named && ts.isNamedImports(named)) {
      for (const element of named.elements) {
        if (element.isTypeOnly) continue;
        imports.push({ localName: element.name.text, source });
      }
    } else if (named && ts.isNamespaceImport(named)) {
      imports.push({ localName: named.name.text, source });
    }
  }
  return imports;
}

/**
 * Build a set of spans (start/end offsets) that belong to server-only exports
 * — the code inside `export const loader = ...` and friends. A reference to
 * an imported identifier inside these spans is stripped from the client
 * bundle by React Router's vite plugin and is therefore safe.
 */
function serverOnlySpans(sourceFile: ts.SourceFile): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const hasExport = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!hasExport) continue;
    for (const decl of statement.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue;
      if (!SERVER_ONLY_EXPORT_NAMES.has(decl.name.text)) continue;
      if (decl.initializer) spans.push([decl.initializer.getStart(sourceFile), decl.initializer.getEnd()]);
    }
  }
  return spans;
}

function findIdentifierReferencesOutsideSpans(
  sourceFile: ts.SourceFile,
  targetNames: Set<string>,
  skipSpans: Array<[number, number]>,
): Set<string> {
  const hits = new Set<string>();
  const visit = (node: ts.Node) => {
    const start = node.getStart(sourceFile);
    const end = node.getEnd();
    if (skipSpans.some(([s, e]) => start >= s && end <= e)) return;
    if (ts.isIdentifier(node) && targetNames.has(node.text)) {
      // Skip the identifier when it sits on the LHS of the import itself
      // (we're looking for references, not the declaration).
      if (node.parent && ts.isImportSpecifier(node.parent)) return;
      if (node.parent && ts.isImportClause(node.parent)) return;
      if (node.parent && ts.isNamespaceImport(node.parent)) return;
      hits.add(node.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return hits;
}

describe("loader helper modules must not leak server code into the client bundle", () => {
  // A `.ts` helper under `app/routes/` that directly imports server code is a
  // server-only module. Any identifier imported from such a helper by a
  // route `.tsx` file must only be referenced inside the route's server-only
  // exports (`loader`, `action`, `clientLoader`, `clientAction`, `headers`).
  // References inside the default component or at module top level trigger a
  // violation — those would pull the helper into the client bundle.
  test("route .tsx files reference server-helper imports only in server-only exports", async () => {
    const helperFiles = await fg("**/*.ts", {
      cwd: ROUTES_ROOT,
      absolute: true,
      ignore: ["**/*.test.ts"],
    });
    const serverHelpers = new Set(helperFiles.filter((f) => directlyImportsServerCode(parse(f))));

    const routeFiles = await fg("**/*.tsx", {
      cwd: ROUTES_ROOT,
      absolute: true,
      ignore: ["**/*.test.tsx"],
    });

    const violations: string[] = [];
    for (const routeFile of routeFiles) {
      const sourceFile = parse(routeFile);
      const imports = valueImports(sourceFile);
      const serverHelperImports = imports.filter((imp) => {
        const resolved = resolvePath(routeFile, imp.source);
        return resolved !== null && serverHelpers.has(resolved);
      });
      if (serverHelperImports.length === 0) continue;

      const spans = serverOnlySpans(sourceFile);
      const targetNames = new Set(serverHelperImports.map((i) => i.localName));
      const leaked = findIdentifierReferencesOutsideSpans(sourceFile, targetNames, spans);

      for (const name of leaked) {
        const source = serverHelperImports.find((i) => i.localName === name)?.source;
        violations.push(
          `${relative(WEB_ROOT, routeFile)} references '${name}' (imported from ${source}) ` +
            "outside its server-only exports. Move the value to a client-safe module or use `import type`.",
        );
      }
    }

    expect(violations).toEqual([]);
  });
});
