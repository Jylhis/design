#!/usr/bin/env bun
// Jylhis design system — token validator.
//
// Validates tokens.json (the single source of truth):
// - Schema: required fields, hex format
// - WCAG contrast ratio claims
// - CSS var(--…) references in colors_and_type.css resolve
//
// Generation consistency is handled by `bun scripts/generate.mjs --check`.
//
// Run: bun scripts/validate-tokens.mjs
// CI:  .github/workflows/validate.yml

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(`Usage: validate-tokens [--help] [--version]

Validates tokens.json (the single source of truth):
  - schema: required fields, hex format
  - WCAG contrast ratio claims
  - CSS var(--…) references in colors_and_type.css resolve

Exits 0 on success, 1 on validation failure.
`);
  process.exit(0);
}
if (process.argv.includes("--version")) {
  process.stdout.write("validate-tokens 1.0.0\n");
  process.exit(0);
}

const errors = [];
const fail = (msg) => errors.push(msg);

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

// ─── 1. Load and validate tokens.json schema ─────────────────────────

const tokens = JSON.parse(read("tokens.json"));

function checkHex(path, value) {
  if (!HEX_RE.test(value)) fail(`${path}: "${value}" is not a valid #RRGGBB hex`);
}

function checkColorEntry(section, role, entry) {
  if (!entry.light) fail(`${section}.${role}: missing "light"`);
  else checkHex(`${section}.${role}.light`, entry.light);
  if (!entry.dark) fail(`${section}.${role}: missing "dark"`);
  else checkHex(`${section}.${role}.dark`, entry.dark);
}

// Palette
const requiredPalette = [
  "bg", "bg-subtle", "surface", "surface-raised",
  "text", "text-muted", "text-heading", "text-faint",
  "accent", "accent-hover", "brand",
  "border", "border-strong", "decorator",
];
for (const role of requiredPalette) {
  if (!tokens.palette[role]) fail(`palette.${role}: missing`);
  else checkColorEntry("palette", role, tokens.palette[role]);
}

// Syntax
const requiredSyntax = [
  "syn-keyword", "syn-string", "syn-number", "syn-function",
  "syn-builtin", "syn-type", "syn-variable", "syn-comment", "syn-docstring",
];
for (const role of requiredSyntax) {
  if (!tokens.syntax[role]) fail(`syntax.${role}: missing`);
  else checkColorEntry("syntax", role, tokens.syntax[role]);
}

// Status
for (const role of ["status-err", "status-warn", "status-ok", "status-info"]) {
  if (!tokens.status[role]) fail(`status.${role}: missing`);
  else checkColorEntry("status", role, tokens.status[role]);
}

// ANSI — must be exactly 16 entries
if (!Array.isArray(tokens.ansi) || tokens.ansi.length !== 16) {
  fail(`ansi: expected array of 16 entries, got ${tokens.ansi?.length ?? "none"}`);
} else {
  for (let i = 0; i < 16; i++) {
    const a = tokens.ansi[i];
    if (!a.name) fail(`ansi[${i}]: missing "name"`);
    checkHex(`ansi[${i}].light`, a.light);
    checkHex(`ansi[${i}].dark`, a.dark);
  }
}

// Optional ansi-slot overrides: a palette/syntax/status role may carry an
// `ansi` field naming the slot to use on 16-color terminals (overrides the
// nearest-RGB derivation used by the Emacs generator). The named slot must
// exist in tokens.ansi. The Emacs sentinel values "unspecified-bg" and
// "unspecified-fg" are also allowed; they let the terminal's own bg/fg
// show through on plain 16-color TTYs (Emacs treats them as "no color set").
const ansiSlots = new Set(Array.isArray(tokens.ansi) ? tokens.ansi.map((a) => a.name) : []);
const ansiSentinels = new Set(["unspecified-bg", "unspecified-fg"]);
for (const [section, entries] of [["palette", tokens.palette], ["syntax", tokens.syntax], ["status", tokens.status]]) {
  for (const [role, entry] of Object.entries(entries)) {
    if (entry && Object.prototype.hasOwnProperty.call(entry, "ansi")) {
      const v = entry.ansi;
      if (typeof v !== "string" || (!ansiSlots.has(v) && !ansiSentinels.has(v))) {
        fail(`${section}.${role}.ansi: "${v}" is not a valid ANSI slot name (expected one of ${[...ansiSlots].join(", ")}, ${[...ansiSentinels].join(", ")})`);
      }
    }
  }
}

// CLAUDE.md hard rule: ANSI slot 11 is always brand copper, so the `accent`
// role's optional `ansi` override must point at bright-yellow if it's set.
if (tokens.palette?.accent?.ansi && tokens.palette.accent.ansi !== "bright-yellow") {
  fail(`palette.accent.ansi: must be "bright-yellow" (CLAUDE.md: ANSI 11 is always brand copper)`);
}

