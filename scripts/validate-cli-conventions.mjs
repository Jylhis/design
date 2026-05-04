#!/usr/bin/env bun
// Jylhis design system — CLI conventions validator.
//
// Static-checks the user-facing bun scripts in scripts/ against the baseline
// from docs/CLI-TUI-GUIDELINES.md:
//
// - --help and --version supported (or a usage() printed on --help)
// - errors go to stderr (console.error / process.stderr.write)
// - non-zero exit on failure (process.exit with a non-zero arg)
// - no spinner / redraw animation primitives in the default code path
// - NO_COLOR honoured if the script emits ANSI colour
//
// This is a lightweight grep-style audit, not a runtime test.
//
// Run: bun scripts/validate-cli-conventions.mjs
// Spec: docs/CLI-TUI-GUIDELINES.md §2 and §4

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(`Usage: validate-cli-conventions [--help] [--version]

Static-checks the user-facing bun scripts in scripts/ against the baseline
from docs/CLI-TUI-GUIDELINES.md:

  - --help / -h handling
  - --version handling
  - errors written to stderr
  - non-zero exit on failure
  - no spinner / redraw glyphs in the default code path
  - NO_COLOR honoured if a colour library is imported

Errors fail the script (exit 1).
`);
  process.exit(0);
}
if (process.argv.includes("--version")) {
  process.stdout.write("validate-cli-conventions 1.0.0\n");
  process.exit(0);
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const findings = [];
const record = (file, severity, msg) => findings.push({ file, severity, msg });

// Discover .mjs scripts. Shell scripts in scripts/ have their own
// conventions and aren't covered here.
const SCRIPT_DIR = "scripts";
const scripts = readdirSync(resolve(ROOT, SCRIPT_DIR))
  .filter((n) => n.endsWith(".mjs"))
  .map((n) => `${SCRIPT_DIR}/${n}`);

// Patterns that count as spinner/colour *emission*, not just definition.
// We only flag matches inside a write call (console.log/error,
// process.stdout/stderr.write) so regex definitions in this validator
// itself don't trigger false positives.
const WRITE_CALL = /(console\.(log|error|warn)|process\.(stdout|stderr)\.write)\s*\(/;
const ANSI_LITERAL = /["'`][^"'`]*(?:\\x1b|\\u001b|)\[[0-9;]*[A-Za-z][^"'`]*["'`]/;
const SPINNER_LITERAL = /["'`][^"'`]*[⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏][^"'`]*["'`]|\\r(?!\\n|"|')/;
const COLOR_LIB = /\b(chalk|kleur|picocolors|ansi-colors)\b/;

function checkScript(rel) {
  const src = readFileSync(resolve(ROOT, rel), "utf8");

  // 1. --help support: either an argv check for "--help"/"-h", or a usage()
  //    function the script offers, paired with an exit.
  const hasHelp = /process\.argv\.includes\(["']--help["']\)|process\.argv\.includes\(["']-h["']\)|case\s+["']-?-h(?:elp)?["']/i.test(src) ||
                   (/function\s+usage\b/i.test(src) && /usage\s*\(\s*\)/.test(src));
  if (!hasHelp) {
    record(rel, "error", "no --help / -h handling found");
  }

  // 2. --version support
  const hasVersion = /process\.argv\.includes\(["']--version["']\)|case\s+["']--version["']/i.test(src);
  if (!hasVersion) {
    record(rel, "warn", "no --version handling found");
  }

  // 3. Errors go to stderr — script must use console.error or process.stderr
  //    on at least one error path. Greps the keyword "error" in proximity to
  //    a write call.
  const usesStderr = /console\.error\s*\(/.test(src) || /process\.stderr\.write\s*\(/.test(src);
  const usesProcessExitNonZero = /process\.exit\s*\(\s*[1-9]/.test(src);
  if (!usesStderr) {
    record(rel, "error", "no stderr usage (console.error or process.stderr.write)");
  }
  if (!usesProcessExitNonZero) {
    record(rel, "warn", "no process.exit(non-zero) found — failures may exit 0");
  }

  // 4. No spinner/redraw primitives in the default path. Acceptable if
  //    explicitly gated behind isTTY + a non-default flag. We only flag
  //    glyphs/escapes that appear on the same line as a write call, to
  //    avoid false positives on regex definitions and comments.
  const lines = src.split(/\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!WRITE_CALL.test(line)) continue;
    if (SPINNER_LITERAL.test(line)) {
      record(rel, "warn", `line ${i + 1}: spinner / \\r-redraw glyph emitted`);
    }
    if (ANSI_LITERAL.test(line) && !/NO_COLOR|isTTY/.test(src)) {
      record(rel, "warn", `line ${i + 1}: ANSI escape emitted without NO_COLOR/isTTY guard`);
    }
  }
  // 5. If a colour library is imported, NO_COLOR must be honoured somewhere.
  if (COLOR_LIB.test(src) && !/NO_COLOR/.test(src)) {
    record(rel, "error", "colour library imported but NO_COLOR is not honoured");
  }
}

for (const f of scripts) checkScript(f);

const errors = findings.filter((f) => f.severity === "error");
const warnings = findings.filter((f) => f.severity === "warn");

function emit(label, list, stream) {
  if (!list.length) return;
  stream.write(`\n${label} (${list.length}):\n`);
  for (const f of list) stream.write(`  ${f.file}  ${f.msg}\n`);
}

emit("✗ errors", errors, process.stderr);
emit("⚠ warnings", warnings, process.stderr);

if (errors.length) {
  process.stderr.write(
    `\nFAIL: ${errors.length} error(s), ${warnings.length} warning(s) across ${scripts.length} script(s).\n`,
  );
  process.exit(1);
}

process.stdout.write(
  `✓ cli-conventions: ${scripts.length} script(s) checked, ${warnings.length} warning(s)\n`,
);
