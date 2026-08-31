#!/usr/bin/env bun
// Jylhis design system — CSS accessibility validator.
//
// Walks the hand-authored stylesheets and surfaces accessibility regressions:
// - transitions/animations require an @media (prefers-reduced-motion: reduce)
//   guard somewhere in the file (or in colors_and_type.css, which is the
//   canonical universal guard for the system)
// - outline:none / outline:0 must be paired with a :focus-visible replacement
//   that defines a visible ring
//
// CSS files generated from tokens.json (tokens.css, platforms/**) are not
// checked — they're derived artifacts. Only files a human author actually
// edits.
//
// Run: bun scripts/validate-a11y-css.mjs
// Spec: docs/ACCESSIBILITY.md, docs/CLI-TUI-GUIDELINES.md

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { createFindings, lineOf, report } from "./lib/findings.mjs";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(`Usage: validate-a11y-css [--help] [--version]

Walks the hand-authored stylesheets and reports accessibility issues:
  - transitions/animations must have a prefers-reduced-motion guard
    (either in the file, or via colors_and_type.css's universal reset)
  - outline:none / outline:0 must be paired with a :focus-visible
    replacement that defines a visible ring of at least 2px

Generated CSS (tokens.css, platforms/**) is not checked.
Errors fail the script (exit 1).
`);
  process.exit(0);
}
if (process.argv.includes("--version")) {
  process.stdout.write("validate-a11y-css 1.0.0\n");
  process.exit(0);
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { findings, record } = createFindings();

const HAND_AUTHORED = [
  "colors_and_type.css",
  "fonts.css",
  "motion.css",
  "styles.css",
  "components/components.css",
];
function listCss(dir) {
  const out = [];
  for (const name of readdirSync(resolve(ROOT, dir))) {
    if (name.endsWith(".css")) out.push(`${dir}/${name}`);
  }
  return out;
}
const PROTOTYPE_CSS = listCss("prototypes");
const FILES = [...HAND_AUTHORED, ...PROTOTYPE_CSS];

// colors_and_type.css carries a universal prefers-reduced-motion reset that
// covers transitions/animations everywhere it is imported. Files that import
// it (or are it) inherit that guard.
const tokensCss = readFileSync(resolve(ROOT, "colors_and_type.css"), "utf8");
const universalGuard =
  /@media[^{]*prefers-reduced-motion[^{]*reduce[^{]*\{[\s\S]*?\*[\s\S]*?(?:transition|animation)/i.test(tokensCss);

// styles.css is the single-import entry point: it imports colors_and_type.css
// (which carries the universal guard) before motion.css and components.css,
// so files it pulls in are guarded whenever they are loaded the supported way.
const stylesCss = readFileSync(resolve(ROOT, "styles.css"), "utf8");
const stylesImportsTokens = /@import[^;]*colors_and_type\.css/i.test(stylesCss);
const GUARDED_VIA_ENTRY = new Set(
  stylesImportsTokens
    ? [...stylesCss.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/gi)].map((m) => m[1].replace(/^\.\//, ""))
    : [],
);

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

function checkFile(rel) {
  const src0 = readFileSync(resolve(ROOT, rel), "utf8");
  const src = stripComments(src0);

  // 1. transition / animation under prefers-reduced-motion
  const usesTransition = /\btransition(?:-(?:property|duration|timing-function|delay))?\s*:/i.test(src);
  const usesAnimation = /\banimation(?:-(?:name|duration|iteration-count))?\s*:/i.test(src);
  const importsTokens = /@import[^;]*colors_and_type\.css/i.test(src);
  const hasOwnGuard = /@media[^{]*prefers-reduced-motion[^{]*reduce/i.test(src);
  const isTokensCss = rel === "colors_and_type.css";

  const guardedViaEntry = GUARDED_VIA_ENTRY.has(rel) && universalGuard;

  if ((usesTransition || usesAnimation) && !hasOwnGuard && !importsTokens && !guardedViaEntry && !(isTokensCss && universalGuard)) {
    record(
      rel,
      1,
      "error",
      "uses transition/animation but has no @media (prefers-reduced-motion: reduce) guard and does not import colors_and_type.css",
    );
  }

  // 1b. text-faint must not colour real text (it is sub-AA on light surfaces
  //     and is reserved for decoration/disabled per docs/ACCESSIBILITY.md).
  //     Flag `color: var(--color-text-faint)` unless the rule is decorative:
  //     ::placeholder / :disabled / ::before / ::after selectors, or any block
  //     that opts out of selection with `user-select: none`. Only the `color`
  //     property is checked — `text-decoration-color` (line-through) is fine.
  //     Enforced on the canonical hand-authored stylesheets; the OS/TUI reskin
  //     prototypes use faint as dim chrome throughout and are exempt.
  if (HAND_AUTHORED.includes(rel)) {
    for (const block of src.matchAll(/([^{}]*)\{([^{}]*)\}/g)) {
      const [, selector, body] = block;
      const decl = body.match(/(?:^|;)\s*color\s*:\s*var\(--color-text-faint\)/);
      if (!decl) continue;
      const decorative =
        /::(placeholder|before|after)\b/.test(selector) ||
        /:disabled\b/.test(selector) ||
        /user-select\s*:\s*none/.test(body);
      if (!decorative) {
        const idx = block.index + block[0].indexOf("{") + 1 + decl.index;
        record(
          rel,
          lineOf(src, idx),
          "error",
          `text-faint used as text color on "${selector.trim()}" — use text-muted for readable text, or mark the rule decorative (user-select:none / :disabled / ::placeholder)`,
        );
      }
    }
  }

  // 2. outline:none / outline:0 must be replaced by a :focus-visible rule.
  for (const m of src.matchAll(/outline\s*:\s*(none|0)\s*;?/gi)) {
    // Look ahead in the file for a :focus-visible block setting outline.
    const replaced = /:focus-visible[^{]*\{[^}]*outline\s*:[^}]*?(\d+(?:\.\d+)?)\s*(px|rem|em)/i.test(src);
    if (!replaced) {
      record(
        rel,
        lineOf(src, m.index),
        "error",
        "outline removed without a :focus-visible replacement",
      );
    } else {
      // Found a replacement somewhere — check it is at least 2px equivalent.
      const repl = src.match(/:focus-visible[^{]*\{[^}]*outline\s*:[^}]*?(\d+(?:\.\d+)?)\s*(px|rem|em)/i);
      if (repl) {
        const [, n, unit] = repl;
        const px = unit === "px" ? +n : +n * 16;
        if (px < 2) {
          record(
            rel,
            lineOf(src, m.index),
            "warn",
            `:focus-visible replacement outline (${n}${unit}) is below the 2px minimum from KEYBOARD.md`,
          );
        }
      }
    }
  }
}

for (const f of FILES) {
  try {
    statSync(resolve(ROOT, f));
  } catch {
    continue;
  }
  checkFile(f);
}

report("a11y-css", findings, { checked: FILES.length });
