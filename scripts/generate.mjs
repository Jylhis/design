#!/usr/bin/env bun
// Jylhis design system — code generator.
//
// Reads tokens.json (the single source of truth) and generates all
// platform-specific theme files. Run with: bun scripts/generate.mjs
//
// Modes:
//   (default)  — write generated files in-place
//   --check    — generate to temp dir, diff against committed files, exit 1 if different

import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { tmpdir } from "node:os";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(resolve(ROOT, p), "utf8");

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(`Usage: generate [--check] [--help] [--version]

Reads tokens.json (the single source of truth) and writes all platform-
specific theme files (tokens.css, tokens-data.js, platforms/*).

Options:
  --check     Generate to a temp dir, diff against committed files, exit 1
              if any file is out of sync. Use in CI.
  -h, --help  Show this help and exit.
  --version   Show version and exit.

Examples:
  bun scripts/generate.mjs            # write generated files in-place
  bun scripts/generate.mjs --check    # CI mode: fail if files diverge
`);
  process.exit(0);
}
if (process.argv.includes("--version")) {
  process.stdout.write("generate 1.0.0\n");
  process.exit(0);
}

const tokens = JSON.parse(read("tokens.json"));

const checkMode = process.argv.includes("--check");
const outputs = new Map(); // path → content

function out(relPath, content) {
  outputs.set(relPath, content);
}

// ─── Helper: look up a color by role name across all token sections ───
function color(role, mode) {
  for (const section of [tokens.palette, tokens.syntax, tokens.status]) {
    if (section[role]) return section[role][mode];
  }
  throw new Error(`Unknown color role: ${role}`);
}

function ansiColor(index, mode) {
  return tokens.ansi[index][mode];
}

// ─── Helper: WCAG 2 relative-luminance contrast ratio ────────────────
// Mirrors scripts/validate-tokens.mjs so we don't drift.

function _luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a, b) {
  const [la, lb] = [_luminance(a), _luminance(b)].sort((x, y) => y - x);
  return (la + 0.05) / (lb + 0.05);
}

function wcagTag(ratio) {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA Large";
  return "fail";
}

// ─── Helper: hex → RGB triplet ───────────────────────────────────────

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// ─── Helper: hex → nearest xterm-256 indexed color ──────────────────
// Returns "color-NNN" for use in Emacs terminal face specs.
// xterm-256 layout: 16 ANSI + 216-cube (16-231) + 24 grayscale (232-255).

