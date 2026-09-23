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
  if (p['destructive']) L.push(`  --color-destructive: ${v('destructive')};`);
  L.push('  /* Borders */', `  --color-border: ${v('border')};`, `  --color-border-strong: ${v('border-strong')};`, `  --color-decorator: ${v('decorator')};`, `  --color-contour: ${v('contour')};`);
  L.push('  /* Code */', `  --color-code-bg: ${v('bg-subtle')};`, `  --color-code-text: ${v('text')};`, `  --color-code-border: ${v('border')};`);
  L.push('  /* Syntax */');
  for (const [k, e] of Object.entries(s)) L.push(`  --color-${k.replace('syn-', 'syntax-')}: ${e[mode]};`);
  L.push(`  --color-syntax-tag: ${s['syn-type'][mode]};`);
  L.push('  /* Syntax emphasis — themes may carry meaning in weight/style instead of hue */');
  for (const [k, e] of Object.entries(s)) { const b = k.replace('syn-', 'syntax-'); L.push(`  --${b}-weight: ${e.weight || 400}; /* @kind other */`); L.push(`  --${b}-style: ${e.style || 'normal'}; /* @kind other */`); }
  L.push('  /* Status */');
  for (const [k, e] of Object.entries(st)) L.push(`  --color-${k}: ${e[mode]};`);
  // Chromatic ramps — 7 steps per seed, solved as contrast against their own
  // ground so a step number means the same thing in every scope.
  if (t.ramps) {
    L.push('  /* Ramps — 7 measured steps; components use the semantic roles, not steps */');
    for (const [fam, steps] of Object.entries(t.ramps)) {
      if (!steps[mode]) continue;
      L.push(...steps[mode].map((h, i) => `  --color-${fam}-${i + 1}: ${h};`));
    }
  }
  if (t.palette['accent-subtle']) L.push(`  --color-accent-subtle: ${v('accent-subtle')};`);
  if (t.shadowFloat) L.push(`  --shadow-float: ${t.shadowFloat[mode]}; /* @kind shadow */`);
  // Foreground pairs
  for (const [role, pr] of Object.entries(t.pairs || {})) L.push(`  --color-${role}-foreground: ${p[pr.fg][mode]};`);
  L.push(`  --color-scrim: ${rgba(v('scrim'), (t.scrimAlpha || {})[mode] ?? 0.45)};`);
  return L.join('\n');
};

