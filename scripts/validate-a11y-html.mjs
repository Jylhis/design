#!/usr/bin/env bun
// Jylhis design system — HTML accessibility validator.
//
// Walks every HTML artifact in the repo (showcase, preview cards, prototypes,
// platform index) and surfaces accessibility regressions:
// - <html lang>, <meta charset>, <meta viewport>, <title>
// - heading hierarchy (no skipped levels, single h1)
// - <img alt>, accessible names on <a>/<button>, label association on form fields
// - inline outline:none paired with :focus-visible replacement
// - inline transition/animation paired with prefers-reduced-motion guard
// - skip-to-content link on full pages (not preview cards)
// - status alerts include a glyph or label, not colour-only
// - decorative Unicode glyphs in standalone spans carry aria-hidden
//
// The checks are deliberately conservative — false positives are worse than
// false negatives, because they drown real issues.
//
// Run: bun scripts/validate-a11y-html.mjs
// Spec: docs/CLI-TUI-GUIDELINES.md, docs/ACCESSIBILITY.md, platforms/KEYBOARD.md

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, relative, join } from "node:path";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(`Usage: validate-a11y-html [--help] [--version]

Walks every HTML artifact in the repo and reports accessibility issues:
  - <html lang>, <meta charset>, <meta viewport>, <title>
  - heading hierarchy, single h1
  - <img alt>, accessible names on <a>/<button>, form-field labels
  - inline outline:none must pair with a :focus-visible replacement
  - inline transition/animation must be guarded by prefers-reduced-motion
    (or the page imports colors_and_type.css)
  - skip-to-content link on full pages
  - status indicators include a glyph or word, not colour-only
  - decorative Unicode glyphs in standalone spans carry aria-hidden

Errors fail the script (exit 1). Warnings and suggestions are visible but
do not fail.
`);
  process.exit(0);
}
if (process.argv.includes("--version")) {
  process.stdout.write("validate-a11y-html 1.0.0\n");
  process.exit(0);
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const findings = []; // { file, line, severity, msg }

function record(file, line, severity, msg) {
  findings.push({ file, line, severity, msg });
}

// ─── Discover HTML files ─────────────────────────────────────────────

const FULL_PAGES = [
  "index.html",
  "palette.html",
  "font_options.html",
  "md.html",
  "platforms/index.html",
];

function listHtml(dir) {
  const out = [];
  for (const name of readdirSync(resolve(ROOT, dir))) {
    if (name.endsWith(".html")) out.push(`${dir}/${name}`);
  }
  return out;
}

const previewCards = listHtml("preview");
const prototypes = listHtml("prototypes");
// components/<Name>/card.html specimens are validated like preview cards.
const componentCards = readdirSync(resolve(ROOT, "components"))
  .filter((name) => statSync(resolve(ROOT, "components", name)).isDirectory())
  .map((name) => `components/${name}/card.html`);
const allFiles = [...FULL_PAGES, ...previewCards, ...componentCards, ...prototypes];

const isFullPage = (f) => FULL_PAGES.includes(f);
const isPrototype = (f) => f.startsWith("prototypes/");

// ─── Tiny line-aware helpers ─────────────────────────────────────────

function lineOf(src, idx) {
  let n = 1;
  for (let i = 0; i < idx; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}

// Strip HTML comments so they can't satisfy heuristics by accident.
function stripComments(src) {
  return src.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
}

// Match opening tags of a given name (case-insensitive). Returns
// [{ idx, raw, attrs }] where attrs is a normalised string.
function findTags(src, tagName) {
  const re = new RegExp(`<${tagName}\\b([^>]*?)/?>`, "gi");
  const out = [];
  for (const m of src.matchAll(re)) {
    out.push({ idx: m.index, raw: m[0], attrs: m[1] || "" });
  }
  return out;
}

function attr(attrs, name) {
  const m = attrs.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  if (!m) return null;
  return m[2] ?? m[3] ?? m[4] ?? "";
}

function hasAttr(attrs, name) {
  return new RegExp(`\\b${name}(\\s*=|\\s|$)`, "i").test(attrs);
}

// Extract inner text + attribute names that contribute to the accessible name.
function accessibleName(src, openIdx, openRaw, tag) {
  const attrs = openRaw.match(/<\w+\b([^>]*?)\/?>/i)?.[1] || "";
  const ariaLabel = attr(attrs, "aria-label");
  if (ariaLabel && ariaLabel.trim()) return ariaLabel;
  if (hasAttr(attrs, "aria-labelledby")) return "(via aria-labelledby)";
  if (tag === "img") {
    const alt = attr(attrs, "alt");
    return alt ?? null;
  }
  // Slice from end of open tag to next matching close tag (best-effort).
  const start = openIdx + openRaw.length;
  const closeRe = new RegExp(`</${tag}\\s*>`, "i");
  const rest = src.slice(start);
  const close = rest.match(closeRe);
  if (!close) return "";
  const inner = rest.slice(0, close.index);
  // Strip nested tags, preserve text and useful attrs (alt on nested img,
  // title on anything).
  const text = inner
    .replace(/<img\b[^>]*\balt\s*=\s*("([^"]*)"|'([^']*)')[^>]*>/gi, " $2$3 ")
    .replace(/\btitle\s*=\s*("([^"]*)"|'([^']*)')/gi, " $2$3 ")
    .replace(/<[^>]+>/g, " ");
  return text.replace(/\s+/g, " ").trim();
}

// ─── Per-file checks ─────────────────────────────────────────────────

function checkFile(rel) {
  const src0 = readFileSync(resolve(ROOT, rel), "utf8");
  const src = stripComments(src0);

  // 1. <html lang="…">
  const html = src.match(/<html\b[^>]*>/i);
  if (!html) {
    record(rel, 1, "error", "no <html> element");
  } else {
    const lang = attr(html[0], "lang");
    if (!lang || !lang.trim()) {
      record(rel, lineOf(src, html.index), "error", "<html> missing lang attribute");
    }
  }

  // 2. <meta charset> and <meta viewport>
  if (!/<meta\b[^>]*\bcharset\s*=/i.test(src)) {
    record(rel, 1, "error", "missing <meta charset>");
  }
  if (!isPrototype(rel) && !/<meta\b[^>]*\bname\s*=\s*["']viewport["']/i.test(src)) {
    // viewport is required on full pages and prototypes; preview cards are
    // embedded so we treat them as warnings rather than errors.
    const sev = isFullPage(rel) ? "error" : "warn";
    record(rel, 1, sev, "missing <meta name=\"viewport\">");
  }

  // 3. <title> non-empty
  const title = src.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  if (!title || !title[1].trim()) {
    record(rel, title ? lineOf(src, title.index) : 1, "error", "missing or empty <title>");
  }

  // 4. Heading hierarchy
  const headings = [];
  for (const m of src.matchAll(/<h([1-6])\b[^>]*>/gi)) {
    headings.push({ level: Number(m[1]), idx: m.index });
  }
  let lastLevel = 0;
  let h1Count = 0;
  for (const h of headings) {
    if (h.level === 1) h1Count++;
    if (lastLevel && h.level > lastLevel + 1) {
      record(
        rel,
        lineOf(src, h.idx),
        "warn",
        `heading skips from h${lastLevel} to h${h.level}`,
      );
    }
    lastLevel = h.level;
  }
  if (h1Count > 1 && isFullPage(rel)) {
    record(rel, 1, "warn", `multiple <h1> elements (${h1Count}) on a full page`);
  }

  // 5. <img alt>
  for (const t of findTags(src, "img")) {
    if (attr(t.attrs, "alt") === null && !hasAttr(t.attrs, "aria-hidden")) {
      record(rel, lineOf(src, t.idx), "error", "<img> missing alt attribute");
    }
  }

  // 6. Accessible names on <a> and <button>
  for (const tag of ["a", "button"]) {
    for (const t of findTags(src, tag)) {
      // Skip <a> with no href (used as anchors), and elements marked aria-hidden.
      if (tag === "a" && !hasAttr(t.attrs, "href")) continue;
      if (hasAttr(t.attrs, "aria-hidden")) continue;
      const name = accessibleName(src, t.idx, t.raw, tag);
      if (!name) {
        record(
          rel,
          lineOf(src, t.idx),
          "error",
          `<${tag}> has no accessible name (text, aria-label, or aria-labelledby)`,
        );
      }
    }
  }

  // 7. Form fields associated with a label
  for (const tag of ["input", "select", "textarea"]) {
    for (const t of findTags(src, tag)) {
      const type = attr(t.attrs, "type") || "";
      // Skip purely structural/hidden inputs.
      if (["hidden", "submit", "button", "reset", "image"].includes(type.toLowerCase())) continue;
      if (hasAttr(t.attrs, "aria-label") || hasAttr(t.attrs, "aria-labelledby")) continue;
      const id = attr(t.attrs, "id");
      const placeholderOnly = !id;
      let labelled = false;
      if (id) {
        labelled = new RegExp(`<label\\b[^>]*\\bfor\\s*=\\s*["']${id}["']`, "i").test(src);
      }
      // Allow wrapping <label><input ...></label>.
      if (!labelled) {
        const back = src.slice(Math.max(0, t.idx - 200), t.idx);
        const fwd = src.slice(t.idx, t.idx + 200);
        if (/<label\b[^>]*>[\s\S]*$/i.test(back) && !/(<\/label>)/i.test(back)) labelled = true;
        if (!labelled && /<\/label>/i.test(fwd) && !/<label\b[^>]*>/i.test(fwd.split(/<\/label>/i)[0])) {
          // Closing label after this input — assume wrapping.
          labelled = true;
        }
      }
      if (!labelled && placeholderOnly) {
        record(
          rel,
          lineOf(src, t.idx),
          "warn",
          `<${tag}> has no associated <label> (use for=id, aria-label, or wrap in <label>)`,
        );
      } else if (!labelled) {
        record(
          rel,
          lineOf(src, t.idx),
          "warn",
          `<${tag} id="${id}"> has no <label for="${id}">`,
        );
      }
    }
  }

  // 8. Inline <style>: outline: none must pair with :focus-visible replacement;
  //    transition/animation must pair with prefers-reduced-motion guard
  //    (or the page must import colors_and_type.css — directly or via the
  //    styles.css entry point — which provides a universal guard for the
  //    whole system).
  const importsTokensCss = /<link\b[^>]*href\s*=\s*["'][^"']*(?:colors_and_type|styles)\.css["']/i.test(src) ||
                            /@import\s+url\(\s*["'][^"']*(?:colors_and_type|styles)\.css["']\s*\)/i.test(src);
  for (const m of src.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    const css = m[1];
    const styleStart = lineOf(src, m.index);
    if (/outline\s*:\s*(none|0)\b/i.test(css) && !/:focus-visible[^{]*\{[^}]*outline\s*:/i.test(css)) {
      record(
        rel,
        styleStart,
        "error",
        "<style> sets outline:none/0 without a :focus-visible replacement",
      );
    }
    if ((/transition\s*:/i.test(css) || /animation\s*:/i.test(css)) &&
        !/@media[^{]*prefers-reduced-motion/i.test(css) &&
        !importsTokensCss) {
      const sev = isFullPage(rel) ? "error" : "warn";
      record(
        rel,
        styleStart,
        sev,
        "<style> uses transition/animation without @media (prefers-reduced-motion: reduce) guard",
      );
    }
  }

  // 9. Skip-to-content link on full pages.
  if (isFullPage(rel)) {
    const hasSkip = /<a\b[^>]*\bhref\s*=\s*["']#[a-z0-9-]+["'][^>]*>\s*(skip|jump)\b/i.test(src);
    if (!hasSkip) {
      record(
        rel,
        1,
        "warn",
        "no skip-to-content link found (per platforms/KEYBOARD.md#tab-order)",
      );
    }
  }

  // 10. Status indicators must include a glyph or word, not colour-only.
  // Scope: elements whose class explicitly carries an err/warn/ok/info
  // semantic (the CVD-fragile quartet from docs/ACCESSIBILITY.md). Plain
  // <span class="status">label</span> chips and bronze <div class="callout">
  // containers are not status signals — they're labels and decorative
  // surfaces, so we don't flag them.
  const STATUS_CLASS = /\b(alert\s+\w+|status-(err|warn|ok|info)|s-(err|warn|ok|info)|err|warn|ok|info|error|warning|success|fail|failure)\b/;
  const STATUS_GLYPHS = /[✓✗⚠⚡!]/;
  const STATUS_WORDS = /\b(ok|okay|success|error|fail(ed|ure)?|warning|warn|info|note|caution)\b/i;
  for (const m of src.matchAll(/<(\w+)\b([^>]*\bclass\s*=\s*["']([^"']+)["'][^>]*)>([\s\S]*?)<\/\1>/gi)) {
    const cls = m[3] || "";
    if (!STATUS_CLASS.test(cls)) continue;
    const inner = m[4] || "";
    const attrs = m[2] || "";
    const text = inner.replace(/<[^>]+>/g, " ");
    const ariaLabel = attr(attrs, "aria-label") || "";
    const carriesSignal = STATUS_GLYPHS.test(text) || STATUS_WORDS.test(text) ||
                          STATUS_GLYPHS.test(ariaLabel) || STATUS_WORDS.test(ariaLabel) ||
                          /\b[i]\b/.test(text); // bare "i" glyph for info
    if (!carriesSignal) {
      record(
        rel,
        lineOf(src, m.index),
        "warn",
        `status indicator (class="${cls}") has no glyph or word — colour-only signalling`,
      );
    }
  }

  // 11. Decorative Unicode glyphs in standalone <span>s should carry aria-hidden.
  const DECORATIVE = /^[\s›▸»└──├───☾☀★⑂$/▪◆◇•·]+$/;
  const spanRe = /<span\b([^>]*)>([^<]+)<\/span>/gi;
  for (const m of src.matchAll(spanRe)) {
    const content = (m[2] || "").trim();
    if (!content) continue;
    if (!DECORATIVE.test(content)) continue;
    if (hasAttr(m[1] || "", "aria-hidden")) continue;
    record(
      rel,
      lineOf(src, m.index),
      "suggest",
      `<span>${content}</span> looks decorative — consider aria-hidden="true"`,
    );
  }
}

for (const f of allFiles) {
  try {
    statSync(resolve(ROOT, f));
  } catch {
    continue;
  }
  checkFile(f);
}

// ─── Report ──────────────────────────────────────────────────────────

const errors = findings.filter((f) => f.severity === "error");
const warnings = findings.filter((f) => f.severity === "warn");
const suggestions = findings.filter((f) => f.severity === "suggest");

function emit(label, list, stream) {
  if (!list.length) return;
  stream.write(`\n${label} (${list.length}):\n`);
  for (const f of list) {
    stream.write(`  ${f.file}:${f.line}  ${f.msg}\n`);
  }
}

emit("✗ errors", errors, process.stderr);
emit("⚠ warnings", warnings, process.stderr);
emit("· suggestions", suggestions, process.stderr);

if (errors.length) {
  process.stderr.write(
    `\nFAIL: ${errors.length} error(s), ${warnings.length} warning(s), ${suggestions.length} suggestion(s) across ${allFiles.length} file(s).\n`,
  );
  process.exit(1);
}

process.stdout.write(
  `✓ a11y-html: ${allFiles.length} file(s) checked, ${warnings.length} warning(s), ${suggestions.length} suggestion(s)\n`,
);
