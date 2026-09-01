// validate-a11y-css.mjs — CSS accessibility checks: every file that animates
// carries a prefers-reduced-motion guard; outline:none only with a
// :focus-visible replacement.
// Usage: bun scripts/validate-a11y-css.mjs [--help] [--version]
const { readFileSync, readdirSync, statSync } = globalThis.process.getBuiltinModule('node:fs');
const { join } = globalThis.process.getBuiltinModule('node:path');

const args = process.argv.slice(2);
if (args.includes('--help')) { console.log('validate-a11y-css.mjs — reduced-motion + focus-visible checks on project CSS.\nUsage: bun scripts/validate-a11y-css.mjs [--help] [--version]'); process.exit(0); }
if (args.includes('--version')) { console.log(JSON.parse(readFileSync('tokens.core.json', 'utf8')).meta.version); process.exit(0); }

const files = [];
const collect = (dir) => { try { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) { if (!p.includes('_reference') && !p.includes('node_modules')) collect(p); } else if (f.endsWith('.css')) files.push(p); } } catch {} };
for (const f of readdirSync('.')) if (f.endsWith('.css')) files.push(f);
collect('components'); collect('preview'); collect('mocks'); collect('platforms/shadcn'); collect('platforms/gtk');

let errors = 0;
const err = (f, m) => { console.error(`ERROR: ${f}: ${m}`); errors++; };

// The universal prefers-reduced-motion guard in colors_and_type.css neutralises
// motion across every first-party surface (a `* { transition-duration: … !important }`
// block imported by styles.css), so component/preview/mock CSS need not each repeat
// it. If that block is ever removed, this check fails loudly rather than silently
// leaving those surfaces unguarded.
const guardSrc = 'colors_and_type.css';
let universalGuard = false;
try {
  const g = readFileSync(guardSrc, 'utf8');
  universalGuard = /prefers-reduced-motion:\s*reduce[\s\S]*?\*[\s\S]*?\{[\s\S]*?transition-duration[^;}]*!important/.test(g);
} catch { /* handled below */ }
if (!universalGuard) err(guardSrc, 'universal prefers-reduced-motion guard (`* { transition-duration: … !important }`) is missing — first-party motion is no longer neutralised');

for (const f of files) {
  const t = readFileSync(f, 'utf8');
  const animates = /(^|[^-])(animation|transition)\s*:/m.test(t);
  const guarded = /prefers-reduced-motion/.test(t);
  // tokens.css only defines duration custom properties; motion.css owns its guard;
  // platforms/* are generated; first-party component/preview/mock CSS are covered
  // by the one universal guard in colors_and_type.css (checked above).
  const firstPartyCovered = universalGuard && (f.startsWith('components') || f.startsWith('preview') || f.startsWith('mocks'));
  const exempt = f === 'tokens.css' || f.startsWith('platforms/') || firstPartyCovered;
  if (animates && !guarded && !exempt) err(f, 'declares animation/transition without a prefers-reduced-motion guard');
  if (/outline\s*:\s*none/.test(t) && !/:focus-visible/.test(t)) err(f, 'outline: none without a :focus-visible replacement');
}
if (errors) { console.error(`${errors} error(s) across ${files.length} files`); process.exit(1); }
console.log(`ok — ${files.length} CSS files pass`);
