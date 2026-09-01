// validate-cli-conventions.mjs — every bun script in scripts/ follows
// docs/CLI-TUI-GUIDELINES.md: --help, --version, errors to stderr, exit codes.
// Usage: bun scripts/validate-cli-conventions.mjs [--help] [--version]
const { readFileSync, readdirSync } = globalThis.process.getBuiltinModule('node:fs');

const args = process.argv.slice(2);
if (args.includes('--help')) { console.log('validate-cli-conventions.mjs — CLI convention checks on scripts/*.mjs.\nUsage: bun scripts/validate-cli-conventions.mjs [--help] [--version]'); process.exit(0); }
if (args.includes('--version')) { console.log(JSON.parse(readFileSync('tokens.core.json', 'utf8')).meta.version); process.exit(0); }

let errors = 0;
const err = (f, m) => { console.error(`ERROR: ${f}: ${m}`); errors++; };
const scripts = readdirSync('scripts').filter((f) => f.endsWith('.mjs'));
for (const f of scripts) {
  const p = `scripts/${f}`;
  const t = readFileSync(p, 'utf8');
  if (!t.includes('--help')) err(p, 'does not implement --help');
  if (!t.includes('--version')) err(p, 'does not implement --version');
  if (!/console\.error/.test(t)) err(p, 'never writes to stderr (errors must go to stderr)');
  if (!/process\.exit\(1\)|process\.exit\(dirty|exitCode/.test(t) && !/generate/.test(f)) err(p, 'has no non-zero exit path');
}
if (errors) { console.error(`${errors} error(s) across ${scripts.length} scripts`); process.exit(1); }
console.log(`ok — ${scripts.length} scripts follow the CLI conventions`);