const _xtermCubeSteps = [0, 95, 135, 175, 215, 255];
function _nearestCubeIndex(v) {
  let best = 0, bestDist = Infinity;
  for (let i = 0; i < 6; i++) {
    const d = Math.abs(v - _xtermCubeSteps[i]);
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best;
}
function hexToXterm256(hex) {
  const [r, g, b] = hexToRgb(hex);
  const ri = _nearestCubeIndex(r);
  const gi = _nearestCubeIndex(g);
  const bi = _nearestCubeIndex(b);
  const cubeIdx = 16 + 36 * ri + 6 * gi + bi;
  const cR = _xtermCubeSteps[ri], cG = _xtermCubeSteps[gi], cB = _xtermCubeSteps[bi];
  const cubeDist = (cR - r) ** 2 + (cG - g) ** 2 + (cB - b) ** 2;
  let grayIdx = -1, grayDist = Infinity;
  for (let i = 0; i < 24; i++) {
    const gv = 8 + 10 * i;
    const d = (gv - r) ** 2 + (gv - g) ** 2 + (gv - b) ** 2;
    if (d < grayDist) { grayDist = d; grayIdx = 232 + i; }
  }
  return `color-${cubeDist <= grayDist ? cubeIdx : grayIdx}`;
}

// ─── Helper: token role → ANSI 16-color name ────────────────────────
// Returns a name Emacs's tty driver accepts ("red", "brightyellow", ...).
// Honors an optional `ansi` override field on the role entry.

// Emacs sentinel values ("unspecified-bg", "unspecified-fg") are valid in
// face specs and must pass through with their hyphen intact — Emacs accepts
// them as a directive meaning "use the terminal's own bg/fg, do not impose".
const _ANSI_SENTINELS = new Set(["unspecified-bg", "unspecified-fg"]);

function _ansiNameForSlot(slotName) {
  if (_ANSI_SENTINELS.has(slotName)) return slotName;
  // tokens.json stores "bright-yellow"; Emacs expects "brightyellow".
  return slotName.replace(/-/g, "");
}

function _nearestAnsi(hex, mode) {
  const [r, g, b] = hexToRgb(hex);
  let best = "white", bestDist = Infinity;
  for (const slot of tokens.ansi) {
    const [sr, sg, sb] = hexToRgb(slot[mode]);
    const d = (sr - r) ** 2 + (sg - g) ** 2 + (sb - b) ** 2;
    if (d < bestDist) { bestDist = d; best = _ansiNameForSlot(slot.name); }
  }
  return best;
}

function roleToAnsi16(roleName, mode) {
  for (const section of [tokens.palette, tokens.syntax, tokens.status]) {
    if (section[roleName]) {
      if (section[roleName].ansi) return _ansiNameForSlot(section[roleName].ansi);
      return _nearestAnsi(section[roleName][mode], mode);
    }
  }
  throw new Error(`roleToAnsi16: unknown role ${roleName}`);
}

// ─── 1. tokens.css — CSS custom properties ───────────────────────────

function generateTokensCSS() {
  const allRoles = { ...tokens.palette, ...tokens.syntax, ...tokens.status };

  // CSS variable name mapping
  const cssName = (role) => {
    if (role.startsWith("syn-")) return `--color-syntax-${role.slice(4)}`;
    if (role.startsWith("status-")) return `--color-${role}`;
    return `--color-${role}`;
  };

  const varBlock = (mode) => {
    const lines = [];
    // Group: palette
    lines.push("  /* Background */");
    for (const r of ["bg", "bg-subtle"]) lines.push(`  ${cssName(r)}: ${tokens.palette[r][mode]};`);
    lines.push("  /* Surface */");
    for (const r of ["surface", "surface-raised"]) lines.push(`  ${cssName(r)}: ${tokens.palette[r][mode]};`);
    lines.push("  /* Text */");
    for (const r of ["text", "text-muted", "text-heading", "text-faint"]) lines.push(`  ${cssName(r)}: ${tokens.palette[r][mode]};`);
    lines.push("  /* Accent */");
    for (const r of ["accent", "accent-hover"]) lines.push(`  ${cssName(r)}: ${tokens.palette[r][mode]};`);
    // accent-subtle is derived (rgba), keep as hand-authored in colors_and_type.css
    lines.push(`  ${cssName("brand")}: ${tokens.palette.brand[mode]};`);
    // selection highlight + input caret (matches the editor/terminal targets)
    for (const r of ["selection-bg", "cursor"]) lines.push(`  ${cssName(r)}: ${tokens.palette[r][mode]};`);
    lines.push("  /* Borders */");
    for (const r of ["border", "border-strong", "decorator", "contour"]) lines.push(`  ${cssName(r)}: ${tokens.palette[r][mode]};`);
    lines.push("  /* Code */");
    lines.push(`  --color-code-bg: ${tokens.palette["bg-subtle"][mode]};`);
    lines.push(`  --color-code-text: ${tokens.palette.text[mode]};`);
    lines.push(`  --color-code-border: ${tokens.palette.border[mode]};`);
    lines.push("  /* Syntax */");
    for (const r of Object.keys(tokens.syntax)) lines.push(`  ${cssName(r)}: ${tokens.syntax[r][mode]};`);
    lines.push(`  --color-syntax-tag: ${tokens.syntax["syn-type"][mode]};`);
    lines.push("  /* Status */");
    for (const r of Object.keys(tokens.status)) lines.push(`  ${cssName(r)}: ${tokens.status[r][mode]};`);
    // Foreground pairs — every fill that carries text ships its guaranteed-
    // contrast foreground token (tokens.json#pairs, enforced by validate-tokens).
    lines.push("  /* Foreground pairs */");
    for (const [surface, spec] of Object.entries(tokens.pairs ?? {})) {
      lines.push(`  ${cssName(surface)}-foreground: ${allRoles[spec.fg][mode]};`);
    }
    return lines.join("\n");
  };

  const spacingVars = Object.entries(tokens.spacing)
    .map(([k, v]) => `  --space-${k}: ${v};`)
    .join("\n");

  const layoutVars = [
    `  --layout-content-max: ${tokens.layout.contentMax};`,
    `  --layout-margin-width: ${tokens.layout.marginWidth};`,
    `  --layout-gap: ${tokens.layout.gap};`,
    `  --layout-padding-mobile: ${tokens.layout.paddingMobile};`,
  ].join("\n");

  const radiiVars = Object.entries(tokens.radii)
    .map(([k, v]) => `  --radius-${k}: ${v};`)
    .join("\n");

  // Scalar token maps may carry a human-facing `notes` key — never emit it.
  const scalarEntries = (obj) => Object.entries(obj).filter(([k]) => k !== "notes");

  const borderWidthVars = scalarEntries(tokens.borderWidth)
    .map(([k, v]) => `  --border-${k}: ${v};`)
    .join("\n");

  const zIndexVars = scalarEntries(tokens.zIndex)
    .map(([k, v]) => `  --z-${k}: ${v};`)
    .join("\n");

  // Breakpoints: @media rules cannot read custom properties, so hand-authored
  // media queries repeat these literally (tagged `/* breakpoints.<name> */`).
  // The vars are still emitted for JS and container-query consumers.
  const breakpointList = scalarEntries(tokens.breakpoints);
  const breakpointComment = `  /* Breakpoints — reference only; @media rules repeat these literally: ${breakpointList
    .map(([k, v]) => `${k} ${v}`)
    .join(" · ")} */`;
  const breakpointVars = breakpointList
    .map(([k, v]) => `  --breakpoint-${k}: ${v};`)
    .join("\n");

  // Type scale — rem multipliers from typography.scale, largest first.
  // --type-scale-0 is the h1 step; hand CSS consumes these so heading
  // sizes cannot drift from tokens.json.
  const typeScaleVars = tokens.typography.scale
    .map((v, i) => `  --type-scale-${i}: ${v}rem;`)
    .join("\n");

  // Font families — the v2 three-role stack, from tokens.json typography.
  // Emitting these makes display / body / mono part of the generated source of
  // truth; hand CSS consumes the vars so families cannot drift from tokens.json.
  // --font-heading is the semantic alias for the title face (display).
  const fontStack = (role) => {
    const t = tokens.typography[role];
    return `"${t.family}", ${t.fallback}`;
  };
  const fontVars = [
    `  --font-display: ${fontStack("display")};`,
    `  --font-body: ${fontStack("body")};`,
    `  --font-mono: ${fontStack("mono")};`,
    `  --font-heading: var(--font-display);`,
  ].join("\n");

  const transitionVars = Object.entries(tokens.motion)
    .map(([k, v]) => `  --transition-${k}: ${v.duration} ${v.css};`)
    .join("\n");

  // Derived rgba values — opacity-based, so kept out of tokens.json's hex-only palette.
  // Compose each from its source token so the RGB never drifts from tokens.json:
  // accent-subtle is the accent at low opacity; the modal/overlay scrim is the scrim
  // ink at a higher opacity (deeper on Field, where the page is already dark).
  const rgbaOf = (role, mode, alpha) => {
    const [r, g, b] = hexToRgb(color(role, mode));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const accentSubtleLight = rgbaOf("accent", "light", 0.12);
  const accentSubtleDark = rgbaOf("accent", "dark", 0.15);
  const scrimLight = rgbaOf("scrim", "light", 0.4);
  const scrimDark = rgbaOf("scrim", "dark", 0.55);

  // Focus ring — width/offset from tokens.json#focus, colour is always accent.
  // Theme-independent: the accent var resolves per-theme, so this lives in :root only.
  const focusVars = [
    `  --focus-ring-width: ${tokens.focus.width};`,
    `  --focus-ring-offset: ${tokens.focus.offset};`,
    `  --focus-ring: var(--focus-ring-width) solid var(--color-accent);`,
  ].join("\n");

  return `/*
 * tokens.css — GENERATED from tokens.json. Do not edit by hand.
 * Jylhis Design System color and spacing tokens.
 */

/* Light theme (default) */
:root {
${varBlock("light")}
  --color-accent-subtle: ${accentSubtleLight};
  --color-scrim: ${scrimLight};
  /* Spacing */
${spacingVars}
  /* Layout */
${layoutVars}
  /* Radii */
${radiiVars}
  /* Border widths */
${borderWidthVars}
  /* Z-index layers */
${zIndexVars}
${breakpointComment}
${breakpointVars}
  /* Font families */
${fontVars}
  /* Type scale */
${typeScaleVars}
  /* Focus ring */
${focusVars}
  /* Transitions */
${transitionVars}
}

/* Dark theme */
[data-theme="dark"] {
${varBlock("dark")}
  --color-accent-subtle: ${accentSubtleDark};
  --color-scrim: ${scrimDark};
}
`;
}

// ─── 2. Ghostty themes ───────────────────────────────────────────────

function generateGhostty(mode) {
  const label = mode === "light" ? "Sheet" : "Field";
  const themeName = mode === "light" ? "jylhis-sheet" : "jylhis-field";
  const modus = mode === "light" ? "Operandi" : "Vivendi";

  const lines = [
    `# Jylhis ${label} (${mode}) — Ghostty colorscheme`,
    `# Drop in ~/.config/ghostty/themes/${themeName} and reference with`,
    `# \`theme = ${themeName}\` in config.`,
    "#",
    `# ANSI 0\u20136 are Modus ${modus} accents so \`ls\`, \`bat\`, \`delta\`, \`git log\``,
    "# share the editor's palette. ANSI 11 is the bronze accent \u2014 intentional",
    "# override so prompts and dir-permissions carry the Jylhis identity.",
    "# See tokens.md \u00a73.",
    "",
  ];

  for (let i = 0; i < 16; i++) {
    lines.push(`palette = ${i}=${ansiColor(i, mode)}`);
  }

  lines.push("");
  lines.push(`background         = ${color("bg", mode)}`);
  lines.push(`foreground         = ${color("text", mode)}`);
  lines.push(`cursor-color       = ${color("cursor", mode)}`);
  lines.push(`cursor-text        = ${color("bg", mode)}`);
  lines.push(`selection-background = ${color("selection-bg", mode)}`);
  lines.push(`selection-foreground = ${color("text", mode)}`);

  return lines.join("\n") + "\n";
}

// ─── 3. Go palette ──────────────────────────────────────────────────

function generateGoPalette() {
  const goField = (role) => {
    const map = {
      "bg": "Bg", "bg-subtle": "BgSubtle", "surface": "Surface", "surface-raised": "SurfaceRaised",
      "text": "Text", "text-muted": "TextMuted", "text-heading": "TextHeading", "text-faint": "TextFaint",
      "accent": "Accent", "accent-hover": "AccentHover", "brand": "Brand",
      "border": "Border", "border-strong": "BorderStrong", "decorator": "Decorator",
      "syn-keyword": "SynKeyword", "syn-string": "SynString", "syn-number": "SynNumber",
      "syn-function": "SynFunction", "syn-builtin": "SynBuiltin", "syn-type": "SynType",
      "syn-variable": "SynVariable", "syn-comment": "SynComment", "syn-docstring": "SynDocstring",
      "status-err": "StatusErr", "status-warn": "StatusWarn", "status-ok": "StatusOk", "status-info": "StatusInfo",
    };
    return map[role];
  };

  const paletteStruct = (mode) => {
    const varName = mode === "light" ? "sheet" : "field";
    const allRoles = [...Object.keys(tokens.palette), ...Object.keys(tokens.syntax), ...Object.keys(tokens.status)];

    const fields = [];
    // Surfaces
    fields.push(`\tBg: "${color("bg", mode)}", BgSubtle: "${color("bg-subtle", mode)}", Surface: "${color("surface", mode)}", SurfaceRaised: "${color("surface-raised", mode)}",`);
    // Text
    fields.push(`\tText: "${color("text", mode)}", TextMuted: "${color("text-muted", mode)}", TextHeading: "${color("text-heading", mode)}", TextFaint: "${color("text-faint", mode)}",`);
    // Accent
    fields.push(`\tAccent: "${color("accent", mode)}", AccentHover: "${color("accent-hover", mode)}", Brand: "${color("brand", mode)}",`);
    // Structure
    fields.push(`\tBorder: "${color("border", mode)}", BorderStrong: "${color("border-strong", mode)}", Decorator: "${color("decorator", mode)}",`);
    // Syntax
    const synFields = Object.keys(tokens.syntax).map(r => `${goField(r)}: "${tokens.syntax[r][mode]}"`).join(", ");
    fields.push(`\t${synFields},`);
    // SynTag alias
    fields.push(`\tSynTag: "${tokens.syntax["syn-type"][mode]}",`);
    // Status
    const statusFields = Object.keys(tokens.status).map(r => `${goField(r)}: "${tokens.status[r][mode]}"`).join(", ");
    fields.push(`\t${statusFields},`);
    // ANSI
    const ansiLines = [];
    for (let i = 0; i < 16; i += 8) {
      const chunk = tokens.ansi.slice(i, i + 8).map(a => `"${a[mode]}"`).join(", ");
      ansiLines.push(`\t\t${chunk},`);
    }
    fields.push(`\tANSI: [16]string{\n${ansiLines.join("\n")}\n\t},`);

    return `var ${varName} = Palette{\n${fields.join("\n")}\n}`;
  };

  return `// Package jylhis is the Jylhis design system for Charm TUIs.
//
// GENERATED from tokens.json. Do not edit by hand.
// Run: bun scripts/generate.mjs
//
// It exposes the canonical Jylhis palette as lipgloss colors and
// provides ready-made styles for common components (titles, borders,
// help, selected items, kbd hints, status). Works standalone or
// inside Bubble Tea.
//
// Usage:
//
//\timport "github.com/jylhis/design/platforms/charm/jylhis"
//
//\tt := jylhis.NewTheme(jylhis.Sheet) // or jylhis.Field
//\tfmt.Println(t.Title.Render("Notes"))
//\tfmt.Println(t.Subtle.Render("7 files \u00b7 updated 2m ago"))
//
// For auto light/dark against the terminal background, use
// jylhis.Detect(os.Stdin, os.Stdout) or pair with Bubble Tea's
// tea.BackgroundColorMsg (see bubbletea.go).
package jylhis

import (
\t"image/color"

\t"charm.land/lipgloss/v2"
)

// Mode selects the light (Sheet) or dark (Field) variant.
type Mode int

const (
\tSheet Mode = iota // light \u2014 cool near-white ground, bronze accent
\tField             // dark  \u2014 cool near-black ground, bronze accent
)

// Palette is the raw Jylhis palette for one mode.
// Values are hex strings; convert to lipgloss.Color with lipgloss.Color(p.Accent).
type Palette struct {
\t// Surfaces
\tBg, BgSubtle, Surface, SurfaceRaised string
\t// Text
\tText, TextMuted, TextHeading, TextFaint string
\t// Accent family \u2014 bronze
\tAccent, AccentHover, Brand string
\t// Structure
\tBorder, BorderStrong, Decorator string
\t// Syntax \u2014 Emacs Modus (Operandi for Sheet, Vivendi for Field).
\t// Uniform with the CSS vars and the Emacs themes.
\tSynKeyword, SynString, SynNumber, SynFunction, SynType, SynBuiltin,
\tSynVariable, SynTag, SynComment, SynDocstring string
\t// Status \u2014 Modus red/yellow/green/blue accents.
\tStatusErr, StatusWarn, StatusOk, StatusInfo string
\t// ANSI 16 (for tables, sparklines, anything that needs raw palette access)
\tANSI [16]string
}

// sheet is the canonical light palette. Hex values are the single source of truth.
// When they change, update tokens.json first, then run: bun scripts/generate.mjs
${paletteStruct("light")}

${paletteStruct("dark")}

// PaletteFor returns the raw palette for a mode.
func PaletteFor(m Mode) Palette {
\tif m == Field {
\t\treturn field
\t}
\treturn sheet
}

// C is a convenience wrapper: lipgloss color from a hex string in the palette.
func C(hex string) color.Color { return lipgloss.Color(hex) }
`;
}

// ─── 4. Hyprland color configs ──────────────────────────────────────

function generateHyprland(mode) {
  const label = mode === "light" ? "Sheet" : "Field";

  const hex = (role) => color(role, mode).slice(1); // strip #

  if (mode === "light") {
    return `# Jylhis Sheet (light) border colors for Hyprland
# GENERATED from tokens.json. Do not edit by hand.
# source this from hyprland.conf when in light mode.

general {
    col.active_border   = rgba(${hex("accent")}ff) rgba(${hex("brand")}ff) 45deg  # accent \u2192 brand
    col.inactive_border = rgba(${hex("border-strong")}aa)                       # border-strong, soft
}

decoration {
    col.shadow          = rgba(${hex("text")}aa)   # text tone, not pure black
    col.shadow_inactive = rgba(${hex("text")}44)
}

misc {
    background_color = 0x${hex("bg")}            # sheet
}
`;
  } else {
    return `# Jylhis Field (dark) border colors for Hyprland
# GENERATED from tokens.json. Do not edit by hand.

general {
    col.active_border   = rgba(${hex("accent")}ff) rgba(${hex("brand")}ff) 45deg  # accent \u2192 brand (dark)
    col.inactive_border = rgba(${hex("border-strong")}aa)                       # border-strong
}

decoration {
    col.shadow          = rgba(00000066)
    col.shadow_inactive = rgba(00000022)
}

misc {
    background_color = 0x${hex("bg")}            # field
}
`;
  }
}

// ─── 4b. Hyprlock lock-screen theme ─────────────────────────────────

function generateHyprlock(mode) {
  const label = mode === "light" ? "Sheet" : "Field";
  const variant = mode === "light" ? "light" : "dark";
  const rgba = (role) => `rgba(${color(role, mode).slice(1)}ff)`;

  return `# Jylhis ${label} (${variant}) hyprlock lock-screen theme
# GENERATED from tokens.json. Do not edit by hand.
# ~/.config/hypr/hyprlock.conf  —  source or paste into your hyprlock config.
#
# Colors, fonts, and field layout only. Behavior — fingerprint auth, grace
# period, monitors — stays yours to set below the theme, the same way the
# Hyprland target ships colors but not keybinds.
#
# Tokens referenced: bg, surface, border-strong, text, accent, status-err.

general {
    hide_cursor = true
    disable_loading_bar = true
}

background {
    monitor =
    color = ${rgba("bg")}            # bg
}

# Password entry — same selected-item language as platforms/KEYBOARD.md:
# 2px accent-family border, surface fill, accent while verifying,
# status-err on a failed attempt.
input-field {
    monitor =
    size = 600, 100
    position = 0, 0
    halign = center
    valign = center

    outline_thickness = 2
    rounding = 0
    outer_color = ${rgba("border-strong")}   # border-strong
    inner_color = ${rgba("surface")}         # surface
    font_color  = ${rgba("text")}            # text
    check_color = ${rgba("accent")}          # accent (verifying)
    fail_color  = ${rgba("status-err")}      # status-err

    font_family = IBM Plex Mono
    placeholder_text = Enter Password
    fail_text = <i>$PAMFAIL ($ATTEMPTS)</i>
    fade_on_empty = false
    shadow_passes = 0
}

# Clock above the field — presentational default; swap $TIME for a greeting
# or a cmd[] as you like.
label {
    monitor =
    text = $TIME
    text_align = center
    color = ${rgba("text")}          # text
    font_size = 24
    font_family = IBM Plex Mono
    position = 0, -100
    halign = center
    valign = center
}
`;
}

// ─── 5. Kvantum color palettes ──────────────────────────────────────

function generateKvantum(mode) {
  const label = mode === "light" ? "Sheet" : "Field";
  const themeName = mode === "light" ? "JylhisSheet" : "JylhisField";

  const c = (role) => color(role, mode);
  const synNum = tokens.syntax["syn-number"][mode];

  if (mode === "light") {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  Jylhis Kvantum theme colors — GENERATED from tokens.json. Do not edit by hand.
  ~/.config/Kvantum/${themeName}.colors

  Kvantum's .kvconfig controls geometry; .colors is the palette.
  Pair this with a base theme like KvGnomeDark or KvAdapta and only the
  palette will be re-tinted.

  Apply:
    kvantummanager --set ${themeName}
    qt5ct / qt6ct \u2192 Appearance \u2192 "kvantum" / "kvantum-dark"
-->

<!-- ${themeName}.colors  (${mode}) -->
<palette theme="${themeName}">
  <color role="Window">${c("bg")}</color>
  <color role="WindowText">${c("text")}</color>
  <color role="Base">${c("surface-raised")}</color>
  <color role="AlternateBase">${c("bg-subtle")}</color>
  <color role="Text">${c("text")}</color>
  <color role="BrightText">${c("text-heading")}</color>
  <color role="Button">${c("surface")}</color>
  <color role="ButtonText">${c("text")}</color>
  <color role="Highlight">${c("accent")}</color>
  <color role="HighlightedText">${c("bg")}</color>
  <color role="Link">${c("accent")}</color>
  <color role="LinkVisited">${synNum}</color><!-- Modus blue-warmer -->

  <color role="ToolTipBase">${c("surface-raised")}</color>
  <color role="ToolTipText">${c("text")}</color>
  <color role="Light">${c("surface-raised")}</color>
  <color role="Midlight">${c("bg-subtle")}</color>
  <color role="Mid">${c("border")}</color>
  <color role="Dark">${c("text-muted")}</color>
  <color role="Shadow">${c("text")}</color>

  <!-- Disabled group -->
  <color role="WindowText" group="Disabled">${c("text-faint")}</color>
  <color role="Text"        group="Disabled">${c("text-faint")}</color>
  <color role="ButtonText"  group="Disabled">${c("text-faint")}</color>

  <!-- Inactive (unfocused) \u2014 same color, matches the flat survey-sheet metaphor -->
  <color role="Highlight"        group="Inactive">${c("border-strong")}</color>
  <color role="HighlightedText"  group="Inactive">${c("text")}</color>
</palette>
`;
  } else {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- ${themeName}.colors  (${mode}) — GENERATED from tokens.json. Do not edit by hand. -->
<palette theme="${themeName}">
  <color role="Window">${c("bg")}</color>
  <color role="WindowText">${c("text")}</color>
  <color role="Base">${c("bg-subtle")}</color>
  <color role="AlternateBase">${c("surface")}</color>
  <color role="Text">${c("text")}</color>
  <color role="BrightText">${c("text-heading")}</color>
  <color role="Button">${c("surface")}</color>
  <color role="ButtonText">${c("text")}</color>
  <color role="Highlight">${c("accent")}</color>
  <color role="HighlightedText">${c("bg")}</color>
  <color role="Link">${c("accent")}</color>
  <color role="LinkVisited">${synNum}</color><!-- Modus blue-warmer -->

  <color role="ToolTipBase">${c("surface-raised")}</color>
  <color role="ToolTipText">${c("text")}</color>
  <color role="Light">${c("surface-raised")}</color>
  <color role="Midlight">${c("surface")}</color>
  <color role="Mid">${c("border")}</color>
  <color role="Dark">${c("text-muted")}</color>
  <color role="Shadow">#000000</color>

  <color role="WindowText" group="Disabled">#6b6157</color>
  <color role="Text"        group="Disabled">#6b6157</color>
  <color role="ButtonText"  group="Disabled">#6b6157</color>

  <color role="Highlight"        group="Inactive">${c("border-strong")}</color>
  <color role="HighlightedText"  group="Inactive">${c("text")}</color>
</palette>
`;
  }
}

// ─── 6. Emacs themes (Tokyo-Themes-style shared core, three-tier display fallbacks) ──
//
// Both Sheet and Field variants share `jylhis-theme-core.el`, which holds the
// canonical face spec list as a small DSL and resolves each role across three
// display tiers:
//   - GUI / 24-bit:    exact hex from tokens.json
//   - xterm-256:       "color-NNN" indexed slot
//   - 16-color TTY:    named ANSI slot ("red", "brightyellow", …)
//
// Per-variant palette files (jylhis-{sheet,field}-palette.el) carry the
// three tiers per role; per-variant entry-point files (jylhis-{sheet,field}-
// theme.el) wire the palette into the shared core and call provide-theme.

// Maps the short aliases used in the Elisp DSL to their source-of-truth
// role in tokens.json. The aliases match the locals used in the previous
// monolithic generator to keep the face spec list readable.
const EMACS_ROLE_MAP = {
  bg:               { section: "palette", role: "bg" },
  "bg-subtle":      { section: "palette", role: "bg-subtle" },
  surface:          { section: "palette", role: "surface" },
  "surface-raised": { section: "palette", role: "surface-raised" },
  fg:               { section: "palette", role: "text" },
  "fg-muted":       { section: "palette", role: "text-muted" },
  "fg-heading":     { section: "palette", role: "text-heading" },
  "fg-faint":       { section: "palette", role: "text-faint" },
  accent:           { section: "palette", role: "accent" },
  "accent-hover":   { section: "palette", role: "accent-hover" },
  "accent-subtle":  { section: "palette", role: "accent-subtle" },
  brand:            { section: "palette", role: "brand" },
  border:           { section: "palette", role: "border" },
  "border-strong":  { section: "palette", role: "border-strong" },
  decorator:        { section: "palette", role: "decorator" },
  "syn-keyword":    { section: "syntax",  role: "syn-keyword" },
  "syn-string":     { section: "syntax",  role: "syn-string" },
  "syn-number":     { section: "syntax",  role: "syn-number" },
  "syn-function":   { section: "syntax",  role: "syn-function" },
  "syn-builtin":    { section: "syntax",  role: "syn-builtin" },
  "syn-type":       { section: "syntax",  role: "syn-type" },
  "syn-variable":   { section: "syntax",  role: "syn-variable" },
  "syn-tag":        { section: "syntax",  role: "syn-type" }, // alias of syn-type
  "syn-comment":    { section: "syntax",  role: "syn-comment" },
  "syn-docstring":  { section: "syntax",  role: "syn-docstring" },
  err:              { section: "status",  role: "status-err" },
  warn:             { section: "status",  role: "status-warn" },
  ok:               { section: "status",  role: "status-ok" },
  info:             { section: "status",  role: "status-info" },
};

function _emacsRoleEntry(alias) {
  const m = EMACS_ROLE_MAP[alias];
  if (!m) throw new Error(`Unknown Emacs palette alias: ${alias}`);
  return tokens[m.section][m.role];
}
function _emacsRoleAnsi(alias, mode) {
  const entry = _emacsRoleEntry(alias);
  if (entry.ansi) return _ansiNameForSlot(entry.ansi);
  return _nearestAnsi(entry[mode], mode);
}
// Honor an optional per-mode `x256` override on a role entry, e.g.
//   "surface": { …, "x256": { "light": "color-251", "dark": "color-239" } }
// Nearest-color quantization collapses near-identical surfaces onto the same
// 256-palette slot (e.g. the modeline background onto `bg`), so a handful of
// roles pin an explicit index for the xterm-256 tier while keeping their
// 24-bit hex untouched. Mirrors the `ansi` override for the 16-color tier.
function _emacsRoleX256(alias, mode) {
  const entry = _emacsRoleEntry(alias);
  const override = entry.x256 && entry.x256[mode];
  return override ?? hexToXterm256(entry[mode]);
}

function generateEmacsPalette(mode) {
  const variant = mode === "light" ? "sheet" : "field";
  const themeName = `jylhis-${variant}`;
  const aliases = Object.keys(EMACS_ROLE_MAP);

  const paletteLines = aliases.map((alias) => {
    const entry = _emacsRoleEntry(alias);
    const hex = entry[mode];
    const x256 = _emacsRoleX256(alias, mode);
    const a16 = _emacsRoleAnsi(alias, mode);
    return `    (${alias.padEnd(15)} ("${hex}" "${x256}" "${a16}"))`;
  });

  const ansiLines = tokens.ansi.map((slot) => {
    const role = `ansi-${slot.name}`;
    const hex = slot[mode];
    const x256 = hexToXterm256(hex);
    const a16 = _ansiNameForSlot(slot.name);
    return `    (${role.padEnd(15)} ("${hex}" "${x256}" "${a16}"))`;
  });

  const fixme = tokens.status["status-err"][mode];
  const todo = tokens.status["status-warn"][mode];
  const note = tokens.status["status-info"][mode];
  const deprecated = tokens.palette["text-faint"][mode];

  return `;;; ${themeName}-palette.el --- Jylhis ${variant} palette  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;;; Commentary:
;;
;;  Three-tier color palette for the ${themeName} theme.
;;  Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed
;;  by \`jylhis-apply-faces' in jylhis-theme-core.el.
;;
;;; Code:

(defconst ${themeName}-palette
  '(
${paletteLines.join("\n")}

    ;; ANSI 16-color slots (for ansi-color-* faces)
${ansiLines.join("\n")}
    )
  "Three-tier palette for the Jylhis ${variant} theme.
Each entry is (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)) and is consumed by
\`jylhis-apply-faces' to emit a Custom face SPEC-LIST that degrades
across display classes.")

(defconst ${themeName}-hl-todo-faces
  '(("FIXME"      . "${fixme}")
    ("BUG"        . "${fixme}")
    ("TODO"       . "${todo}")
    ("HACK"       . "${todo}")
    ("NOTE"       . "${note}")
    ("REVIEW"     . "${note}")
    ("DEPRECATED" . "${deprecated}"))
  "Suggested \`hl-todo-keyword-faces' for the Jylhis ${variant} theme.")

(provide '${themeName}-palette)
;;; ${themeName}-palette.el ends here
`;
}

function generateEmacsTheme(mode) {
  const variant = mode === "light" ? "sheet" : "field";
  const themeName = `jylhis-${variant}`;
  const desc = mode === "light"
    ? "Jylhis — light theme. Bronze accent on the Sheet ground, Modus-derived syntax tuned for Sheet."
    : "Jylhis — dark theme. Bronze accent on the Field ground, Modus-derived syntax tuned for Field.";
  const commentary = mode === "light"
    ? 'Light "sheet" variant'
    : 'Dark "field" variant';
  const sibling = mode === "light" ? "jylhis-field-theme.el" : "jylhis-sheet-theme.el";
  const otherTheme = mode === "light" ? "jylhis-field" : "jylhis-sheet";
  const otherMode = mode === "light" ? "dark" : "light";
  const label = mode === "light" ? "light" : "dark";

  const v = tokens.ansi.slice(0, 8).map((a) => `"${a[mode]}"`);
  const ansiVectorStr = `[${v[0]} ${v[1]} ${v[2]} ${v[3]}\n    ${v[4]} ${v[5]} ${v[6]} ${v[7]}]`;

  return `;;; ${themeName}-theme.el --- Jylhis ${label} theme  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;; Author:      Markus Jylhänkangas
;; Homepage:    https://jylhis.com
;; Keywords:    faces, theme
;; Package-Requires: ((emacs "28.1"))
;;
;;; Commentary:
;;
;;  ${commentary} of the Jylhis design system for Emacs.
;;  Modus-style semantic face targeting — see tokens.md §2 for the source-of-truth
;;  palette and platforms/KEYBOARD.md for the shared primitives (focus, kbd,
;;  selected-item language).  A sibling \`${sibling}\` ships the ${otherMode}
;;  variant; both reuse the same semantic face map in jylhis-theme-core.el.
;;
;;  Install:
;;    (add-to-list 'custom-theme-load-path "~/.config/emacs/themes/")
;;    (load-theme '${themeName} t)
;;    ;; Toggle:
;;    (defun jylhis-toggle-theme ()
;;      (interactive)
;;      (if (car custom-enabled-themes)
;;          (progn (disable-theme (car custom-enabled-themes))
;;                 (load-theme (if (eq (car custom-enabled-themes) '${themeName})
;;                                 '${otherTheme} '${themeName}) t))))
;;
;;; Code:

;; \`load-theme\` calls \`load\` against \`custom-theme-load-path\`, which does not
;; touch \`load-path\`. Users who only add this directory to
;; \`custom-theme-load-path\` (the documented install path) would otherwise hit
;; "Cannot open load file: jylhis-theme-core" on the requires below. Add the
;; file's own directory to load-path so the sibling core + palette resolve.
(eval-and-compile
  (let ((dir (file-name-directory (or load-file-name buffer-file-name ""))))
    (when (and dir (not (member dir load-path)))
      (add-to-list 'load-path dir))))

(require 'jylhis-theme-core)
(require '${themeName}-palette)

(deftheme ${themeName}
  "${desc}")

(jylhis-apply-faces '${themeName} ${themeName}-palette)

(custom-theme-set-variables
 '${themeName}
 '(ansi-color-names-vector
   ${ansiVectorStr})
 '(ansi-color-faces-vector
   [default default default italic underline success warning error])
 \`(hl-todo-keyword-faces ',${themeName}-hl-todo-faces))

(provide-theme '${themeName})

;;;###autoload
(and load-file-name
     (boundp 'custom-theme-load-path)
     (add-to-list 'custom-theme-load-path
                  (file-name-as-directory
                   (file-name-directory load-file-name))))

;;; ${themeName}-theme.el ends here
`;
}

function generateEmacsCore() {
  return `;;; jylhis-theme-core.el --- Shared face map for Jylhis themes  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;; Author:      Markus Jylhänkangas
;; Homepage:    https://jylhis.com
;; Keywords:    faces, theme
;; Package-Requires: ((emacs "28.1"))
;;
;;; Commentary:
;;
;;  Canonical face spec list for the Jylhis design system, shared by both
;;  the Sheet (light) and Field (dark) variants.  Each variant ships its
;;  own three-tier palette in jylhis-{sheet,field}-palette.el; this file
;;  resolves palette role symbols into per-display-class face specs.
;;
;;  Display tiers, in order of preference:
;;    - GUI / 24-bit  -> (type graphic) (min-colors 16777216)  exact hex
;;    - xterm-256     -> (class color) (min-colors 256)        "color-NNN"
;;    - 16-color TTY  -> (type tty)                            named ANSI
;;    - fallback      -> t                                     exact hex
;;
;;  ANSI names are gated behind (type tty) and the universal t fallback
;;  repeats the 24-bit hex (valid on every display), so a graphical frame
;;  that fails the truecolor and 256-color tests can never be handed an
;;  ANSI name (which errors with "Undefined color" on graphic frames).
;;
;;  A face may carry GUI-only attributes via the :gui key in its attribute
;;  plist; those attributes are folded only into the 24-bit tier so they
;;  do not bleed into terminal fallbacks where they would not render
;;  (e.g. :inherit variable-pitch, :distant-foreground).
;;
;;; Code:

(defconst jylhis--display-gui '((type graphic) (class color) (min-colors 16777216))
  "Display-class spec for graphical frames with 24-bit color.
Limited to (type graphic) so :gui-only face attributes (e.g.
\\=':inherit variable-pitch', \\=':distant-foreground') do not leak onto
truecolor TTY frames that also report 16777216 colors.")

(defconst jylhis--display-256 '((class color) (min-colors 256))
  "Display-class spec for xterm-256 terminals.")

(defun jylhis--resolve (value palette tier)
  "Resolve VALUE against PALETTE at TIER (0=GUI, 1=xterm-256, 2=ANSI-16).
Symbols matching a palette role are replaced with their tier value; nested
keyword plists (e.g. \\='(:line-width 1 :color border)') are walked
recursively.  All other values pass through unchanged."
  (cond
   ((symbolp value)
    (let ((entry (assq value palette)))
      (if entry (nth tier (cadr entry)) value)))
   ((and (consp value) (keywordp (car value)))
    (jylhis--rewrite-plist value palette tier))
   (t value)))

(defun jylhis--rewrite-plist (plist palette tier)
  "Walk PLIST, resolving each value via \\='jylhis--resolve'."
  (let (out)
    (while plist
      (let ((k (pop plist)) (v (pop plist)))
        (push k out)
        (push (jylhis--resolve v palette tier) out)))
    (nreverse out)))

(defun jylhis--strip-key (plist key)
  "Return PLIST with all KEY/value entries removed."
  (let (out)
    (while plist
      (let ((k (pop plist)) (v (pop plist)))
        (unless (eq k key) (push k out) (push v out))))
    (nreverse out)))

(defun jylhis--build-face-spec (attrs palette)
  "Build a four-tier Custom SPEC-LIST from ATTRS using PALETTE.
ATTRS is a plist; an optional :gui key carries attributes that should
appear only in the GUI tier (e.g. :inherit variable-pitch).

The 16-color ANSI names are gated behind a (type tty) clause, and the
universal t fallback repeats the 24-bit hex (a valid color on every
display).  This guarantees a graphical frame can never be handed an ANSI
color name: a graphic frame that fails the truecolor and 256-color
display tests falls through the tty clause to the hex catch-all instead
of erroring with Undefined color.  Observed via corfu child frames, whose
per-frame face-spec-recalc selected the ANSI tier on a graphic frame."
  (let* ((gui-extra (plist-get attrs :gui))
         (base (jylhis--strip-key attrs :gui)))
    (list
     (list jylhis--display-gui
           (append (jylhis--rewrite-plist base palette 0)
                   (and gui-extra (jylhis--rewrite-plist gui-extra palette 0))))
     (list jylhis--display-256
           (jylhis--rewrite-plist base palette 1))
     (list '((type tty))
           (jylhis--rewrite-plist base palette 2))
     (list t
           (jylhis--rewrite-plist base palette 0)))))

(defconst jylhis--face-specs
  '(
    ;; ── Frame / base ─────────────────────────────────────────────────
    (default                            :background bg :foreground fg)
    (cursor                             :background accent :gui (:distant-foreground bg))
    (fringe                             :background bg)
    (vertical-border                    :foreground border)
    (window-divider                     :foreground border)
    (window-divider-first-pixel         :foreground border)
    (window-divider-last-pixel          :foreground border)
    (shadow                             :foreground fg-faint)

    ;; ── Text emphasis ────────────────────────────────────────────────
    (bold                               :weight bold :foreground fg-heading)
    (italic                             :slant italic)
    (underline                          :underline (:color fg-muted))
    (link                               :foreground accent     :underline (:color accent))
    (link-visited                       :foreground syn-number :underline (:color syn-number))

    ;; ── Selection + region (KEYBOARD.md primitives) ─────────────────
    (region                             :background accent-subtle  :extend t)
    (secondary-selection                :background surface        :extend t)
    (highlight                          :background surface-raised :extend t)
    (hl-line                            :background bg-subtle      :extend t)
    (match                              :background accent-subtle :foreground accent :weight bold)
    (isearch                            :background accent        :foreground bg     :weight bold)
    (isearch-fail                       :background err           :foreground bg)
    (lazy-highlight                     :background accent-subtle :foreground fg)

    ;; ── Mode line ───────────────────────────────────────────────────
    (mode-line                          :background surface :foreground fg
                                        :box (:line-width 3 :color surface))
    (mode-line-inactive                 :background bg-subtle :foreground fg-muted
                                        :box (:line-width 3 :color bg-subtle))
    (mode-line-highlight                :foreground accent :background surface-raised)
    (mode-line-emphasis                 :foreground accent :weight bold)
    (mode-line-buffer-id                :foreground fg-heading :weight bold)

    ;; doom-modeline
    (doom-modeline-bar                  :background accent)
    (doom-modeline-bar-inactive         :background surface)
    (doom-modeline-buffer-file          :foreground fg-heading :weight bold)
    (doom-modeline-buffer-modified      :foreground warn :weight bold)
    (doom-modeline-buffer-major-mode    :foreground syn-tag :weight bold)
    (doom-modeline-project-dir          :foreground fg-muted)
    (doom-modeline-info                 :foreground ok)
    (doom-modeline-warning              :foreground warn)
    (doom-modeline-urgent               :foreground err)
    (doom-modeline-lsp-success          :foreground ok)
    (doom-modeline-lsp-warning          :foreground warn)
    (doom-modeline-lsp-error            :foreground err)

    (header-line                        :background bg-subtle :foreground fg-muted
                                        :box (:line-width 3 :color bg-subtle))

    ;; ── Tab-bar / tab-line ──────────────────────────────────────────
    (tab-bar                            :background bg-subtle :foreground fg-muted)
    (tab-bar-tab                        :background surface :foreground fg
                                        :box (:line-width 3 :color surface)
                                        :weight bold)
    (tab-bar-tab-inactive               :background bg-subtle :foreground fg-muted
                                        :box (:line-width 3 :color bg-subtle))

    ;; ── Minibuffer / echo area ──────────────────────────────────────
    (minibuffer-prompt                  :foreground accent :weight bold)
    (error                              :foreground err  :weight bold)
    (warning                            :foreground warn :weight bold)
    (success                            :foreground ok   :weight bold)

    ;; ── Font-lock ───────────────────────────────────────────────────
    (font-lock-builtin-face              :foreground syn-builtin)
    (font-lock-comment-face              :foreground syn-comment :slant italic)
    (font-lock-comment-delimiter-face    :foreground syn-comment)
    (font-lock-constant-face             :foreground syn-number)
    (font-lock-doc-face                  :foreground syn-docstring :slant italic)
    (font-lock-function-name-face        :foreground syn-function :weight bold)
    (font-lock-keyword-face              :foreground syn-keyword  :weight bold)
    (font-lock-negation-char-face        :foreground err)
    (font-lock-preprocessor-face         :foreground syn-builtin)
    (font-lock-regexp-grouping-backslash :foreground syn-function :weight bold)
    (font-lock-regexp-grouping-construct :foreground syn-keyword  :weight bold)
    (font-lock-string-face               :foreground syn-string)
    (font-lock-type-face                 :foreground syn-type)
    (font-lock-variable-name-face        :foreground syn-variable)
    (font-lock-warning-face              :foreground warn :weight bold)

    ;; Tree-sitter richer faces (Emacs 29+)
    (font-lock-bracket-face              :foreground fg-muted)
    (font-lock-delimiter-face            :foreground fg-muted)
    (font-lock-escape-face               :foreground syn-function)
    (font-lock-misc-punctuation-face     :foreground fg-muted)
    (font-lock-number-face               :foreground syn-number)
    (font-lock-operator-face             :foreground syn-keyword)
    (font-lock-property-name-face        :foreground syn-tag)
    (font-lock-property-use-face         :foreground syn-tag)
    (font-lock-punctuation-face          :foreground fg-muted)

    ;; ── Line numbers ────────────────────────────────────────────────
    (line-number                        :background bg :foreground fg-faint)
    (line-number-current-line           :background bg-subtle :foreground accent :weight bold)
    (line-number-major-tick             :foreground fg-muted)
    (line-number-minor-tick             :foreground fg-faint)

    ;; ── Parens / structure ──────────────────────────────────────────
    (show-paren-match                   :background accent-subtle :foreground accent :weight bold)
    (show-paren-mismatch                :background err :foreground bg :weight bold)

    (rainbow-delimiters-depth-1-face    :foreground syn-keyword)
    (rainbow-delimiters-depth-2-face    :foreground syn-string)
    (rainbow-delimiters-depth-3-face    :foreground syn-tag)
    (rainbow-delimiters-depth-4-face    :foreground syn-number)
    (rainbow-delimiters-depth-5-face    :foreground syn-function)
    (rainbow-delimiters-depth-6-face    :foreground accent)
    (rainbow-delimiters-depth-7-face    :foreground fg-muted)
    (rainbow-delimiters-unmatched-face  :foreground err :weight bold)

    ;; ── Vertico / Consult / Marginalia / Corfu / Orderless ─────────
    (vertico-current                    :background accent-subtle :foreground fg :extend t :weight normal)
    (vertico-group-title                :foreground fg-faint :slant italic)
    (vertico-group-separator            :foreground decorator :strike-through t)

    (marginalia-key                     :foreground accent :weight bold)
    (marginalia-documentation           :foreground fg-muted :slant italic)
    (marginalia-date                    :foreground syn-number)
    (marginalia-file-name               :foreground fg)
    (marginalia-size                    :foreground fg-muted)
    (marginalia-mode                    :foreground syn-tag)
    (marginalia-function                :foreground syn-function)
    (marginalia-type                    :foreground syn-tag)
    (marginalia-null                    :foreground fg-faint)
    (marginalia-value                   :foreground fg)

    (consult-file                       :foreground fg)
    (consult-bookmark                   :foreground syn-number)
    (consult-line-number                :foreground fg-faint)
    (consult-preview-line               :background bg-subtle :extend t)
    (consult-preview-match              :background accent-subtle :foreground accent)

    (orderless-match-face-0             :foreground accent     :weight bold)
    (orderless-match-face-1             :foreground syn-string :weight bold)
    (orderless-match-face-2             :foreground syn-tag    :weight bold)
    (orderless-match-face-3             :foreground syn-number :weight bold)

    (corfu-default                      :background surface-raised :foreground fg)
    (corfu-current                      :background accent-subtle  :foreground fg)
    (corfu-border                       :background border-strong)
    (corfu-bar                          :background accent)
    (corfu-echo                         :foreground fg-muted :slant italic)

    (eldoc-highlight-function-argument  :foreground accent :weight bold)
    (tooltip                            :background surface-raised :foreground fg
                                        :gui (:inherit variable-pitch))

    (which-key-key-face                 :foreground accent :weight bold)
    (which-key-group-description-face   :foreground syn-tag)
    (which-key-command-description-face :foreground fg)
    (which-key-local-map-description-face :foreground syn-string)
    (which-key-separator-face           :foreground decorator)
    (which-key-note-face                :foreground fg-faint)

    ;; ── Org ─────────────────────────────────────────────────────────
    (org-level-1                        :foreground accent       :weight bold :height 1.4
                                        :gui (:inherit variable-pitch))
    (org-level-2                        :foreground syn-tag      :weight bold :height 1.2
                                        :gui (:inherit variable-pitch))
    (org-level-3                        :foreground syn-string   :weight bold :height 1.1
                                        :gui (:inherit variable-pitch))
    (org-level-4                        :foreground syn-number   :weight bold)
    (org-level-5                        :foreground syn-function :weight bold)
    (org-level-6                        :foreground syn-keyword)
    (org-level-7                        :foreground fg-muted)
    (org-level-8                        :foreground fg-faint)

    (org-document-title                 :foreground fg-heading :weight bold :height 1.6
                                        :gui (:inherit variable-pitch))
    (org-document-info                  :foreground fg-muted)
    (org-document-info-keyword          :foreground fg-faint)
    (org-meta-line                      :foreground fg-faint :slant italic)
    (org-drawer                         :foreground fg-faint)
    (org-special-keyword                :foreground syn-tag)

    (org-todo                           :foreground warn :weight bold :box (:line-width 1 :color warn))
    (org-done                           :foreground ok   :weight bold :box (:line-width 1 :color ok))
    (org-headline-done                  :foreground fg-muted :strike-through nil)

    (org-date                           :foreground syn-number :underline nil)
    (org-tag                            :foreground fg-muted :weight normal)
    (org-priority                       :foreground accent :weight bold)

    (org-block                          :background bg-subtle :extend t)
    (org-block-begin-line               :background bg-subtle :foreground fg-faint :extend t)
    (org-block-end-line                 :background bg-subtle :foreground fg-faint :extend t)
    (org-code                           :foreground syn-string :background bg-subtle)
    (org-verbatim                       :foreground syn-string)
    (org-quote                          :foreground fg-muted :slant italic)

    (org-table                          :foreground fg :background bg-subtle)
    (org-table-header                   :foreground fg-heading :background surface :weight bold)

    (org-link                           :inherit link)
    (org-footnote                       :foreground syn-number :underline t)
    (org-ellipsis                       :foreground fg-faint :underline nil)
    (org-hide                           :foreground bg)

    (org-modern-tag                     :foreground bg :background syn-tag :weight bold)
    (org-modern-date-active             :foreground bg :background accent  :weight bold)

    (org-agenda-structure               :foreground accent :weight bold)
    (org-agenda-date                    :foreground syn-tag :weight bold)
    (org-agenda-date-today              :foreground accent :weight bold :underline t)
    (org-agenda-date-weekend            :foreground fg-muted)
    (org-scheduled                      :foreground syn-string)
    (org-scheduled-today                :foreground ok :weight bold)
    (org-scheduled-previously           :foreground warn)
    (org-upcoming-deadline              :foreground warn)
    (org-warning                        :foreground warn :weight bold)

    ;; ── Dired ───────────────────────────────────────────────────────
    (dired-directory                    :foreground syn-tag :weight bold)
    (dired-symlink                      :foreground info)
    (dired-broken-symlink               :foreground err :strike-through t)
    (dired-header                       :foreground accent :weight bold)
    (dired-mark                         :foreground accent)
    (dired-marked                       :background accent-subtle :foreground accent :weight bold)
    (dired-perm-write                   :foreground warn)
    (dired-flagged                      :foreground err :weight bold)
    (dired-ignored                      :foreground fg-faint)

    ;; ── Magit / diff ────────────────────────────────────────────────
    (diff-added                         :background bg-subtle :foreground ok)
    (diff-removed                       :background bg-subtle :foreground err)
    (diff-context                       :foreground fg-muted)
    (diff-hunk-header                   :background surface :foreground fg-heading :weight bold)
    (diff-file-header                   :background surface :foreground accent     :weight bold)
    (diff-refine-added                  :background accent-subtle :foreground ok  :weight bold)
    (diff-refine-removed                :background accent-subtle :foreground err :weight bold)

    (magit-section-heading              :foreground accent :weight bold)
    (magit-section-highlight            :background bg-subtle :extend t)
    (magit-branch-local                 :foreground syn-tag :weight bold)
    (magit-branch-remote                :foreground syn-string :weight bold)
    (magit-branch-current               :foreground accent :weight bold :box (:line-width 1 :color accent))
    (magit-tag                          :foreground syn-number)
    (magit-hash                         :foreground fg-faint)
    (magit-log-author                   :foreground syn-function)
    (magit-log-date                     :foreground fg-faint)
    (magit-diff-added                   :background bg-subtle :foreground ok)
    (magit-diff-added-highlight         :background surface   :foreground ok)
    (magit-diff-removed                 :background bg-subtle :foreground err)
    (magit-diff-removed-highlight       :background surface   :foreground err)
    (magit-diff-context                 :foreground fg-muted)
    (magit-diff-context-highlight       :background bg-subtle :foreground fg)
    (magit-diff-hunk-heading            :background surface   :foreground fg-heading)
    (magit-diff-hunk-heading-highlight  :background surface-raised :foreground fg-heading :weight bold)
    (magit-diffstat-added               :foreground ok)
    (magit-diffstat-removed             :foreground err)

    ;; ── Flymake / Flycheck ──────────────────────────────────────────
    (flymake-error                      :underline (:style wave :color err))
    (flymake-warning                    :underline (:style wave :color warn))
    (flymake-note                       :underline (:style wave :color info))
    (flycheck-error                     :underline (:style wave :color err))
    (flycheck-warning                   :underline (:style wave :color warn))
    (flycheck-info                      :underline (:style wave :color info))
    (compilation-error                  :foreground err  :weight bold)
    (compilation-warning                :foreground warn :weight bold)
    (compilation-info                   :foreground info)

    ;; ── Company + Eglot ─────────────────────────────────────────────
    (company-tooltip                    :background surface-raised :foreground fg)
    (company-tooltip-selection          :background accent-subtle  :foreground fg)
    (company-tooltip-common             :foreground accent :weight bold)
    (company-tooltip-annotation         :foreground fg-muted)
    (company-scrollbar-bg               :background surface)
    (company-scrollbar-fg               :background border-strong)

    (eglot-highlight-symbol-face        :background surface :weight bold)
    (eglot-mode-line                    :foreground accent)
    (eglot-diagnostic-tag-deprecated-face :strike-through t :foreground fg-faint)

    ;; ── Terminal (vterm / ansi-term) — tokens.json ANSI palette ─────
    (ansi-color-black                   :foreground ansi-black          :background ansi-black)
    (ansi-color-red                     :foreground ansi-red            :background ansi-red)
    (ansi-color-green                   :foreground ansi-green          :background ansi-green)
    (ansi-color-yellow                  :foreground ansi-yellow         :background ansi-yellow)
    (ansi-color-blue                    :foreground ansi-blue           :background ansi-blue)
    (ansi-color-magenta                 :foreground ansi-magenta        :background ansi-magenta)
    (ansi-color-cyan                    :foreground ansi-cyan           :background ansi-cyan)
    (ansi-color-white                   :foreground ansi-white          :background ansi-white)
    (ansi-color-bright-black            :foreground ansi-bright-black   :background ansi-bright-black)
    (ansi-color-bright-red              :foreground ansi-bright-red     :background ansi-bright-red)
    (ansi-color-bright-green            :foreground ansi-bright-green   :background ansi-bright-green)
    (ansi-color-bright-yellow           :foreground ansi-bright-yellow  :background ansi-bright-yellow)
    (ansi-color-bright-blue             :foreground ansi-bright-blue    :background ansi-bright-blue)
    (ansi-color-bright-magenta          :foreground ansi-bright-magenta :background ansi-bright-magenta)
    (ansi-color-bright-cyan             :foreground ansi-bright-cyan    :background ansi-bright-cyan)
    (ansi-color-bright-white            :foreground ansi-bright-white   :background ansi-bright-white)

    ;; ── Misc ────────────────────────────────────────────────────────
    (trailing-whitespace                :background err)
    (whitespace-tab                     :foreground fg-faint)
    (whitespace-space                   :foreground fg-faint)
    (whitespace-newline                 :foreground fg-faint)
    (whitespace-indentation             :foreground fg-faint)
    (whitespace-line                    :background bg-subtle)
    (whitespace-trailing                :background err)

    (hi-yellow                          :background warn       :foreground bg)
    (hi-pink                            :background syn-number :foreground bg)
    (hi-green                           :background ok         :foreground bg)

    (tab-line-tab-current               :background surface   :foreground accent :weight bold)
    (tab-line-tab                       :background bg-subtle :foreground fg-muted)

    (hl-todo                            :foreground warn :weight bold)
    (indent-bars-face                   :foreground fg-faint))
  "Canonical face spec list shared by all Jylhis theme variants.
Each entry is (FACE :ATTR VALUE … [:gui (:ATTR VALUE …)]).
Symbols in attribute positions are resolved against the active palette to a
three-tier value (24-bit GUI / xterm-256 / 16-color ANSI). The :gui plist
folds attributes into the GUI tier only — use it for attributes like
\`:inherit variable-pitch' that do not render on a TTY.")

(defun jylhis-apply-faces (theme palette)
  "Apply the canonical Jylhis face mapping to THEME using PALETTE.
PALETTE is the value of \\='jylhis-sheet-palette' or \\='jylhis-field-palette'
\(or any alist of (ROLE (GUI-HEX XTERM-256 ANSI-16-NAME)))."
  (let ((args (mapcar
               (lambda (spec)
                 (list 'quote
                       (list (car spec)
                             (jylhis--build-face-spec (cdr spec) palette))))
               jylhis--face-specs)))
    (eval \`(custom-theme-set-faces ',theme ,@args) t)))

(provide 'jylhis-theme-core)
;;; jylhis-theme-core.el ends here
`;
}


// ─── 7. Rofi themes ─────────────────────────────────────────────────

function generateRofi(mode) {
  const label = mode === "light" ? "sheet" : "field";
  const c = (role) => color(role, mode);
  const iconTheme = mode === "light" ? "Papirus" : "Papirus-Dark";
  // accent-subtle for rofi (opaque, not rgba)
  const accentSubtle = mode === "light" ? "#f0dcc4" : "#3a2c20";
  const textFaint = mode === "light" ? "#8a7f72" : "#6b6157";

  const commentHeader = mode === "light"
    ? `/* Jylhis Rofi \u2014 light variant (Sheet). GENERATED from tokens.json. */`
    : `/*\n * Jylhis Rofi \u2014 dark variant (Field). GENERATED from tokens.json.\n * This is THE command palette visual language \u2014 identical DNA to web Cmd+K\n * and Emacs M-x/Vertico. See platforms/KEYBOARD.md \u00a7"Command palette".\n */`;

  return `${commentHeader}

configuration {
    modi:         "drun,combi,run,window";
    font:         "IBM Plex Mono 11";
    show-icons:   true;
    icon-theme:   "${iconTheme}";
    terminal:     "ghostty";
    display-drun: "\u203a";
    display-run:  "\u00bb";
    display-window: "\u00bb\u00bb";
    display-combi:  "\u203a";
    drun-display-format: "{name}";
    kb-cancel: "Escape";
}

* {
    bg:           ${c("bg")};
    bg-subtle:    ${c("bg-subtle")};
    bg-raised:    ${c("surface-raised")};
    text:         ${c("text")};
    text-muted:   ${c("text-muted")};
    text-faint:   ${textFaint};
    accent:       ${c("accent")};
    accent-subtle: ${accentSubtle};
    border:       ${c("border")};
    border-strong: ${c("border-strong")};

    background-color: transparent;
    text-color:       @text;
}

window {
    transparency:     "real";
    width:            560px;
    location:         center;
    anchor:           center;
    y-offset:         -15%;
    background-color: @bg-raised;
    border:           1px;
    border-color:     @border-strong;
    border-radius:    4px;
    padding:          0;
}

mainbox { spacing: 0; children: [ inputbar, message, listview ]; }

inputbar {
    background-color: @bg-subtle;
    text-color:       @text;
    padding:          14px 18px;
    spacing:          0;
    children:         [ prompt, entry ];
}
prompt { text-color: @accent; padding: 0 10px 0 0; }
entry {
    placeholder:       "type a filter \u00b7 tab to cycle \u00b7 esc to close";
    placeholder-color: @text-faint;
    text-color:        @text;
}

message {
    background-color: @bg-subtle;
    padding:          4px 18px 10px;
    border:           0 0 1px 0;
    border-color:     @border;
}
textbox { text-color: @text-muted; font: "IBM Plex Mono 9"; }

listview {
    lines:            9;
    background-color: @bg-raised;
    padding:          8px 0;
    spacing:          0;
    scrollbar:        false;
    cycle:            true;
    dynamic:          true;
}

element {
    padding:      8px 18px;
    spacing:      10px;
    border:       0 0 0 3px;
    border-color: transparent;
    children:     [ element-icon, element-text, element-text-hint ];
}

element normal.normal    { text-color: @text; }
element alternate.normal { background-color: transparent; text-color: @text; }

element selected.normal,
element selected.active,
element selected.urgent {
    background-color: @accent-subtle;
    text-color:       @text;
    border-color:     @accent;
}

element-icon { size: 18px; background-color: transparent; }
element-text { background-color: transparent; vertical-align: 0.5; }
element-text-hint {
    text-color:       @text-muted;
    font:             "IBM Plex Mono 9";
    horizontal-align: 1.0;
    background-color: transparent;
}
`;
}

// ─── 8. GTK CSS ─────────────────────────────────────────────────────
// GTK is template-like but has a complex structure. We read it from templates/gtk.css.tmpl
// if it exists, otherwise generate directly from the existing known structure.

function generateGTK() {
  const lc = (role) => color(role, "light");
  const dc = (role) => color(role, "dark");

  return `/* Jylhis GTK 3 / GTK 4 theme overrides
 * GENERATED from tokens.json. Do not edit by hand.
 * ~/.config/gtk-3.0/gtk.css  AND  ~/.config/gtk-4.0/gtk.css
 *
 * Strategy: we don't ship a full GTK theme (that's a 5000-line commitment).
 * Instead, we start from Adwaita / Adwaita-dark and override the @theme_ tokens
 * that actually change the look. Covers: window bg, selection, accent,
 * headerbar, sidebar, switches, links. Plus keyboard primitives (focus).
 *
 * Pair with:
 *   gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita'        # light
 *   gsettings set org.gnome.desktop.interface gtk-theme 'Adwaita-dark'   # dark
 *   gsettings set org.gnome.desktop.interface accent-color 'orange'
 *   gsettings set org.gnome.desktop.interface font-name 'Hanken Grotesk 11'
 *   gsettings set org.gnome.desktop.interface monospace-font-name 'IBM Plex Mono 10'
 */

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Core palette \u2014 overrides @define-color
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

@define-color accent_color          ${lc("accent")};
@define-color accent_bg_color       ${lc("accent")};
@define-color accent_fg_color       ${lc("bg")};

/* Status colours \u2014 Modus accents (red / green / yellow / blue). */
@define-color destructive_color     ${lc("status-err")};
@define-color destructive_bg_color  ${lc("status-err")};
@define-color destructive_fg_color  ${lc("bg")};

@define-color success_color         ${lc("status-ok")};
@define-color success_bg_color      ${lc("status-ok")};
@define-color success_fg_color      ${lc("bg")};

@define-color warning_color         ${lc("status-warn")};
@define-color warning_bg_color      ${lc("status-warn")};
@define-color warning_fg_color      ${lc("bg")};

@define-color error_color           ${lc("status-err")};
@define-color error_bg_color        ${lc("status-err")};
@define-color error_fg_color        ${lc("bg")};

/* Window */
@define-color window_bg_color        ${lc("bg")};
@define-color window_fg_color        ${lc("text")};
@define-color view_bg_color          ${lc("surface-raised")};
@define-color view_fg_color          ${lc("text")};
@define-color headerbar_bg_color     ${lc("surface")};
@define-color headerbar_fg_color     ${lc("text-heading")};
@define-color headerbar_border_color ${lc("border")};
@define-color sidebar_bg_color       ${lc("bg-subtle")};
@define-color sidebar_fg_color       ${lc("text")};
@define-color card_bg_color          ${lc("surface-raised")};
@define-color popover_bg_color       ${lc("surface-raised")};

/* Borders / shade */
@define-color borders          ${lc("border")};
@define-color shade_color      rgba(44, 40, 37, 0.08);

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Dark variant \u2014 Adwaita-dark loads this block via .dark selector
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.dark,
window.dark {
    --accent-color:          ${dc("accent")};
    --accent-bg-color:       ${dc("accent")};
    --accent-fg-color:       ${dc("bg")};
    --window-bg-color:       ${dc("bg")};
    --window-fg-color:       ${dc("text")};
    --view-bg-color:         ${dc("bg-subtle")};
    --headerbar-bg-color:    ${dc("surface")};
    --headerbar-fg-color:    ${dc("text-heading")};
    --sidebar-bg-color:      ${dc("bg-subtle")};
    --card-bg-color:         ${dc("surface")};
    --popover-bg-color:      ${dc("surface-raised")};
    --borders:               ${dc("border")};
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Typography
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

* {
    -gtk-icon-style: regular;
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Focus \u2014 KEYBOARD.md primitive
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

*:focus-visible,
button:focus-visible,
entry:focus-visible,
textview text:focus-visible {
    outline: 2px solid @accent_color;
    outline-offset: 2px;
    outline-style: solid;
    box-shadow: none;
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Selected \u2014 the universal language
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

row:selected,
treeview:selected,
list > row:selected,
.navigation-sidebar > row:selected {
    background: alpha(@accent_color, 0.15);
    color: @window_fg_color;
    box-shadow: inset 3px 0 0 @accent_color;
    border-radius: 0;
}

row:selected:focus {
    outline: none;
    box-shadow: inset 3px 0 0 @accent_color;
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Buttons \u2014 flatten, warm
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

button {
    border-radius: 4px;
    transition: background 150ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

button.suggested-action,
button.default {
    background: @accent_color;
    color: @accent_fg_color;
    border: 1px solid transparent;
}

button.suggested-action:hover {
    background: shade(@accent_color, 0.92);
}

button.destructive-action {
    background: @destructive_color;
    color: ${lc("bg")};
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Entry / input
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

entry {
    border-radius: 4px;
    border: 1px solid @borders;
    background: @view_bg_color;
}

entry:focus-within {
    border-color: @accent_color;
    outline: 2px solid @accent_color;
    outline-offset: -1px;
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Links \u2014 same as web
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

*:link,
button.link {
    color: @accent_color;
    text-decoration-color: alpha(@accent_color, 0.4);
}

*:link:hover,
button.link:hover {
    color: shade(@accent_color, 0.85);
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Switches / checkbuttons
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

switch:checked {
    background: @accent_color;
}

check:checked,
radio:checked {
    background: @accent_color;
    color: @accent_fg_color;
}

/* \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   Scrollbar
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

scrollbar slider {
    background: alpha(@window_fg_color, 0.25);
    border-radius: 3px;
    min-width: 8px;
    min-height: 8px;
}

scrollbar slider:hover {
    background: alpha(@window_fg_color, 0.45);
}
`;
}

// ─── 9. Waybar CSS ──────────────────────────────────────────────────
// Waybar is hardcoded dark (Field) in the original. We generate it the same way.

function generateWaybar(mode = "dark") {
  const c = (role) => color(role, mode);
  const synType = tokens.syntax["syn-type"][mode];

  const label = mode === "light" ? "Sheet" : "Field";
  const modus = mode === "light" ? "Operandi" : "Vivendi";

  return `/* Jylhis Waybar ${label} — GENERATED from tokens.json. Do not edit by hand.
 * ~/.config/waybar/style.css
 * ${label} background, bronze accent, monospace. Top bar.
 *
 * Tokens referenced: tokens.json palette, typography, density
 */

* {
    font-family: "IBM Plex Mono", "IBM Plex Mono", monospace;
    font-size: 12.5px;
    min-height: 0;
    border: none;
    border-radius: 0;
    margin: 0;
    padding: 0;
}

window#waybar {
    background: ${c("bg")};                 
    color:      ${c("text")};                 
    border-bottom: 1px solid ${c("border")};    
}

/* \u2500\u2500 Modules \u2500\u2500 spacing is TUI-density: 1ch equivalent */
#workspaces,
#mode,
#clock,
#battery,
#network,
#pulseaudio,
#wireplumber,
#bluetooth,
#power-profiles-daemon,
#cpu,
#memory,
#tray,
#custom-notifications,
#custom-nix,
#custom-expand-icon,
#hyprland-language {
    padding: 0 10px;
}

/* Workspaces \u2014 same selected-item language as platforms/KEYBOARD.md */
#workspaces button {
    padding: 0 10px;
    color: ${c("text-muted")};                       /* text-muted */
    background: transparent;
    border-left: 3px solid transparent;
    border-radius: 0;
}

#workspaces button.active {
    color: ${c("accent")};                       /* accent */
    background: ${c("accent-subtle")};           /* accent-subtle */
    border-left: 3px solid ${c("accent")};       /* canonical selected marker */
}

#workspaces button:hover {
    color: ${c("accent")};
    background: transparent;
    box-shadow: inset 0 -2px 0 ${c("accent")};
    text-shadow: none;
}

/* Clock \u2014 keeps the accent quiet */
#clock {
    color: ${c("text")};
}

/* Battery with semantic states \u2014 Modus Vivendi accents */
#battery.warning { color: ${tokens.status["status-warn"][mode]}; }      /* status-warn (Modus yellow) */
#battery.critical { color: ${tokens.status["status-err"][mode]}; }     /* status-err  (Modus red)    */
#battery.charging { color: ${tokens.status["status-ok"][mode]}; }     /* status-ok   (Modus green)  */

/* Network / audio / power */
#network.disconnected,
#pulseaudio.muted,
#wireplumber.muted,
#bluetooth.disabled,
#bluetooth.off,
#power-profiles-daemon.power-saver {
    color: ${c("text-faint")};
}

/* WirePluMber / Bluetooth / power-profiles-daemon — default text-muted */
#wireplumber,
#bluetooth,
#power-profiles-daemon,
#hyprland-language {
    color: ${c("text-muted")};
}

#bluetooth.connected,
#power-profiles-daemon.performance {
    color: ${c("accent")};
}

/* Tray */
#tray > .passive { -gtk-icon-effect: dim; }
#tray > .needs-attention {
    color: ${c("accent")};
    -gtk-icon-effect: highlight;
}

/* Custom modules \u2014 match syntax family */
#custom-nix       { color: ${synType}; }     /* Modus cyan-cooler \u2014 syn-type */
#custom-notifications.dnd { color: ${c("text-faint")}; }

/* Tray drawer toggle (waybar tray expand pattern) */
#custom-expand-icon { color: ${c("text-muted")}; }
#custom-expand-icon:hover { color: ${c("accent")}; }

/* Focus ring \u2014 when waybar modules are navigated via keyboard */
button:focus {
    outline: 2px solid ${c("accent")};
    outline-offset: -2px;
}

/* Reduce motion: waybar has no real motion; nothing to do. */
`;
}

// ─── 10. Mako config ────────────────────────────────────────────────

function generateMako(mode = "dark") {
  const c = (role) => color(role, mode);

  return `# Jylhis Mako — GENERATED from tokens.json. Do not edit by hand.
# ~/.config/mako/config
# Notifications with the command-palette language: accent left-border,
# monospace meta, Sheet/Field bg. Dismiss hint always visible.

font=IBM Plex Mono 11
width=380
height=120
margin=12
padding=14,16
border-size=1
border-radius=4
max-icon-size=32
icon-path=/usr/share/icons/Adwaita

# Default \u2014 ${mode === "light" ? "sheet" : "field"}
background-color=${c("surface")}
text-color=${c("text")}
border-color=${c("border-strong")}
progress-color=over ${c("accent")}

# Layout / animation
layer=overlay
anchor=top-right
default-timeout=6000
ignore-timeout=0

format=<b>%s</b>\\n%b\\n<span foreground='${c("text-faint")}' font='IBM Plex Mono 9'>esc to dismiss \u00b7 meta+n to focus</span>

# Selected marker \u2014 matches KEYBOARD.md \u00a7"Selected item (universal)"
[focused]
background-color=${c("surface-raised")}
border-color=${c("accent")}
# Mako can't draw a left-border only, but border + color does the job.

# Urgency levels \u2014 map to semantic family
[urgency=low]
border-color=${c("text-faint")}

[urgency=normal]
border-color=${c("border-strong")}

[urgency=critical]
background-color=${mode === "light" ? "#f5e0dc" : "#3a1f1c"}
text-color=${color("status-err", mode)}
border-color=${tokens.status["status-err"][mode]}          # Modus red (status-err)
default-timeout=0

# Specific app rules
[app-name=Emacs]
border-color=${tokens.syntax["syn-keyword"][mode]}          # Modus magenta-cooler (syn-keyword)

[category=mpd]
border-color=${tokens.status["status-ok"][mode]}          # Modus green (status-ok)
`;
}

// ─── 11. tokens-data.js for website ─────────────────────────────────

function generateTokensData() {
  // Measured contrast pairs — every foreground role (text family + accent + status)
  // measured against every background surface, in both modes. Consumed by the
  // showcase swatches and the per-theme palette reference page. Derived from
  // tokens.groups so adding a new role updates the matrix automatically.
  const fgRoles = [
    ...tokens.groups.ink.members,
    ...tokens.groups.bronze.members,
    ...tokens.groups.signal.members,
  ];
  const bgRoles = tokens.groups.grounds.members;

  const contrastPairs = [];
  for (const mode of ["light", "dark"]) {
    for (const fg of fgRoles) {
      for (const bg of bgRoles) {
        const fgHex = color(fg, mode);
        const bgHex = color(bg, mode);
        const ratio = contrastRatio(fgHex, bgHex);
        contrastPairs.push({
          mode, fg, bg,
          fgHex, bgHex,
          ratio: Number(ratio.toFixed(2)),
          tag: wcagTag(ratio),
        });
      }
    }
  }

  // Per-color claimed contrast against bg, for the swatch UI. One number per
  // foreground role per mode — the headline ratio shown on the swatch.
  const swatchContrast = {};
  for (const mode of ["light", "dark"]) {
    swatchContrast[mode] = {};
    for (const role of fgRoles) {
      const fgHex = color(role, mode);
      const bgHex = color("bg", mode);
      const ratio = contrastRatio(fgHex, bgHex);
      swatchContrast[mode][role] = {
        ratio: Number(ratio.toFixed(2)),
        tag: wcagTag(ratio),
      };
    }
  }

  const enriched = { ...tokens, contrastPairs, swatchContrast };

  return `// tokens-data.js — GENERATED from tokens.json. Do not edit by hand.
// Used by index.html to render dynamic color swatches and token tables.
// Includes derived data: contrastPairs (every fg×bg×mode), swatchContrast
// (one ratio per fg role per mode against bg).
export const tokens = ${JSON.stringify(enriched, null, 2)};
`;
}

// ─── GIMP .gpl palette ───────────────────────────────────────────────

function generateGimpPalette(mode) {
  const label = mode === "light" ? "Sheet" : "Field";
  const lines = [
    "GIMP Palette",
    `Name: Jylhis ${label}`,
    "Columns: 4",
    "#",
  ];

  const hexToRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };

  const fmt = (hex, name) => {
    const [r, g, b] = hexToRgb(hex);
    const pad = (x) => String(x).padStart(3, " ");
    return `${pad(r)} ${pad(g)} ${pad(b)}\t${name}`;
  };

  // Iterate every thematic group from tokens.json. The `color()` helper looks
  // up roles across palette/syntax/status, so each group emits cleanly without
  // needing a per-section src reference. Spectrum (ANSI) is handled below
  // because its members are array indices, not role-keyed entries.
  for (const [gKey, g] of Object.entries(tokens.groups)) {
    if (gKey === "spectrum") continue;
    lines.push(`# ${g.label}`);
    for (const role of g.members) {
      lines.push(fmt(color(role, mode), role));
    }
  }

  lines.push(`# ${tokens.groups.spectrum.label}`);
  for (let i = 0; i < 16; i++) {
    lines.push(fmt(tokens.ansi[i][mode], `ansi-${i}-${tokens.ansi[i].name}`));
  }

  return lines.join("\n") + "\n";
}

// ─── Adobe Swatch Exchange (.ase) ──────────────────────────────────
// Binary format consumed by Photoshop, Illustrator, InDesign, Affinity.
// Spec: 12-byte header (ASEF + version + block count) followed by blocks.
// Block types: 0xC001 = group start, 0xC002 = group end, 0x0001 = color.
// Strings are UTF-16 BE with a trailing null code unit; the stored length
// is the count of code units including that null.

function generateAdobeSwatch(mode) {
  const utf16beWithNull = (s) => {
    const codeUnits = s.length + 1; // includes null terminator
    const buf = Buffer.alloc(2 + codeUnits * 2);
    buf.writeUInt16BE(codeUnits, 0);
    for (let i = 0; i < s.length; i++) buf.writeUInt16BE(s.charCodeAt(i), 2 + i * 2);
    return buf;
  };

  const colorBlock = (name, hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const nameField = utf16beWithNull(name);
    const data = Buffer.alloc(nameField.length + 4 + 12 + 2);
    nameField.copy(data, 0);
    data.write("RGB ", nameField.length, "ascii");
    data.writeFloatBE(r, nameField.length + 4);
    data.writeFloatBE(g, nameField.length + 8);
    data.writeFloatBE(b, nameField.length + 12);
    data.writeUInt16BE(2, nameField.length + 16); // 2 = "normal" color type
    const header = Buffer.alloc(6);
    header.writeUInt16BE(0x0001, 0);
    header.writeUInt32BE(data.length, 2);
    return Buffer.concat([header, data]);
  };

  const groupStartBlock = (name) => {
    const nameField = utf16beWithNull(name);
    const header = Buffer.alloc(6);
    header.writeUInt16BE(0xC001, 0);
    header.writeUInt32BE(nameField.length, 2);
    return Buffer.concat([header, nameField]);
  };

  const groupEndBlock = () => {
    const buf = Buffer.alloc(6);
    buf.writeUInt16BE(0xC002, 0);
    buf.writeUInt32BE(0, 2);
    return buf;
  };

  const blocks = [];
  for (const [gKey, g] of Object.entries(tokens.groups)) {
    blocks.push(groupStartBlock(g.label));
    if (gKey === "spectrum") {
      for (let i = 0; i < 16; i++) {
        blocks.push(colorBlock(`ansi-${i}-${tokens.ansi[i].name}`, tokens.ansi[i][mode]));
      }
    } else {
      for (const role of g.members) blocks.push(colorBlock(role, color(role, mode)));
    }
    blocks.push(groupEndBlock());
  }

  const header = Buffer.alloc(12);
  header.write("ASEF", 0, "ascii");
  header.writeUInt16BE(1, 4); // major
  header.writeUInt16BE(0, 6); // minor
  header.writeUInt32BE(blocks.length, 8);

  return Buffer.concat([header, ...blocks]);
}

// ─── 14. Base16 YAML ────────────────────────────────────────────────

function generateBase16(mode) {
  const slug = mode === "light" ? "jylhis-sheet" : "jylhis-field";
  const label = mode === "light" ? "Jylhis Sheet" : "Jylhis Field";
  const author = "Markus Jylhankangas (https://jylhis.com)";

  // Base16 slot mapping from tokens.json roles
  const slots = {
    "base00": color("bg", mode),
    "base01": color("bg-subtle", mode),
    "base02": color("surface", mode),
    "base03": color("text-faint", mode),
    "base04": color("text-muted", mode),
    "base05": color("text", mode),
    "base06": color("text-heading", mode),
    "base07": color("surface-raised", mode),
    "base08": color("status-err", mode),
    "base09": color("accent", mode),
    "base0A": color("status-warn", mode),
    "base0B": tokens.syntax["syn-string"][mode],
    "base0C": tokens.syntax["syn-type"][mode],
    "base0D": color("status-info", mode),
    "base0E": tokens.syntax["syn-keyword"][mode],
    "base0F": color("brand", mode),
  };

  // slug:    stable identifier consumed by Stylix (mkSchemeAttrs)
  // name:    base16 0.11 display field
  // scheme:  base16 0.9 display field, kept for back-compat
  const lines = [
    `slug: "${slug}"`,
    `name: "${label}"`,
    `scheme: "${label}"`,
    `author: "${author}"`,
  ];

  for (const [slot, hex] of Object.entries(slots)) {
    lines.push(`${slot}: "${hex.slice(1)}"`);
  }

  return lines.join("\n") + "\n";
}

// ─── 15. fzf color export ───────────────────────────────────────────

function generateFzf(mode) {
  const label = mode === "light" ? "sheet" : "field";
  const c = (role) => color(role, mode);

  // fzf uses --color= with named fields
  const colors = [
    `fg:${c("text")}`,
    `bg:${c("bg")}`,
    `hl:${c("accent")}`,
    `fg+:${c("text-heading")}`,
    `bg+:${c("accent-subtle")}`,
    `hl+:${c("accent-hover")}`,
    `info:${c("text-muted")}`,
    `marker:${tokens.status["status-ok"][mode]}`,
    `prompt:${c("accent")}`,
    `spinner:${c("accent")}`,
    `pointer:${c("accent")}`,
    `header:${c("text-muted")}`,
    `border:${c("border")}`,
    `separator:${c("border")}`,
    `gutter:${c("bg")}`,
  ];

  return `# Jylhis fzf ${label} — GENERATED from tokens.json. Do not edit by hand.
# Source this file or add to your shell profile:
#   source ~/.config/fzf/jylhis-${label}.sh

export FZF_DEFAULT_OPTS="\$FZF_DEFAULT_OPTS --color=${colors.join(",")}"
`;
}

// ─── 16. bat/delta tmTheme ──────────────────────────────────────────

function generateTmTheme(mode) {
  const label = mode === "light" ? "Jylhis Sheet" : "Jylhis Field";
  const c = (role) => color(role, mode);
  const syn = (role) => tokens.syntax[role][mode];

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<!--
  ${label} — GENERATED from tokens.json. Do not edit by hand.
  Install for bat:  cp this ~/.config/bat/themes/ && bat cache --build
  Install for delta: set syntax-theme in .gitconfig
-->
<plist version="1.0">
<dict>
  <key>name</key>
  <string>${label}</string>
  <key>settings</key>
  <array>
    <dict>
      <key>settings</key>
      <dict>
        <key>background</key>
        <string>${c("bg")}</string>
        <key>foreground</key>
        <string>${c("text")}</string>
        <key>caret</key>
        <string>${c("cursor")}</string>
        <key>selection</key>
        <string>${c("selection-bg")}</string>
        <key>lineHighlight</key>
        <string>${c("bg-subtle")}</string>
        <key>gutterForeground</key>
        <string>${c("text-faint")}</string>
      </dict>
    </dict>
    <dict>
      <key>name</key><string>Comment</string>
      <key>scope</key><string>comment, punctuation.definition.comment</string>
      <key>settings</key><dict>
        <key>foreground</key><string>${syn("syn-comment")}</string>
        <key>fontStyle</key><string>italic</string>
      </dict>
    </dict>
    <dict>
      <key>name</key><string>String</string>
      <key>scope</key><string>string, constant.other.symbol</string>
      <key>settings</key><dict><key>foreground</key><string>${syn("syn-string")}</string></dict>
    </dict>
    <dict>
      <key>name</key><string>Number</string>
      <key>scope</key><string>constant.numeric</string>
      <key>settings</key><dict><key>foreground</key><string>${syn("syn-number")}</string></dict>
    </dict>
    <dict>
      <key>name</key><string>Keyword</string>
      <key>scope</key><string>keyword, storage.type, storage.modifier</string>
      <key>settings</key><dict>
        <key>foreground</key><string>${syn("syn-keyword")}</string>
        <key>fontStyle</key><string>bold</string>
      </dict>
    </dict>
    <dict>
      <key>name</key><string>Function</string>
      <key>scope</key><string>entity.name.function, support.function</string>
      <key>settings</key><dict>
        <key>foreground</key><string>${syn("syn-function")}</string>
        <key>fontStyle</key><string>bold</string>
      </dict>
    </dict>
    <dict>
      <key>name</key><string>Type</string>
      <key>scope</key><string>entity.name.type, entity.name.class, support.type, support.class</string>
      <key>settings</key><dict><key>foreground</key><string>${syn("syn-type")}</string></dict>
    </dict>
    <dict>
      <key>name</key><string>Variable</string>
      <key>scope</key><string>variable, variable.other</string>
      <key>settings</key><dict><key>foreground</key><string>${syn("syn-variable")}</string></dict>
    </dict>
    <dict>
      <key>name</key><string>Builtin</string>
      <key>scope</key><string>support.constant, constant.language</string>
      <key>settings</key><dict><key>foreground</key><string>${syn("syn-builtin")}</string></dict>
    </dict>
    <dict>
      <key>name</key><string>Tag</string>
      <key>scope</key><string>entity.name.tag</string>
      <key>settings</key><dict><key>foreground</key><string>${syn("syn-type")}</string></dict>
    </dict>
    <dict>
      <key>name</key><string>Attribute</string>
      <key>scope</key><string>entity.other.attribute-name</string>
      <key>settings</key><dict><key>foreground</key><string>${syn("syn-variable")}</string></dict>
    </dict>
    <dict>
      <key>name</key><string>Doc comment</string>
      <key>scope</key><string>comment.block.documentation</string>
      <key>settings</key><dict>
        <key>foreground</key><string>${syn("syn-docstring")}</string>
        <key>fontStyle</key><string>italic</string>
      </dict>
    </dict>
    <dict>
      <key>name</key><string>Error</string>
      <key>scope</key><string>invalid, invalid.illegal</string>
      <key>settings</key><dict>
        <key>foreground</key><string>${color("status-err", mode)}</string>
        <key>fontStyle</key><string>underline</string>
      </dict>
    </dict>
    <dict>
      <key>name</key><string>Diff added</string>
      <key>scope</key><string>markup.inserted</string>
      <key>settings</key><dict><key>foreground</key><string>${color("status-ok", mode)}</string></dict>
    </dict>
    <dict>
      <key>name</key><string>Diff deleted</string>
      <key>scope</key><string>markup.deleted</string>
      <key>settings</key><dict><key>foreground</key><string>${color("status-err", mode)}</string></dict>
    </dict>
    <dict>
      <key>name</key><string>Diff changed</string>
      <key>scope</key><string>markup.changed</string>
      <key>settings</key><dict><key>foreground</key><string>${color("status-warn", mode)}</string></dict>
    </dict>
  </array>
</dict>
</plist>
`;
}

// ─── 17. NixOS console.colors fragment ──────────────────────────────

function generateConsole(mode = "dark") {
  const label = mode === "light" ? "Sheet" : "Field";
  const sh = (s) => s.slice(1); // drop leading #

  // The kernel TTY uses ANSI slot 0 as the actual screen background and slot
  // 7 as the default foreground — there's no separate page-bg channel like
  // terminal apps have. The tokens.ansi array is tuned for the terminal-app
  // case (slot 0 carries the "text/bg inversion" role, slot 7 is text-muted
  // on Sheet bg), so it produces an unreadable Sheet TTY when copied verbatim.
  //
  // Override slots 0/7/15 from the semantic palette so the bare TTY and any
  // greeter inheriting it stay readable in both variants. Accent slots
  // (1-6, 9-14, including the bronze-accent override at slot 11) keep the
  // Modus values from tokens.ansi unchanged.
  const semantic = {
    0: tokens.palette.bg[mode],
    7: tokens.palette.text[mode],
    15: tokens.palette["text-heading"][mode],
  };
  const cols = tokens.ansi.map((slot, i) => sh(semantic[i] ?? slot[mode]));

  // console.colors expects 16 hex strings (no '#'), in ANSI 0..15 order.
  return `# Jylhis ${label} — GENERATED from tokens.json. Do not edit by hand.
#
# NixOS Linux virtual console (TTY) palette. Import from your
# configuration.nix or a NixOS module:
#
#   imports = [ "\${pkgs.jylhis-themes}/share/jylhis/console/jylhis-${mode === "light" ? "sheet" : "field"}.nix" ];
#
# Slots 0/7/15 are derived from the semantic palette (bg / text /
# text-heading) rather than tokens.ansi — the kernel TTY uses slot 0 as the
# actual background, so the ANSI-escape "text/bg inversion" mapping doesn't
# apply here. All other slots match the ANSI Modus accents in tokens.ansi.

{
  console.colors = [
    "${cols[0]}" "${cols[1]}" "${cols[2]}" "${cols[3]}" "${cols[4]}" "${cols[5]}" "${cols[6]}" "${cols[7]}"
    "${cols[8]}" "${cols[9]}" "${cols[10]}" "${cols[11]}" "${cols[12]}" "${cols[13]}" "${cols[14]}" "${cols[15]}"
  ];
}
`;
}

// ─── 18. Plymouth boot splash (text + spinner, no PNG) ──────────────

function hexToRgbFloats(hex) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => (v / 255).toFixed(3);
  return { r: f((n >> 16) & 255), g: f((n >> 8) & 255), b: f(n & 255) };
}

function generatePlymouthManifest(mode) {
  const variant = mode === "light" ? "sheet" : "field";
  const label = mode === "light" ? "Sheet" : "Field";

  return `# Jylhis ${label} — GENERATED from tokens.json. Do not edit by hand.
[Plymouth Theme]
Name=Jylhis ${label}
Description=Jylhis design system — ${variant} variant. Text + spinner, no images.
ModuleName=script

[script]
ImageDir=.
ScriptFile=jylhis.script
`;
}

function generatePlymouthScript(mode) {
  const variant = mode === "light" ? "sheet" : "field";
  const bg = hexToRgbFloats(color("bg", mode));
  const text = hexToRgbFloats(color("text", mode));
  const accent = hexToRgbFloats(color("accent", mode));

  return `# Jylhis ${variant} — GENERATED from tokens.json. Do not edit by hand.
#
# Text + spinner Plymouth theme. No PNG assets — purely script-driven so
# every color comes from tokens.json. Renders centered "JYLHIS" wordmark
# above an 8-dot spinner using palette.accent.

# Solid-color background fill.
Window.SetBackgroundTopColor(${bg.r}, ${bg.g}, ${bg.b});
Window.SetBackgroundBottomColor(${bg.r}, ${bg.g}, ${bg.b});

# Wordmark — Plymouth's default font is fine; we don't ship IBM Plex Mono.
title_image = Image.Text("JYLHIS", ${text.r}, ${text.g}, ${text.b}, 1.0);
title = Sprite(title_image);
title.SetX(Window.GetWidth() / 2 - title_image.GetWidth() / 2);
title.SetY(Window.GetHeight() / 2 - title_image.GetHeight() / 2 - 32);

# Spinner — 8 dots arranged on a circle, one highlighted at a time.
NUM_DOTS = 8;
RADIUS   = 28;
PI       = 3.14159265;
cx       = Window.GetWidth()  / 2;
cy       = Window.GetHeight() / 2 + 24;

for (i = 0; i < NUM_DOTS; i++) {
  dot_image[i] = Image.Text("●", ${accent.r}, ${accent.g}, ${accent.b}, 1.0);
  dot[i] = Sprite(dot_image[i]);
  angle = i * 2 * PI / NUM_DOTS;
  dot[i].SetX(cx + Math.Cos(angle) * RADIUS - dot_image[i].GetWidth()  / 2);
  dot[i].SetY(cy + Math.Sin(angle) * RADIUS - dot_image[i].GetHeight() / 2);
  dot[i].SetOpacity(0.20);
}

# Rotate the brightest dot around the ring at ~3 revolutions per second.
phase = 0;
fun refresh() {
  for (i = 0; i < NUM_DOTS; i++) {
    d = (i - Math.Int(phase) + NUM_DOTS) % NUM_DOTS;
    if (d == 0)      dot[i].SetOpacity(1.00);
    else if (d == 1) dot[i].SetOpacity(0.60);
    else if (d == 2) dot[i].SetOpacity(0.35);
    else             dot[i].SetOpacity(0.18);
  }
  phase = phase + 0.05;
  if (phase >= NUM_DOTS) phase = 0;
}
Plymouth.SetRefreshFunction(refresh);

# Hide on quit (system has booted).
fun quit() {
  title.SetOpacity(0);
  for (i = 0; i < NUM_DOTS; i++) dot[i].SetOpacity(0);
}
Plymouth.SetQuitFunction(quit);
`;
}

// ─── ZIP helpers (no external deps) ────────────────────────────────
// Minimal STORE-only ZIP builder for binary theme archives (.mtz).
// Uses fixed DOS timestamp 0x0000/0x0000 for deterministic output.

const crc32 = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  return (buf) => {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  };
})();

function buildZipStore(entries) {
  // Pass 1: build local file headers + data, track offsets for central dir
  const locals = [];
  const offsets = [];
  let offset = 0;

  for (const { name, data } of entries) {
    const nameBytes = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034B50, 0);  // local file header sig
    header.writeUInt16LE(20, 4);          // version needed (2.0)
    header.writeUInt16LE(0, 6);           // flags
    header.writeUInt16LE(0, 8);           // compression: STORE
    header.writeUInt16LE(0, 10);          // mod time (fixed)
    header.writeUInt16LE(0, 12);          // mod date (fixed)
    header.writeUInt32LE(crc, 14);        // crc-32
    header.writeUInt32LE(data.length, 18); // compressed size
    header.writeUInt32LE(data.length, 22); // uncompressed size
    header.writeUInt16LE(nameBytes.length, 26); // filename length
    header.writeUInt16LE(0, 28);          // extra field length

    const local = Buffer.concat([header, nameBytes, data]);
    locals.push(local);
    offsets.push(offset);
    offset += local.length;
  }

  // Pass 2: central directory
  const centrals = [];
  for (let i = 0; i < entries.length; i++) {
    const { name, data } = entries[i];
    const nameBytes = Buffer.from(name, "utf8");
    const crc = crc32(data);
    const rec = Buffer.alloc(46);
    rec.writeUInt32LE(0x02014B50, 0);  // central dir sig
    rec.writeUInt16LE(20, 4);          // version made by
    rec.writeUInt16LE(20, 6);          // version needed
    rec.writeUInt16LE(0, 8);           // flags
    rec.writeUInt16LE(0, 10);          // compression: STORE
    rec.writeUInt16LE(0, 12);          // mod time
    rec.writeUInt16LE(0, 14);          // mod date
    rec.writeUInt32LE(crc, 16);        // crc-32
    rec.writeUInt32LE(data.length, 20); // compressed size
    rec.writeUInt32LE(data.length, 24); // uncompressed size
    rec.writeUInt16LE(nameBytes.length, 28); // filename length
    rec.writeUInt16LE(0, 30);          // extra field length
    rec.writeUInt16LE(0, 32);          // comment length
    rec.writeUInt16LE(0, 34);          // disk number start
    rec.writeUInt16LE(0, 36);          // internal attrs
    rec.writeUInt32LE(0, 38);          // external attrs
    rec.writeUInt32LE(offsets[i], 42); // local header offset
    centrals.push(Buffer.concat([rec, nameBytes]));
  }

  const centralDir = Buffer.concat(centrals);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054B50, 0);  // EOCD sig
  eocd.writeUInt16LE(0, 4);           // disk number
  eocd.writeUInt16LE(0, 6);           // disk with central dir
  eocd.writeUInt16LE(entries.length, 8);  // entries on this disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(centralDir.length, 12); // central dir size
  eocd.writeUInt32LE(offset, 16);    // central dir offset
  eocd.writeUInt16LE(0, 20);         // comment length

  return Buffer.concat([...locals, centralDir, eocd]);
}

// ─── 20. Xiaomi HyperOS/MIUI .mtz theme ───────────────────────────
// Binary .mtz = ZIP with description.xml + framework color overrides.
// Colors use #AARRGGBB (alpha-first 8-digit hex); all opaque → #ff prefix.

function generateHyperOS(mode) {
  const variant = mode === "light" ? "sheet" : "field";
  const label = mode === "light" ? "Sheet" : "Field";
  const version = tokens.meta.version;

  // Convert #rrggbb → #ffrrggbb (MIUI alpha-first format, fully opaque)
  const m = (role) => `#ff${color(role, mode).slice(1)}`;

  // ── description.xml ──
  const descriptionXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<MIUI-Theme>',
    `  <title>Jylhis ${label}</title>`,
    '  <designer>Markus Jylhankangas</designer>',
    '  <author>Markus Jylhankangas</author>',
    `  <version>${version}</version>`,
    '  <uiVersion>11</uiVersion>',
    '</MIUI-Theme>',
    '',
  ].join('\n');

  // ── framework-res color mapping ──
  const frameworkColors = [
    ["background_dark",                m("bg")],
    ["background_light",               m("bg")],
    ["background_holo_dark",           m("bg")],
    ["background_holo_light",          m("bg")],
    ["bright_foreground_dark",         m("text-heading")],
    ["bright_foreground_light",        m("text-heading")],
    ["bright_foreground_holo_dark",    m("text-heading")],
    ["bright_foreground_holo_light",   m("text-heading")],
    ["dim_foreground_holo_dark",       m("text-muted")],
    ["dim_foreground_holo_light",      m("text-muted")],
    ["hint_foreground_holo_dark",      m("text-faint")],
    ["hint_foreground_holo_light",     m("text-faint")],
    ["highlighted_text_holo_dark",     m("accent")],
    ["highlighted_text_holo_light",    m("accent")],
    ["link_text_holo_dark",            m("accent")],
    ["link_text_holo_light",           m("accent")],
    ["holo_blue_light",                m("accent")],
    ["holo_blue_dark",                 m("accent-hover")],
    ["holo_green_light",               m("status-ok")],
    ["holo_green_dark",                m("status-ok")],
    ["holo_red_light",                 m("status-err")],
    ["holo_red_dark",                  m("status-err")],
    ["holo_orange_light",              m("status-warn")],
    ["holo_orange_dark",               m("status-warn")],
    ["lockscreen_clock_foreground",    m("text-heading")],
    ["lockscreen_clock_background",    m("bg")],
  ];

  // ── framework-miui-res color mapping ──
  const miuiColors = [
    ["background_dark",                m("bg")],
    ["background_light",               m("bg")],
    ["control_tint_color",             m("accent")],
    ["control_activated_color",        m("accent")],
    ["status_bar_background",          m("bg-subtle")],
    ["navigation_bar_background",      m("bg-subtle")],
    ["notification_panel_background",  m("surface")],
  ];

  const buildThemeValuesXml = (colors) => [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<MIUI_Theme_Values>',
    ...colors.map(([name, val]) => `  <color name="${name}">${val}</color>`),
    '</MIUI_Theme_Values>',
    '',
  ].join('\n');

  return buildZipStore([
    { name: "description.xml",
      data: Buffer.from(descriptionXml, "utf8") },
    { name: "framework-res/theme_values.xml",
      data: Buffer.from(buildThemeValuesXml(frameworkColors), "utf8") },
    { name: "framework-miui-res/theme_values.xml",
      data: Buffer.from(buildThemeValuesXml(miuiColors), "utf8") },
  ]);
}

