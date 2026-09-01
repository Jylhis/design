// emit.mjs — pure generation logic for the Jylhis theming framework.
// No IO, no node deps: usable from bun (scripts/generate.mjs) and the browser.
// Inputs: core = tokens.core.json, themes = { slug: themes/<slug>.json }.

export const hexToRgb = (h) => {
  const s = h.replace('#', '');
  const v = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
};
const chan = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
export const luminance = (h) => { const [r, g, b] = hexToRgb(h); return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b); };
export const contrast = (a, b) => { const l1 = luminance(a), l2 = luminance(b); const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]; return (hi + 0.05) / (lo + 0.05); };
export const round2 = (n) => Math.round(n * 100) / 100;

// Every colour role of a theme as { role: { light, dark } }, palette+syntax+status flattened.
export const roleMap = (t) => {
  const out = {};
  for (const section of ['palette', 'syntax', 'status']) for (const [k, v] of Object.entries(t[section] || {})) out[k] = v;
  return out;
};

const rgba = (hex, a) => { const [r, g, b] = hexToRgb(hex); return `rgba(${r}, ${g}, ${b}, ${a})`; };

// ── tokens.css ──────────────────────────────────────────────────────────────
const colorBlock = (t, mode) => {
  const p = t.palette, s = t.syntax, st = t.status, L = [];
  const v = (r) => p[r][mode];
  L.push('  /* Background */', `  --color-bg: ${v('bg')};`, `  --color-bg-subtle: ${v('bg-subtle')};`);
  L.push('  /* Surface */', `  --color-surface: ${v('surface')};`, `  --color-surface-raised: ${v('surface-raised')};`);
  L.push('  /* Text */', `  --color-text: ${v('text')};`, `  --color-text-muted: ${v('text-muted')};`, `  --color-text-heading: ${v('text-heading')};`, `  --color-text-faint: ${v('text-faint')};`);
  L.push('  /* Accent */', `  --color-accent: ${v('accent')};`, `  --color-accent-hover: ${v('accent-hover')};`, `  --color-brand: ${v('brand')};`, `  --color-selection-bg: ${v('selection-bg')};`, `  --color-cursor: ${v('cursor')};`);
  L.push('  /* Borders */', `  --color-border: ${v('border')};`, `  --color-border-strong: ${v('border-strong')};`, `  --color-decorator: ${v('decorator')};`, `  --color-contour: ${v('contour')};`);
  L.push('  /* Code */', `  --color-code-bg: ${v('bg-subtle')};`, `  --color-code-text: ${v('text')};`, `  --color-code-border: ${v('border')};`);
  L.push('  /* Syntax */');
  for (const [k, e] of Object.entries(s)) L.push(`  --color-${k.replace('syn-', 'syntax-')}: ${e[mode]};`);
  L.push(`  --color-syntax-tag: ${s['syn-type'][mode]};`);
  L.push('  /* Syntax emphasis — themes may carry meaning in weight/style instead of hue */');
  for (const [k, e] of Object.entries(s)) { const b = k.replace('syn-', 'syntax-'); L.push(`  --${b}-weight: ${e.weight || 400}; /* @kind other */`); L.push(`  --${b}-style: ${e.style || 'normal'}; /* @kind other */`); }
  L.push('  /* Status */');
  for (const [k, e] of Object.entries(st)) L.push(`  --color-${k}: ${e[mode]};`);
  L.push('  /* Foreground pairs */');
  for (const [role, pr] of Object.entries(t.pairs || {})) L.push(`  --color-${role}-foreground: ${p[pr.fg][mode]};`);
  L.push(`  --color-accent-subtle: ${rgba(v('accent'), (t.subtleAlpha || {})[mode] ?? 0.12)};`);
  L.push(`  --color-scrim: ${rgba(v('scrim'), (t.scrimAlpha || {})[mode] ?? 0.45)};`);
  return L.join('\n');
};