export const emitTokensCss = (core, themes) => {
  const def = themes[core.meta.defaultTheme];
  const T = core.typography, out = [];
  out.push('/*', ' * tokens.css — GENERATED from tokens.core.json + themes/jylhis.json. Do not edit by hand.',
    ' * Modes: data-mode="light|dark" on <html> (default: light).', ' */', '');
  out.push(`/* ${def.meta.name} — ${def.meta.modes.light} (default) */`);
  out.push(':root {');
  out.push(colorBlock(def, 'light'));
  out.push('  /* Spacing */');
  for (const [k, v] of Object.entries(core.spacing)) out.push(`  --space-${k}: ${v};`);
  out.push('  /* Layout */');
  out.push(`  --layout-content-max: ${core.layout.contentMax};`, `  --layout-margin-width: ${core.layout.marginWidth};`, `  --layout-gap: ${core.layout.gap};`, `  --layout-padding-mobile: ${core.layout.paddingMobile};`);
  out.push('  /* Radii */');
  for (const [k, v] of Object.entries(core.radii)) if (k !== 'notes') out.push(`  --radius-${k}: ${v};`);
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
  if (T.numeric) out.push(`  --font-numeric: "${T.numeric.family}", ${T.numeric.fallback};`);
  out.push('  --font-heading: var(--font-display);');
  out.push('  /* Type scale */');
  T.scale.forEach((s, i) => out.push(`  --type-scale-${i}: ${s}rem;`));
  out.push('  /* Type scaling floors */');
  out.push(`  --type-readable-min: ${T.scaling.readableFloor};`, `  --type-floor: ${T.scaling.absoluteFloor};`);
  out.push('  /* Density — the default box; density.css owns the full axis */');
  const dd = core.density.default;
  out.push(`  --cell-h: ${dd.cellH};`, `  --control-h: ${dd.controlH};`, `  --touch-min: ${dd.touchMin};`);
  out.push('  /* Focus ring */');
  out.push(`  --focus-ring-width: ${core.focus.width};`, `  --focus-ring-offset: ${core.focus.offset};`, '  --focus-ring: var(--focus-ring-width) solid var(--color-accent);');
  out.push('  /* Transitions */');
  for (const [k, m] of Object.entries(core.motion)) out.push(`  --transition-${k}: ${m.duration} ${m.css}; /* @kind other */`);
  out.push('}', '');
  out.push(`/* ${def.meta.name} — ${def.meta.modes.dark} */`);
  out.push('[data-mode="dark"] {', colorBlock(def, 'dark'), '}', '');
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
  const rampContrast = {};
  for (const [fam, steps] of Object.entries(t.ramps || {})) {
    rampContrast[fam] = {};
    for (const mode of ['light', 'dark']) {
      rampContrast[fam][mode] = steps[mode].map((h) => {
        const ratio = round2(contrast(h, t.palette.bg[mode]));
        return { hex: h, ratio, tag: tag(ratio) };
      });
    }
  }
  return { meta: t.meta, palette: t.palette, syntax: t.syntax, status: t.status, ramps: t.ramps, shadowFloat: t.shadowFloat, ansi: t.ansi, pairs: t.pairs, swatchContrast, contrastPairs, ...(rampContrast && Object.keys(rampContrast).length ? { rampContrast } : {}) };
};
export const emitTokensData = (core, themes) => {
  const { meta: defMeta, ...def } = themeData(core, themes[core.meta.defaultTheme]);
  const data = { ...def, meta: { ...core.meta, theme: 'jylhis', themeMeta: defMeta }, groups: core.groups, typography: core.typography, spacing: core.spacing, layout: core.layout, radii: core.radii, breakpoints: core.breakpoints, zIndex: core.zIndex, borderWidth: core.borderWidth, focus: core.focus, density: core.density, motion: core.motion };
  return '// tokens-data.js — GENERATED from tokens.core.json + themes/jylhis.json. Do not edit by hand.\n' +
    '// Single theme: top level IS the theme. Includes contrastPairs + swatchContrast.\n' +
    'export const tokens = ' + JSON.stringify(data, null, 2) + ';\n';
};

// ── density.css ─────────────────────────────────────────────────────────────
// The data-density axis: three scopes on <html> (comfortable, default,
// compact). Only the box changes; type size does not. Row and control heights
// are the tokens components read (--cell-h, --control-h); the spacing steps
// below md are remapped with them. Values come from tokens.core.json#density.
export const emitDensityCss = (core) => {
  const d = core.density;
  const box = (tier) => {
    const t = d[tier];
    return [
      `  --cell-h: ${t.cellH};`,
      `  --control-h: ${t.controlH};`,
      `  --touch-min: ${t.touchMin};`,
      `  --density-gutter: ${t.gutter};`,
      `  --density-row-gap: ${t.rowGap};`,
    ];
  };
  const L = [];
  L.push('/*', ' * density.css — the data-density axis.', ' *', ' * Three scopes on <html>: comfortable, default, compact. Only the box changes;', ' * type size does not. Row and control heights are the tokens components read', ' * (--cell-h, --control-h); the spacing steps below md are remapped with them,', ' * because a tighter row with the same gutters just looks cramped.', ' *', ' * 40px is the default floor and 32px the absolute one. 44px is a guideline', ' * drawn for imprecise thumbs on glass; these rows are full-width with the whole', ' * row as the target, and 40px buys a visible extra row on a phone.', ' */', '');
  L.push(':root,', '[data-density="default"] {', ...box('default'), '}', '');
  L.push('[data-density="comfortable"] {', ...box('comfortable'));
  for (const [k, v] of Object.entries(d.comfortable.space || {})) L.push(`  --space-${k}: ${v};`);
  L.push('}', '');
  L.push('[data-density="compact"] {', ...box('compact'));
  for (const [k, v] of Object.entries(d.compact.space || {})) L.push(`  --space-${k}: ${v};`);
  L.push('}', '');
  L.push('/* Coarse pointers never get the compact box, whatever the attribute says.', '   32px is a fine-pointer floor and nothing else. */', '@media (pointer: coarse) {', '  [data-density="compact"] {', `    --cell-h: ${d.coarsePointerFloor};`, `    --control-h: ${d.coarsePointerFloor};`, `    --touch-min: ${d.coarsePointerFloor};`, '  }', '}', '');
  return L.join('\n');
};

