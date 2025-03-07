import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const ROOT_DIR = ".react-router/types/app";
const JS_FILE = `${ROOT_DIR}/root.js`;
const DTS_FILE = `${ROOT_DIR}/root.d.ts`;

async function main() {
  await mkdir(ROOT_DIR, { recursive: true });

  await Promise.all([
    writeFile(JS_FILE, 'export * from "../../../app/root.tsx";\n'),
    writeFile(DTS_FILE, 'export * from "../../../app/root";\n'),
  ]);
}

main().catch(console.error);
