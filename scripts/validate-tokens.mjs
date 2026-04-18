#!/usr/bin/env node
// Jylhis design system — token validator.
//
// Parses tokens.md as the source of truth, then cross-checks every derived
// target file (colors_and_type.css, platforms/charm/jylhis/palette.go,
// platforms/ghostty/*) for hex drift. Also validates CSS custom property
// naming, that every var(--x) reference resolves, and that body/muted/accent
// contrast ratios match the AAA/AA claims in tokens.md.
//
// Run: node scripts/validate-tokens.mjs
// CI:  see .github/workflows/validate.yml
//
// Exits non-zero if any check fails.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");

const errors = [];
const fail = (msg) => errors.push(msg);

// ─── 1. Parse tokens.md ────────────────────────────────────────────────
// Pull every table row of the form:
//   | `role` | ... | `#light` | `#dark` | ...
// where the first backticked cell is the role and the two hex cells are
// light and dark. Role-to-hex map is keyed by role name.

const tokensMd = read("tokens.md");

/** @type {Map<string, {light: string, dark: string}>} */
const canon = new Map();

const hex = /`(#[0-9a-fA-F]{6})`/g;
for (const line of tokensMd.split("\n")) {
  if (!line.startsWith("|")) continue;
  const roleMatch = line.match(/\|\s*`([a-z0-9-]+)`/);
  const ansiMatch = line.match(/^\|\s*(\d{1,2})\s*\|/);
  const hexes = [...line.matchAll(hex)].map((m) => m[1].toLowerCase());
  if (hexes.length < 2) continue;
  if (roleMatch) {
    canon.set(roleMatch[1], { light: hexes[0], dark: hexes[1] });
  } else if (ansiMatch) {
    canon.set(`ansi-${ansiMatch[1]}`, { light: hexes[0], dark: hexes[1] });
  }
}

for (const required of ["bg", "text", "accent", "brand", "ansi-0", "ansi-11", "syn-keyword", "status-err"]) {
  if (!canon.has(required)) fail(`tokens.md: missing canonical role \`${required}\``);
}

// ─── 2. Validate colors_and_type.css ───────────────────────────────────
// Role → CSS custom property mapping. If a role is absent here it's not
// checked; add it when expanding the CSS.

const cssRoleMap = {
  bg: "--color-bg",
  "bg-subtle": "--color-bg-subtle",
  surface: "--color-surface",
  "surface-raised": "--color-surface-raised",
  text: "--color-text",
  "text-muted": "--color-text-muted",
  "text-heading": "--color-text-heading",
  "text-faint": "--color-text-faint",
  accent: "--color-accent",
  "accent-hover": "--color-accent-hover",
  brand: "--color-brand",
  border: "--color-border",
  "border-strong": "--color-border-strong",
  decorator: "--color-decorator",
  "syn-keyword": "--color-syntax-keyword",
  "syn-string": "--color-syntax-string",
  "syn-number": "--color-syntax-number",
  "syn-function": "--color-syntax-function",
  "syn-builtin": "--color-syntax-builtin",
  "syn-type": "--color-syntax-type",
  "syn-variable": "--color-syntax-variable",
  "syn-comment": "--color-syntax-comment",
  "syn-docstring": "--color-syntax-docstring",
  "status-err": "--color-status-err",
  "status-warn": "--color-status-warn",
  "status-ok": "--color-status-ok",
  "status-info": "--color-status-info",
};

const css = read("colors_and_type.css");
const cssLines = css.split("\n");

/** Parse :root / [data-theme="dark"] blocks into {var: hex} maps. */
function parseCssBlock(selector) {
  const start = cssLines.findIndex((l) => l.trim().startsWith(selector));
  if (start < 0) return {};
  const end = cssLines.findIndex((l, i) => i > start && l.trim() === "}");
  const out = {};
  for (let i = start + 1; i < end; i++) {
    const m = cssLines[i].match(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})/);
    if (m) out[m[1]] = m[2].toLowerCase();
  }
  return out;
}

const lightVars = parseCssBlock(":root {");
const darkVars = parseCssBlock('[data-theme="dark"] {');

