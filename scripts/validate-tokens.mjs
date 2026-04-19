#!/usr/bin/env node
// Jylhis design system — token validator.
//
// tokens.md is the canonical spec. Every derived target file is checked
// against it: colors_and_type.css, platforms/charm/jylhis/palette.go, and
// the Ghostty themes. The validator also verifies CSS custom-property
// naming, that every var(--…) reference resolves, and that the WCAG
// claims in tokens.md hold.
//
// Run: node scripts/validate-tokens.mjs
// CI:  .github/workflows/validate.yml

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");
const errors = [];
const fail = (msg) => errors.push(msg);

// ─── Single source of truth: role → (css var, go field, ghostty key) ───
// Adding a new token? Add one row here — cssRoleMap, goFieldMap and the
// Ghostty checks are all derived from it.

const ROLES = {
  bg:               { css: "--color-bg",               go: "Bg"            },
  "bg-subtle":      { css: "--color-bg-subtle",        go: "BgSubtle"      },
  surface:          { css: "--color-surface",          go: "Surface"       },
  "surface-raised": { css: "--color-surface-raised",   go: "SurfaceRaised" },
  text:             { css: "--color-text",             go: "Text"          },
  "text-muted":     { css: "--color-text-muted",       go: "TextMuted"     },
  "text-heading":   { css: "--color-text-heading",     go: "TextHeading"   },
  "text-faint":     { css: "--color-text-faint",       go: "TextFaint"     },
  accent:           { css: "--color-accent",           go: "Accent"        },
  "accent-hover":   { css: "--color-accent-hover",     go: "AccentHover"   },
  brand:            { css: "--color-brand",            go: "Brand"         },
  border:           { css: "--color-border",           go: "Border"        },
  "border-strong":  { css: "--color-border-strong",    go: "BorderStrong"  },
  decorator:        { css: "--color-decorator",        go: "Decorator"     },
  "syn-keyword":    { css: "--color-syntax-keyword",   go: "SynKeyword"    },
  "syn-string":     { css: "--color-syntax-string",    go: "SynString"     },
  "syn-number":     { css: "--color-syntax-number",    go: "SynNumber"     },
  "syn-function":   { css: "--color-syntax-function",  go: "SynFunction"   },
  "syn-builtin":    { css: "--color-syntax-builtin",   go: "SynBuiltin"    },
  "syn-type":       { css: "--color-syntax-type",      go: "SynType"       },
  "syn-variable":   { css: "--color-syntax-variable",  go: "SynVariable"   },
  "syn-comment":    { css: "--color-syntax-comment",   go: "SynComment"    },
  "syn-docstring":  { css: "--color-syntax-docstring", go: "SynDocstring"  },
  "status-err":     { css: "--color-status-err",       go: "StatusErr"     },
  "status-warn":    { css: "--color-status-warn",      go: "StatusWarn"    },
  "status-ok":      { css: "--color-status-ok",        go: "StatusOk"      },
  "status-info":    { css: "--color-status-info",      go: "StatusInfo"    },
};
// SynTag is a legacy alias of syn-type in palette.go; check it explicitly.
const GO_ALIASES = { SynTag: "syn-type" };

// ─── 1. Parse tokens.md into {role: {light, dark}} ─────────────────────

const tokensMd = read("tokens.md");
const HEX = /`(#[0-9a-fA-F]{6})`/g;
/** @type {Map<string, {light: string, dark: string}>} */
const canon = new Map();

for (const line of tokensMd.split("\n")) {
  if (!line.startsWith("|")) continue;
  const hexes = [...line.matchAll(HEX)].map((m) => m[1].toLowerCase());
  if (hexes.length < 2) continue;
  const roleMatch = line.match(/\|\s*`([a-z0-9-]+)`/);
  const ansiMatch = line.match(/^\|\s*(\d{1,2})\s*\|/);
  if (roleMatch) canon.set(roleMatch[1], { light: hexes[0], dark: hexes[1] });
  else if (ansiMatch) canon.set(`ansi-${ansiMatch[1]}`, { light: hexes[0], dark: hexes[1] });
}

for (const required of ["bg", "text", "accent", "brand", "ansi-0", "ansi-11", "syn-keyword", "status-err"]) {
  if (!canon.has(required)) fail(`tokens.md: missing canonical role \`${required}\``);
}

function check(file, label, mode, actual, role) {
  const expected = canon.get(role)?.[mode];
  if (expected && actual && actual.toLowerCase() !== expected) {
    fail(`${file}: ${label} = ${actual} — tokens.md says ${expected} (role ${role})`);
  }
}

// ─── 2. colors_and_type.css ────────────────────────────────────────────
// Single pass: walk once, tagging each custom-property line with its
// enclosing selector (if any). Avoids repeated findIndex scans and handles
// brace-formatting variations gracefully.

