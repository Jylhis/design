#!/usr/bin/env bun
// Jylhis design system — live site freshness checker.
//
// Fetches the live jylhis.com CSS files and diffs them against the reference
// copies in source_styles/. Reports drift; exits non-zero when drift exceeds
// the configured threshold.
//
// Exit codes:
//   0  clean — no drift, or drift within threshold (warn-only mode)
//   1  drift exceeds --threshold
//   2  fetch or usage error
//
// Run: bun scripts/validate-consumer-freshness.mjs
// CI:  .github/workflows/freshness-check.yml

import { writeFileSync, unlinkSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const VERSION = "1.0.0";

const HELP = `\
Usage: validate-consumer-freshness [options]

Fetches live jylhis.com CSS files and diffs them against reference copies in
source_styles/. Any drift is reported; exit 1 when it exceeds --threshold.

Options:
  -h, --help                Print this help and exit
      --version             Print version and exit
  -t, --threshold N         Changed-line count that triggers exit 1.
                            Omit for warn-only mode (any drift prints a
                            warning but exits 0).
      --url-global URL      Live URL for global.css
                            (default: https://jylhis.com/global.css)
      --url-typography URL  Live URL for typography.css
                            (default: https://jylhis.com/typography.css)
  -F, --format FMT          Output format: text (default) | json
  -q, --quiet               Suppress non-error stdout

Exit codes:
  0  clean — no drift, or within threshold
  1  drift exceeds --threshold
  2  fetch or usage error
`;

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write(HELP);
  process.exit(0);
}
if (process.argv.includes("--version")) {
  process.stdout.write(`validate-consumer-freshness ${VERSION}\n`);
  process.exit(0);
}

let opts;
try {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      threshold: { type: "string", short: "t" },
      "url-global": { type: "string" },
      "url-typography": { type: "string" },
      format: { type: "string", short: "F" },
      quiet: { type: "boolean", short: "q" },
    },
    strict: true,
  });
  opts = values;
} catch (e) {
  process.stderr.write(`error: ${e.message}\nRun --help for usage.\n`);
  process.exit(2);
}

const threshold =
  opts.threshold !== undefined ? parseInt(opts.threshold, 10) : null;
if (opts.threshold !== undefined && (isNaN(threshold) || threshold < 0)) {
  process.stderr.write(
    "error: --threshold must be a non-negative integer\nRun --help for usage.\n",
  );
  process.exit(2);
}

const fmt = opts.format ?? "text";
if (fmt !== "text" && fmt !== "json") {
  process.stderr.write(
    `error: --format must be "text" or "json"\nRun --help for usage.\n`,
  );
  process.exit(2);
}

const quiet = opts.quiet ?? false;

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const TARGETS = [
  {
    name: "global.css",
    url: opts["url-global"] ?? "https://jylhis.com/global.css",
    local: "source_styles/global.css",
  },
  {
    name: "typography.css",
    url: opts["url-typography"] ?? "https://jylhis.com/typography.css",
    local: "source_styles/typography.css",
  },
];

// ── Fetch and diff each target ────────────────────────────────────────

const results = [];
let anyFetchError = false;

for (const target of TARGETS) {
  let remoteText;
  try {
    const resp = await fetch(target.url);
    if (!resp.ok)
      throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    remoteText = await resp.text();
  } catch (err) {
    process.stderr.write(
      `error: fetch failed for ${target.name} (${target.url}): ${err.message}\n`,
    );
    anyFetchError = true;
    results.push({ name: target.name, url: target.url, error: err.message });
    continue;
  }

  const localPath = resolve(ROOT, target.local);
  const tmpPath = `/tmp/jylhis-freshness-${process.pid}-${target.name}`;
  writeFileSync(tmpPath, remoteText, "utf8");

  let diffText = "";
  let changedLines = 0;
  let diffError = false;

  try {
    execFileSync("diff", ["-u", localPath, tmpPath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    // diff exits 0: files are identical
  } catch (err) {
    if (err.status === 1) {
      diffText = err.stdout;
      changedLines = diffText
        .split("\n")
        .filter(
          (l) =>
            (l.startsWith("+") || l.startsWith("-")) &&
            !l.startsWith("+++") &&
            !l.startsWith("---"),
        ).length;
    } else {
      process.stderr.write(
        `error: diff command failed for ${target.name}: ${err.stderr ?? err.message}\n`,
      );
      diffError = true;
      anyFetchError = true;
    }
  } finally {
    try {
      unlinkSync(tmpPath);
    } catch {
      // ignore temp-file cleanup errors
    }
  }

  results.push({
    name: target.name,
    url: target.url,
    local: target.local,
    changedLines: diffError ? null : changedLines,
    diffText,
    error: diffError ? "diff command failed" : null,
  });
}

// ── Report ────────────────────────────────────────────────────────────

const totalChanged = results.reduce(
  (sum, r) => sum + (r.changedLines ?? 0),
  0,
);
const hasDrift = totalChanged > 0;
const overThreshold = threshold !== null && totalChanged > threshold;

if (fmt === "json") {
  process.stdout.write(
    JSON.stringify(
      {
        threshold,
        totalChangedLines: totalChanged,
        overThreshold,
        warnOnly: threshold === null,
        files: results.map((r) => ({
          name: r.name,
          url: r.url,
          changedLines: r.changedLines ?? null,
          error: r.error ?? null,
        })),
      },
      null,
      2,
    ) + "\n",
  );
} else if (!quiet) {
  if (!hasDrift && !anyFetchError) {
    process.stdout.write(
      `✓ consumer-freshness: ${results.length} file(s) checked, no drift\n`,
    );
  } else {
    for (const r of results) {
      if (r.error) continue;
      if (r.changedLines === 0) {
        process.stdout.write(`  ${r.name}: identical\n`);
        continue;
      }
      const mark = overThreshold ? "x" : "!";
      process.stdout.write(
        `${mark} ${r.name}: ${r.changedLines} changed line(s)\n`,
      );
      if (r.diffText) process.stdout.write(r.diffText);
    }
  }
}

if (hasDrift) {
  if (overThreshold) {
    process.stderr.write(
      `FAIL: ${totalChanged} changed line(s) exceeds threshold of ${threshold} — update source_styles/ or the live site\n`,
    );
  } else if (threshold === null) {
    process.stderr.write(
      `warn: ${totalChanged} changed line(s) detected between source_styles/ and live site — update source_styles/ to clear this warning\n`,
    );
  }
}

if (anyFetchError && results.every((r) => r.error)) {
  // All targets failed — nothing useful to report
  process.exit(2);
}
if (anyFetchError) {
  // Partial fetch failure; report what we know but treat as error
  process.exit(2);
}
if (overThreshold) {
  process.exit(1);
}
process.exit(0);
