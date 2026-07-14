#!/usr/bin/env bun
// Jylhis design system — preview hex-drift validator.
//
// Preview specimens (preview/*.html) and component cards
// (components/<Name>/card.html) legitimately inline hex values when they
// *display* colors (swatch chips, contrast tables, code samples). Those
// literals must stay in sync with tokens.json — a stale hex silently
// documents a color the system no longer ships.
//
// This script collects every #RRGGBB value from tokens.json (palette,
// syntax, status, both modes, plus the 16 ANSI slots) and fails when a
// scanned file contains a hex literal outside that set. Alpha hex
// (#RGBA / #RRGGBBAA) is always flagged: opacity values must come from
// --color-accent-subtle / --color-scrim / color-mix(), never literals.
//
// prototypes/ is deliberately OUT of scope: the prototypes are exploratory
// mockups of other systems and carry intentional off-token colors.
//
// Run: bun scripts/validate-preview-hex.mjs
// CI:  .github/workflows/validate.yml

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(`Usage: validate-preview-hex [--help] [--version]

Fails when preview/*.html or components/*/card.html contain a hex color
literal that does not exist in tokens.json (palette, syntax, status, ANSI;
light and dark). Prevents specimens from documenting stale colors.

prototypes/ is out of scope by design (intentional off-token mockups).
Per-file exceptions live in the ALLOWLIST inside this script.

Exits 0 on success, 1 on validation failure.
`);
  process.exit(0);
}
if (process.argv.includes("--version")) {
  process.stdout.write("validate-preview-hex 1.0.0\n");
  process.exit(0);
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");

// Per-file exceptions — keep small and justified. Unused entries warn so
// the list self-prunes.
const ALLOWLIST = [
  { file: "preview/code-languages.html", hex: "#ffffff", reason: "unified-diff sample: pre-migration value being replaced" },
  { file: "preview/code-languages.html", hex: "#000000", reason: "unified-diff sample: pre-migration value being replaced" },
];

// ─── Allowed set from tokens.json ────────────────────────────────────

const tokens = JSON.parse(read("tokens.json"));

const allowed = new Set();
for (const section of [tokens.palette, tokens.syntax, tokens.status]) {
  for (const entry of Object.values(section)) {
    for (const mode of ["light", "dark"]) {
      if (typeof entry?.[mode] === "string") allowed.add(entry[mode].toLowerCase());
    }
  }
}
for (const slot of tokens.ansi ?? []) {
  for (const mode of ["light", "dark"]) {
    if (typeof slot?.[mode] === "string") allowed.add(slot[mode].toLowerCase());
  }
}

// Expand #RGB shorthand to #rrggbb for comparison.
const expand = (hex) =>
  hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex.toLowerCase();

// ─── Scan ────────────────────────────────────────────────────────────

function lineOf(src, idx) {
  let n = 1;
  for (let i = 0; i < idx; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}

function stripComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
}

const files = [
  ...readdirSync(resolve(ROOT, "preview"))
    .filter((name) => name.endsWith(".html"))
    .map((name) => `preview/${name}`),
  ...readdirSync(resolve(ROOT, "components"))
    .filter((name) => statSync(resolve(ROOT, "components", name)).isDirectory())
    .map((name) => `components/${name}/card.html`),
];

const errors = [];
const usedAllowlist = new Set();
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;

for (const file of files) {
  const src = stripComments(read(file));
  for (const m of src.matchAll(HEX_RE)) {
    const raw = m[0];
    // Only 3/4/6/8-digit runs are colors; other lengths are ids/fragments.
    if (![3, 4, 6, 8].includes(raw.length - 1)) continue;
    const line = lineOf(src, m.index);
    if (raw.length === 5 || raw.length === 9) {
      errors.push(`${file}:${line}: alpha hex ${raw} — use --color-accent-subtle / --color-scrim / color-mix() instead`);
      continue;
    }
    const norm = expand(raw);
    if (allowed.has(norm)) continue;
    const pass = ALLOWLIST.find((a) => a.file === file && a.hex === norm);
    if (pass) {
      usedAllowlist.add(pass);
      continue;
    }
    errors.push(`${file}:${line}: ${raw} is not a tokens.json color — stale or off-palette`);
  }
}

// ─── Report ──────────────────────────────────────────────────────────

for (const a of ALLOWLIST) {
  if (!usedAllowlist.has(a)) {
    console.error(`warning: unused allowlist entry ${a.file} ${a.hex} — remove it`);
  }
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} hex drift issue(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("\nEvery displayed hex must exist in tokens.json (or be allowlisted here).\n");
  process.exit(1);
}

console.log(`✓ preview hex validation passed (${files.length} files, ${allowed.size} allowed colors)`);
