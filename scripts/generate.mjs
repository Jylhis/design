#!/usr/bin/env bun
// Jylhis design system — code generator.
//
// Reads tokens.json (the single source of truth) and generates all
// platform-specific theme files. Run with: bun scripts/generate.mjs
//
// Modes:
//   (default)  — write generated files in-place
//   --check    — generate to temp dir, diff against committed files, exit 1 if different

import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, existsSync } from "node:fs";
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
    lines.push("  /* Borders */");
    for (const r of ["border", "border-strong", "decorator"]) lines.push(`  ${cssName(r)}: ${tokens.palette[r][mode]};`);
    lines.push("  /* Code */");
    lines.push(`  --color-code-bg: ${tokens.palette["bg-subtle"][mode]};`);
    lines.push(`  --color-code-text: ${mode === "light" ? tokens.palette.text.light : "#c8bca8"};`);
    lines.push(`  --color-code-border: ${tokens.palette.border[mode]};`);
    lines.push("  /* Syntax */");
    for (const r of Object.keys(tokens.syntax)) lines.push(`  ${cssName(r)}: ${tokens.syntax[r][mode]};`);
    lines.push(`  --color-syntax-tag: ${tokens.syntax["syn-type"][mode]};`);
    lines.push("  /* Status */");
    for (const r of Object.keys(tokens.status)) lines.push(`  ${cssName(r)}: ${tokens.status[r][mode]};`);
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

  const transitionVars = Object.entries(tokens.motion)
    .map(([k, v]) => `  --transition-${k}: ${v.duration} ${v.css};`)
    .join("\n");

  // Accent-subtle rgba values (derived, not in tokens.json as they use opacity)
  const accentSubtleLight = "rgba(154, 90, 42, 0.12)";
  const accentSubtleDark = "rgba(232, 155, 94, 0.15)";

  return `/*
 * tokens.css — GENERATED from tokens.json. Do not edit by hand.
 * Jylhis Design System color and spacing tokens.
 */

/* Light theme (default) */
:root {
${varBlock("light")}
  --color-accent-subtle: ${accentSubtleLight};
  /* Spacing */
${spacingVars}
  /* Layout */
${layoutVars}
  /* Radii */
${radiiVars}
  /* Transitions */
${transitionVars}
}

/* Dark theme */
[data-theme="dark"] {
${varBlock("dark")}
  --color-accent-subtle: ${accentSubtleDark};
}
`;
}

// ─── 2. Ghostty themes ───────────────────────────────────────────────