export const emitTokensCss = (core, themes) => {
  const def = themes[core.meta.defaultTheme];
  const T = core.typography, out = [];
  out.push('/*', ' * tokens.css — GENERATED from tokens.core.json + themes/*.json. Do not edit by hand.', ' * Theme: data-theme="<slug>" on <html> (default: ' + core.meta.defaultTheme + '). Mode: data-mode="light|dark" (default: light).', ' */', '');
  out.push(`/* ${def.meta.name} — ${def.meta.modes.light} (default) */`);
  out.push(':root {');
  out.push(colorBlock(def, 'light'));
  out.push('  /* Spacing */');
  for (const [k, v] of Object.entries(core.spacing)) out.push(`  --space-${k}: ${v};`);
  out.push('  /* Layout */');
  out.push(`  --layout-content-max: ${core.layout.contentMax};`, `  --layout-margin-width: ${core.layout.marginWidth};`, `  --layout-gap: ${core.layout.gap};`, `  --layout-padding-mobile: ${core.layout.paddingMobile};`);
  out.push('  /* Radii */');
  for (const [k, v] of Object.entries(core.radii)) out.push(`  --radius-${k}: ${v};`);
  out.push('  /* Border widths */');
  for (const [k, v] of Object.entries(core.borderWidth)) if (k !== 'notes') out.push(`  --border-${k}: ${v};`);
  out.push('  /* Z-index layers */');
  for (const [k, v] of Object.entries(core.zIndex)) if (k !== 'notes') out.push(`  --z-${k}: ${v}; /* @kind other */`);
  out.push(`  /* Breakpoints — reference only; @media rules repeat these literally: sm ${core.breakpoints.sm} · md ${core.breakpoints.md} */`);
  out.push(`  --breakpoint-sm: ${core.breakpoints.sm};`, `  --breakpoint-md: ${core.breakpoints.md};`);
  out.push('  /* Font families */');
  out.push(`  --font-display: "${T.display.family}", ${T.display.fallback};`);
  out.push(`  --font-body: "${T.body.family}", ${T.body.fallback};`);
  out.push(`  --font-mono: "${T.mono.family}", ${T.mono.fallback};`);
  out.push('  --font-heading: var(--font-display);');
  out.push('  /* Type scale */');
  T.scale.forEach((s, i) => out.push(`  --type-scale-${i}: ${s}rem;`));
  out.push('  /* Type scaling floors */');
  out.push(`  --type-readable-min: ${T.scaling.readableFloor};`, `  --type-floor: ${T.scaling.absoluteFloor};`);
  out.push('  /* Focus ring */');
  out.push(`  --focus-ring-width: ${core.focus.width};`, `  --focus-ring-offset: ${core.focus.offset};`, '  --focus-ring: var(--focus-ring-width) solid var(--color-accent);');
  out.push('  /* Transitions */');
  for (const [k, m] of Object.entries(core.motion)) out.push(`  --transition-${k}: ${m.duration} ${m.css}; /* @kind other */`);
  out.push('}', '');
  out.push(`/* ${def.meta.name} — ${def.meta.modes.dark} */`);
  out.push('[data-mode="dark"] {', colorBlock(def, 'dark'), '}', '');
  for (const [slug, t] of Object.entries(themes)) {
    if (slug === core.meta.defaultTheme) continue;
    const fontOverrides = [];
    for (const [k, f] of Object.entries(t.typography || {})) if (f.family) fontOverrides.push(`  --font-${k}: "${f.family}", ${f.fallback};`);
    out.push(`/* ${t.meta.name} — ${t.meta.modes.light} */`);
    out.push(`[data-theme="${slug}"] {`, colorBlock(t, 'light'), ...fontOverrides, '}', '');
    out.push(`/* ${t.meta.name} — ${t.meta.modes.dark} */`);
    out.push(`[data-theme="${slug}"][data-mode="dark"] {`, colorBlock(t, 'dark'), '}', '');
  }
  return out.join('\n');
};