for (const [role, cssName] of Object.entries(cssRoleMap)) {
  const c = canon.get(role);
  if (!c) continue;
  if (lightVars[cssName] && lightVars[cssName] !== c.light) {
    fail(`colors_and_type.css: ${cssName} light = ${lightVars[cssName]} — tokens.md says ${c.light} (role ${role})`);
  }
  if (darkVars[cssName] && darkVars[cssName] !== c.dark) {
    fail(`colors_and_type.css: ${cssName} dark  = ${darkVars[cssName]} — tokens.md says ${c.dark} (role ${role})`);
  }
}

// CSS var naming convention: --[a-z][a-z0-9-]*
for (const name of [...Object.keys(lightVars), ...Object.keys(darkVars)]) {
  if (!/^--[a-z][a-z0-9-]*$/.test(name)) {
    fail(`colors_and_type.css: custom property \`${name}\` violates --[a-z][a-z0-9-]* naming`);
  }
}

// Every var(--foo) reference must be declared in :root or [data-theme="dark"].
const declared = new Set([...Object.keys(lightVars), ...Object.keys(darkVars)]);
// Also pick up non-color tokens like spacing, radii, transitions, font stacks.
for (const l of cssLines) {
  const m = l.match(/^\s*(--[a-z0-9-]+)\s*:/);
  if (m) declared.add(m[1]);
}
const refs = [...css.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((m) => m[1]);
for (const ref of new Set(refs)) {
  if (!declared.has(ref)) {
    fail(`colors_and_type.css: var(${ref}) used but never declared`);
  }
}

// ─── 3. Validate platforms/charm/jylhis/palette.go ─────────────────────
// Parse the paper and roast struct literals. Each field is `Name: "#hex"`.
// Some fields are grouped comma-separated on one line. Regex-scrape field/hex
// pairs inside the two var blocks.

const goFile = read("platforms/charm/jylhis/palette.go");

function parseGoBlock(label) {
  const re = new RegExp(`var ${label} = Palette\\{([\\s\\S]*?)\\n\\}`, "m");
  const body = goFile.match(re)?.[1] ?? "";
  const out = {};
  // Split on commas, then pick up `Field: "#hex"` pieces.
  for (const piece of body.split(/[,{]/)) {
    const m = piece.match(/(\w+)\s*:\s*"(#[0-9a-fA-F]{6})"/);
    if (m) out[m[1]] = m[2].toLowerCase();
  }
  // Also grab ANSI array entries.
  const ansiRe = /ANSI:\s*\[16\]string\{([\s\S]*?)\}/;
  const ansiBody = body.match(ansiRe)?.[1] ?? "";
  const ansiHex = [...ansiBody.matchAll(/"(#[0-9a-fA-F]{6})"/g)].map((m) => m[1].toLowerCase());
  return { fields: out, ansi: ansiHex };
}

const paperGo = parseGoBlock("paper");
const roastGo = parseGoBlock("roast");

const goFieldMap = {
  Bg: "bg", BgSubtle: "bg-subtle", Surface: "surface", SurfaceRaised: "surface-raised",
  Text: "text", TextMuted: "text-muted", TextHeading: "text-heading", TextFaint: "text-faint",
  Accent: "accent", AccentHover: "accent-hover", Brand: "brand",
  Border: "border", BorderStrong: "border-strong", Decorator: "decorator",
  SynKeyword: "syn-keyword", SynString: "syn-string", SynNumber: "syn-number",
  SynFunction: "syn-function", SynType: "syn-type", SynBuiltin: "syn-builtin",
  SynVariable: "syn-variable", SynTag: "syn-type", SynComment: "syn-comment",
  SynDocstring: "syn-docstring",
  StatusErr: "status-err", StatusWarn: "status-warn", StatusOk: "status-ok", StatusInfo: "status-info",
};

for (const [field, role] of Object.entries(goFieldMap)) {
  const c = canon.get(role);
  if (!c) continue;
  if (paperGo.fields[field] && paperGo.fields[field] !== c.light) {
    fail(`palette.go paper.${field} = ${paperGo.fields[field]} — tokens.md says ${c.light} (role ${role})`);
  }
  if (roastGo.fields[field] && roastGo.fields[field] !== c.dark) {
    fail(`palette.go roast.${field} = ${roastGo.fields[field]} — tokens.md says ${c.dark} (role ${role})`);
  }
}

for (let i = 0; i < 16; i++) {
  const c = canon.get(`ansi-${i}`);
  if (!c) continue;
  if (paperGo.ansi[i] && paperGo.ansi[i] !== c.light) {
    fail(`palette.go paper.ANSI[${i}] = ${paperGo.ansi[i]} — tokens.md says ${c.light}`);
  }
  if (roastGo.ansi[i] && roastGo.ansi[i] !== c.dark) {
    fail(`palette.go roast.ANSI[${i}] = ${roastGo.ansi[i]} — tokens.md says ${c.dark}`);
  }
}

// ─── 4. Validate Ghostty themes ────────────────────────────────────────
function validateGhostty(path, mode) {
  const body = read(path);
  const target = mode === "light" ? "light" : "dark";
  const role = mode === "light" ? (k) => canon.get(k)?.light : (k) => canon.get(k)?.dark;
  // palette lines
  for (const line of body.split("\n")) {
    const m = line.match(/^palette\s*=\s*(\d{1,2})=(#[0-9a-fA-F]{6})/);
    if (m) {
      const [, n, h] = m;
      const expected = role(`ansi-${n}`);
      if (expected && h.toLowerCase() !== expected) {
        fail(`${path}: ANSI ${n} = ${h} — tokens.md says ${expected}`);
      }
    }
    const bgm = line.match(/^background\s*=\s*(#[0-9a-fA-F]{6})/);
    if (bgm && role("bg") !== bgm[1].toLowerCase()) {
      fail(`${path}: background = ${bgm[1]} — tokens.md says ${role("bg")}`);
    }
    const fgm = line.match(/^foreground\s*=\s*(#[0-9a-fA-F]{6})/);
    if (fgm && role("text") !== fgm[1].toLowerCase()) {
      fail(`${path}: foreground = ${fgm[1]} — tokens.md says ${role("text")}`);
    }
    const curm = line.match(/^cursor-color\s*=\s*(#[0-9a-fA-F]{6})/);
    if (curm && role("accent") !== curm[1].toLowerCase()) {
      fail(`${path}: cursor-color = ${curm[1]} — tokens.md says ${role("accent")}`);
    }
  }
  return target;
}

validateGhostty("platforms/ghostty/jylhis-paper", "light");
validateGhostty("platforms/ghostty/jylhis-roast", "dark");

// ─── 5. Contrast checks ────────────────────────────────────────────────
// tokens.md asserts AAA for body text (≥ 7:1) and AA for meta (≥ 4.5:1).
// Verify the headline claims against canonical hex values.

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

const contrastChecks = [
  ["text", "bg", "light", 7, "AAA body text (light)"],
  ["text", "bg", "dark", 7, "AAA body text (dark)"],
  ["text-heading", "bg", "light", 7, "AAA headings (light)"],
  ["text-muted", "bg", "light", 4.5, "AA meta (light)"],
  ["text-muted", "bg", "dark", 4.5, "AA meta (dark)"],
  ["accent", "bg", "light", 4.5, "AA accent on paper"],
  ["accent", "bg", "dark", 7, "AAA accent on dark"],
];

for (const [fg, bg, mode, min, label] of contrastChecks) {
  const fgc = canon.get(fg)?.[mode];
  const bgc = canon.get(bg)?.[mode];
  if (!fgc || !bgc) continue;
  const ratio = contrast(fgc, bgc);
  if (ratio < min) {
    fail(`contrast: ${label} ${fgc} on ${bgc} = ${ratio.toFixed(2)}:1 (< ${min}:1)`);
  }
}

// ─── Report ────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`\n✗ ${errors.length} token-drift or contrast issue(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}

console.log(`✓ token validation passed (${canon.size} canonical roles checked)`);