// ─── Charm Glamour — terminal Markdown stylesheet ───────────────────
// Glamour (github.com/charmbracelet/glamour) renders Markdown in the
// terminal from a JSON stylesheet — powers `glow`, `gh`, `glab`, and
// Bubble Tea apps (dogfooded via nacutils). One StylePrimitive
// (color + background_color + SGR bools + prefix/suffix/format) is reused
// per Markdown element; color is a truecolor "#rrggbb" string. The `notty`
// variant is literally this file minus every colour/attribute key — the
// schema separates structure (prefix/indent/margin/glyphs) from colour, so
// a colourless theme falls out for free. Select with GLAMOUR_STYLE=<path>.
//
// mode: "light" (Sheet) | "dark" (Field) | null (notty, colourless).
function generateGlamour(mode) {
  const withColor = mode !== null;
  const c = (role) => (withColor ? color(role, mode) : undefined);
  const on = (v) => (withColor ? v : undefined); // gate an SGR flag on colour mode

  // code_block syntax highlighting — Modus syntax roles → Chroma token types.
  const chroma = {
    text:                  { color: c("text") },
    error:                 { color: c("status-err") },
    comment:               { color: c("syn-comment"), italic: on(true) },
    comment_preproc:       { color: c("syn-keyword") },
    keyword:               { color: c("syn-keyword") },
    keyword_reserved:      { color: c("syn-keyword") },
    keyword_namespace:     { color: c("syn-keyword") },
    keyword_type:          { color: c("syn-type") },
    operator:              { color: c("syn-keyword") },
    punctuation:           { color: c("text") },
    name:                  { color: c("syn-variable") },
    name_builtin:          { color: c("syn-builtin") },
    name_tag:              { color: c("syn-type") },
    name_attribute:        { color: c("syn-function") },
    name_class:            { color: c("syn-type") },
    name_constant:         { color: c("syn-number") },
    name_decorator:        { color: c("syn-builtin") },
    name_exception:        { color: c("status-err") },
    name_function:         { color: c("syn-function") },
    name_other:            { color: c("syn-variable") },
    literal:               { color: c("syn-string") },
    literal_number:        { color: c("syn-number") },
    literal_date:          { color: c("syn-string") },
    literal_string:        { color: c("syn-string") },
    literal_string_escape: { color: c("syn-builtin") },
    generic_deleted:       { color: c("status-err") },
    generic_emph:          { italic: on(true) },
    generic_inserted:      { color: c("status-ok") },
    generic_strong:        { bold: on(true) },
    generic_subheading:    { color: c("syn-keyword") },
    background:            { background_color: c("bg-subtle") },
  };

  const style = {
    document:     { block_prefix: "\n", block_suffix: "\n", color: c("text"), margin: 2 },
    block_quote:  { color: c("text-muted"), italic: on(true), indent: 1, indent_token: "│ " },
    paragraph:    {},
    list:         { level_indent: 2 },
    heading:      { block_suffix: "\n", color: c("text-heading"), bold: on(true) },
    // h1 renders as a bronze title bar: bg-tone ink on the accent fill — the
    // Paired-Foreground rule, in the terminal (bg is accent's paired fg).
    h1:           { prefix: " ", suffix: " ", color: c("bg"), background_color: c("accent"), bold: on(true) },
    h2:           { prefix: "## ", color: c("text-heading"), bold: on(true) },
    h3:           { prefix: "### ", color: c("text-heading"), bold: on(true) },
    h4:           { prefix: "#### ", color: c("text-muted"), bold: on(true) },
    h5:           { prefix: "##### ", color: c("text-muted") },
    h6:           { prefix: "###### ", color: c("text-faint") },
    text:         {},
    strikethrough:{ crossed_out: on(true) },
    emph:         { italic: on(true) },
    strong:       { bold: on(true) },
    hr:           { color: c("border"), format: "\n──────────\n" },
    item:         { block_prefix: "• " },
    enumeration:  { block_prefix: ". " },
    task:         { ticked: "[✓] ", unticked: "[ ] " },
    link:         { color: c("accent"), underline: on(true) },
    link_text:    { color: c("accent"), bold: on(true) },
    image:        { color: c("contour"), underline: on(true) },
    image_text:   { color: c("text-muted"), format: "image: {{.text}}" },
    code:         { prefix: " ", suffix: " ", color: c("text"), background_color: c("bg-subtle") },
    code_block:   { margin: 2, chroma: withColor ? chroma : undefined },
    table:        { center_separator: "┼", column_separator: "│", row_separator: "─", color: c("text") },
    definition_term:        { color: c("text-heading"), bold: on(true) },
    definition_description: { block_prefix: "\n  ", color: c("text") },
    html_block:   { color: c("text-faint") },
    html_span:    { color: c("text-faint") },
  };

  // JSON.stringify drops every `undefined`-valued key, so the notty build is
  // exactly this object minus all colour/SGR keys (structure/glyphs remain).
  return JSON.stringify(style, null, 2) + "\n";
}