// Scalar token maps — breakpoints/borderWidth are px strings, zIndex is
// non-negative integers. `notes` keys are documentation and skipped.
const PX_RE = /^\d+px$/;
const scalarEntries = (obj) => Object.entries(obj ?? {}).filter(([k]) => k !== "notes");
for (const [section, re] of [["breakpoints", PX_RE], ["borderWidth", PX_RE]]) {
  if (!tokens[section]) fail(`${section}: missing`);
  for (const [k, v] of scalarEntries(tokens[section])) {
    if (typeof v !== "string" || !re.test(v)) fail(`${section}.${k}: "${v}" is not a px string`);
  }
}
if (!tokens.zIndex) fail("zIndex: missing");
for (const [k, v] of scalarEntries(tokens.zIndex)) {
  if (!Number.isInteger(v) || v < 0) fail(`zIndex.${k}: "${v}" is not a non-negative integer`);
}

// borderWidth.focus duplicates focus.width for --border-* naming symmetry;
// they must never drift apart.
if (tokens.borderWidth?.focus !== tokens.focus?.width) {
  fail(`borderWidth.focus (${tokens.borderWidth?.focus}) must equal focus.width (${tokens.focus?.width})`);
}

// ─── 2. Contrast (WCAG 2 relative luminance) ─────────────────────────

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

function colorFor(role, mode) {
  for (const section of [tokens.palette, tokens.syntax, tokens.status]) {
    if (section[role]) return section[role][mode];
  }
  return null;
}

const checks = tokens.contrast || [];
for (const { fg, bg, mode, min, label } of checks) {
  const fgc = colorFor(fg, mode);
  const bgc = colorFor(bg, mode);
  if (!fgc || !bgc) continue;
  const ratio = contrast(fgc, bgc);
  if (ratio < min) fail(`contrast: ${label} ${fgc} on ${bgc} = ${ratio.toFixed(2)}:1 (< ${min}:1)`);
}

// ─── 2b. Extended sweep across every paperstock surface ──────────────
// Beyond the seven hand-listed pairs in tokens.json#contrast, body text and
// the accent need to clear minimum thresholds against EVERY surface, not
// just `bg`. Cards use `bg-subtle`, modals use `surface-raised`, etc.
// Thresholds reflect docs/ACCESSIBILITY.md#what-we-measure:
//   - text, text-heading: AA (4.5:1) against any paperstock surface
//   - text-muted:        3:1 against any paperstock surface (AA Large)
//   - accent:            AA (4.5:1) against any paperstock surface — accent is
//                        used as link *text* on cards, so it must clear normal-
//                        size AA on every surface, not just `bg`.
//   - syn-comment:       AA (4.5:1) against any paperstock surface — comments are
//                        text and may sit on raised card surfaces, not only code-bg.
//   - status-*:          3:1 against bg (non-text indicator)
const SURFACES = ["bg", "bg-subtle", "surface", "surface-raised"];
const sweep = [
  ...["text", "text-heading"].flatMap((fg) =>
    SURFACES.flatMap((bg) =>
      ["light", "dark"].map((mode) => ({ fg, bg, mode, min: 4.5, label: `${fg} on ${bg} (${mode})` })),
    ),
  ),
  ...SURFACES.flatMap((bg) =>
    ["light", "dark"].map((mode) => ({ fg: "text-muted", bg, mode, min: 3, label: `text-muted on ${bg} (${mode})` })),
  ),
  ...SURFACES.flatMap((bg) =>
    ["light", "dark"].map((mode) => ({ fg: "accent", bg, mode, min: 4.5, label: `accent on ${bg} (${mode})` })),
  ),
  ...SURFACES.flatMap((bg) =>
    ["light", "dark"].map((mode) => ({ fg: "syn-comment", bg, mode, min: 4.5, label: `syn-comment on ${bg} (${mode})` })),
  ),
  ...["status-err", "status-warn", "status-ok", "status-info"].flatMap((fg) =>
    ["light", "dark"].map((mode) => ({ fg, bg: "bg", mode, min: 3, label: `${fg} on bg (${mode})` })),
  ),
];
let sweepCount = 0;
for (const { fg, bg, mode, min, label } of sweep) {
  const fgc = colorFor(fg, mode);
  const bgc = colorFor(bg, mode);
  if (!fgc || !bgc) continue;
  sweepCount++;
  const ratio = contrast(fgc, bgc);
  if (ratio < min) fail(`sweep: ${label} ${fgc} on ${bgc} = ${ratio.toFixed(2)}:1 (< ${min}:1)`);
}

// ─── 2c. ANSI 7 / 15 must be foreground tones ────────────────────────
// Many TUI apps emit \e[37m or \e[97m for plain text — if those slots
// resolve to background tones, paragraphs become unreadable on the bg.
// Require AA-Normal (4.5:1) against palette.bg in both modes.
let ansiFgChecksDone = 0;
for (const slot of [7, 15]) {
  for (const mode of ["light", "dark"]) {
    const a = tokens.ansi?.[slot];
    const bg = tokens.palette?.bg?.[mode];
    if (!a || !bg) continue;
    const ratio = contrast(a[mode], bg);
    ansiFgChecksDone++;
    if (ratio < 4.5) {
      fail(
        `contrast: ANSI ${slot} (${a.name}, ${mode}) ${a[mode]} on bg ${bg} ` +
        `= ${ratio.toFixed(2)}:1 (< 4.5:1) — these slots must be foreground tones`,
      );
    }
  }
}