// ── gtk.css ─────────────────────────────────────────────────────────────────
// GTK3/4 Adwaita override, emitted per (theme, mode) polarity. Top-level
// @define-color only: GTK3 cannot parse custom properties, and GTK4 user CSS
// loads after the theme, so a .dark custom-prop block can never win. Polarity
// is chosen at install time by picking the file.
export const emitGtkCss = (t, mode) => {
  const p = t.palette, st = t.status;
  const v = (r) => p[r][mode];
  const fg = v('bg'); // foreground-on-fill is the opposite ground
  const L = [];
  L.push(`/* Jylhis GTK 3 / GTK 4 theme overrides — ${t.meta.name} ${mode === 'light' ? 'Light' : 'Dark'}`,
    ' * GENERATED from themes/' + t.meta.slug + '.json. Do not edit by hand.',
    ' * Install as ~/.config/gtk-3.0/gtk.css AND ~/.config/gtk-4.0/gtk.css',
    ' * for the polarity this file carries (GTK has no runtime variant switch',
    ' * for user CSS). Pair with the matching gsettings:',
    mode === 'light'
      ? " *   gsettings set org.gnome.desktop.interface color-scheme prefer-light"
      : " *   gsettings set org.gnome.desktop.interface color-scheme prefer-dark",
    ' */', '');
  L.push('@define-color accent_color          ' + v('accent') + ';',
    '@define-color accent_bg_color       ' + v('accent') + ';',
    '@define-color accent_fg_color       ' + fg + ';',
    '@define-color accent_hover          ' + v('accent-hover') + ';', '');
  L.push('@define-color destructive_color     ' + st['status-err'][mode] + ';',
    '@define-color destructive_bg_color  ' + st['status-err'][mode] + ';',
    '@define-color destructive_fg_color  ' + fg + ';',
    '@define-color success_color         ' + st['status-ok'][mode] + ';',
    '@define-color success_bg_color      ' + st['status-ok'][mode] + ';',
    '@define-color success_fg_color      ' + fg + ';',
    '@define-color warning_color         ' + st['status-warn'][mode] + ';',
    '@define-color warning_bg_color      ' + st['status-warn'][mode] + ';',
    '@define-color warning_fg_color      ' + fg + ';',
    '@define-color error_color           ' + st['status-err'][mode] + ';',
    '@define-color error_bg_color        ' + st['status-err'][mode] + ';',
    '@define-color error_fg_color        ' + fg + ';', '');
  L.push('@define-color window_bg_color        ' + v('bg') + ';',
    '@define-color window_fg_color        ' + v('text') + ';',
    '@define-color view_bg_color          ' + v('surface-raised') + ';',
    '@define-color view_fg_color          ' + v('text') + ';',
    '@define-color headerbar_bg_color     ' + v('surface') + ';',
    '@define-color headerbar_fg_color     ' + v('text-heading') + ';',
    '@define-color headerbar_border_color ' + v('border') + ';',
    '@define-color sidebar_bg_color       ' + v('bg-subtle') + ';',
    '@define-color sidebar_fg_color       ' + v('text') + ';',
    '@define-color card_bg_color          ' + v('surface-raised') + ';',
    '@define-color popover_bg_color       ' + v('surface-raised') + ';', '');
  L.push('@define-color borders          ' + v('border') + ';',
    '@define-color shade_color      ' + rgba(v('text'), 0.08) + ';', '');
  L.push(GTK_WIDGET_RULES);
  return L.join('\n') + '\n';
};

