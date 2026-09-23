// generate.mjs — regenerate every theme target from tokens.core.json + themes/*.json.
// Usage: bun scripts/generate.mjs [--out <dir>]
//   --out  write every generated file under <dir> (created if missing) instead
//          of the repo tree. Two runs from the same sources must agree
//          byte-for-byte — that determinism gate (justfile's generate-check,
//          package.nix's checks.generated, CI's validate.yml) replaces the
//          retired --check mode.
// The theming framework: tokens.core.json (structure) + themes/*.json (values).
// Platform targets recolor the reference files in platforms/_reference/.
const { readFileSync, writeFileSync, mkdirSync } = globalThis.process.getBuiltinModule('node:fs');
const { dirname, join } = globalThis.process.getBuiltinModule('node:path');
import { emitTokensCss, emitTokensData, emitGtkCss, emitDensityCss, deriveTarget, TARGETS, outPath } from './lib/emit.mjs';

const args = process.argv.slice(2);
if (args.includes('--help')) { console.log('generate.mjs — regenerate tokens.css, density.css, tokens-data.js and platforms/* from tokens.core.json + themes/*.json.\nUsage: bun scripts/generate.mjs [--out <dir>] [--help] [--version]'); process.exit(0); }
if (args.includes('--version')) { console.log(JSON.parse(readFileSync('tokens.core.json', 'utf8')).meta.version); process.exit(0); }
const outIdx = args.indexOf('--out');
const outDir = outIdx === -1 ? '.' : args[outIdx + 1];
if (!outDir) { console.error('--out requires a directory argument'); process.exit(1); }
mkdirSync(outDir, { recursive: true });

const core = JSON.parse(readFileSync('tokens.core.json', 'utf8'));
const themes = {};
for (const [slug, m] of Object.entries(core.meta.themes)) themes[slug] = JSON.parse(readFileSync(m.file, 'utf8'));
const survey = themes[core.meta.defaultTheme];

const put = (path, content) => {
  const target = join(outDir, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
  console.log(`wrote ${target}`);
};

put('tokens.css', emitTokensCss(core, themes));
put('density.css', emitDensityCss(core));
put('tokens-data.js', emitTokensData(core, themes));
// The showcase component bundle is built separately (Bun bundler, not emit.mjs):
// scripts/make-bundle.mjs compiles components/*/*.jsx into _ds_bundle.js, which
// every card.html loads.

for (const [refLight, refDark, pattern, priority, bare] of TARGETS) {
  const refs = { light: readFileSync(refLight, 'utf8'), dark: readFileSync(refDark, 'utf8') };
  for (const theme of Object.values(themes)) for (const mode of ['light', 'dark']) {
    put(outPath(pattern, theme, mode), deriveTarget(refs[mode], survey, theme, mode, priority, bare));
  }
}

// GTK: emitted per (theme, mode) — no reference recoloring, direct from tokens.
for (const theme of Object.values(themes)) for (const mode of ['light', 'dark'])
  put(`platforms/gtk/jylhis-${mode}.css`, emitGtkCss(theme, mode));
// Legacy shared name: jylhis-light, for consumers that import platforms/gtk/gtk.css.
put('platforms/gtk/gtk.css', emitGtkCss(themes[core.meta.defaultTheme], 'light'));
