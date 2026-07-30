#!/usr/bin/env bun
// Jylhis design system — text-resizing validator.
//
// Enforces the commitments in docs/ACCESSIBILITY.md § Text resizing & reflow:
// text must answer to the reader's browser font-size setting, and nothing a
// user reads may render below the floors declared in
// tokens.json#typography.scaling.
//
// Checked surfaces are the ones the system ships as its own: hand-authored
// stylesheets, the showcase pages, and every preview/component specimen.
// Deliberately out of scope:
//   prototypes/**   OS reskins (macOS, tablet, Norton-Commander desktop) and
//   mocks/**        their chrome packages, where px is the honest unit — they
//                   mimic native widgets, not system UI
//   platforms/**    generated theme output + native-widget mockups
//   docs/v2/**      historical reference comps
//   font_options.html  typeface-comparison sandbox; arbitrary sizes are the point
//   tokens.css      generated from tokens.json
//
// Run: bun scripts/validate-a11y-type.mjs
// Spec: docs/ACCESSIBILITY.md, docs/STYLE-GUIDE.md §2

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(`Usage: validate-a11y-type [--help] [--version]

Checks that text scales with the reader's font-size setting:
  errors
    - font-size in px (does not follow the browser's text size)
    - rem font-size below typography.scaling.absoluteFloor
    - font-size: clamp() whose middle term is viewport-only (no rem/em),
      so the size stops scaling between the bounds
    - html/:root font-size set to anything but 100%
  warnings
    - em font-size below typography.scaling.minRelativeEm without a
      max(..., var(--type-floor)) guard — nesting compounds the shrink
    - rem font-size off the ten-step scale in tokens.json#typography.scale
    - @media width bound in px (does not react to the browser's default size)
    - fixed px height/max-height on a rule that also sets font-size (clips
      when text grows)

Thresholds come from tokens.json, so the gate cannot drift from the spec.
prototypes/, mocks/, platforms/ and docs/v2/ are out of scope.
Errors fail the script (exit 1).
`);
  process.exit(0);
}
if (process.argv.includes("--version")) {
  process.stdout.write("validate-a11y-type 1.0.0\n");
  process.exit(0);
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(resolve(ROOT, "tokens.json"), "utf8"));
const SCALE = tokens.typography.scale;
const SCALING = tokens.typography.scaling;
const ABSOLUTE_FLOOR = parseFloat(SCALING.absoluteFloor);
const MIN_RELATIVE_EM = SCALING.minRelativeEm;

const findings = [];
function record(file, line, severity, msg) {
  findings.push({ file, line, severity, msg });
}

// ─── File set ────────────────────────────────────────────────────────

const HAND_AUTHORED_CSS = [
  "colors_and_type.css",
  "fonts.css",
  "motion.css",
  "styles.css",
  "components/components.css",
];
const SHOWCASE_HTML = ["index.html", "md.html", "palette.html"];

function listDir(dir, suffix) {
  try {
    return readdirSync(resolve(ROOT, dir))
      .filter((n) => n.endsWith(suffix))
      .map((n) => `${dir}/${n}`);
  } catch {
    return [];
  }
}
function listCardHtml() {
  const out = [];
  for (const entry of readdirSync(resolve(ROOT, "components"), { withFileTypes: true })) {
    if (entry.isDirectory()) out.push(`components/${entry.name}/card.html`);
  }
  return out;
}

const FILES = [
  ...HAND_AUTHORED_CSS,
  ...SHOWCASE_HTML,
  ...listDir("preview", ".html"),
  ...listCardHtml(),
];

// ─── Helpers ─────────────────────────────────────────────────────────