// ── tokens-data.js ──────────────────────────────────────────────────────────
const themeData = (core, t) => {
  const roles = roleMap(t);
  const grounds = new Set(['bg', 'bg-subtle', 'surface', 'surface-raised', 'scrim', 'border', 'border-strong', 'decorator', 'selection-bg', 'cursor', 'accent-subtle']);
  const tag = (r) => (r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : 'fail');
  const swatchContrast = { light: {}, dark: {} };
  for (const mode of ['light', 'dark']) for (const [role, v] of Object.entries(roles)) {
    if (grounds.has(role)) continue;
    const ratio = round2(contrast(v[mode], t.palette.bg[mode]));
    swatchContrast[mode][role] = { ratio, tag: tag(ratio) };
  }
  const contrastPairs = (t.contrast || []).map((c) => ({ ...c, measured: round2(contrast(roles[c.fg][c.mode], t.palette[c.bg][c.mode])) }));
  return { meta: t.meta, palette: t.palette, syntax: t.syntax, status: t.status, ansi: t.ansi, pairs: t.pairs, swatchContrast, contrastPairs };
};
export const emitTokensData = (core, themes) => {
  const { meta: defMeta, ...def } = themeData(core, themes[core.meta.defaultTheme]);
  const data = { ...def, meta: { ...core.meta, theme: core.meta.defaultTheme, themeMeta: defMeta }, groups: core.groups, typography: core.typography, spacing: core.spacing, layout: core.layout, radii: core.radii, breakpoints: core.breakpoints, zIndex: core.zIndex, borderWidth: core.borderWidth, focus: core.focus, density: core.density, motion: core.motion, themes: Object.fromEntries(Object.entries(themes).map(([s, t]) => [s, themeData(core, t)])) };
  return '// tokens-data.js — GENERATED from tokens.core.json + themes/*.json. Do not edit by hand.\n' +
    '// Top level mirrors the default theme (' + core.meta.defaultTheme + ') for compatibility; every theme lives under `themes`.\n' +
    '// Includes derived data: contrastPairs (measured fg×bg×mode) and swatchContrast (role vs bg).\n' +
    'export const tokens = ' + JSON.stringify(data, null, 2) + ';\n';
};

