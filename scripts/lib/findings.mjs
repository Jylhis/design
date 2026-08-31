// Shared findings ledger for the validate-*.mjs gates: one place for the
// record/report shape so every validator emits the same errors/warnings
// layout, the same FAIL summary, and the same exit contract (errors exit 1,
// warnings do not). Lives under lib/ so validate-cli-conventions.mjs does not
// treat it as a CLI entry point.

// 1-based line number of a character offset in `src`.
export function lineOf(src, idx) {
  let n = 1;
  for (let i = 0; i < idx; i++) if (src.charCodeAt(i) === 10) n++;
  return n;
}

// A findings ledger. `record(file, line, severity, msg)` — pass line = null
// for file-level findings. Severities: "error", "warn", "suggest".
export function createFindings() {
  const findings = [];
  const record = (file, line, severity, msg) =>
    findings.push({ file, line, severity, msg });
  return { findings, record };
}

function emit(label, list, stream) {
  if (!list.length) return;
  stream.write(`\n${label} (${list.length}):\n`);
  for (const f of list) {
    stream.write(f.line != null ? `  ${f.file}:${f.line}  ${f.msg}\n` : `  ${f.file}  ${f.msg}\n`);
  }
}

// Print the findings and finish the script: errors → FAIL on stderr and
// exit 1; otherwise the ✓ summary on stdout. `unit` is the counted noun
// ("file", "script"); `detail` is spliced into the success line after
// "checked"; `suggestions: true` opts the suggestion severity into both
// summaries (the a11y-html gate uses it).
export function report(
  name,
  findings,
  { checked, unit = "file", detail = "", suggestions = false } = {},
) {
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warn");
  const suggests = findings.filter((f) => f.severity === "suggest");

  emit("✗ errors", errors, process.stderr);
  emit("⚠ warnings", warnings, process.stderr);
  emit("· suggestions", suggests, process.stderr);

  const tail = suggestions ? `, ${suggests.length} suggestion(s)` : "";
  if (errors.length) {
    const counts = `${errors.length} error(s), ${warnings.length} warning(s)${tail}`;
    process.stderr.write(`\nFAIL: ${counts} across ${checked} ${unit}(s).\n`);
    process.exit(1);
  }
  process.stdout.write(
    `✓ ${name}: ${checked} ${unit}(s) checked${detail}, ${warnings.length} warning(s)${tail}\n`,
  );
}
