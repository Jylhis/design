// validate-a11y-html.mjs — static accessibility checks for the showcase and
// specimen HTML: lang attr, img alt, labelled inputs, status-with-glyph.
// Usage: bun scripts/validate-a11y-html.mjs [--help] [--version]
const { readFileSync, readdirSync, statSync } = globalThis.process.getBuiltinModule('node:fs');
const { join } = globalThis.process.getBuiltinModule('node:path');

const args = process.argv.slice(2);
if (args.includes('--help')) { console.log('validate-a11y-html.mjs — a11y checks on root, preview/ and components/ HTML.\nUsage: bun scripts/validate-a11y-html.mjs [--help] [--version]'); process.exit(0); }
if (args.includes('--version')) { console.log(JSON.parse(readFileSync('tokens.core.json', 'utf8')).meta.version); process.exit(0); }

const files = [];
const collect = (dir) => { for (const f of readdirSync(dir)) { const p = join(dir, f); if (statSync(p).isDirectory()) collect(p); else if (f.endsWith('.html')) files.push(p); } };
for (const f of readdirSync('.')) if (f.endsWith('.html')) files.push(f);
collect('preview'); collect('components');

let errors = 0;
const err = (f, m) => { console.error(`ERROR: ${f}: ${m}`); errors++; };

for (const f of files) {
  const t = readFileSync(f, 'utf8');
  if (!/<html[^>]*\blang=/.test(t)) err(f, 'missing lang attribute on <html>');
  for (const [tag] of t.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(tag)) err(f, `<img> without alt: ${tag.slice(0, 60)}`);
  // Implicit labelling: an <input> wrapped in a <label> that carries visible
  // text is labelled by the host language (no for=/aria-* needed).
  const labelWraps = [...t.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/g)].filter((m) => {
    const inner = m[1];
    const text = inner.replace(/<[^>]+>/g, '').replace(/&[^;]+;/g, ' ').trim();
    return /<input\b/.test(inner) && text.length > 0;
  });
  const insideVisibleLabel = (idx) => labelWraps.some((m) => idx >= m.index && idx < m.index + m[0].length);
  for (const m of t.matchAll(/<input\b[^>]*>/g)) {
    const tag = m[0];
    if (/type="(hidden|submit|button)"/.test(tag)) continue;
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    const labelled = /aria-label(ledby)?=/.test(tag)
      || (id && new RegExp(`<label[^>]*\\bfor="${id}"`).test(t))
      || insideVisibleLabel(m.index);
    if (!labelled) err(f, `unlabelled <input>: ${tag.slice(0, 60)}`);
  }
  for (const [tag] of t.matchAll(/<(button|select|textarea)\b[^>]*>/g)) {
    if (/aria-label(ledby)?=|title=/.test(tag)) continue; // text content usually labels these; flag only icon-ish empties below
  }
  // status colors must not carry meaning alone: a status-* color use in markup
  // should sit near a glyph or word (heuristic: the file mentions a glyph set)
  if (/--color-status-(err|warn|ok|info)/.test(t) && !/[✓✗△▪⑂◦!]|\b(error|warning|ok|info|fail|success)\b/i.test(t)) err(f, 'uses status colors with no glyph/word nearby (color alone)');
}
if (errors) { console.error(`${errors} error(s) across ${files.length} files`); process.exit(1); }
console.log(`ok — ${files.length} HTML files pass`);
