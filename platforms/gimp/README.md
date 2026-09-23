# Jylhis for GIMP / Inkscape / Krita

Two GIMP Palette (`.gpl`) files — the standard format for swatches, shared by GIMP, Inkscape, Krita, Scribus, and most of the Linux raster/vector graphics ecosystem.

```
platforms/gimp/
├── jylhis-light.gpl      ← generated (light)
└── jylhis-dark.gpl       ← generated (dark)
```

Each file ships every role from the system, grouped under thematic comment headers (`# Grounds`, `# Ink`, `# Benchmark`, `# Contour`, `# Hairline`, `# Modus`, `# Signal`, `# Spectrum (ANSI)`).

## Install

### GIMP

```bash
mkdir -p ~/.config/GIMP/2.10/palettes
cp jylhis-light.gpl jylhis-dark.gpl ~/.config/GIMP/2.10/palettes/
```

GIMP picks them up on next launch. Open them via *Windows → Dockable Dialogs → Palettes* and select **Jylhis Light** or **Jylhis Dark**.

### Inkscape

```bash
mkdir -p ~/.config/inkscape/palettes
cp jylhis-light.gpl jylhis-dark.gpl ~/.config/inkscape/palettes/
```

Switch in the swatches strip at the bottom of the canvas.

### Krita

Settings → Manage Resources → Import Resources → pick the `.gpl` file.

## Format

Plain text. Roles are listed as `R G B<TAB>name`, with thematic groups demarcated by `# Section` comment lines. Every consumer that reads `.gpl` ignores the comments, but they're useful when the file is opened in a text editor.

## Contract

Hex values mirror `tokens.core.json` + `themes/jylhis.json`. To regenerate
after a token change, run:

```bash
bun scripts/generate.mjs
```

Both files are derived from the hand-tuned reference palettes in
[`../_reference/gimp/`](../_reference/gimp/) by role-mapped recoloring
(`scripts/lib/emit.mjs`, `TARGETS`).
