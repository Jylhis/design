#!/usr/bin/env bun
// Jylhis design system — Emacs face coverage validator.
//
// Compares the face symbols themed in platforms/emacs/jylhis-theme-core.el
// against the curated manifest at platforms/emacs/face-manifest.json. Fails
// if either side has an entry the other lacks — catches both unthemed faces
// in scope and stale manifest entries when a face is dropped upstream.
//
// The blog post that motivated this branch (Emacs Redux,
// "Creating Emacs Color Themes", 2026-03-30) recommends using
// `list-faces-display` to find unthemed faces. That requires a running
// Emacs; this validator approximates the same hygiene statically so it
// can run in CI without an Emacs binary.
//
// Run: bun scripts/validate-emacs-faces.mjs
// CI:  .github/workflows/validate.yml

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(`Usage: validate-emacs-faces [--help] [--version]

Validates that the face list themed in platforms/emacs/jylhis-theme-core.el
matches the curated manifest at platforms/emacs/face-manifest.json. Run
this after editing the Emacs face spec list in scripts/generate.mjs; add
or remove entries in the manifest in lock-step.

Exits 0 on success, 1 on any drift between core and manifest.
`);
  process.exit(0);
}
if (process.argv.includes("--version")) {
  process.stdout.write("validate-emacs-faces 1.0.0\n");
  process.exit(0);
}

const CORE_PATH = "platforms/emacs/jylhis-theme-core.el";
const MANIFEST_PATH = "platforms/emacs/face-manifest.json";

// ─── Parse face symbols from jylhis-theme-core.el ────────────────────
// The face spec list lives inside (defconst jylhis--face-specs '( ... )).
// Within that block, each entry begins on its own line as
//   "    (face-name <whitespace>:<attr> ...".
// We anchor on the leading 4-space indent + paren + lowercase identifier
// + whitespace + keyword. Lines starting with ";;" are skipped (comments).

const core = read(CORE_PATH);
const startIdx = core.indexOf("(defconst jylhis--face-specs");
if (startIdx < 0) {
  console.error(`✗ ${CORE_PATH}: cannot find (defconst jylhis--face-specs ...)`);
  process.exit(1);
}
// Find the closing paren of the defconst by counting parens after the start.
// Simpler: scan until the matching `)` of the outer defconst — paren-aware.
let depth = 0;
let endIdx = -1;
for (let i = startIdx; i < core.length; i++) {
  const ch = core[i];
  if (ch === "(") depth++;
  else if (ch === ")") {
    depth--;
    if (depth === 0) { endIdx = i; break; }
  }
}
if (endIdx < 0) {
  console.error(`✗ ${CORE_PATH}: unbalanced parens in (defconst jylhis--face-specs ...)`);
  process.exit(1);
}

const specBlock = core.slice(startIdx, endIdx + 1);
const FACE_LINE = /^[ \t]{4}\(([a-z][a-z0-9-]*)[ \t]+:/gm;
const coreFaces = new Set();
let m;
while ((m = FACE_LINE.exec(specBlock)) !== null) {
  coreFaces.add(m[1]);
}

if (coreFaces.size === 0) {
  console.error(`✗ ${CORE_PATH}: face spec list parsed empty (regex out of sync with generator?)`);
  process.exit(1);
}

// ─── Load and flatten manifest ───────────────────────────────────────

const manifest = JSON.parse(read(MANIFEST_PATH));
if (!manifest.groups || typeof manifest.groups !== "object") {
  console.error(`✗ ${MANIFEST_PATH}: missing or invalid "groups" object`);
  process.exit(1);
}

const manifestFaces = new Set();
const groupOf = new Map(); // face → group, for nicer error messages
for (const [group, faces] of Object.entries(manifest.groups)) {
  if (!Array.isArray(faces)) {
    console.error(`✗ ${MANIFEST_PATH}: group "${group}" must be an array of face names`);
    process.exit(1);
  }
  for (const face of faces) {
    if (manifestFaces.has(face)) {
      console.error(`✗ ${MANIFEST_PATH}: duplicate face "${face}" (also in group "${groupOf.get(face)}")`);
      process.exit(1);
    }
    manifestFaces.add(face);
    groupOf.set(face, group);
  }
}

// ─── Compare ────────────────────────────────────────────────────────

const missingFromManifest = [...coreFaces].filter((f) => !manifestFaces.has(f)).sort();
const missingFromCore = [...manifestFaces].filter((f) => !coreFaces.has(f)).sort();

if (missingFromManifest.length || missingFromCore.length) {
  console.error("");
  if (missingFromManifest.length) {
    console.error(`✗ ${missingFromManifest.length} face(s) themed in core but missing from ${MANIFEST_PATH}:`);
    for (const f of missingFromManifest) console.error(`  + ${f}`);
    console.error("");
  }
  if (missingFromCore.length) {
    console.error(`✗ ${missingFromCore.length} face(s) in ${MANIFEST_PATH} but no longer themed in core:`);
    for (const f of missingFromCore) console.error(`  - ${f}  (group: ${groupOf.get(f)})`);
    console.error("");
  }
  console.error("Add or remove entries in face-manifest.json to bring it back in sync.");
  process.exit(1);
}

console.log(`✓ Emacs face coverage in sync (${coreFaces.size} faces across ${Object.keys(manifest.groups).length} groups)`);