// ─── Per-component reference docs ───────────────────────────────────
// Generated from each component's .d.ts (summary + typed props), card.html
// (anatomy = the demo-label rows), and .jsx (accessibility comments). Keeps
// component docs single-source: the JSDoc you already write IS the reference.
// A component that lacks a typed, documented .d.ts fails generation — that is
// the "every component is documented" check.
const COMPONENTS_DIR = "components";

function listComponents() {
  return readdirSync(resolve(ROOT, COMPONENTS_DIR), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function cleanJsdoc(block) {
  return block
    .split("\n")
    .map((l) => l.replace(/^\s*\/?\*+\/?/, "").trim())
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSummary(dts) {
  // The JSDoc block immediately before `export declare function` — the inner
  // guard `(?!\*\/)` stops the match from swallowing an earlier prop's doc.
  const m = dts.match(/\/\*\*((?:(?!\*\/)[\s\S])*)\*\/\s*export declare function/);
  return m ? cleanJsdoc(m[1]) : "";
}

function parseInterfaces(dts) {
  const result = [];
  const re = /export interface (\w+)([^{]*)\{([\s\S]*?)\n\}/g;
  let m;
  while ((m = re.exec(dts))) {
    const [, name, ext, body] = m;
    const props = [];
    const propRe = /(?:\/\*\*([\s\S]*?)\*\/\s*)?["']?([A-Za-z_][\w-]*)["']?(\?)?:\s*([^;]+);/g;
    let p;
    while ((p = propRe.exec(body))) {
      const [, doc, pname, opt, type] = p;
      props.push({ name: pname, optional: !!opt, type: type.trim().replace(/\s+/g, " "), doc: doc ? cleanJsdoc(doc) : "" });
    }
    result.push({ name, extends: ext.replace(/\bextends\b/, "").trim(), props });
  }
  return result;
}

function parseAnatomy(card) {
  const labels = [];
  const re = /demo-label"\s*\}\s*,\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(card))) labels.push(m[1].trim());
  return [...new Set(labels)];
}

function parseA11y(jsx) {
  const notes = [];
  for (const line of jsx.split("\n")) {
    const m = line.match(/\/\/\s*(.*)/);
    if (!m) continue;
    if (/aria|ACCESSIBILITY|KEYBOARD|\brole\b|focus|tabindex|WAI|dialog|native/i.test(m[1])) notes.push(m[1].trim());
  }
  return [...new Set(notes)];
}

const mdEscape = (s) => String(s).replace(/\|/g, "\\|");

// ─── docs: tokens.md (human-readable companion to tokens.json) ───────
// GENERATED so the spec can never drift from the source of truth. Prose is
// authored here; every value is read from tokens.json.

function generateTokensMd() {
  const L = [];
  const groupOf = (role) => {
    for (const [, g] of Object.entries(tokens.groups)) {
      if (g.members.includes(role)) return g.label;
    }
    return "";
  };
  const ratio = (fg, bg, mode) =>
    contrastRatio(color(fg, mode), color(bg, mode)).toFixed(2);

  L.push(
    "<!-- GENERATED from tokens.json by scripts/generate.mjs. Do not edit by hand. -->",
    "# Jylhis Design System — Platform Tokens", "",
  );
  L.push(
    "This is the human-readable companion to the canonical token source,",
    "[`tokens.json`](./tokens.json). Every platform-specific file in `platforms/`",
    "derives from `tokens.json` through `scripts/generate.mjs`; when a value",
    "changes, update `tokens.json` first, then regenerate and validate the targets.",
    "",
    "The two editions are **Sheet** (light) and **Field** (dark). `sheet` / `field`",
    "are the identifiers used in generated filenames, Nix options, Go `Mode`",
    "constants, and Emacs theme names.",
    "",
  );

  L.push("## 0. Principles", "");
  L.push(
    "1. **Cool grounds, one bronze accent.** A single desaturated blue-grey ramp carries every surface and every weight of ink. No pure white, no pure black.",
    "2. **AAA for body text, AA for meta, no exceptions.** Ratios are computed from `tokens.json` in the palette table below.",
    "3. **Keyboard is first-class on every surface.** Focus must be visible in 2px at AAA contrast. Shortcuts are always labeled. Selected items share one visual language across web, Emacs, rofi.",
    "4. **Both editions are first-class.** No \"dark mode as an afterthought\" — every platform ships Sheet and Field together.",
    "5. **Structure is not interaction.** `contour` blue draws linework; `accent` bronze is the only interactive colour; `brand` vermilion is the benchmark mark alone.",
    "",
    "---",
    "",
  );

  // ── 1. Core palette ──
  L.push(
    "## 1. Core palette", "",
    "| Role | Group | Sheet | Field | Notes |",
    "|---|---|---|---|---|",
  );
  for (const [role, v] of Object.entries(tokens.palette)) {
    if (!v.light || !v.dark) continue;
    L.push(`| \`${role}\` | ${groupOf(role)} | \`${v.light}\` | \`${v.dark}\` | ${mdEscape(v.notes || "")} |`);
  }
  L.push(
    "",
    "Measured contrast against the page ground (`bg`):", "",
    "| Role | Sheet ratio | Field ratio |",
    "|---|---|---|",
  );
  for (const role of ["text", "text-heading", "text-muted", "text-faint", "accent", "accent-hover", "brand", "contour"]) {
    L.push(`| \`${role}\` | ${ratio(role, "bg", "light")}:1 | ${ratio(role, "bg", "dark")}:1 |`);
  }
  L.push(
    "",
    "`text-faint` is decorative/disabled only — it is not a body-text colour.", "",
  );

  // ── 2. Syntax + status ──
  L.push("## 2. Syntax / semantic family", "");
  L.push(
    "Derived from **Emacs Modus** (Operandi light / Vivendi dark) so highlights are",
    "identical in the editor, in web code blocks, in terminal `bat`/`delta`, and in",
    "Charm TUI renderers. The bronze accent is deliberately **not** a syntax colour",
    "— it is reserved for UI chrome and brand marks, never used for code.",
    "",
  );
  L.push(
    "### Syntax (font-lock)", "",
    "| Role | Modus name | Sheet | Field |",
    "|---|---|---|---|",
  );
  for (const [role, v] of Object.entries(tokens.syntax)) {
    L.push(`| \`${role}\` | ${mdEscape(v.modus || "")} | \`${v.light}\` | \`${v.dark}\` |`);
  }
  L.push(
    "",
    "### Status (project badges, flymake, diff markers, notifications)", "",
    "| Role | Modus accent | ANSI slot | Sheet | Field |",
    "|---|---|---|---|---|",
  );
  for (const [role, v] of Object.entries(tokens.status)) {
    L.push(`| \`${role}\` | ${mdEscape(v.modus || "")} | \`${v.ansi || ""}\` | \`${v.light}\` | \`${v.dark}\` |`);
  }
  L.push(
    "",
    "Status colour never travels alone — every status carries a glyph **and** a word.", "",
  );

  // ── 3. ANSI ──
  L.push("## 3. Terminal 16-color ANSI", "");
  L.push(
    "Light is \"Jylhis Sheet\"; dark is \"Jylhis Field\". Values pull from the Modus",
    "accent family so `ls`, `bat`, `delta`, `git log` and Emacs `ansi-color` share",
    "one palette. ANSI 11 (bright-yellow) is the one intentional brand override —",
    "the bronze accent lands there so terminal warnings, directory permissions and",
    "prompts carry the Jylhis identity.",
    "",
  );
  L.push(
    "| ANSI | Name | Sheet | Field | Role |",
    "|---|---|---|---|---|",
  );
  tokens.ansi.forEach((a, i) => {
    L.push(`| ${i} | ${a.name} | \`${a.light}\` | \`${a.dark}\` | ${mdEscape(a.role || "")} |`);
  });
  L.push(
    "",
    "**Selection bg / cursor:** `selection-bg` / `cursor`.", "",
  );

  // ── 4. Typography ──
  const ty = tokens.typography;
  L.push(
    "## 4. Typography", "",
    "| Role | Family | Fallback |",
    "|---|---|---|",
    `| Display / titles | ${ty.display.family} | ${mdEscape(ty.display.fallback)} |`,
    `| UI / body | ${ty.body.family} | ${mdEscape(ty.body.fallback)} |`,
    `| Data / labels / code | ${ty.mono.family} | ${mdEscape(ty.mono.fallback)} |`,
    `| **TUI / Emacs / terminal fallback** | ${ty.mono.family} | ${mdEscape(ty.tuiFallback)} |`,
    "",
  );
  const steps = Object.values(ty.scale);
  L.push(
    `Size scale: \`${steps.join(" / ")}\` — emitted as \`--type-scale-0…${steps.length - 1}\` in`,
    "`tokens.css`; headings consume the vars so sizes cannot drift. The last step is",
    "the floor — nothing renders smaller.",
    "",
    `Line height: \`${ty.heading.lineHeight}\` for plate titles, \`${ty.body.lineHeight}\` for body, \`${tokens.density.tui.lineHeight}\` for TUI / dense lists.`,
    "",
  );

  // ── 5. Density ──
  L.push("## 5. Density", "");
  const dRows = [
    ["line-height", "lineHeight"],
    ["row-pad-y", "rowPadY"],
    ["hit-target-min", "hitTargetMin"],
    ["gap-inline", "gapInline"],
    ["gap-block", "gapBlock"],
  ];
  L.push(
    "| Token | Web comfortable | Web compact | TUI/Emacs |",
    "|---|---|---|---|",
  );
  for (const [label, key] of dRows) {
    const cell = (m) => (tokens.density[m][key] === undefined ? "n/a" : tokens.density[m][key]);
    L.push(`| \`${label}\` | ${cell("comfortable")} | ${cell("compact")} | ${cell("tui")} |`);
  }
  L.push("");
  L.push(
    "Default: **comfortable** on web, **TUI** in terminal / Emacs. Compact is an",
    "opt-in for data-dense UI (tables, file lists).",
    "",
  );

  // ── 6. Motion ──
  L.push(
    "## 6. Motion", "",
    "Every token is defined in both CSS and Hyprland (named bezier).", "",
    "| Token | Duration | Easing (CSS) | Hypr bezier |",
    "|---|---|---|---|",
  );
  for (const [k, v] of Object.entries(tokens.motion)) {
    L.push(`| \`${k}\` | ${v.duration} | \`${v.css}\` | \`${v.hypr}\` |`);
  }
  L.push("");
  L.push(
    "The signature is \"survey renders in\": `contour-draw`, `line-extend`, `readout`",
    "(see `motion.css`). Motion is *functional* — masking repaint, suggesting",
    "direction — never decorative. Nothing bounces. Reduce-motion respected",
    "everywhere.",
    "",
  );

  // ── 7. Sound ──
  L.push("## 7. Sound / notification vocabulary", "");
  L.push(
    "Three tones only. Mapped to `libcanberra` sound theme names so GNOME/KDE/mako",
    "can pick them up.",
    "",
  );
  L.push(
    "| Token | Sound theme name | Meaning |",
    "|---|---|---|",
  );
  for (const [k, v] of Object.entries(tokens.sound)) {
    L.push(`| \`sound-${k}\` | \`${v.theme}\` | ${mdEscape(v.meaning)} |`);
  }
  L.push(
    "",
    "No continuous / ambient sounds. Default volume: 60%.", "",
  );

  return L.join("\n");
}

function generateComponentDoc(name) {
  const dir = resolve(ROOT, COMPONENTS_DIR, name);
  const dtsPath = join(dir, `${name}.d.ts`);
  if (!existsSync(dtsPath)) {
    throw new Error(`component ${name}: missing ${name}.d.ts — every component must ship a typed, documented sidecar`);
  }
  const dts = readFileSync(dtsPath, "utf8");
  const jsx = existsSync(join(dir, `${name}.jsx`)) ? readFileSync(join(dir, `${name}.jsx`), "utf8") : "";
  const card = existsSync(join(dir, "card.html")) ? readFileSync(join(dir, "card.html"), "utf8") : "";

  const summary = parseSummary(dts);
  const interfaces = parseInterfaces(dts).sort((a, b) =>
    a.name === `${name}Props` ? -1 : b.name === `${name}Props` ? 1 : a.name.localeCompare(b.name),
  );
  if (!summary) throw new Error(`component ${name}: ${name}.d.ts has no summary JSDoc on its exported function`);

  const L = [];
  L.push(`<!-- GENERATED from components/${name}/ by scripts/generate.mjs. Do not edit by hand. -->`);
  L.push(`# ${name}`, "");
  L.push(summary, "");
  L.push("```jsx", `import { ${name} } from "../../components/${name}/${name}.jsx";`, "```", "");
  const anatomy = parseAnatomy(card);
  if (anatomy.length) {
    L.push("## Anatomy", "");
    for (const a of anatomy) L.push(`- ${a}`);
    L.push("");
  }
  for (const iface of interfaces) {
    L.push(`## Props — \`${iface.name}\``, "");
    if (iface.extends) L.push(`Extends \`${mdEscape(iface.extends)}\`.`, "");
    L.push("| prop | type | required | description |", "|------|------|----------|-------------|");
    for (const p of iface.props) {
      L.push(`| \`${p.name}\` | \`${mdEscape(p.type)}\` | ${p.optional ? "" : "yes"} | ${mdEscape(p.doc)} |`);
    }
    L.push("");
  }
  const a11y = parseA11y(jsx);
  if (a11y.length) {
    L.push("## Accessibility", "");
    for (const n of a11y) L.push(`- ${n}`);
    L.push("");
  }
  L.push("## See also", "");
  L.push(`- Specimen: [\`components/${name}/card.html\`](../../components/${name}/card.html)`);
  L.push("- Principles: [`docs/PRINCIPLES.md`](../PRINCIPLES.md) · Accessibility: [`docs/ACCESSIBILITY.md`](ACCESSIBILITY.md)", "");
  return L.join("\n");
}

function generateComponentIndex(names) {
  const L = [];
  L.push("<!-- GENERATED by scripts/generate.mjs. Do not edit by hand. -->");
  L.push("# Component reference", "");
  L.push(`The ${names.length} React components, each generated from its \`.d.ts\` + \`card.html\`. See [\`docs/PRINCIPLES.md\`](../PRINCIPLES.md) for the reasoning behind them.`, "");
  for (const n of names) L.push(`- [${n}](${n}.md)`);
  L.push("");
  return L.join("\n");
}

// ─── Register all outputs ───────────────────────────────────────────

out("tokens.css", generateTokensCSS());
out("platforms/glamour/jylhis-sheet.json", generateGlamour("light"));
out("platforms/glamour/jylhis-field.json", generateGlamour("dark"));
out("platforms/glamour/jylhis-notty.json", generateGlamour(null));
const _componentNames = listComponents();
for (const _name of _componentNames) out(`docs/components/${_name}.md`, generateComponentDoc(_name));
out("docs/components/README.md", generateComponentIndex(_componentNames));
out("platforms/ghostty/jylhis-sheet", generateGhostty("light"));
out("platforms/ghostty/jylhis-field", generateGhostty("dark"));
out("platforms/charm/jylhis/palette.go", generateGoPalette());
out("platforms/hyprland/jylhis-sheet.conf", generateHyprland("light"));
out("platforms/hyprland/jylhis-field.conf", generateHyprland("dark"));
out("platforms/hyprlock/jylhis-sheet.conf", generateHyprlock("light"));
out("platforms/hyprlock/jylhis-field.conf", generateHyprlock("dark"));
out("platforms/kvantum/JylhisSheet.colors", generateKvantum("light"));
out("platforms/kvantum/JylhisField.colors", generateKvantum("dark"));
out("platforms/emacs/jylhis-theme-core.el",     generateEmacsCore());
out("platforms/emacs/jylhis-sheet-palette.el",  generateEmacsPalette("light"));
out("platforms/emacs/jylhis-field-palette.el",  generateEmacsPalette("dark"));
out("platforms/emacs/jylhis-sheet-theme.el",    generateEmacsTheme("light"));
out("platforms/emacs/jylhis-field-theme.el",    generateEmacsTheme("dark"));
out("platforms/rofi/jylhis-sheet.rasi", generateRofi("light"));
out("platforms/rofi/jylhis-field.rasi", generateRofi("dark"));
out("platforms/gtk/gtk.css", generateGTK());
out("platforms/waybar/style.css", generateWaybar("dark"));
out("platforms/waybar/style-sheet.css", generateWaybar("light"));
out("platforms/mako/config", generateMako("dark"));
out("platforms/mako/config-sheet", generateMako("light"));
out("platforms/gimp/jylhis-sheet.gpl", generateGimpPalette("light"));
out("platforms/gimp/jylhis-field.gpl", generateGimpPalette("dark"));
out("platforms/adobe/jylhis-sheet.ase", generateAdobeSwatch("light"));
out("platforms/adobe/jylhis-field.ase", generateAdobeSwatch("dark"));
out("platforms/base16/jylhis-sheet.yaml", generateBase16("light"));
out("platforms/base16/jylhis-field.yaml", generateBase16("dark"));
out("platforms/shell/fzf-sheet.sh", generateFzf("light"));
out("platforms/shell/fzf-field.sh", generateFzf("dark"));
out("platforms/bat/jylhis-sheet.tmTheme", generateTmTheme("light"));
out("platforms/bat/jylhis-field.tmTheme", generateTmTheme("dark"));
out("platforms/console/jylhis-sheet.nix", generateConsole("light"));
out("platforms/console/jylhis-field.nix", generateConsole("dark"));
out("platforms/plymouth/jylhis-sheet/jylhis.plymouth", generatePlymouthManifest("light"));
out("platforms/plymouth/jylhis-sheet/jylhis.script",   generatePlymouthScript("light"));
out("platforms/plymouth/jylhis-field/jylhis.plymouth", generatePlymouthManifest("dark"));
out("platforms/plymouth/jylhis-field/jylhis.script",   generatePlymouthScript("dark"));
out("platforms/hyperos/jylhis-sheet.mtz", generateHyperOS("light"));
out("platforms/hyperos/jylhis-field.mtz", generateHyperOS("dark"));
out("tokens.md", generateTokensMd());
out("tokens-data.js", generateTokensData());

// ─── Write or check ─────────────────────────────────────────────────

const isBinary = (c) => Buffer.isBuffer(c) || c instanceof Uint8Array;

if (checkMode) {
  let diffs = 0;
  for (const [relPath, content] of outputs) {
    const fullPath = resolve(ROOT, relPath);
    if (!existsSync(fullPath)) {
      console.error(`MISSING: ${relPath}`);
      diffs++;
      continue;
    }
    if (isBinary(content)) {
      const existing = readFileSync(fullPath);
      if (Buffer.compare(existing, content) !== 0) {
        console.error(`CHANGED: ${relPath}`);
        diffs++;
      }
    } else {
      const existing = readFileSync(fullPath, "utf8");
      if (existing !== content) {
        console.error(`CHANGED: ${relPath}`);
        diffs++;
      }
    }
  }
  if (diffs > 0) {
    console.error(`\n\u2717 ${diffs} file(s) out of sync with tokens.json. Run: bun scripts/generate.mjs`);
    process.exit(1);
  }
  console.log(`\u2713 ${outputs.size} generated files in sync with tokens.json`);
} else {
  for (const [relPath, content] of outputs) {
    const fullPath = resolve(ROOT, relPath);
    const dir = dirname(fullPath);
    if (!existsSync(dir)) { mkdirSync(dir, { recursive: true }); }
    writeFileSync(fullPath, content);
  }
  console.log(`\u2713 Generated ${outputs.size} files from tokens.json`);
}