// ── platform recoloring ─────────────────────────────────────────────────────
// A platform target is derived from a committed reference file (the Survey
// original) by role-mapped recoloring + slug renaming. Priority decides which
// role a hex belongs to when Survey aliases one hex across roles:
//   ui      → palette > status > ansi > syntax   (chrome targets)
//   syntax  → syntax > status > palette > ansi   (editor/highlighter targets)
export const buildHexMap = (from, to, mode, priority) => {
  const order = priority === 'syntax' ? ['syntax', 'status', 'palette', 'ansi'] : ['palette', 'status', 'ansi', 'syntax'];
  const map = {};
  for (const sec of order) {
    const f = sec === 'ansi' ? Object.fromEntries(from.ansi.map((a) => [a.name, a])) : from[sec];
    const t = sec === 'ansi' ? Object.fromEntries(to.ansi.map((a) => [a.name, a])) : to[sec];
    for (const [role, e] of Object.entries(f)) {
      const old = e[mode].toLowerCase();
      if (!(old in map) && t[role]) map[old] = t[role][mode];
    }
  }
  return map;
};
// `bare` also rewrites quoted bare hex (e.g. base00: "f6f8fb"), which the
// #-anchored pass misses — base16 + console quote colours without a leading #.
export const recolor = (text, map, bare = false) => {
  let out = text.replace(/#[0-9a-fA-F]{6}\b/g, (h) => map[h.toLowerCase()] || h);
  if (bare) out = out.replace(/(['"])([0-9a-fA-F]{6})\1/g, (m, q, h) => {
    const to = map['#' + h.toLowerCase()]; // buildHexMap keys carry the leading #
    if (!to) return m;
    const toHex = to.replace('#', '');
    // identity map (same theme, e.g. Survey→Survey) must not touch the byte —
    // keep the reference's original casing.
    return toHex.toLowerCase() === h.toLowerCase() ? m : `${q}${toHex}${q}`;
  });
  return out;
};
export const renameSlugs = (text, toTheme, mode) => {
  const slug = `${toTheme.meta.slug}-${mode}`;
  const Pascal = toTheme.meta.slug[0].toUpperCase() + toTheme.meta.slug.slice(1) + (mode === 'light' ? 'Light' : 'Dark');
  const label = `${toTheme.meta.name} ${mode === 'light' ? 'Light' : 'Dark'}`;
  const [fromSlug, fromPascal, fromLabel] = mode === 'light' ? ['sheet', 'Sheet', 'Sheet'] : ['field', 'Field', 'Field'];
  return text
    .replaceAll(`jylhis-${fromSlug}`, `jylhis-${slug}`)
    .replaceAll(`Jylhis${fromPascal}`, `Jylhis${Pascal}`)
    .replaceAll(`Jylhis ${fromLabel}`, `Jylhis ${label}`)
    .replace(new RegExp(`\\b${fromLabel}\\b`, 'g'), label)
    .replace(new RegExp(`\\b${fromSlug}\\b`, 'g'), slug);
};
export const deriveTarget = (refText, fromTheme, toTheme, mode, priority, bare = false) =>
  renameSlugs(recolor(refText, buildHexMap(fromTheme, toTheme, mode, priority), bare), toTheme, mode);

// Reference file registry: [refLight, refDark, outPattern, priority, bare?]
// {t} = theme slug, {m} = light|dark, {P} = PascalThemeMode.
// bare=true for targets that quote hex without a leading # (base16, console).
export const TARGETS = [
  ['platforms/_reference/ghostty/jylhis-sheet', 'platforms/_reference/ghostty/jylhis-field', 'platforms/ghostty/jylhis-{t}-{m}', 'ui'],
  ['platforms/_reference/rofi/jylhis-sheet.rasi', 'platforms/_reference/rofi/jylhis-field.rasi', 'platforms/rofi/jylhis-{t}-{m}.rasi', 'ui'],
  ['platforms/_reference/hyprland/jylhis-sheet.conf', 'platforms/_reference/hyprland/jylhis-field.conf', 'platforms/hyprland/jylhis-{t}-{m}.conf', 'ui'],
  ['platforms/_reference/gimp/jylhis-sheet.gpl', 'platforms/_reference/gimp/jylhis-field.gpl', 'platforms/gimp/jylhis-{t}-{m}.gpl', 'ui'],
  ['platforms/_reference/base16/jylhis-sheet.yaml', 'platforms/_reference/base16/jylhis-field.yaml', 'platforms/base16/jylhis-{t}-{m}.yaml', 'ui', true],
  ['platforms/_reference/console/jylhis-sheet.nix', 'platforms/_reference/console/jylhis-field.nix', 'platforms/console/jylhis-{t}-{m}.nix', 'ui', true],
  ['platforms/_reference/kvantum/JylhisSheet.colors', 'platforms/_reference/kvantum/JylhisField.colors', 'platforms/kvantum/Jylhis{P}.colors', 'ui'],
  ['platforms/_reference/mako/config-sheet', 'platforms/_reference/mako/config', 'platforms/mako/config-{t}-{m}', 'ui'],
  ['platforms/_reference/waybar/style-sheet.css', 'platforms/_reference/waybar/style.css', 'platforms/waybar/style-{t}-{m}.css', 'ui'],
  ['platforms/_reference/shell/fzf-sheet.sh', 'platforms/_reference/shell/fzf-field.sh', 'platforms/shell/fzf-{t}-{m}.sh', 'ui'],
  ['platforms/_reference/bat/jylhis-sheet.tmTheme', 'platforms/_reference/bat/jylhis-field.tmTheme', 'platforms/bat/jylhis-{t}-{m}.tmTheme', 'syntax'],
  ['platforms/_reference/emacs/jylhis-sheet-theme.el', 'platforms/_reference/emacs/jylhis-field-theme.el', 'platforms/emacs/jylhis-{t}-{m}-theme.el', 'syntax'],
];
export const outPath = (pattern, theme, mode) => {
  const P = theme.meta.slug[0].toUpperCase() + theme.meta.slug.slice(1) + (mode === 'light' ? 'Light' : 'Dark');
  return pattern.replaceAll('{t}', theme.meta.slug).replaceAll('{m}', mode).replaceAll('{P}', P);
};