// Polarity-free widget rules: every colour goes through @define-color or a
// GTK color function (shade/alpha), so the same text serves light and dark.
const GTK_WIDGET_RULES = `/* ────────────────────────────────────
   Typography
   ──────────────────────────────────── */

* {
    -gtk-icon-style: regular;
}

/* ────────────────────────────────────
   Focus — KEYBOARD.md primitive
   ──────────────────────────────────── */

*:focus-visible,
button:focus-visible,
entry:focus-visible,
textview text:focus-visible {
    outline: 2px solid @accent_color;
    outline-offset: 2px;
    outline-style: solid;
    box-shadow: none;
}

/* ────────────────────────────────────
   Selected — the universal language
   ──────────────────────────────────── */

row:selected,
treeview:selected,
list > row:selected,
.navigation-sidebar > row:selected {
    background: alpha(@accent_color, 0.15);
    color: @window_fg_color;
    box-shadow: inset 3px 0 0 @accent_color;
    border-radius: 0;
}

row:selected:focus {
    outline: none;
    box-shadow: inset 3px 0 0 @accent_color;
}

/* ────────────────────────────────────
   Buttons — flatten, warm
   ──────────────────────────────────── */

button {
    border-radius: 4px;
    transition: background 150ms cubic-bezier(0.25, 0.1, 0.25, 1);
}

button.suggested-action,
button.default {
    background: @accent_color;
    color: @accent_fg_color;
    border: 1px solid transparent;
}

button.suggested-action:hover {
    background: shade(@accent_color, 0.92);
}

button.destructive-action {
    background: @destructive_color;
    color: @destructive_fg_color;
}

/* ────────────────────────────────────
   Entry / input
   ──────────────────────────────────── */

entry {
    border-radius: 4px;
    border: 1px solid @borders;
    background: @view_bg_color;
}

entry:focus-within {
    border-color: @accent_color;
    outline: 2px solid @accent_color;
    outline-offset: -1px;
}

/* ────────────────────────────────────
   Links — same as web
   ──────────────────────────────────── */

*:link,
button.link {
    color: @accent_color;
    text-decoration-color: alpha(@accent_color, 0.4);
}

*:link:hover,
button.link:hover {
    color: shade(@accent_color, 0.85);
}

/* ────────────────────────────────────
   Switches / checkbuttons
   ──────────────────────────────────── */

switch:checked {
    background: @accent_color;
}

check:checked,
radio:checked {
    background: @accent_color;
    color: @accent_fg_color;
}

/* ────────────────────────────────────
   Scrollbar
   ──────────────────────────────────── */

scrollbar slider {
    background: alpha(@window_fg_color, 0.25);
    border-radius: 3px;
    min-width: 8px;
    min-height: 8px;
}

scrollbar slider:hover {
    background: alpha(@window_fg_color, 0.45);
}
`;

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
  const slug = `jylhis-${mode}`;
  const Pascal = mode === 'light' ? 'JylhisLight' : 'JylhisDark';
  const label = `${toTheme.meta.name} ${mode === 'light' ? 'Light' : 'Dark'}`;
  return text
    .replaceAll('jylhis-sheet', 'jylhis-light').replaceAll('jylhis-field', 'jylhis-dark')
    .replaceAll('jylhis-survey-light', 'jylhis-light').replaceAll('jylhis-survey-dark', 'jylhis-dark')
    .replaceAll('jylhis-mono-light', 'jylhis-light').replaceAll('jylhis-mono-dark', 'jylhis-dark')
    .replaceAll('JylhisSheet', 'JylhisLight').replaceAll('JylhisField', 'JylhisDark')
    .replaceAll('JylhisSurveyLight', 'JylhisLight').replaceAll('JylhisSurveyDark', 'JylhisDark')
    .replaceAll('JylhisMonoLight', 'JylhisLight').replaceAll('JylhisMonoDark', 'JylhisDark')
    .replaceAll('Jylhis Sheet', label).replaceAll('Jylhis Field', label)
    .replaceAll('Jylhis Survey Light', label).replaceAll('Jylhis Survey Dark', label)
    .replaceAll('Jylhis Mono Light', label).replaceAll('Jylhis Mono Dark', label);
};
export const deriveTarget = (refText, fromTheme, toTheme, mode, priority, bare = false) =>
  renameSlugs(recolor(refText, buildHexMap(fromTheme, toTheme, mode, priority), bare), toTheme, mode);

