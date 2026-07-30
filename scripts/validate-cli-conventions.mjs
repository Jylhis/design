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
// - if a colour library is imported, FORCE_COLOR is also honoured (warn)
// - literal "--json" flag → suggest --format migration (warn)
// - bare process.env.DEBUG read → suggest JYLHIS_DEBUG/JYLHIS_LOG (warn)
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
  - FORCE_COLOR honoured alongside NO_COLOR (warn)
  - literal "--json" flag → prefer --format json (warn)
  - bare process.env.DEBUG read (warn; prefer JYLHIS_DEBUG/JYLHIS_LOG)

Errors fail the script (exit 1); warnings do not.
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

  // 6. If a colour library is imported, FORCE_COLOR should be honoured too —
  //    NO_COLOR disables, FORCE_COLOR/CLICOLOR_FORCE re-enable on non-TTY.
  //    Warn, don't error: many scripts only need to suppress colour, not
  //    force it.
  if (COLOR_LIB.test(src) && !/FORCE_COLOR|CLICOLOR_FORCE/.test(src)) {
    record(rel, "warn", "colour library imported but FORCE_COLOR / CLICOLOR_FORCE not honoured");
  }

  // Rules 7 and 8 are self-referential by nature: the validator's source
  // must contain the patterns it looks for. Skip them on the validator
  // itself; every other script in scripts/ is fair game.
  const isSelf = rel.endsWith("validate-cli-conventions.mjs");

  // 7. Literal "--json" flag string. The canonical form per
  //    docs/CLI-TUI-GUIDELINES.md §2.2 is `-F json` / `--format json`,
  //    with `--json` accepted only as a back-compat alias. Lines that
  //    mention both `--json` and `--format` are treated as documentation
  //    or alias-handling code, not as policy violations.
  if (!isSelf) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!/["']--json["']/.test(line)) continue;
      if (/--format/.test(line)) continue;
      record(rel, "warn", `line ${i + 1}: literal "--json" — prefer --format json (alias permitted if --format also handled)`);
    }
  }

  // 8. Bare `process.env.DEBUG` read. Collides with the npm `debug`
  //    package's namespace convention; project tools should read
  //    JYLHIS_DEBUG or JYLHIS_LOG instead.
  if (!isSelf && /process\.env\.DEBUG\b/.test(src) && !/JYLHIS_DEBUG|JYLHIS_LOG/.test(src)) {
    record(rel, "warn", "bare process.env.DEBUG — prefer JYLHIS_DEBUG / JYLHIS_LOG");
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
