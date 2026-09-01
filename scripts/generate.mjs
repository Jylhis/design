// generate.mjs — regenerate every theme target from tokens.core.json + themes/*.json.
// Usage: bun scripts/generate.mjs [--check]
//   --check  exit 1 if committed files diverge from the token sources (CI mode).
// See docs/THEMING.md for the theming framework and how to add a theme.
const { readFileSync, writeFileSync, existsSync, mkdirSync } = globalThis.process.getBuiltinModule('node:fs');
const { dirname } = globalThis.process.getBuiltinModule('node:path');
import { emitTokensCss, emitTokensData, deriveTarget, TARGETS, outPath } from './lib/emit.mjs';

const args = process.argv.slice(2);
if (args.includes('--help')) { console.log('generate.mjs — regenerate tokens.css, tokens-data.js and platforms/* from tokens.core.json + themes/*.json.\nUsage: bun scripts/generate.mjs [--check] [--help] [--version]'); process.exit(0); }
if (args.includes('--version')) { console.log(JSON.parse(readFileSync('tokens.core.json', 'utf8')).meta.version); process.exit(0); }
const check = args.includes('--check');

const core = JSON.parse(readFileSync('tokens.core.json', 'utf8'));
const themes = {};
for (const [slug, m] of Object.entries(core.meta.themes)) themes[slug] = JSON.parse(readFileSync(m.file, 'utf8'));
const survey = themes[core.meta.defaultTheme];

let dirty = 0;
const put = (path, content) => {
  if (check) {
    const cur = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (cur !== content) { console.error(`DIVERGED: ${path}`); dirty++; }
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log(`wrote ${path}`);
};

put('tokens.css', emitTokensCss(core, themes));
put('tokens-data.js', emitTokensData(core, themes));

for (const [refLight, refDark, pattern, priority, bare] of TARGETS) {
  const refs = { light: readFileSync(refLight, 'utf8'), dark: readFileSync(refDark, 'utf8') };
  for (const theme of Object.values(themes)) for (const mode of ['light', 'dark']) {
    put(outPath(pattern, theme, mode), deriveTarget(refs[mode], survey, theme, mode, priority, bare));
  }
}

if (check && dirty) { console.error(`${dirty} generated file(s) out of date — run: bun scripts/generate.mjs`); process.exit(1); }
if (check) console.log('all generated files in sync');