// Reference file registry: [refLight, refDark, outPattern, priority, bare?]
// Ref paths keep their hand-tuned `sheet`/`field` names; output patterns are
// {m} = light|dark and {P} = JylhisLight|JylhisDark (single theme, no {t}).
// bare=true for targets that quote hex without a leading # (base16, console).
export const TARGETS = [
  ['platforms/_reference/ghostty/jylhis-sheet', 'platforms/_reference/ghostty/jylhis-field', 'platforms/ghostty/jylhis-{m}', 'ui'],
  ['platforms/_reference/rofi/jylhis-sheet.rasi', 'platforms/_reference/rofi/jylhis-field.rasi', 'platforms/rofi/jylhis-{m}.rasi', 'ui'],
  ['platforms/_reference/hyprland/jylhis-sheet.conf', 'platforms/_reference/hyprland/jylhis-field.conf', 'platforms/hyprland/jylhis-{m}.conf', 'ui'],
  ['platforms/_reference/gimp/jylhis-sheet.gpl', 'platforms/_reference/gimp/jylhis-field.gpl', 'platforms/gimp/jylhis-{m}.gpl', 'ui'],
  ['platforms/_reference/base16/jylhis-sheet.yaml', 'platforms/_reference/base16/jylhis-field.yaml', 'platforms/base16/jylhis-{m}.yaml', 'ui', true],
  ['platforms/_reference/console/jylhis-sheet.nix', 'platforms/_reference/console/jylhis-field.nix', 'platforms/console/jylhis-{m}.nix', 'ui', true],
  ['platforms/_reference/kvantum/JylhisSheet.colors', 'platforms/_reference/kvantum/JylhisField.colors', 'platforms/kvantum/{P}.colors', 'ui'],
  ['platforms/_reference/mako/config-sheet', 'platforms/_reference/mako/config', 'platforms/mako/config-{m}', 'ui'],
  ['platforms/_reference/waybar/style-sheet.css', 'platforms/_reference/waybar/style.css', 'platforms/waybar/style-{m}.css', 'ui'],
  ['platforms/_reference/shell/fzf-sheet.sh', 'platforms/_reference/shell/fzf-field.sh', 'platforms/shell/fzf-{m}.sh', 'ui'],
  ['platforms/_reference/bat/jylhis-sheet.tmTheme', 'platforms/_reference/bat/jylhis-field.tmTheme', 'platforms/bat/jylhis-{m}.tmTheme', 'syntax'],
  ['platforms/_reference/emacs/jylhis-sheet-theme.el', 'platforms/_reference/emacs/jylhis-field-theme.el', 'platforms/emacs/jylhis-{m}-theme.el', 'syntax'],
];
export const outPath = (pattern, theme, mode) => {
  const P = mode === 'light' ? 'JylhisLight' : 'JylhisDark';
  return pattern.replaceAll('{m}', mode).replaceAll('{P}', P);
};