const css = read("colors_and_type.css");
const lightVars = {};
const darkVars = {};
const allDeclared = new Set();
{
  let selector = null;
  for (const line of css.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.endsWith("{")) {
      if (trimmed.startsWith(":root")) selector = "light";
      else if (trimmed.startsWith('[data-theme="dark"]')) selector = "dark";
      else selector = "other";
      continue;
    }
    if (trimmed === "}") { selector = null; continue; }
    const decl = line.match(/^\s*(--[a-z0-9-]+)\s*:/);
    if (!decl) continue;
    const name = decl[1];
    allDeclared.add(name);
    const hex = line.match(/#[0-9a-fA-F]{6}/)?.[0];
    if (!hex) continue;
    if (selector === "light") lightVars[name] = hex.toLowerCase();
    else if (selector === "dark") darkVars[name] = hex.toLowerCase();
  }
}

for (const [role, { css: name }] of Object.entries(ROLES)) {
  check("colors_and_type.css", `${name} light`, "light", lightVars[name], role);
  check("colors_and_type.css", `${name} dark`,  "dark",  darkVars[name],  role);
}

for (const name of allDeclared) {
  if (!/^--[a-z][a-z0-9-]*$/.test(name)) {
    fail(`colors_and_type.css: custom property \`${name}\` violates --[a-z][a-z0-9-]* naming`);
  }
}

for (const [, ref] of css.matchAll(/var\((--[a-z0-9-]+)\)/g)) {
  if (!allDeclared.has(ref)) fail(`colors_and_type.css: var(${ref}) used but never declared`);
}

// ─── 3. platforms/charm/jylhis/palette.go ──────────────────────────────

const goFile = read("platforms/charm/jylhis/palette.go");

function parseGoPalette(label) {
  const body = goFile.match(new RegExp(`var ${label} = Palette\\{([\\s\\S]*?)\\n\\}`, "m"))?.[1] ?? "";
  const fields = {};
  for (const [, field, hex] of body.matchAll(/(\w+)\s*:\s*"(#[0-9a-fA-F]{6})"/g)) {
    fields[field] = hex.toLowerCase();
  }
  const ansiBody = body.match(/ANSI:\s*\[16\]string\{([\s\S]*?)\}/)?.[1] ?? "";
  const ansi = [...ansiBody.matchAll(/"(#[0-9a-fA-F]{6})"/g)].map((m) => m[1].toLowerCase());
  return { fields, ansi };
}

for (const [label, mode] of [["paper", "light"], ["roast", "dark"]]) {
  const { fields, ansi } = parseGoPalette(label);
  for (const [role, { go }] of Object.entries(ROLES)) {
    check("palette.go", `${label}.${go}`, mode, fields[go], role);
  }
  for (const [field, role] of Object.entries(GO_ALIASES)) {
    check("palette.go", `${label}.${field}`, mode, fields[field], role);
  }
  for (let i = 0; i < 16; i++) {
    check("palette.go", `${label}.ANSI[${i}]`, mode, ansi[i], `ansi-${i}`);
  }
}

// ─── 4. Ghostty themes ─────────────────────────────────────────────────

const GHOSTTY_LINE_MAP = {
  background: "bg",
  foreground: "text",
  "cursor-color": "accent",
};
const PALETTE_LINE = /^palette\s*=\s*(\d{1,2})=(#[0-9a-fA-F]{6})/;
const KV_LINE = /^([a-z-]+)\s*=\s*(#[0-9a-fA-F]{6})/;

function validateGhostty(path, mode) {
  for (const line of read(path).split("\n")) {
    const pal = line.match(PALETTE_LINE);
    if (pal) {
      check(path, `ANSI ${pal[1]}`, mode, pal[2], `ansi-${pal[1]}`);
      continue;
    }
    const kv = line.match(KV_LINE);
    if (!kv) continue;
    const role = GHOSTTY_LINE_MAP[kv[1]];
    if (role) check(path, kv[1], mode, kv[2], role);
  }
}

validateGhostty("platforms/ghostty/jylhis-paper", "light");
validateGhostty("platforms/ghostty/jylhis-roast", "dark");

// ─── 5. Contrast (WCAG 2 relative luminance) ───────────────────────────

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const [la, lb] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (la + 0.05) / (lb + 0.05);
}

const CONTRAST_CHECKS = [
  ["text",         "bg", "light", 7,   "AAA body text (light)"],
  ["text",         "bg", "dark",  7,   "AAA body text (dark)"],
  ["text-heading", "bg", "light", 7,   "AAA headings (light)"],
  ["text-muted",   "bg", "light", 4.5, "AA meta (light)"],
  ["text-muted",   "bg", "dark",  4.5, "AA meta (dark)"],
  ["accent",       "bg", "light", 4.5, "AA accent on paper"],
  ["accent",       "bg", "dark",  7,   "AAA accent on dark"],
];

for (const [fg, bg, mode, min, label] of CONTRAST_CHECKS) {
  const fgc = canon.get(fg)?.[mode];
  const bgc = canon.get(bg)?.[mode];
  if (!fgc || !bgc) continue;
  const ratio = contrast(fgc, bgc);
  if (ratio < min) fail(`contrast: ${label} ${fgc} on ${bgc} = ${ratio.toFixed(2)}:1 (< ${min}:1)`);
}

// ─── Report ────────────────────────────────────────────────────────────

if (errors.length) {
  console.error(`\n✗ ${errors.length} token-drift or contrast issue(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}
console.log(`✓ token validation passed (${canon.size} canonical roles checked)`);