function lineOf(src, idx) {
  let n = 1;
  for (let i = 0; i < idx; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}

// Blank out comments so commented-out CSS and prose about sizes never trip a
// check, while byte offsets (and therefore line numbers) stay accurate.
function stripComments(src, isHtml) {
  let out = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  if (isHtml) {
    out = out.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
  }
  return out;
}

const onScale = (rem) => SCALE.some((s) => Math.abs(s - rem) < 1e-9);
const fmt = (n) => `${+n.toFixed(4)}`;

// ─── Checks ──────────────────────────────────────────────────────────

// Matches the value of a font-size declaration up to the terminating `;`,
// `}` or `"` (inline style attributes end at the quote).
const FONT_SIZE = /font-size\s*:\s*([^;}"']+)/gi;

function checkFontSizes(rel, src) {
  for (const m of src.matchAll(FONT_SIZE)) {
    const raw = m[1].trim();
    const at = () => lineOf(src, m.index);

    // 1. px — never follows the browser's text-size setting.
    if (/(?<![\w.-])\d+(?:\.\d+)?px/.test(raw)) {
      record(rel, at(), "error", `font-size: ${raw} — px does not scale with the reader's font size; use a --type-scale-* step`);
      continue;
    }

    // 3. clamp() with a viewport-only middle term stops scaling between the
    //    bounds, which defeats the reader's setting exactly where it matters.
    const clamp = raw.match(/clamp\(([^()]*(?:\([^()]*\)[^()]*)*)\)/i);
    if (clamp) {
      const parts = clamp[1].split(",");
      const middle = parts.length === 3 ? parts[1] : null;
      if (middle && /\d\s*(vw|vh|vmin|vmax)\b/i.test(middle) && !/(rem|em)\b/.test(middle)) {
        record(rel, at(), "error", `font-size: ${raw} — the clamp() middle term is viewport-only; add a rem term (${SCALING.fluid})`);
      }
      continue;
    }

    // 2 / 5 / 6. Absolute and relative literals.
    const guarded = /\bmax\s*\(/.test(raw);
    for (const unit of raw.matchAll(/(?<![\w.-])(\d+(?:\.\d+)?)(rem|em)\b/g)) {
      const v = parseFloat(unit[1]);
      if (unit[2] === "rem") {
        if (v < ABSOLUTE_FLOOR - 1e-9 && !guarded) {
          record(rel, at(), "error", `font-size: ${raw} — ${fmt(v)}rem is below the ${SCALING.absoluteFloor} floor in tokens.json#typography.scaling`);
        } else if (!onScale(v)) {
          record(rel, at(), "warn", `font-size: ${raw} — ${fmt(v)}rem is off the ten-step scale; pick a --type-scale-* step`);
        }
      } else if (v < MIN_RELATIVE_EM - 1e-9 && !guarded) {
        record(rel, at(), "warn", `font-size: ${raw} — relative sizes below ${MIN_RELATIVE_EM}em compound when nested; wrap in max(${fmt(v)}em, var(--type-floor))`);
      }
    }
  }
}

// 4. The root font size is the reader's, not ours.
function checkRootFontSize(rel, src) {
  for (const block of src.matchAll(/(^|[\s,>{}])(html|:root)\b([^{}]*)\{([^{}]*)\}/g)) {
    const decl = block[4].match(/(?:^|;)\s*font-size\s*:\s*([^;}]+)/i);
    if (!decl) continue;
    const value = decl[1].trim();
    if (value !== "100%") {
      record(rel, lineOf(src, block.index), "error", `${block[2]} sets font-size: ${value} — overriding the reader's root size breaks WCAG 1.4.4; only 100% is allowed`);
    }
  }
}

// 7. px media queries stay put when the reader raises their default text size;
//    em queries resolve against it and reflow as they should.
function checkMediaQueries(rel, src) {
  for (const m of src.matchAll(/@media[^{]*?(?:min|max)-width\s*:\s*(\d+(?:\.\d+)?)px/gi)) {
    record(rel, lineOf(src, m.index), "warn", `@media width bound ${m[1]}px — use em (tokens.json#breakpoints) so the layout reflows when the default text size changes`);
  }
}

// 8. A px-capped box around text clips once the text grows.
function checkFixedBoxes(rel, src) {
  for (const block of src.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
    const body = block[2];
    if (!/font-size\s*:/i.test(body)) continue;
    const box = body.match(/(?:^|;)\s*((?:max-)?height)\s*:\s*(\d+(?:\.\d+)?)px/i);
    if (!box || parseFloat(box[2]) <= 4) continue; // hairlines and rules are not text boxes
    // The selector capture runs back to the previous `}`, so anchor the
    // reported line to the declaration itself.
    const declAt = block.index + block[0].indexOf("{") + 1 + box.index;
    record(rel, lineOf(src, declAt), "warn", `"${block[1].trim().split("\n").pop()}" sets ${box[1]}: ${box[2]}px alongside font-size — a px-capped box clips when text scales`);
  }
}

// ─── Run ─────────────────────────────────────────────────────────────

let checked = 0;
for (const rel of FILES) {
  const abs = resolve(ROOT, rel);
  try {
    statSync(abs);
  } catch {
    continue;
  }
  const src = stripComments(readFileSync(abs, "utf8"), rel.endsWith(".html"));
  checkFontSizes(rel, src);
  checkRootFontSize(rel, src);
  checkMediaQueries(rel, src);
  checkFixedBoxes(rel, src);
  checked++;
}

const errors = findings.filter((f) => f.severity === "error");
const warnings = findings.filter((f) => f.severity === "warn");

function emit(label, list, stream) {
  if (!list.length) return;
  stream.write(`\n${label} (${list.length}):\n`);
  for (const f of list) stream.write(`  ${f.file}:${f.line}  ${f.msg}\n`);
}

emit("✗ errors", errors, process.stderr);
emit("⚠ warnings", warnings, process.stderr);

if (errors.length) {
  process.stderr.write(
    `\nFAIL: ${errors.length} error(s), ${warnings.length} warning(s) across ${checked} file(s).\n`,
  );
  process.exit(1);
}

process.stdout.write(
  `✓ a11y-type: ${checked} file(s) checked against the ${SCALING.absoluteFloor} floor, ${warnings.length} warning(s)\n`,
);