// ─── 2d. Kernel TTY palette contrast ─────────────────────────────────
// The Linux virtual console renders text using ANSI slot 0 as the actual
// background and slot 7/15 as the default/bright foregrounds — there is
// no separate page-bg channel. The generated console.colors fragment
// (scripts/generate.mjs generateConsole) overrides those three slots from
// palette.bg / palette.text / palette.text-heading; require AAA contrast
// between them so the bare TTY and tuigreet stay readable in both modes.
let ttyChecksDone = 0;
for (const mode of ["light", "dark"]) {
  const bg = tokens.palette?.bg?.[mode];
  const checks = [
    ["text",         tokens.palette?.text?.[mode]],
    ["text-heading", tokens.palette?.["text-heading"]?.[mode]],
  ];
  for (const [name, fg] of checks) {
    if (!fg || !bg) continue;
    const ratio = contrast(fg, bg);
    ttyChecksDone++;
    if (ratio < 7) {
      fail(
        `contrast: TTY ${name} (${mode}) ${fg} on bg ${bg} ` +
        `= ${ratio.toFixed(2)}:1 (< 7:1) — kernel TTY needs AAA fg-on-bg`,
      );
    }
  }
}

// ─── 2e. Status/accent tints ─────────────────────────────────────────
// Alert and Callout surfaces tint their background with the status/accent
// color via `color-mix(in srgb, <color> N%, transparent)` over bg
// (components/components.css). The declarative contrast block can't express
// blends (fg/bg are role names), so verify here: the head/label color must
// stay AA (4.5:1) and body text AAA (7:1) on the blended surface, both modes.
// TINT_MAX is the strongest tint used in CSS (status chips use 12%; alerts
// 10%, callouts 8%) — checking the strongest covers the lighter ones only if
// the tint darkens, so check every tint level actually used.
const TINT_LEVELS = [0.08, 0.10, 0.12];
const blendHex = (fgHex, bgHex, alpha) => {
  const c = (h) => [1, 3, 5].map((i) => Number.parseInt(h.slice(i, i + 2), 16));
  const [fr, fgc, fb] = c(fgHex);
  const [br, bgc, bb] = c(bgHex);
  const mix = (f, b) => Math.round(alpha * f + (1 - alpha) * b);
  return "#" + [mix(fr, br), mix(fgc, bgc), mix(fb, bb)].map((v) => v.toString(16).padStart(2, "0")).join("");
};
let tintChecksDone = 0;
for (const role of ["status-err", "status-warn", "status-ok", "status-info", "accent"]) {
  for (const mode of ["light", "dark"]) {
    const roleC = colorFor(role, mode);
    const bgC = colorFor("bg", mode);
    const textC = colorFor("text", mode);
    if (!roleC || !bgC || !textC) continue;
    for (const alpha of TINT_LEVELS) {
      const tint = blendHex(roleC, bgC, alpha);
      tintChecksDone += 2;
      const headRatio = contrast(roleC, tint);
      if (headRatio < 4.5) {
        fail(`tint: ${role} (${mode}) ${roleC} on its ${alpha * 100}% tint ${tint} = ${headRatio.toFixed(2)}:1 (< 4.5:1)`);
      }
      const bodyRatio = contrast(textC, tint);
      if (bodyRatio < 7) {
        fail(`tint: text (${mode}) ${textC} on ${role} ${alpha * 100}% tint ${tint} = ${bodyRatio.toFixed(2)}:1 (< 7:1)`);
      }
    }
  }
}

// ─── 3. CSS var(--…) resolution in colors_and_type.css ───────────────

const css = read("colors_and_type.css");
const tokensCss = read("tokens.css");
const allCss = tokensCss + "\n" + css;

const allDeclared = new Set();
for (const [, name] of allCss.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)) {
  allDeclared.add(name);
}

for (const [, ref] of allCss.matchAll(/var\((--[a-z0-9-]+)[,)]/g)) {
  if (!allDeclared.has(ref)) fail(`CSS: var(${ref}) used but never declared`);
}

// ─── Report ──────────────────────────────────────────────────────────

if (errors.length) {
  console.error(`\n✗ ${errors.length} validation issue(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("");
  process.exit(1);
}

const roleCount = requiredPalette.length + requiredSyntax.length + 4 + 16;
console.log(`✓ token validation passed (${roleCount} roles, ${checks.length} explicit + ${sweepCount} swept + ${ansiFgChecksDone} ANSI-fg + ${ttyChecksDone} TTY + ${tintChecksDone} tint contrast checks)`);