function generateGhostty(mode) {
  const label = mode === "light" ? "Paper" : "Roast";
  const themeName = mode === "light" ? "jylhis-paper" : "jylhis-roast";
  const modus = mode === "light" ? "Operandi" : "Vivendi";

  const lines = [
    `# Jylhis ${label} (${mode}) — Ghostty colorscheme`,
    `# Drop in ~/.config/ghostty/themes/${themeName} and reference with`,
    `# \`theme = ${themeName}\` in config.`,
    "#",
    `# ANSI 0\u20136 are Modus ${modus} accents so \`ls\`, \`bat\`, \`delta\`, \`git log\``,
    "# share the editor's palette. ANSI 11 is the brand copper \u2014 intentional",
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
    const varName = mode === "light" ? "paper" : "roast";
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
//\tt := jylhis.NewTheme(jylhis.Paper) // or jylhis.Roast
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

// Mode selects the light (Paper) or dark (Roast) variant.
type Mode int

const (
\tPaper Mode = iota // light \u2014 warm cream, copper accent
\tRoast             // dark  \u2014 dark roast, copper accent
)

// Palette is the raw Jylhis palette for one mode.
// Values are hex strings; convert to lipgloss.Color with lipgloss.Color(p.Accent).
type Palette struct {
\t// Surfaces
\tBg, BgSubtle, Surface, SurfaceRaised string
\t// Text
\tText, TextMuted, TextHeading, TextFaint string
\t// Accent family \u2014 copper
\tAccent, AccentHover, Brand string
\t// Structure
\tBorder, BorderStrong, Decorator string
\t// Syntax \u2014 Emacs Modus (Operandi for Paper, Vivendi for Roast).
\t// Uniform with the CSS vars and the Emacs themes.
\tSynKeyword, SynString, SynNumber, SynFunction, SynType, SynBuiltin,
\tSynVariable, SynTag, SynComment, SynDocstring string
\t// Status \u2014 Modus red/yellow/green/blue accents.
\tStatusErr, StatusWarn, StatusOk, StatusInfo string
\t// ANSI 16 (for tables, sparklines, anything that needs raw palette access)
\tANSI [16]string
}

// paper is the canonical light palette. Hex values are the single source of truth.
// When they change, update tokens.json first, then run: bun scripts/generate.mjs
${paletteStruct("light")}

${paletteStruct("dark")}

// PaletteFor returns the raw palette for a mode.
func PaletteFor(m Mode) Palette {
\tif m == Roast {
\t\treturn roast
\t}
\treturn paper
}

// C is a convenience wrapper: lipgloss color from a hex string in the palette.
func C(hex string) color.Color { return lipgloss.Color(hex) }
`;
}

// ─── 4. Hyprland color configs ──────────────────────────────────────

function generateHyprland(mode) {
  const label = mode === "light" ? "Paper" : "Roast";

  const hex = (role) => color(role, mode).slice(1); // strip #

  if (mode === "light") {
    return `# Jylhis Paper (light) border colors for Hyprland
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
    background_color = 0x${hex("bg")}            # paper
}
`;
  } else {
    return `# Jylhis Roast (dark) border colors for Hyprland
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
    background_color = 0x${hex("bg")}            # roast
}
`;
  }
}

// ─── 5. Kvantum color palettes ──────────────────────────────────────

function generateKvantum(mode) {
  const label = mode === "light" ? "Paper" : "Roast";
  const themeName = mode === "light" ? "JylhisPaper" : "JylhisRoast";

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

  <!-- Inactive (unfocused) \u2014 same color, matches flat paper metaphor -->
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

// ─── 6. Emacs themes (template-based) ───────────────────────────────

function generateEmacs(mode) {
  const themeName = mode === "light" ? "jylhis-paper" : "jylhis-roast";
  const label = mode === "light" ? "light" : "dark";
  const desc = mode === "light"
    ? "Jylhis \u2014 light theme. Copper accent on warm paper, Modus-derived syntax tuned for paper."
    : "Jylhis \u2014 dark theme. Copper accent on warm roast, Modus-derived syntax tuned for roast.";
  const commentary = mode === "light"
    ? 'Light "paper" variant'
    : 'Dark "roast" variant';
  const modus = mode === "light" ? "Operandi" : "Vivendi";
  const sibling = mode === "light" ? "jylhis-roast-theme.el" : "jylhis-paper-theme.el";
  const otherTheme = mode === "light" ? "jylhis-roast" : "jylhis-paper";

  const c = (role) => color(role, mode);
  // accent-subtle is a derived opaque color for Emacs (no rgba in elisp faces)
  const accentSubtle = mode === "light" ? "#f0e2d1" : "#3a2c20";

  const ansiBlock = tokens.ansi.map((a, i) => {
    const name = `ansi-color-${a.name}`;
    const hex = a[mode];
    return `   \`(${name.padEnd(30)} ((,class :foreground "${hex}" :background "${hex}")))`;
  }).join("\n");

  const ansiVector = tokens.ansi.slice(0, 8).map(a => `"${a[mode]}"`);
  const ansiVectorStr = `["${tokens.ansi[0][mode]}" "${tokens.ansi[1][mode]}" "${tokens.ansi[2][mode]}" "${tokens.ansi[3][mode]}"\n    "${tokens.ansi[4][mode]}" "${tokens.ansi[5][mode]}" "${tokens.ansi[6][mode]}" "${tokens.ansi[7][mode]}"]`;

  return `;;; ${themeName}-theme.el --- Jylhis ${label} theme  -*- lexical-binding: t; -*-
;;
;; GENERATED from tokens.json. Do not edit by hand.
;; Run: bun scripts/generate.mjs
;;
;; Author:      Markus Jylh\u00e4nkangas
;; Homepage:    https://jylhis.com
;; Keywords:    faces, theme
;; Package-Requires: ((emacs "28.1"))
;;
;;; Commentary:
;;
;;  ${commentary} of the Jylhis design system for Emacs.
;;  Modus-style semantic face targeting \u2014 see tokens.md \u00a72 for the source-of-truth
;;  palette and platforms/KEYBOARD.md for the shared primitives (focus, kbd,
;;  selected-item language).  A sibling \`${sibling}\` ships the ${mode === "light" ? "dark" : "light"}
;;  variant; both reuse the same semantic face map below.
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

(deftheme ${themeName}
  "${desc}")

(let ((class '((class color) (min-colors 256)))

      ;; \u2500\u2500 Core palette (tokens.json, ${mode} column) \u2500\u2500
      (bg            "${c("bg")}")
      (bg-subtle     "${c("bg-subtle")}")
      (surface       "${c("surface")}")
      (surface-raised "${c("surface-raised")}")
      (fg            "${c("text")}")
      (fg-muted      "${c("text-muted")}")
      (fg-heading    "${c("text-heading")}")
      (fg-faint      "${c("text-faint")}")
      (accent        "${c("accent")}")
      (accent-hover  "${c("accent-hover")}")
      (accent-subtle "${accentSubtle}")
      (brand         "${c("brand")}")
      (border        "${c("border")}")
      (border-strong "${c("border-strong")}")
      (decorator     "${c("decorator")}")

      ;; \u2500\u2500 Syntax / semantic \u2014 Modus role taxonomy, tuned for ${mode === "light" ? "paper" : "roast"} (tokens.json) \u2500\u2500
      (syn-keyword   "${tokens.syntax["syn-keyword"][mode]}") ; from magenta-cooler
      (syn-string    "${tokens.syntax["syn-string"][mode]}") ; from blue-cooler
      (syn-number    "${tokens.syntax["syn-number"][mode]}") ; from blue-warmer (constants/numbers)
      (syn-function  "${tokens.syntax["syn-function"][mode]}") ; from magenta
      (syn-builtin   "${tokens.syntax["syn-builtin"][mode]}") ; from magenta-warmer
      (syn-type      "${tokens.syntax["syn-type"][mode]}") ; from cyan-cooler
      (syn-variable  "${tokens.syntax["syn-variable"][mode]}") ; from cyan
      (syn-tag       "${tokens.syntax["syn-type"][mode]}") ; alias of type
      (syn-comment   "${tokens.syntax["syn-comment"][mode]}") ; from red-faint
      (syn-docstring "${tokens.syntax["syn-docstring"][mode]}") ; from green-faint
      ;; Semantic status \u2014 Modus red/yellow/green/blue accents
      (err  "${tokens.status["status-err"][mode]}")
      (warn "${tokens.status["status-warn"][mode]}")
      (ok   "${tokens.status["status-ok"][mode]}")
      (info "${tokens.status["status-info"][mode]}"))

  (custom-theme-set-faces
   '${themeName}

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Frame / base
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(default             ((,class :background ,bg :foreground ,fg)))
   \`(cursor              ((,class :background ,accent)))
   \`(fringe              ((,class :background ,bg)))
   \`(vertical-border     ((,class :foreground ,border)))
   \`(window-divider      ((,class :foreground ,border)))
   \`(window-divider-first-pixel  ((,class :foreground ,border)))
   \`(window-divider-last-pixel   ((,class :foreground ,border)))
   \`(shadow              ((,class :foreground ,fg-faint)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Text emphasis
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(bold                ((,class :weight bold :foreground ,fg-heading)))
   \`(italic              ((,class :slant italic)))
   \`(underline           ((,class :underline (:color ,fg-muted))))
   \`(link                ((,class :foreground ,accent :underline (:color ,accent))))
   \`(link-visited        ((,class :foreground ,syn-number :underline (:color ,syn-number))))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Selection + region  (KEYBOARD.md primitives)
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(region              ((,class :background ,accent-subtle :extend t)))
   \`(secondary-selection ((,class :background ,surface :extend t)))
   \`(highlight           ((,class :background ,surface-raised :extend t)))
   \`(hl-line             ((,class :background ,bg-subtle :extend t)))
   \`(match               ((,class :background ,accent-subtle :foreground ,accent :weight bold)))
   \`(isearch             ((,class :background ,accent :foreground ,bg :weight bold)))
   \`(isearch-fail        ((,class :background ,err :foreground ,bg)))
   \`(lazy-highlight      ((,class :background ,accent-subtle :foreground ,fg)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Mode line
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(mode-line
     ((,class :background ,surface :foreground ,fg
              :box (:line-width 3 :color ,surface))))
   \`(mode-line-inactive
     ((,class :background ,bg-subtle :foreground ,fg-muted
              :box (:line-width 3 :color ,bg-subtle))))
   \`(mode-line-highlight ((,class :foreground ,accent :background ,surface-raised)))
   \`(mode-line-emphasis  ((,class :foreground ,accent :weight bold)))
   \`(mode-line-buffer-id ((,class :foreground ,fg-heading :weight bold)))

   ;; doom-modeline
   \`(doom-modeline-bar              ((,class :background ,accent)))
   \`(doom-modeline-bar-inactive     ((,class :background ,surface)))
   \`(doom-modeline-buffer-file      ((,class :foreground ,fg-heading :weight bold)))
   \`(doom-modeline-buffer-modified  ((,class :foreground ,warn :weight bold)))
   \`(doom-modeline-buffer-major-mode ((,class :foreground ,syn-tag :weight bold)))
   \`(doom-modeline-project-dir      ((,class :foreground ,fg-muted)))
   \`(doom-modeline-info             ((,class :foreground ,ok)))
   \`(doom-modeline-warning          ((,class :foreground ,warn)))
   \`(doom-modeline-urgent           ((,class :foreground ,err)))
   \`(doom-modeline-lsp-success      ((,class :foreground ,ok)))
   \`(doom-modeline-lsp-warning      ((,class :foreground ,warn)))
   \`(doom-modeline-lsp-error        ((,class :foreground ,err)))

   ;; Header-line = the "second toolbar". Kept quiet.
   \`(header-line          ((,class :background ,bg-subtle :foreground ,fg-muted
                                   :box (:line-width 3 :color ,bg-subtle))))

   ;; Tab-bar / tab-line \u2014 selected tab uses the canonical language
   \`(tab-bar              ((,class :background ,bg-subtle :foreground ,fg-muted)))
   \`(tab-bar-tab          ((,class :background ,surface :foreground ,fg
                                   :box (:line-width 3 :color ,surface)
                                   :weight bold)))
   \`(tab-bar-tab-inactive ((,class :background ,bg-subtle :foreground ,fg-muted
                                   :box (:line-width 3 :color ,bg-subtle))))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Minibuffer / echo area
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(minibuffer-prompt    ((,class :foreground ,accent :weight bold)))
   \`(error                ((,class :foreground ,err   :weight bold)))
   \`(warning              ((,class :foreground ,warn  :weight bold)))
   \`(success              ((,class :foreground ,ok    :weight bold)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Font-lock  (semantic face mapping tokens.json)
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(font-lock-builtin-face          ((,class :foreground ,syn-builtin)))
   \`(font-lock-comment-face          ((,class :foreground ,syn-comment :slant italic)))
   \`(font-lock-comment-delimiter-face ((,class :foreground ,syn-comment)))
   \`(font-lock-constant-face         ((,class :foreground ,syn-number)))
   \`(font-lock-doc-face              ((,class :foreground ,syn-docstring :slant italic)))
   \`(font-lock-function-name-face    ((,class :foreground ,syn-function :weight bold)))
   \`(font-lock-keyword-face          ((,class :foreground ,syn-keyword :weight bold)))
   \`(font-lock-negation-char-face    ((,class :foreground ,err)))
   \`(font-lock-preprocessor-face     ((,class :foreground ,syn-builtin)))
   \`(font-lock-regexp-grouping-backslash ((,class :foreground ,syn-function :weight bold)))
   \`(font-lock-regexp-grouping-construct ((,class :foreground ,syn-keyword :weight bold)))
   \`(font-lock-string-face           ((,class :foreground ,syn-string)))
   \`(font-lock-type-face             ((,class :foreground ,syn-type)))
   \`(font-lock-variable-name-face    ((,class :foreground ,syn-variable)))
   \`(font-lock-warning-face          ((,class :foreground ,warn :weight bold)))

   ;; Tree-sitter richer faces (Emacs 29+)
   \`(font-lock-bracket-face          ((,class :foreground ,fg-muted)))
   \`(font-lock-delimiter-face        ((,class :foreground ,fg-muted)))
   \`(font-lock-escape-face           ((,class :foreground ,syn-function)))
   \`(font-lock-misc-punctuation-face ((,class :foreground ,fg-muted)))
   \`(font-lock-number-face           ((,class :foreground ,syn-number)))
   \`(font-lock-operator-face         ((,class :foreground ,syn-keyword)))
   \`(font-lock-property-name-face    ((,class :foreground ,syn-tag)))
   \`(font-lock-property-use-face     ((,class :foreground ,syn-tag)))
   \`(font-lock-punctuation-face      ((,class :foreground ,fg-muted)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Line numbers
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(line-number              ((,class :background ,bg :foreground ,fg-faint)))
   \`(line-number-current-line ((,class :background ,bg-subtle :foreground ,accent :weight bold)))
   \`(line-number-major-tick   ((,class :foreground ,fg-muted)))
   \`(line-number-minor-tick   ((,class :foreground ,fg-faint)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Parens / structure
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(show-paren-match         ((,class :background ,accent-subtle :foreground ,accent :weight bold)))
   \`(show-paren-mismatch      ((,class :background ,err :foreground ,bg :weight bold)))

   ;; rainbow-delimiters
   \`(rainbow-delimiters-depth-1-face ((,class :foreground ,syn-keyword)))
   \`(rainbow-delimiters-depth-2-face ((,class :foreground ,syn-string)))
   \`(rainbow-delimiters-depth-3-face ((,class :foreground ,syn-tag)))
   \`(rainbow-delimiters-depth-4-face ((,class :foreground ,syn-number)))
   \`(rainbow-delimiters-depth-5-face ((,class :foreground ,syn-function)))
   \`(rainbow-delimiters-depth-6-face ((,class :foreground ,accent)))
   \`(rainbow-delimiters-depth-7-face ((,class :foreground ,fg-muted)))
   \`(rainbow-delimiters-unmatched-face ((,class :foreground ,err :weight bold)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Vertico / Consult / Marginalia / Corfu / Orderless
   ;; \u2014 this IS the command palette (KEYBOARD.md \u00a7"Command palette")
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(vertico-current        ((,class :background ,accent-subtle
                                     :foreground ,fg :extend t
                                     :weight normal)))
   \`(vertico-group-title    ((,class :foreground ,fg-faint :slant italic)))
   \`(vertico-group-separator ((,class :foreground ,decorator :strike-through t)))

   \`(marginalia-key          ((,class :foreground ,accent :weight bold)))
   \`(marginalia-documentation ((,class :foreground ,fg-muted :slant italic)))
   \`(marginalia-date         ((,class :foreground ,syn-number)))
   \`(marginalia-file-name    ((,class :foreground ,fg)))
   \`(marginalia-size         ((,class :foreground ,fg-muted)))
   \`(marginalia-mode         ((,class :foreground ,syn-tag)))
   \`(marginalia-function     ((,class :foreground ,syn-function)))
   \`(marginalia-type         ((,class :foreground ,syn-tag)))
   \`(marginalia-null         ((,class :foreground ,fg-faint)))
   \`(marginalia-value        ((,class :foreground ,fg)))

   \`(consult-file           ((,class :foreground ,fg)))
   \`(consult-bookmark       ((,class :foreground ,syn-number)))
   \`(consult-line-number    ((,class :foreground ,fg-faint)))
   \`(consult-preview-line   ((,class :background ,bg-subtle :extend t)))
   \`(consult-preview-match  ((,class :background ,accent-subtle :foreground ,accent)))

   \`(orderless-match-face-0  ((,class :foreground ,accent :weight bold)))
   \`(orderless-match-face-1  ((,class :foreground ,syn-string :weight bold)))
   \`(orderless-match-face-2  ((,class :foreground ,syn-tag :weight bold)))
   \`(orderless-match-face-3  ((,class :foreground ,syn-number :weight bold)))

   \`(corfu-default           ((,class :background ,surface-raised :foreground ,fg)))
   \`(corfu-current           ((,class :background ,accent-subtle :foreground ,fg)))
   \`(corfu-border            ((,class :background ,border-strong)))
   \`(corfu-bar               ((,class :background ,accent)))
   \`(corfu-echo              ((,class :foreground ,fg-muted :slant italic)))

   ;; Eldoc / tooltip
   \`(eldoc-highlight-function-argument ((,class :foreground ,accent :weight bold)))
   \`(tooltip                 ((,class :background ,surface-raised :foreground ,fg
                                      :inherit variable-pitch)))

   ;; which-key \u2014 the leader cheatsheet (KEYBOARD.md \u00a7"Leader key cheatsheet")
   \`(which-key-key-face        ((,class :foreground ,accent :weight bold)))
   \`(which-key-group-description-face ((,class :foreground ,syn-tag)))
   \`(which-key-command-description-face ((,class :foreground ,fg)))
   \`(which-key-local-map-description-face ((,class :foreground ,syn-string)))
   \`(which-key-separator-face  ((,class :foreground ,decorator)))
   \`(which-key-note-face       ((,class :foreground ,fg-faint)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Org
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(org-level-1    ((,class :foreground ,accent       :weight bold :height 1.4)))
   \`(org-level-2    ((,class :foreground ,syn-tag      :weight bold :height 1.2)))
   \`(org-level-3    ((,class :foreground ,syn-string   :weight bold :height 1.1)))
   \`(org-level-4    ((,class :foreground ,syn-number   :weight bold)))
   \`(org-level-5    ((,class :foreground ,syn-function :weight bold)))
   \`(org-level-6    ((,class :foreground ,syn-keyword)))
   \`(org-level-7    ((,class :foreground ,fg-muted)))
   \`(org-level-8    ((,class :foreground ,fg-faint)))

   \`(org-document-title      ((,class :foreground ,fg-heading :weight bold :height 1.6)))
   \`(org-document-info       ((,class :foreground ,fg-muted)))
   \`(org-document-info-keyword ((,class :foreground ,fg-faint)))
   \`(org-meta-line           ((,class :foreground ,fg-faint :slant italic)))
   \`(org-drawer              ((,class :foreground ,fg-faint)))
   \`(org-special-keyword     ((,class :foreground ,syn-tag)))

   \`(org-todo                ((,class :foreground ,warn :weight bold :box (:line-width 1 :color ,warn))))
   \`(org-done                ((,class :foreground ,ok :weight bold :box (:line-width 1 :color ,ok))))
   \`(org-headline-done       ((,class :foreground ,fg-muted :strike-through nil)))

   \`(org-date                ((,class :foreground ,syn-number :underline nil)))
   \`(org-tag                 ((,class :foreground ,fg-muted :weight normal)))
   \`(org-priority            ((,class :foreground ,accent :weight bold)))

   \`(org-block               ((,class :background ,bg-subtle :extend t)))
   \`(org-block-begin-line    ((,class :background ,bg-subtle :foreground ,fg-faint :extend t)))
   \`(org-block-end-line      ((,class :background ,bg-subtle :foreground ,fg-faint :extend t)))
   \`(org-code                ((,class :foreground ,syn-string :background ,bg-subtle)))
   \`(org-verbatim            ((,class :foreground ,syn-string)))
   \`(org-quote               ((,class :foreground ,fg-muted :slant italic)))

   \`(org-table               ((,class :foreground ,fg :background ,bg-subtle)))
   \`(org-table-header        ((,class :foreground ,fg-heading :background ,surface :weight bold)))

   \`(org-link                ((,class :inherit link)))
   \`(org-footnote            ((,class :foreground ,syn-number :underline t)))
   \`(org-ellipsis            ((,class :foreground ,fg-faint :underline nil)))
   \`(org-hide                ((,class :foreground ,bg)))

   ;; org-modern helpers
   \`(org-modern-tag          ((,class :foreground ,bg :background ,syn-tag :weight bold)))
   \`(org-modern-date-active  ((,class :foreground ,bg :background ,accent :weight bold)))

   ;; Agenda
   \`(org-agenda-structure    ((,class :foreground ,accent :weight bold)))
   \`(org-agenda-date         ((,class :foreground ,syn-tag :weight bold)))
   \`(org-agenda-date-today   ((,class :foreground ,accent :weight bold :underline t)))
   \`(org-agenda-date-weekend ((,class :foreground ,fg-muted)))
   \`(org-scheduled           ((,class :foreground ,syn-string)))
   \`(org-scheduled-today     ((,class :foreground ,ok :weight bold)))
   \`(org-scheduled-previously ((,class :foreground ,warn)))
   \`(org-upcoming-deadline   ((,class :foreground ,warn)))
   \`(org-warning             ((,class :foreground ,warn :weight bold)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Dired
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(dired-directory         ((,class :foreground ,syn-tag :weight bold)))
   \`(dired-symlink           ((,class :foreground ,info)))
   \`(dired-broken-symlink    ((,class :foreground ,err :strike-through t)))
   \`(dired-header            ((,class :foreground ,accent :weight bold)))
   \`(dired-mark              ((,class :foreground ,accent)))
   \`(dired-marked            ((,class :background ,accent-subtle :foreground ,accent :weight bold)))
   \`(dired-perm-write        ((,class :foreground ,warn)))
   \`(dired-flagged           ((,class :foreground ,err :weight bold)))
   \`(dired-ignored           ((,class :foreground ,fg-faint)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Magit / diff
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(diff-added              ((,class :background ,bg-subtle :foreground ,ok)))
   \`(diff-removed            ((,class :background ,bg-subtle :foreground ,err)))
   \`(diff-context            ((,class :foreground ,fg-muted)))
   \`(diff-hunk-header        ((,class :background ,surface :foreground ,fg-heading :weight bold)))
   \`(diff-file-header        ((,class :background ,surface :foreground ,accent :weight bold)))
   \`(diff-refine-added       ((,class :background ,accent-subtle :foreground ,ok :weight bold)))
   \`(diff-refine-removed     ((,class :background ,accent-subtle :foreground ,err :weight bold)))

   \`(magit-section-heading           ((,class :foreground ,accent :weight bold)))
   \`(magit-section-highlight         ((,class :background ,bg-subtle :extend t)))
   \`(magit-branch-local              ((,class :foreground ,syn-tag :weight bold)))
   \`(magit-branch-remote             ((,class :foreground ,syn-string :weight bold)))
   \`(magit-branch-current            ((,class :foreground ,accent :weight bold
                                              :box (:line-width 1 :color ,accent))))
   \`(magit-tag                       ((,class :foreground ,syn-number)))
   \`(magit-hash                      ((,class :foreground ,fg-faint)))
   \`(magit-log-author                ((,class :foreground ,syn-function)))
   \`(magit-log-date                  ((,class :foreground ,fg-faint)))
   \`(magit-diff-added                ((,class :background ,bg-subtle :foreground ,ok)))
   \`(magit-diff-added-highlight      ((,class :background ,surface :foreground ,ok)))
   \`(magit-diff-removed              ((,class :background ,bg-subtle :foreground ,err)))
   \`(magit-diff-removed-highlight    ((,class :background ,surface :foreground ,err)))
   \`(magit-diff-context              ((,class :foreground ,fg-muted)))
   \`(magit-diff-context-highlight    ((,class :background ,bg-subtle :foreground ,fg)))
   \`(magit-diff-hunk-heading         ((,class :background ,surface :foreground ,fg-heading)))
   \`(magit-diff-hunk-heading-highlight ((,class :background ,surface-raised :foreground ,fg-heading :weight bold)))
   \`(magit-diffstat-added            ((,class :foreground ,ok)))
   \`(magit-diffstat-removed          ((,class :foreground ,err)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Flymake / Flycheck
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(flymake-error           ((,class :underline (:style wave :color ,err))))
   \`(flymake-warning         ((,class :underline (:style wave :color ,warn))))
   \`(flymake-note            ((,class :underline (:style wave :color ,info))))
   \`(flycheck-error          ((,class :underline (:style wave :color ,err))))
   \`(flycheck-warning        ((,class :underline (:style wave :color ,warn))))
   \`(flycheck-info           ((,class :underline (:style wave :color ,info))))
   \`(compilation-error       ((,class :foreground ,err :weight bold)))
   \`(compilation-warning     ((,class :foreground ,warn :weight bold)))
   \`(compilation-info        ((,class :foreground ,info)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Company + Eglot
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(company-tooltip                      ((,class :background ,surface-raised :foreground ,fg)))
   \`(company-tooltip-selection            ((,class :background ,accent-subtle :foreground ,fg)))
   \`(company-tooltip-common               ((,class :foreground ,accent :weight bold)))
   \`(company-tooltip-annotation           ((,class :foreground ,fg-muted)))
   \`(company-scrollbar-bg                 ((,class :background ,surface)))
   \`(company-scrollbar-fg                 ((,class :background ,border-strong)))

   \`(eglot-highlight-symbol-face          ((,class :background ,surface :weight bold)))
   \`(eglot-mode-line                      ((,class :foreground ,accent)))
   \`(eglot-diagnostic-tag-deprecated-face ((,class :strike-through t :foreground ,fg-faint)))

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Terminal (vterm / ansi-term)  \u2014 tokens.json ANSI palette
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
${ansiBlock}

   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   ;; Misc
   ;; \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   \`(trailing-whitespace       ((,class :background ,err)))
   \`(whitespace-tab            ((,class :foreground ,fg-faint)))
   \`(whitespace-space          ((,class :foreground ,fg-faint)))
   \`(whitespace-newline        ((,class :foreground ,fg-faint)))
   \`(whitespace-indentation    ((,class :foreground ,fg-faint)))
   \`(whitespace-line           ((,class :background ,bg-subtle)))
   \`(whitespace-trailing       ((,class :background ,err)))

   \`(hi-yellow                 ((,class :background ,warn :foreground ,bg)))
   \`(hi-pink                   ((,class :background ,syn-number :foreground ,bg)))
   \`(hi-green                  ((,class :background ,ok :foreground ,bg)))

   ;; tab-line / centaur-tabs
   \`(tab-line-tab-current      ((,class :background ,surface :foreground ,accent :weight bold)))
   \`(tab-line-tab              ((,class :background ,bg-subtle :foreground ,fg-muted)))

   ;; hl-todo
   \`(hl-todo                   ((,class :foreground ,warn :weight bold)))

   ;; indent-bars
   \`(indent-bars-face          ((,class :foreground ,fg-faint)))))

(custom-theme-set-variables
 '${themeName}
 '(ansi-color-names-vector
   ${ansiVectorStr})
 '(ansi-color-faces-vector
   [default default default italic underline success warning error])
 '(hl-todo-keyword-faces
   '(("FIXME"      . "${tokens.status["status-err"][mode]}")
     ("BUG"        . "${tokens.status["status-err"][mode]}")
     ("TODO"       . "${tokens.status["status-warn"][mode]}")
     ("HACK"       . "${tokens.status["status-warn"][mode]}")
     ("NOTE"       . "${tokens.status["status-info"][mode]}")
     ("REVIEW"     . "${tokens.status["status-info"][mode]}")
     ("DEPRECATED" . "${c("text-faint")}"))))

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

// ─── 7. Rofi themes ─────────────────────────────────────────────────

function generateRofi(mode) {
  const label = mode === "light" ? "paper" : "roast";
  const c = (role) => color(role, mode);
  const iconTheme = mode === "light" ? "Papirus" : "Papirus-Dark";
  // accent-subtle for rofi (opaque, not rgba)
  const accentSubtle = mode === "light" ? "#f0dcc4" : "#3a2c20";
  const textFaint = mode === "light" ? "#8a7f72" : "#6b6157";

  const commentHeader = mode === "light"
    ? `/* Jylhis Rofi \u2014 light variant (paper). GENERATED from tokens.json. */`
    : `/*\n * Jylhis Rofi \u2014 dark variant (roast). GENERATED from tokens.json.\n * This is THE command palette visual language \u2014 identical DNA to web Cmd+K\n * and Emacs M-x/Vertico. See platforms/KEYBOARD.md \u00a7"Command palette".\n */`;

  return `${commentHeader}

