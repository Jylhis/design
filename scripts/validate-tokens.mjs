// validate-tokens.mjs — schema, grouping, WCAG contrast, and CSS var resolution
// for the theming framework (tokens.core.json + themes/*.json + tokens.css).
// Usage: bun scripts/validate-tokens.mjs [--help] [--version]
const { readFileSync } = globalThis.process.getBuiltinModule('node:fs');
import { contrast, roleMap } from './lib/emit.mjs';

const args = process.argv.slice(2);
if (args.includes('--help')) { console.log('validate-tokens.mjs — validate tokens.core.json + themes/*.json + tokens.css.\nUsage: bun scripts/validate-tokens.mjs [--help] [--version]'); process.exit(0); }
const core = JSON.parse(readFileSync('tokens.core.json', 'utf8'));
if (args.includes('--version')) { console.log(core.meta.version); process.exit(0); }

let errors = 0;
const err = (m) => { console.error(`ERROR: ${m}`); errors++; };
const HEX = /^#[0-9a-f]{6}$/i;

const themes = {};
for (const [slug, m] of Object.entries(core.meta.themes)) themes[slug] = JSON.parse(readFileSync(m.file, 'utf8'));
if (!themes[core.meta.defaultTheme]) err(`defaultTheme "${core.meta.defaultTheme}" is not a registered theme`);

// every colour role belongs to exactly one group; no group claims an unknown role
const grouped = new Map();
for (const [g, def] of Object.entries(core.groups)) for (const r of def.members) {
  if (grouped.has(r)) err(`role "${r}" claimed by groups "${grouped.get(r)}" and "${g}"`);
  grouped.set(r, g);
}

for (const [slug, t] of Object.entries(themes)) {
  const roles = roleMap(t);
  for (const [role, e] of Object.entries(roles)) {
    for (const mode of ['light', 'dark']) {
      if (!HEX.test(e[mode] || '')) err(`${slug}: ${role}.${mode} is not a 6-digit hex (${e[mode]})`);
    }
    if (!grouped.has(role) && !t.ansi.some((a) => a.name === role)) err(`${slug}: role "${role}" is not registered in any tokens.core.json group`);
  }
  for (const r of grouped.keys()) {
    if (core.groups.spectrum.members.includes(r)) { if (!t.ansi.some((a) => a.name === r)) err(`${slug}: missing ANSI slot "${r}"`); }
    else if (!roles[r]) err(`${slug}: group member "${r}" is not defined by the theme`);
  }
  if (t.ansi.length !== 16) err(`${slug}: ANSI palette must have 16 slots, has ${t.ansi.length}`);
  const a11 = t.ansi.find((a) => a.name === 'bright-yellow');
  for (const mode of ['light', 'dark']) if (a11 && a11[mode] !== t.palette.accent[mode]) err(`${slug}: ANSI 11 (${a11[mode]}) must equal the accent (${t.palette.accent[mode]}) in ${mode} mode`);
  for (const mode of ['light', 'dark']) if (t.palette.brand[mode] === t.status['status-err'][mode]) err(`${slug}: brand must stay distinct from status-err (${mode})`);
  for (const c of t.contrast || []) {
    const measured = contrast(roles[c.fg][c.mode], t.palette[c.bg][c.mode]);
    if (measured < c.min) err(`${slug}: contrast ${c.fg} on ${c.bg} (${c.mode}) = ${measured.toFixed(2)}:1, claims ≥ ${c.min}:1`);
  }
  for (const [role, p] of Object.entries(t.pairs || {})) for (const mode of ['light', 'dark']) {
    const measured = contrast(roles[p.fg][mode], t.palette[role][mode]);
    if (measured < p.min) err(`${slug}: pair ${p.fg} on ${role} (${mode}) = ${measured.toFixed(2)}:1, claims ≥ ${p.min}:1`);
  }
}

// tokens.css: every var() it references must be defined in it
const css = readFileSync('tokens.css', 'utf8');
const defined = new Set([...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
for (const [, ref] of css.matchAll(/var\((--[a-z0-9-]+)/g)) if (!defined.has(ref)) err(`tokens.css references undefined ${ref}`);

if (errors) { console.error(`${errors} error(s)`); process.exit(1); }
console.log(`ok — ${Object.keys(themes).length} themes validated (${Object.keys(themes).join(', ')})`);