configuration {
    modi:         "drun,combi,run,window";
    font:         "JetBrains Mono 11";
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
textbox { text-color: @text-muted; font: "JetBrains Mono 9"; }

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
    font:             "JetBrains Mono 9";
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
 *   gsettings set org.gnome.desktop.interface font-name 'Literata 11'
 *   gsettings set org.gnome.desktop.interface monospace-font-name 'JetBrains Mono 10'
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
// Waybar is hardcoded dark (roast) in the original. We generate it the same way.

function generateWaybar(mode = "dark") {
  const c = (role) => color(role, mode);
  const synType = tokens.syntax["syn-type"][mode];

  const label = mode === "light" ? "Paper" : "Roast";
  const modus = mode === "light" ? "Operandi" : "Vivendi";

  return `/* Jylhis Waybar ${label} — GENERATED from tokens.json. Do not edit by hand.
 * ~/.config/waybar/style.css
 * ${label} background, copper accent, monospace. Top bar.
 *
 * Tokens referenced: tokens.json palette, typography, density
 */

* {
    font-family: "JetBrains Mono", "JetBrains Mono", monospace;
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
#cpu,
#memory,
#tray,
#custom-notifications,
#custom-nix {
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

/* Network / audio */
#network.disconnected,
#pulseaudio.muted {
    color: ${c("text-faint")};
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
# monospace meta, paper/roast bg. Dismiss hint always visible.

font=JetBrains Mono 11
width=380
height=120
margin=12
padding=14,16
border-size=1
border-radius=4
max-icon-size=32
icon-path=/usr/share/icons/Adwaita

# Default \u2014 ${mode === "light" ? "paper" : "roast"}
background-color=${c("surface")}
text-color=${c("text")}
border-color=${c("border-strong")}
progress-color=over ${c("accent")}

# Layout / animation
layer=overlay
anchor=top-right
default-timeout=6000
ignore-timeout=0

format=<b>%s</b>\\n%b\\n<span foreground='${c("text-faint")}' font='JetBrains Mono 9'>esc to dismiss \u00b7 meta+n to focus</span>

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
    ...tokens.groups.copper.members,
    ...tokens.groups.signal.members,
  ];
  const bgRoles = tokens.groups.paperstock.members;

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
  const label = mode === "light" ? "Paper" : "Roast";
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
  const label = mode === "light" ? "Jylhis Paper" : "Jylhis Roast";
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

  const lines = [
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
  const label = mode === "light" ? "paper" : "roast";
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
  const label = mode === "light" ? "Jylhis Paper" : "Jylhis Roast";
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

// ─── Register all outputs ───────────────────────────────────────────

out("tokens.css", generateTokensCSS());
out("platforms/ghostty/jylhis-paper", generateGhostty("light"));
out("platforms/ghostty/jylhis-roast", generateGhostty("dark"));
out("platforms/charm/jylhis/palette.go", generateGoPalette());
out("platforms/hyprland/jylhis-paper.conf", generateHyprland("light"));
out("platforms/hyprland/jylhis-roast.conf", generateHyprland("dark"));
out("platforms/kvantum/JylhisPaper.colors", generateKvantum("light"));
out("platforms/kvantum/JylhisRoast.colors", generateKvantum("dark"));
out("platforms/emacs/jylhis-paper-theme.el", generateEmacs("light"));
out("platforms/emacs/jylhis-roast-theme.el", generateEmacs("dark"));
out("platforms/rofi/jylhis-paper.rasi", generateRofi("light"));
out("platforms/rofi/jylhis-roast.rasi", generateRofi("dark"));
out("platforms/gtk/gtk.css", generateGTK());
out("platforms/waybar/style.css", generateWaybar("dark"));
out("platforms/waybar/style-paper.css", generateWaybar("light"));
out("platforms/mako/config", generateMako("dark"));
out("platforms/mako/config-paper", generateMako("light"));
out("platforms/gimp/jylhis-paper.gpl", generateGimpPalette("light"));
out("platforms/gimp/jylhis-roast.gpl", generateGimpPalette("dark"));
out("platforms/adobe/jylhis-paper.ase", generateAdobeSwatch("light"));
out("platforms/adobe/jylhis-roast.ase", generateAdobeSwatch("dark"));
out("platforms/base16/jylhis-paper.yaml", generateBase16("light"));
out("platforms/base16/jylhis-roast.yaml", generateBase16("dark"));
out("platforms/shell/fzf-paper.sh", generateFzf("light"));
out("platforms/shell/fzf-roast.sh", generateFzf("dark"));
out("platforms/bat/jylhis-paper.tmTheme", generateTmTheme("light"));
out("platforms/bat/jylhis-roast.tmTheme", generateTmTheme("dark"));
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
